'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import VendorCard from '@/components/ui/modal/VendorsCard'
import NotificationContainer from '@/components/ui/NotificationContainer'
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper'
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext'

const mockVendors = [
  {
    verified: true,
    image: 'https://via.placeholder.com/300x200?text=Decor+1',
    title: 'Wedding Hall Decoration / Backdrops',
    vendorName: "Ope's Event Decor",
    rating: 3,
    reviews: 20,
    location: 'Victoria Island, Lagos',
  },
  {
    verified: true,
    image: 'https://via.placeholder.com/300x200?text=Cakes+1',
    title: 'Book us for all types of Event Cakes',
    vendorName: 'UK Cakes & Cream',
    rating: 4,
    reviews: 20,
    location: 'Victoria Island, Lagos',
  },
  {
    verified: true,
    image: 'https://via.placeholder.com/300x200?text=Decor+2',
    title: 'Wedding Hall Decoration / Backdrops',
    vendorName: "Ope's Event Decor",
    rating: 3,
    reviews: 20,
    location: 'Victoria Island, Lagos',
  },
  {
    verified: true,
    image: 'https://via.placeholder.com/300x200?text=Cakes+2',
    title: 'Book us for all types of Event Cakes',
    vendorName: 'UK Cakes & Cream',
    rating: 4,
    reviews: 20,
    location: 'Victoria Island, Lagos',
  },
  {
    verified: true,
    image: 'https://via.placeholder.com/300x200?text=Decor+3',
    title: 'Wedding Hall Decoration / Backdrops',
    vendorName: "Ope's Event Decor",
    rating: 3,
    reviews: 20,
    location: 'Victoria Island, Lagos',
  },
  {
    verified: true,
    image: 'https://via.placeholder.com/300x200?text=Cakes+3',
    title: 'Book us for all types of Event Cakes',
    vendorName: 'UK Cakes & Cream',
    rating: 4,
    reviews: 20,
    location: 'Victoria Island, Lagos',
  },
  {
    verified: true,
    image: 'https://via.placeholder.com/300x200?text=Cakes+3',
    title: 'Book us for all types of Event Cakes',
    vendorName: 'UK Cakes & Cream',
    rating: 4,
    reviews: 20,
    location: 'Victoria Island, Lagos',
  },
  

]

export default function VendorsPage() {
  const { showNotification } = useNotificationBreadcrumb()

  useEffect(() => {
    // Show the security reminder notification on page load
    showNotification({
      message:
        'Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.',
      type: 'info',
      icon: 'shield',
      dismissible: true,
      autoHide: false,
    })
  }, [showNotification])
  return (
    <div>
      <div className="w-[1000px] mx-auto py-8">
        <h1 className="text-xl text-light-gray font-bold mb-4">
          Popular Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVendors.map((vendor, index) => (
              <VendorCard {...vendor} key={index} />
          ))}
        </div>
      </div>
      <NotificationContainer />
    </div>
  )
}
