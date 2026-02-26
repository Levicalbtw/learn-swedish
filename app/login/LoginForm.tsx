'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn, signUp } from './actions'

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🇸🇪</span>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Learn Swedish
          </h1>
          <p className="text-muted mt-2">
            {isSignUp
              ? 'Create an account to start learning'
              : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl p-8 border border-black/5 shadow-sm">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success message */}
          {message && (
            <div className="mb-6 p-3 bg-accent-light border border-amber-200 rounded-lg text-amber-700 text-sm">
              {message}
            </div>
          )}

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="alex@example.com"
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-background
                           text-foreground placeholder:text-muted/60
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                           transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-background
                           text-foreground placeholder:text-muted/60
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                           transition-all duration-200"
              />
            </div>

            {/* Submit buttons */}
            <div className="pt-2">
              {isSignUp ? (
                <button
                  formAction={signUp}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium
                             hover:bg-primary/90 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Create Account
                </button>
              ) : (
                <button
                  formAction={signIn}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium
                             hover:bg-primary/90 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Sign In
                </button>
              )}
            </div>
          </form>

          {/* Toggle sign-in / sign-up */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6">
          🌟 <em>&quot;Övning ger färdighet&quot;</em> — Practice makes perfect
        </p>
      </div>
    </div>
  )
}
