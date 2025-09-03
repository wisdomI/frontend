"use client"
import BookingsCard from '@/components/vendors/BookingsCard'
import FilterCard from '@/components/vendors/FilterCard'
import TabNavigation from '@/components/ui/TabNavigation'
import { useState } from 'react'


export default function ManageBookingsPage() {
  const [activeTab, setActiveTab] = useState('active')

  const tabs = [
    { label: 'Active Bookings', value: 'active' },
    { label: 'Completed Bookings', value: 'completed' },
  ]
  
  const bookingsData = [
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
      status: 'active',
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
      status: 'active',
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
      status: 'completed',
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
      status: 'active',
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
      status: 'completed',
      additionalInfo:
        'Event should have elegant white-and-gold theme with fireworks.',
    },
  ]

  const filteredBookings = bookingsData.filter(b => b.status === activeTab)

  return (
    <div>
      <h2 className="p-4 py-2 font-bold text-3xl pt-4 text-gray-600 font-asul">
        Manage Bookings
      </h2>
      <div className="p-4">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="flex w-full p-4 gap-4">
        <div className="flex flex-col gap-6 flex-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
          {filteredBookings.map((req, idx) => (
            <BookingsCard key={idx} {...req} completed={req.status === "completed"} />
          ))}
        </div>

        <div className="sticky top-20">
          <FilterCard />
        </div>
      </div>
    </div>
  )
}
