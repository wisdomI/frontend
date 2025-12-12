'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const history = [
  {
    admin: 'Chisom Igwe',
    role: 'Verification Admin',
    action: 'Approved vendor',
    time: '23 minutes ago',
    status: 'Active',
    created: '2025-08-15',
    lastActive: '2025-10-20'
  },
  {
    admin: 'Zaynab Musa',
    role: 'Communication Admin',
    action: 'Refunded John Doe',
    time: 'Yesterday',
    status: 'Inactive',
    created: '2025-08-15',
    lastActive: '2025-08-20'
  },
  {
    admin: 'Chisom Igwe',
    role: 'Verification Admin',
    action: 'Refunded John Doe',
    time: 'Yesterday',
    status: 'Active',
    created: '2025-08-15',
    lastActive: '2025-10-20'
  }
]

export default function AccessHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Admin Access History</h1>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex justify-between items-center text-center divide-x divide-gray-100">
          <div className="flex-1 px-4">
            <p className="text-sm text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-[#0B2E6F]">2</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-sm text-gray-500 mb-1">Active</p>
            <p className="text-2xl font-bold text-[#0B2E6F]">1</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-sm text-gray-500 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-[#0B2E6F]">1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Overview List */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Admin Overview</h2>
            <div className="space-y-4">
              {[...new Map(history.map(item => [item.admin, item])).values()].map((admin, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{admin.admin}</h3>
                    <p className="text-sm text-gray-500 mb-2">{admin.role}</p>
                    <p className="text-xs text-gray-400">Created: {admin.created} | Last Active: {admin.lastActive}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    admin.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {admin.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {history.map((log, idx) => (
                <div key={idx} className="p-4 flex gap-4">
                  <div className={`w-1 self-stretch rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{log.admin}</p>
                      <p className="text-sm text-gray-500">{log.action}</p>
                    </div>
                    <span className="text-xs text-gray-400">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
