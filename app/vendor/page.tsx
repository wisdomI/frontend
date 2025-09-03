"use client"
import Sidebar from '@/components/vendors/VendorSidebar'
import WelcomeBanner from '@/components/vendors/WelcomeBanner'
import StatsCard from '@/components/vendors/StatsCard'
import EarningsPaymentChart from "@/components/vendors/EarningsChart"
import UpcomingMeetings from '@/components/vendors/UpcomingMeetings'
import Availability from '@/components/vendors/Availability'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import NotificationsPanel from '@/components/vendors/Notifications'
import ProfileSetupProgress from '@/components/vendors/ProfileSetupProgressbar'
import { serviceRequestsData } from './service-requests/page'

const DashboardPage = () => {
  
  return (
    <div className="flex">
      <main className="flex-1 bg-gray-50 p-6">
        <ProfileSetupProgress />
        <WelcomeBanner businessName="UK Cakes & Cream" verified={false} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <StatsCard label="Active Bookings" value={1} change={2.5} />
          <StatsCard label="Pending Bookings" value={1} change={-2.5} />
          <StatsCard label="Completed Bookings" value={1} change={2.5} />
        </div>

        {/* Chart + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"> <EarningsPaymentChart /></div>
          <div className="space-y-6">
            <UpcomingMeetings />
            <Availability />
          </div>
        </div>

        {/* Service Requests + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {serviceRequestsData.map((req, idx) => (
              <ServiceRequestCard
                key={idx}
                {...req}
                status={req.status}
              />
            ))}
          </div>
          <NotificationsPanel />
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
