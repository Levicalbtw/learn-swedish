import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getLessonBySlug } from '../actions'
import CompleteButton from './CompleteButton'
import PlayAudioButton from '../../components/PlayAudioButton'
import GenerateFlashcardsButton from '../../components/GenerateFlashcardsButton'

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
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Learning Path
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
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8 tracking-tight" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-5 pb-2 border-b-2 border-primary/10 tracking-tight" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4 tracking-tight" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-lg text-foreground leading-relaxed mb-6" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside text-lg text-foreground mb-6 space-y-2 ml-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside text-lg text-foreground mb-6 space-y-2 ml-4" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="leading-relaxed" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <div className="my-8 relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-xl"></div>
                <blockquote className="bg-primary/5 border border-primary/20 p-6 rounded-r-xl rounded-l-sm backdrop-blur-sm shadow-sm text-foreground italic text-lg leading-relaxed" {...props} />
              </div>
            ),
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              return !match ? (
                <code className="bg-slate-100 dark:bg-surface-hover text-primary font-bold px-1.5 py-0.5 rounded-md text-[0.9em] font-mono" {...props}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            pre: ({ node, ...props }) => (
              <pre className="bg-slate-900 dark:bg-black text-slate-50 p-6 rounded-2xl overflow-x-auto mb-8 font-mono text-sm shadow-md" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="my-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <table className="w-full text-left bg-surface border-collapse" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-slate-50 dark:bg-surface-hover/50 border-b border-slate-200 dark:border-slate-800" {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-slate-50/80 dark:hover:bg-surface-hover/30 transition-colors duration-150" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="px-6 py-4 text-sm font-bold text-foreground uppercase tracking-wider" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-6 py-4 text-foreground font-medium" {...props} />
            ),
            strong: ({ node, children, ...props }) => {
              // Extract text content from children for the TTS engine
              const getText = (child: any): string => {
                if (typeof child === 'string') return child
                if (Array.isArray(child)) return child.map(getText).join('')
                if (child && typeof child === 'object' && 'props' in child) {
                  return getText(child.props.children)
                }
                return ''
              }
              const text = getText(children)
              
              return (
                <span className="inline-flex items-center gap-1.5 align-middle">
                  <strong className="font-bold text-foreground" {...props}>{children}</strong>
                  <PlayAudioButton text={text} className="ml-0.5 -mt-0.5" />
                </span>
              )
            },
            a: ({ node, ...props }) => (
               <a className="text-primary font-medium hover:text-primary/80 underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" {...props} />
            ),
            details: ({ node, ...props }) => (
              <details className="group my-4 overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 transition-all duration-300 open:bg-surface open:border-primary/20" {...props} />
            ),
            summary: ({ node, ...props }) => (
              <summary className="list-none cursor-pointer px-6 py-3.5 flex items-center justify-between font-bold text-primary hover:bg-primary/10 transition-colors select-none focus:outline-none group-open:border-b group-open:border-primary/10">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Check Answer
                </span>
                <svg className="w-5 h-5 transform transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
            ),
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </div>

      {/* Completion & Next Actions */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-8 animate-fade-in-up animation-delay-200">
        <GenerateFlashcardsButton 
          lessonId={lesson.id} 
          lessonContent={lesson.content} 
          lessonLevel={lesson.level} 
        />
        
        <div className="h-px bg-slate-200 dark:bg-slate-800 w-full max-w-xs" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div>
            <h4 className="text-base font-medium text-foreground mb-1">Finished this lesson?</h4>
            <p className="text-sm text-muted">Mark it complete to track your progress.</p>
          </div>
          <CompleteButton lessonId={lesson.id} initialCompleted={lesson.completed} />
        </div>

        {/* Next Lesson Button */}
        {lesson.nextLesson && (
          <div className="w-full mt-4 flex flex-col items-center">
            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full mb-8" />
            <Link
              href={`/learn/${lesson.nextLesson.slug}`}
              className="group w-full max-w-md flex items-center justify-between p-6 rounded-2xl bg-primary text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Next Lesson</span>
                <span className="text-xl font-bold line-clamp-1">{lesson.nextLesson.title}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>
      
      {/* Link to study words - encouraging vibe */}
      <div className="mt-12 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-light via-surface to-accent-light/50 dark:from-accent-light/5 dark:via-surface-hover/10 dark:to-accent-light/10 p-8 sm:p-10 border border-accent/20 dark:border-accent/10 shadow-sm transition-all hover:shadow-md animate-fade-in-up animation-delay-300">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-5 border border-accent/10 dark:border-accent/20 transform group-hover:scale-110 transition-transform duration-300">
            🧠
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
            Time to practice?
          </h4>
          <p className="text-base text-muted mb-8 max-w-md mx-auto">
            Lock these new words into your memory using our visual Spaced Repetition flashcards.
          </p>
          <Link 
            href="/study"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-white font-semibold rounded-2xl shadow-sm hover:shadow-md hover:bg-accent/90 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/30"
          >
            Go to Study Room
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
