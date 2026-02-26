import { createClient } from "@/lib/supabase/server";
import { getLessons } from "./learn/actions";
import LearningPath from "./components/LearningPath";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.email?.split('@')[0] ?? 'learner';
  
  // Fetch all lessons securely from the server action
  const lessons = await getLessons();

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

      {/* Learning Path */}
      <div className="w-full relative z-10 mt-16 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Your Journey</h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
            Follow the path to master Swedish. Complete lessons to unlock the next steps.
          </p>
        </div>
        
        <LearningPath lessons={lessons} />
      </div>

      {/* Motivational footer */}
      <div className="animate-fade-in-up animation-delay-300 opacity-0 mt-8 text-center pb-12">
        <p className="text-sm font-medium text-slate-500">
          🌟 <em className="text-slate-700">&quot;Övning ger färdighet&quot;</em> — Practice makes perfect
        </p>
      </div>
    </div>
  );
}
