'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Send, 
  Filter, 
  Download 
} from 'lucide-react'
import SendFeedbackModal from '@/components/ui/modals/SendFeedbackModal'

const eventStats = [
  { label: 'Total Registrations', value: '1,537', color: 'text-[#0B2E6F]' },
  { label: 'Tickets Sold', value: '1,300', color: 'text-[#0B2E6F]' },
  { label: 'Total Revenue', value: '₦2.45M', color: 'text-[#0B2E6F]' },
  { label: 'Check ins', value: '1,234', color: 'text-[#0B2E6F]' },
]

const attendees = [
  { name: 'John Doe', email: 'johndoe@gmail.com', type: 'VIP', payment: 'Paid', method: 'Card', checkIn: 'Yes' },
  { name: 'Yomi Smith', email: 'johndoe@gmail.com', type: 'Regular', payment: 'Pending', method: 'Transfer', checkIn: 'No' },
  { name: 'Zaynab Musa', email: 'johndoe@gmail.com', type: 'Regular', payment: 'Pending', method: 'Transfer', checkIn: 'No' },
  { name: 'Ijeoma Igwe', email: 'johndoe@gmail.com', type: 'Regular', payment: 'Pending', method: 'Transfer', checkIn: 'No' },
  { name: 'Ijeoma Igwe', email: 'johndoe@gmail.com', type: 'Regular', payment: 'Paid', method: 'Card', checkIn: 'Yes' },
  { name: 'Ijeoma Igwe', email: 'johndoe@gmail.com', type: 'VIP', payment: 'Paid', method: 'Card', checkIn: 'Yes' },
  { name: 'Lucy Beecroft', email: 'johndoe@gmail.com', type: 'VIP', payment: 'Paid', method: 'Card', checkIn: 'Yes' },
]

export default function EventDetailsPage() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Back Button */}
      <Link 
        href="/admin" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Product Launch</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-600">
            <span>2025-12-15 • Public</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#0B2E6F]" />
              <span>NECA House, Ikeja</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowFeedbackModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#0B2E6F] text-white px-6 py-2.5 rounded-lg hover:bg-[#0d3a8a] transition-colors font-medium shadow-sm"
        >
          <Send className="h-4 w-4" />
          Send Feedback
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {eventStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <h3 className="text-sm font-medium text-[#0B2E6F] mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-[#0B2E6F] font-raleway">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Attendees Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 font-raleway">Attendees</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 font-normal">Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 font-normal">Email</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 font-normal">Ticket Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 font-normal">Payment</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 font-normal">Method</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 font-normal">Check in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendees.map((attendee, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{attendee.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{attendee.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{attendee.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        attendee.payment === 'Paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {attendee.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{attendee.method}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{attendee.checkIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SendFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}

