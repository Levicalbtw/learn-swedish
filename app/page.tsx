import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const features = [
  {
    title: "Study",
    description: "Master vocabulary with smart flashcards that adapt to your pace using spaced repetition.",
    href: "/study",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: "bg-primary-light",
    badge: "Core",
  },
  {
    title: "Chat",
    description: "Practice real conversations with an AI tutor that gently guides you in Swedish.",
    href: "/chat",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: "bg-accent-light",
    badge: "AI Tutor",
  },
  {
    title: "Progress",
    description: "Track your learning journey and see how far you've come with clear, visual stats.",
    href: "/progress",
    icon: (
      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "bg-primary-light",
    badge: "Stats",
  },
];

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.email?.split('@')[0] ?? 'learner';

  return (
    <div className="px-6 py-10 md:px-14 md:py-16 max-w-5xl mx-auto min-h-screen bg-slate-50/50">
      {/* Welcome Hero */}
      <div className="animate-fade-in-up mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-200/60">
            🇸🇪
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Välkommen, {displayName}!
          </h1>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
          Welcome to <span className="font-semibold text-slate-800">Learn Swedish</span>. 
          Pick up where you left off, or start a new lesson today.
        </p>
      </div>

      {/* Quick Stats Bar */}
      <div className="animate-fade-in-up animation-delay-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 opacity-0">
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold text-primary mb-1">0</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Words learned</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold text-accent mb-1">0</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Day streak</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold text-primary mb-1">A1</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Current level</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, i) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`
              animate-fade-in-up opacity-0 group
              ${i === 0 ? "animation-delay-100" : i === 1 ? "animation-delay-200" : "animation-delay-300"}
            `}
          >
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
              {/* Icon + Badge */}
              <div className="flex items-start justify-between mb-6">
                <div className={`${feature.color} rounded-2xl p-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full tracking-wide">
                  {feature.badge}
                </span>
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                {feature.title}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed flex-1">
                {feature.description}
              </p>

              {/* CTA arrow */}
              <div className="mt-8 flex items-center text-primary text-sm font-bold tracking-wide uppercase">
                Get started
                <svg className="w-5 h-5 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Motivational footer */}
      <div className="animate-fade-in-up animation-delay-300 opacity-0 mt-16 text-center">
        <p className="text-sm font-medium text-slate-500">
          🌟 <em className="text-slate-700">&quot;Övning ger färdighet&quot;</em> — Practice makes perfect
        </p>
      </div>
    </div>
  );
}
