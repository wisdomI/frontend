'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import VendorCard from '@/components/ui/modals/VendorCard'
import NotificationContainer from '@/components/ui/NotificationContainer'
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext'
import CardViewToggle from '@/components/CardViewToggle'
import HeroBanner from '@/components/sections/HeroBanner'
import WhyChooseEventHub from '@/components/sections/WhyChooseUs'
import { vendorsData } from '@/data/vendors'

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
      <div className="flex-1 container mx-auto px-4 py-8">
        <HeroBanner />
        <WhyChooseEventHub />
        <div className="mx-auto py-8">
          <div className="flex items-center gap-5 py-4">
            <h1 className="text-xl text-light-gray font-bold font-asul">
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
            {vendorsData.map((vendor) => (
              <VendorCard 
                id={vendor.id}
                verified={vendor.verified}
                title={vendor.title}
                vendorName={vendor.vendorName}
                rating={vendor.rating}
                reviews={vendor.reviews}
                location={vendor.location}
                key={vendor.id} 
                view={view} 
              />
            ))}
          </div>
        </div>
      </div>
      <NotificationContainer />
    </div>
  )
}
