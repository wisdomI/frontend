import React from 'react'
import '../styles/globals.css'
import { Raleway } from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Providers from '@/components/providers/Providers'
import NotificationContainer from '@/components/ui/NotificationContainer'
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper'

const raleway = Raleway({ subsets: ['latin'] })

export const metadata = {
  title: 'Event Hub',
  description: 'Connect with the best event vendors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <Providers>
          <Header />
          <NotificationBreadcrumbWrapper />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  )
}