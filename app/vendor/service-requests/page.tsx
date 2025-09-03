'use client'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import FilterCard from '@/components/vendors/FilterCard'
import TabNavigation from '@/components/ui/TabNavigation'
import { useState } from 'react'

type RequestStatus = 'active' | 'rejected' | 'accepted'

interface ServiceRequest {
  clientName: string
  clientAvatar: string
  eventTitle: string
  rating: number
  totalBookings: number
  sentTime: string
  eventType: string
  eventDate: string
  eventLocation: string
  guests: number
  servicesNeeded: string
  budget: string
  status: RequestStatus
  additionalInfo?: string
}

export const serviceRequestsData: ServiceRequest[] = [
  {
    clientName: 'Daniel Adebayo',
    clientAvatar: '/images/avatar1.jpg',
    eventTitle: 'Baby Linda’s Birthday Party',
    rating: 4,
    totalBookings: 5,
    sentTime: '17 hours ago',
    eventType: 'Social Event (Wedding, Birthday)',
    eventDate: '12th May, 2025',
    eventLocation: 'Surulere, Lagos State',
    guests: 14,
    servicesNeeded: 'Small Chops, Cake Bakers',
    budget: '₦100,000 - ₦199,000',
    status: 'active',
    additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
  },
  {
    clientName: 'Amaka Obi',
    clientAvatar: '/images/avatar2.jpg',
    eventTitle: 'Traditional Wedding Reception',
    rating: 5,
    totalBookings: 12,
    sentTime: '2 days ago',
    eventType: 'Wedding Ceremony',
    eventDate: '22nd June, 2025',
    eventLocation: 'Enugu, Enugu State',
    guests: 150,
    servicesNeeded: 'Full Catering, Live Band, Decor',
    budget: '₦800,000 - ₦1,200,000',
    status: 'rejected',
    additionalInfo:
      'Decor should be traditional Igbo style with palm wine service.',
  },
  {
    clientName: 'Tolu Olatunji',
    clientAvatar: '/images/avatar3.jpg',
    eventTitle: 'Corporate End-of-Year Party',
    rating: 3,
    totalBookings: 8,
    sentTime: '5 hours ago',
    eventType: 'Corporate Event',
    eventDate: '15th December, 2025',
    eventLocation: 'Victoria Island, Lagos',
    guests: 250,
    servicesNeeded: 'Buffet Catering, DJ, Event Host',
    budget: '₦2,000,000 - ₦3,500,000',
    status: 'accepted',
    additionalInfo:
      'Prefer buffet style and a lively MC to keep the staff engaged.',
  },
  {
    clientName: 'Tolu Olatunji',
    clientAvatar: '/images/avatar3.jpg',
    eventTitle: 'Corporate End-of-Year Party',
    rating: 3,
    totalBookings: 8,
    sentTime: '5 hours ago',
    eventType: 'Corporate Event',
    eventDate: '15th December, 2025',
    eventLocation: 'Victoria Island, Lagos',
    guests: 250,
    servicesNeeded: 'Buffet Catering, DJ, Event Host',
    budget: '₦2,000,000 - ₦3,500,000',
    status: 'rejected',
    additionalInfo:
      'Prefer buffet style and a lively MC to keep the staff engaged.',
  },
  {
    clientName: 'Fatima Bello',
    clientAvatar: '/images/avatar4.jpg',
    eventTitle: 'Naming Ceremony for Baby Aisha',
    rating: 4,
    totalBookings: 3,
    sentTime: ' 3 days ago',
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
    sentTime: ' 1 week ago',
    eventType: 'Anniversary Celebration',
    eventDate: '1st October, 2025',
    eventLocation: 'Abuja, FCT',
    guests: 300,
    servicesNeeded: 'Catering, Live Band, Sound System, Lighting',
    budget: '₦3,500,000 - ₦5,000,000',
    status: 'accepted',
    additionalInfo:
      'Event should have elegant white-and-gold theme with fireworks.',
  },
]

export default function ServiceRequestsPage() {
  const [activeTab, setActiveTab] = useState('active')

  const tabs = [
    { label: 'Client Requests', value: 'active' },
    { label: 'Rejected Requests', value: 'rejected' },
    { label: 'Accepted Requests', value: 'accepted' },
  ]

    const filteredRequests = serviceRequestsData.filter(
      b => b.status === activeTab
    )

  return (
    <div>
      <h2 className="p-4 py-2 font-bold text-3xl pt-4 text-gray-600">
        Service Request
      </h2>
      <div className="p-4">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
      <div className="flex w-full p-4 gap-4">
        <div className="flex flex-col gap-3 flex-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
          {filteredRequests.map((req, idx) => (
            <ServiceRequestCard
              key={idx}
              {...req}
              status={req.status}
              onReject={() =>
                console.log(`Offer rejected for ${req.eventTitle}`)
              }
              onAccept={() =>
                console.log(`Offer accepted for ${req.eventTitle}`)
              }
            />
          ))}
        </div>

        <div className="sticky top-20">
          <FilterCard />
        </div>
      </div>
    </div>
  )
}
