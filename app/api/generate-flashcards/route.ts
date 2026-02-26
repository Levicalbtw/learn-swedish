import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface Flashcard {
  swedish: string
  english: string
  example_sv: string
  example_en: string
}

export async function POST(request: Request) {
  try {
    const { lessonContent, lessonId, lessonLevel } = await request.json()

    if (!lessonContent || !lessonId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Authenticate user
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Call Groq LLM
    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      return NextResponse.json({ error: 'Server misconfiguration: Missing LLM token' }, { status: 500 })
    }

    // Prompt Shielding: Sanitize and truncate input
    const sanitizedContent = lessonContent.slice(0, 3000).replace(/<script/gi, '')

    const prompt = `### INSTRUCTION ###
You are a Swedish language teacher. 
Extract exactly 10 of the most important Swedish vocabulary words or short phrases taught in the lesson content provided below.
For each word, provide:
1. The Swedish word ("swedish")
2. The English translation ("english")
3. A short, simple Swedish example sentence ("example_sv")
4. The English translation of the example sentence ("example_en")

Respond ONLY with a valid JSON object. It must contain a single key "flashcards" which is an array of these 10 objects.

### LESSON CONTENT ###
${sanitizedContent}
### END LESSON CONTENT ###`

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    })

    if (!groqResponse.ok) {
      console.error('Groq Error:', await groqResponse.text())
      return NextResponse.json({ error: 'Failed to generate flashcards from AI' }, { status: 502 })
    }

    const groqData = await groqResponse.json()
    let flashcardsText = groqData.choices[0].message.content
    
    // Parse the JSON array.
    let flashcards: Flashcard[] = []
    try {
      const parsed = JSON.parse(flashcardsText)
      flashcards = parsed.flashcards || parsed
    } catch (e) {
      console.error('Failed to parse AI output:', flashcardsText)
      return NextResponse.json({ error: 'AI returned invalid format' }, { status: 500 })
    }

    flashcards = Array.isArray(flashcards) ? flashcards.slice(0, 10) : []

    if (flashcards.length === 0) {
      return NextResponse.json({ error: 'No flashcards were generated.' }, { status: 500 })
    }

    // 3. SECURE WRITE: Use Admin Client to bypass RLS for private storage
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    // Fetch lesson title for better categorization
    const { data: lessonData } = await supabase
      .from('lessons')
      .select('title')
      .eq('id', lessonId)
      .single()
    
    const categoryName = lessonData?.title ? `Lesson: ${lessonData.title}` : `Lesson: ${lessonId}`

    const vocabToInsert = flashcards.map(fv => ({
      swedish: fv.swedish.toLowerCase(),
      english: fv.english.toLowerCase(),
      example_sv: fv.example_sv,
      example_en: fv.example_en,
      category: categoryName,
      level: lessonLevel || 'A1',
      user_id: session.user.id // TAG WITH USER ID FOR PRIVACY
    }))

    // Upsert vocabulary - scoped to user_id (via migration indexes)
    const { data: insertedVocab, error: vocabError } = await adminSupabase
      .from('vocabulary')
      .upsert(vocabToInsert, { onConflict: 'swedish,user_id', ignoreDuplicates: false })
      .select('id, swedish')

    if (vocabError) {
      console.error('Vocab Insert Error:', vocabError)
      return NextResponse.json({ error: 'Database error while saving vocabulary' }, { status: 500 })
    }

    // 4. Link to User Progress
    // We need to map the returned UUIDs to the user_progress table
    if (!insertedVocab || insertedVocab.length === 0) {
      return NextResponse.json({ message: 'Flashcards already exist.' }, { status: 200 })
    }

    const progressToInsert = insertedVocab.map((v: { id: string }) => ({
      user_id: session.user.id,
      vocab_id: v.id,
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0
    }))

    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert(progressToInsert, { onConflict: 'user_id, vocab_id', ignoreDuplicates: true })

    if (progressError) {
       console.error('Progress Insert Error:', progressError)
       return NextResponse.json({ error: 'Failed to add flashcards to your deck' }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: progressToInsert.length })

  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
