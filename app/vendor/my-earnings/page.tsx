'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useVendorEarnings } from '@/hooks/useVendorEarnings'
import { useWithdrawal } from '@/hooks/useWithdrawal'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js'
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
  const [activePageTab, setActivePageTab] = useState<'Earnings' | 'Expenses Tracker'>('Earnings')
  const [selectedPeriod, setSelectedPeriod] = useState('Jul 2025')
  const [selectedView, setSelectedView] = useState('Daily')

  // API hooks
  const { 
    earnings, 
    withdrawals, 
    stats, 
    bankDetails, 
    loading: earningsLoading, 
    error: earningsError,
    fetchEarnings,
    requestWithdrawal,
    updateBankDetails
  } = useVendorEarnings()
  
  // Withdrawal/Bank management hook
  const {
    bankAccounts,
    withdrawals: withdrawalsList,
    stats: withdrawalStats,
    loading: withdrawalLoading,
    error: withdrawalError,
    refetchBankAccounts,
    refetchWithdrawals,
    refetchStats: refetchWithdrawalStats
  } = useWithdrawal()
  
  // Expenses tracker state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [showExpenseToast, setShowExpenseToast] = useState(false)
  const [expenses, setExpenses] = useState<Array<{ date: string; category: string; desc: string; amount: number }>>([])
  const [expensesLoading, setExpensesLoading] = useState(false)
  const [expensesOverview, setExpensesOverview] = useState<any>(null)

  // Fetch expenses from API
  useEffect(() => {
    if (activePageTab === 'Expenses Tracker') {
      fetchExpenses()
      fetchExpensesOverview()
    }
  }, [activePageTab])

  const fetchExpenses = async () => {
    setExpensesLoading(true)
    try {
      console.log('📥 Fetching expenses from API...')
      const { expensesAPI } = await import('@/lib/api')
      const response = await expensesAPI.getAll()
      const apiExpenses = response.data.data || []
      console.log('✅ Expenses loaded from API:', apiExpenses)
      
      // Transform to component format
      const transformedExpenses = apiExpenses.map((exp: any) => ({
        date: new Date(exp.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        category: exp.category.charAt(0).toUpperCase() + exp.category.slice(1),
        desc: exp.description || 'No description',
        amount: exp.amount
      }))
      
      setExpenses(transformedExpenses)
      console.log('✅ Expenses transformed:', transformedExpenses.length)
    } catch (error: any) {
      console.error('❌ Error fetching expenses:', error)
      setExpenses([])
    } finally {
      setExpensesLoading(false)
    }
  }

  const fetchExpensesOverview = async () => {
    try {
      console.log('📥 Fetching expenses overview from API...')
      const { expensesAPI } = await import('@/lib/api')
      const response = await expensesAPI.getOverview()
      setExpensesOverview(response.data.data)
      console.log('✅ Expenses overview loaded:', response.data.data)
    } catch (error: any) {
      console.error('❌ Error fetching expenses overview:', error)
    }
  }

  // KPI values for Expenses Tracker - use API data
  const totalEarningsKpi = stats?.totalEarnings || expensesOverview?.totalEarnings || 0
  const totalExpensesKpi = expensesOverview?.totalExpenses || expenses.reduce((sum, e) => sum + e.amount, 0)
  const netProfitKpi = totalEarningsKpi - totalExpensesKpi
  const profitMarginKpi = (netProfitKpi / totalEarningsKpi) * 100

  // Chart.js registration (only once)
  useMemo(() => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, ChartTooltip, ChartLegend)
    return undefined
  }, [])

  const expensesChartData = useMemo(() => ({
    labels: ['Earnings', 'Expenses', 'Net Profit'],
    datasets: [
      {
        label: 'Amount (₦)',
        data: [totalEarningsKpi, totalExpensesKpi, netProfitKpi],
        backgroundColor: ['#10B981', '#EF4444', '#2563EB'],
        borderRadius: 6,
      },
    ],
  }), [totalEarningsKpi, totalExpensesKpi, netProfitKpi])

  const expensesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `₦${ctx.parsed.y.toLocaleString('en-NG')}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `₦${Number(value).toLocaleString('en-NG')}`,
        },
      },
    },
  } as const

  const formatNaira = (n: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)
  
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

  // Transform earnings from API to EarningRecord format
  const earningsData: EarningRecord[] = useMemo(() => {
    if (!earnings || earnings.length === 0) {
      console.log('ℹ️ No earnings data from API yet')
      return []
    }
    
    console.log('🔄 Transforming earnings data:', earnings.length, 'records')
    return earnings.map((earning: any) => ({
      id: earning.id,
      dateTime: new Date(earning.createdAt || earning.date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      clientName: earning.clientName || 'Unknown Client',
      serviceType: earning.description || earning.source || 'Service',
      amount: `₦${earning.amount.toLocaleString()}`,
      paymentStatus: earning.status === 'completed' ? 'Released' : 
                     earning.status === 'pending' ? 'Pending' : 'Paid'
    }))
  }, [earnings])

  // Transform withdrawals from API to display format
  const withdrawalsData = useMemo(() => {
    if (!withdrawalsList || withdrawalsList.length === 0) {
      console.log('ℹ️ No withdrawals data from API yet')
      return []
    }
    
    console.log('🔄 Transforming withdrawals data:', withdrawalsList.length, 'records')
    return withdrawalsList.map((withdrawal: any) => ({
      id: withdrawal.id,
      dateTime: new Date(withdrawal.createdAt || withdrawal.date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      reference: withdrawal.reference || '-',
      bankName: withdrawal.BankAccount?.bankName || 'Unknown Bank',
      accountNumber: withdrawal.BankAccount?.accountNumber || '-',
      amount: `₦${(withdrawal.amount || 0).toLocaleString()}`,
      status: withdrawal.status || 'pending',
      processedAt: withdrawal.processedAt ? new Date(withdrawal.processedAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) : '-'
    }))
  }, [withdrawalsList])

  const filteredEarnings = earningsData.filter(earning => {
    const matchesSearch = earning.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         earning.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || earning.paymentStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredWithdrawals = withdrawalsData.filter(withdrawal => {
    const matchesSearch = withdrawal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.bankName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Pending' && withdrawal.status === 'pending') ||
                         (filterStatus === 'Released' && withdrawal.status === 'completed') ||
                         (filterStatus === 'Paid' && withdrawal.status === 'processing')
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

  const currentData = activeTab === 'Earning History' ? filteredEarnings : filteredWithdrawals
  const totalPages = Math.ceil(currentData.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = Math.min(startIndex + 10, currentData.length)
  const currentEarnings = filteredEarnings.slice(startIndex, endIndex)
  const currentWithdrawals = filteredWithdrawals.slice(startIndex, endIndex)

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

  const handleChangeBankSave = async (bankName: string, accountNumber: string) => {
    console.log('Bank details updated')
    setIsChangeBankModalOpen(false)
    
    // Refresh bank accounts to show updated data
    await refetchBankAccounts()
    await refetchWithdrawalStats()
    
    // Show success modal for bank update if bank details were changed
    if (bankName || accountNumber) {
      setSuccessModalType('bank-update')
      setIsSuccessModalOpen(true)
    }
  }

  const handleChangeBankClose = () => {
    setIsChangeBankModalOpen(false)
    // Refresh bank accounts when modal closes
    refetchBankAccounts()
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
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Earnings & Expenses</h1>
        </div>
        
        {/* Top Tabs */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActivePageTab('Earnings')}
              className={`text-sm font-medium pb-3 -mb-px ${
                activePageTab === 'Earnings' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActivePageTab('Expenses Tracker')}
              className={`text-sm font-medium pb-3 -mb-px ${
                activePageTab === 'Expenses Tracker' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Expenses Tracker
            </button>
          </div>
        </div>

        {activePageTab === 'Earnings' && (
        <>
        {/* Earnings Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-900">
                  ₦{(stats?.totalEarnings || 0).toLocaleString()}
                </p>
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
                <p className="text-lg sm:text-2xl font-bold text-orange-900">
                  ₦{(stats?.pendingEarnings || 0).toLocaleString()}
                </p>
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
                <p className="text-lg sm:text-2xl font-bold text-green-900">
                  ₦{(stats?.completedEarnings || 0).toLocaleString()}
                </p>
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
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Earnings VS Withdrawal Performance</h3>
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
            <div className="bg-gray-50 rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row">
              {/* Chart Area */}
              <div className="w-full sm:w-3/4 h-56 sm:h-72">
                <svg width="100%" height="100%" viewBox="0 0 500 200" className="overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="50" y1="20" x2="450" y2="20" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="50" x2="450" y2="50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="80" x2="450" y2="80" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="110" x2="450" y2="110" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="140" x2="450" y2="140" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="50" y1="170" x2="450" y2="170" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>

                {/* Shaded area under Earnings (green) */}
                <defs>
                  <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#earningsFill)"
                  points="70,100 110,60 150,65 190,40 230,45 270,35 310,25 350,30 390,10 390,170 70,170"
                />

                {/* Earnings line (green) */}
                <polyline
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="2.5"
                  points="70,100 110,60 150,65 190,40 230,45 270,35 310,25 350,30 390,10"
                />

                {/* Withdrawal line (blue) */}
                <polyline
                  fill="none"
                  stroke="#032D71"
                  strokeWidth="2.5"
                  points="70,150 110,120 150,125 190,100 230,110 270,95 310,90 350,105 390,75"
                />
                
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
                <text x="-15" y="100" fontSize="12" fill="#6b7280" textAnchor="middle" transform="rotate(-90, -15, 100)">No. of Earnings</text>
                
                {/* X-axis title */}
                <text x="250" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">Days</text>
                </svg>
              </div>

              {/* Side Legend */}
              <div className="w-full sm:w-1/4 sm:pl-4 mt-4 sm:mt-0">
                <div className="flex sm:flex-col gap-4 sm:gap-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
                    <span className="font-medium">Earnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#032D71' }}></span>
                    <span className="font-medium">Withdrawal</span>
                  </div>
                </div>
                {/* Sample tooltip (static placeholder) */}
                <div className="mt-4 bg-white/80 border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <p className="text-xs text-gray-500">08 Jul</p>
                  <p className="text-xs"><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: '#22C55E' }}></span>Earnings: 1,200</p>
                  <p className="text-xs"><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: '#032D71' }}></span>Withdrawal: 600</p>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Withdrawal Details</h3>
              {withdrawalLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
            
            {/* Loading State */}
            {withdrawalLoading && !bankAccounts.length ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading bank details...</p>
                </div>
              </div>
            ) : bankAccounts && bankAccounts.length > 0 ? (
              <>
                {/* Primary Bank Account */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {bankAccounts[0].accountNumber} - {bankAccounts[0].bankName}
                    </p>
                    <p className="text-xs text-gray-500">{bankAccounts[0].accountName}</p>
                    {bankAccounts[0].isVerified && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Withdrawal Statistics */}
                {withdrawalStats && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 mb-1">Total Withdrawals</p>
                        <p className="font-semibold text-gray-900">
                          ₦{(withdrawalStats.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Pending</p>
                        <p className="font-semibold text-orange-600">
                          ₦{(withdrawalStats.pendingAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Completed</p>
                        <p className="font-semibold text-green-600">
                          {withdrawalStats.completedWithdrawals || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Failed</p>
                        <p className="font-semibold text-red-600">
                          {withdrawalStats.failedWithdrawals || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={handleWithdrawClick}
                    disabled={!bankAccounts[0].isVerified}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-white rounded-lg font-medium transition-colors text-sm sm:text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
                    style={{ backgroundColor: bankAccounts[0].isVerified ? '#032D71' : undefined }}
                  >
                    Withdraw Earnings
                  </button>
                  <button 
                    onClick={handleChangeBankClick}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    {bankAccounts.length > 1 ? 'Manage Bank Details' : 'Change Bank Details'}
                  </button>
                </div>
              </>
            ) : (
              /* No Bank Account State */
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No Bank Account</p>
                <p className="text-xs text-gray-500 mb-4">Add a bank account to withdraw earnings</p>
                <button 
                  onClick={handleChangeBankClick}
                  className="px-4 py-2 text-white rounded-lg font-medium transition-colors text-sm"
                  style={{ backgroundColor: '#032D71' }}
                >
                  Add Bank Account
                </button>
              </div>
            )}
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
            {activeTab === 'Earning History' ? (
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
                  {earningsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-3 sm:px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm text-gray-500">Loading earnings...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentEarnings.length > 0 ? (
                    currentEarnings.map((earning) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 sm:px-6 py-8 text-center">
                        <p className="text-sm text-gray-500">No earnings found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawalLoading ? (
                    <tr>
                      <td colSpan={6} className="px-3 sm:px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm text-gray-500">Loading withdrawals...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentWithdrawals.length > 0 ? (
                    currentWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{withdrawal.dateTime}</td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-mono">{withdrawal.reference}</td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div>{withdrawal.bankName}</div>
                          <div className="text-gray-500 text-xs">{withdrawal.accountNumber}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{withdrawal.amount}</td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${
                            withdrawal.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            withdrawal.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">{withdrawal.processedAt}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 sm:px-6 py-8 text-center">
                        <p className="text-sm text-gray-500">No withdrawals found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-gray-700">
                Showing {startIndex + 1}-{endIndex} of {currentData.length}
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
        </>
        )}

        {activePageTab === 'Expenses Tracker' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{formatNaira(totalEarningsKpi)}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12h14v2H5z"/></svg>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Expenses</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">{formatNaira(totalExpensesKpi)}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h12V7H6v12zm-2 2V5h16v16H4z"/></svg>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Net Profit</p>
                <p className="text-lg sm:text-2xl font-bold text-green-700">{formatNaira(netProfitKpi)}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-700" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/></svg>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Profit Margin</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">{profitMarginKpi.toFixed(1)}%</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v2H3zm2 4h14v14H5z"/></svg>
                </div>
              </div>
            </div>

            {/* Expense Management + CTA */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Expense Management</h3>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm"
                >
                  <span>+</span> Add Expense
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="h-48 sm:h-56">
                  <Bar data={expensesChartData} options={expensesChartOptions} />
                </div>
              </div>
            </div>

            {/* Recent Expenses Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Expenses</h3>
                <div>
                  <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900">{row.date}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{row.category}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{row.desc}</td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{formatNaira(row.amount)}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          <div className="flex items-center gap-3">
                            <button className="text-blue-600 hover:text-blue-800">✎</button>
                            <button className="text-red-600 hover:text-red-800">🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Success toast */}
            {showExpenseToast && (
              <div className="fixed top-6 right-6 bg-white border-2 border-green-400 rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 z-50">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">✓</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Successful</p>
                  <p className="text-xs text-gray-600">You have successfully added an expense</p>
                </div>
                <button onClick={() => setShowExpenseToast(false)} className="ml-4 text-gray-400 hover:text-gray-600">✕</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddExpenseOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <ExpenseForm
              onCancel={() => setIsAddExpenseOpen(false)}
              onSave={async (payload) => {
                try {
                  console.log('💾 Saving expense to API:', payload)
                  const { expensesAPI } = await import('@/lib/api')
                  
                  // Create expense via API
                  const expenseData = {
                    category: payload.category.toLowerCase() as any,
                    amount: payload.amount,
                    date: new Date().toISOString(),
                    description: payload.desc,
                    receiptUrl: (payload as any).receiptUrl
                  }
                  
                  const response = await expensesAPI.create(expenseData)
                  console.log('✅ Expense created successfully:', response.data)
                  
                  // Add to local state for immediate display
                setExpenses((prev) => [{ ...payload }, ...prev])
                  
                  // Refresh from API to ensure sync
                  fetchExpenses()
                  fetchExpensesOverview()
                  
                setIsAddExpenseOpen(false)
                setShowExpenseToast(true)
                setTimeout(() => setShowExpenseToast(false), 3000)
                } catch (error: any) {
                  console.error('❌ Error creating expense:', error)
                  alert('Failed to create expense. Please try again.')
                }
              }}
            />
          </div>
        </div>
      )}

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

interface ExpenseFormValues {
  date: string
  category: string
  desc: string
  amount: number
}

function ExpenseForm({ onCancel, onSave }: { onCancel: () => void; onSave: (payload: ExpenseFormValues) => void }) {
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('2025-09-02')
  const [desc, setDesc] = useState('')

  const categories = ['Marketing', 'Staff', 'Equipment', 'Materials', 'Transport', 'Utilities', 'Souvenirs']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount.replace(/[^0-9.]/g, ''))
    if (!category || !parsed || !date) return
    const d = new Date(date)
    const formatted = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`
    onSave({ category, amount: parsed, date: formatted, desc })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description of the expense" className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[100px]" />
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white">Save Expense</button>
      </div>
    </form>
  )
}
