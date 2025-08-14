'use client'

import React, { useState } from 'react'
import SignUpFlow from './modals/SignUpFlow'

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
  const [selectedLocation, setSelectedLocation] = useState('Location')
  const [searchQuery, setSearchQuery] = useState('')
    const [showSignUpFlow, setShowSignUpFlow] = useState(false)

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setIsLocationDropdownOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery, 'in', selectedLocation)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center min-w-[160px]">
            <a href="/" className="text-2xl font-bold text-event-blue">
              EventHub
            </a>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue"
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

          {/* Right Section - Login and Get Started */}
          <div className="flex items-center gap-5 min-w-[200px] justify-end">
            <a
              href="/auth/login"
              className="text-gray-700 hover:text-event-blue transition-colors text-sm font-medium px-2"
            >
              Login
            </a>
            {/* <a 
              href="/auth/register" 
              className="bg-event-blue text-white px-6 py-3 rounded-lg hover:bg-event-blue-hover transition-colors text-sm font-medium"
            >
              Get Started
            </a> */}
            <button
              onClick={() => setShowSignUpFlow(true)}
              className="block w-full text-center bg-event-blue text-white py-3 rounded-lg hover:bg-event-blue-hover transition-colors font-medium"
            >
              Get Started
            </button>

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
            <a href="/" className="text-xl font-bold text-event-blue">
              EventHub
            </a>
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
            <a href="/" className="text-xl font-bold text-event-blue">
              EventHub
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
          <div className="md:hidden border-t border-gray-200 py-4">
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
            <div className="px-4 space-y-2">
              <a
                href="/auth/login"
                className="block w-full text-center py-3 text-gray-700 hover:text-event-blue transition-colors font-medium"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="block w-full text-center bg-event-blue text-white py-3 rounded-lg hover:bg-event-blue-hover transition-colors font-medium"
              >
                Get Started
              </a>
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
    </header>
  )
}