"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CreateAnnouncementProps {
  basePath?: string
}

export default function CreateAnnouncement({ basePath = '/communication-admin' }: CreateAnnouncementProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [recipients, setRecipients] = useState('All Users')
  const [deliveryType, setDeliveryType] = useState<string[]>(['push'])

  const handleDeliveryTypeChange = (type: string) => {
    if (deliveryType.includes(type)) {
      setDeliveryType(deliveryType.filter(t => t !== type))
    } else {
      setDeliveryType([...deliveryType, type])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, content, recipients, deliveryType })
    // Handle submission logic
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href={basePath}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Announcements
        </Link>
      </div>

      <h1 className="text-xl font-bold text-[#0B2E6F] mb-8">Create New Announcement</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Title
              </label>
              <input
                type="text"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                rows={8}
                placeholder="Enter your message here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <div className="relative">
                <select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 appearance-none"
                >
                  <option>All Users</option>
                  <option>Vendors only</option>
                  <option>Clients only</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Type
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryType.includes('push')}
                    onChange={() => handleDeliveryTypeChange('push')}
                    className="w-5 h-5 text-[#0B2E6F] border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Push notification</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryType.includes('email')}
                    onChange={() => handleDeliveryTypeChange('email')}
                    className="w-5 h-5 text-[#0B2E6F] border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Email</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="px-12 py-3 bg-[#0B2E6F] text-white font-semibold rounded-lg hover:bg-[#092456] transition-colors w-full md:w-auto"
          >
            Send Announcement
          </button>
        </div>
      </form>
    </div>
  )
}
