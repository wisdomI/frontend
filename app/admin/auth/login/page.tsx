'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, X } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Dummy authentication
    setTimeout(() => {
      // Super Admin
      if (email === 'superadmin@eventhub.com' && password === 'superadmin') {
        router.push('/super-admin')
      } 
      // Escrow Admin
      else if (email === 'escrowadmin@eventhub.com' && password === 'escrowadmin') {
        router.push('/escrow-admin')
      }
      // Dispute Admin
      else if (email === 'disputeadmin@eventhub.com' && password === 'disputeadmin') {
        router.push('/dispute-admin')
      }
      // Verification Admin
      else if (email === 'verificationadmin@eventhub.com' && password === 'verificationadmin') {
        router.push('/verification-admin')
      }
      // Marketplace Admin
      else if (email === 'marketplaceadmin@eventhub.com' && password === 'marketplaceadmin') {
        router.push('/marketplace-admin')
      }
      // Communication Admin
      else if (email === 'communicationadmin@eventhub.com' && password === 'communicationadmin') {
        router.push('/communication-admin')
      }
      // Default/Fallback
      else if (email === 'admin@eventhub.com' && password === 'password') {
        router.push('/super-admin')
      } else {
        setError('Invalid email or password')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/" className="text-gray-400 hover:text-gray-500">
          <X className="h-6 w-6" />
        </Link>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-asul text-[#0B2E6F]">Login to EventHub Admin Portal</h2>
        <p className="text-sm text-gray-600">Kindly fill in your details to Login</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link 
            href="/admin/auth/reset-password" 
            className="text-sm font-semibold text-[#0B2E6F] hover:text-[#092456]"
          >
            Forgot Password?
          </Link>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0B2E6F] hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2E6F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

