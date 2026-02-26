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
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-5xl mx-auto">
      {/* Welcome Hero */}
      <div className="animate-fade-in-up mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🇸🇪</span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Välkommen, {displayName}!
          </h1>
        </div>
        <p className="text-lg text-muted max-w-lg">
          Welcome to <span className="font-semibold text-foreground">Learn Swedish</span>. 
          Pick up where you left off, or start something new today.
        </p>
      </div>

      {/* Quick Stats Bar */}
      <div className="animate-fade-in-up animation-delay-100 grid grid-cols-3 gap-4 mb-10 opacity-0">
        <div className="bg-surface rounded-xl p-4 text-center border border-black/5">
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-xs text-muted mt-1">Words learned</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-black/5">
          <p className="text-2xl font-bold text-accent">0</p>
          <p className="text-xs text-muted mt-1">Day streak</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-black/5">
          <p className="text-2xl font-bold text-primary">A1</p>
          <p className="text-xs text-muted mt-1">Current level</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, i) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`
              animate-fade-in-up opacity-0
              ${i === 0 ? "animation-delay-100" : i === 1 ? "animation-delay-200" : "animation-delay-300"}
            `}
          >
            <div className="card-hover bg-surface rounded-2xl p-6 border border-black/5 h-full flex flex-col">
              {/* Icon + Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`${feature.color} rounded-xl p-3`}>
                  {feature.icon}
                </div>
                <span className="text-xs font-medium text-muted bg-background px-2.5 py-1 rounded-full">
                  {feature.badge}
                </span>
              </div>

              {/* Content */}
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed flex-1">
                {feature.description}
              </p>

              {/* CTA arrow */}
              <div className="mt-4 flex items-center text-primary text-sm font-medium">
                Get started
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Motivational footer */}
      <div className="animate-fade-in-up animation-delay-300 opacity-0 mt-12 text-center">
        <p className="text-sm text-muted">
          🌟 <em>&quot;Övning ger färdighet&quot;</em> — Practice makes perfect
        </p>
      </div>
    </div>
  );
}
