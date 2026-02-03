'use client'

import React, { useState } from 'react'
import { portfolioAPI, serviceAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'

interface TestResult {
  endpoint: string
  status: 'pending' | 'success' | 'error'
  statusCode?: number
  message?: string
  data?: any
}

const PortfolioServiceTester = () => {
  const { user, isAuthenticated } = useAuthContext()
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    if (!isAuthenticated) {
      alert('Please login first')
      return
    }

    setTesting(true)
    setResults([])
    
    const tests = [
      {
        name: 'GET /portfolio/user',
        test: async () => portfolioAPI.getUserPortfolios(user?.id || '')
      },
      {
        name: 'GET /portfolio/all',
        test: async () => portfolioAPI.getAll()
      },
      {
        name: 'GET /service/my',
        test: async () => serviceAPI.myServices()
      },
      {
        name: 'GET /service/all',
        test: async () => serviceAPI.getAll()
      }
    ]

    for (const testCase of tests) {
      try {
        const response = await testCase.test()
        setResults(prev => [...prev, {
          endpoint: testCase.name,
          status: 'success',
          statusCode: 200,
          message: 'Success',
          data: response.data
        }])
      } catch (error: any) {
        setResults(prev => [...prev, {
          endpoint: testCase.name,
          status: 'error',
          statusCode: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data
        }])
      }
    }

    setTesting(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-semibold">Portfolio & Service Tester</h3>
        <p className="text-yellow-700 text-sm mt-2">Please login to test endpoints</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-blue-800 font-semibold">Portfolio & Service Endpoint Tester</h3>
          <p className="text-blue-700 text-sm mt-1">
            Logged in as: <span className="font-medium">{user?.email}</span> 
            {' '}(<span className="font-medium">{user?.accountType || 'unknown'}</span>)
          </p>
        </div>
        <button
          onClick={runTests}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {testing ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="font-medium text-blue-800">Test Results:</h4>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                result.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{result.endpoint}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      result.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.statusCode || 'Error'}
                  </span>
                  <span
                    className={`text-lg ${
                      result.status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {result.status === 'success' ? '✅' : '❌'}
                  </span>
                </div>
              </div>
              
              {result.message && (
                <p className={`text-xs mt-2 ${
                  result.status === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                </p>
              )}
              
              {result.status === 'error' && result.statusCode === 403 && (
                <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                  <p className="font-medium">⚠️ Access Denied (403 Forbidden)</p>
                  <p className="mt-1">
                    This endpoint requires vendor account privileges. 
                    {user?.accountType !== 'vendor' && (
                      <span className="font-medium">
                        {' '}Your account type is &quot;{user?.accountType}&quot; but should be &quot;vendor&quot;.
                      </span>
                    )}
                  </p>
                  <p className="mt-1">
                    📝 Backend action required: Update access control to allow vendor accounts.
                  </p>
                </div>
              )}
              
              {result.data && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer hover:underline">
                    View response data
                  </summary>
                  <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-100 rounded text-xs text-blue-800">
        <p className="font-medium">💡 Testing Tips:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>This tests READ operations only (no data creation)</li>
          <li>✅ Green = Endpoint is working</li>
          <li>❌ Red = Endpoint has issues (check status code)</li>
          <li>403 = Access denied (backend access control issue)</li>
          <li>404 = Endpoint not implemented</li>
          <li>Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  )
}

export default PortfolioServiceTester

