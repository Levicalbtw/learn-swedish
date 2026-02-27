'use client'

import { migrateLessonExercises } from '../actions'
import { useState } from 'react'

export default function MigrationPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')

  const runMigration = async () => {
    setStatus('running')
    try {
      await migrateLessonExercises()
      setStatus('done')
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  return (
    <div className="p-12 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Lesson Exercise Migration</h1>
      <p className="mb-8 text-muted">Click the button below to hide answers behind "Check Answer" blocks in all lessons.</p>
      
      {status === 'idle' && (
        <button 
          onClick={runMigration}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90"
        >
          Run Migration
        </button>
      )}

      {status === 'running' && <p>Running migration...</p>}
      {status === 'done' && <p className="text-emerald-500 font-bold">Migration successful! All answers are now hidden.</p>}
      {status === 'error' && <p className="text-red-500 font-bold">Migration failed. Check console.</p>}
    </div>
  )
}
