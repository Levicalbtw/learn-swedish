'use server'

import { createClient } from '@/lib/supabase/server'

export interface Lesson {
  id: string
  slug: string
  title: string
  description: string
  level: string
  lesson_order: number
  completed: boolean
}

export interface LessonDetail extends Lesson {
  content: string
}

export async function getLessons(): Promise<Lesson[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, slug, title, description, level, lesson_order')
    .order('lesson_order', { ascending: true })

  if (!lessons) return []

  // Get completed lessons for this user
  let completedIds = new Set<string>()
  if (user) {
    const { data: completed } = await supabase
      .from('user_lessons')
      .select('lesson_id')
      .eq('user_id', user.id)

    if (completed) {
      completedIds = new Set(completed.map((c: { lesson_id: string }) => c.lesson_id))
    }
  }

  return lessons.map((lesson: { id: string; slug: string; title: string; description: string; level: string; lesson_order: number }) => ({
    ...lesson,
    completed: completedIds.has(lesson.id),
  }))
}

export async function getLessonBySlug(slug: string): Promise<LessonDetail | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!lesson) return null

  let completed = false
  if (user) {
    const { data } = await supabase
      .from('user_lessons')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .single()

    completed = !!data
  }

  return { ...lesson, completed }
}

export async function toggleLessonComplete(lessonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Check if already completed
  const { data: existing } = await supabase
    .from('user_lessons')
    .select('id')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single()

  if (existing) {
    // Remove completion
    await supabase
      .from('user_lessons')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    return { completed: false }
  } else {
    // Mark complete
    await supabase
      .from('user_lessons')
      .insert({ user_id: user.id, lesson_id: lessonId })

    return { completed: true }
  }
}
