import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getLessonBySlug } from '../actions'
import CompleteButton from './CompleteButton'

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await params
  const lesson = await getLessonBySlug(resolvedParams.slug)

  if (!lesson) {
    notFound()
  }

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto pb-32">
      {/* Navigation & Header */}
      <div className="mb-10 animate-fade-in-up">
        <Link 
          href="/learn"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Lessons
        </Link>
        
        <div className="inline-block px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full mb-3 uppercase tracking-wide">
          Level {lesson.level} — Lesson {lesson.lesson_order}
        </div>
      </div>

      {/* Lesson Content rendered via Markdown */}
      <div className="animate-fade-in-up animation-delay-100">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4 border-b border-black/5 pb-2" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-semibold text-foreground mt-8 mb-3" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-muted leading-relaxed mb-5" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside text-muted mb-6 space-y-2 ml-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside text-muted mb-6 space-y-2 ml-4" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="leading-relaxed" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-primary-light bg-surface-hover p-4 rounded-r-xl italic text-foreground mb-6" {...props} />
            ),
            code: ({ node, className, children, ...props }) => (
              <code className="bg-surface-hover text-primary p-1 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-surface-hover text-foreground p-4 rounded-xl overflow-x-auto mb-6 font-mono text-sm" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto mb-6 rounded-xl border border-black/5">
                <table className="min-w-full text-left bg-surface" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-surface-hover text-foreground font-semibold" {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="divide-y divide-black/5" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-surface-hover/50 transition-colors" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="px-4 py-3" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-3 text-muted" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-foreground" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-primary hover:underline hover:text-primary/80 transition-colors" {...props} />
            ),
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </div>

      {/* Completion & Next Actions */}
      <div className="mt-16 pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in-up animation-delay-200">
        <div>
          <h4 className="text-base font-medium text-foreground mb-1">Finished this lesson?</h4>
          <p className="text-sm text-muted">Mark it complete to track your progress.</p>
        </div>
        
        <CompleteButton lessonId={lesson.id} initialCompleted={lesson.completed} />
      </div>
      
      {/* Link to study words - encouraging vibe */}
      <div className="mt-8 bg-accent-light p-6 rounded-xl border border-accent/20 flex flex-col items-center text-center animate-fade-in-up animation-delay-300">
        <h4 className="text-lg font-semibold text-accent-light-foreground mb-2 flex items-center gap-2">
          <span>🧠</span> Time to practice?
        </h4>
        <p className="text-sm text-foreground mb-4">
          Lock these words into your memory using the Spaced Repetition flashcards.
        </p>
        <Link 
          href="/study"
          className="px-6 py-2.5 bg-white text-accent font-medium rounded-xl border border-accent/10 shadow-sm hover:shadow-md hover:border-accent/20 transition-all active:scale-95"
        >
          Go to Study Room
        </Link>
      </div>
    </div>
  )
}
