'use client'

import { useState } from 'react'
import { FiEye, FiMessageCircle, FiTrash2, FiCalendar, FiMapPin, FiUsers, FiClock, FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import Image from 'next/image'
import ClientPageHeader from '@/components/client/ClientPageHeader'

interface Booking {
  id: number
  eventName: string
  vendorName: string
  vendorLogo: string
  eventImage: string
  eventType: string
  eventDate: string
  eventLocation: string
  numberOfGuests: number
  servicesNeeded: string[]
  budget: string
  additionalInfo: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  totalVisits: number
  acceptedTime: string
  lastUpdated?: string
  hasNewUpdate?: boolean
}

export default function ManageBookingsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed' | 'cancelled'>('pending')
  const [showProgressTracker, setShowProgressTracker] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const bookings: Booking[] = [
    {
      id: 1,
      eventName: "Baby Linda's Birthday Party",
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/vendor-img1.jpg",
      eventImage: "/images/party-setup.jpg",
      eventType: "Social Event (Wedding, Birthday)",
      eventDate: "12th May, 2025",
      eventLocation: "Surulere, Lagos State",
      numberOfGuests: 14,
      servicesNeeded: ["Small Chop Vendors", "Cake Bakers"],
      budget: "N100,000 - N200,000",
      additionalInfo: "We need milky flavoured cake and some Cherry as toppings",
      status: 'pending',
      totalVisits: 120,
      acceptedTime: "Accepted 17 hours ago"
    },
    {
      id: 2,
      eventName: "Baby Linda's Birthday Party",
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/vendor-img1.jpg",
      eventImage: "/images/party-setup.jpg",
      eventType: "Social Event (Wedding, Birthday)",
      eventDate: "12th May, 2025",
      eventLocation: "Surulere, Lagos State",
      numberOfGuests: 14,
      servicesNeeded: ["Small Chop Vendors", "Cake Bakers"],
      budget: "N100,000 - N200,000",
      additionalInfo: "We need milky flavoured cake and some Cherry as toppings",
      status: 'active',
      totalVisits: 120,
      acceptedTime: "Accepted 17 hours ago",
      lastUpdated: "Updated 17 hours ago",
      hasNewUpdate: true
    },
    {
      id: 3,
      eventName: "Baby Linda's Birthday Party",
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/vendor-img1.jpg",
      eventImage: "/images/party-setup.jpg",
      eventType: "Social Event (Wedding, Birthday)",
      eventDate: "12th May, 2025",
      eventLocation: "Surulere, Lagos State",
      numberOfGuests: 14,
      servicesNeeded: ["Small Chop Vendors", "Cake Bakers"],
      budget: "N100,000 - N200,000",
      additionalInfo: "We need milky flavoured cake and some Cherry as toppings",
      status: 'completed',
      totalVisits: 120,
      acceptedTime: "Accepted 17 hours ago"
    },
    {
      id: 4,
      eventName: "Baby Linda's Birthday Party",
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/vendor-img1.jpg",
      eventImage: "/images/party-setup.jpg",
      eventType: "Social Event (Wedding, Birthday)",
      eventDate: "12th May, 2025",
      eventLocation: "Surulere, Lagos State",
      numberOfGuests: 14,
      servicesNeeded: ["Small Chop Vendors", "Cake Bakers"],
      budget: "N100,000 - N200,000",
      additionalInfo: "We need milky flavoured cake and some Cherry as toppings",
      status: 'cancelled',
      totalVisits: 120,
      acceptedTime: "Accepted 17 hours ago"
    }
  ]

  const filteredBookings = bookings.filter(booking => booking.status === activeTab)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Status Awaiting Payment'
      case 'active':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const handleViewProgressTracker = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowProgressTracker(true)
  }

  const handleCloseProgressTracker = () => {
    setShowProgressTracker(false)
    setSelectedBooking(null)
  }

  if (showProgressTracker && selectedBooking) {
    return <ProgressTracker booking={selectedBooking} onClose={handleCloseProgressTracker} />
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <ClientPageHeader
        breadcrumbs={[
          { label: 'My Account' },
          { label: 'Manage Bookings' },
          { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1), isActive: true }
        ]}
        title="Manage Bookings"
      />

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {[
              { key: 'pending', label: 'Pending' },
              { key: 'active', label: 'Active' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-event-blue text-event-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Booking Cards */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
              {/* Left Column - Image and Status */}
              <div className="w-full lg:w-1/3 flex-shrink-0">
                {/* Event Image */}
                <div className="w-full h-24 sm:h-32 lg:h-40 xl:h-48 bg-gray-200 rounded-lg mb-3 sm:mb-4 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={booking.eventImage}
                    alt={booking.eventName}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  {/* Image carousel dots */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <div className={`inline-flex items-center px-2 py-1 sm:px-3 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </div>
                  
                  <button 
                    onClick={() => handleViewProgressTracker(booking)}
                    className="w-full flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors text-xs sm:text-sm"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="hidden sm:inline">View Progress Tracker</span>
                    <span className="sm:hidden">Progress</span>
                    {booking.hasNewUpdate && (
                      <span className="bg-red-500 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded-full">New</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column - Event Details */}
              <div className="flex-1">
                {/* Vendor Info and Actions */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={booking.vendorLogo}
                        alt={booking.vendorName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{booking.vendorName}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <FiEye className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span>Visit: {booking.totalVisits}</span>
                        </span>
                        <span className="text-xs">{booking.acceptedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <FiMessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                    <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Event Title */}
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{booking.eventName}</h2>

                {/* Event Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 w-16 sm:w-24 text-left">Type:</span>
                    <span className="text-xs sm:text-sm text-gray-600">{booking.eventType}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 w-16 sm:w-24 text-left">Date:</span>
                    <span className="text-xs sm:text-sm text-gray-600">{booking.eventDate}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 w-16 sm:w-24 text-left">Location:</span>
                    <span className="text-xs sm:text-sm text-gray-600">{booking.eventLocation}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 w-16 sm:w-24 text-left">Guests:</span>
                    <span className="text-xs sm:text-sm text-gray-600">{booking.numberOfGuests}</span>
                  </div>
                </div>

                {/* Services Needed */}
                <div className="mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Services:</span>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                    {booking.servicesNeeded.map((service, index) => (
                      <span key={index} className="inline-flex items-center px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {service}
                        <button className="ml-1 hover:text-blue-600">
                          <FiX className="w-2 h-2 sm:w-3 sm:h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Budget:</span>
                  <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">{booking.budget}</span>
                </div>

                {/* Additional Information */}
                <div className="mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Additional:</span>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{booking.additionalInfo}</p>
                </div>

                {/* Reviews Section for Completed Bookings */}
                {booking.status === 'completed' && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Reviews and Ratings</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">
                      Working with {booking.vendorName} on their {booking.eventType.toLowerCase()} was a smooth and rewarding experience. 
                      Communication was clear, timelines were respected, and expectations were well managed from start to finish. 
                      I appreciate the professionalism and prompt feedback, which made it easy to deliver exactly what was needed. 
                      Looking forward to working together again in the future!
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">Excellent</span>
                      </div>
                      <button className="px-3 sm:px-4 py-1 sm:py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors text-xs sm:text-sm">
                        Leave a Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <p className="text-xs sm:text-sm text-gray-700">Showing 1-10 of 20</p>
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
          <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
            &lt; Prev
          </button>
          <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-event-blue text-white rounded-lg">1</button>
          <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">2</button>
          <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">3</button>
          <span className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hidden sm:block">...</span>
          <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">7</button>
          <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">10</button>
          <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  )
}

// Progress Tracker Component
function ProgressTracker({ booking, onClose }: { booking: Booking, onClose: () => void }) {
  const [currentWeek, setCurrentWeek] = useState(1)

  const tasks = [
    { name: 'Planning', status: 'completed', week: 1 },
    { name: 'Design and Preparation', status: 'completed', week: 2 },
    { name: 'Small Chops Making', status: 'in-progress', week: 3 },
    { name: 'Cake Baking', status: 'pending', week: 4 },
    { name: 'Final Review and Delivery', status: 'pending', week: 4 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-gray-300'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <span className="text-blue-600">My Account</span>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-blue-600">Manage Bookings</span>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-blue-600 capitalize">{booking.status}</span>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-gray-900">View Progress Tracker</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-medium ${
            booking.status === 'active' ? 'text-green-600' : 
            booking.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
          }`}>
            Status: {getStatusText(booking.status)}
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Event Image */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <div className="w-full h-32 sm:h-40 lg:h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <Image
                src={booking.eventImage}
                alt={booking.eventName}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
              {/* Image carousel dots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={booking.vendorLogo}
                  alt={booking.vendorName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">{booking.vendorName}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{booking.lastUpdated || booking.acceptedTime}</p>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{booking.eventName}</h2>

            <div className="flex items-center space-x-4">
              <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                <FiMessageCircle className="w-4 h-4" />
              </button>
              <button className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Project Duration */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Project Duration - 12th July, 2025 - 30th July, 2025</h3>
        </div>
      </div>

      {/* Task Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Breakdown</h3>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map(week => (
              <div key={week} className="text-center">
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentWeek === week ? 'bg-event-blue text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  Week {week}
                </div>
                <div className="text-xs text-gray-500 mt-1">12/07/2025</div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentWeek(Math.min(4, currentWeek + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-32 sm:w-40 text-sm font-medium text-gray-900">
                {task.name}
              </div>
              <div className="flex-1 flex space-x-2">
                {[1, 2, 3, 4].map(week => (
                  <div key={week} className="flex-1 h-8 rounded-lg flex items-center justify-center">
                    {task.week === week && (
                      <div className={`w-full h-full rounded-lg flex items-center justify-center text-xs font-medium text-white ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}