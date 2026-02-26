'use client'

import { useState } from 'react'

interface FlashcardProps {
  swedish: string
  english: string
  exampleSv: string | null
  exampleEn: string | null
  category: string
  onRate: (rating: 'easy' | 'hard') => void
  currentIndex: number
  totalCards: number
}

export default function Flashcard({
  swedish,
  english,
  exampleSv,
  exampleEn,
  category,
  onRate,
  currentIndex,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true)
  }

  const handleRate = (rating: 'easy' | 'hard') => {
    setIsFlipped(false)
    // Small delay so the flip-back animation starts before the next card loads
    setTimeout(() => onRate(rating), 200)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-sm text-muted">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <span className="text-xs font-medium text-muted bg-surface px-2.5 py-1 rounded-full border border-black/5">
          {category}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-surface-hover rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Card container with 3D flip */}
      <div
        className="perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`
            relative w-full transition-transform duration-500
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.5s ease',
          }}
        >
          {/* Front of card */}
          <div
            className="w-full bg-surface rounded-2xl border border-black/5 p-8 md:p-12 shadow-sm"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center min-h-[200px] flex flex-col items-center justify-center">
              <p className="text-sm text-muted mb-4 uppercase tracking-wider">Swedish</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {swedish}
              </h2>
              <p className="text-sm text-muted mt-auto">
                Tap to reveal answer →
              </p>
            </div>
          </div>

          {/* Back of card */}
          <div
            className="w-full bg-surface rounded-2xl border border-black/5 p-8 md:p-12 shadow-sm absolute top-0 left-0"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center min-h-[200px] flex flex-col items-center justify-center">
              <p className="text-sm text-muted mb-4 uppercase tracking-wider">English</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                {english}
              </h2>

              {/* Example sentence */}
              {exampleSv && (
                <div className="mt-2 space-y-1">
                  <p className="text-base text-foreground italic">&ldquo;{exampleSv}&rdquo;</p>
                  {exampleEn && (
                    <p className="text-sm text-muted">{exampleEn}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons — only visible when flipped */}
      <div
        className={`
          mt-6 flex gap-4 transition-all duration-300
          ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <button
          onClick={() => handleRate('hard')}
          className="flex-1 py-4 px-6 rounded-xl bg-red-50 border border-red-200 text-red-700
                     font-medium hover:bg-red-100 transition-colors duration-150
                     flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Hard
        </button>
        <button
          onClick={() => handleRate('easy')}
          className="flex-1 py-4 px-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700
                     font-medium hover:bg-emerald-100 transition-colors duration-150
                     flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Easy
        </button>
      </div>
    </div>
  )
}
