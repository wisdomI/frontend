"use client"

import { Icon } from '@iconify/react'
import Link from 'next/link'
import Image from 'next/image'
import dashboardOutline from '@iconify/icons-material-symbols/dashboard-outline'
import { BsPeople } from 'react-icons/bs'
// import jobSearch from '@iconify-json/hugeicons/icons/job-search.json'
// import userManagement from '@iconify-json/ix/icons/user-management.json'
import { MessageOutlined } from '@ant-design/icons'
import eventNoteOutline from '@iconify/icons-material-symbols/event-note-outline'
import invoice from '@iconify/icons-material-symbols/post-add-rounded'
import calendarMonthOutline from '@iconify/icons-mdi/calendar-multiselect-outline'
import paymentsOutline from '@iconify/icons-material-symbols/payments-outline'
import subscriptions from '@iconify/icons-icomoon-free/price-tags'
import subscriptionsOutline from '@iconify/icons-material-symbols/subscriptions-outline'
// import monitoringOutline from '@iconify/icons-material-symbols/monitoring-outline'
import personOutline from '@iconify/icons-material-symbols/person-outline'
import reviewsOutline from '@iconify/icons-material-symbols/reviews-outline'
import settingsOutline from '@iconify/icons-material-symbols/settings-outline'
import { IoHelpCircleOutline } from 'react-icons/io5'
import logo from "../../public/images/primary-logo 3.png"


const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const menuItems = [
    {
      label: 'Dashboard',
      icon: <Icon icon={dashboardOutline} width="24" height="24" />,
      path: '/vendor',
    },
    {
      label: 'Service Requests',
      icon: <Icon icon="hugeicons:job-search" width="24" height="24" />,
      path: '/vendor/service-requests',
    },
    {
      label: 'Manage Clients',
      icon: <Icon icon="ix:user-management" width="24" height="24" />,
      path: '/vendor/manage-clients',
    },
    {
      label: 'Manage Bookings',
      icon: <Icon icon={eventNoteOutline} width="24" height="24" />,
      path: '/manage-bookings',
    },
    {
      label: 'Messages',
      icon: <MessageOutlined style={{ fontSize: 24 }} />,
      path: '/messages',
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
      //   icon: <Icon icon={monitoringOutline} width="24" height="24" />,
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
    },
    {
      label: 'Settings',
      icon: <Icon icon={settingsOutline} width="24" height="24" />,
      path: '/settings',
    },
  ]

  return (
    <aside className="bg-event-blue text-white w-full h-full flex flex-col justify-between py-6 overflow-y-auto">
      <div>
        {/* Mobile close button */}
        <div className="flex justify-between items-center px-4 pb-4 lg:hidden">
          <Image src={logo} alt="Logo" width={120} height={20} />
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Desktop logo */}
        <div className="hidden lg:block">
          <Image src={logo} alt="Logo" width={200} height={34} className="p-4" />
        </div>
        
        <div className="px-4 py-6 font-bold text-lg">Vendor Dashboard</div>
        <nav className="space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.label}
              href={item.path}
              className="flex items-center gap-3 px-4 py-2 hover:bg-blue-900 w-full"
              onClick={onClose} // Close sidebar on mobile when clicking a link
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-blue-800">
        <Link
          href="/help"
          className="flex items-center gap-3 w-full hover:bg-blue-900 p-2 rounded"
          onClick={onClose} // Close sidebar on mobile when clicking a link
        >
          <IoHelpCircleOutline /> Help & Support
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
