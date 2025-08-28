'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '@/public/images/primary-logo.png'
import LocationSelect from './select/LocationSelect'
import SignUpFlow from '@/components/auth/SignUpFlow'
import LoginModal from '@/components/auth/LoginForm'




export default function Header() {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSignUpFlow, setShowSignUpFlow] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Define locations array for mobile dropdown
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
    'San Jose, CA'
  ]

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    setIsLocationDropdownOpen(false)
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setIsLocationDropdownOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery, 'in', selectedLocation)
  }

  return (
    <header className="bg-[#fff] shadow-sm border-b">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-20 bg-white">
          {/* Logo */}
          <div className="flex items-center min-w-[160px]">
            <a href="/" className="text-2xl font-bold text-event-blue">
              <Image src={Logo}
                alt="logo image "
                width={200}
                height={200}
              />
            </a>
          </div>

          {/* Center Section - Location Dropdown and Search */}
          <div className="flex items-center font-sans space-x-0 flex-1 max-w-3xl mx-12">
            {/* Location Dropdown */}
            <div className="min-w-[200px]">
              <div className="[&>div>button]:rounded-l-lg [&>div>button]:rounded-r-none [&>div>button]:bg-event-blue [&>div>button]:text-white [&>div>button]:border-event-blue [&>div>button]:h-12 [&>div>button]:hover:bg-event-blue-hover">
                <LocationSelect
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  placeholder="Select Location"
                />
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-1 font-sans ">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Services, Vendors"
                className="flex-1 px-5 py-3 border-t border-b  font-sans font-medium   border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue h-12"
              />
              <button
                type="submit"
                className="bg-event-blue text-white px-8 py-3 rounded-r-lg hover:bg-event-blue-hover transition-colors h-12 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-md font-semibold font-sans  ">Search</span>
              </button>
            </form>
          </div>

          {/* Right Section - Login and Get Started */}
          <div className="flex items-center space-x-6 min-w-[200px] justify-end">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-gray-700 font-sans  hover:text-event-blue transition-colors text-md font-semibold px-2"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignUpFlow(true)}
              className="bg-event-blue font-sans text-white px-6 py-3 rounded-lg hover:bg-event-blue-hover transition-colors text-md font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Tablet Header */}
        <div className="hidden md:flex lg:hidden items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center min-w-[100px]">
            <a href="/" className="text-xl font-bold text-event-blue">
              <Image src={Logo}
                alt="logo image "
                width={100}
                height={100}
              />
            </a>
          </div>

          {/* Simplified Search */}
          <div className="flex items-center flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue"
              />
              <button
                type="submit"
                className="bg-event-blue text-white px-4 py-2 rounded-r-lg hover:bg-event-blue-hover transition-colors flex items-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-gray-700 hover:text-event-blue transition-colors text-sm font-medium"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignUpFlow(true)}
              className="bg-event-blue text-white px-4 py-2 rounded-lg hover:bg-event-blue-hover transition-colors text-sm font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-event-blue">
              EventHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:text-event-blue hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue"
                />
                <button
                  type="submit"
                  className="bg-event-blue text-white px-4 py-3 rounded-r-lg hover:bg-event-blue-hover transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Mobile Location Selector */}
            <div className="px-4 mb-4">
              <div className="relative">
                <button
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{selectedLocation}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Dropdown Menu */}
                {isLocationDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    <div className="py-1">
                      {locations.map((location) => (
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
            <div className="px-4 space-y-2">
              <button
                onClick={() => {
                  setShowLoginModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-center py-3 text-gray-700 hover:text-event-blue transition-colors font-medium"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowSignUpFlow(true)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-center bg-event-blue text-white py-3 rounded-lg hover:bg-event-blue-hover transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {(isLocationDropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsLocationDropdownOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}

      {/* Authentication Modals */}
      {showSignUpFlow && (
        <SignUpFlow onClose={() => setShowSignUpFlow(false)} />
      )}
      
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  )
}