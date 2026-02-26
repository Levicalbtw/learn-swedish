import Link from 'next/link'
import { getLessons } from './actions'

export default async function LearnPage() {
  const lessons = await getLessons()
  const completedCount = lessons.filter(l => l.completed).length

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
            <h1 className="text-2xl font-bold text-foreground">Learn Swedish</h1>
            <p className="text-sm text-muted">
              {completedCount}/{lessons.length} lessons completed — Level A1
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full h-2 bg-surface-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Lesson cards */}
      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.slug}`}
            className="animate-fade-in-up block group"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`
              flex items-center gap-4 p-5 rounded-xl border transition-all duration-200
              ${lesson.completed
                ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                : 'bg-surface border-black/5 hover:border-primary/30 hover:shadow-sm'
              }
            `}>
              {/* Lesson number / checkmark */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                font-bold text-sm
                ${lesson.completed
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary-light text-primary'
                }
              `}>
                {lesson.completed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  lesson.lesson_order
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-sm text-muted mt-0.5 truncate">
                  {lesson.description}
                </p>
              </div>

              {/* Arrow */}
              <svg className="w-5 h-5 text-muted group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-muted">No lessons available yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
