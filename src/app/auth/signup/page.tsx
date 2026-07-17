"use client"

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Will be implemented with Supabase auth
    // TODO: Integrate with Supabase for actual registration
    setSuccess('Account created! Please sign in.')
    setTimeout(() => {
      window.location.href = '/auth/signin'
    }, 2000)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-24 px-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold font-heading text-center mb-2">
            Join <span className="text-[#D4AF37]">CareerOS AI</span>
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Create your account for Gulf career success
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-sm text-emerald-300">{success}</p>
              </div>
            )}

            <Button
              variant="primary"
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/auth/signin" className="text-blue-400 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}