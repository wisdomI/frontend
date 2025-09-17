'use client'

import React, { useState } from 'react'
import { FiSearch, FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiCheck, FiPause, FiX } from 'react-icons/fi'
import SubscriptionPricingModal from '@/components/ui/modals/SubscriptionPricingModal'
import FlexiblePlansModal from '@/components/ui/modals/FlexiblePlansModal'
import SubscriptionConfirmationModal from '@/components/ui/modals/SubscriptionConfirmationModal'
import SubscriptionSuccessModal from '@/components/ui/modals/SubscriptionSuccessModal'

interface PaymentRecord {
  id: number
  dateTime: string
  plan: string
  billingCycle: string
  billingPeriod: string
  paymentMethod: string
  amount: string
  paymentStatus: 'Pending' | 'Paid'
}

export default function ManageSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<'All' | 'Basic' | 'Standard' | 'Premium'>('All')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAmount, setShowAmount] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'Active' | 'Inactive'>('Inactive')
  
  // Modal states
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState({
    name: '',
    billingCycle: '',
    amount: ''
  })
  const [isFlexiblePlansModalOpen, setIsFlexiblePlansModalOpen] = useState(false)

  const paymentData: PaymentRecord[] = [
    { id: 1, dateTime: '20/07/2025; 02:25pm', plan: 'Basic', billingCycle: 'Monthly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Card', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 2, dateTime: '20/07/2025; 02:25pm', plan: 'Premium', billingCycle: 'Quarterly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Transfer', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 3, dateTime: '20/07/2025; 02:25pm', plan: 'Standard', billingCycle: 'Yearly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Card', amount: 'N200,000.00', paymentStatus: 'Paid' },
    { id: 4, dateTime: '20/07/2025; 02:25pm', plan: 'Basic', billingCycle: 'Monthly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Transfer', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 5, dateTime: '20/07/2025; 02:25pm', plan: 'Standard', billingCycle: 'Quarterly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Card', amount: 'N200,000.00', paymentStatus: 'Paid' },
    { id: 6, dateTime: '20/07/2025; 02:25pm', plan: 'Premium', billingCycle: 'Yearly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Transfer', amount: 'N200,000.00', paymentStatus: 'Paid' },
    { id: 7, dateTime: '20/07/2025; 02:25pm', plan: 'Basic', billingCycle: 'Monthly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Card', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 8, dateTime: '20/07/2025; 02:25pm', plan: 'Standard', billingCycle: 'Quarterly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Transfer', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 9, dateTime: '20/07/2025; 02:25pm', plan: 'Premium', billingCycle: 'Yearly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Card', amount: 'N200,000.00', paymentStatus: 'Pending' },
    { id: 10, dateTime: '20/07/2025; 02:25pm', plan: 'Basic', billingCycle: 'Monthly', billingPeriod: '06/07/2025 - 15/08/2025', paymentMethod: 'Transfer', amount: 'N200,000.00', paymentStatus: 'Pending' },
  ]

  const filteredPayments = paymentData.filter(payment => {
    const matchesSearch = payment.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === 'All' || payment.plan === filterPlan
    return matchesSearch && matchesPlan
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalPages = Math.ceil(filteredPayments.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = Math.min(startIndex + 10, filteredPayments.length)
  const currentPayments = filteredPayments.slice(startIndex, endIndex)

  // Modal handlers
  const handleViewPricing = () => {
    setIsFlexiblePlansModalOpen(true)
  }

  const handlePlanSelect = (planName: string, billingCycle: string, amount: string) => {
    setSelectedPlan({ name: planName, billingCycle, amount })
    setIsFlexiblePlansModalOpen(false)
    setIsConfirmationModalOpen(true)
  }

  const handlePaymentConfirm = () => {
    setIsConfirmationModalOpen(false)
    
    // Show success modal after payment
    setTimeout(() => {
      setIsSuccessModalOpen(true)
    }, 500)
  }

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false)
    setSubscriptionStatus('Active')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Subscriptions</h1>
          <button 
            onClick={handleViewPricing}
            className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#032D71' }}
          >
            <FiEye className="w-4 h-4" />
            View Subscription Pricing
          </button>
        </div>

        {/* Subscription Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Subscription Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-20 h-20 border border-white rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">EventHub</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscriptionStatus === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Status: {subscriptionStatus}
                </span>
              </div>
              
              <p className="text-blue-100 mb-4">Current Plan: Premium</p>
              
              <div className="mb-4">
                <p className="text-blue-100 text-sm">Subscription Amount</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-yellow-300">
                    {showAmount ? '₦250,000.00' : '₦ **********'}
                  </p>
                  <button 
                    onClick={() => setShowAmount(!showAmount)}
                    className="p-1 hover:bg-blue-500 rounded"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500">
                <div>
                  <p className="text-blue-100 text-sm">Next Billing Date</p>
                  <p className="font-semibold">23rd Sept. 2025</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Billing Cycle</p>
                  <p className="font-semibold">Yearly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            
            <div className="space-y-3">
              <button 
                className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-3"
                onClick={() => setSubscriptionStatus('Active')}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Activate Subscription</span>
              </button>
              
              <button 
                className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-3"
                onClick={() => setSubscriptionStatus('Inactive')}
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FiX className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-medium text-gray-900">Deactivate Subscription</span>
              </button>
              
              <button className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FiPause className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="font-medium text-gray-900">Pause Subscription</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              See more
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by Invoice Number, Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Filter by Plan */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Filter by:</span>
                <div className="relative">
                  <select
                    value={filterPlan}
                    onChange={(e) => setFilterPlan(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-white font-medium focus:ring-2 focus:border-transparent appearance-none pr-8"
                    style={{ backgroundColor: '#032D71', '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  >
                    <option value="All">Plan</option>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">From:</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onChange={(e) => setToDate(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                    />
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Cycle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.dateTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.billingCycle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.billingPeriod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1}-{endIndex} of {filteredPayments.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt; Previous
                </button>
                
                {/* Page Numbers */}
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 2 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  2
                </button>
                <span className="px-2 text-sm text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(7)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 7 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  7
                </button>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modals */}
      <FlexiblePlansModal
        isOpen={isFlexiblePlansModalOpen}
        onClose={() => setIsFlexiblePlansModalOpen(false)}
        onSelectPlan={handlePlanSelect}
      />

      <SubscriptionPricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSelectPlan={handlePlanSelect}
      />

      <SubscriptionConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        planName={selectedPlan.name}
        billingCycle={selectedPlan.billingCycle}
        amount={selectedPlan.amount}
        payerName="Daniel Adebayo"
        bankInfo="Access Bank - 6318777898"
      />

      <SubscriptionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        planName={selectedPlan.name}
        billingCycle={selectedPlan.billingCycle}
      />
    </div>
  )
}