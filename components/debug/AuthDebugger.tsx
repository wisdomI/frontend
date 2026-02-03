'use client'

import React, { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { authAPI } from '@/lib/api'

export default function AuthDebugger() {
  const { user, isAuthenticated, loading } = useAuthContext()
  const [testCredentials, setTestCredentials] = useState({
    email: '',
    password: ''
  })
  const testBackendHealth = async () => {
    try {
      console.log('🏥 Testing backend health...')
      
      // First test a simple GET request to see if the backend is reachable
      const baseUrl = 'https://backend-a3nd.onrender.com/api/v1'
      
      // Test 1: Simple GET request
      console.log('🏥 Testing GET request to base URL...')
      const getResponse = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('🏥 GET response:', {
        status: getResponse.status,
        statusText: getResponse.statusText,
        headers: Object.fromEntries(getResponse.headers.entries()),
        ok: getResponse.ok
      })
      
      // Test 2: POST to login endpoint
      console.log('🏥 Testing POST request to login endpoint...')
      const postResponse = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword'
        })
      })
      
      console.log('🏥 POST response:', {
        status: postResponse.status,
        statusText: postResponse.statusText,
        headers: Object.fromEntries(postResponse.headers.entries()),
        ok: postResponse.ok
      })
      
      const postText = await postResponse.text()
      console.log('🏥 POST response body:', postText)
      
      return {
        getTest: {
          status: getResponse.status,
          statusText: getResponse.statusText,
          headers: Object.fromEntries(getResponse.headers.entries()),
          ok: getResponse.ok
        },
        postTest: {
          status: postResponse.status,
          statusText: postResponse.statusText,
          headers: Object.fromEntries(postResponse.headers.entries()),
          body: postText,
          ok: postResponse.ok
        }
      }
    } catch (error: any) {
      console.error('🏥 Backend health check failed:', error)
      return { error: error.message }
    }
  }

  const [backendHealth, setBackendHealth] = useState<any>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  const handleHealthCheck = async () => {
    setIsCheckingHealth(true)
    const result = await testBackendHealth()
    setBackendHealth(result)
    setIsCheckingHealth(false)
  }

  const handleTestLogin = async () => {
    if (!testCredentials.email || !testCredentials.password) {
      alert('Please enter test credentials')
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      console.log('🧪 Testing login with credentials:', {
        email: testCredentials.email,
        passwordLength: testCredentials.password.length
      })

      const response = await authAPI.login({
        email: testCredentials.email,
        password: testCredentials.password
      })

      console.log('🧪 Test login successful:', response.data)
      setTestResult({
        success: true,
        data: response.data,
        status: response.status
      })
    } catch (error: any) {
      console.error('🧪 Test login failed:', error)
      console.error('🧪 Full error object:', {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
          data: error.config?.data
        }
      })
      
      setTestResult({
        success: false,
        error: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            headers: error.config?.headers
          }
        }
      })
    } finally {
      setIsTesting(false)
    }
  }

  const [tokenStatus, setTokenStatus] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  const checkTokenStatus = () => {
    if (typeof window === 'undefined') return null
    
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!accessToken) {
      return { hasToken: false }
    }
    
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      const expiresIn = payload.exp - now
      const isExpired = payload.exp < now
      
      return {
        hasToken: true,
        hasRefreshToken: !!refreshToken,
        isExpired,
        expiresIn,
        expiresInMinutes: Math.floor(expiresIn / 60),
        userId: payload.id,
        accountType: payload.accountType,
        email: payload.email,
        issuedAt: new Date(payload.iat * 1000).toLocaleString(),
        expiresAt: new Date(payload.exp * 1000).toLocaleString()
      }
    } catch (e) {
      return { hasToken: true, error: 'Invalid token format' }
    }
  }

  // Set client flag on mount to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
    setTokenStatus(checkTokenStatus())
  }, [])

  // Update token status when auth state changes
  useEffect(() => {
    if (isClient) {
      setTokenStatus(checkTokenStatus())
    }
  }, [user, isAuthenticated, isClient])

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">🔧 Authentication Debugger</h3>
      
      {/* Current Auth State */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium mb-2">Current Auth State:</h4>
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify({
            user: user ? {
              id: user.id,
              email: user.email,
              accountType: user.accountType,
              isEmailVerified: user.isEmailVerified
            } : null,
            isAuthenticated,
            loading
          }, null, 2)}
        </pre>
      </div>

      {/* Token Status */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium mb-2">Token Status:</h4>
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
          {isClient ? (tokenStatus ? JSON.stringify(tokenStatus, null, 2) : 'Loading...') : 'Loading...'}
        </pre>
      </div>

      {/* Test Login */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium mb-2">Test Login:</h4>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Test email"
            value={testCredentials.email}
            onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded text-sm"
          />
          <input
            type="password"
            placeholder="Test password"
            value={testCredentials.password}
            onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
            className="w-full p-2 border rounded text-sm"
          />
        <button 
            onClick={handleTestLogin}
            disabled={isTesting}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
            {isTesting ? 'Testing...' : 'Test Login'}
        </button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium mb-2">Test Result:</h4>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Backend Health Check */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium mb-2">Backend Health Check:</h4>
        <button
          onClick={handleHealthCheck}
          disabled={isCheckingHealth}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 mb-2"
        >
          {isCheckingHealth ? 'Checking...' : 'Test Backend'}
        </button>
        {backendHealth && (
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(backendHealth, null, 2)}
          </pre>
        )}
              </div>
              
      {/* API Info */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium mb-2">API Configuration:</h4>
        <div className="text-xs space-y-1">
          <div>Base URL: {process.env.NEXT_PUBLIC_API_URL || 'https://backend-a3nd.onrender.com/api/v1'}</div>
          <div>Login Endpoint: /auth/login</div>
          <div>Full URL: {(process.env.NEXT_PUBLIC_API_URL || 'https://backend-a3nd.onrender.com/api/v1')}/auth/login</div>
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="font-medium text-yellow-800">Available Roles:</div>
            <div className="text-yellow-700">• client - Regular users/clients</div>
            <div className="text-yellow-700">• vendor - Event vendors/service providers</div>
            </div>
        </div>
      </div>
    </div>
  )
}