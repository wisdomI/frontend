'use client'

import React, { useState, useEffect } from 'react'
import { useEarnings } from '@/hooks/useEarnings'
import { useExpenses } from '@/hooks/useExpenses'
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar, FiFilter, FiDownload, FiEye } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

export default function FinanceManager() {
  const {
    earnings,
    overview: earningsOverview,
    loading: earningsLoading,
    error: earningsError,
    fetchEarnings,
    fetchOverview: fetchEarningsOverview,
    fetchEarningsByStatus,
    fetchEarningsByDateRange,
    fetchTotalEarnings
  } = useEarnings()

  const {
    expenses,
    overview: expensesOverview,
    loading: expensesLoading,
    error: expensesError,
    fetchExpenses,
    fetchOverview: fetchExpensesOverview,
    fetchExpensesByCategory,
    fetchExpensesByDateRange: fetchExpensesByDateRangeExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  } = useExpenses()

  const [activeTab, setActiveTab] = useState<'earnings' | 'expenses' | 'overview'>('overview')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  useEffect(() => {
    fetchEarnings()
    fetchExpenses()
    fetchEarningsOverview()
    fetchExpensesOverview()
  }, [])

  const handleCreateExpense = async (expenseData: any) => {
    try {
      await createExpense(expenseData)
      toast.success('Expense created successfully')
      setShowCreateExpenseModal(false)
    } catch (err) {
      toast.error('Failed to create expense')
    }
  }

  const handleUpdateExpense = async (id: string, expenseData: any) => {
    try {
      await updateExpense(id, expenseData)
      toast.success('Expense updated successfully')
      setShowEditExpenseModal(false)
      setEditingExpense(null)
    } catch (err) {
      toast.error('Failed to update expense')
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id)
        toast.success('Expense deleted successfully')
      } catch (err) {
        toast.error('Failed to delete expense')
      }
    }
  }

  const handleDateRangeFilter = async () => {
    if (dateRange.start && dateRange.end) {
      if (activeTab === 'earnings') {
        await fetchEarningsByDateRange(dateRange.start, dateRange.end)
      } else if (activeTab === 'expenses') {
        await fetchExpensesByDateRangeExpenses(dateRange.start, dateRange.end)
      }
    }
  }

  const handleStatusFilter = async (status: string) => {
    setStatusFilter(status)
    if (activeTab === 'earnings' && status !== 'all') {
      await fetchEarningsByStatus(status as 'pending' | 'completed' | 'withdrawn')
    }
  }

  const handleCategoryFilter = async (category: string) => {
    setCategoryFilter(category)
    if (activeTab === 'expenses' && category !== 'all') {
      await fetchExpensesByCategory(category)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'withdrawn': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getExpenseCategoryIcon = (category: string) => {
    switch (category) {
      case 'equipment': return '🔧'
      case 'travel': return '✈️'
      case 'marketing': return '📢'
      case 'software': return '💻'
      case 'office': return '🏢'
      case 'other': return '📦'
      default: return '💰'
    }
  }

  const loading = earningsLoading || expensesLoading
  const error = earningsError || expensesError

  if (loading && earnings.length === 0 && expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Finance Management</h2>
          <p className="text-gray-600">Track your earnings and expenses</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateExpenseModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiTrendingDown className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: FiDollarSign },
            { key: 'earnings', label: 'Earnings', icon: FiTrendingUp },
            { key: 'expenses', label: 'Expenses', icon: FiTrendingDown }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiTrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(earningsOverview?.totalEarnings || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiTrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(expensesOverview?.totalExpenses || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency((earningsOverview?.totalEarnings || 0) - (expensesOverview?.totalExpenses || 0))}
                  </div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FiCalendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(earningsOverview?.pendingEarnings || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Pending Earnings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Earnings</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {earnings.slice(0, 5).map((earning) => (
                  <div key={earning.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FiTrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{earning.source}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(earning.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        +{formatCurrency(earning.amount)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(earning.status)}`}>
                        {earning.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <span className="text-sm">{getExpenseCategoryIcon(expense.category)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        -{formatCurrency(expense.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{expense.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleDateRangeFilter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiFilter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Earnings Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {earnings.map((earning) => (
                    <tr key={earning.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{earning.source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(earning.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(earning.status)}`}>
                          {earning.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(earning.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FiEye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleDateRangeFilter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiFilter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="equipment">Equipment</option>
              <option value="travel">Travel</option>
              <option value="marketing">Marketing</option>
              <option value="software">Software</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{getExpenseCategoryIcon(expense.category)}</span>
                          <span className="text-sm text-gray-900 capitalize">{expense.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingExpense(expense)
                              setShowEditExpenseModal(true)
                            }}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrendingDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Expense Modal */}
      {showCreateExpenseModal && (
        <CreateExpenseModal
          isOpen={showCreateExpenseModal}
          onClose={() => setShowCreateExpenseModal(false)}
          onSubmit={handleCreateExpense}
        />
      )}

      {/* Edit Expense Modal */}
      {showEditExpenseModal && editingExpense && (
        <EditExpenseModal
          isOpen={showEditExpenseModal}
          onClose={() => {
            setShowEditExpenseModal(false)
            setEditingExpense(null)
          }}
          expense={editingExpense}
          onSubmit={(data: any) => handleUpdateExpense(editingExpense.id, data)}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}
    </div>
  )
}

// Placeholder components - these would need to be implemented
function CreateExpenseModal({ isOpen, onClose, onSubmit }: any) {
  return null
}

function EditExpenseModal({ isOpen, onClose, expense, onSubmit }: any) {
  return null
}
