import { createClient } from '@/lib/supabase/server'
import ChatInterface from '@/app/components/ChatInterface'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Load conversation history
  let initialMessages: { role: 'user' | 'assistant'; content: string }[] = []

  if (user) {
    const { data } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50)

    if (data) {
      initialMessages = data.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-surface">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="bg-accent-light rounded-xl p-2.5">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Chat with Sven</h1>
            <p className="text-xs text-muted">Your AI Swedish tutor — practice makes perfect!</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted">Online</span>
          </div>
        </div>
      </div>

      {/* Chat interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface initialMessages={initialMessages} />
      </div>
    </div>
  )
}
