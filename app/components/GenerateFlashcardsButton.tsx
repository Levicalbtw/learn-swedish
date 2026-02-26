'use client'

import { useState } from 'react'

interface GenerateFlashcardsButtonProps {
  lessonId: string
  lessonContent: string
  lessonLevel: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function GenerateFlashcardsButton({ 
  lessonId, 
  lessonContent, 
  lessonLevel 
}: GenerateFlashcardsButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [cardCount, setCardCount] = useState(0)

  const handleGenerate = async () => {
    if (status === 'loading') return
    
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, lessonContent, lessonLevel })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to generate flashcards')
      }

      setCardCount(data.count || 0)
      setStatus('success')
      
      // Reset back to idle after 3 seconds so they don't get stuck on success if they want to do it again
      setTimeout(() => setStatus('idle'), 4000)

    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'An error occurred')
      setStatus('error')
      
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleGenerate}
        disabled={status === 'loading'}
        className={`
          group relative flex items-center justify-center gap-2 px-6 py-3
          font-semibold text-white rounded-xl shadow-lg
          transition-all duration-300 transform active:scale-95
          disabled:opacity-80 disabled:cursor-not-allowed
          ${status === 'idle' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5' : ''}
          ${status === 'loading' ? 'bg-slate-600' : ''}
          ${status === 'success' ? 'bg-emerald-500' : ''}
          ${status === 'error' ? 'bg-red-500' : ''}
        `}
      >
        {status === 'idle' && (
          <>
            <span className="text-xl">✨</span>
            Extract Flashcards 
          </>
        )}
        
        {status === 'loading' && (
          <>
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Studying lesson...
          </>
        )}
        
        {status === 'success' && (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Added {cardCount} Cards to Study Room!
          </>
        )}

        {status === 'error' && (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Failed
          </>
        )}

        {/* Shine effect for idle state */}
        {status === 'idle' && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
        )}
      </button>

      {/* Error Message */}
      {status === 'error' && (
        <p className="text-sm text-red-500 font-medium animate-fade-in-up">
          {errorMessage}
        </p>
      )}
      
      {/* Vibe description */}
      {status === 'idle' && (
        <p className="text-xs text-muted font-medium">
          Uses AI to automatically build your SRS deck
        </p>
      )}
    </div>
  )
}
