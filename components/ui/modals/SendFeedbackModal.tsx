'use client'

import React, { useState } from 'react'
import { X, ArrowLeft, Star, Edit2, ChevronDown, Plus } from 'lucide-react'

interface SendFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SendFeedbackModal({ isOpen, onClose }: SendFeedbackModalProps) {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'How would you rate the event overall?',
      type: 'rating',
    },
    {
      id: 2,
      text: 'What did you like most about the event?',
      type: 'text',
    },
    {
      id: 3,
      text: 'Question',
      type: 'multiple-choice',
    }
  ])
  const [selectedRecipient, setSelectedRecipient] = useState('all')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button 
            onClick={onClose}
            className="flex items-center text-gray-700 font-medium hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Event
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-[#0B2E6F] rounded-md text-white hover:bg-[#0d3a8a] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-2">
          <h2 className="text-xl font-bold text-gray-900 font-asul">Send Feedback Survey</h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          {/* Event Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Event Title</label>
            <input
              type="text"
              placeholder="Enter Event Title"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-700">Questions</h3>

            {/* Question 1: Rating */}
            <div className="space-y-3">
              <p className="font-medium text-gray-900">1. How would you rate the event overall?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-gray-400" />
                ))}
              </div>
            </div>

            {/* Question 2: Text */}
            <div className="space-y-3">
              <p className="font-medium text-gray-900">2. What did you like most about the event?</p>
              <textarea
                placeholder="Open text"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                readOnly
              />
            </div>

            {/* Question 3: Dynamic */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3">
                <span className="font-bold text-gray-900">3. Question</span>
                <Edit2 className="h-4 w-4 text-gray-500 cursor-pointer" />
              </div>
              <div className="relative">
                <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Multiple Choice</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Add Question Button */}
            <button className="flex items-center gap-2 text-[#0B2E6F] font-bold text-sm hover:underline pl-1">
              <Plus className="h-4 w-4" />
              Add question
            </button>
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Send to:</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRecipient === 'all' ? 'border-[#0B2E6F]' : 'border-gray-400'}`}>
                  {selectedRecipient === 'all' && <div className="w-2.5 h-2.5 rounded-full bg-[#0B2E6F]" />}
                </div>
                <input
                  type="radio"
                  name="recipient"
                  className="hidden"
                  checked={selectedRecipient === 'all'}
                  onChange={() => setSelectedRecipient('all')}
                />
                <span className="text-gray-700">All attendees (1,234)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRecipient === 'ticket' ? 'border-[#0B2E6F]' : 'border-gray-400'}`}>
                  {selectedRecipient === 'ticket' && <div className="w-2.5 h-2.5 rounded-full bg-[#0B2E6F]" />}
                </div>
                <input
                  type="radio"
                  name="recipient"
                  className="hidden"
                  checked={selectedRecipient === 'ticket'}
                  onChange={() => setSelectedRecipient('ticket')}
                />
                <span className="text-gray-700">Filter by ticket type</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRecipient === 'payment' ? 'border-[#0B2E6F]' : 'border-gray-400'}`}>
                  {selectedRecipient === 'payment' && <div className="w-2.5 h-2.5 rounded-full bg-[#0B2E6F]" />}
                </div>
                <input
                  type="radio"
                  name="recipient"
                  className="hidden"
                  checked={selectedRecipient === 'payment'}
                  onChange={() => setSelectedRecipient('payment')}
                />
                <span className="text-gray-700">Filter by payment status</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 flex gap-4 mt-auto">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-400 text-[#0B2E6F] font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            className="flex-1 px-6 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#0d3a8a] transition-colors"
          >
            Send Survey
          </button>
        </div>
      </div>
    </div>
  )
}

