'use client'

import { useState } from 'react'
import { sendPasswordResetEmail } from '@/lib/auth-simple'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await sendPasswordResetEmail(email)
    setDone(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-xl border">
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        {done ? (
          <p className="text-sm text-gray-700">If an account exists for {email}, you will receive an email with a reset link.</p>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="you@example.com" />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white rounded-md px-4 py-2 disabled:opacity-50">{loading? 'Sending...' : 'Send reset link'}</button>
          </form>
        )}
        <div className="text-center text-sm">
          <a href="/auth/login" className="text-event-blue hover:opacity-80">Back to login</a>
        </div>
      </div>
    </div>
  )
}


