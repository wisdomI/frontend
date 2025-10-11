'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FiX } from 'react-icons/fi'

interface ClientSidebarProps {
  onClose?: () => void
}

export default function ClientSidebar({ onClose }: ClientSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      href: '/client/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      )
    },
    {
      href: '/client/my-profile',
      label: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      href: '/client/profile-settings',
      label: 'Profile Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      href: '/client/manage-bids',
      label: 'Manage Bids',
      iconActiveSrc: '/images/managebids-active.svg',
      iconInactiveSrc: '/images/managebids-inactive.svg',
    },
    {
      href: '/client/manage-bookings',
      label: 'Manage Bookings',
      iconActiveSrc: '/images/managebooking-active.svg',
      iconInactiveSrc: '/images/managebooking-inactive.svg',
    },
    {
      href: '/client/messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      href: '/client/schedule-meetings',
      label: 'Schedule Meetings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      href: '/client/payment-billings',
      label: 'Payment & Billings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      href: '/client/my-earnings',
      label: 'Budget Tracker',
      iconActiveSrc: '/images/Budgettracker-active.svg',
      iconInactiveSrc: '/images/Budgettracker-inactive.svg',
    },
    {
      href: '/client/reviews-ratings',
      label: 'Reviews & Ratings',
      iconActiveSrc: '/images/Reviews&Ratings-active.svg',
      iconInactiveSrc: '/images/Review&Ratings-inactive.svg',
    },
    {
      href: '/client/help-support',
      label: 'Help & Support',
      iconActiveSrc: '/images/heelp&support-active.svg',
      iconInactiveSrc: '/images/Help&support - inactive.svg',
    },
    {
      href: '/client/general-settings',
      label: 'General Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      )
    }
  ]

  return (
    <div className="w-full bg-white shadow-xl rounded-lg">
      <div className="p-6 flex flex-col">
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}
        
        <h2 className="text-lg font-semibold text-gray-900 mb-6 font-asul">My Account</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={onClose}
            >
              {'iconActiveSrc' in item ? (
                <Image 
                  src={pathname === item.href ? (item as any).iconActiveSrc : (item as any).iconInactiveSrc} 
                  alt={`${item.label} icon`} 
                  width={20}
                  height={20}
                  className="w-5 h-5" 
                />
              ) : (
                item.icon
              )}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
