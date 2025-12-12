'use client'

import { FC, memo } from 'react'
import { FaStar } from 'react-icons/fa'
import Image from 'next/image'

interface ServiceRequestCardProps {
  id?: number
  status?: string
  clientName: string
  clientAvatar: string
  eventTitle: string
  rating: number
  totalBookings: number
  sentTime: string
  eventType: string
  eventDate: string
  eventLocation: string
  guests: number
  servicesNeeded: string
  budget: string
  additionalInfo?: string
  onReject: () => void
  onAccept: () => void
  onCounterOffer?: () => void
}

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
  id,
  status,
  clientName,
  clientAvatar,
  eventTitle,
  rating,
  totalBookings,
  sentTime,
  eventType,
  eventDate,
  eventLocation,
  guests,
  servicesNeeded,
  budget,
  additionalInfo,
  onReject,
  onAccept,
  onCounterOffer,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        {/* Client Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src={clientAvatar || '/images/avatar1.jpg'}
              alt={clientName}
              fill
              sizes="48px"
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="text-event-blue font-semibold text-lg underline">
              {clientName}
            </h3>
          </div>
        </div>
        
        {/* Sent Time */}
        <div className="text-sm text-gray-500">
          {sentTime}
        </div>
      </div>

      {/* Event Title */}
      <div className="mb-4">
        <h2 className="font-bold text-xl text-event-blue mb-2">
          {eventTitle}
        </h2>
        
        {/* Rating and Bookings */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{totalBookings} Total Bookings - Rating:</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={14}
                className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-4"></div>

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-gray-700">Event Type:</span>
          <span className="text-sm text-gray-600 text-right">{eventType}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-gray-700">Event Date:</span>
          <span className="text-sm text-gray-600 text-right">{eventDate}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-gray-700">Event Location:</span>
          <span className="text-sm text-gray-600 text-right">{eventLocation}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-gray-700">No. of Guests:</span>
          <span className="text-sm text-gray-600 text-right">{guests}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-gray-700">Services Needed:</span>
          <span className="text-sm text-gray-600 text-right">{servicesNeeded}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-gray-700">Budget:</span>
          <span className="text-sm font-bold text-blue-600 text-right">{budget}</span>
        </div>
        
        {additionalInfo && (
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-700">Additional Info.:</span>
            <span className="text-sm text-gray-600 text-right">{additionalInfo}</span>
          </div>
        )}
      </div>

      {/* Action Buttons - Only show for pending requests */}
      {(status === 'pending' || status === 'active') && (
        <div className="flex gap-3">
          <button
            onClick={() => {
              console.log('🔍 Reject button clicked for request:', id)
              onReject()
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-500 text-red-500 py-3 px-4 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            <span className="text-lg">✕</span>
            <span>Reject Offer</span>
          </button>
          
          <button
            onClick={() => {
              console.log('🔍 Accept button clicked for request:', id)
              onAccept()
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-event-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-event-blue-hover transition-colors"
          >
            <span className="text-lg">•</span>
            <span>Accept Offer</span>
          </button>
          
          {onCounterOffer && (
            <button
              onClick={() => {
                console.log('🔍 Counter Offer button clicked for request:', id)
                onCounterOffer()
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              <span className="text-lg">📋</span>
              <span>Counter Offer</span>
            </button>
          )}
        </div>
      )}

      {/* Status indicators for non-pending requests */}
      {status === 'rejected' && (
        <div className="flex items-center justify-center py-3 px-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600 font-semibold">✕ Offer Rejected</span>
        </div>
      )}

      {status === 'accepted' && (
        <div className="flex items-center justify-center py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-600 font-semibold">✓ Offer Accepted</span>
        </div>
      )}
    </div>
  )
}

// OPTIMIZED: Memoize component to prevent re-renders when parent re-renders with same props
export default memo(ServiceRequestCard)
