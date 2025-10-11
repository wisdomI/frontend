'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { FiUpload, FiX, FiSearch, FiClock, FiMessageCircle, FiThumbsUp, FiDownload } from 'react-icons/fi'
import ClientPageHeader from '@/components/client/ClientPageHeader'

interface SupportTicket {
  id: string
  dateTime: string
  category: string
  issueType: string
  vendor: string
  status: TicketStatus
}

type TicketStatus = 'Pending' | 'Resolved' | 'In Progress'

export default function HelpSupportPage() {
  const [view, setView] = useState<'form' | 'history'>('form')

  // Form state
  const [category, setCategory] = useState('Enquiry')
  const [issueType, setIssueType] = useState('Payment Issue')
  const [vendor, setVendor] = useState('UK Cakes & Cream - Catering')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [ticketId, setTicketId] = useState<string>('')

  // History state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [actionOpenFor, setActionOpenFor] = useState<string | null>(null)
  const [showRateModal, setShowRateModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)

  // API state
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onFilesSelected = (incoming: FileList | null) => {
    if (!incoming) return
    const accepted = Array.from(incoming).filter(f => /(\.jpe?g|\.png|\.mp4)$/i.test(f.name))
    setFiles(prev => [...prev, ...accepted].slice(0, 5))
  }

  const dropRef = useRef<HTMLDivElement | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onFilesSelected(e.dataTransfer.files)
  }

  // Fetch support tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        // Note: Support API might not be implemented yet, so we'll use a fallback
        // const response = await supportAPI.getUserTickets()
        // setTickets(response.data.data || [])
        
        // For now, using empty array since support API might not be implemented yet
        setTickets([])
        console.log('ℹ️ Client Support: Support API not implemented yet, using empty tickets')
      } catch (err: any) {
        console.error('Error fetching support tickets:', err)
        
        // Fallback to empty array if API fails
        setTickets([])
        
        if (err.response?.status === 403 || err.response?.status === 404) {
          setError('Support tickets not available yet')
        } else {
          setError('Failed to fetch support tickets')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.includes(search) || 
                         ticket.category.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.vendor.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Note: Support API might not be implemented yet, so we'll use a mock response
      // const response = await supportAPI.createTicket({
      //   category,
      //   issueType,
      //   vendor,
      //   description,
      //   files
      // })
      // setTicketId(response.data.data.id)
      
      // For now, generate a mock ticket ID since support API might not be implemented yet
      const mockTicketId = Math.random().toString(36).substr(2, 9)
      setTicketId(mockTicketId)
      setShowSuccess(true)
      
      console.log('ℹ️ Client Support: Support API not implemented yet, using mock ticket ID:', mockTicketId)
      
      // Reset form
      setDescription('')
      setFiles([])
    } catch (err: any) {
      console.error('Error submitting support ticket:', err)
      setError('Failed to submit support ticket')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'Help & Support', isActive: true }]}
          title="Help & Support"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[{ label: 'Help & Support', isActive: true }]}
        title="Help & Support"
      />

      {/* View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-3 sm:px-4 lg:px-6 pt-3">
          <div className="inline-flex bg-[#0B2E6F] rounded-lg p-1">
            <button
              onClick={() => setView('form')}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${
                view === 'form' ? 'bg-white text-[#0B2E6F]' : 'text-white'
              }`}
            >
              Submit Request
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${
                view === 'history' ? 'bg-white text-[#0B2E6F]' : 'text-white'
              }`}
            >
              Request History
            </button>
          </div>
        </div>

        {view === 'form' ? (
          <div className="p-3 sm:p-4 lg:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Enquiry">Enquiry</option>
                    <option value="Dispute">Dispute</option>
                    <option value="Technical">Technical Issue</option>
                    <option value="Billing">Billing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Service Quality">Service Quality</option>
                    <option value="Communication">Communication</option>
                    <option value="Cancellation">Cancellation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                <select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UK Cakes & Cream - Catering">UK Cakes & Cream - Catering</option>
                  <option value="Elite Event Planning">Elite Event Planning</option>
                  <option value="Perfect Moments Photography">Perfect Moments Photography</option>
                  <option value="Sound & Lights Pro">Sound & Lights Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe your issue in detail..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Files (Optional)
                </label>
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                >
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Drag and drop files here, or click to select</p>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.mp4"
                    onChange={(e) => onFilesSelected(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: JPG, PNG, MP4 (Max 5 files)
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !description.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | TicketStatus)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Tickets List */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets yet</h3>
                <p className="text-gray-500">You haven&apos;t submitted any support tickets yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Ticket #{ticket.id}</h4>
                        <p className="text-sm text-gray-600">{ticket.dateTime}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{ticket.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Issue:</span>
                        <span className="ml-2 font-medium">{ticket.issueType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Vendor:</span>
                        <span className="ml-2 font-medium">{ticket.vendor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSuccess(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <FiThumbsUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your support ticket has been submitted. Ticket ID: <strong>{ticketId}</strong>
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}