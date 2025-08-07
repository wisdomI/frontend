export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'client' | 'vendor' | 'admin'
  profile: ClientProfile | VendorProfile | AdminProfile
  createdAt: Date
  updatedAt: Date
}

export interface ClientProfile {
  preferences: {
    eventTypes: string[]
    budgetRange: {
      min: number
      max: number
    }
    location: string
  }
  bookingHistory: string[]
  shortlistedVendors: string[]
}

export interface VendorProfile {
  businessName: string
  businessType: string
  services: string[]
  serviceArea: string[]
  pricing: {
    startingPrice: number
    packages: Package[]
  }
  portfolio: {
    images: string[]
    videos: string[]
  }
  availability: {
    workingDays: string[]
    workingHours: {
      start: string
      end: string
    }
  }
  verified: boolean
  rating: {
    average: number
    count: number
  }
}

export interface AdminProfile {
  permissions: string[]
  department: string
}

export interface Package {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  duration: string
}