'use client'

import WelcomeBanner from '@/components/vendors/WelcomeBanner'
import StatsCard from '@/components/vendors/StatsCard'
import EarningsPaymentChart from "@/components/vendors/EarningsChart"
import UpcomingMeetings from '@/components/vendors/UpcomingMeetings'
import Availability from '@/components/vendors/Availability'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import NotificationsPanel from '@/components/vendors/Notifications'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useVendorServiceRequests } from '@/hooks/useVendorServiceRequests'
import { useVendorBookings } from '@/hooks/useVendorBookings'
import { useCategories } from '@/hooks/useCategories'
import { categoryAPI } from '@/lib/api'
import type { User } from '@/types/api'
// Debug components removed for production

const buildCategoryNameMap = (categories: any[] = []) => {
  const map = new Map<string, string>()

  const traverse = (items: any[]) => {
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

const DashboardPage = () => {
  const { user, isAuthenticated, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/vendor'))
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return <VendorDashboardContent user={user} />
}

const VendorDashboardContent = ({ user }: { user: User }) => {
  const { requests: marketplaceRequests, loading: marketplaceLoading, error: marketplaceError } = useServiceRequests({ viewType: 'open' })
  const { requests: directRequests, loading: directRequestsLoading } = useVendorServiceRequests({ viewType: 'received', autoFetch: true })
  const { stats: bookingStats } = useVendorBookings()
  const { categories: categoryHierarchy } = useCategories()
  const categoryNameMap = useMemo(() => buildCategoryNameMap(categoryHierarchy), [categoryHierarchy])
  const [serviceNameOverrides, setServiceNameOverrides] = useState<Record<string, string>>({})
  const uuidRegex = useMemo(() => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, [])

  useEffect(() => {
    const combinedRequests = [
      ...(Array.isArray(marketplaceRequests) ? marketplaceRequests : []),
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
          if (uuidRegex.test(trimmed) && !categoryNameMap.get(trimmed) && !serviceNameOverrides[trimmed]) {
            missingIds.add(trimmed)
          }
          return
        }

        if (typeof candidate === 'object') {
          const id = (candidate as { id?: string }).id
          if (id && uuidRegex.test(id) && !categoryNameMap.get(id) && !serviceNameOverrides[id]) {
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
  }, [marketplaceRequests, directRequests, categoryNameMap, serviceNameOverrides, uuidRegex])

  const [stats, setStats] = useState({
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    activeChange: 0,
    pendingChange: 0,
    completedChange: 0,
  })

  useEffect(() => {
    if (!bookingStats) {
      return
    }

    const activeBookings = bookingStats?.activeBookings || 0
    const pendingBookings = bookingStats?.pendingBookings || 0
    const completedBookings = bookingStats?.completedBookings || 0

    const total = Math.max(activeBookings + pendingBookings + completedBookings, 1)
    const activeChange = activeBookings > 0 ? Math.round((activeBookings / total) * 100) / 10 : 0
    const pendingChange = pendingBookings > 0 ? Math.round((pendingBookings / total) * 100) / 10 : 0
    const completedChange = completedBookings > 0 ? Math.round((completedBookings / total) * 100) / 10 : 0

    setStats({
      activeBookings,
      pendingBookings,
      completedBookings,
      activeChange,
      pendingChange,
      completedChange,
    })
  }, [bookingStats])

  const resolveServiceName = (service: unknown) => {
    if (!service) {
      return undefined
    }

    if (typeof service === 'string') {
      const normalized = service.trim()
      const mappedName = categoryNameMap.get(normalized) || serviceNameOverrides[normalized]

      if (mappedName) {
        return mappedName
      }

      const looksLikeUuid = /^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[1-5][0-9a-fA-F-]{3}-[89abAB][0-9a-fA-F-]{3}-[0-9a-fA-F-]{12}$/.test(normalized)
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
  }

  const transformServiceRequest = (request: any) => {
    const rawServices = Array.isArray(request.servicesNeeded)
      ? request.servicesNeeded
      : request.servicesNeeded
      ? [request.servicesNeeded]
      : []

    let normalizedServices = rawServices
      .map(resolveServiceName)
      .filter((serviceName: unknown): serviceName is string => typeof serviceName === 'string' && serviceName.length > 0)

    if (normalizedServices.length === 0 && Array.isArray(request.services)) {
      normalizedServices = request.services
        .map((service: any) => resolveServiceName(service))
        .filter((serviceName: unknown): serviceName is string => typeof serviceName === 'string' && serviceName.length > 0)
    }

    return {
      clientName:
        request.client?.firstName && request.client?.lastName
          ? `${request.client.firstName} ${request.client.lastName}`.trim()
          : request.client?.businessName || 'Unknown Client',
      clientAvatar: request.client?.profilePicture || '/images/avatar1.jpg',
      eventTitle: request.eventTitle || 'Untitled Event',
      rating: request.client?.rating || 0,
      totalBookings: request.client?.totalBookings || 0,
      sentTime: `Sent ${new Date(request.createdAt).toLocaleDateString()}`,
      eventType: request.eventType || 'Event',
      eventDate: request.eventStartDate ? new Date(request.eventStartDate).toLocaleDateString() : 'TBD',
      eventLocation: request.eventLocation || 'Location TBD',
      guests: request.numberOfGuests || 0,
      servicesNeeded: normalizedServices.length > 0 ? normalizedServices.join(', ') : 'Various Services',
      budget: request.budgetRange || 'Budget TBD',
      additionalInfo:
        request.additionalInfo ||
        (request as any).additionalInformation ||
        (request as any).additional_details ||
        '',
      id: request.id,
      status: request.status || 'pending',
    }
  }

  const marketplaceCards = Array.isArray(marketplaceRequests)
    ? marketplaceRequests.map(transformServiceRequest)
    : []
  const limitedMarketplaceCards = marketplaceCards.slice(0, 3)

  useEffect(() => {
    console.log('🔍 Vendor Dashboard - Marketplace Requests:', marketplaceRequests)
    console.log('🔍 Vendor Dashboard - Direct Requests:', directRequests)
  }, [marketplaceRequests, directRequests])

  const displayName =
    user.businessName ||
    `${[user.firstName, user.lastName].filter(Boolean).join(' ')}`.trim() ||
    'Vendor'

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-2 sm:p-3 lg:p-6 max-w-full overflow-x-hidden">
        <WelcomeBanner businessName={displayName} verified={user?.isEmailVerified || false} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 my-3 sm:my-4 lg:my-6">
          <StatsCard label="Active Bookings" value={stats.activeBookings} change={stats.activeChange} />
          <StatsCard label="Pending Bookings" value={stats.pendingBookings} change={stats.pendingChange} />
          <StatsCard label="Completed Bookings" value={stats.completedBookings} change={stats.completedChange} />
        </div>

        {/* Chart + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <EarningsPaymentChart />
          </div>
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <UpcomingMeetings />
            <Availability />
          </div>
        </div>

        {/* Service Requests + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-3 sm:mt-4 lg:mt-6">
          <div className="lg:col-span-2">
            {/* Service Requests Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Link href="/vendor/service-requests" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                <h2 className="text-lg sm:text-xl font-semibold font-asul">Marketplace Requests</h2>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/vendor/service-requests" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                See more
              </Link>
            </div>

            {/* Service Request Cards */}
            {marketplaceLoading || directRequestsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading marketplace requests...</p>
              </div>
            ) : marketplaceError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load marketplace requests</p>
              </div>
            ) : limitedMarketplaceCards.length > 0 ? (
              <div className="space-y-4">
                {limitedMarketplaceCards.map((request) => (
                  <ServiceRequestCard
                    key={request.id}
                    {...request}
                    onReject={() => console.log(`Offer rejected for ${request.eventTitle}`)}
                    onAccept={() => console.log(`Offer accepted for ${request.eventTitle}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium mb-2">No Marketplace Requests Yet</h3>
                <p className="text-sm">There are currently no new service requests available in the marketplace.</p>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <NotificationsPanel />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
