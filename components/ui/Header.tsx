'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import SignUpFlow from './modals/SignUpFlow'
import { useAuthContext } from '@/contexts/AuthContext'
import { FiUser, FiLogOut, FiBell, FiMessageSquare } from 'react-icons/fi'
import LogoutConfirmationModal from '@/components/ui/modals/LogoutConfirmationModal'
import { useNotifications } from '@/hooks/useNotifications'
import { useMessages } from '@/hooks/useMessages'

const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Washington, DC'
]

export default function Header() {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('Select Location')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSignUpFlow, setShowSignUpFlow] = useState(false)
  const { user, isAuthenticated, loading, logout } = useAuthContext()
  const [showLogout, setShowLogout] = useState(false)
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const { state: appState } = useApp()
  const [profilePictureKey, setProfilePictureKey] = useState(0) // Force re-render when profile picture changes
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const logoutDropdownRef = useRef<HTMLDivElement>(null)
  
  // FIXED: Get notification and message counts from hooks instead of hardcoding
  const { notificationCount } = useNotifications()
  const { messageCount } = useMessages()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      document.documentElement.classList.toggle('dark', saved === 'dark')
    }
  }, [])

  // Close logout dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoutDropdownRef.current && !logoutDropdownRef.current.contains(event.target as Node)) {
        setShowLogoutDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch profile picture from API
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user?.id || !isAuthenticated) {
        return
      }
      
      try {
        const { profileAPI } = await import('@/lib/api')
        
        let response
        try {
          // Try the /profile/me endpoint first
          response = await profileAPI.me()
        } catch (meError: any) {
          if (meError.response?.status === 404) {
            // Fallback to using user ID
            try {
              response = await profileAPI.getById(user.id)
            } catch (getByIdError: any) {
              if (getByIdError.response?.status === 404) {
                throw new Error('Profile endpoints not implemented')
              } else {
                throw getByIdError
              }
            }
          } else {
            throw meError
          }
        }
        
        if (response.data.data?.displayPicture) {
          const displayPicture = response.data.data.displayPicture
          setProfilePicture(displayPicture)
          setProfilePictureKey(prev => prev + 1)
          
          // Save to localStorage for fallback
          if (typeof window !== 'undefined' && user?.id) {
            localStorage.setItem(`profile_picture_${user.id}`, displayPicture)
          }
        } else {
          setProfilePicture(null)
        }
      } catch (error: any) {
        // If profile endpoint doesn't work at all, try localStorage fallback
        if (error.response?.status === 404 || error.message === 'Profile endpoints not implemented') {
          const savedImage = localStorage.getItem(`profile_picture_${user.id}`)
          if (savedImage) {
            setProfilePicture(savedImage)
            setProfilePictureKey(prev => prev + 1)
          } else {
            setProfilePicture(null)
          }
        } else {
          setProfilePicture(null)
        }
      }
    }
    
    fetchProfilePicture()
    
    // Listen for profile update events
    const handleProfileUpdate = () => {
      fetchProfilePicture()
    }
    
    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    // FIXED: Increase interval from 30s to 5 minutes and store reference properly
    const intervalId = setInterval(fetchProfilePicture, 300000) // 5 minutes instead of 30 seconds
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
      clearInterval(intervalId)
    }
  }, [user?.id, isAuthenticated]) // FIXED: Removed 'loading' from dependencies to prevent re-creating interval

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setIsLocationDropdownOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSwitchToVendor = () => {
    setShowLogoutDropdown(false)
    
    if (typeof window !== 'undefined') {
      window.location.href = '/vendor'
    }
  }

  const handleSwitchToClient = () => {
    setShowLogoutDropdown(false)
    
    if (typeof window !== 'undefined') {
      window.location.href = '/client/dashboard'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center min-w-[160px]">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/primary-logo 3.png" 
                alt="EventHub" 
                width={120}
                height={24}
                className="h-6 w-30"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
          </div>

          {/* Center Section - Location Dropdown and Search */}
          <div className="flex items-center space-x-0 flex-1 max-w-3xl mx-12">
            {/* Location Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                }
                className="bg-event-blue text-white px-6 py-3 rounded-l-lg hover:bg-event-blue-hover transition-colors flex items-center space-x-3 h-12 min-w-[140px] justify-between"
              >
                <span className="text-sm font-medium truncate">
                  {selectedLocation}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isLocationDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="Search locations..."
                      className="placeholder-center w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                    />
                  </div>
                  <div className="py-1">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-event-blue transition-colors"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for Services, Providers"
                className="flex-1 px-5 py-3 border-t border-b border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue h-12"
              />
              <button
                type="submit"
                className="bg-event-blue text-white px-8 py-3 rounded-r-lg hover:bg-event-blue-hover transition-colors h-12 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Search</span>
              </button>
            </form>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center gap-4 min-w-[200px] justify-end">
            {/* Theme Toggle removed */}
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                {notificationCount > 0 && (
                  <button className="relative p-2 text-gray-600 hover:text-event-blue transition-colors" aria-label="Notifications">
                    <FiBell className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  </button>
                )}

                {/* Messages */}
                {messageCount > 0 && (
                  <button className="relative p-2 text-gray-600 hover:text-event-blue transition-colors" aria-label="Messages">
                    <FiMessageSquare className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      {messageCount}
                    </span>
                  </button>
                )}

                {/* Profile Picture - Navigate to My Profile */}
                <Link href="/client/my-profile" className="relative">
                  <div key={profilePictureKey} className="relative w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {(() => {
                      const displayName = user?.displayName || 
                        (user?.accountType === 'vendor' ? user?.businessName : 
                         `${user?.firstName || ''} ${user?.lastName || ''}`.trim());
                      
                      
                      // Use profile picture from API state
                      if (profilePicture) {
                        return (
                          <Image 
                            src={profilePicture} 
                            alt="Profile" 
                            fill
                            className="object-cover"
                            key={profilePictureKey}
                            onError={() => setProfilePicture(null)}
                            sizes="40px"
                          />
                        );
                      }
                      
                      if (displayName) {
                        return (
                          <span className="text-gray-600 font-medium">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        );
                      }
                      
                      return <FiUser className="w-5 h-5 text-gray-400" />;
                    })()}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </Link>

                {/* User Name */}
                <span className="text-gray-700 font-medium">
                  {user?.displayName || 
                   (user?.accountType === 'vendor' ? user?.businessName : 
                    `${user?.firstName || ''} ${user?.lastName || ''}`.trim()) || 
                   'User'}
                </span>

                {/* Profile Dropdown */}
                <div className="relative" ref={logoutDropdownRef}>
                  <button
                    onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Account</span>
                    <svg className={`w-4 h-4 transition-transform ${showLogoutDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showLogoutDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                      <div className="py-2">
                        {user?.accountType === 'vendor' ? (
                          <button
                            onClick={handleSwitchToClient}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <FiUser className="w-4 h-4" />
                            <span>Switch to Client Profile</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleSwitchToVendor}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <FiUser className="w-4 h-4" />
                            <span>Switch to Vendor Profile</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowLogoutDropdown(false)
                            setShowLogout(true)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="text-gray-700 hover:text-event-blue transition-colors text-sm font-medium px-2"
                >
                  Login
                </a>
                <button
                  onClick={() => setShowSignUpFlow(true)}
                  className="bg-event-blue text-white px-6 py-3 rounded-lg hover:bg-event-blue-hover transition-colors text-sm font-medium"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Modals */}
            {showSignUpFlow && (
              <SignUpFlow onClose={() => setShowSignUpFlow(false)} />
            )}
          </div>
        </div>

        {/* Tablet Header */}
        <div className="hidden md:flex lg:hidden items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-event-blue">EventHub</Link>
          </div>

          {/* Simplified Search */}
          <div className="flex items-center flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue"
              />
              <button
                type="submit"
                className="bg-event-blue text-white px-4 py-2 rounded-r-lg hover:bg-event-blue-hover transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <a
              href="/auth/login"
              className="text-gray-700 hover:text-event-blue transition-colors text-sm font-medium"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="bg-event-blue text-white px-4 py-2 rounded-lg hover:bg-event-blue-hover transition-colors text-sm font-medium"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Image 
                src="/images/icon-1.png" 
                alt="EventHub" 
                width={32}
                height={32}
                className="h-8 w-8"
                sizes="32px"
              />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:text-event-blue hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white relative z-50">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                />
                <button
                  type="submit"
                  className="bg-event-blue text-white px-4 py-3 rounded-r-lg hover:bg-event-blue-hover transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Mobile Location Selector */}
            <div className="px-4 mb-4">
              <div className="relative">
                <button
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                  className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-medium">
                    {selectedLocation}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mobile Dropdown Menu */}
                {isLocationDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    <div className="py-1">
                      {locations.map(location => (
                        <button
                          key={location}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-event-blue transition-colors"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="px-4 space-y-3">
              {isAuthenticated && user ? (
                <>
                  {/* User summary */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {(() => {
                        const displayName = user?.displayName || 
                          (user?.accountType === 'vendor' ? user?.businessName : 
                           `${user?.firstName || ''} ${user?.lastName || ''}`.trim());
                        return displayName ? (
                          <span className="text-gray-600 font-medium">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <FiUser className="w-5 h-5 text-gray-400" />
                        );
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.displayName || 
                         (user?.accountType === 'vendor' ? user?.businessName : 
                          `${user?.firstName || ''} ${user?.lastName || ''}`.trim()) || 
                         'User'}
                      </p>
                      <p className="text-xs text-gray-500">Logged in</p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-3">
                    <button className="relative flex-1 p-3 text-gray-600 hover:text-event-blue transition-colors border border-gray-200 rounded-lg" aria-label="Notifications">
                      <FiBell className="w-5 h-5 mx-auto" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notificationCount}
                      </span>
                    </button>
                    <button className="relative flex-1 p-3 text-gray-600 hover:text-event-blue transition-colors border border-gray-200 rounded-lg" aria-label="Messages">
                      <FiMessageSquare className="w-5 h-5 mx-auto" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {messageCount}
                      </span>
                    </button>
                  </div>

                  <Link href="/client/my-profile" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium">My Profile</Link>

                  <button
                    onClick={() => setShowLogout(true)}
                    className="block w-full text-center bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 text-gray-700 hover:text-event-blue transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      router.push('/auth/register')
                    }}
                    className="block w-full text-center bg-event-blue text-white py-3 rounded-lg hover:bg-event-blue-hover transition-colors font-medium touch-manipulation"
                    type="button"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {(isLocationDropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsLocationDropdownOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
      {/* Logout Modal */}
      <LogoutConfirmationModal
        isOpen={showLogout}
        isLoggingOut={loggingOut}
        onClose={() => setShowLogout(false)}
        onConfirm={async () => {
          try {
            setLoggingOut(true)
            await logout()
            setShowLogout(false)
            setIsMobileMenuOpen(false)
          } catch (e) {
            console.error(e)
          } finally {
            setLoggingOut(false)
          }
        }}
      />
    </header>
  )
}