'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'

export default function AuthDebugger() {
  const { user, isAuthenticated, loading } = useAuthContext()
  const [token, setToken] = useState<string | null>(null)
  const [tokenPayload, setTokenPayload] = useState<any>(null)
  const [apiTest, setApiTest] = useState<any>(null)
  const [profileTest, setProfileTest] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('accessToken')
      setToken(storedToken)
      
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]))
          setTokenPayload(payload)
        } catch (e) {
          console.error('Failed to decode token:', e)
        }
      }
    }
  }, [])

  const testApiCall = async () => {
    try {
      const response = await fetch('https://backend-a3nd.onrender.com/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      setApiTest({
        status: response.status,
        statusText: response.statusText,
        data: data
      })
    } catch (error) {
      setApiTest({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const testProfileCall = async () => {
    try {
      const response = await fetch('https://backend-a3nd.onrender.com/api/v1/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      setProfileTest({
        status: response.status,
        statusText: response.statusText,
        data: data
      })
    } catch (error) {
      setProfileTest({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const testVendorEndpoints = async () => {
    const endpoints = [
      // Core Auth & Profile
      { path: '/auth/me', name: 'Auth Profile' },
      { path: '/profile/me', name: 'User Profile' },
      
      // Portfolio Management
      { path: '/portfolio/my', name: 'My Portfolios' },
      { path: '/portfolio/all', name: 'All Portfolios' },
      
      // Service Management
      { path: '/service/my', name: 'My Services' },
      { path: '/service/all', name: 'All Services' },
      
      // Service Requests
      { path: '/service-request/my', name: 'My Service Requests' },
      { path: '/service-request/all', name: 'All Service Requests' },
      
      // Vendor Specific
      { path: '/vendor-service-request/my', name: 'Vendor Service Requests' },
      { path: '/vendor-response/my', name: 'Vendor Responses' },
      
      // Vendor Analytics & Performance
      { path: '/vendor/analytics/performance', name: 'Vendor Analytics Performance' },
      { path: '/vendor/analytics/engagement', name: 'Vendor Analytics Engagement' },
      { path: '/vendor/analytics/clients', name: 'Vendor Analytics Clients' },
      { path: '/vendor/analytics/revenue', name: 'Vendor Analytics Revenue' },
      { path: '/vendor/analytics/services', name: 'Vendor Analytics Services' },
      { path: '/vendor/analytics/event-types', name: 'Vendor Analytics Event Types' },
      
      // Vendor Business
      { path: '/vendor/earnings', name: 'Vendor Earnings' },
      { path: '/vendor/earnings/stats', name: 'Vendor Earnings Stats' },
      { path: '/vendor/withdrawals', name: 'Vendor Withdrawals' },
      { path: '/vendor/bank-details', name: 'Vendor Bank Details' },
      
      // Vendor Team Management
      { path: '/vendor/team/staff', name: 'Vendor Team Staff' },
      { path: '/vendor/team/roles', name: 'Vendor Team Roles' },
      
      // Vendor Subscription
      { path: '/vendor/subscription/status', name: 'Vendor Subscription Status' },
      { path: '/vendor/subscription/plans', name: 'Vendor Subscription Plans' },
      { path: '/vendor/subscription/billing', name: 'Vendor Subscription Billing' },
      
      // Other Features
      { path: '/bid/my', name: 'My Bids' },
      { path: '/rating/my', name: 'My Ratings' },
      { path: '/meeting/my', name: 'My Meetings' },
      { path: '/message/conversations', name: 'Message Conversations' },
      { path: '/category/', name: 'Categories' }
    ]
    
    const results = []
    let missingEndpoints = 0
    let workingEndpoints = 0
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`https://backend-a3nd.onrender.com/api/v1${endpoint.path}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.status === 404) {
          results.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            status: 404,
            statusText: 'Not Found',
            message: '❌ Endpoint not implemented on backend',
            type: 'missing'
          })
          missingEndpoints++
        } else {
          const data = await response.json()
          results.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            status: response.status,
            statusText: response.statusText,
            data: data,
            message: response.status === 200 ? '✅ Working' : `⚠️ Status: ${response.status}`,
            type: 'working'
          })
          workingEndpoints++
        }
      } catch (error) {
        results.push({
          endpoint: endpoint.path,
          name: endpoint.name,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: '❌ Network/Parse Error',
          type: 'error'
        })
      }
    }
    
    setProfileTest({
      type: 'vendor_endpoints_test',
      results: results,
      summary: {
        total: endpoints.length,
        working: workingEndpoints,
        missing: missingEndpoints,
        errors: endpoints.length - workingEndpoints - missingEndpoints
      }
    })
  }

  if (!isAuthenticated && !loading) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Authentication Debugger</h3>
        <p className="text-red-600">User is not authenticated</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
      <h3 className="text-blue-800 font-semibold">Authentication Debugger</h3>
      
      <div>
        <h4 className="font-medium text-blue-700">User State:</h4>
        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
          {JSON.stringify({ user, isAuthenticated, loading }, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-medium text-blue-700">Token:</h4>
        <p className="text-xs text-gray-600 break-all">
          {token ? `${token.substring(0, 50)}...` : 'No token found'}
        </p>
      </div>

      <div>
        <h4 className="font-medium text-blue-700">Token Payload:</h4>
        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
          {JSON.stringify(tokenPayload, null, 2)}
        </pre>
        
        {/* Check for missing fields */}
        {tokenPayload && (
          <div className="mt-2">
            <h5 className="font-medium text-red-700 text-sm">Missing Fields:</h5>
            <ul className="text-xs text-red-600 space-y-1">
              {!tokenPayload.email && <li>• email</li>}
              {!tokenPayload.firstName && <li>• firstName</li>}
              {!tokenPayload.lastName && <li>• lastName</li>}
              {!tokenPayload.businessName && <li>• businessName</li>}
              {!tokenPayload.accountType && <li>• accountType</li>}
              {!tokenPayload.email && !tokenPayload.firstName && !tokenPayload.lastName && !tokenPayload.businessName && !tokenPayload.accountType && (
                <li className="text-green-600">All required fields are present!</li>
              )}
            </ul>
            
            {/* Explanation */}
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="text-yellow-800 font-medium">Why are fields missing?</p>
              <ul className="text-yellow-700 mt-1 space-y-1">
                <li>• JWT token only contains basic info (ID, timestamps)</li>
                <li>• User profile data is stored separately in the database</li>
                <li>• Try the &quot;Test Profile API&quot; button to fetch complete profile</li>
                <li>• User may need to complete profile setup</li>
              </ul>
            </div>
            
            {/* Backend Access Issue */}
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <p className="text-red-800 font-medium">⚠️ Backend Access Issue:</p>
              <ul className="text-red-700 mt-1 space-y-1">
                <li>• Generic endpoints reject vendor accounts (403 Forbidden)</li>
                <li>• Some vendor endpoints return HTML (404 Not Found)</li>
                <li>• Backend vendor support is partially implemented</li>
                <li>• Use &quot;Test Vendor Endpoints&quot; to find working endpoints</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={testApiCall}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Test Auth API
        </button>
        <button 
          onClick={testProfileCall}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          Test Profile API
        </button>
        <button 
          onClick={testVendorEndpoints}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
        >
          Test Vendor Endpoints
        </button>
      </div>

      {apiTest && (
        <div>
          <h4 className="font-medium text-blue-700">Auth API Test Result:</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        </div>
      )}

      {profileTest && (
        <div>
          <h4 className="font-medium text-green-700">
            {profileTest.type === 'vendor_endpoints_test' ? 'Vendor Endpoints Test Results:' : 'Profile API Test Result:'}
          </h4>
          
          {profileTest.type === 'vendor_endpoints_test' && profileTest.summary ? (
            <div className="space-y-3">
              {/* Summary */}
              <div className="bg-gray-50 p-3 rounded border">
                <h5 className="font-medium text-gray-800 mb-2">Summary:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Endpoints:</span>
                    <span className="font-medium">{profileTest.summary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>✅ Working:</span>
                    <span className="font-medium text-green-600">{profileTest.summary.working}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>❌ Missing (404):</span>
                    <span className="font-medium text-red-600">{profileTest.summary.missing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚠️ Errors:</span>
                    <span className="font-medium text-yellow-600">{profileTest.summary.errors}</span>
                  </div>
                </div>
              </div>
              
              {/* Detailed Results */}
              <div className="space-y-2">
                {profileTest.results.map((result: any, index: number) => (
                  <div key={index} className={`p-2 rounded border text-xs ${
                    result.type === 'working' ? 'bg-green-50 border-green-200' :
                    result.type === 'missing' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.name}</span>
                      <span className="text-gray-600">{result.endpoint}</span>
                    </div>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        result.type === 'working' ? 'bg-green-100 text-green-800' :
                        result.type === 'missing' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.message}
                      </span>
                      {result.status && (
                        <span className="ml-2 text-gray-600">Status: {result.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
              {JSON.stringify(profileTest, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
