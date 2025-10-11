"use client"

import { Icon } from '@iconify/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MessageOutlined } from '@ant-design/icons'
import { 
  FiGrid, 
  FiClipboard, 
  FiShoppingBag, 
  FiCalendar, 
  FiBarChart, 
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiList
} from 'react-icons/fi'
import dashboardOutline from '@iconify/icons-material-symbols/dashboard-outline'
import eventNoteOutline from '@iconify/icons-material-symbols/event-note-outline'
import invoice from '@iconify/icons-material-symbols/post-add-rounded'
import calendarMonthOutline from '@iconify/icons-mdi/calendar-multiselect-outline'
import paymentsOutline from '@iconify/icons-material-symbols/payments-outline'
import subscriptions from '@iconify/icons-icomoon-free/price-tags'
import personOutline from '@iconify/icons-material-symbols/person-outline'
import reviewsOutline from '@iconify/icons-material-symbols/reviews-outline'
import settingsOutline from '@iconify/icons-material-symbols/settings-outline'
import { IoHelpCircleOutline } from 'react-icons/io5'
import logo from "../../public/images/primary-logo 3.png"
import iconLogo from "../../public/images/icon-1.png"

interface SidebarProps {
  onClose?: () => void
  isCollapsed?: boolean
  onToggle?: () => void
}

