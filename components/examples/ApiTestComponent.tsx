'use client'

import React, { useState, useEffect } from 'react'
import { authAPI } from '@/lib/api'

interface TestResult {
  test: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: any
}

export default function ApiTestComponent() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const addResult = (test: string, status: TestResult['status'], message: string, data?: any) => {
    setResults(prev => [...prev, { test, status, message, data }])
  }

  const testApiConnection = async () => {
    setResults([])
    setTesting(true)

    // Test 1: Basic API connectivity
    addResult('API Connectivity', 'pending', 'Testing basic API connection...')
    try {
      const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/categories/main`)
      if (response.ok) {
        addResult('API Connectivity', 'success', 'API server is online and responding')
      } else {
        addResult('API Connectivity', 'error', `API responded with status: ${response.status}`)
      }
    } catch (error: any) {
      addResult('API Connectivity', 'error', `Connection failed: ${error.message}`)
    }

    // Test 2: Authentication endpoint (Individual/Business access required)
    addResult('Auth Endpoint', 'pending', 'Testing /auth/me endpoint (requires Individual/Business access)...')
    try {
      const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 401) {
        addResult('Auth Endpoint', 'success', '/auth/me requires Individual/Business access token (expected)')
      } else if (response.status === 403) {
        addResult('Auth Endpoint', 'success', '/auth/me requires Individual/Business access (403 - vendor accounts not allowed)')
      } else {
        addResult('Auth Endpoint', 'error', `Unexpected response: ${response.status}`)
      }
    } catch (error: any) {
      addResult('Auth Endpoint', 'error', `Auth endpoint error: ${error.message}`)
    }

    // Test 3: Login with test credentials
    addResult('Login Test', 'pending', 'Testing login with vendor credentials...')
    try {
      const loginResponse = await authAPI.login({
        email: 'vendor@test.com',
        password: 'vendor123'
      })
      
      // Check if we got tokens
      const responseData: any = loginResponse.data
      let accessToken = null
      let refreshToken = null
      
      // Try different possible token locations
      if (responseData.data?.data?.accessToken) {
        accessToken = responseData.data.data.accessToken
        refreshToken = responseData.data.data.refreshToken
      } else if (responseData.data?.accessToken) {
        accessToken = responseData.data.accessToken
        refreshToken = responseData.data.refreshToken
      } else if (responseData.accessToken) {
        accessToken = responseData.accessToken
        refreshToken = responseData.refreshToken
      } else if (responseData.data?.tokens?.accessToken) {
        accessToken = responseData.data.tokens.accessToken
        refreshToken = responseData.data.tokens.refreshToken
      } else if (responseData.tokens?.accessToken) {
        accessToken = responseData.tokens.accessToken
        refreshToken = responseData.tokens.refreshToken
      }

      if (accessToken) {
        // Store tokens
        localStorage.setItem('accessToken', accessToken)
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }
        
        addResult('Login Test', 'success', 'Login successful, tokens received', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          tokenLength: accessToken?.length
        })

        // Test 4: Verify user data with token
        addResult('User Data Test', 'pending', 'Testing user data retrieval...')
        try {
          const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
          const userResponse = await fetch(`${apiUrl}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (userResponse.status === 403) {
            // This is expected for vendor accounts - create user from token
            const payload = JSON.parse(atob(accessToken.split('.')[1]))
            addResult('User Data Test', 'success', 'Vendor token decoded successfully', {
              userId: payload.id,
              email: payload.email,
              accountType: 'vendor'
            })
          } else if (userResponse.ok) {
            const userData = await userResponse.json()
            addResult('User Data Test', 'success', 'User data retrieved successfully', userData)
          } else {
            addResult('User Data Test', 'error', `User data request failed: ${userResponse.status}`)
          }
        } catch (error: any) {
          addResult('User Data Test', 'error', `User data error: ${error.message}`)
        }

        // Test 5: Logout endpoint (requires Individual/Business access)
        addResult('Logout Test', 'pending', 'Testing logout endpoint (requires Individual/Business access)...')
        try {
          const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
          const logoutResponse = await fetch(`${apiUrl}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (logoutResponse.ok) {
            addResult('Logout Test', 'success', 'Logout successful')
          } else if (logoutResponse.status === 403) {
            addResult('Logout Test', 'success', 'Logout requires Individual/Business access (403 - vendor accounts not allowed)')
          } else {
            addResult('Logout Test', 'error', `Logout failed: ${logoutResponse.status}`)
          }
        } catch (error: any) {
          addResult('Logout Test', 'error', `Logout error: ${error.message}`)
        }

        // Test 6: Refresh token endpoint (requires Bearer refresh token)
        if (refreshToken) {
          addResult('Refresh Token Test', 'pending', 'Testing refresh token endpoint with Bearer token...')
          try {
            const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
            const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json'
              }
            })

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              addResult('Refresh Token Test', 'success', 'Refresh token endpoint works correctly', {
                hasNewAccessToken: !!refreshData.data?.accessToken
              })
            } else {
              addResult('Refresh Token Test', 'error', `Refresh token failed: ${refreshResponse.status}`)
            }
          } catch (error: any) {
            addResult('Refresh Token Test', 'error', `Refresh token error: ${error.message}`)
          }
        } else {
          addResult('Refresh Token Test', 'pending', 'Skipping refresh token test - no refresh token received')
        }

      } else {
        addResult('Login Test', 'error', 'Login failed - no tokens received', responseData)
      }
    } catch (error: any) {
      addResult('Login Test', 'error', `Login failed: ${error.message}`, error.response?.data)
    }

    // Test 7: WebSocket connection (basic test)
    addResult('WebSocket Test', 'pending', 'Testing WebSocket connection...')
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://backend-a3nd.onrender.com/ws'
      const ws = new WebSocket(wsUrl)
      
      const timeout = setTimeout(() => {
        ws.close()
        addResult('WebSocket Test', 'error', 'WebSocket connection timeout')
      }, 5000)

      ws.onopen = () => {
        clearTimeout(timeout)
        addResult('WebSocket Test', 'success', 'WebSocket connection established')
        ws.close()
      }

      ws.onerror = (error) => {
        clearTimeout(timeout)
        addResult('WebSocket Test', 'error', 'WebSocket connection failed (common with free hosting)')
      }
    } catch (error: any) {
      addResult('WebSocket Test', 'error', `WebSocket error: ${error.message}`)
    }

    setTesting(false)
  }

  const clearResults = () => {
    setResults([])
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">API Connection Test</h2>
      
      <div className="mb-6">
        <button
          onClick={testApiConnection}
          disabled={testing}
          className="bg-event-blue text-white px-6 py-2 rounded-md hover:bg-event-blue-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'Testing...' : 'Run API Tests'}
        </button>
        
        {results.length > 0 && (
          <button
            onClick={clearResults}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Clear Results
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{result.test}</h3>
                <span className={`text-lg ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                </span>
              </div>
              
              <p className={`${getStatusColor(result.status)} mb-2`}>
                {result.message}
              </p>
              
              {result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    View Details
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Test Credentials</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <div><strong>Vendor:</strong> vendor@test.com / vendor123</div>
          <div><strong>Client:</strong> client@test.com / client123</div>
          <div><strong>Admin:</strong> admin@test.com / admin123</div>
        </div>
      </div>
    </div>
  )
}