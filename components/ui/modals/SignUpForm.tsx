'use client'

import { useState } from 'react'
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'

interface SignUpModalProps {
  onClose: () => void
  onContinue: (formData: any) => void
  accountType: 'individual' | 'vendor'
}

export default function SignUpModal({ onClose, onContinue, accountType }: SignUpModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
      
      if (!passwordRegex.test(formData.password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Validate required fields based on account type
      if (accountType === 'individual') {
        if (!formData.firstName || !formData.lastName) {
          throw new Error('First name and last name are required')
        }
      } else {
        if (!formData.businessName) {
          throw new Error('Business name is required')
        }
      }

      if (!formData.email || !formData.phoneNumber) {
        throw new Error('Email and phone number are required')
      }

      // Call the parent handler with form data
      await onContinue(formData)
    } catch (error: any) {
      console.error('Form validation error:', error)
      // Error handling will be done in the parent component
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-auto ml-0">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-center text-event-blue">
          Create an EventHub Account
        </h2>
        <p className="text-center text-gray-600 mt-1 mb-6">
          {accountType === 'individual' 
            ? 'Join EventHub to find amazing event services' 
            : 'Join EventHub to grow your event business'
          }
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {accountType === 'individual' ? (
            <>
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter First Name"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter Last Name"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter Company Name"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Business Address
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="Enter Company Address"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Business Email
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  placeholder="Enter Business Email"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium">
              {accountType === 'individual' ? 'Email Address' : 'Business Email'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={accountType === 'individual' ? 'Enter Email' : 'Enter Company Email'}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              {accountType === 'individual' ? 'Phone Number' : 'Business Phone Number'}
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="🇳🇬 Phone number"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              className="mt-1 w-full border rounded-lg px-3 py-2 pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Must contain: uppercase, lowercase, number, and special character (@$!%*?&)
          </p>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="mt-1 w-full border rounded-lg px-3 py-2 pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-event-blue text-white py-2 rounded-lg hover:bg-event-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an Account?{' '}
          <span 
            className="text-event-blue font-semibold cursor-pointer hover:underline"
            onClick={() => {
              onClose()
              window.location.href = '/auth/login'
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
