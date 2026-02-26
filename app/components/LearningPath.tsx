import Link from 'next/link'
import { Lesson } from '../learn/actions'

interface LearningPathProps {
  lessons: Lesson[]
}

export default function LearningPath({ lessons }: LearningPathProps) {
  // Group lessons by level
  const lessonsByLevel = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.level]) {
      acc[lesson.level] = []
    }
    acc[lesson.level].push(lesson)
    return acc
  }, {} as Record<string, Lesson[]>)

  // Find the 'current' lesson (first uncompleted one)
  const currentLessonIndex = lessons.findIndex(l => !l.completed)
  const currentLessonId = currentLessonIndex !== -1 ? lessons[currentLessonIndex].id : null

  return (
    <div className="w-full max-w-lg mx-auto py-12 px-4 relative flex flex-col items-center">
      {/* Background connecting line */}
      <div className="absolute top-0 bottom-0 left-1/2 -ml-[2px] w-1 bg-slate-200/60 z-0 rounded-full" />

      {Object.entries(lessonsByLevel).map(([level, levelLessons]) => (
        <div key={level} className="w-full flex flex-col items-center relative z-10 mb-16">
          
          {/* Section Header */}
          <div className="bg-primary/10 border border-primary/20 backdrop-blur-sm px-6 py-2 rounded-2xl mb-12 shadow-sm animate-fade-in-up">
            <h2 className="text-xl font-bold text-primary tracking-tight">Section {level}</h2>
          </div>

          <div className="flex flex-col gap-12 w-full">
            {levelLessons.map((lesson, idx) => {
              const isCompleted = lesson.completed
              const isCurrent = lesson.id === currentLessonId
              // Locked if it's not completed AND not the current one
              const isLocked = !isCompleted && !isCurrent

              return (
                <LessonNode 
                  key={lesson.id} 
                  lesson={lesson} 
                  state={isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'} 
                  offset={idx % 2 === 0 ? 'left' : 'right'}
                />
              )
            })}
          </div>
        </div>
      ))}
      
      {/* End of Path Celebration */}
      {currentLessonId === null && lessons.length > 0 && (
         <div className="bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm px-8 py-4 rounded-3xl mt-8 shadow-sm text-center relative z-10 animate-fade-in-up">
           <span className="text-4xl mb-2 block">🏆</span>
           <h2 className="text-xl font-bold text-emerald-600 tracking-tight">All Caught Up!</h2>
           <p className="text-emerald-600/80 text-sm mt-1 font-medium">Wait for new lessons to drop.</p>
         </div>
      )}
    </div>
  )
}

function LessonNode({ 
  lesson, 
  state,
  offset 
}: { 
  lesson: Lesson, 
  state: 'completed' | 'current' | 'locked'
  offset: 'left' | 'right'
}) {
  const isCompleted = state === 'completed'
  const isCurrent = state === 'current'
  
  // Zig-zag offset styling for the text
  const textPos = offset === 'left' ? 'items-end text-right right-full mr-6' : 'items-start text-left left-full ml-6'
  // Sine wave translation for the bubble (optional vibe polish)
  const nodeTranslate = offset === 'left' ? '-translate-x-8' : 'translate-x-8'

  const content = (
    <div className="flex items-center justify-center w-full relative">
      
      {/* The Node Bubble Container */}
      <div className={`relative group ${nodeTranslate}`}>
        
        {/* Text Label Container - Anchored to the bubble so it never overlaps */}
        <div className={`hidden md:flex flex-col absolute top-1/2 -translate-y-1/2 ${textPos} w-48`}>
          <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${isLockedText(state)}`}>
            Lesson {lesson.lesson_order}
          </span>
          <span className={`text-base font-bold ${isLockedText(state)} leading-tight`}>
            {lesson.title}
          </span>
        </div>

        {/* Pulsing rings for current lesson */}
        {isCurrent && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75" />
            <div className="absolute -inset-2 rounded-full border border-primary/50 animate-pulse" />
          </>
        )}
        
        {/* 'Start' Badge for current lesson */}
        {isCurrent && (
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-xl shadow-lg border border-slate-100 font-bold text-primary text-xs whitespace-nowrap animate-bounce z-20`}>
              Start Here
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45" />
            </div>
        )}

        {/* The actual circle UI */}
        <div className={`
          relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-[3px] shadow-sm transition-transform duration-300
          ${getNodeClasses(state)}
        `}>
          {getIconForState(state)}
        </div>
      </div>
    </div>
  )

  if (state === 'locked') {
    return (
      <div className="w-full cursor-not-allowed opacity-80">
        {content}
      </div>
    )
  }

  return (
    <Link href={`/learn/${lesson.slug}`} className="w-full hover:-translate-y-1 transition-transform block">
      {content}
    </Link>
  )
}

function getNodeClasses(state: 'completed' | 'current' | 'locked') {
  switch (state) {
    case 'completed':
      return 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/20 shadow-lg group-hover:bg-emerald-400'
    case 'current':
      return 'bg-gradient-to-br from-violet-500 to-fuchsia-500 border-fuchsia-600 text-white shadow-primary/30 shadow-xl group-hover:shadow-primary/40'
    case 'locked':
      return 'bg-slate-100 border-slate-300 text-slate-400'
  }
}

function isLockedText(state: 'completed' | 'current' | 'locked') {
  return state === 'locked' ? 'text-slate-400' : 'text-slate-700'
}

function getIconForState(state: 'completed' | 'current' | 'locked') {
  switch (state) {
    case 'completed':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'current':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    case 'locked':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
  }
}
