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
export async function getCardsForReview(category?: string): Promise<VocabCard[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // First, ensure user has progress entries for all vocab words
  await initializeUserCards(user.id)

  // Fetch cards that are due for review
  let query = supabase
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

  // Apply category filter if provided
  if (category && category !== 'All') {
    // We need to filter by the vocabulary table's category
    // In Supabase JS, for nested filters we can use dot notation if the join is simple
    query = query.filter('vocabulary.category', 'eq', category)
  }

  const { data, error } = await query.limit(20)

  if (error || !data) {
    console.error('Error fetching cards:', error)
    return []
  }

  // Filter out any rows where the vocabulary filter might have returned null (if filter didn't apply correctly at DB level)
  return data
    .filter((row: any) => row.vocabulary !== null)
    .map((row: any) => {
      const vocab = row.vocabulary as any
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
 * Get all unique categories for the user's due cards
 */
export async function getDueCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('user_progress')
    .select('vocabulary(category)')
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())

  if (!data) return []

  const categories = new Set((data as any[])
    .map(row => row.vocabulary?.category)
    .filter(Boolean)
  )

  return Array.from(categories) as string[]
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

  // Get all vocabulary levels A1-B2 - ALSO INCLUDE USER-SPECIFIC VOCAB
  const { data: allVocab } = await supabase
    .from('vocabulary')
    .select('id')
    .or(`user_id.is.null,user_id.eq.${userId}`)
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
 * Update the user's streak and activity stats
 */
export async function updateUserStreak() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const today = new Date().toISOString().split('T')[0]

  // Get current stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!stats) {
    // First time studying
    await supabase.from('user_stats').insert({
      user_id: user.id,
      streak_count: 1,
      last_activity_date: today,
      total_reviews: 1
    })
  } else {
    const lastDate = stats.last_activity_date
    
    if (lastDate === today) {
      // Already studied today, just increment total
      await supabase.from('user_stats')
        .update({ total_reviews: stats.total_reviews + 1 })
        .eq('user_id', user.id)
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let newStreak = 1
      if (lastDate === yesterdayStr) {
        newStreak = stats.streak_count + 1
      }

      await supabase.from('user_stats')
        .update({
          streak_count: newStreak,
          last_activity_date: today,
          total_reviews: stats.total_reviews + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
    }
  }
}

/**
 * Get user stats for the dashboard
 */
export async function getUserStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  return data
}

/**
 * Get the total number of words the user has started learning
 */
export async function getWordsLearnedCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gt('repetitions', 0)

  return count || 0
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

  // Update streak on every card rated (logic inside handles once per day)
  await updateUserStreak()

  return { success: true }
}
