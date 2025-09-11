import { Booking } from './booking'

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  description: string
  services: string[]
  location: {
    city: string
    state: string
    zipCode: string
  }
  pricing: {
    startingPrice: number
    currency: string
  }
  portfolio: {
    images: string[]
    videos?: string[]
  }
  rating: {
    average: number
    count: number
  }
  availability: {
    calendar: Date[]
    timeSlots: string[]
  }
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface VendorProfile {
  vendor: Vendor
  reviews: Review[]
  bookings: Booking[]
}

export interface Review {
  id: string
  vendorId: string
  clientId: string
  rating: number
  comment: string
  eventDate: Date
  createdAt: Date
}