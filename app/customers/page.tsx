'use client'

import React, { useState, useEffect } from 'react'
import CustomerCard from '@/components/customer/CustomerCard'
import { profileAPI } from '@/lib/api'
import { User } from '@/types/api'

export default function CustomersPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const response = await profileAPI.getAll()
        // Filter for vendor accounts only
        const vendorAccounts = response.data.data.filter((profile: any) => 
          profile.accountType === 'vendor' || profile.accountType === 'business'
        )
        setVendors(vendorAccounts)
      } catch (err) {
        setError('Failed to fetch vendors')
        console.error('Error fetching vendors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  // Filter vendors based on search and filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.businessAddress?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Vendors</h1>
          <p className="text-gray-600">Discover professional vendors for your events</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search vendors
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="photography">Photography</option>
                <option value="catering">Catering</option>
                <option value="entertainment">Entertainment</option>
                <option value="decoration">Decoration</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="kano">Kano</option>
                <option value="port-harcourt">Port Harcourt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Vendor Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vendors found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <CustomerCard
                key={vendor.id}
                customer={{
                  id: vendor.id,
                  name: vendor.businessName || `${vendor.firstName} ${vendor.lastName}`,
                  email: vendor.email,
                  phone: vendor.phoneNumber || '',
                  description: `Professional ${vendor.accountType} services`,
                  services: [], // This would need to be fetched from services API
                  location: {
                    city: vendor.businessAddress || 'Location not specified',
                    state: '',
                    zipCode: ''
                  },
                  pricing: {
                    startingPrice: 0,
                    currency: 'USD'
                  },
                  portfolio: {
                    images: [],
                    videos: []
                  },
                  rating: {
                    average: 0,
                    count: 0
                  },
                  availability: {
                    calendar: [],
                    timeSlots: []
                  },
                  verified: vendor.isEmailVerified,
                  createdAt: new Date(vendor.createdAt),
                  updatedAt: new Date(vendor.updatedAt)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}