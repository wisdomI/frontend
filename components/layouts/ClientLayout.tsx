'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/ui/Header';
import ProfileHeader from '@/components/auth/ProfileHeader';
import Footer from '@/components/ui/Footer';
import Providers from '@/components/providers/Providers';
import NotificationContainer from '@/components/ui/NotificationContainer';
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <Providers>
      <Provider store={store}>
        {isDashboard ? <ProfileHeader /> : <Header />}
        <NotificationBreadcrumbWrapper />
        {children}
        <Footer />
        <NotificationContainer />
      </Provider>
    </Providers>
  );
}