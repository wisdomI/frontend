'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { FiPlus, FiChevronDown, FiDownload } from 'react-icons/fi'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function MyEarningsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Over' | 'Under' | 'On Track'>('All')
  const filterRef = useRef<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [googleRendered, setGoogleRendered] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  // API state
  const [earningsData, setEarningsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setStatusFilterOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const timeout = setTimeout(() => {
      if (!googleRendered) setUseFallback(true)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [isMounted, googleRendered])

  // Fetch earnings data from API
  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true)
        // This would be replaced with actual API call
        // const response = await earningsAPI.getUserEarnings()
        // setEarningsData(response.data.data)
        
        // For now, using mock data structure since API might not be implemented yet
        const mockData = {
          summary: {
            total: 2500000,
            planned: 2500000,
            actual: 2435000,
          },
          categories: [
            { name: 'Catering', planned: 800000, actual: 750000 },
            { name: 'Decoration', planned: 400000, actual: 420000 },
            { name: 'Photography', planned: 300000, actual: 280000 },
            { name: 'Entertainment', planned: 200000, actual: 220000 },
            { name: 'Venue', planned: 700000, actual: 700000 },
            { name: 'Transport', planned: 150000, actual: 170000 },
            { name: 'Miscellaneous', planned: 100000, actual: 85000 },
          ]
        }
        setEarningsData(mockData)
      } catch (err) {
        setError('Failed to fetch earnings data')
        console.error('Error fetching earnings data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEarningsData()
  }, [])

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'My Earnings', isActive: true }]}
          title="My Earnings"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'My Earnings', isActive: true }]}
          title="My Earnings"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!earningsData) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'My Earnings', isActive: true }]}
          title="My Earnings"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">No earnings data available</p>
        </div>
      </div>
    )
  }

  const balance = earningsData.summary.total - earningsData.summary.actual
  const filteredCategories = earningsData.categories.filter((cat: any) => {
    if (statusFilter === 'All') return true
    if (statusFilter === 'Over') return cat.actual > cat.planned
    if (statusFilter === 'Under') return cat.actual < cat.planned
    if (statusFilter === 'On Track') return cat.actual === cat.planned
    return true
  })

  const chartData = {
    labels: filteredCategories.map((cat: any) => cat.name),
    datasets: [
      {
        label: 'Planned',
        data: filteredCategories.map((cat: any) => cat.planned),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual',
        data: filteredCategories.map((cat: any) => cat.actual),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  }

  const doughnutData = {
    labels: filteredCategories.map((cat: any) => cat.name),
    datasets: [
      {
        data: filteredCategories.map((cat: any) => cat.actual),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (actual: number, planned: number) => {
    if (actual > planned) return 'text-green-600'
    if (actual < planned) return 'text-red-600'
    return 'text-blue-600'
  }

  const getStatusText = (actual: number, planned: number) => {
    if (actual > planned) return 'Over Budget'
    if (actual < planned) return 'Under Budget'
    return 'On Track'
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[{ label: 'My Earnings', isActive: true }]}
        title="My Earnings"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.summary.total)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiDownload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actual Spending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.summary.actual)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiDownload className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              balance >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <FiDownload className={`w-6 h-6 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual</h3>
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{statusFilter}</span>
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {statusFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {['All', 'Over', 'Under', 'On Track'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status as any)
                        setStatusFilterOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="h-80">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredCategories.map((category: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Planned: {formatCurrency(category.planned)}
                    </span>
                    <span className="text-sm text-gray-600">
                      Actual: {formatCurrency(category.actual)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getStatusColor(category.actual, category.planned)}`}>
                    {getStatusText(category.actual, category.planned)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(category.actual - category.planned)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Planned Amount</label>
                <input
                  type="number"
                  placeholder="Enter planned amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    setShowAddModal(false)
                    setShowSuccess(true)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSuccess(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <FiPlus className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Added Successfully!</h3>
              <p className="text-gray-600 mb-4">The new category has been added to your earnings breakdown.</p>
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