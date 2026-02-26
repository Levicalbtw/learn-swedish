'use server'

import { createClient } from '@/lib/supabase/server'

export interface ProgressStats {
  totalWords: number
  wordsLearned: number   // reviewed at least once
  cardsDueToday: number
  totalReviews: number
  categories: CategoryProgress[]
}

export interface CategoryProgress {
  category: string
  total: number
  learned: number        // reviewed at least once with repetitions > 0
}

export async function getProgressStats(): Promise<ProgressStats> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { totalWords: 0, wordsLearned: 0, cardsDueToday: 0, totalReviews: 0, categories: [] }
  }

  // Get all user progress with vocabulary info
  const { data: progress } = await supabase
    .from('user_progress')
    .select(`
      vocab_id,
      ease_factor,
      interval,
      repetitions,
      next_review,
      last_reviewed,
      vocabulary (
        category
      )
    `)
    .eq('user_id', user.id)

  if (!progress) {
    return { totalWords: 0, wordsLearned: 0, cardsDueToday: 0, totalReviews: 0, categories: [] }
  }

  const now = new Date()

  const totalWords = progress.length
  const wordsLearned = progress.filter(p => p.repetitions > 0).length
  const cardsDueToday = progress.filter(p => new Date(p.next_review) <= now).length
  const totalReviews = progress.filter(p => p.last_reviewed !== null).length

  // Category breakdown
  const categoryMap = new Map<string, { total: number; learned: number }>()
  for (const p of progress) {
    const vocabData = p.vocabulary as unknown
    const vocab = Array.isArray(vocabData) ? vocabData[0] : vocabData
    const category = (vocab as { category?: string })?.category || 'unknown'
    const existing = categoryMap.get(category) || { total: 0, learned: 0 }
    existing.total += 1
    if (p.repetitions > 0) existing.learned += 1
    categoryMap.set(category, existing)
  }

  const categories: CategoryProgress[] = Array.from(categoryMap.entries())
    .map(([category, { total, learned }]) => ({ category, total, learned }))
    .sort((a, b) => b.total - a.total)

  return { totalWords, wordsLearned, cardsDueToday, totalReviews, categories }
}
