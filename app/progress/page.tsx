import { getProgressStats } from './actions'

export default async function ProgressPage() {
  const stats = await getProgressStats()
  const percentage = stats.totalWords > 0
    ? Math.round((stats.wordsLearned / stats.totalWords) * 100)
    : 0

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-accent-light rounded-xl p-2.5">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress</h1>
            <p className="text-sm text-muted">Track your Swedish learning journey</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="animate-fade-in-up grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-3xl font-bold text-foreground">{stats.totalWords}</p>
          <p className="text-xs text-muted mt-1">Total words</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-900/30 shadow-sm">
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{stats.wordsLearned}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Words learned</p>
        </div>
        <div className="bg-primary-light rounded-xl p-5 border border-primary/20 dark:border-primary/10 shadow-sm">
          <p className="text-3xl font-bold text-primary">{stats.cardsDueToday}</p>
          <p className="text-xs text-primary/70 mt-1">Due today</p>
        </div>
        <div className="bg-accent-light rounded-xl p-5 border border-accent/20 dark:border-accent/10 shadow-sm">
          <p className="text-3xl font-bold text-accent">{stats.totalReviews}</p>
          <p className="text-xs text-accent/70 mt-1">Total reviews</p>
        </div>
      </div>

      {/* Overall progress ring */}
      <div className="animate-fade-in-up bg-surface rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-4">Overall Vocabulary Progress</h2>
        <div className="flex items-center gap-6">
          {/* Simple progress circle */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-hover"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{percentage}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-foreground">
              <span className="font-semibold">{stats.wordsLearned}</span> of{' '}
              <span className="font-semibold">{stats.totalWords}</span> words reviewed
            </p>
            <p className="text-xs text-muted mt-1">
              {percentage >= 80
                ? 'Fantastiskt! You\'re almost there! 🌟'
                : percentage >= 50
                ? 'Bra jobbat! Keep up the great work! 💪'
                : percentage >= 20
                ? 'Good start! Consistency is key. 📚'
                : 'Start studying to see your progress grow! 🚀'}
            </p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {stats.categories.length > 0 && (
        <div className="animate-fade-in-up bg-surface rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Progress by Category</h2>
          <div className="space-y-4">
            {stats.categories.map((cat) => {
              const catPercent = cat.total > 0 ? Math.round((cat.learned / cat.total) * 100) : 0
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground capitalize">{cat.category}</span>
                    <span className="text-xs text-muted">{cat.learned}/{cat.total}</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {stats.totalWords === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-muted">Start studying to see your progress here!</p>
        </div>
      )}
    </div>
  )
}
