'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSpeechRecognition, useSpeechSynthesis } from '@/app/hooks/useSpeech'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  initialMessages: Message[]
}

export default function ChatInterface({ initialMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Speech hooks
  const {
    isListening,
    transcript,
    isSupported: sttSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition()

  const {
    isSpeaking,
    isSupported: ttsSupported,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis()

  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Update input field with live transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Auto-send when speech recognition ends with a transcript
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      // Small delay to let the final transcript settle
      const timer = setTimeout(() => {
        sendMessageText(transcript)
        // Clear transcript after sending to prevent accidental double-send
        // We do this by resetting the hook's state through start/stop if needed,
        // but since it's a new instance each time, we just need to be careful with the local input.
      }, 500)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript])

  // Track speaking state for icon animation
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingIndex(null)
    }
  }, [isSpeaking])

  const sendMessageText = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    // Add empty assistant message for streaming
    const assistantMessage: Message = { role: 'assistant', content: '' }
    setMessages([...updatedMessages, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullContent += chunk

          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              role: 'assistant',
              content: fullContent,
            }
            return updated
          })
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Förlåt! Something went wrong. Please try again. 😔',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }, [messages, isLoading])

  const sendMessage = () => sendMessageText(input)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleMic = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSpeak = (text: string, index: number) => {
    if (isSpeaking && speakingIndex === index) {
      stopSpeaking()
      setSpeakingIndex(null)
    } else {
      speak(text)
      setSpeakingIndex(index)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] max-w-3xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🇸🇪</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Hej! Ready to practice?
            </h2>
            <p className="text-muted text-sm max-w-sm mx-auto mb-6">
              Type or speak in Swedish — I&apos;ll respond and help you learn!
              {sttSupported && ' Click the 🎤 mic to use your voice.'}
            </p>
            {/* Suggested starters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Hej! Hur mår du?',
                'Teach me some colors',
                'Jag vill lära mig svenska',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion)
                    inputRef.current?.focus()
                  }}
                  className="text-sm px-4 py-2 rounded-full bg-primary-light text-primary
                             hover:bg-primary/10 transition-colors border border-primary/20"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md shadow-sm'
                  : 'bg-surface border border-slate-200 dark:border-slate-800 text-foreground rounded-bl-md shadow-sm'
                }
              `}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-primary">Sven 🇸🇪</span>
                  {/* Speaker button on assistant messages */}
                  {ttsSupported && msg.content && !(i === messages.length - 1 && isLoading) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSpeak(msg.content, i)
                      }}
                      className={`
                        p-1 rounded-md transition-colors duration-200
                        ${speakingIndex === i
                          ? 'text-accent bg-accent-light'
                          : 'text-muted hover:text-primary hover:bg-primary-light'
                        }
                      `}
                      title={speakingIndex === i ? 'Stop speaking' : 'Listen to this message'}
                    >
                      {speakingIndex === i ? (
                        /* Animated speaker icon */
                        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {msg.content}
                {/* Blinking cursor for streaming */}
                {msg.role === 'assistant' && i === messages.length - 1 && isLoading && (
                  <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Listening indicator */}
      {isListening && (
        <div className="flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-900/30">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
            Listening... Speak in Swedish
          </span>
          {transcript && (
            <span className="text-sm text-red-400 dark:text-red-300 italic ml-2">&ldquo;{transcript}&rdquo;</span>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-surface p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          {/* Mic button */}
          {sttSupported && (
            <button
              onClick={toggleMic}
              disabled={isLoading}
              className={`
                px-3 py-3 rounded-xl transition-all duration-200
                flex items-center justify-center
                ${isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                  : 'bg-background border border-slate-200 dark:border-slate-800 text-muted hover:text-primary hover:border-primary/30'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <svg className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening...' : 'Skriv något på svenska... (Type something in Swedish...)'}
            disabled={isLoading || isListening}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-background
                       text-foreground placeholder:text-muted/50
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-all duration-200 disabled:opacity-50 shadow-inner"
          />

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || isListening}
            className="px-4 py-3 rounded-xl bg-primary text-white font-medium
                       hover:bg-primary/90 transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
