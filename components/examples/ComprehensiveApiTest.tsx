'use client'

import React, { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import {
  authAPI,
  profileAPI,
  portfolioAPI,
  serviceAPI,
  meetingAPI,
  serviceRequestAPI,
  vendorServiceRequestAPI,
  bidAPI,
  vendorResponseAPI,
  ratingAPI,
  messageAPI,
  progressTrackerAPI,
  categoryAPI
} from '@/lib/api'

interface TestResult {
  endpoint: string
  status: 'pending' | 'success' | 'error'
  message: string
  duration?: number
}

export default function ComprehensiveApiTest() {
  const { user } = useAuthContext()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (endpoint: string, status: TestResult['status'], message: string, duration?: number) => {
    setTestResults(prev => [...prev, { endpoint, status, message, duration }])
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    // Test Authentication APIs
    await testAuthAPIs()
    
    // Test Profile APIs
    await testProfileAPIs()
    
    // Test Portfolio APIs (Vendor only)
    if (user?.accountType === 'vendor') {
      await testPortfolioAPIs()
      await testServiceAPIs()
      await testBidAPIs()
      await testVendorResponseAPIs()
      await testProgressTrackerAPIs()
    }
    
    // Test Meeting APIs
    await testMeetingAPIs()
    
    // Test Service Request APIs
    await testServiceRequestAPIs()
    
    // Test Vendor Service Request APIs
    await testVendorServiceRequestAPIs()
    
    // Test Rating APIs
    await testRatingAPIs()
    
    // Test Messaging APIs
    await testMessagingAPIs()
    
    // Test Category APIs
    await testCategoryAPIs()

    setIsRunning(false)
  }

  const testAuthAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get Current User
      const meResponse = await authAPI.me()
      addResult('GET /auth/me', 'success', `Current user: ${meResponse.data.data?.email}`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /auth/me', 'error', error.response?.data?.message || 'Failed to get current user')
    }

    // Test Get User by ID (if user exists)
    if (user?.id) {
      const startTime = Date.now()
      try {
        const userResponse = await authAPI.getById(user.id)
        addResult('GET /auth/:id', 'success', `User found: ${userResponse.data.data?.email}`, Date.now() - startTime)
      } catch (error: any) {
        addResult('GET /auth/:id', 'error', error.response?.data?.message || 'Failed to get user by ID')
      }
    }
  }

  const testProfileAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get My Profile
      const profileResponse = await profileAPI.me()
      addResult('GET /profile/me', 'success', `Profile found: ${profileResponse.data.data?.bio || 'No bio'}`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /profile/me', 'error', error.response?.data?.message || 'Failed to get profile')
    }

    // Test Get All Profiles
    const startTime2 = Date.now()
    try {
      const allProfilesResponse = await profileAPI.getAll()
      addResult('GET /profile/all', 'success', `Found ${allProfilesResponse.data.data?.length || 0} profiles`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /profile/all', 'error', error.response?.data?.message || 'Failed to get all profiles')
    }
  }

  const testPortfolioAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get My Portfolios
      const portfoliosResponse = await portfolioAPI.getMyPortfolios()
      addResult('GET /portfolio/user-portfolios', 'success', `Found ${portfoliosResponse.data.data?.length || 0} portfolios`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /portfolio/user-portfolios', 'error', error.response?.data?.message || 'Failed to get portfolios')
    }

    // Test Get All Portfolios
    const startTime2 = Date.now()
    try {
      const allPortfoliosResponse = await portfolioAPI.getAll()
      addResult('GET /portfolio/all', 'success', `Found ${allPortfoliosResponse.data.data?.length || 0} total portfolios`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /portfolio/all', 'error', error.response?.data?.message || 'Failed to get all portfolios')
    }
  }

  const testServiceAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get My Services
      const servicesResponse = await serviceAPI.userServices()
      addResult('GET /service/user-services', 'success', `Found ${servicesResponse.data.data?.length || 0} services`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /service/user-services', 'error', error.response?.data?.message || 'Failed to get services')
    }

    // Test Get All Services
    const startTime2 = Date.now()
    try {
      const allServicesResponse = await serviceAPI.getAll()
      addResult('GET /service/', 'success', `Found ${allServicesResponse.data.data?.length || 0} total services`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /service/', 'error', error.response?.data?.message || 'Failed to get all services')
    }
  }

  const testMeetingAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get My Meetings
      const meetingsResponse = await meetingAPI.getMy()
      addResult('GET /meetings/my', 'success', `Found ${meetingsResponse.data.data?.length || 0} meetings`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /meetings/my', 'error', error.response?.data?.message || 'Failed to get meetings')
    }

    // Test Get All Meetings
    const startTime2 = Date.now()
    try {
      const allMeetingsResponse = await meetingAPI.getAll()
      addResult('GET /meetings/', 'success', `Found ${allMeetingsResponse.data.data?.length || 0} total meetings`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /meetings/', 'error', error.response?.data?.message || 'Failed to get all meetings')
    }

    // Test Get Meeting Stats
    const startTime3 = Date.now()
    try {
      const statsResponse = await meetingAPI.getStats()
      addResult('GET /meetings/stats', 'success', `Meeting stats retrieved`, Date.now() - startTime3)
    } catch (error: any) {
      addResult('GET /meetings/stats', 'error', error.response?.data?.message || 'Failed to get meeting stats')
    }

    // Test Get Upcoming Meetings
    const startTime4 = Date.now()
    try {
      const upcomingResponse = await meetingAPI.getUpcoming()
      addResult('GET /meetings/upcoming', 'success', `Found ${upcomingResponse.data.data?.length || 0} upcoming meetings`, Date.now() - startTime4)
    } catch (error: any) {
      addResult('GET /meetings/upcoming', 'error', error.response?.data?.message || 'Failed to get upcoming meetings')
    }
  }

  const testServiceRequestAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get My Service Requests
      const requestsResponse = await serviceRequestAPI.getMy()
      addResult('GET /service-requests/my', 'success', `Found ${requestsResponse.data.data?.length || 0} service requests`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /service-requests/my', 'error', error.response?.data?.message || 'Failed to get service requests')
    }

    // Test Get All Service Requests
    const startTime2 = Date.now()
    try {
      const allRequestsResponse = await serviceRequestAPI.getAll()
      addResult('GET /service-requests/', 'success', `Found ${allRequestsResponse.data.data?.length || 0} total service requests`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /service-requests/', 'error', error.response?.data?.message || 'Failed to get all service requests')
    }

    // Test Get Service Request Stats
    const startTime3 = Date.now()
    try {
      const statsResponse = await serviceRequestAPI.getStats()
      addResult('GET /service-requests/stats', 'success', `Service request stats retrieved`, Date.now() - startTime3)
    } catch (error: any) {
      addResult('GET /service-requests/stats', 'error', error.response?.data?.message || 'Failed to get service request stats')
    }

    // Test Get Open Service Requests
    const startTime4 = Date.now()
    try {
      const openResponse = await serviceRequestAPI.getOpen()
      addResult('GET /service-requests/open', 'success', `Found ${openResponse.data.data?.length || 0} open requests`, Date.now() - startTime4)
    } catch (error: any) {
      addResult('GET /service-requests/open', 'error', error.response?.data?.message || 'Failed to get open service requests')
    }

    // Test Get Upcoming Service Requests
    const startTime5 = Date.now()
    try {
      const upcomingResponse = await serviceRequestAPI.getUpcoming()
      addResult('GET /service-requests/upcoming', 'success', `Found ${upcomingResponse.data.data?.length || 0} upcoming requests`, Date.now() - startTime5)
    } catch (error: any) {
      addResult('GET /service-requests/upcoming', 'error', error.response?.data?.message || 'Failed to get upcoming service requests')
    }
  }

  const testVendorServiceRequestAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get My Vendor Service Requests
      const requestsResponse = await vendorServiceRequestAPI.getMy()
      addResult('GET /vendor-service-requests/my', 'success', `Found ${requestsResponse.data.data?.length || 0} vendor service requests`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /vendor-service-requests/my', 'error', error.response?.data?.message || 'Failed to get vendor service requests')
    }

    // Test Get All Vendor Service Requests
    const startTime2 = Date.now()
    try {
      const allRequestsResponse = await vendorServiceRequestAPI.getAll()
      addResult('GET /vendor-service-requests/', 'success', `Found ${allRequestsResponse.data.data?.length || 0} total vendor service requests`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /vendor-service-requests/', 'error', error.response?.data?.message || 'Failed to get all vendor service requests')
    }

    // Test Get Vendor Service Request Stats
    const startTime3 = Date.now()
    try {
      const statsResponse = await vendorServiceRequestAPI.getStats()
      addResult('GET /vendor-service-requests/stats', 'success', `Vendor service request stats retrieved`, Date.now() - startTime3)
    } catch (error: any) {
      addResult('GET /vendor-service-requests/stats', 'error', error.response?.data?.message || 'Failed to get vendor service request stats')
    }
  }

  const testBidAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get All Bids
      const bidsResponse = await bidAPI.getAll()
      addResult('GET /bids/', 'success', `Found ${bidsResponse.data.data?.length || 0} bids`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /bids/', 'error', error.response?.data?.message || 'Failed to get bids')
    }

    // Test Get Bids with Details
    const startTime2 = Date.now()
    try {
      const bidsWithDetailsResponse = await bidAPI.getWithDetails()
      addResult('GET /bids/details', 'success', `Found ${bidsWithDetailsResponse.data.data?.length || 0} bids with details`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /bids/details', 'error', error.response?.data?.message || 'Failed to get bids with details')
    }

    // Test Get Bid Stats
    const startTime3 = Date.now()
    try {
      const statsResponse = await bidAPI.getStats()
      addResult('GET /bids/stats', 'success', `Bid stats retrieved`, Date.now() - startTime3)
    } catch (error: any) {
      addResult('GET /bids/stats', 'error', error.response?.data?.message || 'Failed to get bid stats')
    }
  }

  const testVendorResponseAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get All Vendor Responses
      const responsesResponse = await vendorResponseAPI.getAll()
      addResult('GET /vendor-responses/', 'success', `Found ${responsesResponse.data.data?.length || 0} vendor responses`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /vendor-responses/', 'error', error.response?.data?.message || 'Failed to get vendor responses')
    }

    // Test Get Vendor Response Stats
    const startTime2 = Date.now()
    try {
      const statsResponse = await vendorResponseAPI.getStats()
      addResult('GET /vendor-responses/stats', 'success', `Vendor response stats retrieved`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /vendor-responses/stats', 'error', error.response?.data?.message || 'Failed to get vendor response stats')
    }
  }

  const testRatingAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get My Ratings
      const ratingsResponse = await ratingAPI.getMy()
      addResult('GET /ratings/my/ratings', 'success', `Found ${ratingsResponse.data.data?.length || 0} ratings`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /ratings/my/ratings', 'error', error.response?.data?.message || 'Failed to get ratings')
    }

    // Test Get Ratings by Reviewer
    if (user?.id) {
      const startTime2 = Date.now()
      try {
        const reviewerRatingsResponse = await ratingAPI.getByReviewer(user.id)
        addResult('GET /ratings/reviewer/:userId', 'success', `Found ${reviewerRatingsResponse.data.data?.length || 0} ratings by reviewer`, Date.now() - startTime2)
      } catch (error: any) {
        addResult('GET /ratings/reviewer/:userId', 'error', error.response?.data?.message || 'Failed to get ratings by reviewer')
      }
    }

    // Test Get Ratings by Reviewee
    if (user?.id) {
      const startTime3 = Date.now()
      try {
        const revieweeRatingsResponse = await ratingAPI.getByReviewee(user.id)
        addResult('GET /ratings/reviewee/:userId', 'success', `Found ${revieweeRatingsResponse.data.data?.length || 0} ratings by reviewee`, Date.now() - startTime3)
      } catch (error: any) {
        addResult('GET /ratings/reviewee/:userId', 'error', error.response?.data?.message || 'Failed to get ratings by reviewee')
      }
    }

    // Test Get Rating Stats
    if (user?.id) {
      const startTime4 = Date.now()
      try {
        const statsResponse = await ratingAPI.getStats(user.id)
        addResult('GET /ratings/stats/:userId', 'success', `Rating stats retrieved`, Date.now() - startTime4)
      } catch (error: any) {
        addResult('GET /ratings/stats/:userId', 'error', error.response?.data?.message || 'Failed to get rating stats')
      }
    }
  }

  const testMessagingAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get Conversations
      const conversationsResponse = await messageAPI.getConversations()
      addResult('GET /message/conversations', 'success', `Found ${conversationsResponse.data.data?.length || 0} conversations`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /message/conversations', 'error', error.response?.data?.message || 'Failed to get conversations')
    }

    // Test Get Unread Count
    const startTime2 = Date.now()
    try {
      const unreadResponse = await messageAPI.unreadCount()
      addResult('GET /message/unread', 'success', `Unread count: ${unreadResponse.data.data?.count || 0}`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /message/unread', 'error', error.response?.data?.message || 'Failed to get unread count')
    }

    // Test Get Conversation Stats
    const startTime3 = Date.now()
    try {
      const statsResponse = await messageAPI.getStats()
      addResult('GET /message/conversation/stats', 'success', `Conversation stats retrieved`, Date.now() - startTime3)
    } catch (error: any) {
      addResult('GET /message/conversation/stats', 'error', error.response?.data?.message || 'Failed to get conversation stats')
    }

    // Test Health Check
    const startTime4 = Date.now()
    try {
      const healthResponse = await messageAPI.health()
      addResult('GET /message/health', 'success', `Messaging system healthy`, Date.now() - startTime4)
    } catch (error: any) {
      addResult('GET /message/health', 'error', error.response?.data?.message || 'Failed to check messaging health')
    }
  }

  const testProgressTrackerAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get Progress Trackers
      const trackersResponse = await progressTrackerAPI.getAll()
      addResult('GET /progress-trackers/', 'success', `Found ${trackersResponse.data.data?.length || 0} progress trackers`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /progress-trackers/', 'error', error.response?.data?.message || 'Failed to get progress trackers')
    }

    // Test Get Progress Tracker Stats
    const startTime2 = Date.now()
    try {
      const statsResponse = await progressTrackerAPI.getStats()
      addResult('GET /progress-trackers/stats', 'success', `Progress tracker stats retrieved`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /progress-trackers/stats', 'error', error.response?.data?.message || 'Failed to get progress tracker stats')
    }
  }

  const testCategoryAPIs = async () => {
    const startTime = Date.now()
    
    try {
      // Test Get Category Hierarchy
      const hierarchyResponse = await categoryAPI.getHierarchy()
      addResult('GET /categories/hierarchy', 'success', `Found ${hierarchyResponse.data.data?.length || 0} categories in hierarchy`, Date.now() - startTime)
    } catch (error: any) {
      addResult('GET /categories/hierarchy', 'error', error.response?.data?.message || 'Failed to get category hierarchy')
    }

    // Test Get Main Categories
    const startTime2 = Date.now()
    try {
      const mainResponse = await categoryAPI.getMain()
      addResult('GET /categories/main', 'success', `Found ${mainResponse.data.data?.length || 0} main categories`, Date.now() - startTime2)
    } catch (error: any) {
      addResult('GET /categories/main', 'error', error.response?.data?.message || 'Failed to get main categories')
    }

    // Test Get All Categories (Admin only)
    const startTime3 = Date.now()
    try {
      const allResponse = await categoryAPI.getAll()
      addResult('GET /categories/', 'success', `Found ${allResponse.data.data?.length || 0} total categories`, Date.now() - startTime3)
    } catch (error: any) {
      addResult('GET /categories/', 'error', error.response?.data?.message || 'Failed to get all categories (Admin only)')
    }

    // Test Get Category Stats (Admin only)
    const startTime4 = Date.now()
    try {
      const statsResponse = await categoryAPI.getStats()
      addResult('GET /categories/stats', 'success', `Category stats retrieved`, Date.now() - startTime4)
    } catch (error: any) {
      addResult('GET /categories/stats', 'error', error.response?.data?.message || 'Failed to get category stats (Admin only)')
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length
  const pendingCount = testResults.filter(r => r.status === 'pending').length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Comprehensive API Integration Test</h2>
          <p className="text-gray-600">
            Test all available API endpoints to verify integration and functionality.
          </p>
          
          {user && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current User:</strong> {user.email} ({user.accountType})
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={isRunning || !user}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? 'Running Tests...' : 'Run All API Tests'}
          </button>
          
          {!user && (
            <p className="mt-2 text-sm text-red-600">Please log in to run API tests</p>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getStatusIcon(result.status)}</span>
                      <div>
                        <div className="font-medium">{result.endpoint}</div>
                        <div className="text-sm opacity-75">{result.message}</div>
                      </div>
                    </div>
                    {result.duration && (
                      <div className="text-sm opacity-75">
                        {result.duration}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
