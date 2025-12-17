'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, X, ChevronDown } from 'lucide-react'

export default function AdminSignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    consentToVerification: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Security Policies')
      setLoading(false)
      return
    }

    // In a real app, make API call here
    setTimeout(() => {
      setLoading(false)
      // Redirect to login or success page
      router.push('/admin/auth/login')
    }, 1000)
  }

  return (
    <div className="space-y-6 relative font-raleway">
      {/* Close Button */}
      <div className="flex justify-end">
        <Link href="/" className="bg-[#0B2E6F] p-2 rounded hover:bg-[#092456] transition-colors">
          <X className="h-4 w-4 text-white" />
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-asul text-[#0B2E6F]">Event Hub Admin Portal</h2>
        <p className="text-sm text-gray-600">Request Admin access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-raleway">
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm font-raleway"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm font-raleway"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm font-raleway"
            />
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
              Job Title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              required
              placeholder="Enter Job Title"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm font-raleway"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
              Phone Number
            </label>
            <div className="flex">
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-3 border border-gray-200 border-r-0 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm">🇳🇬</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                placeholder="Phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm font-raleway"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm"
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Enter Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm"
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
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-[#0B2E6F] border-gray-300 rounded focus:ring-[#0B2E6F]"
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
              I agree to the Admin{' '}
              <Link href="/admin/auth/terms" className="text-[#0B2E6F] hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/admin/auth/security" className="text-[#0B2E6F] hover:underline font-medium">
                Security Policies
              </Link>{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start">
            <input
              id="consentToVerification"
              name="consentToVerification"
              type="checkbox"
              checked={formData.consentToVerification}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-[#0B2E6F] border-gray-300 rounded focus:ring-[#0B2E6F]"
            />
            <label htmlFor="consentToVerification" className="ml-2 text-sm text-gray-700">
              I consent to background verification checks as required for admin access
            </label>
          </div>
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have access?{' '}
          <Link href="/admin/auth/login" className="text-[#0B2E6F] hover:text-[#092456] font-semibold">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

