'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { vendorsData } from '@/data/vendors'

type TicketStatus = 'Pending' | 'Resolved'

type SupportTicket = {
  id: string
  createdAt: number
  category: 'Dispute' | 'Enquiry'
  issueType: string
  reason: string
  vendor?: string
  files: { name: string; size: number }[]
  description: string
  status: TicketStatus
}

const ISSUE_TYPES: Record<string, string[]> = {
  'Payment Issue': [
    'Incorrect Invoice Amount',
    'Duplicate Invoice',
    'Unauthorized Charge',
    'Billing Error',
    'Payment Processing Issue',
    'Refund or Credit Issue',
    'Service/Product Not Delivered',
  ],
  'Account Issue': ['Login Problem', 'Profile Update Failure', 'Verification Issue'],
  'Technical Issue': ['Feature Not Working', 'App Crash', 'Slow Performance'],
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(0)}${sizes[i]}`
}

function generateTicketId(): string {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

const STORAGE_KEY = 'vendorSupportTickets'

const HelpSupportPage = () => {
  const [category, setCategory] = useState<'Dispute' | 'Enquiry'>('Dispute')
  const [issueType, setIssueType] = useState<string>('Payment Issue')
  const [reason, setReason] = useState<string>('Incorrect Invoice Amount')
  const [vendor, setVendor] = useState<string>('UK Cakes & Cream - Catering')
  const [files, setFiles] = useState<{ name: string; size: number }[]>([])
  const [description, setDescription] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<{ visible: boolean; id?: string }>({ visible: false })
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // Sync reason with issueType
    const options = ISSUE_TYPES[issueType]
    if (options && options.length > 0) {
      setReason(options[0])
    }
  }, [issueType])

  const reasonOptions = useMemo(() => ISSUE_TYPES[issueType] || [], [issueType])

  const onBrowseFiles = () => {
    inputRef.current?.click()
  }

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list) return
    const next = Array.from(list).map(f => ({ name: f.name, size: f.size }))
    setFiles(prev => [...prev, ...next])
    // reset
    e.target.value = ''
  }

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const list = e.dataTransfer.files
    if (!list) return
    const next = Array.from(list).map(f => ({ name: f.name, size: f.size }))
    setFiles(prev => [...prev, ...next])
  }

  const onSubmit = () => {
    const id = generateTicketId()
    const ticket: SupportTicket = {
      id,
      createdAt: Date.now(),
      category,
      issueType,
      reason,
      vendor,
      files,
      description,
      status: 'Pending',
    }
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SupportTicket[]
      existing.unshift(ticket)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
      setShowSuccess({ visible: true, id })
      // reset form
      setDescription('')
      setFiles([])
    } catch (err) {
      console.error('Failed to persist ticket', err)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
        <Link href="/vendor/help-support/history" className="inline-flex items-center gap-2 bg-blue-50 text-event-blue px-3 py-2 rounded-lg hover:bg-blue-100">
          <span>View Support History</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Send us a message</h2>

        {/* Category */}
        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'Dispute' | 'Enquiry')}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue"
          >
            <option>Dispute</option>
            <option>Enquiry</option>
          </select>
        </div>

        {/* Issue Type */}
        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue"
          >
            {Object.keys(ISSUE_TYPES).map(k => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue"
          >
            {reasonOptions.map(r => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Vendor (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Event/Vendor <span className="text-gray-400">(Optional)</span></label>
          <select
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue"
          >
            {vendorsData.map(v => (
              <option key={v.id}>{`${v.vendorName} - ${v.title.split(' - ')[0] || v.category}`}</option>
            ))}
          </select>
        </div>

        {/* Upload area */}
        <div className="mb-3">
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center text-gray-600 bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">📎</div>
            <p className="text-sm">Choose a file or drag & drop it here</p>
            <p className="text-xs text-gray-400 mb-3">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
            <button type="button" onClick={onBrowseFiles} className="bg-event-blue text-white rounded-md px-4 py-2 hover:bg-event-blue-hover">Browse File</button>
            <input ref={inputRef} type="file" multiple className="hidden" onChange={onFilesSelected} />
          </div>
        </div>

        {/* Files list */}
        {files.length > 0 && (
          <div className="mb-3 space-y-1">
            {files.map((f, idx) => (
              <div key={`${f.name}-${idx}`} className="flex items-center justify-between text-sm text-gray-700">
                <span className="truncate">{f.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Size: {formatBytes(f.size)}</span>
                  <button
                    onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-600"
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your message"
            className="w-full min-h-[120px] border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={onSubmit} className="bg-event-blue text-white px-6 py-3 rounded-lg hover:bg-event-blue-hover">Submit</button>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess.visible && (
        <div className="fixed bottom-6 right-6 bg-green-50 border border-green-300 text-gray-800 rounded-xl shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="text-green-600 text-xl">✔</div>
            <div>
              <p className="font-semibold">Successful</p>
              <p className="text-sm">Your request has been sent successfully to the Admin.</p>
              {showSuccess.id && (
                <p className="text-sm mt-1">Your Ticket ID number is <span className="font-bold">{showSuccess.id}</span>.</p>
              )}
            </div>
            <button className="ml-auto" aria-label="Close" onClick={() => setShowSuccess({ visible: false })}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HelpSupportPage
