'use client'

import React, { useEffect, useCallback, useState } from 'react';
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext';
import HeroBanner from '@/components/sections/HeroBanner';
import RecentlyViewed from '@/components/sections/RecentlyViewed';
import WhyChooseEventHub from '@/components/sections/WhyChooseUs';
import PopularServices from '@/components/sections/PopularServices';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import NotificationContainer from '@/components/ui/NotificationContainer';
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper';
import Sidebar from '@/components/layouts/Sidebar';

export default function HomePage() {
  const { showNotification } = useNotificationBreadcrumb()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <NotificationBreadcrumbWrapper />
      
      {/* Main content area with sidebar - matching category page spacing */}
      <div className="flex flex-1 md:px-8 bg-gray-50">
        <Sidebar 
          isMobileOpen={sidebarOpen} 
          onMobileToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Main content with proper spacing like category pages */}
        <main className="flex-1 px-6">
          <HeroBanner/>
          <div className="py-4 sm:py-6 lg:py-8">
            <div className="space-y-6 sm:space-y-8">
              <WhyChooseEventHub/>
              <RecentlyViewed/>
              <PopularServices/>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
      <NotificationContainer />
    </div>
  );
}