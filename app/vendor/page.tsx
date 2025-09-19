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

const DashboardPage = () => {
  const { profileStatus } = useProfileCompletion()
  
  const serviceRequestsData = [
    {
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      rating: 4,
      totalBookings: 5,
      sentTime: 'Sent 17 hours ago',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      budget: '₦100,000 - ₦199,000',
      additionalInfo:
        'We need milky flavoured cake and some Cherry as toppings',
    },
    {
      clientName: 'Amaka Obi',
      clientAvatar: '/images/avatar2.jpg',
      eventTitle: 'Traditional Wedding Reception',
      rating: 5,
      totalBookings: 12,
      sentTime: 'Sent 2 days ago',
      eventType: 'Wedding Ceremony',
      eventDate: '22nd June, 2025',
      eventLocation: 'Enugu, Enugu State',
      guests: 150,
      servicesNeeded: 'Full Catering, Live Band, Decor',
      budget: '₦800,000 - ₦1,200,000',
      additionalInfo:
        'Decor should be traditional Igbo style with palm wine service.',
    },
    {
      clientName: 'Tolu Olatunji',
      clientAvatar: '/images/avatar3.jpg',
      eventTitle: 'Corporate End-of-Year Party',
      rating: 3,
      totalBookings: 8,
      sentTime: 'Sent 5 hours ago',
      eventType: 'Corporate Event',
      eventDate: '15th December, 2025',
      eventLocation: 'Victoria Island, Lagos',
      guests: 250,
      servicesNeeded: 'Buffet Catering, DJ, Event Host',
      budget: '₦2,000,000 - ₦3,500,000',
      additionalInfo:
        'Prefer buffet style and a lively MC to keep the staff engaged.',
    },
    {
      clientName: 'Fatima Bello',
      clientAvatar: '/images/avatar4.jpg',
      eventTitle: 'Naming Ceremony for Baby Aisha',
      rating: 4,
      totalBookings: 3,
      sentTime: 'Sent 3 days ago',
      eventType: 'Naming Ceremony',
      eventDate: '8th September, 2025',
      eventLocation: 'Kano, Kano State',
      guests: 50,
      servicesNeeded: 'Small Chops, Photographer',
      budget: '₦150,000 - ₦250,000',
      additionalInfo:
        'Photographer should deliver both soft copies and an album.',
    },
    {
      clientName: 'John Peters',
      clientAvatar: '/images/avatar5.jpg',
      eventTitle: 'Silver Jubilee Anniversary',
      rating: 5,
      totalBookings: 20,
      sentTime: 'Sent 1 week ago',
      eventType: 'Anniversary Celebration',
      eventDate: '1st October, 2025',
      eventLocation: 'Abuja, FCT',
      guests: 300,
      servicesNeeded: 'Catering, Live Band, Sound System, Lighting',
      budget: '₦3,500,000 - ₦5,000,000',
      additionalInfo:
        'Event should have elegant white-and-gold theme with fireworks.',
    },
  ]
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-2 sm:p-3 lg:p-6 max-w-full overflow-x-hidden">
        {!profileStatus.isCompleted && <ProfileSetupSteps />}
        <WelcomeBanner businessName="UK Cakes & Cream" verified={false} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 my-3 sm:my-4 lg:my-6">
          <StatsCard label="Active Bookings" value={1} change={2.5} />
          <StatsCard label="Pending Bookings" value={1} change={-2.5} />
          <StatsCard label="Completed Bookings" value={1} change={2.5} />
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
            
            {/* Single Service Request Card */}
            <ServiceRequestCard
              {...serviceRequestsData[0]}
              onReject={() =>
                console.log(`Offer rejected for ${serviceRequestsData[0].eventTitle}`)
              }
              onAccept={() =>
                console.log(`Offer accepted for ${serviceRequestsData[0].eventTitle}`)
              }
            />
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
