// app/layout.tsx
'use client';

import React from 'react';
import { Raleway, Asul } from 'next/font/google';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Providers from '@/components/providers/Providers';
import NotificationContainer from '@/components/ui/NotificationContainer';
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import '@/styles/globals.css';

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });
const asul = Asul({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-asul' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${asul.variable} bg-gradient-conic`} >
        <Providers>
          <Provider store={store}>
            <div className="container mx-auto px-8 md:px-12 lg:px-16">
              <Header />
              <NotificationBreadcrumbWrapper />
            </div>
            <main>{children}</main>
            <div className="container mx-auto px-8 md:px-12 lg:px-16">
              <Footer />
            </div>
            <NotificationContainer />
          </Provider>
        </Providers>
      </body>
    </html>
  );
}