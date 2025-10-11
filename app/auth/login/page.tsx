'use client'

import { useState, Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const [selectedAccountType, setSelectedAccountType] = useState<'individual' | 'vendor'>('vendor')
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 sm:p-8 relative">

        {/* Toggle */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setSelectedAccountType('individual')}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                selectedAccountType === 'individual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Individual/Org
            </button>
            <button
              onClick={() => setSelectedAccountType('vendor')}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                selectedAccountType === 'vendor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Event Vendor
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#032D71] font-asul text-left">Login to EventHub</h2>
          <p className="mt-3 text-gray-600 text-left">Kindly fill in your details to Login</p>
        </div>

        {/* Form */}
        <div className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm accountType={selectedAccountType} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}