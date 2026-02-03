export interface VendorResponse {
  id: string
  vendorId: string
  requestId: string
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn'
  message: string
  createdAt: string
  updatedAt: string
  // Additional fields that might be present
  vendor?: {
    id: string
    name: string
    email: string
    profilePicture?: string
  }
  serviceRequest?: {
    id: string
    eventTitle: string
    eventDate: string
    eventLocation: string
    budgetRange: string
    client?: {
      id: string
      firstName: string
      lastName: string
      profileImage?: string
      displayPicture?: string
      profilePicture?: string
    }
  }
}

export interface VendorResponseInput {
  status?: 'pending' | 'accepted' | 'declined' | 'withdrawn'
  message?: string
}

export interface VendorResponseStats {
  total: number
  pending: number
  accepted: number
  declined: number
  withdrawn: number
  thisMonth: number
  lastMonth: number
}

export interface VendorResponseFilters {
  status?: string
  dateRange?: {
    start: string
    end: string
  }
  search?: string
  page?: number
  limit?: number
}
