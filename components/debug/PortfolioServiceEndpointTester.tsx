'use client'

import { useState } from 'react'
import { portfolioAPI, serviceAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'

interface EndpointResult {
  endpoint: string
  method: string
  status: 'pending' | 'testing' | 'success' | 'error'
  statusCode?: number
  data?: any
  error?: string
  message?: string
}

export default function PortfolioServiceEndpointTester() {
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

    // Define all endpoints to test
    const endpoints = [
      // Portfolio endpoints
      { method: 'GET', name: '/portfolio/all', api: () => portfolioAPI.getAll() },
      
      // Service endpoints
      { method: 'GET', name: '/service/my', api: () => serviceAPI.myServices() },
      { method: 'GET', name: '/service/all', api: () => serviceAPI.getAll() },
    ]

    // Initialize results
    setResults(endpoints.map(e => ({ 
      endpoint: e.name, 
      method: e.method,
      status: 'pending' 
    })))

    // Test each endpoint
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i]
      
      // Update status to testing
      setResults(prev => prev.map((r, idx) => 
        idx === i ? { ...r, status: 'testing' } : r
      ))

      try {
        console.log(`Testing ${endpoint.method} ${endpoint.name}...`)
        const response = await endpoint.api()
        console.log(`${endpoint.name} response:`, response)

        testResults.push({
          endpoint: endpoint.name,
          method: endpoint.method,
          status: 'success',
          statusCode: 200,
          data: response.data,
          message: '✅ Working - Returns data successfully!'
        })
      } catch (error: any) {
        console.error(`${endpoint.name} error:`, error)
        console.error(`${endpoint.name} error response:`, error.response)

        const statusCode = error.response?.status
        const errorData = error.response?.data

        let message = '❌ Failed'
        if (statusCode === 403) {
          message = '❌ 403 FORBIDDEN - Backend rejects vendor accounts'
        } else if (statusCode === 404) {
          message = '❌ 404 NOT FOUND - Endpoint not implemented'
        } else if (statusCode === 401) {
          message = '❌ 401 UNAUTHORIZED - Token invalid/expired'
        } else if (statusCode === 422) {
          message = '⚠️ 422 VALIDATION ERROR - Invalid request data'
        }

        testResults.push({
          endpoint: endpoint.name,
          method: endpoint.method,
          status: 'error',
          statusCode: statusCode,
          data: errorData,
          error: errorData?.message || error.message,
          message: message
        })
      }

      // Update results
      setResults([...testResults])
    }

    setTesting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 border-gray-300 text-gray-600'
      case 'testing': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'success': return 'bg-green-100 border-green-300 text-green-800'
      case 'error': return 'bg-red-100 border-red-300 text-red-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⚪'
      case 'testing': return '⏳'
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⚪'
    }
  }

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-700'
      case 'POST': return 'bg-green-100 text-green-700'
      case 'PATCH': return 'bg-yellow-100 text-yellow-700'
      case 'DELETE': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">📦 Portfolio & Service Endpoints Tester</h3>
          <p className="text-sm text-gray-600 mt-1">Verify if portfolio and service endpoints work for vendor accounts</p>
        </div>
        <button
          onClick={testAllEndpoints}
          disabled={!isAuthenticated || testing}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
            testing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
          }`}
        >
          {testing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Testing...
            </div>
          ) : (
            'Test All Endpoints'
          )}
        </button>
      </div>

      {/* Current User Info */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-indigo-200">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-gray-800 text-sm">Testing as:</h4>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">
            {user?.accountType?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          {user?.email || 'No email'} - {user?.businessName || user?.firstName || 'No name'}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className={`rounded-lg border-2 p-4 transition-all ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getMethodBadgeColor(result.method)}`}>
                        {result.method}
                      </span>
                      <code className="bg-white bg-opacity-70 px-2 py-1 rounded text-sm font-mono">
                        {result.endpoint}
                      </code>
                    </div>
                    <p className="text-sm font-medium">{result.message || 'Waiting...'}</p>
                  </div>
                </div>
                {result.statusCode && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ml-2 ${
                    result.statusCode === 200 
                      ? 'bg-green-200 text-green-800' 
                      : result.statusCode === 403
                      ? 'bg-red-200 text-red-800'
                      : result.statusCode === 404
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {result.statusCode}
                  </span>
                )}
              </div>

              {/* Success - Show data summary */}
              {result.status === 'success' && result.data && (
                <div className="mt-3 bg-white bg-opacity-80 rounded-lg p-3 border border-green-300">
                  <h6 className="font-semibold text-green-800 mb-2 text-xs">✅ Response Data:</h6>
                  <pre className="text-xs overflow-auto max-h-32 bg-white p-2 rounded border border-green-200">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Error - Show error details */}
              {result.status === 'error' && (
                <div className="mt-3 space-y-2">
                  {result.error && (
                    <div className="bg-white bg-opacity-80 rounded-lg p-3 border border-red-300">
                      <h6 className="font-semibold text-red-800 mb-1 text-xs">Error Message:</h6>
                      <p className="text-red-700 text-sm font-medium">{result.error}</p>
                    </div>
                  )}
                  {result.data && (
                    <div className="bg-white bg-opacity-80 rounded-lg p-3 border border-red-300">
                      <h6 className="font-semibold text-red-800 mb-1 text-xs">Full Error Response:</h6>
                      <pre className="text-xs overflow-auto max-h-24 bg-white p-2 rounded border border-red-200">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Summary */}
          <div className="bg-white rounded-lg p-4 border-2 border-indigo-300 mt-4">
            <h5 className="font-bold text-gray-900 mb-3">📊 Test Summary:</h5>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-700">{results.length}</div>
                <div className="text-xs text-gray-600">Total</div>
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
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {results.filter(r => r.status === 'testing').length}
                </div>
                <div className="text-xs text-gray-600">Testing ⏳</div>
              </div>
            </div>

            {/* Verdict */}
            {!testing && results.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {results.every(r => r.status === 'success') ? (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                    <p className="text-green-800 font-bold text-sm">
                      🎉 All endpoints working! Backend has been fixed for vendor accounts.
                    </p>
                  </div>
                ) : results.every(r => r.status === 'error' && r.statusCode === 403) ? (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-800 font-bold text-sm mb-2">
                      🚨 All endpoints return 403 Forbidden
                    </p>
                    <p className="text-red-700 text-xs">
                      Backend access control is blocking vendor accounts. See <code className="bg-red-100 px-1 rounded">VENDOR_BUGS_REPORT.md</code> for fix details.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                    <p className="text-yellow-800 font-bold text-sm">
                      ⚠️ Mixed results - Some endpoints work, others don&apos;t
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {results.length === 0 && (
        <div className="bg-indigo-100 border border-indigo-200 rounded-lg p-4 mt-4">
          <h5 className="font-semibold text-indigo-900 mb-3 text-sm">Endpoints to Test:</h5>
          
          <div className="space-y-3">
            <div>
              <h6 className="font-semibold text-indigo-800 text-xs mb-2">📁 Portfolio Endpoints:</h6>
              <div className="space-y-1 text-xs text-indigo-700 ml-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">GET</span>
                  <code>/portfolio/all</code>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-mono text-xs">POST</span>
                  <code>/portfolio/</code>
                  <span className="text-xs">(requires data, not tested)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-mono text-xs">PATCH</span>
                  <code>/portfolio/{'{id}'}</code>
                  <span className="text-xs">(requires data, not tested)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono text-xs">DELETE</span>
                  <code>/portfolio/{'{id}'}</code>
                  <span className="text-xs">(requires ID, not tested)</span>
                </div>
              </div>
            </div>

            <div>
              <h6 className="font-semibold text-indigo-800 text-xs mb-2">🛠️ Service Endpoints:</h6>
              <div className="space-y-1 text-xs text-indigo-700 ml-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">GET</span>
                  <code>/service/my</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">GET</span>
                  <code>/service/all</code>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-mono text-xs">POST</span>
                  <code>/service/</code>
                  <span className="text-xs">(requires data, not tested)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-mono text-xs">PATCH</span>
                  <code>/service/{'{id}'}</code>
                  <span className="text-xs">(requires data, not tested)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono text-xs">DELETE</span>
                  <code>/service/{'{id}'}</code>
                  <span className="text-xs">(requires ID, not tested)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-indigo-300">
            <p className="text-xs text-indigo-700">
              <strong>Note:</strong> Only GET endpoints are tested automatically. POST/PATCH/DELETE require actual data and are tested via the modals when you create/update items.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-indigo-300">
            <p className="text-xs text-indigo-600">
              <strong>Expected Issue:</strong> These endpoints are known to return <span className="font-bold">403 Forbidden</span> for vendor accounts. See <code className="bg-indigo-100 px-1 rounded">403_PORTFOLIO_SERVICE_FIX.md</code> for details.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

