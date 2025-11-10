'use client'

import { useState } from 'react'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useVendorResponses } from '@/hooks/useVendorResponses'
import { serviceRequestAPI } from '@/lib/api'

/**
 * Comprehensive Service Request API Integration Example
 * Demonstrates all service request endpoints and operations
 */
export default function ServiceRequestIntegrationExample() {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('')
  const [testData, setTestData] = useState<Record<string, any>>({})
  
  // Service Request Hook
  const {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    vendorAccept,
    vendorReject,
    toggleRequestStatus,
    updateRequestStatus,
    assignPlanner,
    getVendorResponses,
    getVendorResponseHistory,
    bulkVendorResponses,
    searchRequests,
    getStats
  } = useServiceRequests({ viewType: 'all' })

  // Vendor Response Hook
  const {
    responses,
    loading: responsesLoading,
    error: responsesError,
  } = useVendorResponses()

  // Example service request data
  const exampleServiceRequest = {
    eventTitle: "Wedding Reception",
    eventType: "wedding",
    eventStartDate: "2026-06-15T18:00:00Z",
    eventEndDate: "2026-06-15T23:00:00Z",
    eventLocation: "Grand Ballroom, Hotel Plaza",
    eventCity: "New York",
    servicesNeeded: ["550e8400-e29b-41d4-a716-446655440006", "550e8400-e29b-41d4-a716-446655440004"],
    numberOfGuests: 150,
    budgetRange: "10000-25000",
    additionalInformation: "Looking for elegant wedding reception setup",
    needsEventPlanner: true,
    needsAISuggestions: true,
    images: "www.link.com"
  }

  // Test all endpoints
  const testEndpoints = {
    // 1. CREATE Service Request
    createServiceRequest: async () => {
      try {
        const result = await createRequest(exampleServiceRequest)
        console.log('✅ CREATE Service Request:', result)
        setTestData(prev => ({ ...prev, created: result }))
      } catch (error) {
        console.error('❌ CREATE Service Request failed:', error)
      }
    },

    // 2. GET All Service Requests
    getAllServiceRequests: async () => {
      try {
        await fetchRequests()
        console.log('✅ GET All Service Requests:', requests)
        setTestData(prev => ({ ...prev, allRequests: requests }))
      } catch (error) {
        console.error('❌ GET All Service Requests failed:', error)
      }
    },

    // 3. GET My Service Requests
    getMyServiceRequests: async () => {
      try {
        const result = await serviceRequestAPI.getMy()
        console.log('✅ GET My Service Requests:', result.data)
        setTestData(prev => ({ ...prev, myRequests: result.data.data }))
      } catch (error) {
        console.error('❌ GET My Service Requests failed:', error)
      }
    },

    // 4. GET Assigned Service Requests
    getAssignedServiceRequests: async () => {
      try {
        const result = await serviceRequestAPI.getAssigned()
        console.log('✅ GET Assigned Service Requests:', result.data)
        setTestData(prev => ({ ...prev, assignedRequests: result.data.data }))
      } catch (error) {
        console.error('❌ GET Assigned Service Requests failed:', error)
      }
    },

    // 5. GET Open Service Requests
    getOpenServiceRequests: async () => {
      try {
        const result = await serviceRequestAPI.getOpen()
        console.log('✅ GET Open Service Requests:', result.data)
        setTestData(prev => ({ ...prev, openRequests: result.data.data }))
      } catch (error) {
        console.error('❌ GET Open Service Requests failed:', error)
      }
    },

    // 6. GET Upcoming Service Requests
    getUpcomingServiceRequests: async () => {
      try {
        const result = await serviceRequestAPI.getUpcoming()
        console.log('✅ GET Upcoming Service Requests:', result.data)
        setTestData(prev => ({ ...prev, upcomingRequests: result.data.data }))
      } catch (error) {
        console.error('❌ GET Upcoming Service Requests failed:', error)
      }
    },

    // 7. SEARCH Service Requests
    searchServiceRequests: async () => {
      try {
        const searchParams = {
          eventType: 'wedding',
          eventCity: 'New York',
          budgetRange: '10000-25000'
        }
        const result = await searchRequests(searchParams)
        console.log('✅ SEARCH Service Requests:', result)
        setTestData(prev => ({ ...prev, searchResults: result }))
      } catch (error) {
        console.error('❌ SEARCH Service Requests failed:', error)
      }
    },

    // 8. GET Service Request Stats
    getServiceRequestStats: async () => {
      try {
        const result = await getStats()
        console.log('✅ GET Service Request Stats:', result)
        setTestData(prev => ({ ...prev, stats: result }))
      } catch (error) {
        console.error('❌ GET Service Request Stats failed:', error)
      }
    },

    // 9. GET Service Request by ID
    getServiceRequestById: async () => {
      if (!selectedRequestId) return
      try {
        const result = await serviceRequestAPI.getById(selectedRequestId)
        console.log('✅ GET Service Request by ID:', result.data)
        setTestData(prev => ({ ...prev, requestById: result.data.data }))
      } catch (error) {
        console.error('❌ GET Service Request by ID failed:', error)
      }
    },

    // 10. UPDATE Service Request
    updateServiceRequest: async () => {
      if (!selectedRequestId) return
      try {
        const updateData = {
          eventTitle: "Updated Wedding Reception Party",
          eventType: "wedding"
        }
        const result = await updateRequest(selectedRequestId, updateData)
        console.log('✅ UPDATE Service Request:', result)
        setTestData(prev => ({ ...prev, updated: result }))
      } catch (error) {
        console.error('❌ UPDATE Service Request failed:', error)
      }
    },

    // 11. DELETE Service Request
    deleteServiceRequest: async () => {
      if (!selectedRequestId) return
      try {
        await deleteRequest(selectedRequestId)
        console.log('✅ DELETE Service Request successful')
        setTestData(prev => ({ ...prev, deleted: true }))
      } catch (error) {
        console.error('❌ DELETE Service Request failed:', error)
      }
    },

    // 12. VENDOR ACCEPT Service Request
    vendorAcceptRequest: async () => {
      if (!selectedRequestId) return
      try {
        const result = await vendorAccept(selectedRequestId, { notes: 'Accepted by vendor' })
        console.log('✅ VENDOR ACCEPT Service Request:', result)
        setTestData(prev => ({ ...prev, vendorAccepted: result }))
      } catch (error) {
        console.error('❌ VENDOR ACCEPT Service Request failed:', error)
      }
    },

    // 13. VENDOR REJECT Service Request
    vendorRejectRequest: async () => {
      if (!selectedRequestId) return
      try {
        const result = await vendorReject(selectedRequestId, { notes: 'Rejected by vendor' })
        console.log('✅ VENDOR REJECT Service Request:', result)
        setTestData(prev => ({ ...prev, vendorRejected: result }))
      } catch (error) {
        console.error('❌ VENDOR REJECT Service Request failed:', error)
      }
    },

    // 14. TOGGLE Service Request Status
    toggleServiceRequestStatus: async () => {
      if (!selectedRequestId) return
      try {
        const result = await toggleRequestStatus(selectedRequestId, { eventTitle: "Wedding Reception Party" })
        console.log('✅ TOGGLE Service Request Status:', result)
        setTestData(prev => ({ ...prev, toggled: result }))
      } catch (error) {
        console.error('❌ TOGGLE Service Request Status failed:', error)
      }
    },

    // 15. UPDATE Service Request Status (Admin)
    updateServiceRequestStatus: async () => {
      if (!selectedRequestId) return
      try {
        const result = await updateRequestStatus(selectedRequestId, 'in-progress', 'Work has begun on this request')
        console.log('✅ UPDATE Service Request Status:', result)
        setTestData(prev => ({ ...prev, statusUpdated: result }))
      } catch (error) {
        console.error('❌ UPDATE Service Request Status failed:', error)
      }
    },

    // 16. ASSIGN PLANNER (Admin)
    assignPlannerToRequest: async () => {
      if (!selectedRequestId) return
      try {
        const result = await assignPlanner(selectedRequestId, '9f3e67ab-80a2-4009-8b08-a414d07532d9', 'Assigned to experienced wedding planner')
        console.log('✅ ASSIGN PLANNER:', result)
        setTestData(prev => ({ ...prev, plannerAssigned: result }))
      } catch (error) {
        console.error('❌ ASSIGN PLANNER failed:', error)
      }
    },

    // 17. GET Vendor Responses
    getVendorResponses: async () => {
      if (!selectedRequestId) return
      try {
        const result = await getVendorResponses(selectedRequestId)
        console.log('✅ GET Vendor Responses:', result)
        setTestData(prev => ({ ...prev, vendorResponses: result }))
      } catch (error) {
        console.error('❌ GET Vendor Responses failed:', error)
      }
    },

    // 18. GET Vendor Response History
    getVendorResponseHistory: async () => {
      try {
        const result = await getVendorResponseHistory()
        console.log('✅ GET Vendor Response History:', result)
        setTestData(prev => ({ ...prev, vendorResponseHistory: result }))
      } catch (error) {
        console.error('❌ GET Vendor Response History failed:', error)
      }
    },

    // 19. BULK Vendor Responses
    bulkVendorResponses: async () => {
      try {
        const bulkData = [
          { requestId: selectedRequestId, response: 'accepted', notes: 'Bulk accepted' }
        ]
        const result = await bulkVendorResponses(bulkData)
        console.log('✅ BULK Vendor Responses:', result)
        setTestData(prev => ({ ...prev, bulkResponses: result }))
      } catch (error) {
        console.error('❌ BULK Vendor Responses failed:', error)
      }
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Service Request API Integration Test</h1>
      
      {/* Request ID Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Service Request ID (for operations that need it):</label>
        <input
          type="text"
          value={selectedRequestId}
          onChange={(e) => setSelectedRequestId(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter service request ID..."
        />
      </div>

      {/* API Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(testEndpoints).map(([key, handler]) => (
          <button
            key={key}
            onClick={handler}
            disabled={loading}
            className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <div className="font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div className="text-sm opacity-90">
              {key.includes('Vendor') || key.includes('Assign') || key.includes('Update') || key.includes('Delete') || key.includes('Toggle') 
                ? 'Requires Request ID' 
                : 'Ready to test'
              }
            </div>
          </button>
        ))}
      </div>

      {/* Status Display */}
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        <pre className="text-sm overflow-auto max-h-96">
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>

      {/* Current Requests */}
      <div className="bg-white border rounded-md p-4">
        <h3 className="font-semibold mb-2">Current Service Requests ({requests.length}):</h3>
        <div className="space-y-2">
          {requests.slice(0, 5).map((request) => (
            <div key={request.id} className="p-2 bg-gray-50 rounded text-sm">
              <div><strong>ID:</strong> {request.id}</div>
              <div><strong>Title:</strong> {request.eventTitle}</div>
              <div><strong>Type:</strong> {request.eventType}</div>
              <div><strong>Status:</strong> {request.status}</div>
            </div>
          ))}
          {requests.length === 0 && <div className="text-gray-500">No service requests found</div>}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mt-4">
          Loading...
        </div>
      )}

      {/* Vendor Responses Snapshot */}
      <div className="bg-white border rounded-md p-4 mt-6">
        <h3 className="font-semibold mb-2">Vendor Responses Overview</h3>
        {responsesLoading && <p>Loading vendor responses...</p>}
        {responsesError && (
          <p className="text-red-500">Error loading vendor responses: {responsesError}</p>
        )}
        {!responsesLoading && !responsesError && (
          <p className="text-sm text-gray-700">
            Retrieved <strong>{responses.length}</strong> vendor responses via <code>useVendorResponses</code>. This hook currently exposes read/update operations; creation is handled via service request actions.
          </p>
        )}
      </div>
    </div>
  )
}
