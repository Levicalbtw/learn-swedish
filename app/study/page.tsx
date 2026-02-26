import { getCardsForReview } from './actions'
import StudySession from '@/app/components/StudySession'

export default async function StudyPage() {
  const cards = await getCardsForReview()

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-light rounded-xl p-2.5">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Study</h1>
            <p className="text-sm text-muted">
              {cards.length > 0
                ? `${cards.length} card${cards.length === 1 ? '' : 's'} due for review`
                : 'No cards due right now'}
            </p>
          </div>
        </div>
      </div>

      {/* Study session */}
      <div className="animate-fade-in-up animation-delay-100 opacity-0">
        <StudySession cards={cards} />
      </div>
    </div>
  )
}
