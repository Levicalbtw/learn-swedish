'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateSRS, QUALITY_EASY, QUALITY_HARD } from '@/lib/srs'

export interface VocabCard {
  id: string
  vocab_id: string
  swedish: string
  english: string
  example_sv: string | null
  example_en: string | null
  category: string
  level: string
  ease_factor: number
  interval: number
  repetitions: number
}

/**
 * Get all cards due for review (next_review <= now).
 * Also initializes progress entries for any new vocabulary words.
 */
export async function getCardsForReview(): Promise<VocabCard[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // First, ensure user has progress entries for all vocab words
  await initializeUserCards(user.id)

  // Fetch cards that are due for review
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      id,
      vocab_id,
      ease_factor,
      interval,
      repetitions,
      vocabulary (
        id,
        swedish,
        english,
        example_sv,
        example_en,
        category,
        level
      )
    `)
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())
    .order('next_review', { ascending: true })
    .limit(20)

  if (error || !data) {
    console.error('Error fetching cards:', error)
    return []
  }

  return data.map((row: Record<string, unknown>) => {
    const vocab = row.vocabulary as Record<string, unknown>
    return {
      id: row.id as string,
      vocab_id: row.vocab_id as string,
      swedish: vocab.swedish as string,
      english: vocab.english as string,
      example_sv: (vocab.example_sv as string) || null,
      example_en: (vocab.example_en as string) || null,
      category: vocab.category as string,
      level: vocab.level as string,
      ease_factor: row.ease_factor as number,
      interval: row.interval as number,
      repetitions: row.repetitions as number,
    }
  })
}

/**
 * Initialize progress entries for vocabulary words the user hasn't seen yet.
 */
async function initializeUserCards(userId: string) {
  const supabase = await createClient()

  // Get all vocab IDs the user already has progress for
  const { data: existing } = await supabase
    .from('user_progress')
    .select('vocab_id')
    .eq('user_id', userId)

  const existingIds = new Set((existing || []).map((e: { vocab_id: string }) => e.vocab_id))

  // Get all vocabulary levels A1-B2
  const { data: allVocab } = await supabase
    .from('vocabulary')
    .select('id')
    .in('level', ['A1', 'A2', 'B1', 'B2'])

  if (!allVocab) return

  // Find new words that need progress entries
  const newEntries = allVocab
    .filter((v: { id: string }) => !existingIds.has(v.id))
    .map((v: { id: string }) => ({
      user_id: userId,
      vocab_id: v.id,
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      next_review: new Date().toISOString(),
    }))

  if (newEntries.length > 0) {
    await supabase.from('user_progress').insert(newEntries)
  }
}

/**
 * Rate a card and update its SRS schedule.
 */
export async function rateCard(progressId: string, quality: 'easy' | 'hard') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Get current card state
  const { data: current } = await supabase
    .from('user_progress')
    .select('ease_factor, interval, repetitions')
    .eq('id', progressId)
    .eq('user_id', user.id)
    .single()

  if (!current) return { error: 'Card not found' }

  // Calculate new SRS values
  const qualityValue = quality === 'easy' ? QUALITY_EASY : QUALITY_HARD
  const result = calculateSRS(
    {
      ease_factor: current.ease_factor,
      interval: current.interval,
      repetitions: current.repetitions,
    },
    qualityValue
  )

  // Update the database
  const { error } = await supabase
    .from('user_progress')
    .update({
      ease_factor: result.ease_factor,
      interval: result.interval,
      repetitions: result.repetitions,
      next_review: result.next_review.toISOString(),
      last_reviewed: new Date().toISOString(),
    })
    .eq('id', progressId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error rating card:', error)
    return { error: 'Failed to update card' }
  }

  return { success: true }
}
