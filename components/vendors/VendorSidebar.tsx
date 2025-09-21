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
      notificationCount: 3,
      isActive: pathname === '/vendor/messages',
    },
    {
      label: 'Manage Bookings',
      icon: (
        <div className="w-6 h-6">
          {pathname === '/vendor/manage-bookings' ? (
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.66602 21.0003V9.91699C4.66602 8.52461 5.21914 7.18925 6.2037 6.20468C7.18827 5.22012 8.52363 4.66699 9.91602 4.66699H18.0827C18.7721 4.66699 19.4548 4.80279 20.0918 5.06662C20.7287 5.33046 21.3075 5.71717 21.795 6.20468C22.2825 6.69219 22.6692 7.27094 22.933 7.9079C23.1969 8.54486 23.3327 9.22755 23.3327 9.91699V18.0837C23.3327 18.7731 23.1969 19.4558 22.933 20.0927C22.6692 20.7297 22.2825 21.3085 21.795 21.796C21.3075 22.2835 20.7287 22.6702 20.0918 22.934C19.4548 23.1979 18.7721 23.3337 18.0827 23.3337H6.99935C6.38051 23.3337 5.78702 23.0878 5.34943 22.6502C4.91185 22.2127 4.66602 21.6192 4.66602 21.0003Z" stroke="#032D71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.33203 14.0007H13.4154C14.0342 14.0007 14.6277 14.2465 15.0653 14.6841C15.5029 15.1217 15.7487 15.7151 15.7487 16.334C15.7487 16.9528 15.5029 17.5463 15.0653 17.9839C14.6277 18.4215 14.0342 18.6673 13.4154 18.6673H9.33203V10.5007C9.33203 10.1912 9.45495 9.89449 9.67374 9.67569C9.89253 9.4569 10.1893 9.33398 10.4987 9.33398H12.2487C12.8675 9.33398 13.461 9.57982 13.8986 10.0174C14.3362 10.455 14.582 11.0485 14.582 11.6673C14.582 12.2862 14.3362 12.8796 13.8986 13.3172C13.461 13.7548 12.8675 14.0007 12.2487 14.0007H10.4987M18.6654 18.6673H18.677" stroke="#032D71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.66602 21.0003V9.91699C4.66602 8.52461 5.21914 7.18925 6.2037 6.20468C7.18827 5.22012 8.52363 4.66699 9.91602 4.66699H18.0827C18.7721 4.66699 19.4548 4.80279 20.0918 5.06662C20.7287 5.33046 21.3075 5.71717 21.795 6.20468C22.2825 6.69219 22.6692 7.27094 22.933 7.9079C23.1969 8.54486 23.3327 9.22755 23.3327 9.91699V18.0837C23.3327 18.7731 23.1969 19.4558 22.933 20.0927C22.6692 20.7297 22.2825 21.3085 21.795 21.796C21.3075 22.2835 20.7287 22.6702 20.0918 22.934C19.4548 23.1979 18.7721 23.3337 18.0827 23.3337H6.99935C6.38051 23.3337 5.78702 23.0878 5.34943 22.6502C4.91185 22.2127 4.66602 21.6192 4.66602 21.0003Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.33203 14.0007H13.4154C14.0342 14.0007 14.6277 14.2465 15.0653 14.6841C15.5029 15.1217 15.7487 15.7151 15.7487 16.334C15.7487 16.9528 15.5029 17.5463 15.0653 17.9839C14.6277 18.4215 14.0342 18.6673 13.4154 18.6673H9.33203V10.5007C9.33203 10.1912 9.45495 9.89449 9.67374 9.67569C9.89253 9.4569 10.1893 9.33398 10.4987 9.33398H12.2487C12.8675 9.33398 13.461 9.57982 13.8986 10.0174C14.3362 10.455 14.582 11.0485 14.582 11.6673C14.582 12.2862 14.3362 12.8796 13.8986 13.3172C13.461 13.7548 12.8675 14.0007 12.2487 14.0007H10.4987M18.6654 18.6673H18.677" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
      icon: <Icon icon={paymentsOutline} width="24" height="24" />,
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
      icon: <Icon icon={reviewsOutline} width="24" height="24" />,
      path: '/vendor/rating-reviews',
      notificationCount: 3,
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
      icon: <FiHelpCircle className="w-6 h-6" />,
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
              <div className="text-white font-bold text-lg">
                <span className="text-white">Event</span>
                <span className="text-yellow-400">hub</span>
              </div>
            )}
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-event-blue-hover transition-colors"
            >
              {isCollapsed ? (
                <Image 
                  src={iconLogo} 
                  alt="Event Hub" 
                  width={40} 
                  height={40}
                  className="drop-shadow-lg"
                  style={{ filter: 'brightness(1.2) contrast(1.1)' }}
                />
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
