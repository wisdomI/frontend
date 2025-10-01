'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { signOutUser } from '@/lib/auth-simple'

interface ProfileDropdownProps {
  user: {
    name: string
    avatar?: string
    role: 'client' | 'vendor'
  }
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const logoutRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
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

  const handleSwitchToVendor = () => {
    // TODO: Implement role switching logic
    console.log('Switching to vendor profile')
    router.push('/vendor')
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      console.log('ProfileDropdown: Starting logout process...')
      setShowLogoutDropdown(false)
      setIsOpen(false)
      
      console.log('ProfileDropdown: Calling signOutUser...')
      const result = await signOutUser()
      console.log('ProfileDropdown: signOutUser result:', result)
      
      console.log('ProfileDropdown: Logout successful, redirecting...')
      // Redirect to home page after logout
      router.push('/')
    } catch (error) {
      console.error('ProfileDropdown: Logout error:', error)
      // Still close dropdowns even if logout fails
      setShowLogoutDropdown(false)
      setIsOpen(false)
    }
  }

  const menuItems = [
    { label: 'My Profile', path: '/my-profile' },
    { label: 'Manage all Posts', path: '/posts' },
    { label: 'Manage Event Planners', path: '/event-planners' },
    { label: 'Manage Bookings', path: '/bookings' },
    { label: 'Messages', path: '/messages' },
    { label: 'Schedule Meetings', path: '/meetings' },
    { label: 'Payment & Billings', path: '/payments' },
    { label: 'Reviews and Ratings', path: '/reviews' },
    { label: 'Help & Support', path: '/help' },
    { label: 'General Settings', path: '/settings' },
  ]

  return (
    <div className="relative">
      {/* Profile Button */}
      <div
        ref={dropdownRef}
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Profile Picture with Online Status */}
        <div className="relative">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {/* Online Status Indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* User Name */}
        <span className="text-gray-700 font-medium">{user.name}</span>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Profile Settings Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <div className="px-4 py-2 bg-blue-50">
              <span className="font-semibold text-blue-600">Profile Settings</span>
            </div>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  router.push(item.path)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors ${
                  item.label === 'My Profile' ? 'font-medium text-blue-600' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-200 p-2">
            <div className="relative" ref={logoutRef}>
              <button
                onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Logout
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Logout Dropdown */}
              {showLogoutDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200">
                  <button
                    onClick={handleSwitchToVendor}
                    className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Switch to Vendor Profile
                  </button>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
