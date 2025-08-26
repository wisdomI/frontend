'use client'

import React from 'react'

export default function BookingsPage() {
  return (
    <div className="bg-white rounded-lg p-6">
      <h1 className="text-[20px] font-semibold font-heading text-gray-900 mb-4">
        My Bookings
      </h1>
      
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-500 mb-6">
          When you book services, they&apos;ll appear here.
        </p>
        <button className="bg-event-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Browse Services
        </button>
      </div>
    </div>
  )
}