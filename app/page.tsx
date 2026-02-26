import { createClient } from "@/lib/supabase/server";
import { getLessons } from "./learn/actions";
import { getUserStats, getWordsLearnedCount } from "./study/actions";
import LearningPath from "./components/LearningPath";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.email?.split('@')[0] ?? 'learner';
  
  // Fetch real data in parallel
  const [lessons, stats, wordsCount] = await Promise.all([
    getLessons(),
    getUserStats(),
    getWordsLearnedCount()
  ]);

  return (
    <div className="px-6 py-10 md:px-14 md:py-16 max-w-5xl mx-auto min-h-screen bg-background">
      {/* Welcome Hero */}
      <div className="animate-fade-in-up mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            🇸🇪
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Välkommen, {displayName}!
          </h1>
        </div>
        <p className="text-xl text-muted max-w-2xl leading-relaxed">
          Welcome to <span className="font-semibold text-foreground">Learn Swedish</span>. 
          Pick up where you left off, or start a new lesson today.
        </p>
      </div>

      {/* Quick Stats Bar */}
      <div className="animate-fade-in-up animation-delay-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold text-primary mb-1">{wordsCount}</p>
          <p className="text-sm font-medium text-muted uppercase tracking-widest">Words learned</p>
        </div>
        <div className="bg-surface rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">🔥</div>
          <p className="text-4xl font-extrabold text-accent mb-1">{stats?.streak_count || 0}</p>
          <p className="text-sm font-medium text-muted uppercase tracking-widest flex items-center justify-center gap-2">
            Day streak 
            {(stats?.streak_count || 0) > 0 && <span className="text-xl animate-bounce-slow">🔥</span>}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold text-primary mb-1">A1</p>
          <p className="text-sm font-medium text-muted uppercase tracking-widest">Current level</p>
        </div>
      </div>

      {/* Learning Path */}
      <div className="w-full relative z-10 mt-16 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Your Journey</h2>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Follow the path to master Swedish. Complete lessons to unlock the next steps.
          </p>
        </div>
        
        <LearningPath lessons={lessons} />
      </div>

      {/* Motivational footer */}
      <div className="animate-fade-in-up animation-delay-300 mt-8 text-center pb-12">
        <p className="text-sm font-medium text-muted">
          🌟 <em className="text-foreground/80">&quot;Övning ger färdighet&quot;</em> — Practice makes perfect
        </p>
      </div>
    </div>
  );
}
