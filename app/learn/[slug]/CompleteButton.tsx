'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleLessonComplete } from '../actions'

export default function CompleteButton({
  lessonId,
  initialCompleted,
}: {
  lessonId: string
  initialCompleted: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [completed, setCompleted] = useState(initialCompleted)
  const router = useRouter()

  const handleToggle = async () => {
    startTransition(async () => {
      // Optimistic update
      setCompleted(!completed)
      
      const res = await toggleLessonComplete(lessonId)
      if (res && res.error) {
        // Revert on error
        setCompleted(completed)
        console.error(res.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
        ${completed
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
          : 'bg-primary text-white hover:bg-primary/90'
        }
        ${isPending ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {completed ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </>
      ) : (
        <>
          <div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center" />
          Mark as Complete
        </>
      )}
    </button>
  )
}
