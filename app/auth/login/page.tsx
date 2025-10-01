'use client'

import { useState, Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export default function LoginPage() {
  const [selectedAccountType, setSelectedAccountType] = useState<'individual' | 'vendor'>('individual')
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to EventHub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Kindly fill in your details to Login
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setSelectedAccountType('individual')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              selectedAccountType === 'individual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Individual/Org
          </button>
          <button
            onClick={() => setSelectedAccountType('vendor')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              selectedAccountType === 'vendor'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Event Vendor
          </button>
        </div>
        
        <div className="mt-8 space-y-6">
          <GoogleSignInButton expectedRole={selectedAccountType === 'vendor' ? 'vendor' : 'client'} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or Login with</span>
            </div>
          </div>
          
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm accountType={selectedAccountType} />
          </Suspense>
          
          <div className="flex items-center justify-between text-sm">
            <a href="/auth/register" className="text-event-blue hover:opacity-80 transition-all">
              Don&apos;t have an account? Register
            </a>
            <a href="/auth/reset-password" className="text-gray-600 hover:text-gray-900 transition-all">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}