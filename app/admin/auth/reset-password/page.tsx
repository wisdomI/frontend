'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, X, Check } from 'lucide-react'

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setShowSuccessModal(true)
    }, 1000)
  }

  if (showSuccessModal) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-end absolute top-4 right-4">
          <Link href="/" className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </Link>
        </div>
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-teal-100 mb-6 relative">
           <div className="h-16 w-16 bg-[#14B8A6] rounded-full flex items-center justify-center">
             <Check className="h-8 w-8 text-white" strokeWidth={3} />
           </div>
           {/* Decorative dots */}
           <div className="absolute top-2 left-2 h-1.5 w-1.5 bg-yellow-400 rounded-full"></div>
           <div className="absolute bottom-2 left-0 h-1.5 w-1.5 bg-yellow-400 rounded-full"></div>
           <div className="absolute top-4 right-0 h-1.5 w-1.5 bg-yellow-400 rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold font-raleway text-gray-900 mb-2">Password Reset Successfully</h2>
        <p className="text-gray-600 mb-8">You have successfully reset your password</p>
        <Link 
          href="/admin/auth/login"
          className="inline-block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0B2E6F] hover:bg-[#092456] transition-colors"
        >
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/" className="text-gray-400 hover:text-gray-500">
          <X className="h-6 w-6" />
        </Link>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-raleway text-[#0B2E6F]">Reset Admin Password</h2>
        <p className="text-sm text-gray-600">Kindly fill in your details to Login</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
          <input type="email" placeholder="Enter Email" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
              required
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0B2E6F] hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2E6F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>

        <div className="text-center">
          <Link href="/admin/auth/login" className="text-sm font-bold text-[#0B2E6F] hover:text-[#092456]">
            Back To Login
          </Link>
        </div>
      </form>
    </div>
  )
}

