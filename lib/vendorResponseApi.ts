import { VendorResponse, VendorResponseInput, VendorResponseStats, VendorResponseFilters } from '@/types/vendorResponse'

const BASE_URL = 'https://backend-a3nd.onrender.com/api/v1/service-requests/vendor-responses'

export async function getAllVendorResponses(token: string, filters?: VendorResponseFilters): Promise<VendorResponse[]> {
  const params = new URLSearchParams()
  
  if (filters?.status) params.append('status', filters.status)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.dateRange) {
    params.append('startDate', filters.dateRange.start)
    params.append('endDate', filters.dateRange.end)
  }

  const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL
  
  const res = await fetch(url, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch vendor responses: ${res.status}`)
  }
  
  const data = await res.json()
  return data.data || data
}

export async function getVendorResponseById(id: string, token: string): Promise<VendorResponse> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch vendor response: ${res.status}`)
  }
  
  const data = await res.json()
  return data.data || data
}

export async function updateVendorResponse(id: string, data: VendorResponseInput, token: string): Promise<VendorResponse> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to update vendor response: ${res.status}`)
  }
  
  const responseData = await res.json()
  return responseData.data || responseData
}

export async function withdrawVendorResponse(id: string, token: string): Promise<VendorResponse> {
  const res = await fetch(`${BASE_URL}/${id}/withdraw`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to withdraw vendor response: ${res.status}`)
  }
  
  const data = await res.json()
  return data.data || data
}

export async function deleteVendorResponse(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to delete vendor response: ${res.status}`)
  }
}

export async function getVendorResponsesByRequest(requestId: string, token: string): Promise<VendorResponse[]> {
  const res = await fetch(`${BASE_URL}/request?requestId=${requestId}`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch vendor responses for request: ${res.status}`)
  }
  
  const data = await res.json()
  return data.data || data
}

export async function getVendorResponseStats(token: string): Promise<VendorResponseStats> {
  const res = await fetch(`${BASE_URL}/stats`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch vendor response stats: ${res.status}`)
  }
  
  const data = await res.json()
  return data.data || data
}
