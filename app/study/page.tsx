import { getCardsForReview, getAllUserCategories } from './actions'
import StudySession from '@/app/components/StudySession'
import CategorySelector from '@/app/components/CategorySelector'

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const activeCategory = resolvedSearchParams.category || 'All'
  
  // Fetch cards first (this triggers initializeUserCards)
  const cards = await getCardsForReview(activeCategory)
  
  // Then fetch categories so they reflect the newly initialized cards
  const allCategories = await getAllUserCategories()

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in-up mb-8 relative z-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary-light rounded-xl p-2.5">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Study</h1>
              <p className="text-sm text-muted">
                {activeCategory === 'All' 
                  ? `${cards.length} card${cards.length === 1 ? '' : 's'} due for review`
                  : `Reviewing ${activeCategory} (${cards.length} card${cards.length === 1 ? '' : 's'})`
                }
              </p>
            </div>
          </div>

          {/* Compact Category Selector */}
          <CategorySelector 
            categories={allCategories} 
            activeCategory={activeCategory} 
          />
        </div>
      </div>

      {/* Study session */}
      <div className="animate-fade-in-up animation-delay-100">
        <StudySession cards={cards} />
      </div>
    </div>
  )
}
