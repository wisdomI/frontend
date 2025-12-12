"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Download } from 'lucide-react'
import { FiCalendar } from 'react-icons/fi'

interface DisputeDetailProps {
  basePath?: string
  disputeId: string
  userRole?: string
}

export default function DisputeDetail({ basePath = '/dispute-admin', disputeId, userRole = 'Dispute Admin' }: DisputeDetailProps) {
  const [view, setView] = useState<'detail' | 'release' | 'refund' | 'split' | 'escalate'>('detail')
  const [adminNotes, setAdminNotes] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [vendorAmount, setVendorAmount] = useState('')
  const [clientAmount, setClientAmount] = useState('')
  const [escalationReason, setEscalationReason] = useState('')
  const [recommendation, setRecommendation] = useState('')

  // Mock data - in a real app this would come from an API based on disputeId
  const dispute = {
    id: disputeId,
    issue: 'Service not delivered',
    amount: '₦500,000',
    client: 'John Doe',
    vendor: 'ABC Caterers',
    status: 'Pending',
    description: 'The vendor did not show up on the event day...',
    vendorResponse: 'There was a miscommunication about the date...',
    evidence: [
      { name: 'Contract.pdf', url: '#' },
      { name: 'Messages.pdf', url: '#' },
    ]
  }

  const handleBack = () => {
    if (view === 'detail') {
      // Allow default Link behavior to go back to list
      return
    }
    setView('detail')
  }

  const renderDetail = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Case #{dispute.id}</h1>
      </div>

      {/* Issue Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900">Issue: {dispute.issue}</h3>
        <p className="text-gray-600 mt-1">Client: {dispute.client} | Vendor: {dispute.vendor}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Communication Log */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Communication Log</h3>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">Client ({dispute.client})</p>
            <p className="text-gray-700">{dispute.description}</p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">Vendor ({dispute.vendor})</p>
            <p className="text-gray-700">{dispute.vendorResponse}</p>
          </div>
        </div>

        {/* Evidence Uploaded */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Evidence Uploaded</h3>
          <div className="flex gap-6">
            {dispute.evidence.map((file, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-sm text-gray-600 mb-1">{file.name}</span>
                <a href={file.url} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                  Download <Download className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
        <button
          onClick={() => setView('release')}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Release funds to vendor
        </button>
        <button
          onClick={() => setView('refund')}
          className="px-6 py-3 bg-[#0CA5E9] text-white font-semibold rounded-lg hover:bg-[#0284c7] transition-colors"
        >
          Refund Client
        </button>
        <button
          onClick={() => setView('split')}
          className="px-6 py-3 bg-[#FBBF24] text-white font-semibold rounded-lg hover:bg-[#d97706] transition-colors"
        >
          Split Payment
        </button>
        <button
          onClick={() => setView('escalate')}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Escalate to super admin
        </button>
      </div>
    </div>
  )

  const renderReleaseFunds = () => (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Release funds to vendor</h1>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900">Issue: {dispute.issue} - Case {dispute.id}</h3>
        <p className="text-xl font-bold text-gray-900 mt-2">{dispute.amount}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Release Date</label>
          <div className="relative">
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <FiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Admin Notes</label>
          <textarea
            rows={4}
            placeholder="Document why this decision was made"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button className="px-8 py-3 bg-[#0B2E6F] text-white font-semibold rounded-lg hover:bg-[#092456] transition-colors">
          Confirm release
        </button>
        <button
          onClick={() => setView('detail')}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  const renderRefundClient = () => (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Refund Client</h1>

      <div className="bg-[#E0F2FE] border-l-4 border-[#0CA5E9] p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900">Issue: {dispute.issue} - Case {dispute.id}</h3>
        <p className="text-xl font-bold text-gray-900 mt-2">{dispute.amount}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Release Date</label>
          <div className="relative">
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <FiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Refund Amount</label>
          <input
            type="text"
            value={refundAmount || dispute.amount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Admin Notes</label>
          <textarea
            rows={4}
            placeholder="Document why this decision was made"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button className="px-8 py-3 bg-[#0B2E6F] text-white font-semibold rounded-lg hover:bg-[#092456] transition-colors">
          Confirm release
        </button>
        <button
          onClick={() => setView('detail')}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  const renderSplitPayment = () => (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Split Payment</h1>

      <div className="bg-[#FFFBEB] border-l-4 border-[#FBBF24] p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900">Issue: {dispute.issue} - Case {dispute.id}</h3>
        <p className="text-xl font-bold text-gray-900 mt-2">{dispute.amount}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Release Date</label>
          <div className="relative">
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <FiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount to Vendor</label>
          <input
            type="text"
            placeholder="₦250,000"
            value={vendorAmount}
            onChange={(e) => setVendorAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount to Client</label>
          <input
            type="text"
            placeholder="₦250,000"
            value={clientAmount}
            onChange={(e) => setClientAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Admin Notes</label>
          <textarea
            rows={4}
            placeholder="Document why this decision was made"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button className="px-8 py-3 bg-[#0B2E6F] text-white font-semibold rounded-lg hover:bg-[#092456] transition-colors">
          Confirm release
        </button>
        <button
          onClick={() => setView('detail')}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  const renderEscalate = () => (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Escalate to Super Admin</h1>

      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900">Issue: {dispute.issue} - Case {dispute.id}</h3>
        <p className="text-xl font-bold text-gray-900 mt-2">{dispute.amount}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Escalation Reason</label>
          <select
            value={escalationReason}
            onChange={(e) => setEscalationReason(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select reason</option>
            <option value="complex">Complex Legal Issue</option>
            <option value="high_value">High Value Dispute</option>
            <option value="conflict">Conflict of Interest</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Admin Recommendation</label>
          <textarea
            rows={4}
            placeholder="Provide your recommendation"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button className="px-8 py-3 bg-[#0B2E6F] text-white font-semibold rounded-lg hover:bg-[#092456] transition-colors">
          Escalate to Super Admin
        </button>
        <button
          onClick={() => setView('detail')}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        {view === 'detail' ? (
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to disputes
          </Link>
        ) : (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to disputes
          </button>
        )}
      </div>

      {view === 'detail' && renderDetail()}
      {view === 'release' && renderReleaseFunds()}
      {view === 'refund' && renderRefundClient()}
      {view === 'split' && renderSplitPayment()}
      {view === 'escalate' && renderEscalate()}
    </div>
  )
}

