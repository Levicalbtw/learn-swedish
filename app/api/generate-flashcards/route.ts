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

    const prompt = `You are a Swedish language teacher. I will give you the markdown content of a Swedish lesson.
Extract exactly 10 of the most important Swedish vocabulary words or short phrases taught in this lesson.
For each word, provide:
1. The Swedish word ("swedish")
2. The English translation ("english")
3. A short, simple Swedish example sentence ("example_sv")
4. The English translation of the example sentence ("example_en")

Respond ONLY with a valid stringified JSON array of these 10 objects. Do not include markdown formatting like \`\`\`json. Just the raw array.

Lesson content:
${lessonContent}`

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" } // Enforce JSON if supported by Groq, otherwise temp 0.1 helps
      })
    })

    if (!groqResponse.ok) {
      console.error('Groq Error:', await groqResponse.text())
      return NextResponse.json({ error: 'Failed to generate flashcards from AI' }, { status: 502 })
    }

    const groqData = await groqResponse.json()
    let flashcardsText = groqData.choices[0].message.content
    
    // Parse the JSON array. (Sometimes models wrap in { "flashcards": [] }, so handle both)
    let flashcards: Flashcard[] = []
    try {
      const parsed = JSON.parse(flashcardsText)
      if (Array.isArray(parsed)) {
        flashcards = parsed
      } else if (parsed.flashcards && Array.isArray(parsed.flashcards)) {
        flashcards = parsed.flashcards
      } else {
        const keys = Object.keys(parsed)
        if (keys.length > 0 && Array.isArray(parsed[keys[0]])) {
           flashcards = parsed[keys[0]]
        } else {
             throw new Error("Could not find array in JSON")
        }
      }
    } catch (e) {
      console.error('Failed to parse AI output:', flashcardsText)
      return NextResponse.json({ error: 'AI returned invalid format' }, { status: 500 })
    }

    // Slice to ensure exactly 10 (or whatever it gave us up to 10)
    flashcards = flashcards.slice(0, 10)

    if (flashcards.length === 0) {
      return NextResponse.json({ error: 'No flashcards were generated.' }, { status: 500 })
    }

    // 3. Database Insertion (Admin privilege required to insert into vocabulary and guarantee ON CONFLICT DO NOTHING works without RLS blocking reads)
    // Actually, vocabulary RLS is "readable by all", but let's see if authenticated can INSERT. 
    // Looking at 001_vocabulary_setup.sql, there is NO policy for INSERT on vocabulary. 
    // We MUST use the service role key to insert global vocabulary, or bypass RLS.
    // Let's use the service_role key to insert into the global vocabulary bank safely.
    
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // fallback to anon if service key missing locally, but it might fail RLS
    )

    const vocabToInsert = flashcards.map(fv => ({
      swedish: fv.swedish.toLowerCase(),
      english: fv.english.toLowerCase(),
      example_sv: fv.example_sv,
      example_en: fv.example_en,
      category: `Lesson: ${lessonId}`,
      level: lessonLevel || 'A1'
    }))

    // Upsert vocabulary by swedish word
    const { data: insertedVocab, error: vocabError } = await supabaseAdmin
      .from('vocabulary')
      .upsert(vocabToInsert, { onConflict: 'swedish', ignoreDuplicates: false })
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
