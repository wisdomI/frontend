'use client'

import Sidebar from '@/components/vendors/VendorSidebar'
import ProfileSetupSteps from '@/components/vendors/ProfileSetupSteps'
import WelcomeBanner from '@/components/vendors/WelcomeBanner'
import StatsCard from '@/components/vendors/StatsCard'
import EarningsPaymentChart from "@/components/vendors/EarningsChart"
import UpcomingMeetings from '@/components/vendors/UpcomingMeetings'
import Availability from '@/components/vendors/Availability'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import NotificationsPanel from '@/components/vendors/Notifications'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { useProfileCompletion } from '@/hooks/useProfileCompletion'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useMeetings } from '@/hooks/useMeetings'
import { useApi } from '@/hooks/useApi'
import { serviceRequestAPI } from '@/lib/api'

const DashboardPage = () => {
  const { profileStatus } = useProfileCompletion()
  const { user, isAuthenticated, loading } = useAuthContext()
  const router = useRouter()
  
  // API hooks
  const { vendorRequests, loading: serviceRequestsLoading, error: serviceRequestsError } = useServiceRequests()
  const { meetings, loading: meetingsLoading } = useMeetings()
  const { data: dashboardStats, loading: statsLoading } = useApi(() => serviceRequestAPI.getStats().then(res => res.data))
  
  // Local state
  const [stats, setStats] = useState({
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0
  })

  // TEMPORARY: Skip profile completion check for testing
  // useEffect(() => {
  //   console.log('Vendor dashboard - Profile status:', profileStatus)
  //   console.log('Vendor dashboard - Is completed:', profileStatus.isCompleted)
  //   
  //   if (!loading && isAuthenticated && !profileStatus.isCompleted) {
  //     console.log('Vendor dashboard - Redirecting to profile setup')
  //     router.push('/vendor/profile-setup')
  //   }
  // }, [loading, isAuthenticated, profileStatus.isCompleted, router])

  // Update stats when dashboard data loads
  useEffect(() => {
    if (dashboardStats) {
      setStats({
        activeBookings: dashboardStats.inProgressRequests || 0,
        pendingBookings: dashboardStats.openRequests || 0,
        completedBookings: dashboardStats.completedRequests || 0
      })
    }
  }, [dashboardStats])

  // Show loading state while checking authentication and profile status
  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated or not a vendor
  // TEMPORARY: Skip profile completion check for testing
  if (!isAuthenticated || user?.accountType !== 'vendor') {
    return null
  }
  
  // Transform API data to component format
  const transformServiceRequest = (request: any) => ({
    clientName: request.client?.firstName + ' ' + request.client?.lastName || 'Unknown Client',
    clientAvatar: request.client?.profilePicture || '/images/avatar1.jpg',
    eventTitle: request.eventTitle,
    rating: request.client?.rating || 4,
    totalBookings: request.client?.totalBookings || 0,
    sentTime: `Sent ${new Date(request.createdAt).toLocaleDateString()}`,
    eventType: request.eventType,
    eventDate: new Date(request.eventStartDate).toLocaleDateString(),
    eventLocation: request.eventLocation,
    guests: request.numberOfGuests,
    servicesNeeded: request.servicesNeeded?.join(', ') || 'Various Services',
    budget: request.budgetRange,
    additionalInfo: request.additionalInfo || '',
    id: request.id,
    status: request.status
  })

  const serviceRequestsData = vendorRequests?.slice(0, 1).map(transformServiceRequest) || []
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-2 sm:p-3 lg:p-6 max-w-full overflow-x-hidden">
        <WelcomeBanner businessName={user?.businessName || user?.firstName + ' ' + user?.lastName || 'Vendor'} verified={user?.isEmailVerified || false} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 my-3 sm:my-4 lg:my-6">
          <StatsCard label="Active Bookings" value={stats.activeBookings} change={2.5} />
          <StatsCard label="Pending Bookings" value={stats.pendingBookings} change={-2.5} />
          <StatsCard label="Completed Bookings" value={stats.completedBookings} change={2.5} />
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
              <Link 
                href="/vendor/service-requests"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <h2 className="text-lg sm:text-xl font-semibold">Service Requests</h2>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/vendor/service-requests"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                See more
              </Link>
            </div>
            
            {/* Service Request Cards */}
            {serviceRequestsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading service requests...</p>
              </div>
            ) : serviceRequestsError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load service requests</p>
              </div>
            ) : serviceRequestsData.length > 0 ? (
              <ServiceRequestCard
                {...serviceRequestsData[0]}
                onReject={() =>
                  console.log(`Offer rejected for ${serviceRequestsData[0].eventTitle}`)
                }
                onAccept={() =>
                  console.log(`Offer accepted for ${serviceRequestsData[0].eventTitle}`)
                }
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No service requests available</p>
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
