import Sidebar from '@/components/vendors/VendorSidebar'
import ProfileSetupSteps from '@/components/vendors/ProfileSetupSteps'
import WelcomeBanner from '@/components/vendors/WelcomeBanner'
import StatsCard from '@/components/vendors/StatsCard'
import EarningsPaymentChart from "@/components/vendors/EarningsChart"
import UpcomingMeetings from '@/components/vendors/UpcomingMeetings'
import Availability from '@/components/vendors/Availability'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import NotificationsPanel from '@/components/vendors/Notifications'

const DashboardPage = () => {
  const serviceRequestsData = [
    {
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda’s Birthday Party',
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
    <div className="flex">
      <main className="flex-1 bg-gray-50 p-4 lg:p-6">
        <ProfileSetupSteps />
        <WelcomeBanner businessName="UK Cakes & Cream" verified={false} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          <StatsCard label="Active Bookings" value={1} change={2.5} />
          <StatsCard label="Pending Bookings" value={1} change={-2.5} />
          <StatsCard label="Completed Bookings" value={1} change={2.5} />
        </div>

        {/* Chart + Right Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2"> 
            <EarningsPaymentChart />
          </div>
          <div className="space-y-6">
            <UpcomingMeetings />
            <Availability />
          </div>
        </div>

        {/* Service Requests + Notifications */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2">
            {serviceRequestsData.map((req, idx) => (
              <ServiceRequestCard
                key={idx}
                {...req}
                onReject={() =>
                  console.log(`Offer rejected for ${req.eventTitle}`)
                }
                onAccept={() =>
                  console.log(`Offer accepted for ${req.eventTitle}`)
                }
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
