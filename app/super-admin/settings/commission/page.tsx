'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function CommissionSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Commission Rates Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Tier 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Tier 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Minimum (₦)</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="100,000"
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-center font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-200">
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▲</button>
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▼</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Maximum (₦)</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="500,000"
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-center font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-200">
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▲</button>
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▼</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Vendors rate (%)</label>
                <input
                  type="text"
                  defaultValue="5%"
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                />
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
            <button className="absolute top-4 right-4 text-red-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-gray-900 mb-6">Tier 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Minimum (₦)</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="0"
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-center font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-200">
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▲</button>
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▼</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Maximum (₦)</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="0"
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-center font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-200">
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▲</button>
                    <button className="h-1/2 px-2 hover:bg-gray-50 text-gray-500 text-xs">▼</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Vendors rate (%)</label>
                <input
                  type="text"
                  defaultValue="0%"
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                />
              </div>
            </div>
          </div>

          <button className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Tier
          </button>

          <div className="flex gap-4 pt-4">
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
