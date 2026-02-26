'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CategorySelectorProps {
  categories: string[]
  activeCategory: string
}

export default function CategorySelector({ categories, activeCategory }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (category: string) => {
    setIsOpen(false)
    if (category === 'All') {
      router.push('/study')
    } else {
      router.push(`/study?category=${encodeURIComponent(category)}`)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">
        Current Topic
      </p>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-64 flex items-center justify-between px-4 py-3 bg-surface border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-primary/50 transition-all text-left group"
      >
        <div className="flex items-center gap-3 truncate">
          <div className={`w-2 h-2 rounded-full ${activeCategory === 'All' ? 'bg-primary' : 'bg-emerald-500'} animate-pulse`} />
          <span className="font-medium text-foreground truncate">
            {activeCategory === 'All' ? 'Due Today (All)' : activeCategory}
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-muted group-hover:text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full md:w-64 bg-surface/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
          <div className="max-h-64 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {/* "All" Option */}
            <button
              onClick={() => handleSelect('All')}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light transition-colors text-left ${
                activeCategory === 'All' ? 'bg-primary-light text-primary font-bold' : 'text-foreground'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeCategory === 'All' ? 'bg-primary' : 'bg-transparent border border-slate-300'}`} />
              Due Today (All)
            </button>
            
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-4" />
            
            {/* Individual Categories */}
            {categories.length === 0 ? (
              <p className="px-4 py-3 text-xs text-muted italic text-center">No categories found</p>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelect(category)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light transition-colors text-left ${
                    activeCategory === category ? 'bg-primary-light text-primary font-bold' : 'text-foreground'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeCategory === category ? 'bg-primary' : 'bg-transparent border border-emerald-300'}`} />
                  <span className="truncate">{category}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
