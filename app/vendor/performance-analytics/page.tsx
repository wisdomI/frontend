'use client'

import { useState } from 'react'

export default function PerformanceAnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState('monthly')
  const [isPremiumUser, setIsPremiumUser] = useState(false) // This would come from user subscription status
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)

  const analyticsData = {
    totalBookings: 45,
    totalRevenue: 125000,
    averageRating: 4.8,
    completionRate: 94,
    responseTime: '2.5 hours',
    clientSatisfaction: 96,
    // New premium metrics
    serviceRequestClicks: 324,
    profileViews: 1247,
    savedToFavorites: 89,
    totalClients: 67,
    conversionRate: 12.5
  }

  const chartData = [
    { month: 'Jan', bookings: 12, revenue: 32000 },
    { month: 'Feb', bookings: 15, revenue: 38000 },
    { month: 'Mar', bookings: 18, revenue: 45000 },
    { month: 'Apr', bookings: 22, revenue: 52000 },
    { month: 'May', bookings: 19, revenue: 48000 },
    { month: 'Jun', bookings: 25, revenue: 62000 }
  ]

  const topServices = [
    { name: 'Wedding Planning', bookings: 15, revenue: 45000, rating: 4.9 },
    { name: 'Corporate Events', bookings: 12, revenue: 38000, rating: 4.7 },
    { name: 'Birthday Parties', bookings: 10, revenue: 25000, rating: 4.8 },
    { name: 'Photography', bookings: 8, revenue: 17000, rating: 4.6 }
  ]

  // Premium analytics data
  const eventTypeData = [
    { type: 'Weddings', bookings: 15, revenue: 45000, clicks: 89, views: 234 },
    { type: 'Corporate Events', bookings: 12, revenue: 38000, clicks: 67, views: 189 },
    { type: 'Birthday Parties', bookings: 10, revenue: 25000, clicks: 54, views: 156 },
    { type: 'Anniversaries', bookings: 5, revenue: 12000, clicks: 32, views: 98 },
    { type: 'Baby Showers', bookings: 3, revenue: 8000, clicks: 23, views: 67 }
  ]

  const clientInsightsData = {
    newClients: 23,
    returningClients: 34,
    cancelledClients: 10,
    clientRetentionRate: 77.2,
    newClientGrowth: 15.3,
    clientLifetimeValue: 1850
  }

  const engagementMetrics = [
    { metric: 'Service Request Clicks', value: 324, change: 18, icon: '👆' },
    { metric: 'Profile Views', value: 1247, change: 24, icon: '👁️' },
    { metric: 'Saved to Favorites', value: 89, change: 12, icon: '❤️' },
    { metric: 'Total Clients', value: 67, change: 8, icon: '👥' },
    { metric: 'Conversion Rate', value: 12.5, change: 2.1, icon: '📈', unit: '%' }
  ]

  const periodOptions = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'yearly', label: 'Yearly' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦')
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    
    // Simulate API call for upgrade process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would make an API call to upgrade the user
      setIsPremiumUser(true)
      setUpgradeSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpgradeSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Upgrade failed:', error)
      // Handle upgrade failure
    } finally {
      setIsUpgrading(false)
    }
  }

  const PremiumUpgradeCard = () => (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="text-white">
          <h3 className="text-xl font-bold mb-2">Unlock Premium Analytics</h3>
          <p className="text-purple-100 mb-4">Get detailed insights into your business performance with advanced metrics</p>
          <ul className="text-sm text-purple-100 space-y-1">
            <li className="transform transition-all duration-300 hover:text-white hover:translate-x-1">• Engagement metrics (clicks, views, favorites)</li>
            <li className="transform transition-all duration-300 hover:text-white hover:translate-x-1">• Client insights (new, returning, cancelled)</li>
            <li className="transform transition-all duration-300 hover:text-white hover:translate-x-1">• Event type performance analysis</li>
            <li className="transform transition-all duration-300 hover:text-white hover:translate-x-1">• Advanced conversion tracking</li>
          </ul>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white mb-2">₦2,999</div>
          <div className="text-purple-200 text-sm mb-4">per month</div>
          <button 
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 hover:scale-105 hover:shadow-lg transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isUpgrading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span>Upgrading...</span>
              </div>
            ) : (
              'Upgrade Now'
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
            <p className="text-sm sm:text-base text-gray-600">Track your business performance and growth metrics</p>
          </div>
          {!isPremiumUser && (
            <div className="flex items-center space-x-2">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Free Plan
              </span>
            </div>
          )}
          {isPremiumUser && (
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
                ✨ Premium
              </span>
            </div>
          )}
          
        </div>
      </div>

      {!isPremiumUser && <PremiumUpgradeCard />}

      {/* Premium Welcome Section */}
      {isPremiumUser && !upgradeSuccess && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">🎉 Welcome to Premium Analytics!</h3>
              <p className="text-purple-600 mb-4">You now have access to all advanced features and insights to grow your business.</p>
              <div className="flex items-center space-x-4 text-sm text-purple-600">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full Analytics Access
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced Insights
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority Support
                </span>
              </div>
            </div>
            <div className="text-6xl">🚀</div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {upgradeSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 transform transition-all duration-500 animate-in slide-in-from-top">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                🎉 Upgrade Successful!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Welcome to Premium Analytics! You now have access to all advanced features and insights.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {periodOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActivePeriod(option.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activePeriod === option.id
                  ? 'bg-white text-event-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{analyticsData.totalBookings}</p>
              <p className="text-sm text-green-600 mt-1 group-hover:text-green-700 transition-colors duration-300">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-300">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{formatCurrency(analyticsData.totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1 group-hover:text-green-700 transition-colors duration-300">+18% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-green-600 group-hover:text-green-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-yellow-600 transition-colors duration-300">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors duration-300">{analyticsData.averageRating}</p>
              <p className="text-sm text-green-600 mt-1 group-hover:text-green-700 transition-colors duration-300">+0.2 from last month</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">{analyticsData.completionRate}%</p>
              <p className="text-sm text-green-600 mt-1 group-hover:text-green-700 transition-colors duration-300">+2% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{analyticsData.responseTime}</p>
              <p className="text-sm text-green-600 mt-1 group-hover:text-green-700 transition-colors duration-300">-0.5h from last month</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-pink-600 transition-colors duration-300">Client Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-pink-700 transition-colors duration-300">{analyticsData.clientSatisfaction}%</p>
              <p className="text-sm text-green-600 mt-1 group-hover:text-green-700 transition-colors duration-300">+3% from last month</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full group-hover:bg-pink-200 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-pink-600 group-hover:text-pink-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Engagement Metrics */}
      {isPremiumUser && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">📊</span>
            Engagement Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagementMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group hover:border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300">{metric.metric}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                      {metric.value}{metric.unit || ''}
                    </p>
                    <p className="text-sm text-green-600 mt-1 group-hover:text-green-700 transition-colors duration-300">
                      +{metric.change}{metric.unit || ''} from last month
                    </p>
                  </div>
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{metric.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Insights Panel */}
      {isPremiumUser && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">👥</span>
            Client Insights
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-green-50 cursor-pointer group">
                <div className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">{clientInsightsData.newClients}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">New Clients</div>
                <div className="text-xs text-green-600 group-hover:text-green-700 transition-colors duration-300">+{clientInsightsData.newClientGrowth}% growth</div>
              </div>
              <div className="text-center p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-blue-50 cursor-pointer group">
                <div className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">{clientInsightsData.returningClients}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Returning Clients</div>
                <div className="text-xs text-blue-600 group-hover:text-blue-700 transition-colors duration-300">Loyal customers</div>
              </div>
              <div className="text-center p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-red-50 cursor-pointer group">
                <div className="text-3xl font-bold text-red-600 group-hover:text-red-700 transition-colors duration-300">{clientInsightsData.cancelledClients}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Cancelled</div>
                <div className="text-xs text-red-600 group-hover:text-red-700 transition-colors duration-300">Need attention</div>
              </div>
              <div className="text-center p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-purple-50 cursor-pointer group">
                <div className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">{clientInsightsData.clientRetentionRate}%</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Retention Rate</div>
                <div className="text-xs text-purple-600 group-hover:text-purple-700 transition-colors duration-300">Strong performance</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-50 cursor-pointer group">
                <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">{formatCurrency(clientInsightsData.clientLifetimeValue)}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Average Client Lifetime Value</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-event-blue transition-colors duration-300">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group/chart">
                <div 
                  className="w-full bg-event-blue rounded-t transition-all duration-500 hover:bg-blue-600 hover:shadow-lg cursor-pointer transform hover:scale-105"
                  style={{ 
                    height: `${(data.revenue / Math.max(...chartData.map(d => d.revenue))) * 200}px`,
                    animationDelay: `${index * 100}ms`
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2 group-hover/chart:text-gray-700 transition-colors duration-300">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">Bookings Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group/chart">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600 hover:shadow-lg cursor-pointer transform hover:scale-105"
                  style={{ 
                    height: `${(data.bookings / Math.max(...chartData.map(d => d.bookings))) * 200}px`,
                    animationDelay: `${index * 100}ms`
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2 group-hover/chart:text-gray-700 transition-colors duration-300">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Services</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {topServices.map((service, index) => (
            <div key={index} className="p-6 transform transition-all duration-300 hover:bg-gray-50 hover:scale-[1.02] cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-event-blue group-hover:text-white transition-all duration-300">
                      <span className="text-sm font-medium text-gray-600 group-hover:text-white transition-colors duration-300">#{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-event-blue transition-colors duration-300">{service.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                      <span>{service.bookings} bookings</span>
                      <span>{formatCurrency(service.revenue)}</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1 group-hover:text-yellow-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {service.rating}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2 group-hover:bg-gray-300 transition-colors duration-300">
                    <div 
                      className="bg-event-blue h-2 rounded-full transition-all duration-500 group-hover:bg-blue-600"
                      style={{ width: `${(service.bookings / Math.max(...topServices.map(s => s.bookings))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Type Analytics - Premium Feature */}
      {isPremiumUser && (
        <div className="bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">🎉</span>
              Event Type Performance
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {eventTypeData.map((event, index) => (
              <div key={index} className="p-6 transform transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:scale-[1.02] cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center group-hover:from-orange-500 group-hover:to-pink-600 transition-all duration-300 group-hover:scale-110">
                        <span className="text-white font-bold text-sm">{event.type.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-700 transition-colors duration-300">{event.type}</h4>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                        <span>{event.bookings} bookings</span>
                        <span>{formatCurrency(event.revenue)}</span>
                        <span>{event.clicks} clicks</span>
                        <span>{event.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
                        {((event.clicks / event.views) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Click Rate</div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 group-hover:bg-gray-300 transition-colors duration-300">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all duration-500 group-hover:from-orange-500 group-hover:to-pink-600"
                        style={{ width: `${(event.bookings / Math.max(...eventTypeData.map(e => e.bookings))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Plan Teaser */}
      {!isPremiumUser && (
        <div className="bg-gray-50 rounded-lg p-8 text-center transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4 transform transition-all duration-300 hover:scale-110 hover:rotate-12">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-700 transition-colors duration-300">Unlock Advanced Analytics</h3>
            <p className="text-gray-600 mb-6 hover:text-gray-700 transition-colors duration-300">
              Get detailed insights into event types, client behavior, and engagement metrics to grow your business.
            </p>
            <button 
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isUpgrading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Upgrading...</span>
                </div>
              ) : (
                'Upgrade to Premium - ₦2,999/month'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
