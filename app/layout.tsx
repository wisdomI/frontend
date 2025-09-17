'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import '../styles/globals.css'
import { Raleway, Mooli } from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Providers from '@/components/providers/Providers'
import NotificationContainer from '@/components/ui/NotificationContainer'
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper'
import Sidebar from '@/components/layouts/Sidebar'

const raleway = Raleway({ subsets: ['latin'] })
const mooli = Mooli({ subsets: ['latin'], weight: '400' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isVendorDashboardPage = pathname?.startsWith('/vendor') // Exclude all vendor dashboard pages
  const isDashboardPage = pathname?.startsWith('/dashboard')

  // For vendor dashboard pages, render only the children (they have their own layout)
  if (isVendorDashboardPage) {
    return (
      <html lang="en">
        <body className={`${mooli.className}`} style={{'--font-raleway': raleway.style.fontFamily, '--font-mooli': mooli.style.fontFamily} as React.CSSProperties}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    )
  }

  // For dashboard pages, render only the children (they have their own layout)
  if (isDashboardPage) {
    return (
      <html lang="en">
        <body className={`${mooli.className}`} style={{'--font-raleway': raleway.style.fontFamily, '--font-mooli': mooli.style.fontFamily} as React.CSSProperties}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={`${mooli.className} flex flex-col min-h-screen`} style={{'--font-raleway': raleway.style.fontFamily, '--font-mooli': mooli.style.fontFamily} as React.CSSProperties}>
        <Providers>
          <Header />
          <NotificationBreadcrumbWrapper />
          <div className="flex flex-1 px-8 bg-gray-50">
            {!isAuthPage && <Sidebar />}
            <main className={`flex-1 px-6 pt-0 ${isAuthPage ? 'ml-0' : ''}`}>
              {children}
            </main>
          </div>
          <Footer />
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  )
}
