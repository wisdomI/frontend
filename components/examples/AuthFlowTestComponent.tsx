'use client'

import React, { useState } from 'react'
import { authAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'

interface TestResult {
  test: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: any
}

export default function AuthFlowTestComponent() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)
  const { user, isAuthenticated, setUserData } = useAuthContext()

  const addResult = (test: string, status: TestResult['status'], message: string, data?: any) => {
    setResults(prev => [...prev, { test, status, message, data }])
  }

  const testVendorLogin = async () => {
    setResults([])
    setTesting(true)

    addResult('Vendor Login Test', 'pending', 'Testing vendor login flow...')

    try {
      // Test login with vendor credentials
      const response = await authAPI.login({
        email: 'vendor@test.com',
        password: 'vendor123'
      })

      console.log('AuthFlowTest: Login response:', response.data)

      // Extract tokens and user data
      let accessToken = null
      let refreshToken = null
      let userData = null

      const responseData: any = response.data

      // Try different possible response structures
      if (responseData.data?.data?.accessToken) {
        accessToken = responseData.data.data.accessToken
        refreshToken = responseData.data.data.refreshToken
        userData = responseData.data.data.user || responseData.data.user
      } else if (responseData.data?.accessToken) {
        accessToken = responseData.data.accessToken
        refreshToken = responseData.data.refreshToken
        userData = responseData.data.user
      } else if (responseData.accessToken) {
        accessToken = responseData.accessToken
        refreshToken = responseData.refreshToken
        userData = responseData.user
      }

      if (!accessToken) {
        addResult('Vendor Login Test', 'error', 'No access token received', responseData)
        return
      }

      // Store tokens
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }

      addResult('Vendor Login Test', 'success', 'Login successful, tokens stored', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData
      })

      // Handle user data
      if (!userData) {
        // Extract from token
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          userData = {
            id: payload.id,
            accountType: payload.accountType || 'vendor',
            email: payload.email || 'vendor@test.com',
            isEmailVerified: true,
            createdAt: new Date(payload.iat * 1000).toISOString(),
            updatedAt: new Date(payload.iat * 1000).toISOString()
          }
        } catch (tokenError) {
          addResult('Token Parsing', 'error', 'Failed to decode token', tokenError)
          return
        }
      }

      addResult('User Data Extraction', 'success', 'User data extracted successfully', userData)

      // Set user data in context
      setUserData(userData)
      addResult('Context Update', 'success', 'User data set in AuthContext', {
        accountType: userData.accountType,
        email: userData.email
      })

      // Test redirect logic
      let redirectPath = '/auth/login'
      if (userData.accountType === 'vendor') {
        redirectPath = '/vendor'
      } else if (userData.accountType === 'individual' || userData.accountType === 'business') {
        redirectPath = '/client/dashboard'
      } else if (userData.accountType === 'admin') {
        redirectPath = '/dashboard/admin'
      }

      addResult('Redirect Logic', 'success', `Redirect path determined: ${redirectPath}`, {
        accountType: userData.accountType,
        redirectPath
      })

    } catch (error: any) {
      addResult('Vendor Login Test', 'error', `Login failed: ${error.message}`, error.response?.data)
    }

    setTesting(false)
  }

  const testClientLogin = async () => {
    setResults([])
    setTesting(true)

    addResult('Client Login Test', 'pending', 'Testing client login flow...')

    try {
      // Test login with client credentials
      const response = await authAPI.login({
        email: 'client@test.com',
        password: 'client123'
      })

      console.log('AuthFlowTest: Client login response:', response.data)

      // Similar processing as vendor login
      let accessToken = null
      let refreshToken = null
      let userData = null

      const responseData: any = response.data

      if (responseData.data?.data?.accessToken) {
        accessToken = responseData.data.data.accessToken
        refreshToken = responseData.data.data.refreshToken
        userData = responseData.data.data.user || responseData.data.user
      } else if (responseData.data?.accessToken) {
        accessToken = responseData.data.accessToken
        refreshToken = responseData.data.refreshToken
        userData = responseData.data.user
      } else if (responseData.accessToken) {
        accessToken = responseData.accessToken
        refreshToken = responseData.refreshToken
        userData = responseData.user
      }

      if (!accessToken) {
        addResult('Client Login Test', 'error', 'No access token received', responseData)
        return
      }

      // Store tokens
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }

      addResult('Client Login Test', 'success', 'Login successful, tokens stored', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData
      })

      // Handle user data
      if (!userData) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          userData = {
            id: payload.id,
            accountType: payload.accountType || 'individual',
            email: payload.email || 'client@test.com',
            isEmailVerified: true,
            createdAt: new Date(payload.iat * 1000).toISOString(),
            updatedAt: new Date(payload.iat * 1000).toISOString()
          }
        } catch (tokenError) {
          addResult('Token Parsing', 'error', 'Failed to decode token', tokenError)
          return
        }
      }

      addResult('User Data Extraction', 'success', 'User data extracted successfully', userData)

      // Set user data in context
      setUserData(userData)
      addResult('Context Update', 'success', 'User data set in AuthContext', {
        accountType: userData.accountType,
        email: userData.email
      })

      // Test redirect logic
      let redirectPath = '/auth/login'
      if (userData.accountType === 'vendor') {
        redirectPath = '/vendor'
      } else if (userData.accountType === 'individual' || userData.accountType === 'business') {
        redirectPath = '/client/dashboard'
      } else if (userData.accountType === 'admin') {
        redirectPath = '/dashboard/admin'
      }

      addResult('Redirect Logic', 'success', `Redirect path determined: ${redirectPath}`, {
        accountType: userData.accountType,
        redirectPath
      })

    } catch (error: any) {
      addResult('Client Login Test', 'error', `Login failed: ${error.message}`, error.response?.data)
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication Flow Test</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Current Auth State</h3>
        <div className="text-sm text-blue-800">
          <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
          {user && (
            <>
              <div>Account Type: {user.accountType}</div>
              <div>Email: {user.email}</div>
              <div>User ID: {user.id}</div>
            </>
          )}
        </div>
      </div>

      <div className="mb-6 space-x-4">
        <button
          onClick={testVendorLogin}
          disabled={testing}
          className="bg-event-blue text-white px-6 py-2 rounded-md hover:bg-event-blue-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'Testing...' : 'Test Vendor Login'}
        </button>
        
        <button
          onClick={testClientLogin}
          disabled={testing}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'Testing...' : 'Test Client Login'}
        </button>
        
        {results.length > 0 && (
          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">Test Credentials</h3>
        <div className="text-sm text-yellow-800 space-y-1">
          <div><strong>Vendor:</strong> vendor@test.com / vendor123</div>
          <div><strong>Client:</strong> client@test.com / client123</div>
          <div><strong>Admin:</strong> admin@test.com / admin123</div>
        </div>
      </div>
    </div>
  )
}
