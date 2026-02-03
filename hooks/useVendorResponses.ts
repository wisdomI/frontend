import { useState, useEffect, useCallback } from 'react'
import { VendorResponse, VendorResponseInput, VendorResponseStats, VendorResponseFilters } from '@/types/vendorResponse'
import { 
  getAllVendorResponses, 
  getVendorResponseById, 
  updateVendorResponse, 
  withdrawVendorResponse, 
  deleteVendorResponse,
  getVendorResponsesByRequest,
  getVendorResponseStats
} from '@/lib/vendorResponseApi'

interface UseVendorResponsesOptions {
  autoFetch?: boolean
  filters?: VendorResponseFilters
}

interface UseVendorResponsesReturn {
  responses: VendorResponse[]
  stats: VendorResponseStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateResponse: (id: string, data: VendorResponseInput) => Promise<VendorResponse>
  withdrawResponse: (id: string) => Promise<VendorResponse>
  deleteResponse: (id: string) => Promise<void>
  getResponseById: (id: string) => Promise<VendorResponse>
  getResponsesByRequest: (requestId: string) => Promise<VendorResponse[]>
}

export function useVendorResponses(options: UseVendorResponsesOptions = {}): UseVendorResponsesReturn {
  const { autoFetch = true, filters } = options
  
  const [responses, setResponses] = useState<VendorResponse[]>([])
  const [stats, setStats] = useState<VendorResponseStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  }, [])

  const fetchResponses = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setError('No authentication token found')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [responsesData, statsData] = await Promise.all([
        getAllVendorResponses(token, filters),
        getVendorResponseStats(token)
      ])
      
      setResponses(responsesData)
      setStats(statsData)
    } catch (err: any) {
      console.error('Error fetching vendor responses:', err)
      setError(err.message || 'Failed to fetch vendor responses')
    } finally {
      setLoading(false)
    }
  }, [getToken, filters])

  const updateResponse = useCallback(async (id: string, data: VendorResponseInput): Promise<VendorResponse> => {
    const token = getToken()
    if (!token) throw new Error('No authentication token found')

    try {
      const updatedResponse = await updateVendorResponse(id, data, token)
      
      // Update the local state
      setResponses(prev => 
        prev.map(response => 
          response.id === id ? updatedResponse : response
        )
      )
      
      return updatedResponse
    } catch (err: any) {
      console.error('Error updating vendor response:', err)
      throw err
    }
  }, [getToken])

  const withdrawResponse = useCallback(async (id: string): Promise<VendorResponse> => {
    const token = getToken()
    if (!token) throw new Error('No authentication token found')

    try {
      const withdrawnResponse = await withdrawVendorResponse(id, token)
      
      // Update the local state
      setResponses(prev => 
        prev.map(response => 
          response.id === id ? withdrawnResponse : response
        )
      )
      
      return withdrawnResponse
    } catch (err: any) {
      console.error('Error withdrawing vendor response:', err)
      throw err
    }
  }, [getToken])

  const deleteResponse = useCallback(async (id: string): Promise<void> => {
    const token = getToken()
    if (!token) throw new Error('No authentication token found')

    try {
      await deleteVendorResponse(id, token)
      
      // Remove from local state
      setResponses(prev => prev.filter(response => response.id !== id))
    } catch (err: any) {
      console.error('Error deleting vendor response:', err)
      throw err
    }
  }, [getToken])

  const getResponseById = useCallback(async (id: string): Promise<VendorResponse> => {
    const token = getToken()
    if (!token) throw new Error('No authentication token found')

    try {
      return await getVendorResponseById(id, token)
    } catch (err: any) {
      console.error('Error fetching vendor response by ID:', err)
      throw err
    }
  }, [getToken])

  const getResponsesByRequest = useCallback(async (requestId: string): Promise<VendorResponse[]> => {
    const token = getToken()
    if (!token) throw new Error('No authentication token found')

    try {
      return await getVendorResponsesByRequest(requestId, token)
    } catch (err: any) {
      console.error('Error fetching vendor responses by request:', err)
      throw err
    }
  }, [getToken])

  const refetch = useCallback(async () => {
    await fetchResponses()
  }, [fetchResponses])

  useEffect(() => {
    if (autoFetch) {
      fetchResponses()
    }
  }, [autoFetch, fetchResponses])

  return {
    responses,
    stats,
    loading,
    error,
    refetch,
    updateResponse,
    withdrawResponse,
    deleteResponse,
    getResponseById,
    getResponsesByRequest
  }
}