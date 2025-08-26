'use client';

import React from 'react';
import Header from '@/components/ui/Header';
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
  return (
    <Providers>
      <Provider store={store}>
        <Header />
        <NotificationBreadcrumbWrapper />
        {children}
        <Footer />
        <NotificationContainer />
      </Provider>
    </Providers>
  );
}