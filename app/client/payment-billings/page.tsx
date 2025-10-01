'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FiCalendar, FiSearch, FiFilter, FiMoreVertical, FiDownload, FiEye, FiCreditCard } from 'react-icons/fi'
import PaymentModal from '@/components/ui/modals/PaymentModal'
import InvoiceModal from '@/components/ui/modals/InvoiceModal'
import PaymentSuccessModal from '@/components/ui/modals/PaymentSuccessModal'
import ClientPageHeader from '@/components/client/ClientPageHeader'

interface Transaction {
  id: string
  dateTime: string
  invoiceNumber: string
  vendor: string
  paymentMethod: string
  amount: number
  status: 'unpaid' | 'overdue' | 'paid'
}

const transactions: Transaction[] = [
  {
    id: '1',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'N/A',
    amount: 200000,
    status: 'unpaid'
  },
  {
    id: '2',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'N/A',
    amount: 200000,
    status: 'unpaid'
  },
  {
    id: '3',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'N/A',
    amount: 200000,
    status: 'unpaid'
  },
  {
    id: '4',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'N/A',
    amount: 200000,
    status: 'unpaid'
  },
  {
    id: '5',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'N/A',
    amount: 200000,
    status: 'overdue'
  },
  {
    id: '6',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'N/A',
    amount: 200000,
    status: 'overdue'
  },
  {
    id: '7',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Transfer',
    amount: 200000,
    status: 'paid'
  },
  {
    id: '8',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Card',
    amount: 200000,
    status: 'paid'
  },
  {
    id: '9',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Transfer',
    amount: 200000,
    status: 'paid'
  },
  {
    id: '10',
    dateTime: '20/07/2025; 02:25pm',
    invoiceNumber: '88783',
    vendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Card',
    amount: 200000,
    status: 'paid'
  }
]

const banks = [
  'Access Bank',
  'United Bank for Africa (UBA)',
  'Keystone Bank',
  'Sterling Bank',
  'Zenith Bank',
  'Union Bank',
  'Kuda Microfinance Bank',
  'First Bank'
]

export default function PaymentBillingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const statusFilterRef = useRef<HTMLDivElement | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'unpaid':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const handlePayment = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowPaymentModal(true)
    setShowDropdown(null)
  }

  const handleViewInvoice = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowInvoiceModal(true)
    setShowDropdown(null)
  }

  const handleDownloadInvoice = (transaction: Transaction) => {
    // Simulate download
    console.log('Downloading invoice:', transaction.invoiceNumber)
    setShowDropdown(null)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setShowSuccessModal(true)
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
    }
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsStatusOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <ClientPageHeader
        breadcrumbs={[
          { label: 'My Account' },
          { label: 'Payment & Billing' },
          { label: 'Pending', isActive: true }
        ]}
        title="Payment & Billings"
        showDateRange={true}
        fromDate={fromDate}
        toDate={toDate}
      />

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
        {/* Search and Filter - Inside table container */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  placeholder="Search by Invoice Number, Vendor"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:self-end" ref={statusFilterRef}>
              <span className="text-xs sm:text-sm text-gray-600">Filter:</span>
              <div className="relative z-20">
                <button
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium"
                  aria-haspopup="listbox"
                  aria-expanded={isStatusOpen}
                >
                  <span>{statusFilter === 'all' ? 'Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isStatusOpen && (
                  <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] sm:max-w-none bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <ul role="listbox" className="py-1 text-xs sm:text-sm">
                      {['all','unpaid','overdue','paid'].map((status) => (
                        <li key={status}>
                          <button
                            role="option"
                            aria-selected={statusFilter === status}
                            onClick={() => {
                              setStatusFilter(status)
                              setIsStatusOpen(false)
                            }}
                            className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 ${statusFilter === status ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                          >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Desktop Table (visible from lg and up) */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Date & Time
                </th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Invoice #
                </th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Event Vendor
                </th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Payment Method
                </th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">
                    {transaction.dateTime}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 font-medium">
                    {transaction.invoiceNumber}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm">
                    <a href="#" className="text-blue-600 hover:text-blue-800 underline cursor-pointer truncate block">
                      {transaction.vendor}
                    </a>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-center">
                    <div className="relative flex justify-center">
                      <button
                        onClick={() => setShowDropdown(showDropdown === transaction.id ? null : transaction.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                      >
                        <FiMoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      
                      {showDropdown === transaction.id && (
                        <div className="absolute right-0 sm:right-4 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleViewInvoice(transaction)}
                              className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FiEye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              View Invoice
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(transaction)}
                              className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FiDownload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Download
                            </button>
                            {transaction.status !== 'paid' && (
                              <button
                                onClick={() => handlePayment(transaction)}
                                className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FiCreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Proceed to Pay
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card List (hidden on lg and up) */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Invoice #{transaction.invoiceNumber}</div>
                <span className={getStatusBadge(transaction.status)}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              <div className="text-xs text-gray-600">{transaction.dateTime}</div>
              <div className="text-sm text-gray-800">
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  {transaction.vendor}
                </a>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Method: {transaction.paymentMethod}</span>
                <span className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleViewInvoice(transaction)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleDownloadInvoice(transaction)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
                >
                  <FiDownload className="w-4 h-4" />
                  Download
                </button>
                {transaction.status !== 'paid' && (
                  <button
                    onClick={() => handlePayment(transaction)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md"
                  >
                    <FiCreditCard className="w-4 h-4" />
                    Pay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-700">
            Showing 1-10 of 20
          </div>
          <div className="flex items-center space-x-1 text-xs sm:text-sm">
            <button className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded-md">
              1
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
              2
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
              3
            </button>
            <span className="px-2 text-xs sm:text-sm text-gray-500 hidden sm:block">...</span>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
              7
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
              10
            </button>
            <button className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && selectedTransaction && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          transaction={selectedTransaction}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {showInvoiceModal && selectedTransaction && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          transaction={selectedTransaction}
        />
      )}

      {showSuccessModal && (
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="Payment received successfully!"
          actionText="View receipt"
          onAction={() => {
            setShowSuccessModal(false)
            setShowInvoiceModal(true)
          }}
        />
      )}
    </div>
  )
}