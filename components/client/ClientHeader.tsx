'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuthContext } from '@/contexts/AuthContext'
import { profileAPI } from '@/lib/api'
import { FiUser, FiLogOut, FiBell, FiMessageCircle } from 'react-icons/fi'
import LogoutConfirmationModal from '@/components/ui/modals/LogoutConfirmationModal'

interface ClientHeaderProps {
  onMenuClick?: () => void
}

export default function ClientHeader({ onMenuClick }: ClientHeaderProps) {
  const { user, isAuthenticated, logout } = useAuthContext()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const logoutRef = useRef<HTMLDivElement>(null)

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

  // Fetch profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.id && isAuthenticated) {
        try {
          const response = await profileAPI.me()
          if (response.data.data?.displayPicture) {
            setProfilePicture(response.data.data.displayPicture)
          }
        } catch (error: any) {
          console.error('Error fetching profile picture:', error)
          
          // Handle API not available - use localStorage fallback
          if (error.response?.status === 404) {
            const savedImage = localStorage.getItem(`profile_picture_${user.id}`)
            if (savedImage) {
              setProfilePicture(savedImage)
            }
          }
        }
      }
    }
    fetchProfilePicture()
  }, [user, isAuthenticated])

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

  return (
    <header className="w-full bg-white shadow px-2 sm:px-3 lg:px-6 py-2 sm:py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left section with hamburger and logo */}
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

        {/* Logo */}
        <Link href="/" className="flex items-center">
          {/* Mobile: Icon logo */}
          <img 
            src="/images/icon-1.png" 
            alt="EventHub" 
            className="h-8 w-8 lg:hidden"
          />
          {/* Desktop: Full logo */}
          <img 
            src="/images/primary-logo 3.png" 
            alt="EventHub" 
            className="h-8 w-auto hidden lg:block"
          />
        </Link>
      </div>

      {/* Right section with notifications, messages, profile, and logout */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:text-gray-900 relative"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-900">New offer received for your event</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-900">Booking confirmed</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative" ref={messageRef}>
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="p-2 text-gray-600 hover:text-gray-900 relative"
          >
            <FiMessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </button>
          
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Messages</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">New message from Elite Catering</p>
                    <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <Link href="/client/my-profile" className="relative">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (user?.firstName || user?.businessName || user?.displayName) ? (
              <span className="text-gray-600 font-medium text-sm">
                {(user?.firstName || user?.businessName || user?.displayName || 'U').charAt(0).toUpperCase()}
              </span>
            ) : (
              <FiUser className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </Link>

        {/* User Name */}
        <span className="hidden sm:block text-sm font-medium text-gray-900">
          {user?.firstName || user?.businessName || user?.displayName || 'User'}
        </span>

        {/* Logout Button */}
        <div className="relative" ref={logoutRef}>
          <button
            onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:block text-sm font-medium">Logout</span>
          </button>
          
          {showLogoutDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <div className="py-2">
                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out</span>
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
