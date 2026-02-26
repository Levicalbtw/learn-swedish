'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40
        ${isDark ? 'bg-indigo-600' : 'bg-slate-200'}
      `}
      aria-label="Toggle theme"
    >
      {/* The Sliding Circle */}
      <div
        className={`
          absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center
          ${isDark ? 'translate-x-5' : 'translate-x-0'}
        `}
      >
        {isDark ? (
           <svg className="w-2.5 h-2.5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
           </svg>
        ) : (
           <svg className="w-2.5 h-2.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 1 0 0-2H2a1 1 0 1 0 0 2zm18 0h2a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2zM11 2v2a1 1 0 1 0 2 0V2a1 1 0 1 0-2 0zm0 18v2a1 1 0 1 0 2 0v-2a1 1 0 1 0-2 0zM5.99 4.58a1 1 0 1 0-1.41 1.41l1.41 1.41a1 1 0 1 0 1.41-1.41L5.99 4.58zm12.02 12.02a1 1 0 1 0-1.41 1.41l1.41 1.41a1 1 0 1 0 1.41-1.41l-1.41-1.41zm-12.02 0l-1.41 1.41a1 1 0 1 0 1.41 1.41l1.41-1.41a1 1 0 1 0-1.41-1.41zm12.02-12.02l-1.41 1.41a1 1 0 1 0 1.41 1.41l1.41-1.41a1 1 0 1 0-1.41-1.41z" />
           </svg>
        )}
      </div>
    </button>
  )
}
