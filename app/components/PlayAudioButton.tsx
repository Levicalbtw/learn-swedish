'use client'

import { useState, useEffect } from 'react'

interface PlayAudioButtonProps {
  text: string
  className?: string
}

export default function PlayAudioButton({ text, className = '' }: PlayAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false)
    }
  }, [])

  const playAudio = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isSupported) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Try to find a Swedish voice
    const voices = window.speechSynthesis.getVoices()
    const swedishVoice = voices.find(voice => voice.lang.startsWith('sv'))
    
    if (swedishVoice) {
      utterance.voice = swedishVoice
    } else {
      // Fallback to the default voice but hint at the language
      utterance.lang = 'sv-SE'
    }

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  if (!isSupported) return null

  return (
    <button
      onClick={playAudio}
      disabled={isPlaying}
      title={`Listen to "${text}"`}
      className={`
        inline-flex items-center justify-center
        w-6 h-6 rounded-md
        text-primary hover:text-primary-600
        hover:bg-primary-50 active:scale-95
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isPlaying ? 'bg-primary-50 scale-95' : ''}
        ${className}
      `}
      aria-label={`Pronounce ${text} in Swedish`}
    >
      {isPlaying ? (
        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v18M8 7v10M16 7v10M4 10v4M20 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 10H7a2 2 0 00-2 2z" />
        </svg>
      )}
    </button>
  )
}
