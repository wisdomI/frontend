'use client'

import { useState } from 'react'
import { authAPI, profileAPI, serviceRequestAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'

interface EndpointResult {
  endpoint: string
  status: 'testing' | 'success' | 'error'
  statusCode?: number
  data?: any
  error?: string
  message?: string
}

export default function EndpointVerifier() {
  const { user, isAuthenticated } = useAuthContext()
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<EndpointResult[]>([])

  const testAllEndpoints = async () => {
    if (!isAuthenticated) {
      alert('Please log in first')
      return
    }

    setTesting(true)
    const testResults: EndpointResult[] = []

    // Initialize all endpoints as testing
    const endpoints = [
      { name: '/auth/me', api: () => authAPI.me() },
      { name: '/profile/me', api: () => profileAPI.me() },
      { name: '/service-request/', api: () => serviceRequestAPI.getAll() }
    ]

    setResults(endpoints.map(e => ({ endpoint: e.name, status: 'testing' })))

    // Test each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint.name}...`)
        const response = await endpoint.api()
        console.log(`${endpoint.name} response:`, response)

        testResults.push({
          endpoint: endpoint.name,
          status: 'success',
          statusCode: 200,
          data: response.data,
          message: '✅ Working perfectly!'
        })
      } catch (error: any) {
        console.error(`${endpoint.name} error:`, error)
        console.error(`${endpoint.name} error response:`, error.response)

        const statusCode = error.response?.status
        const errorData = error.response?.data

        let message = '❌ Failed'
        if (statusCode === 403) {
          message = '❌ 403 Forbidden - Vendor accounts not allowed'
        } else if (statusCode === 404) {
          message = '❌ 404 Not Found - Endpoint not implemented'
        } else if (statusCode === 401) {
          message = '❌ 401 Unauthorized - Token invalid/expired'
        }

        testResults.push({
          endpoint: endpoint.name,
          status: 'error',
          statusCode: statusCode,
          data: errorData,
          error: errorData?.message || error.message,
          message: message
        })
      }

      // Update results progressively
      setResults([...testResults])
    }

    setTesting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'testing': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'success': return 'bg-green-100 border-green-300 text-green-800'
      case 'error': return 'bg-red-100 border-red-300 text-red-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing': return '⏳'
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⚪'
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">🔍 Critical Endpoints Verifier</h3>
          <p className="text-sm text-gray-600 mt-1">Test: /auth/me, /profile/me, /service-request/</p>
        </div>
        <button
          onClick={testAllEndpoints}
          disabled={!isAuthenticated || testing}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
            testing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 shadow-md'
          }`}
        >
          {testing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Testing...
            </div>
          ) : (
            'Verify All 3 Endpoints'
          )}
        </button>
      </div>

      {/* Current User Context */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Current User Context:</h4>
        <div className="flex gap-4 text-sm flex-wrap">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 font-bold text-purple-600">{user?.accountType || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium">{user?.email || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium">{user?.businessName || user?.firstName || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm mb-3">Test Results:</h4>
          
          {results.map((result, index) => (
            <div
              key={index}
              className={`rounded-lg border-2 p-4 transition-all ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  <div>
                    <h5 className="font-bold text-base">
                      <code className="bg-white bg-opacity-50 px-2 py-1 rounded">{result.endpoint}</code>
                    </h5>
                    <p className="text-sm mt-1">{result.message || 'Testing...'}</p>
                  </div>
                </div>
                {result.statusCode && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.statusCode === 200 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {result.statusCode}
                  </span>
                )}
              </div>

              {/* Success Data */}
              {result.status === 'success' && result.data && (
                <div className="mt-3 bg-white bg-opacity-70 rounded-lg p-3 border border-green-200">
                  <h6 className="font-semibold text-green-800 mb-2 text-xs">Response Data:</h6>
                  <pre className="text-xs overflow-auto max-h-32 bg-white p-2 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Error Details */}
              {result.status === 'error' && (
                <div className="mt-3 space-y-2">
                  {result.error && (
                    <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-red-200">
                      <h6 className="font-semibold text-red-800 mb-1 text-xs">Error Message:</h6>
                      <p className="text-red-700 text-sm">{result.error}</p>
                    </div>
                  )}
                  {result.data && (
                    <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-red-200">
                      <h6 className="font-semibold text-red-800 mb-1 text-xs">Error Data:</h6>
                      <pre className="text-xs overflow-auto max-h-24 bg-white p-2 rounded">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Summary */}
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200 mt-4">
            <h5 className="font-bold text-gray-800 mb-2">Summary:</h5>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-700">{results.length}</div>
                <div className="text-xs text-gray-600">Total Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.status === 'success').length}
                </div>
                <div className="text-xs text-gray-600">Working ✅</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-xs text-gray-600">Failed ❌</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions (shown when no results) */}
      {results.length === 0 && (
        <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 mt-4">
          <h5 className="font-semibold text-purple-800 mb-2 text-sm">This Will Test:</h5>
          <div className="space-y-2 text-purple-700 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-mono bg-white px-2 py-1 rounded text-xs">/auth/me</span>
              <span className="text-xs">→ Current authenticated user data</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-white px-2 py-1 rounded text-xs">/profile/me</span>
              <span className="text-xs">→ User profile information</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-white px-2 py-1 rounded text-xs">/service-request/</span>
              <span className="text-xs">→ Service requests list</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-xs text-purple-600">
              <strong>Expected Issues:</strong> These endpoints may return 403 Forbidden for vendor accounts due to backend access control restrictions.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

