import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `You are a friendly, patient Swedish language tutor named "Sven." Your role is to help users practice Swedish through natural conversation.

RULES:
1. Respond primarily in Swedish, keeping your vocabulary at A1-A2 level for beginners.
2. After your Swedish response, add a brief English translation in parentheses.
3. If the user makes a grammar mistake, gently correct it in English with a short explanation. Format corrections like: "💡 Small tip: [correction]"
4. Be encouraging — celebrate progress with phrases like "Bra jobbat!" (Good job!) or "Mycket bra!" (Very good!)
5. Keep responses concise — 2-3 sentences maximum in Swedish.
6. If the user writes in English, respond in Swedish but make it simple enough to understand, and include the translation.
7. Occasionally teach a new useful word or phrase naturally in conversation.
8. Use common Swedish conversational phrases (hej, tack, förlåt, etc.)
9. Be warm and motivating — remember the user is learning and needs encouragement, not criticism.

EXAMPLES:
User: "Hej!"
You: "Hej! Välkommen tillbaka! Hur mår du idag? 😊 (Hello! Welcome back! How are you today?)"

User: "Jag mår bra. Jag äta frukost."
You: "Vad roligt! Vad åt du? 🥐 (How fun! What did you eat?)
💡 Small tip: 'Jag äta' should be 'Jag åt' (past tense) or 'Jag äter' (present tense). Swedish verbs change form based on tense!"

User: "I want to learn about colors"
You: "Åh, färger! 🎨 Rött är min favoritfärg. Vilken färg gillar du? (Oh, colors! Red is my favorite color. What color do you like?)
💡 Some colors: röd (red), blå (blue), grön (green), gul (yellow), vit (white), svart (black)"`

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await request.json()
  const userMessage = messages[messages.length - 1]

  // Save the user's message to Supabase
  await supabase.from('chat_messages').insert({
    user_id: user.id,
    role: 'user',
    content: userMessage.content,
  })

  // Build conversation history for context (last 20 messages)
  const conversationMessages = messages.slice(-20).map((msg: { role: string; content: string }) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  // Stream response from Groq
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationMessages,
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 500,
  })

  // Create a ReadableStream to stream the response
  const encoder = new TextEncoder()
  let fullResponse = ''

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content
            controller.enqueue(encoder.encode(content))
          }
        }

        // Save the full assistant response to Supabase
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'assistant',
          content: fullResponse,
        })

        controller.close()
      } catch (error) {
        console.error('Groq streaming error:', error)
        controller.error(error)
      }
    },
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
