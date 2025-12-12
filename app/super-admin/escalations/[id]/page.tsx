'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import EscalationSuccessModal from '@/components/ui/modals/EscalationSuccessModal'

export default function EscalationReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [notes, setNotes] = useState('')

  const handleApprove = () => {
    // Logic to approve decision
    setShowSuccessModal(true)
  }

  const handleDone = () => {
    setShowSuccessModal(false)
    router.push('/super-admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Escalation Review</h1>
        </div>

        <div className="space-y-8">
          {/* Alert Box */}
          <div className="bg-[#FAD2E1] border border-pink-200 rounded-lg p-4 flex items-center gap-3 text-pink-900">
             <AlertCircle className="w-5 h-5 text-pink-600" />
             <span className="font-medium">Flagged by Verification Admin</span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Vendor</label>
              <p className="text-xl font-bold text-[#0B2E6F] font-serif">Elite Events</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">Reason</label>
              <p className="text-gray-900">Suspicious documents</p>
            </div>

            <div className="pt-4">
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Super Admin Notes</label>
              <textarea
                className="w-full h-32 p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] resize-none text-sm placeholder:text-gray-400"
                placeholder="Add your decision"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleApprove}
              className="px-8 py-2.5 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors min-w-[160px]"
            >
              Approve Decision
            </button>
            <button
              onClick={() => router.back()}
              className="px-8 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-w-[160px]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <EscalationSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleDone}
      />
    </div>
  )
}

