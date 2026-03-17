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

    // Fetch lesson title for better categorization
    const { data: lessonData } = await supabase
      .from('lessons')
      .select('title')
      .eq('id', lessonId)
      .single()
    
    const categoryName = lessonData?.title ? `Lesson: ${lessonData.title}` : `Lesson: ${lessonId}`

    const vocabToInsert = flashcards
      .map(fv => ({
        swedish: fv.swedish.toLowerCase().trim(),
        english: fv.english.toLowerCase().trim(),
        example_sv: fv.example_sv,
        example_en: fv.example_en,
        category: categoryName,
        level: lessonLevel || 'A1',
        user_id: session.user.id
      }))
      // Deduplicate by swedish word (LLM can return the same word twice)
      .filter((v, i, arr) => arr.findIndex(a => a.swedish === v.swedish) === i)

    // Check which words already exist for this user
    const swedishWords = vocabToInsert.map(v => v.swedish)
    const { data: existingVocab, error: existingError } = await supabase
      .from('vocabulary')
      .select('id, swedish')
      .eq('user_id', session.user.id)
      .in('swedish', swedishWords)

    if (existingError) {
      console.error('[Flashcards] Error checking existing vocab:', existingError)
      return NextResponse.json({ error: 'Database error while checking existing vocabulary' }, { status: 500 })
    }

    const existingWords = new Set((existingVocab || []).map((v: { swedish: string }) => v.swedish))
    const newVocab = vocabToInsert.filter(v => !existingWords.has(v.swedish))

    // Collect IDs of already-existing words
    let allVocabIds: string[] = (existingVocab || []).map((v: { id: string }) => v.id)

    // Insert only genuinely new words
    if (newVocab.length > 0) {
      const { data: insertedVocab, error: vocabError } = await supabase
        .from('vocabulary')
        .insert(newVocab)
        .select('id, swedish')

      if (vocabError) {
        console.error('[Flashcards] Vocab Insert Error:', vocabError)
        console.error('[Flashcards] Attempted to insert:', JSON.stringify(newVocab.map(v => v.swedish)))
        return NextResponse.json({ error: 'Database error while saving vocabulary' }, { status: 500 })
      }

      allVocabIds = [...allVocabIds, ...(insertedVocab || []).map((v: { id: string }) => v.id)]
    }

    // 4. Link to User Progress
    if (allVocabIds.length === 0) {
      return NextResponse.json({ message: 'Flashcards already exist.', success: true, count: 0 }, { status: 200 })
    }

    const progressToInsert = allVocabIds.map(vocabId => ({
      user_id: session.user.id,
      vocab_id: vocabId,
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0
    }))

    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert(progressToInsert, { onConflict: 'user_id, vocab_id', ignoreDuplicates: true })

    if (progressError) {
       console.error('[Flashcards] Progress Insert Error:', progressError)
       return NextResponse.json({ error: 'Failed to add flashcards to your deck' }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: newVocab.length })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('API Route Error:', errMsg, error)
    return NextResponse.json({ error: `Internal server error: ${errMsg}` }, { status: 500 })
  }
}
