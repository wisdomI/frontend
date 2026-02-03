'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

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

const STORAGE_KEY = 'vendorSupportTickets'

function formatDate(ts: number) {
  const d = new Date(ts)
  return d.toLocaleDateString() + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const HistoryPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All')

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SupportTicket[]
      setTickets(existing)
    } catch (err) {
      console.error('Failed to load tickets', err)
    }
  }, [])

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const byStatus = statusFilter === 'All' || t.status === statusFilter
      const byQuery = !query || t.id.includes(query)
      return byStatus && byQuery
    })
  }, [tickets, statusFilter, query])

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/vendor/help-support" className="text-event-blue hover:underline">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-800">Support History</h1>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Ticket ID"
          className="flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border rounded-lg px-3 py-3 text-sm"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-500 border-b">
          <div className="col-span-3">Date & Time</div>
          <div className="col-span-2">Ticket ID</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Issue Type</div>
          <div className="col-span-3">Status</div>
        </div>
        {filtered.map((t) => (
          <div key={t.id} className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 text-sm">
            <div className="col-span-3">{formatDate(t.createdAt)}</div>
            <div className="col-span-2 font-mono">{t.id}</div>
            <div className="col-span-2">{t.category}</div>
            <div className="col-span-2">{t.issueType}</div>
            <div className="col-span-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>
                {t.status}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">No tickets yet.</div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage


