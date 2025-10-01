'use client'


import React, { useEffect, useCallback } from 'react';
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext';
import HeroBanner from '@/components/sections/HeroBanner';
import RecentlyViewed from '@/components/sections/RecentlyViewed';
import WhyChooseEventHub from '@/components/sections/WhyChooseUs';
import PopularServices from '@/components/sections/PopularServices';

export default function HomePage() {
  const { showNotification } = useNotificationBreadcrumb()

  const showSecurityReminder = useCallback(() => {
    showNotification({
      message: 'Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.',
      type: 'info',
      icon: 'shield',
      dismissible: true,
      autoHide: false
    })
  }, [showNotification])

  useEffect(() => {
    // Show the security reminder notification on page load
    showSecurityReminder()
  }, [showSecurityReminder])

  return (
    <div className="flex min-h-screen flex-1">
      <main className="flex-1 w-full">
        <HeroBanner/>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-6 sm:space-y-8">
            <WhyChooseEventHub/>
            <RecentlyViewed/>
            <PopularServices/>
          </div>
        </div>
      </main>
    </div>
  );
}