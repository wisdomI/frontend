'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiLogOut, FiBell, FiMessageSquare, FiSettings, FiSearch, FiChevronDown, FiUser } from 'react-icons/fi'
import primaryLogo from '../../public/images/primary-logo 3.png'
import iconLogo from '../../public/images/icon-1.png'
import LogoutConfirmationModal from '@/components/ui/modals/LogoutConfirmationModal'
import { useAuthContext } from '@/contexts/AuthContext'

export default function VerificationHeader() {
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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
      setShowLogoutDropdown(false)
    }
  }

  const displayName = user?.firstName || user?.businessName || user?.displayName || 'Verification Admin'

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-14">
            {/* Left Section - Logo + Search */}
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className="flex items-center flex-shrink-0">
                  <div className="lg:hidden">
                    <Image src={iconLogo} alt="EventHub logo" width={32} height={32} className="object-contain h-8 w-8" priority />
                  </div>
                  <div className="hidden lg:block">
                    <Image src={primaryLogo} alt="EventHub logo" width={140} height={40} className="object-contain h-10 w-auto" priority />
                  </div>
              </div>

              {/* Desktop Search */}
              <div className="hidden md:flex items-center gap-0 flex-1 max-w-xl ml-4 lg:ml-8">
                <div className="flex items-center flex-1 bg-[#F5F6FA] border border-gray-200 rounded-l-md border-r-0 h-12 px-4 focus-within:ring-1 focus-within:ring-event-blue/20 focus-within:border-event-blue transition-all">
                  <FiSearch className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search for anything"
                    className="flex-1 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 bg-[#0B2E6F] text-white font-semibold px-8 rounded-r-md hover:bg-[#0d3a8a] transition-colors flex-shrink-0"
                >
                  <FiSearch className="h-5 w-5" />
                  Search
                </button>
              </div>
            </div>

            {/* Right Section - Notifications, Profile, Logout */}
            <div className="flex items-center gap-2 lg:gap-6">
              {/* Mobile Search Icon */}
              <button className="md:hidden p-2 text-gray-500 hover:text-gray-900">
                <FiSearch className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-1 lg:gap-2 border-r border-gray-200 pr-2 lg:pr-6 mr-1 lg:mr-2">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full relative transition-colors"
                  >
                    <FiBell className="h-6 w-6" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="p-4 text-sm text-gray-500 text-center">No new notifications</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="relative" ref={messageRef}>
                  <button
                    onClick={() => setShowMessages(!showMessages)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full relative transition-colors"
                  >
                    <FiMessageSquare className="h-6 w-6" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 bg-blue-500 rounded-full border-2 border-white"></span>
                  </button>
                  {showMessages && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="p-4 text-sm text-gray-500 text-center">No new messages</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Dropdown with logo */}
              <div className="relative" ref={logoutRef}>
                <button
                  onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
                  className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-event-blue flex items-center justify-center text-white shadow-sm">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <span className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-800 pr-2">
                    <span>{displayName}</span>
                    <FiChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </button>

                {showLogoutDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="hidden lg:inline-flex items-center bg-[#0B2E6F] text-white font-semibold px-8 py-2.5 rounded-md shadow hover:bg-[#0d3a8a] transition-colors ml-4 lg:ml-20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  )
}

