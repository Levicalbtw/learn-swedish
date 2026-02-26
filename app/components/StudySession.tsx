'use client'

import { useState, useCallback } from 'react'
import Flashcard from './Flashcard'
import { rateCard } from '@/app/study/actions'
import type { VocabCard } from '@/app/study/actions'
import Link from 'next/link'

interface StudySessionProps {
  cards: VocabCard[]
}

export default function StudySession({ cards }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [easyCount, setEasyCount] = useState(0)
  const [hardCount, setHardCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isRating, setIsRating] = useState(false)

  const currentCard = cards[currentIndex]

  const handleRate = useCallback(async (rating: 'easy' | 'hard') => {
    if (isRating) return
    setIsRating(true)

    // Update stats
    if (rating === 'easy') {
      setEasyCount(prev => prev + 1)
    } else {
      setHardCount(prev => prev + 1)
    }

    // Update the card in Supabase
    await rateCard(currentCard.id, rating)

    // Move to next card or finish
    if (currentIndex + 1 >= cards.length) {
      setIsComplete(true)
    } else {
      setCurrentIndex(prev => prev + 1)
    }

    setIsRating(false)
  }, [currentIndex, cards.length, currentCard?.id, isRating])

  // Session complete — show summary
  if (isComplete) {
    const total = easyCount + hardCount
    const percentage = total > 0 ? Math.round((easyCount / total) * 100) : 0

    return (
      <div className="animate-fade-in-up text-center py-12 max-w-md mx-auto">
        {/* Celebration */}
        <div className="text-6xl mb-6">
          {percentage >= 80 ? '🎉' : percentage >= 50 ? '💪' : '📚'}
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">
          Session Complete!
        </h2>
        <p className="text-muted mb-8">
          {percentage >= 80
            ? 'Amazing work! You really know these words.'
            : percentage >= 50
            ? 'Good effort! Keep practicing and you\'ll master them.'
            : 'Don\'t worry, repetition is the key to learning!'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-2xl font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted mt-1">Cards reviewed</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-900/30 shadow-sm">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{easyCount}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Easy</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-900/30 shadow-sm">
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{hardCount}</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-1">Hard</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-surface-hover rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-muted mb-8">{percentage}% correct</p>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-foreground
                       font-medium hover:bg-surface-hover transition-colors text-center shadow-sm"
          >
            Dashboard
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-white
                       font-medium hover:bg-primary/90 transition-colors"
          >
            Study Again
          </button>
        </div>
      </div>
    )
  }

  // No cards available
  if (!currentCard) {
    return (
      <div className="animate-fade-in-up text-center py-20">
        <div className="text-5xl mb-6">✨</div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          All caught up!
        </h2>
        <p className="text-muted mb-8 max-w-sm mx-auto">
          No cards due for review right now. Come back later to keep your streak going!
        </p>
        <Link
          href="/"
          className="inline-flex py-3 px-6 rounded-xl bg-primary text-white
                     font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <Flashcard
      swedish={currentCard.swedish}
      english={currentCard.english}
      exampleSv={currentCard.example_sv}
      exampleEn={currentCard.example_en}
      category={currentCard.category}
      onRate={handleRate}
      currentIndex={currentIndex}
      totalCards={cards.length}
    />
  )
}
