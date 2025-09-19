'use client'

import React, { useState } from 'react'
import { FiSearch, FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import WithdrawEarningsModal from '@/components/ui/modals/WithdrawEarningsModal'
import WithdrawalConfirmationModal from '@/components/ui/modals/WithdrawalConfirmationModal'
import ChangeBankDetailsModal from '@/components/ui/modals/ChangeBankDetailsModal'
import PendingPayoutNotification from '@/components/ui/modals/PendingPayoutNotification'
import SuccessModal from '@/components/ui/modals/SuccessModal'

interface EarningRecord {
  id: number
  dateTime: string
  clientName: string
  serviceType: string
  amount: string
  paymentStatus: 'Released' | 'Pending' | 'Paid'
}

export default function MyEarningsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Released' | 'Pending' | 'Paid'>('All')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'Earning History' | 'Withdrawal History'>('Earning History')
  const [selectedPeriod, setSelectedPeriod] = useState('Jul 2025')
  const [selectedView, setSelectedView] = useState('Daily')
  
  // Withdrawal modal states
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isChangeBankModalOpen, setIsChangeBankModalOpen] = useState(false)
  const [isPendingPayoutOpen, setIsPendingPayoutOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successModalType, setSuccessModalType] = useState<'withdrawal' | 'bank-update'>('withdrawal')
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    recipientName: ''
  })

  const earningsData: EarningRecord[] = [
    { id: 1, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Released' },
    { id: 2, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 3, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Released' },
    { id: 4, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 5, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Paid' },
    { id: 6, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Paid' },
    { id: 7, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 8, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Paid' },
    { id: 9, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Paid' },
    { id: 10, dateTime: '20/07/2025; 02:25pm', clientName: 'Daniel Adebayo', serviceType: 'Catering & Drinks', amount: 'N200,000.00', paymentStatus: 'Pending' },
  ]

  const filteredEarnings = earningsData.filter(earning => {
    const matchesSearch = earning.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         earning.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || earning.paymentStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Released':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalPages = Math.ceil(filteredEarnings.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = Math.min(startIndex + 10, filteredEarnings.length)
  const currentEarnings = filteredEarnings.slice(startIndex, endIndex)

  // Withdrawal handlers
  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true)
  }

  const handleWithdrawContinue = (amount: string, bankName: string, accountNumber: string) => {
    setWithdrawalData({
      amount,
      bankName,
      accountNumber,
      recipientName: 'Daniel Martins' // This would typically come from the account verification
    })
    setIsWithdrawModalOpen(false)
    setIsConfirmationModalOpen(true)
  }

  const handleWithdrawalConfirm = () => {
    // Here you would typically make an API call to process the withdrawal
    console.log('Processing withdrawal:', withdrawalData)
    setIsConfirmationModalOpen(false)
    
    // Show pending payout notification first
    setTimeout(() => {
      setIsPendingPayoutOpen(true)
    }, 500)
  }

  const handleWithdrawModalClose = () => {
    setIsWithdrawModalOpen(false)
  }

  const handleConfirmationModalClose = () => {
    setIsConfirmationModalOpen(false)
  }

  const handleChangeBankClick = () => {
    setIsChangeBankModalOpen(true)
  }

  const handleChangeBankSave = (bankName: string, accountNumber: string) => {
    console.log('Updating bank details:', { bankName, accountNumber })
    setIsChangeBankModalOpen(false)
    
    // Show success modal for bank update
    setSuccessModalType('bank-update')
    setIsSuccessModalOpen(true)
  }

  const handleChangeBankClose = () => {
    setIsChangeBankModalOpen(false)
  }

  const handlePendingPayoutClose = () => {
    setIsPendingPayoutOpen(false)
    
    // After closing pending payout, show withdrawal success
    setTimeout(() => {
      setSuccessModalType('withdrawal')
      setIsSuccessModalOpen(true)
    }, 500)
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">My Earnings</h1>
        </div>

        {/* Earnings Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-900">₦500,000.00</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Payout */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-sm border border-orange-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-orange-700 mb-1">Pending Payout</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-900">₦100,000.00</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <FiTrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Withdrawable Balance */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Withdrawable Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-green-900">₦100,000.00</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Withdrawal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Earnings Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Earning</h3>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 text-xs sm:text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  >
                    <option value="Jul 2025">Jul 2025</option>
                    <option value="Jun 2025">Jun 2025</option>
                    <option value="May 2025">May 2025</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={selectedView}
                    onChange={(e) => setSelectedView(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 text-xs sm:text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Earnings Chart */}
            <div className="h-48 sm:h-64 bg-gray-50 rounded-lg p-3 sm:p-6 relative">
              <svg width="100%" height="100%" viewBox="0 0 500 200" className="overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="50" y1="20" x2="450" y2="20" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="50" x2="450" y2="50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="80" x2="450" y2="80" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="110" x2="450" y2="110" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="140" x2="450" y2="140" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="170" x2="450" y2="170" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                
                {/* Chart line */}
                <polyline
                  fill="none"
                  stroke="#032D71"
                  strokeWidth="2.5"
                  points="70,150 110,80 150,90 190,50 230,60 270,40 310,30 350,25 390,20"
                  className="drop-shadow-sm"
                />
                
                {/* Data points */}
                <circle cx="70" cy="150" r="3" fill="#032D71" />
                <circle cx="110" cy="80" r="3" fill="#032D71" />
                <circle cx="150" cy="90" r="3" fill="#032D71" />
                <circle cx="190" cy="50" r="3" fill="#032D71" />
                <circle cx="230" cy="60" r="3" fill="#032D71" />
                <circle cx="270" cy="40" r="3" fill="#032D71" />
                <circle cx="310" cy="30" r="3" fill="#032D71" />
                <circle cx="350" cy="25" r="3" fill="#032D71" />
                <circle cx="390" cy="20" r="3" fill="#032D71" />
                
                {/* Y-axis labels */}
                <text x="25" y="25" fontSize="11" fill="#6b7280" textAnchor="end">1,500</text>
                <text x="25" y="55" fontSize="11" fill="#6b7280" textAnchor="end">1,200</text>
                <text x="25" y="85" fontSize="11" fill="#6b7280" textAnchor="end">900</text>
                <text x="25" y="115" fontSize="11" fill="#6b7280" textAnchor="end">600</text>
                <text x="25" y="145" fontSize="11" fill="#6b7280" textAnchor="end">300</text>
                <text x="25" y="175" fontSize="11" fill="#6b7280" textAnchor="end">0</text>
                
                {/* X-axis labels */}
                <text x="70" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">1 Jul</text>
                <text x="110" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">2 Jul</text>
                <text x="150" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">3 Jul</text>
                <text x="190" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">4 Jul</text>
                <text x="230" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">5 Jul</text>
                <text x="270" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">6 Jul</text>
                <text x="310" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">7 Jul</text>
                <text x="350" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">8 Jul</text>
                <text x="390" y="190" fontSize="11" fill="#6b7280" textAnchor="middle">12 Jul</text>
                
                {/* Y-axis title */}
                <text x="15" y="100" fontSize="12" fill="#6b7280" textAnchor="middle" transform="rotate(-90, 15, 100)">Amount (₦)</text>
                
                {/* X-axis title */}
                <text x="250" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">Days</text>
              </svg>
              
              {/* Chart Data Point Tooltip */}
              <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">08 Jul 2025</p>
                <p className="text-sm font-semibold text-gray-900">₦50,000</p>
              </div>
            </div>
          </div>

          {/* Withdrawal Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Withdrawal Details</h3>
            
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">612926972 - Access Bank</p>
                <p className="text-xs text-gray-500">Daniel Adebayo</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleWithdrawClick}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                style={{ backgroundColor: '#032D71' }}
              >
                Withdraw Earnings
              </button>
              <button 
                onClick={handleChangeBankClick}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Change Bank Details
              </button>
            </div>
          </div>
        </div>

        {/* Earnings History Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('Earning History')}
                className={`text-sm font-medium pb-2 ${
                  activeTab === 'Earning History'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Earning History
              </button>
              <button
                onClick={() => setActiveTab('Withdrawal History')}
                className={`text-sm font-medium pb-2 ${
                  activeTab === 'Withdrawal History'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Withdrawal History
              </button>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              See more
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search by Invoice Number, Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Filter by Status */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium text-sm">Filter by:</span>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-white font-medium focus:ring-2 focus:border-transparent appearance-none pr-8 text-sm sm:text-base"
                      style={{ backgroundColor: '#032D71', '--tw-ring-color': '#032D71' } as React.CSSProperties}
                    >
                      <option value="All">Payment Status</option>
                      <option value="Released">Released</option>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium text-sm">From:</span>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base w-full"
                        style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                      />
                      <FiCalendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium text-sm">To:</span>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base w-full"
                        style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                      />
                      <FiCalendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEarnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{earning.dateTime}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{earning.clientName}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{earning.serviceType}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{earning.amount}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(earning.paymentStatus)}`}>
                        {earning.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-gray-700">
                Showing {startIndex + 1}-{endIndex} of {filteredEarnings.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt; Previous
                </button>
                
                {/* Page Numbers */}
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                    currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                    currentPage === 2 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                    currentPage === 3 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  3
                </button>
                <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(7)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                    currentPage === 7 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  7
                </button>
                <button
                  onClick={() => setCurrentPage(10)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                    currentPage === 10 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  10
                </button>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modals */}
      <WithdrawEarningsModal
        isOpen={isWithdrawModalOpen}
        onClose={handleWithdrawModalClose}
        onContinue={handleWithdrawContinue}
        balance="₦300,000.00"
      />

      <WithdrawalConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleConfirmationModalClose}
        onConfirm={handleWithdrawalConfirm}
        amount={withdrawalData.amount}
        recipientName={withdrawalData.recipientName}
        bankInfo={`${withdrawalData.bankName} - ${withdrawalData.accountNumber}`}
      />

      <ChangeBankDetailsModal
        isOpen={isChangeBankModalOpen}
        onClose={handleChangeBankClose}
        onSave={handleChangeBankSave}
      />

      <PendingPayoutNotification
        isOpen={isPendingPayoutOpen}
        onClose={handlePendingPayoutClose}
        amount="₦200,000.00"
        dueDate="31/07/2025"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        type={successModalType}
        withdrawalData={successModalType === 'withdrawal' ? {
          amount: withdrawalData.amount,
          recipientName: withdrawalData.recipientName,
          bankInfo: `${withdrawalData.bankName} - ${withdrawalData.accountNumber}`
        } : undefined}
      />
    </div>
  )
}
