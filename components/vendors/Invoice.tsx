'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiCalendar, FiMoreVertical } from 'react-icons/fi'
import { invoiceAPI } from '@/lib/api'
import { Invoice as InvoiceType } from '@/types/api'

type Invoice = {
  id: string
  date: string
  number: string
  client: string
  service: string
  amount: string
  status: 'Unpaid' | 'Paid' | 'Overdue' | 'Draft' | 'Sent' | 'Cancelled'
}

const statusStyles: Record<Invoice['status'], string> = {
  Unpaid: 'bg-yellow-100 text-yellow-800',
  Paid: 'bg-green-100 text-green-800',
  Overdue: 'bg-red-100 text-red-800',
  Draft: 'bg-gray-100 text-gray-800',
  Sent: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Invoice['status'] | 'All'>('All')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch invoices from API on component mount
  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      console.log('📥 Fetching invoices from API...')
      const response = await invoiceAPI.getAll()
      const apiInvoices = response.data.data || []
      console.log('✅ Invoices loaded from API:', apiInvoices)
      
      // Transform API data to component format
      const transformedInvoices: Invoice[] = apiInvoices.map((inv: InvoiceType) => ({
        id: inv.id,
        date: new Date(inv.createdAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        number: inv.invoiceNumber,
        client: inv.clientName,
        service: inv.items.map(item => item.description).join(', ') || 'Services',
        amount: `₦${inv.total.toLocaleString()}`,
        status: inv.status === 'paid' ? 'Paid' : 
                inv.status === 'overdue' ? 'Overdue' : 
                inv.status === 'sent' ? 'Unpaid' : 
                inv.status.charAt(0).toUpperCase() + inv.status.slice(1) as any
      }))
      
      setInvoices(transformedInvoices)
      console.log('✅ Invoices transformed and displayed:', transformedInvoices.length)
    } catch (error: any) {
      console.error('❌ Error fetching invoices:', error)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.number.includes(search) ||
      inv.client.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || inv.status === filter
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search and Filter Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Invoice Number, Name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Filter by:</span>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as Invoice['status'] | 'All')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-white font-medium focus:ring-2 focus:border-transparent"
              style={{ backgroundColor: '#032D71', '--tw-ring-color': '#032D71' } as React.CSSProperties}
            >
              <option value="All">Payment Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">From:</span>
            <div className="relative">
              <input
                type="text"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">To:</span>
            <div className="relative">
              <input
                type="text"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium w-20 text-center ${statusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {loading ? 'Loading invoices...' : 'No invoices found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (currentPage <= 4) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = currentPage - 3 + i
              }
              
              if (i === 3 && totalPages > 7 && currentPage < totalPages - 3) {
                return <span key={i} className="px-2 text-gray-500">...</span>
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === pageNum
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={currentPage === pageNum ? { backgroundColor: '#032D71' } : {}}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
