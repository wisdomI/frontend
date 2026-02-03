'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, ChevronDown, Filter } from 'lucide-react'

const invoices = [
  { id: 'INV-2025-001', vendor: 'Royal Events', client: 'John Doe', approvedBy: 'Chisom Igwe', amount: '₦500,000', date: '2025-10-15', status: 'Paid' },
  { id: 'INV-2025-002', vendor: 'Royal Events', client: 'John Doe', approvedBy: 'Chisom Igwe', amount: '₦850,000', date: '2025-10-15', status: 'Pending' },
  { id: 'INV-2025-003', vendor: 'Royal Events', client: 'John Doe', approvedBy: 'Chisom Igwe', amount: '₦850,000', date: '2025-10-15', status: 'Pending' },
  { id: 'INV-2025-004', vendor: 'Royal Events', client: 'John Doe', approvedBy: 'Chisom Igwe', amount: '₦500,000', date: '2025-10-15', status: 'Paid' },
]

export default function InvoicesPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">All Invoices</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Royal Events" 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
               All Invoices
               <ChevronDown className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">{invoice.id}</h3>
                <p className="text-sm text-gray-600 font-medium">{invoice.vendor} → {invoice.client}</p>
                <p className="text-xs text-gray-500">Approved by: {invoice.approvedBy}</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-20 md:gap-12">
                <div className="flex flex-col items-end gap-6">
                  <p className="font-bold text-green-700 text-lg">{invoice.amount}</p>
                  <p className="text-xs text-gray-500">{invoice.date}</p>
                  <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'Paid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
