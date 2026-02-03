'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Mock Data based on image
const transactions = [
  { 
    id: 1, 
    event: 'Wedding Setup',
    vendor: 'Royal Events',
    client: 'John Doe',
    amount: '#500,000',
    progress: 40,
    status: 'In Progress',
    statusColor: 'bg-green-100 text-green-700'
  },
  { 
    id: 2, 
    event: "Ruth's Anniversary Party",
    vendor: 'Royal Events',
    client: 'Ruth',
    amount: '#500,000',
    progress: 0,
    status: 'Awaiting Payment',
    statusColor: 'bg-yellow-100 text-yellow-700'
  },
  { 
    id: 3, 
    event: "Grace's Sweet 16 Party",
    vendor: 'Royal Events',
    client: 'Grace',
    amount: '#500,000',
    progress: 40,
    status: 'Paused',
    statusColor: 'bg-yellow-50 text-yellow-600'
  },
]

export default function VendorProgressTrackerPage() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <Link 
        href="/escrow-admin" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to transactions
      </Link>

      <h1 className="text-2xl font-bold font-raleway text-gray-800">Progress Tracker</h1>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{transaction.event}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {transaction.vendor} → {transaction.client}
                </p>
                <p className="text-xl font-bold text-green-600 mb-4">{transaction.amount}</p>
                
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#0B2E6F] h-2.5 rounded-full transition-all"
                      style={{ width: `${transaction.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.statusColor}`}>
                      {transaction.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{transaction.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

