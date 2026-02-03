'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { FiSearch, FiCalendar, FiMapPin, FiTag, FiUsers, FiClock, FiFilter, FiChevronDown } from 'react-icons/fi'
import ServiceRequestModal, { MarketplaceServiceRequest } from '../../../components/ui/modals/ServiceRequestModal'
import PlaceBidModal from '../../../components/ui/modals/PlaceBidModal'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useVendorServiceRequests } from '@/hooks/useVendorServiceRequests'
import { useCategories } from '@/hooks/useCategories'
import { bidAPI, categoryAPI, serviceRequestAPI } from '@/lib/api'
import type { Bid, Category, ServiceRequest } from '@/types/api'

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

const EVENT_DATE_OPTIONS = [
  { label: 'All Dates', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This Week', value: 'this-week' },
  { label: 'Next Week', value: 'next-week' },
  { label: 'This Month', value: 'this-month' },
]

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'All Categories' },
  { label: 'Catering', value: 'Catering' },
  { label: 'Photography', value: 'Photography' },
  { label: 'DJ Services', value: 'DJ Services' },
  { label: 'Decorations', value: 'Decorations' },
  { label: 'Venue', value: 'Venue' },
]

const BUDGET_OPTIONS = [
  { label: 'All Budget', value: 'All Budget' },
  { label: 'Under ₦100k', value: 'Under ₦100k' },
  { label: '₦100k - ₦300k', value: '₦100k - ₦300k' },
  { label: '₦300k - ₦500k', value: '₦300k - ₦500k' },
  { label: '₦500k - ₦1M', value: '₦500k - ₦1M' },
  { label: 'Above ₦1M', value: 'Above ₦1M' },
]

const LOCATION_OPTIONS = [
  { label: 'All Locations', value: 'All Locations' },
  { label: 'Lagos', value: 'Lagos' },
  { label: 'Abuja', value: 'Abuja' },
  { label: 'Port Harcourt', value: 'Port Harcourt' },
  { label: 'Kano', value: 'Kano' },
  { label: 'Ibadan', value: 'Ibadan' },
]

const EVENT_TYPE_OPTIONS = [
  { label: 'All Event Types', value: 'All Event Types' },
  { label: 'Wedding', value: 'Wedding' },
  { label: 'Birthday', value: 'Birthday' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Conference', value: 'Conference' },
  { label: 'Party', value: 'Party' },
]

const BID_STATUS_OPTIONS = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' },
]

