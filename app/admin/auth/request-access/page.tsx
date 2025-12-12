'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, X, Check } from 'lucide-react'

export default function RequestAccessPage() {
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
        <h2 className="text-2xl font-bold font-asul text-gray-900 mb-2">Access Requested Successfully</h2>
        <p className="text-gray-600 mb-8">Check your email for secure link to login</p>
        <Link 
          href="/admin/auth/login"
          className="inline-block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0B2E6F] hover:bg-[#092456] transition-colors"
        >
          Done
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
        <h2 className="text-2xl font-bold font-asul text-[#0B2E6F]">Event Hub Admin Portal</h2>
        <p className="text-sm text-gray-600">Request Admin access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" placeholder="Enter First Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" placeholder="Enter Last Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" placeholder="Enter Email" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input type="text" placeholder="Enter Job Title" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
              🇳🇬 <span className="ml-1 text-gray-400">⌄</span>
            </span>
            <input type="tel" placeholder="Phone number" className="w-full px-4 py-3 border border-gray-200 rounded-r-lg bg-gray-50 text-sm focus:ring-[#0B2E6F] focus:border-[#0B2E6F]" required />
          </div>
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

        <div className="space-y-4">
          <div className="flex items-start">
            <input id="terms" type="checkbox" className="h-4 w-4 text-[#0B2E6F] focus:ring-[#0B2E6F] border-gray-300 rounded mt-1" required />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the Admin Terms of Service and Security Policies *
            </label>
          </div>
          <div className="flex items-start">
            <input id="consent" type="checkbox" className="h-4 w-4 text-[#0B2E6F] focus:ring-[#0B2E6F] border-gray-300 rounded mt-1" required />
            <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
              I consent to background verification checks as required for admin access
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0B2E6F] hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2E6F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have access? </span>
          <Link href="/admin/auth/login" className="font-bold text-[#0B2E6F] hover:text-[#092456]">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

