'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, X, ChevronDown, Check } from 'lucide-react'
import { authAPI, adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function AdminSignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
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

    if (!formData.consentToVerification) {
        setError('You must consent to background verification checks')
        setLoading(false)
        return
    }

    try {
      // Format phone number to international format (strip leading 0 and add +234)
      let formattedPhone = formData.phoneNumber
      if (formattedPhone.startsWith('0')) {
        formattedPhone = formattedPhone.substring(1)
      }
      if (!formattedPhone.startsWith('+234')) {
        formattedPhone = `+234${formattedPhone}`
      }

      // Construct the exact payload required for super admin sign up
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        jobTitle: formData.jobTitle,
        phoneNumber: formattedPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        adminType: "super_admin",
        backgroundVerificationCheck: formData.consentToVerification, // mapped from consentToVerification
        termsAndServiceAgreement: formData.agreeToTerms // mapped from agreeToTerms
      }

      // Call the Register API with the custom payload
      // We cast to any because the standard RegisterRequest type doesn't include these specific admin fields
      // Using adminAPI.register to hit /admin/signup
      await adminAPI.register(payload as any)
      
      setSuccess(true)
    } catch (err: any) {
      console.error('Admin Signup Error:', err.message || 'Unknown error')
      
      // Extract the most specific error message possible
      let message = 'Failed to request access'
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
            message = err.response.data
        } else if (err.response.data.message) {
            message = err.response.data.message
            // If there are validation errors, append them
            if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                message += ': ' + err.response.data.errors.join(', ')
            }
        }
      } else if (err.message) {
        message = err.message
      }
      
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="flex justify-end w-full mb-4">
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                </Link>
            </div>
            
            <div className="bg-[#F0FDF9] rounded-full p-6 mb-6 relative">
                <div className="bg-[#14B8A6] rounded-full p-4">
                    <Check className="h-8 w-8 text-white" strokeWidth={3} />
                </div>
                {/* Decorative dots matching the design */}
                <div className="absolute top-2 left-2 h-1.5 w-1.5 bg-[#FACC15] rounded-full"></div>
                <div className="absolute bottom-4 left-0 h-1.5 w-1.5 bg-[#FACC15] rounded-full"></div>
                <div className="absolute top-6 right-0 h-1.5 w-1.5 bg-[#FACC15] rounded-full"></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-raleway text-center">Access Requested Successfully</h2>
            <p className="text-gray-600 mb-8 font-raleway text-center">Check your email for secure link to login</p>

            <Link 
                href="/admin/auth/login"
                className="w-full bg-[#0B2E6F] text-white py-3 rounded-lg font-bold text-center hover:bg-[#092456] transition-colors font-raleway"
            >
                Done
            </Link>
        </div>
    )
  }

  return (
    <div className="space-y-6 relative font-raleway">
      {/* Close Button */}
      <div className="flex justify-end">
        <Link href="/" className="bg-[#0B2E6F] p-1 rounded hover:bg-[#092456] transition-colors">
          <X className="h-4 w-4 text-white" />
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-raleway text-[#0B2E6F]">Event Hub Admin Portal</h2>
        <p className="text-sm text-gray-600">Request Admin access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 font-raleway">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-1 font-raleway">
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-white text-sm font-raleway outline-none"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-1 font-raleway">
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-white text-sm font-raleway outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1 font-raleway">
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-white text-sm font-raleway outline-none"
          />
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-bold text-gray-700 mb-1 font-raleway">
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-white text-sm font-raleway outline-none"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-1 font-raleway">
            Phone Number
          </label>
          <div className="flex">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-3 border border-gray-200 border-r-0 rounded-l-lg bg-white hover:bg-gray-50 transition-colors h-full"
              >
                <span className="text-lg">🇳🇬</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">|</span>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-6 pr-4 py-3 border border-gray-200 rounded-r-lg focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-white text-sm font-raleway outline-none"
                />
            </div>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1 font-raleway">
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
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-white text-sm font-raleway outline-none"
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
          <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1 font-raleway">
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
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-white text-sm font-raleway outline-none"
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

        {/* Checkboxes */}
        <div className="space-y-4 pt-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
                <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#0B2E6F] border-gray-300 rounded focus:ring-[#0B2E6F]"
                />
            </div>
            <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700 font-raleway">
              I agree to the Admin{' '}
              <Link href="/admin/terms" className="text-[#0B2E6F] font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/admin/security" className="text-[#0B2E6F] font-medium">
                Security Policies
              </Link>{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
                <input
                id="consentToVerification"
                name="consentToVerification"
                type="checkbox"
                checked={formData.consentToVerification}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#0B2E6F] border-gray-300 rounded focus:ring-[#0B2E6F]"
                />
            </div>
            <label htmlFor="consentToVerification" className="ml-3 text-sm text-gray-700 font-raleway">
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
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0B2E6F] hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2E6F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-raleway mt-4"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center text-sm text-gray-600 font-raleway">
          Already have access?{' '}
          <Link href="/admin/auth/login" className="text-[#0B2E6F] hover:text-[#092456] font-bold">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}
