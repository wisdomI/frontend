"use client"

import { Icon } from '@iconify/react'
import Link from 'next/link'
import Image from 'next/image'
import dashboardOutline from '@iconify/icons-material-symbols/dashboard-outline'
import { MessageOutlined } from '@ant-design/icons'
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

interface SidebarProps {
  onClose?: () => void
  isCollapsed?: boolean
  onToggle?: () => void
}

const Sidebar = ({ onClose, isCollapsed = false, onToggle }: SidebarProps) => {
  const menuItems = [
    {
      label: 'Dashboard',
      icon: <Icon icon={dashboardOutline} width="24" height="24" />,
      path: '/vendor',
      isActive: true,
    },
    {
      label: 'Service Requests',
      icon: <Icon icon="material-symbols:assignment-outline" width="24" height="24" />,
      path: '/vendor/service-requests',
    },
    {
      label: 'Manage Clients',
      icon: <Icon icon="material-symbols:group-outline" width="24" height="24" />,
      path: '/vendor/manage-clients',
    },
    {
      label: 'Messages',
      icon: <MessageOutlined style={{ fontSize: 24 }} />,
      path: '/messages',
      notificationCount: 3,
    },
    {
      label: 'Invoice Management',
      icon: <Icon icon={invoice} width="24" height="24" />,
      path: '/vendor/invoice-management',
    },
    {
      label: 'Schedule Meetings',
      icon: <Icon icon={calendarMonthOutline} width="24" height="24" />,
      path: '/schedule-meetings',
    },
    {
      label: 'My Earnings',
      icon: <Icon icon={paymentsOutline} width="24" height="24" />,
      path: '/my-earnings',
    },
    {
      label: 'Manage Subscriptions',
      icon: <Icon icon={subscriptions} width="24" height="24" />,
      path: '/manage-subscriptions',
    },
    {
      label: 'Performance Analytics',
      icon: <Icon icon="material-symbols:bar-chart-outline" width="24" height="24" />,
      path: '/performance-analytics',
    },
    {
      label: 'Manage Users',
      icon: <Icon icon={personOutline} width="24" height="24" />,
      path: '/manage-users',
    },
    {
      label: 'Rating & Reviews',
      icon: <Icon icon={reviewsOutline} width="24" height="24" />,
      path: '/rating-reviews',
      notificationCount: 3,
    },
  ]

  const bottomItems = [
    {
      label: 'Profile',
      icon: <Icon icon={personOutline} width="24" height="24" />,
      path: '/profile',
      notificationCount: 3,
    },
    {
      label: 'Notifications',
      icon: <Icon icon="material-symbols:notifications-outline" width="24" height="24" />,
      path: '/notifications',
      notificationCount: 1,
    },
  ]

  return (
    <aside className={`bg-blue-900 text-white h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="text-white font-bold text-lg">Eh</div>
            )}
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4">
          <div className="space-y-2 px-2">
            {menuItems.map((item, index) => (
              <div key={item.label} className="relative">
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                    item.isActive 
                      ? 'bg-white text-blue-900' 
                      : 'text-white hover:bg-blue-800'
                  }`}
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                </Link>
                
                {/* Notification Badge */}
                {item.notificationCount && (
                  <div className={`absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ${
                    isCollapsed ? 'top-1 right-1' : ''
                  }`}>
                    {item.notificationCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-blue-800 py-4">
          <div className="space-y-2 px-2">
            {bottomItems.map((item) => (
              <div key={item.label} className="relative">
                <Link
                  href={item.path}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-white hover:bg-blue-800 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                </Link>
                
                {/* Notification Badge */}
                {item.notificationCount && (
                  <div className={`absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ${
                    isCollapsed ? 'top-1 right-1' : ''
                  }`}>
                    {item.notificationCount}
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
