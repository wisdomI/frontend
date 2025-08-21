'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import VendorCard from '@/components/ui/modals/VendorCard'
import NotificationContainer from '@/components/ui/NotificationContainer'
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext'
import CardViewToggle from '@/components/CardViewToggle'
import Sidebar from '@/components/layouts/Sidebar'
import HeroBanner from '@/components/sections/HeroBanner'
import WhyChooseEventHub from '@/components/sections/WhyChooseUs'


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
]

type CardView = 'grid' | 'list'


export default function VendorsPage() {
  const { showNotification } = useNotificationBreadcrumb()
  const [view, setView] = useState<CardView>('grid')

  useEffect(() => {
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
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <HeroBanner />
        <WhyChooseEventHub />
        <div className="mx-auto py-8">
          <div className="flex items-center gap-5 py-4">
            <h1 className="text-xl text-light-gray font-bold">
              Popular Services
            </h1>
            <CardViewToggle view={view} onChange={setView} />
          </div>
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4'
                : 'flex flex-col gap-4 py-4'
            }
          >
            {mockVendors.map((vendor, index) => (
              <VendorCard {...vendor} key={index} view={view} />
            ))}
          </div>
        </div>
      </div>
      <NotificationContainer />
    </div>
  )
}
