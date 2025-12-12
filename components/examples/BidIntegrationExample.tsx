'use client'

import React, { useState } from 'react'
import { bidAPI } from '@/lib/api'
import { CreateBidRequest, UpdateBidRequest } from '@/types/api'

const BidIntegrationExample: React.FC = () => {
  const [testData, setTestData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sampleBidData: CreateBidRequest = {
    serviceRequestId: "64f9b88f-5e74-4564-999c-90d0b6acae72",
    bidAmount: 25000.0,
    startDate: "2026-02-15T10:00:00Z",
    endDate: "2026-02-20T18:00:00Z",
    proposedDetails: "I will provide full event planning services including venue setup, catering coordination, and entertainment management.",
    additionalServices: ["Photography", "Videography", "DJ Services"]
  }

  const sampleUpdateData: UpdateBidRequest = {
    bidAmount: 30000.0,
    proposedDetails: "I am going to provide full event planning services including venue setup, catering coordination, and entertainment management.",
    additionalServices: ["Photography", "Videography", "DJ Services", "Live Band"]
  }

  const handleApiCall = async (apiCall: () => Promise<any>, operation: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setTestData((prev: any) => ({ ...prev, [operation]: result.data }))
      console.log(`${operation} result:`, result)
    } catch (err: any) {
      setError(`${operation} failed: ${err.message}`)
      console.error(`${operation} error:`, err)
    } finally {
      setLoading(false)
    }
  }

  const operations = [
    {
      name: 'Create Bid',
      action: () => handleApiCall(() => bidAPI.create(sampleBidData), 'createBid'),
      description: 'POST /bids/details - Create a new bid'
    },
    {
      name: 'Get All Bids',
      action: () => handleApiCall(() => bidAPI.getAll(), 'getAllBids'),
      description: 'GET /bids - Get all bids'
    },
    {
      name: 'Get Bids with Details',
      action: () => handleApiCall(() => bidAPI.getWithDetails(), 'getBidsWithDetails'),
      description: 'GET /bids/details - Get bids with details'
    },
    {
      name: 'Get Bid Stats',
      action: () => handleApiCall(() => bidAPI.getStats(), 'getBidStats'),
      description: 'GET /bids/stats - Get bid statistics'
    },
    {
      name: 'Get Bid by ID',
      action: () => handleApiCall(() => bidAPI.getById('e587a7d1-8fbb-46b1-aea0-816ed4bddab9'), 'getBidById'),
      description: 'GET /bids/:id - Get specific bid by ID'
    },
    {
      name: 'Update Bid',
      action: () => handleApiCall(() => bidAPI.update('e587a7d1-8fbb-46b1-aea0-816ed4bddab9', sampleUpdateData), 'updateBid'),
      description: 'PATCH /bids/:id - Update a bid'
    },
    {
      name: 'Withdraw Bid',
      action: () => handleApiCall(() => bidAPI.withdraw('e587a7d1-8fbb-46b1-aea0-816ed4bddab9'), 'withdrawBid'),
      description: 'PATCH /bids/:id/withdraw - Withdraw a bid'
    },
    {
      name: 'Delete Bid',
      action: () => handleApiCall(() => bidAPI.delete('e587a7d1-8fbb-46b1-aea0-816ed4bddab9'), 'deleteBid'),
      description: 'DELETE /bids/:id/withdraw - Delete a bid'
    },
    {
      name: 'Accept Bid',
      action: () => handleApiCall(() => bidAPI.accept('e587a7d1-8fbb-46b1-aea0-816ed4bddab9'), 'acceptBid'),
      description: 'PATCH /bids/requester/:id/accept - Accept a bid'
    },
    {
      name: 'Reject Bid',
      action: () => handleApiCall(() => bidAPI.reject('e587a7d1-8fbb-46b1-aea0-816ed4bddab9'), 'rejectBid'),
      description: 'PATCH /bids/requester/:id/reject - Reject a bid'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bid API Integration Test</h1>
        <p className="text-gray-600">Test all bid endpoints according to the provided API specification</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {operations.map((operation, index) => (
          <button
            key={index}
            onClick={operation.action}
            disabled={loading}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <h3 className="font-semibold text-blue-900 mb-1">{operation.name}</h3>
            <p className="text-sm text-blue-700">{operation.description}</p>
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Responses</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {Object.keys(testData).length > 0 
              ? JSON.stringify(testData, null, 2)
              : 'No API calls made yet. Click the buttons above to test the endpoints.'
            }
          </pre>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-medium mb-2">API Endpoints Tested:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• POST /bids/details - Create bid</li>
          <li>• GET /bids - Get all bids</li>
          <li>• GET /bids/details - Get bids with details</li>
          <li>• GET /bids/stats - Get bid statistics</li>
          <li>• GET /bids/:id - Get bid by ID</li>
          <li>• PATCH /bids/:id - Update bid</li>
          <li>• PATCH /bids/:id/withdraw - Withdraw bid</li>
          <li>• DELETE /bids/:id/withdraw - Delete bid</li>
          <li>• PATCH /bids/requester/:id/accept - Accept bid</li>
          <li>• PATCH /bids/requester/:id/reject - Reject bid</li>
        </ul>
      </div>
    </div>
  )
}

export default BidIntegrationExample
