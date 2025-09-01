'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '@/public/images/primary-logo.png'
import LocationSelect from '@/components/ui/select/LocationSelect'

export default function ProfileHeader() {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...')
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
          <div className="flex items-center font-sans space-x-0 flex-1 max-w-3xl mx-8">
            {/* Location Dropdown */}
            <div className="min-w-[200px]">
              <div className="[&>div>button]:rounded-l-lg [&>div>button]:rounded-r-none [&>div>button]:bg-event-blue [&>div>button]:text-white [&>div>button]:border-event-blue [&>div>button]:h-12 text-white [&>div>button]:hover:bg-event-blue-hover">
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

          {/* Right Section - Profile and Notifications */}
          <div className="flex items-center space-x-6 min-w-[200px] justify-end">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-event-blue transition-colors">
             
<svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.4615 13.9362V11.7069H17.7692V14.2931C17.7693 14.5217 17.8585 14.741 18.0172 14.9026L20.3077 17.2362V18.6034H1.69231V17.2362L3.98285 14.9026C4.14154 14.741 4.23072 14.5217 4.23077 14.2931V10.8448C4.22856 9.63352 4.54013 8.44306 5.13401 7.39368C5.72789 6.3443 6.58305 5.47316 7.61313 4.86824C8.6432 4.26332 9.81172 3.94603 11.0007 3.94843C12.1896 3.95083 13.3569 4.27282 14.3846 4.8819V2.95345C13.5791 2.59016 12.7225 2.35858 11.8462 2.26724V0.5H10.1538V2.26724C8.06772 2.48356 6.13441 3.48027 4.72777 5.06464C3.32114 6.64901 2.54109 8.70848 2.53846 10.8448V13.9362L0.247923 16.2698C0.0892274 16.4315 4.7924e-05 16.6507 0 16.8793V19.4655C0 19.6942 0.0891481 19.9134 0.247833 20.0751C0.406517 20.2368 0.62174 20.3276 0.846154 20.3276H6.76923V21.1897C6.76923 22.3328 7.21497 23.4292 8.00839 24.2375C8.80182 25.0459 9.87793 25.5 11 25.5C12.1221 25.5 13.1982 25.0459 13.9916 24.2375C14.785 23.4292 15.2308 22.3328 15.2308 21.1897V20.3276H21.1538C21.3783 20.3276 21.5935 20.2368 21.7522 20.0751C21.9109 19.9134 22 19.6942 22 19.4655V16.8793C22 16.6507 21.9108 16.4315 21.7521 16.2698L19.4615 13.9362ZM13.5385 21.1897C13.5385 21.8756 13.271 22.5334 12.795 23.0184C12.3189 23.5034 11.6732 23.7759 11 23.7759C10.3268 23.7759 9.68109 23.5034 9.20504 23.0184C8.72898 22.5334 8.46154 21.8756 8.46154 21.1897V20.3276H13.5385V21.1897Z" fill="#4C4C4C"/>
</svg>

              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Messages */}
            <button className="relative p-2 text-gray-600 hover:text-event-blue transition-colors">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.7143 12.5C10.7143 12.841 10.8498 13.168 11.0909 13.4091C11.332 13.6503 11.659 13.7857 12 13.7857C12.341 13.7857 12.668 13.6503 12.9091 13.4091C13.1502 13.168 13.2857 12.841 13.2857 12.5C13.2857 12.159 13.1502 11.832 12.9091 11.5909C12.668 11.3497 12.341 11.2143 12 11.2143C11.659 11.2143 11.332 11.3497 11.0909 11.5909C10.8498 11.832 10.7143 12.159 10.7143 12.5ZM16.0714 12.5C16.0714 12.841 16.2068 13.168 16.448 13.4091C16.6891 13.6503 17.0161 13.7857 17.3571 13.7857C17.6981 13.7857 18.0251 13.6503 18.2662 13.4091C18.5073 13.168 18.6428 12.841 18.6428 12.5C18.6428 12.159 18.5073 11.832 18.2662 11.5909C18.0251 11.3497 17.6981 11.2143 17.3571 11.2143C17.0161 11.2143 16.6891 11.3497 16.448 11.5909C16.2068 11.832 16.0714 12.159 16.0714 12.5ZM5.35723 12.5C5.35723 12.841 5.49268 13.168 5.7338 13.4091C5.97492 13.6503 6.30194 13.7857 6.64293 13.7857C6.98391 13.7857 7.31094 13.6503 7.55205 13.4091C7.79317 13.168 7.92862 12.841 7.92862 12.5C7.92862 12.159 7.79317 11.832 7.55205 11.5909C7.31094 11.3497 6.98391 11.2143 6.64293 11.2143C6.30194 11.2143 5.97492 11.3497 5.7338 11.5909C5.49268 11.832 5.35723 12.159 5.35723 12.5ZM23.0677 7.85C22.4624 6.41161 21.5945 5.12054 20.4883 4.01161C19.3898 2.90912 18.0857 2.03277 16.6499 1.43214C15.1767 0.813393 13.6125 0.5 12 0.5H11.9464C10.3232 0.508036 8.75094 0.829464 7.27238 1.46161C5.84891 2.06839 4.55707 2.9463 3.46886 4.04643C2.37334 5.15268 1.51353 6.43839 0.918891 7.87143C0.302827 9.35536 -0.00788365 10.933 0.000151961 12.5562C0.00924091 14.4164 0.449321 16.2492 1.28585 17.9107V21.9821C1.28585 22.3089 1.41566 22.6223 1.64673 22.8534C1.8778 23.0845 2.1912 23.2143 2.51798 23.2143H6.59203C8.25352 24.0508 10.0863 24.4909 11.9464 24.5H12.0027C13.6071 24.5 15.1634 24.1893 16.6285 23.5813C18.057 22.9878 19.3562 22.1217 20.4535 21.0312C21.5597 19.9357 22.4302 18.6554 23.0383 17.2277C23.6704 15.7491 23.9918 14.1768 23.9999 12.5536C24.0079 10.9223 23.6918 9.33929 23.0677 7.85ZM19.0204 19.5821C17.1428 21.4411 14.6518 22.4643 12 22.4643H11.9545C10.3393 22.4563 8.73486 22.0545 7.31792 21.2991L7.09292 21.1786H3.32154V17.4071L3.201 17.1821C2.44566 15.7652 2.04388 14.1607 2.03584 12.5455C2.02513 9.875 3.04565 7.36786 4.91795 5.47946C6.78757 3.59107 9.28664 2.54643 11.9571 2.53571H12.0027C13.3419 2.53571 14.641 2.79554 15.8651 3.30982C17.0598 3.81071 18.1312 4.53125 19.0526 5.45268C19.9713 6.37143 20.6945 7.44554 21.1954 8.64018C21.7151 9.87768 21.9749 11.1902 21.9695 12.5455C21.9534 15.2134 20.9061 17.7125 19.0204 19.5821Z" fill="#4C4C4C"/>
</svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-event-blue transition-colors">
                <div className="w-8 h-8 bg-event-blue rounded-full flex items-center justify-center border border-green-200">
                  <span className="text-white text-sm font-semibold">D</span>
                </div>
                <span className="font-sans font-bold">Daniel</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-event-blue  font-sans text-white font-sans  px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-md font-semibold"
            >
              Logout
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

          {/* Right Section - Profile Icons */}
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-600 hover:text-event-blue transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 bg-event-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">D</span>
            </div>
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
                  <span className="text-sm font-medium">{selectedLocation || 'Select Location'}</span>
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

            {/* Mobile Profile Section */}
            <div className="px-4 space-y-2">
              <div className="flex items-center space-x-3 py-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-event-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">D</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Daniel</p>
                  <p className="text-sm text-gray-500">daniel@example.com</p>
                </div>
              </div>

              <button className="block w-full text-left py-3 text-gray-700 hover:text-event-blue transition-colors font-medium">
                Profile Settings
              </button>

              <button className="block w-full text-left py-3 text-gray-700 hover:text-event-blue transition-colors font-medium">
                Notifications
              </button>

              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left py-3 text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                Logout
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
    </header>
  )
}