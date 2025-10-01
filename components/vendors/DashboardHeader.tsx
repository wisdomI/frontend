'use client'

import { Bell, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/vendors/SearchBar'
import { MessageOutlined } from '@ant-design/icons'
import { FaArrowDown, FaChevronDown } from 'react-icons/fa6'
import { ArrowDownIcon } from '@heroicons/react/20/solid'
import { useState, useRef, useEffect } from 'react'
import { FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import LogoutConfirmationModal from '@/components/ui/modals/LogoutConfirmationModal'
import { useAuthContext } from '@/contexts/AuthContext'

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const logoutRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthContext()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowMessages(false)
      }
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogoutDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSwitchToClient = () => {
    // In a real app, this would switch the user to client mode
    console.log('Switching to client profile')
    setShowLogoutDropdown(false)
  }

  const handleLogoutClick = () => {
    setShowLogoutDropdown(false)
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
    setIsLoggingOut(false)
  }

  const notifications = [
    {
      id: 1,
      title: 'New booking request',
      message: 'Sarah Johnson wants to book your catering service',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Payment received',
      message: 'Payment of ₦150,000 received for Wedding Catering',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Review received',
      message: 'You received a 5-star review from Michael Brown',
      time: '3 hours ago',
      unread: false
    }
  ]

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      message: 'Hi, I would like to discuss the menu options...',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      sender: 'Michael Brown',
      message: 'Thank you for the excellent service!',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      sender: 'Emma Wilson',
      message: 'Can we schedule a meeting for next week?',
      time: '1 day ago',
      unread: false
    }
  ]

  return (
    <header className="w-full bg-white shadow px-2 sm:px-3 lg:px-6 py-2 sm:py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left section with hamburger and search */}
      <div className="flex items-center flex-1 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 mr-1 sm:mr-2 flex-shrink-0 z-30"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Section */}
        <div className="flex-1 min-w-0">
          <SearchBar
            placeholder="Search for anything"
            onSearch={query => {
              console.log('Searching for:', query)
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 ml-2 flex-shrink-0">
               {/* Notifications */}
               <div className="relative" ref={notificationRef}>
                 <button
                   onClick={() => setShowNotifications(!showNotifications)}
                   className="relative cursor-pointer p-1 sm:p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   <Bell className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-600" />
                   <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full px-0.5 sm:px-1 min-w-[12px] sm:min-w-[16px] text-center">
                     {notifications.filter(n => n.unread).length}
                   </span>
                 </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
              </div>
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm">{notification.title}</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

               {/* Messages */}
               <div className="relative" ref={messageRef}>
                 <button
                   onClick={() => setShowMessages(!showMessages)}
                   className="relative cursor-pointer p-1 sm:p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   <MessageOutlined className="text-gray-600" width={12} height={12} style={{ width: '12px', height: '12px' }} />
                   <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full px-0.5 sm:px-1 min-w-[12px] sm:min-w-[16px] text-center">
                     {messages.filter(m => m.unread).length}
                   </span>
                 </button>

          {/* Message Dropdown */}
          {showMessages && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Messages</h3>
              </div>
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      message.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        message.unread ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm">{message.sender}</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">{message.message}</p>
                        <p className="text-gray-400 text-xs mt-2">{message.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
                  View all messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-3 px-2 sm:px-3 py-1 sm:py-2">
          {/* Display Picture */}
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {(user?.businessName || user?.firstName || user?.displayName) ? (
              <span className="text-gray-600 font-medium text-sm">
                {(user?.businessName || user?.firstName || user?.displayName || 'V').charAt(0).toUpperCase()}
              </span>
            ) : (
              <FiUser className="w-4 h-4 text-gray-600" />
            )}
          </div>
          {/* Business Name */}
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            {user?.businessName || user?.firstName || 'Vendor'}
          </p>
        </div>
        
        {/* Logout Dropdown */}
        <div className="relative" ref={logoutRef}>
          <button
            onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors text-xs sm:text-sm lg:text-base whitespace-nowrap"
          >
            <span className="hidden lg:inline">Logout</span>
            <span className="lg:hidden">Out</span>
            <FaChevronDown className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
          </button>

          {/* Logout Dropdown */}
          {showLogoutDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <button
                  onClick={handleSwitchToClient}
                  className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiUser className="mr-2 sm:mr-3 w-3 h-3 sm:w-4 sm:h-4" />
                  Switch to Client Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="mr-2 sm:mr-3 w-3 h-3 sm:w-4 sm:h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
    </header>
  )
}
