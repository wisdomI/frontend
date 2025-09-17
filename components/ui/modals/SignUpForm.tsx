'use client'

import { useState } from 'react'
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'

interface SignUpModalProps {
  onClose: () => void
  onContinue: () => void 
}

export default function SignUpModal({ onClose, onContinue }: SignUpModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContinue()
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
          EventHub makes your Event Planning easy.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Business Name</label>
            <input
              type="text"
              placeholder="Enter Company Name"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Business Email</label>
            <input
              type="email"
              placeholder="Enter Company Email"
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
              placeholder="Enter Company Address"
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Business Phone Number
            </label>
            <input
              type="tel"
              placeholder="🇳🇬 Phone number"
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
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

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
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
            className="w-full bg-event-blue text-white py-2 rounded-lg hover:bg-event-blue-hover"
          >
            Continue
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an Account?{' '}
          <span className="text-event-blue font-semibold cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
