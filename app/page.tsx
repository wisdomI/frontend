'use client'

import React, { useEffect } from 'react';
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext';
import Sidebar from '@/components/layouts/Sidebar';
import HeroBanner from '@/components/sections/HeroBanner';
import RecentlyViewed from '@/components/sections/RecentlyViewed';
import WhyChooseEventHub from '@/components/sections/WhyChooseUs';
import PopularServices from '@/components/sections/PopularServices';

export default function HomePage() {
  const { showNotification } = useNotificationBreadcrumb()

  useEffect(() => {
    // Show the security reminder notification on page load
    showNotification({
      message: 'Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.',
      type: 'info',
      icon: 'shield',
      dismissible: true,
      autoHide: false
    })
  }, [showNotification])

  return (
    <div className="flex min-h-screen flex-1 ">
      <Sidebar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Event Hub
        </h1> */}
        {/* Add hero section or other content here */}
        <HeroBanner/>
        <WhyChooseEventHub/>
<RecentlyViewed/>
 <PopularServices/>

      </main>
      
    </div>
  );
}