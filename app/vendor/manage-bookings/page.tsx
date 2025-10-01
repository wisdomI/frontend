'use client'

import { useState } from 'react'
import FilterCard from '@/components/vendors/FilterCard'
import CreateProgressTrackerModal from '@/components/vendors/CreateProgressTrackerModal'
import { FiFilter, FiPlus, FiCheck } from 'react-icons/fi'
import { MessageOutlined } from '@ant-design/icons'
import client from '../../../public/images/client.png'
import Image from 'next/image'

export default function ManageBookingsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [showFilter, setShowFilter] = useState(false)
  const [showProgressTrackerModal, setShowProgressTrackerModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  const bookingsData = [
    {
      id: 1,
      status: 'active',
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      amount: '₦199,000',
      additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
      hasProgressTracker: false,
    },
    {
      id: 2,
      status: 'active',
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      amount: '₦199,000',
      additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
      hasProgressTracker: true,
    },
    {
      id: 3,
      status: 'active',
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      amount: '₦199,000',
      additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
      hasProgressTracker: false,
    },
    {
      id: 4,
      status: 'completed',
      clientName: 'Amaka Obi',
      clientAvatar: '/images/avatar2.jpg',
      eventTitle: 'Traditional Wedding Reception',
      eventType: 'Wedding Ceremony',
      eventDate: '22nd June, 2025',
      eventLocation: 'Enugu, Enugu State',
      guests: 150,
      servicesNeeded: 'Full Catering, Live Band, Decor',
      amount: '₦1,200,000',
      additionalInfo: 'Decor should be traditional Igbo style with palm wine service.',
      hasProgressTracker: true,
    },
  ]

  const filteredBookings = bookingsData.filter(booking => {
    if (activeTab === 'active') return booking.status === 'active'
    if (activeTab === 'completed') return booking.status === 'completed'
    return true
  })

  const handleCreateProgressTracker = (booking: any) => {
    setSelectedBooking(booking)
    setShowProgressTrackerModal(true)
  }

  const handleCloseProgressTracker = () => {
    setShowProgressTrackerModal(false)
    setSelectedBooking(null)
  }

  const handleSubmitProgressTracker = (tasks: any[]) => {
    console.log('Progress tracker created for booking:', selectedBooking, 'with tasks:', tasks)
    // Here you would typically save the progress tracker to your backend
  }

  const tabs = [
    { id: 'active', label: 'Active Bookings', count: bookingsData.filter(b => b.status === 'active').length },
    { id: 'completed', label: 'Completed Bookings', count: bookingsData.filter(b => b.status === 'completed').length },
  ]

  return (
    <div>
      {/* Header with Filter Toggle */}
      <div className="flex items-center justify-between p-3 sm:p-4 py-2 pt-3 sm:pt-4">
        <h2 className="font-bold text-lg sm:text-2xl lg:text-3xl text-gray-600">
          Manage Bookings
        </h2>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="lg:hidden flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors"
          aria-label={showFilter ? "Hide filter" : "Show filter"}
        >
          <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium">
            {showFilter ? 'Hide Filter' : 'Show Filter'}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-3 sm:px-4 pb-2">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-event-blue text-event-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full p-4 gap-4">
        {/* Bookings list */}
        <div className="flex flex-col gap-3 flex-1 max-h-[calc(100vh-180px)] overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-event-blue scrollbar-thumb-rounded-full hover:scrollbar-thumb-event-blue-hover lg:scrollbar lg:scrollbar-thin lg:scrollbar-track-gray-100 lg:scrollbar-thumb-event-blue lg:scrollbar-thumb-rounded-full lg:hover:scrollbar-thumb-event-blue-hover">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white border rounded-xl p-4 shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-4 pb-2">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src={client}
                alt={booking.clientName}
                fill
                sizes="40px"
                className="object-cover w-full h-full rounded-full border-[3px] border-green-600"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-event-blue font-semibold underline">
                {booking.clientName}
              </h3>
              <p className="font-bold text-lg text-event-blue">{booking.eventTitle}</p>
            </div>
          </div>
          
          {/* Action buttons and icons - responsive layout */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-2">
            {/* Primary buttons row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleCreateProgressTracker(booking)}
                className="bg-event-blue text-white px-3 py-2 sm:px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-event-blue-hover text-sm sm:text-base"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Progress Tracker</span>
                <span className="sm:hidden">Create Tracker</span>
              </button>
              
              <button className="flex items-center justify-center gap-2 bg-green-500 text-white px-3 py-2 sm:px-4 rounded-lg font-semibold text-sm sm:text-base">
                <FiCheck className="w-4 h-4" />
                In Progress
              </button>
            </div>
            
            {/* Icon buttons row */}
            <div className="flex items-center justify-center gap-2">
              <button className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors bg-event-blue">
                <MessageOutlined className="w-4 h-4 text-white" />
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-yellow-400">
                <Image src="/images/VendorHelp&Support-active.svg" alt="Help & Support" width={16} height={16} className="w-4 h-4 brightness-0" />
              </button>
            </div>
          </div>
        </div>
                </div>
                <div className="h-[1.5px] bg-event-blue w-full"></div>

                {/* Event Details */}
                <div className="text-sm text-gray-600 space-y-1 py-2 pb-4">
                  <p className="flex justify-between">
                    <span className="font-medium">Event Type:</span> {booking.eventType}
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Event Date:</span> {booking.eventDate}
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Event Location:</span> {booking.eventLocation}
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">No. of Guests:</span> {booking.guests}
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Services Needed:</span> {booking.servicesNeeded}
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Amount:</span>{' '}
                    <span className="text-event-blue font-bold">{booking.amount}</span>
                  </p>
                  {booking.additionalInfo && (
                    <p className="flex justify-between">
                      <span className="font-medium">Additional Info.:</span>{' '}
                      {booking.additionalInfo}
                    </p>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium mb-2">No {activeTab} bookings</h3>
              <p className="text-sm">There are currently no {activeTab} bookings.</p>
            </div>
          )}
        </div>

        {/* Responsive filter sidebar */}
        <div className={`lg:sticky lg:top-20 w-full lg:w-auto transition-all duration-300 ${
          showFilter ? 'block' : 'hidden lg:block'
        }`}>
          <FilterCard />
        </div>

        {/* Modal overlay for mobile filter */}
        {showFilter && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filter"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <FilterCard />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Progress Tracker Modal */}
      <CreateProgressTrackerModal
        isOpen={showProgressTrackerModal}
        onClose={handleCloseProgressTracker}
        onSubmit={handleSubmitProgressTracker}
      />
    </div>
  )
}