'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { FiChevronDown, FiMoreVertical, FiPaperclip, FiSearch, FiX } from 'react-icons/fi'
import ClientPageHeader from '@/components/client/ClientPageHeader'

type TicketStatus = 'Pending' | 'Resolved'

interface SupportTicket {
  id: string
  dateTime: string
  category: string
  issueType: string
  vendor: string
  status: TicketStatus
}

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

  const tickets: SupportTicket[] = useMemo(() => (
    Array.from({ length: 10 }).map((_, i) => ({
      id: (175623 + i).toString(),
      dateTime: '20/07/2025; 02:25pm',
      category: i % 3 === 0 ? 'Dispute' : 'Enquiry',
      issueType: 'Payment Issue',
      vendor: 'UK Cakes & Cream - Catering',
      status: i % 2 === 0 ? 'Pending' : 'Resolved'
    }))
  ), [])

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTicketId(Math.floor(10000 + Math.random() * 90000).toString())
    setShowSuccess(true)
  }

  // close actions on escape
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setActionOpenFor(null) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [])

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[
          { label: 'My Account' },
          { label: 'Help & Support', isActive: true }
        ]}
        title="Help & Support"
      >
        {view === 'form' ? (
          <button onClick={() => setView('history')} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-900 font-semibold text-sm shadow-inner">
            View Support History
          </button>
        ) : (
          <button onClick={() => setView('form')} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-900 font-semibold text-sm shadow-inner">
            Send Message
          </button>
        )}
      </ClientPageHeader>

      {view === 'form' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Enquiry</option>
                      <option>Dispute</option>
                      <option>Feedback</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">Issue Type</label>
                  <div className="relative">
                    <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Payment Issue</option>
                      <option>Unauthorized Charge</option>
                      <option>Billing Error</option>
                      <option>Refund or Credit Issue</option>
                      <option>Service/Product Not Delivered</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">Select Event Vendor <span className="text-gray-400">(Optional)</span></label>
                  <div className="relative">
                    <select value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>UK Cakes & Cream - Catering</option>
                      <option>Elite Event Planning</option>
                      <option>Perfect Moments Photography</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Upload */}
              <div>
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 sm:p-6 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <FiPaperclip className="w-6 h-6" />
                    <p className="text-xs sm:text-sm">Choose a file or drag & drop it here</p>
                    <p className="text-[10px] sm:text-xs">JPEG, PNG, JPG, and MP4 formats, up to 50MB</p>
                    <label className="inline-flex items-center justify-center px-3 py-2 mt-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm cursor-pointer">
                      Browse File
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.mp4"
                        multiple
                        className="hidden"
                        onChange={(e) => onFilesSelected(e.target.files)}
                      />
                    </label>
                  </div>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between text-xs sm:text-sm text-gray-700 bg-gray-50 rounded-md px-3 py-2">
                        <span className="truncate">{f.name}</span>
                        <span className="text-gray-500 ml-2">Size: {(f.size / 1024).toFixed(0)}kb</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Enter your message"
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="px-4 sm:px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Ticket ID"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">From:</span>
                <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-32 sm:w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">To:</span>
                <input value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-32 sm:w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="relative">
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm" onClick={() => setStatusFilter(prev => prev === 'all' ? 'Pending' : prev === 'Pending' ? 'Resolved' : 'all')}>
                  Filter by: <span className="font-semibold">{statusFilter === 'all' ? 'All' : statusFilter}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Issue Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event Vendor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Support Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(t => (
                  <tr key={t.id} className="border-b">
                    <td className="px-6 py-4 text-sm text-gray-700">{t.dateTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.issueType}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 truncate max-w-[240px]">{t.vendor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button onClick={() => setActionOpenFor(actionOpenFor === t.id ? null : t.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                        <FiMoreVertical />
                      </button>
                      {actionOpenFor === t.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm">
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setShowChatModal(true); setActionOpenFor(null) }}>View Feedback</button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setShowRateModal(true); setActionOpenFor(null) }}>Rate Support</button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => setActionOpenFor(null)}>Close</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet cards */}
          <div className="lg:hidden divide-y">
            {filteredTickets.map(t => (
              <div key={t.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">Ticket #{t.id}</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{t.status}</span>
                </div>
                <div className="text-xs text-gray-600">{t.dateTime}</div>
                <div className="text-sm text-gray-800">{t.category} • {t.issueType}</div>
                <div className="text-sm text-gray-700 truncate">{t.vendor}</div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md" onClick={() => setShowChatModal(true)}>
                    View Feedback
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md" onClick={() => setShowRateModal(true)}>
                    Rate Support
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (static) */}
          <div className="bg-gray-50 px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700">Showing 1 - 10 of 20</div>
            <div className="flex items-center space-x-1 text-xs sm:text-sm">
              <button className="px-2 py-1 text-gray-500 hover:text-gray-700">Previous</button>
              <button className="px-2 py-1 bg-blue-600 text-white rounded-md">1</button>
              <button className="px-2 py-1 text-gray-500 hover:text-gray-700 hidden sm:block">2</button>
              <button className="px-2 py-1 text-gray-500 hover:text-gray-700 hidden sm:block">3</button>
              <button className="px-2 py-1 text-gray-500 hover:text-gray-700">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowSuccess(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8">
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setShowSuccess(false)}><FiX /></button>
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Successful</h3>
              <p className="text-sm text-gray-600">Your support request has been submitted successfully and has been sent to the Admin.</p>
              <p className="text-sm text-gray-900">Your Ticket ID number is <span className="font-bold">{ticketId}</span>.</p>
              <div className="pt-2">
                <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold" onClick={() => setShowSuccess(false)}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate Support Modal */}
      {showRateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowRateModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8">
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setShowRateModal(false)}><FiX /></button>
            <h3 className="text-xl font-semibold text-gray-900">Rate Your Support Experience</h3>
            <p className="text-sm text-gray-600 mt-1">How was your experience with our support team?</p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4 text-sm grid grid-cols-2 gap-2">
              <div className="text-gray-600">Support Agent:</div><div className="text-gray-900">Alex Johnson</div>
              <div className="text-gray-600">Issue:</div><div className="text-gray-900">Payment Issue</div>
              <div className="text-gray-600">Status:</div><div className="text-gray-900">Resolved</div>
            </div>
            <div className="mt-6">
              <div className="text-sm font-medium text-gray-900 mb-2">Overall Rating</div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-8 h-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea rows={5} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your message" />
            </div>
            <div className="pt-6">
              <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold">Request Service</button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowChatModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setShowChatModal(false)}><FiX /></button>
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Feedback Chat</h3>
              <div className="text-xs text-gray-500 mt-1">23rd Jan. 2025</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              <div className="bg-white rounded-lg shadow-sm p-3 text-sm text-gray-700 w-full">The Vendor is not truthful and i was cheated. I am so unhappy. I need a refund please<br/><span className="text-xs text-gray-500">4:54pm</span></div>
              <div className="bg-white rounded-lg shadow-sm p-3 text-sm text-gray-700 w-full">We have reviewed the issue raised and and we will resolve it in 3 days. Please bear with us.<br/><span className="text-xs text-gray-500">4:54pm</span></div>
              <div className="bg-white rounded-lg shadow-sm p-3 text-sm text-gray-700 w-full">Thanks a lot for the feedback and clarity. I will be expectant<br/><span className="text-xs text-gray-500">4:54pm</span></div>
              <div className="text-center text-xs text-gray-400 pt-2">--- Chat Ended ---</div>
            </div>
            <div className="p-3 border-t flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700"><FiPaperclip /></button>
              <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Type a message" />
              <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


