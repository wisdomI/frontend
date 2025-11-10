'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiSearch, FiCalendar, FiMapPin, FiTag, FiUsers, FiClock, FiFilter } from 'react-icons/fi'
import ServiceRequestModal, { MarketplaceServiceRequest } from '../../../components/ui/modals/ServiceRequestModal'
import PlaceBidModal from '../../../components/ui/modals/PlaceBidModal'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useVendorServiceRequests } from '@/hooks/useVendorServiceRequests'
import { useCategories } from '@/hooks/useCategories'
import { categoryAPI } from '@/lib/api'
import type { Category, ServiceRequest } from '@/types/api'

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

interface MarketplaceDisplayRequest extends MarketplaceServiceRequest {
  eventType?: string
  eventDate?: Date | null
  locationCity?: string
}

const flattenCategories = (categories: Category[] = []) => {
  const map = new Map<string, string>()

  const traverse = (items: Category[]) => {
    items.forEach((category) => {
      if (!category?.id) {
        return
      }

      map.set(category.id, category.name)

      if (Array.isArray(category.subcategories) && category.subcategories.length > 0) {
        traverse(category.subcategories)
      }
    })
  }

  traverse(categories)
  return map
}

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBudget, setSelectedBudget] = useState('All Budget')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedEventType, setSelectedEventType] = useState('All Event Types')
  const [selectedServiceRequest, setSelectedServiceRequest] = useState<MarketplaceServiceRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlaceBidModalOpen, setIsPlaceBidModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { requests: openRequests, loading: openLoading, error: openError } = useServiceRequests({ viewType: 'open' })
  const { requests: directRequests, loading: directLoading, error: directError } = useVendorServiceRequests({ viewType: 'received', autoFetch: true })
  const { categories: categoryHierarchy } = useCategories()

  const categoryNameMap = useMemo(() => flattenCategories(categoryHierarchy), [categoryHierarchy])
  const [serviceNameOverrides, setServiceNameOverrides] = useState<Record<string, string>>({})

  useEffect(() => {
    const combinedRequests = [
      ...(Array.isArray(openRequests) ? openRequests : []),
      ...(Array.isArray(directRequests) ? directRequests : []),
    ]

    const missingIds = new Set<string>()

    combinedRequests.forEach((request) => {
      const collectCandidate = (candidate: unknown) => {
        if (!candidate) {
          return
        }

        if (typeof candidate === 'string') {
          const trimmed = candidate.trim()
          if (UUID_REGEX.test(trimmed) && !categoryNameMap.get(trimmed) && !serviceNameOverrides[trimmed]) {
            missingIds.add(trimmed)
          }
          return
        }

        if (typeof candidate === 'object') {
          const id = (candidate as { id?: string }).id
          if (id && UUID_REGEX.test(id) && !categoryNameMap.get(id) && !serviceNameOverrides[id]) {
            missingIds.add(id)
          }
        }
      }

      const servicesArray = Array.isArray(request.servicesNeeded)
        ? request.servicesNeeded
        : request.servicesNeeded
        ? [request.servicesNeeded]
        : []

      servicesArray.forEach(collectCandidate)

      if (Array.isArray((request as any).services)) {
        ;(request as any).services.forEach(collectCandidate)
      }
    })

    if (missingIds.size === 0) {
      return
    }

    let cancelled = false

    const fetchMissingNames = async () => {
      const resolvedEntries: Record<string, string> = {}

      for (const id of missingIds) {
        try {
          const response = await categoryAPI.getById(id)
          const category = response.data?.data
          if (category?.name) {
            resolvedEntries[id] = category.name
          }
        } catch (err) {
          console.warn('Failed to resolve category name for ID', id, err)
        }
      }

      if (!cancelled && Object.keys(resolvedEntries).length > 0) {
        setServiceNameOverrides((prev) => ({
          ...prev,
          ...resolvedEntries,
        }))
      }
    }

    fetchMissingNames()

    return () => {
      cancelled = true
    }
  }, [openRequests, directRequests, categoryNameMap, serviceNameOverrides])

  const resolveServiceName = useCallback((service: unknown) => {
    if (!service) {
      return undefined
    }

    if (typeof service === 'string') {
      const normalized = service.trim()
      const mappedName = categoryNameMap.get(normalized) || serviceNameOverrides[normalized]

      if (mappedName) {
        return mappedName
      }

      const looksLikeUuid = UUID_REGEX.test(normalized)
      if (looksLikeUuid) {
        return serviceNameOverrides[normalized]
      }

      return normalized
    }

    if (typeof service === 'object') {
      const id = (service as { id?: string }).id
      if (id) {
        const mappedName = categoryNameMap.get(id) || serviceNameOverrides[id]
        if (mappedName) {
          return mappedName
        }
      }

      const name =
        (service as { name?: string }).name ||
        (service as { title?: string }).title ||
        (service as { label?: string }).label ||
        (service as { serviceName?: string }).serviceName

      if (typeof name === 'string' && name.trim().length > 0) {
        return name.trim()
      }
    }

    return undefined
  }, [categoryNameMap, serviceNameOverrides])

  const transformRequest = useCallback((request: ServiceRequest): MarketplaceDisplayRequest => {
    const eventDate = request.eventStartDate ? new Date(request.eventStartDate) : null
    const formattedDate = eventDate
      ? eventDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : undefined
    const rawServices = Array.isArray(request.servicesNeeded)
      ? request.servicesNeeded
      : request.servicesNeeded
      ? [request.servicesNeeded as unknown as string]
      : []
    let normalizedServices = rawServices
      .map(resolveServiceName)
      .filter((serviceName): serviceName is string => typeof serviceName === 'string' && serviceName.length > 0)

    if (normalizedServices.length === 0 && Array.isArray((request as any).services)) {
      normalizedServices = (request as any).services
        .map((service: any) => resolveServiceName(service))
        .filter((serviceName: unknown): serviceName is string => typeof serviceName === 'string' && serviceName.length > 0)
    }
    const rawDescription = (request as any).description
    const description =
      (request as any).additionalInformation ||
      (request as any).additionalInfo ||
      (request as any).additional_details ||
      (typeof rawDescription === 'string' ? rawDescription : undefined) ||
      'No additional information provided.'

    return {
      id: request.id,
      title: request.eventTitle || 'Untitled Event',
      location: request.eventLocation || request.eventCity || 'Location TBD',
      date: formattedDate,
      description,
      tags: normalizedServices,
      budget: request.budgetRange || undefined,
      guestCount: typeof request.numberOfGuests === 'number' ? request.numberOfGuests : undefined,
      requirements: normalizedServices,
      samples: request.images || [],
      eventType: request.eventType,
      eventDate,
      locationCity: request.eventCity || request.eventLocation || undefined
    }
  }, [resolveServiceName])

  const transformedRequests = useMemo<MarketplaceDisplayRequest[]>(() => {
    const combinedRequests = [
      ...(Array.isArray(openRequests) ? openRequests : []),
      ...(Array.isArray(directRequests) ? directRequests : []),
    ]

    const uniqueRequests = combinedRequests.reduce<ServiceRequest[]>((acc, current) => {
      if (!current?.id) {
        return acc
      }

      const exists = acc.some((request) => request.id === current.id)
      if (!exists) {
        acc.push(current)
      }

      return acc
    }, [])

    return uniqueRequests.map(transformRequest)
  }, [openRequests, directRequests, transformRequest])

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()
    const category = selectedCategory.toLowerCase()
    const budget = selectedBudget.toLowerCase()
    const location = selectedLocation.toLowerCase()
    const eventType = selectedEventType.toLowerCase()

    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const isWithinDateFilter = (eventDate?: Date | null) => {
      if (!selectedDate || selectedDate === '' || !eventDate) return true
      const diffInDays = Math.floor((eventDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24))

      switch (selectedDate) {
        case 'today':
          return diffInDays === 0
        case 'tomorrow':
          return diffInDays === 1
        case 'this-week':
          return diffInDays >= 0 && diffInDays < 7
        case 'next-week':
          return diffInDays >= 7 && diffInDays < 14
        case 'this-month':
          return (
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
          )
        default:
          return true
      }
    }

    return transformedRequests.filter((request) => {
      const matchesSearch =
        !search ||
        request.title.toLowerCase().includes(search) ||
        (request.location && request.location.toLowerCase().includes(search)) ||
        (request.description && request.description.toLowerCase().includes(search)) ||
        (request.eventType && request.eventType.toLowerCase().includes(search)) ||
        (request.tags && request.tags.some(tag => tag.toLowerCase().includes(search)))

      const matchesCategory =
        selectedCategory === 'All Categories' ||
        (request.tags && request.tags.some(tag => tag.toLowerCase().includes(category))) ||
        (request.eventType && request.eventType.toLowerCase().includes(category))

      const matchesBudget =
        selectedBudget === 'All Budget' ||
        (request.budget && request.budget.toLowerCase().includes(budget))

      const matchesLocation =
        selectedLocation === 'All Locations' ||
        (request.location && request.location.toLowerCase().includes(location))

      const matchesEventType =
        selectedEventType === 'All Event Types' ||
        (request.eventType && request.eventType.toLowerCase() === eventType)

      const matchesDate = isWithinDateFilter(request.eventDate)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBudget &&
        matchesLocation &&
        matchesEventType &&
        matchesDate
      )
    })
  }, [
    transformedRequests,
    searchTerm,
    selectedCategory,
    selectedBudget,
    selectedLocation,
    selectedEventType,
    selectedDate
  ])

  const handleOpenBid = (serviceRequest: MarketplaceServiceRequest) => {
    setSelectedServiceRequest(serviceRequest)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedServiceRequest(null)
    setIsPlaceBidModalOpen(false)
  }

  const handlePlaceBid = (serviceRequest: MarketplaceServiceRequest) => {
    setSelectedServiceRequest(serviceRequest)
    setIsPlaceBidModalOpen(true)
  }

  const handleClosePlaceBidModal = () => {
    setIsPlaceBidModalOpen(false)
  }

  const renderFilters = () => (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Event Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">Select Date</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="this-week">This Week</option>
          <option value="next-week">Next Week</option>
          <option value="this-month">This Month</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="All Categories">All Categories</option>
          <option value="Catering">Catering</option>
          <option value="Photography">Photography</option>
          <option value="DJ Services">DJ Services</option>
          <option value="Decorations">Decorations</option>
          <option value="Venue">Venue</option>
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
        <select
          value={selectedBudget}
          onChange={(e) => setSelectedBudget(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="All Budget">All Budget</option>
          <option value="Under ₦100k">Under ₦100k</option>
          <option value="₦100k - ₦300k">₦100k - ₦300k</option>
          <option value="₦300k - ₦500k">₦300k - ₦500k</option>
          <option value="₦500k - ₦1M">₦500k - ₦1M</option>
          <option value="Above ₦1M">Above ₦1M</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="All Locations">All Locations</option>
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
          <option value="Port Harcourt">Port Harcourt</option>
          <option value="Kano">Kano</option>
          <option value="Ibadan">Ibadan</option>
        </select>
      </div>

      {/* Event Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
        <select
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="All Event Types">All Event Types</option>
          <option value="Wedding">Wedding</option>
          <option value="Birthday">Birthday</option>
          <option value="Corporate">Corporate</option>
          <option value="Conference">Conference</option>
          <option value="Party">Party</option>
        </select>
      </div>

      {/* Show Results Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">
        Show Result
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors"
          aria-label={showFilters ? "Hide filter" : "Show filter"}
        >
          <FiFilter className="w-4 h-4" />
          <span className="text-sm font-medium">
            {showFilters ? 'Hide Filter' : 'Show Filter'}
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Marketplace</h1>
              <p className="text-gray-600 text-sm sm:text-base">Discover and bid on service requests</p>
            </div>

            {/* Service Request Cards */}
            <div className="space-y-4 sm:space-y-6">
              {openLoading || directLoading ? (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center text-gray-600">
                  Loading marketplace requests...
                </div>
              ) : openError || directError ? (
                <div className="bg-white rounded-lg shadow-md border border-red-200 p-6 text-center text-red-600">
                  Failed to load marketplace requests.
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center text-gray-600">
                  No service requests found for the selected filters.
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{request.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-2 gap-1 sm:gap-4">
                          {request.location && (
                            <div className="flex items-center">
                              <FiMapPin className="w-4 h-4 mr-2" />
                              <span>{request.location}</span>
                            </div>
                          )}
                          {request.date && (
                            <div className="flex items-center">
                              <FiCalendar className="w-4 h-4 mr-2" />
                              <span>{request.date}</span>
                            </div>
                          )}
                          {request.guestCount !== undefined && (
                            <div className="flex items-center">
                              <FiUsers className="w-4 h-4 mr-2" />
                              <span>{request.guestCount} Guests</span>
                            </div>
                          )}
                          {request.eventType && (
                            <div className="flex items-center">
                              <FiTag className="w-4 h-4 mr-2" />
                              <span>{request.eventType}</span>
                            </div>
                          )}
                        </div>
                        {request.description && (
                          <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">{request.description}</p>
                        )}
                        
                        {/* Tags */}
                        {request.tags && request.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {request.tags.map((tag, index) => (
                              <span key={index} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                        {request.budget && (
                          <div className="text-green-600 font-semibold text-sm sm:text-base">
                            {request.budget}
                          </div>
                        )}
                        <button 
                          onClick={() => handleOpenBid(request)}
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handlePlaceBid(request)}
                          className="w-full sm:w-auto border border-green-600 text-green-600 hover:bg-green-50 px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                        >
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          {renderFilters()}
        </div>
      </div>

      {/* Modal overlay for mobile filter */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close filter"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {renderFilters()}
            </div>
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      {selectedServiceRequest && (
        <>
          <ServiceRequestModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            serviceRequest={selectedServiceRequest}
          />
          <PlaceBidModal
            isOpen={isPlaceBidModalOpen}
            onClose={handleClosePlaceBidModal}
            serviceRequest={{
              id: selectedServiceRequest.id,
              title: selectedServiceRequest.title,
              location: selectedServiceRequest.location,
              date: selectedServiceRequest.date,
              budget: selectedServiceRequest.budget
            }}
          />
        </>
      )}
    </div>
  )
}

export default MarketplacePage