const BID_SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Highest Budget', value: 'highest' },
  { label: 'Lowest Budget', value: 'lowest' },
  { label: 'By Deadline', value: 'deadline' },
]

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
  const [activeView, setActiveView] = useState<'marketplace' | 'myBids'>('marketplace')
  const [bidStatusFilter, setBidStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'expired'>('all')
  const [bidSortOption, setBidSortOption] = useState<'latest' | 'oldest' | 'highest' | 'lowest' | 'deadline'>('latest')
  const [bidSearchTerm, setBidSearchTerm] = useState('')
  const [myBids, setMyBids] = useState<Bid[]>([])
  const [bidsLoading, setBidsLoading] = useState(false)
  const [bidsError, setBidsError] = useState<string | null>(null)
  const [requestDetailsMap, setRequestDetailsMap] = useState<Record<string, MarketplaceDisplayRequest>>({})

  const {
    requests: openRequests,
    loading: openLoading,
    error: openError,
    fetchRequests: fetchOpenRequests,
  } = useServiceRequests({ viewType: 'open', autoFetch: false })
  const {
    requests: directRequests,
    loading: directLoading,
    error: directError,
    fetchRequests: fetchVendorRequests,
  } = useVendorServiceRequests({ viewType: 'received', autoFetch: false })
  const { categories: categoryHierarchy } = useCategories()

  const categoryNameMap = useMemo(() => flattenCategories(categoryHierarchy), [categoryHierarchy])
  const [serviceNameOverrides, setServiceNameOverrides] = useState<Record<string, string>>({})
  const serviceNameOverridesRef = useRef<Record<string, string>>({})
  const requestDetailsRef = useRef<Record<string, MarketplaceDisplayRequest>>({})
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
      }),
    []
  )

  const formatCurrency = useCallback(
    (value?: number | string | null) => {
      if (value === undefined || value === null) return undefined
      const numericValue = typeof value === 'number' ? value : parseFloat(value)
      if (Number.isNaN(numericValue)) return undefined
      return currencyFormatter.format(numericValue)
    },
    [currencyFormatter]
  )
  const [hasLoadedData, setHasLoadedData] = useState(false)

  const fetchBids = useCallback(async () => {
    try {
      setBidsLoading(true)
      setBidsError(null)
      const response = await bidAPI.getAll()
      const bids = response.data?.data ?? []
      setMyBids(bids)
    } catch (error) {
      console.error('Failed to fetch bids', error)
      setBidsError('Unable to load your bids right now.')
    } finally {
      setBidsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (openRequests.length > 0 || directRequests.length > 0) {
      setHasLoadedData(true)
    }
  }, [openRequests, directRequests])

  useEffect(() => {
    fetchBids().catch(() => null)
  }, [fetchBids])

  useEffect(() => {
    if (activeView === 'myBids') {
      fetchBids().catch(() => null)
    }
  }, [activeView, fetchBids])

  useEffect(() => {
    let cancelled = false
    let idleHandle: number | null = null
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null

    const runFetch = async () => {
      try {
        await Promise.all([
          fetchOpenRequests().catch(() => null),
          fetchVendorRequests().catch(() => null),
        ])
      } finally {
        if (!cancelled) {
          setHasLoadedData(true)
        }
      }
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleHandle = (window as any).requestIdleCallback(runFetch)
    } else {
      timeoutHandle = setTimeout(runFetch, 0)
    }

    return () => {
      cancelled = true
      if (idleHandle !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleHandle)
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle)
      }
    }
  }, [fetchOpenRequests, fetchVendorRequests])

  useEffect(() => {
    serviceNameOverridesRef.current = serviceNameOverrides
  }, [serviceNameOverrides])

  useEffect(() => {
    requestDetailsRef.current = requestDetailsMap
  }, [requestDetailsMap])

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
          if (UUID_REGEX.test(trimmed) && !categoryNameMap.get(trimmed) && !serviceNameOverridesRef.current[trimmed]) {
            missingIds.add(trimmed)
          }
          return
        }

        if (typeof candidate === 'object') {
          const id = (candidate as { id?: string }).id
          if (id && UUID_REGEX.test(id) && !categoryNameMap.get(id) && !serviceNameOverridesRef.current[id]) {
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
        setServiceNameOverrides((prev) => {
          const next = { ...prev }
          let hasChanges = false

          Object.entries(resolvedEntries).forEach(([key, value]) => {
            if (!next[key]) {
              next[key] = value
              hasChanges = true
            }
          })

          if (hasChanges) {
            return next
          }

          return prev
        })
      }
    }

    fetchMissingNames()

    return () => {
      cancelled = true
    }
  }, [openRequests, directRequests, categoryNameMap])


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

    const client = (request as any).client
    const clientName = client
      ? (
          [
            client.firstName,
            client.lastName,
            client.businessName && !client.firstName && !client.lastName ? client.businessName : null,
          ]
            .filter(Boolean)
            .join(' ') ||
          client.displayName ||
          client.username ||
          client.email
        )
      : undefined

    const clientInfo = client
      ? {
          name: clientName || 'Client',
          rating:
            typeof client.rating === 'number'
              ? client.rating
              : typeof client.averageRating === 'number'
              ? client.averageRating
              : undefined,
          eventsHosted: client.eventsHosted ?? client.totalEvents ?? client.totalBookings,
          totalSpent: formatCurrency(client.totalSpent ?? client.total_spent ?? client.totalSpend),
          paymentHistory: client.paymentBehavior || client.paymentHistory || client.paymentHabits,
          communication: client.communicationStyle || client.averageResponseTime,
          reviews: client.recentReview || client.reviewSummary,
          memberSince: client.createdAt
            ? new Date(client.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
            : undefined,
          avatar: client.profileImage || client.displayPicture || client.avatar,
        }
      : undefined

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
      locationCity: request.eventCity || request.eventLocation || undefined,
      clientInfo,
    }
  }, [resolveServiceName, formatCurrency])

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

  const serviceRequestMap = useMemo(() => {
    const map = new Map<string, MarketplaceDisplayRequest>()
    transformedRequests.forEach((request) => {
      if (request?.id) {
        map.set(request.id, request)
      }
    })
    Object.entries(requestDetailsMap).forEach(([id, request]) => {
      if (id && request) {
        map.set(id, request)
      }
    })
    return map
  }, [transformedRequests, requestDetailsMap])

  useEffect(() => {
    if (myBids.length === 0) {
      return
    }

    const knownIds = new Set<string>([
      ...transformedRequests.map((request) => request.id),
      ...Object.keys(requestDetailsRef.current || {}),
    ])

    const missingRequestIds = myBids
      .map((bid) => bid.serviceRequestId)
      .filter((id): id is string => Boolean(id) && !knownIds.has(id))

    if (missingRequestIds.length === 0) {
      return
    }

    let cancelled = false

    const fetchMissingRequests = async () => {
      const resolvedEntries: Record<string, MarketplaceDisplayRequest> = {}

      for (const id of missingRequestIds) {
        try {
          const response = await serviceRequestAPI.getById(id)
          const request = response.data?.data
          if (request) {
            resolvedEntries[id] = transformRequest(request as ServiceRequest)
          }
        } catch (error) {
          console.warn('Failed to fetch service request details for bid', id, error)
        }
      }

      if (!cancelled && Object.keys(resolvedEntries).length > 0) {
        setRequestDetailsMap((prev) => ({ ...prev, ...resolvedEntries }))
      }
    }

    fetchMissingRequests()

    return () => {
      cancelled = true
    }
  }, [myBids, transformedRequests, transformRequest])

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

  const decoratedBids = useMemo(() => {
    const now = Date.now()
    return myBids.map((bid) => {
      const request = bid.serviceRequestId ? serviceRequestMap.get(bid.serviceRequestId) : undefined
      const deadlineDate = request?.eventDate || (bid.endDate ? new Date(bid.endDate) : null)
      const isExpired = deadlineDate ? deadlineDate.getTime() < now : false

      let filterStatus: 'pending' | 'accepted' | 'rejected' | 'expired' =
        bid.status === 'pending'
          ? 'pending'
          : bid.status === 'accepted'
          ? 'accepted'
          : 'rejected'

      if (isExpired && bid.status === 'pending') {
        filterStatus = 'expired'
      }

      const statusLabel =
        filterStatus === 'expired'
          ? 'Expired'
          : bid.status.charAt(0).toUpperCase() + bid.status.slice(1)

      return {
        bid,
        request,
        deadlineDate,
        statusLabel,
        filterStatus,
      }
    })
  }, [myBids, serviceRequestMap])

  const filteredBids = useMemo(() => {
    const search = bidSearchTerm.trim().toLowerCase()
    const filtered = decoratedBids.filter(({ request, filterStatus }) => {
      const matchesStatus = bidStatusFilter === 'all' ? true : filterStatus === bidStatusFilter
      const matchesSearch =
        !search ||
        request?.title?.toLowerCase().includes(search) ||
        request?.location?.toLowerCase().includes(search) ||
        request?.clientInfo?.name?.toLowerCase().includes(search)

      return matchesStatus && matchesSearch
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (bidSortOption) {
        case 'oldest':
          return new Date(a.bid.createdAt).getTime() - new Date(b.bid.createdAt).getTime()
        case 'highest':
          return Number(b.bid.bidAmount) - Number(a.bid.bidAmount)
        case 'lowest':
          return Number(a.bid.bidAmount) - Number(b.bid.bidAmount)
        case 'deadline': {
          const aTime = a.deadlineDate ? a.deadlineDate.getTime() : Infinity
          const bTime = b.deadlineDate ? b.deadlineDate.getTime() : Infinity
          return aTime - bTime
        }
        case 'latest':
        default:
          return new Date(b.bid.createdAt).getTime() - new Date(a.bid.createdAt).getTime()
      }
    })

    return sorted
  }, [decoratedBids, bidStatusFilter, bidSortOption, bidSearchTerm])

  const formatDeadlineText = useCallback((deadline?: Date | null) => {
    if (!deadline) {
      return 'No deadline set'
    }

    const diffMs = deadline.getTime() - Date.now()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return '1 day left'
    return `${diffDays} days left`
  }, [])

  const formatDateDisplay = useCallback((date?: Date | null) => {
    if (!date) return 'Not set'
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  }, [])

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

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700'
      case 'Accepted':
        return 'bg-green-50 text-green-700'
      case 'Rejected':
        return 'bg-red-50 text-red-700'
      case 'Expired':
        return 'bg-gray-100 text-gray-600'
      case 'Withdrawn':
        return 'bg-orange-50 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const renderFilters = () => (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-5">
      <div>
        <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase">Filters</p>
        <h3 className="text-lg font-semibold text-gray-900">Narrow your search</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
          />
        </div>
      </div>

      <CustomDropdown
        label="Event Date"
        value={selectedDate}
        onChange={setSelectedDate}
        options={EVENT_DATE_OPTIONS}
      />
      <CustomDropdown
        label="Categories"
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={CATEGORY_OPTIONS}
      />
      <CustomDropdown
        label="Budget"
        value={selectedBudget}
        onChange={setSelectedBudget}
        options={BUDGET_OPTIONS}
      />
      <CustomDropdown
        label="Location"
        value={selectedLocation}
        onChange={setSelectedLocation}
        options={LOCATION_OPTIONS}
      />
      <CustomDropdown
        label="Event Type"
        value={selectedEventType}
        onChange={setSelectedEventType}
        options={EVENT_TYPE_OPTIONS}
      />

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition-colors text-sm">
        Show Result
      </button>
      <button
        onClick={() => setActiveView(activeView === 'marketplace' ? 'myBids' : 'marketplace')}
        className="w-full border-2 border-blue-100 text-blue-700 py-3 rounded-2xl font-semibold transition-colors text-sm hover:bg-blue-50"
      >
        {activeView === 'marketplace' ? 'View My Bids' : 'Back to Marketplace'}
      </button>
    </div>
  )

  const renderMarketplaceContent = () => (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">Marketplace</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Discover Service Requests</h1>
          <p className="text-gray-500">
            {filteredRequests.length > 0
              ? `Showing ${filteredRequests.length} open opportunities`
              : 'No matching requests at the moment'}
          </p>
        </div>
        <div className="lg:hidden">
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {(openLoading || directLoading) && !hasLoadedData ? (
        <MarketplaceCardSkeletonList />
      ) : openError || directError ? (
        <div className="bg-white border border-red-100 text-red-700 p-6 rounded-3xl">
          Failed to load marketplace requests. Please try again.
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-100 text-gray-600 p-6 rounded-3xl">
          No service requests found for the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wide">
                        Open for Bids
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {request.location && (
                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                      )}
                      {request.date && (
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4" />
                          <span>{request.date}</span>
                        </div>
                      )}
                      {request.guestCount !== undefined && (
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-4 h-4" />
                          <span>{request.guestCount} guests</span>
                        </div>
                      )}
                      {request.eventType && (
                        <div className="flex items-center gap-2">
                          <FiTag className="w-4 h-4" />
                          <span>{request.eventType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-left lg:text-right">
                    {request.budget && (
                      <div className="text-lg font-semibold text-green-600">{request.budget}</div>
                    )}
                    {request.date && (
                      <div className="text-xs uppercase tracking-widest text-gray-400 mt-1 flex items-center gap-2 justify-start lg:justify-end">
                        <FiClock className="w-3 h-3" />
                        Deadline
                      </div>
                    )}
                  </div>
                </div>

                {request.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{request.description}</p>
                )}

                {request.tags && request.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {request.tags.map((tag, index) => (
                      <span
                        key={`${request.id}-tag-${index}`}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={() => handleOpenBid(request)}
                    className="flex-1 sm:flex-none sm:w-auto border border-blue-100 text-blue-700 font-semibold px-5 py-3 rounded-2xl hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handlePlaceBid(request)}
                    className="flex-1 sm:flex-none sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors"
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderMyBidsContent = () => (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">Marketplace</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bids</h1>
          <p className="text-gray-500">
            {filteredBids.length > 0
              ? `Tracking ${filteredBids.length} ${filteredBids.length === 1 ? 'bid' : 'bids'}`
              : 'You have not submitted any bids yet'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CustomDropdown
            label="Status"
            value={bidStatusFilter}
            onChange={(value) => setBidStatusFilter(value as typeof bidStatusFilter)}
            options={BID_STATUS_OPTIONS}
            variant="compact"
          />
          <CustomDropdown
            label="Sort By"
            value={bidSortOption}
            onChange={(value) => setBidSortOption(value as typeof bidSortOption)}
            options={BID_SORT_OPTIONS}
            variant="compact"
          />
        </div>
      </div>
      <div className="lg:hidden">
        <button
          onClick={() => setShowFilters(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700"
        >
          <FiFilter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search bids</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by service or client"
            value={bidSearchTerm}
            onChange={(e) => setBidSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
          />
        </div>
      </div>

      {bidsLoading ? (
        <MyBidsSkeleton />
      ) : bidsError ? (
        <div className="bg-white border border-red-100 text-red-700 p-6 rounded-3xl">
          {bidsError}
        </div>
      ) : filteredBids.length === 0 ? (
        <div className="bg-white border border-gray-100 text-gray-600 p-6 rounded-3xl">
          No bids match your current filters.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-4 text-xs font-semibold text-gray-500 tracking-widest uppercase bg-gray-50 border-b border-gray-100">
            <span>Service Request</span>
            <span>Client</span>
            <span>Bid Amount</span>
            <span>Status</span>
            <span>Deadline</span>
          </div>
          <div>
            {filteredBids.map((item) => {
              const { bid, request, statusLabel, deadlineDate } = item
              const clientName = request?.clientInfo?.name || 'Client'
              return (
                <div
                  key={bid.id}
                  className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 px-4 sm:px-6 py-4 border-t border-gray-100 text-sm text-gray-700"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{request?.title || 'Service request'}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <FiMapPin className="w-3 h-3" />
                      <span>{request?.location || 'Location TBD'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{clientName}</div>
                    {request?.clientInfo?.rating && (
                      <div className="text-xs text-gray-500">{request.clientInfo.rating.toFixed(1)} ★ rating</div>
                    )}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(bid.bidAmount) || `₦${Number(bid.bidAmount).toLocaleString()}`}
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(
                        statusLabel
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{formatDateDisplay(deadlineDate)}</div>
                    <div className={`text-xs ${statusLabel === 'Expired' ? 'text-red-600' : 'text-gray-500'}`}>
                      {formatDeadlineText(deadlineDate)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {activeView === 'marketplace' ? renderMarketplaceContent() : renderMyBidsContent()}
          </div>
          <div className="hidden lg:block w-full lg:w-80 flex-shrink-0">
            {renderFilters()}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
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
            <div className="p-6 space-y-4">
              {renderFilters()}
            </div>
          </div>
        </div>
      )}

      {/* Service Request + Bid Modals */}
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
              budget: selectedServiceRequest.budget,
            }}
          />
        </>
      )}
    </div>
  )
}

export default MarketplacePage

const MarketplaceCardSkeletonList = () => (
  <div className="space-y-4 sm:space-y-6">
    {[0, 1, 2].map((key) => (
      <div
        key={key}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 animate-pulse"
      >
        <div className="flex flex-col gap-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="flex gap-3 flex-wrap">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="h-16 bg-gray-100 rounded" />
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="h-5 w-28 bg-gray-200 rounded" />
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="h-10 flex-1 sm:flex-none sm:w-32 bg-gray-200 rounded-lg" />
              <div className="h-10 flex-1 sm:flex-none sm:w-32 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

interface DropdownOption {
  label: string
  value: string
}

interface CustomDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  variant?: 'default' | 'compact'
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option',
  variant = 'default',
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  const baseButtonClasses =
    variant === 'compact'
      ? 'py-2 text-sm rounded-xl'
      : 'py-3 text-sm font-medium rounded-2xl'

  return (
    <div ref={containerRef} className="relative space-y-2 min-w-[180px]">
      <label
        className={`block text-sm font-medium text-gray-700 ${
          variant === 'compact' ? 'text-xs uppercase tracking-widest text-gray-500' : ''
        }`}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border border-gray-200 bg-white px-4 ${baseButtonClasses}`}
      >
        <span className="text-gray-700">{selectedOption?.label ?? placeholder}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-2 text-sm ${
                option.value === value ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const MyBidsSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 space-y-4">
    {[0, 1, 2].map((row) => (
      <div key={row} className="animate-pulse flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-0">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
        </div>
      </div>
    ))}
  </div>
)
