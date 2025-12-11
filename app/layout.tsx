import React from 'react'
import { Raleway, Asul } from 'next/font/google'
import '../styles/globals.css'
import '@/lib/suppressDevLogs'
import MainLayoutWrapper from '@/components/layouts/MainLayoutWrapper'

const raleway = Raleway({ subsets: ['latin'] })
const asul = Asul({ subsets: ['latin'], weight: ['400', '700'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={raleway.className} style={{'--font-raleway': raleway.style.fontFamily, '--font-asul': asul.style.fontFamily} as React.CSSProperties}>
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
      </body>
    </html>
  )
}
