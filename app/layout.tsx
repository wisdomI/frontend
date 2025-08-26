import React from 'react';
import { Raleway, Asul } from 'next/font/google';
import ClientLayout from '@/components/layouts/ClientLayout';
import '@/styles/globals.css';

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });
const asul = Asul({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-asul' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${asul.variable} bg-gradient-conic`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}