const Sidebar = ({ onClose, isCollapsed = false, onToggle }: SidebarProps) => {
  const pathname = usePathname()
  
  const menuItems = [
    {
      label: 'Dashboard',
      icon: <Icon icon={dashboardOutline} width="24" height="24" />,
      path: '/vendor',
      isActive: pathname === '/vendor',
    },
    {
      label: 'Marketplace',
      icon: <FiShoppingBag className="w-6 h-6" />,
      path: '/vendor/marketplace',
      isActive: pathname === '/vendor/marketplace',
    },
    {
      label: 'Service Requests',
      icon: <FiClipboard className="w-6 h-6" />,
      path: '/vendor/service-requests',
      isActive: pathname === '/vendor/service-requests',
    },
    {
      label: 'Messages',
      icon: <MessageOutlined style={{ fontSize: 24 }} />,
      path: '/vendor/messages',
      isActive: pathname === '/vendor/messages',
    },
    {
      label: 'Manage Bookings',
      icon: (
        <div className="w-6 h-6">
          {pathname === '/vendor/manage-bookings' ? (
            <Image 
              src="/images/tabler_brand-booking.svg" 
              alt="Manage Bookings" 
              width={24}
              height={24}
            />
          ) : (
            <Image 
              src="/images/tabler_brand-booking-inactive.svg" 
              alt="Manage Bookings" 
              width={24}
              height={24}
            />
          )}
        </div>
      ),
      path: '/vendor/manage-bookings',
      isActive: pathname === '/vendor/manage-bookings',
    },
    {
      label: 'Invoice Management',
      icon: <Icon icon={invoice} width="24" height="24" />,
      path: '/vendor/invoice-management',
      isActive: pathname === '/vendor/invoice-management',
    },
    {
      label: 'Schedule Meetings',
      icon: <Icon icon={calendarMonthOutline} width="24" height="24" />,
      path: '/vendor/schedule-meetings',
      isActive: pathname === '/vendor/schedule-meetings',
    },
    {
      label: 'My Earnings',
      icon: (
        <div className="w-6 h-6">
          {pathname === '/vendor/my-earnings' ? (
            <Image 
              src="/images/VendorEarning&expenses-active.svg" 
              alt="My Earnings" 
              width={24}
              height={24}
              className="w-6 h-6"
            />
          ) : (
            <Image 
              src="/images/Vendorearningandexpenses-inactive.svg" 
              alt="My Earnings" 
              width={24}
              height={24}
              className="w-6 h-6 filter saturate-0 brightness-0 invert"
            />
          )}
        </div>
      ),
      path: '/vendor/my-earnings',
      isActive: pathname === '/vendor/my-earnings',
    },
    {
      label: 'Performance Analytics',
      icon: <FiBarChart className="w-6 h-6" />,
      path: '/vendor/performance-analytics',
      isActive: pathname === '/vendor/performance-analytics',
    },
    {
      label: 'Teams & Roles',
      icon: <FiUsers className="w-6 h-6" />,
      path: '/vendor/teams-roles',
      isActive: pathname === '/vendor/teams-roles',
    },
    {
      label: 'Rating & Review',
      icon: (
        <div className="w-6 h-6">
          {pathname === '/vendor/rating-reviews' ? (
            <Image 
              src="/images/VendorReview&ratings-active.svg" 
              alt="Rating & Review" 
              width={24}
              height={24}
              className="w-6 h-6"
            />
          ) : (
            <Image 
              src="/images/VendorRating&Review-inactive.svg" 
              alt="Rating & Review" 
              width={24}
              height={24}
              className="w-6 h-6 filter saturate-0 brightness-0 invert"
            />
          )}
        </div>
      ),
      path: '/vendor/rating-reviews',
      isActive: pathname === '/vendor/rating-reviews',
    },
    {
      label: 'Manage Subscriptions',
      icon: <Icon icon={subscriptions} width="24" height="24" />,
      path: '/vendor/manage-subscriptions',
      isActive: pathname === '/vendor/manage-subscriptions',
    },
    {
      label: 'Settings',
      icon: <FiSettings className="w-6 h-6" />,
      path: '/vendor/settings',
      isActive: pathname === '/vendor/settings',
    },
  ]

  const bottomItems = [
    {
      label: 'Help & Support',
      icon: (
        <div className="w-6 h-6">
          {pathname === '/vendor/help-support' ? (
            <Image 
              src="/images/VendorHelp&Support-active.svg" 
              alt="Help & Support" 
              width={24}
              height={24}
              className="w-6 h-6"
            />
          ) : (
            <Image 
              src="/images/VendorHelp&support-inactive.svg" 
              alt="Help & Support" 
              width={24}
              height={24}
              className="w-6 h-6 filter saturate-0 brightness-0 invert"
            />
          )}
        </div>
      ),
      path: '/vendor/help-support',
      isActive: pathname === '/vendor/help-support',
    },
  ]

  return (
    <aside className={`bg-event-blue text-white h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-event-blue flex-shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <Link href="/" className="text-white font-bold text-lg hover:opacity-80 transition-opacity">
                <span className="text-white">Event</span>
                <span className="text-yellow-400">hub</span>
              </Link>
            )}
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-event-blue-hover transition-colors"
            >
              {isCollapsed ? (
                <Link href="/" title="Go to landing page">
                  <Image 
                    src={iconLogo} 
                    alt="Event Hub" 
                    width={40} 
                    height={40}
                    className="drop-shadow-lg hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ filter: 'brightness(1.2) contrast(1.1)' }}
                  />
                </Link>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-2 px-2">
            {menuItems.map((item, index) => (
              <div key={item.label} className="relative">
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    item.isActive 
                      ? 'bg-white text-event-blue shadow-md' 
                      : 'text-white hover:bg-event-blue-hover hover:scale-105 hover:shadow-lg hover:text-white'
                  }`}
                  onClick={onClose}
                >
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
                  )}
                </Link>
                
                {/* Notification Badge */}
                {'notificationCount' in item && (item as any).notificationCount && (
                  <div className={`absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ${
                    isCollapsed ? 'top-1 right-1' : ''
                  }`}>
                    {(item as any).notificationCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-event-blue py-4 flex-shrink-0">
          <div className="space-y-2 px-2">
            {bottomItems.map((item) => (
              <div key={item.label} className="relative">
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    item.isActive 
                      ? 'bg-white text-event-blue shadow-md' 
                      : 'text-white hover:bg-event-blue-hover hover:scale-105 hover:shadow-lg hover:text-white'
                  }`}
                  onClick={onClose}
                >
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
                  )}
                </Link>
                
                {/* Notification Badge */}
                {'notificationCount' in item && (item as any).notificationCount && (
                  <div className={`absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ${
                    isCollapsed ? 'top-1 right-1' : ''
                  }`}>
                    {(item as any).notificationCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
