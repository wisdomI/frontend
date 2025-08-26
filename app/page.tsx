'use client'

import React, { useEffect } from 'react';
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext';
import Sidebar from '@/components/layouts/Sidebar';
import HeroWithActions from '@/components/sections/HeroBanner';
import RecentlyViewed from '@/components/sections/RecentlyViewed';
import WhyChooseEventHub from '@/components/sections/WhyChooseUs';
import PopularServices from '@/components/sections/PopularServices';


export default function HomePage() {
  const { showNotification } = useNotificationBreadcrumb()

  useEffect(() => {
    // Show the security reminder notification on page load
    showNotification({
      message: ' EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.',
      type: 'info',
      icon: 'shield',
      dismissible: true,
      autoHide: false
    })
  }, [showNotification])

  return (
    <div className="container mx-auto px-8 md:px-10 lg:px-12">
      <div className="flex min-h-screen gap-6 py-6">
        <Sidebar />
        <main className="flex-1">
          <HeroWithActions />
          <WhyChooseEventHub />
          <RecentlyViewed />
          <PopularServices />
        </main>
      </div>
    </div>
  );
}