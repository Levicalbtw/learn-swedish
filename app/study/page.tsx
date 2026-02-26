import { getCardsForReview, getDueCategories } from './actions'
import StudySession from '@/app/components/StudySession'
import Link from 'next/link'

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category || 'All'
  
  const [cards, categories] = await Promise.all([
    getCardsForReview(category),
    getDueCategories()
  ])

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-center gap-3">
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

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/study"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  category === 'All'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface border border-slate-200 dark:border-slate-800 text-muted hover:border-primary/30'
                }`}
              >
                All
              </Link>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat}
                  href={`/study?category=${encodeURIComponent(cat)}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all truncate max-w-[120px] ${
                    category === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface border border-slate-200 dark:border-slate-800 text-muted hover:border-primary/30'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Study session */}
      <div className="animate-fade-in-up animation-delay-100">
        <StudySession cards={cards} />
      </div>
    </div>
  )
}
