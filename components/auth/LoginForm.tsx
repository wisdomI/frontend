'use client'

import { FaTimes } from 'react-icons/fa'
import Image from 'next/image'
import { useState } from 'react'
import ForgetPasswordModal from './ForgetPasswordModal'

interface LoginModalProps {
  onClose: () => void
  onRegister?: () => void
}

export default function LoginModal({ onClose, onRegister }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<
    'individual' | 'vendor' | 'planner'
  >('vendor')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto animate-slideInUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-1 bg-event-blue rounded"
        >
          <FaTimes />
        </button>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 py-2 rounded-full text-sm font-medium ${
              activeTab === 'individual'
                ? 'bg-white shadow text-event-blue'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Individual/Org
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`flex-1 py-2 rounded-full text-sm font-medium ${
              activeTab === 'vendor'
                ? 'bg-white shadow text-event-blue'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Event Vendor
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-2 rounded-full text-sm font-medium ${
              activeTab === 'planner'
                ? 'bg-white shadow text-event-blue'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Event Planner
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-event-blue mb-2 text-center">
          Login to EventHub
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Kindly fill in your details to Login
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-event-blue outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-event-blue outline-none"
          />
          <div className="text-right mt-2">
            <button 
              onClick={() => setShowForgotPassword(true)}
              className="text-event-blue text-sm font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button className="w-full bg-event-blue text-white py-3 rounded-full hover:bg-event-blue-hover transition-colors">
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <button 
            onClick={onRegister}
            className="text-event-blue font-medium hover:underline"
          >
            Register
          </button>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-2 text-sm text-gray-500">Or Login with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-6">
          <Image src="/google-icon.svg" alt="Google" width={28} height={28} />
          <Image src="/apple-icon.svg" alt="Apple" width={28} height={28} />
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgetPasswordModal 
        open={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </div>
  )
}