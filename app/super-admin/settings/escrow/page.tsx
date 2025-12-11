'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EscrowSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Escrow Rules & Timeline</h1>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Fund Holding Period (Days)</label>
              <input
                type="text"
                defaultValue="7"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Release Buffer Period (Hours)</label>
              <input
                type="text"
                defaultValue="24"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Refund Request Window (Days)</label>
              <input
                type="text"
                defaultValue="30"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <button className="flex-1 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors">
              Save Changes
            </button>
            <button className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
