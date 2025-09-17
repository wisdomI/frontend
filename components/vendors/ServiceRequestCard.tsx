'use client'

import { FC } from 'react'
import { FaStar, FaEye } from 'react-icons/fa'
import client from '../../public/images/client.png'
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
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src={client}
                alt={clientName}
                fill
                className="object-cover w-full h-full rounded-full border-[3px] border-green-600"
              />
            </div>
            <h3 className="text-event-blue font-semibold underline">
              {clientName}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {status === 'rejected' && (
              <>
                <span className="text-sm text-red-500 font-medium">Rejected 20/07/25</span>
                <button className="bg-white border border-red-500 text-red-500 px-3 py-1 rounded text-sm font-medium">
                  ✕ Rejected
                </button>
              </>
            )}
            {status === 'accepted' && (
              <>
                <span className="text-sm text-green-500 font-medium">Accepted 20/07/25</span>
                <button className="bg-white border border-green-500 text-green-500 px-3 py-1 rounded text-sm font-medium">
                  ✓ Accepted
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg text-event-blue">{eventTitle}</p>
          <div className="flex flex-col gap-1 text-right">
            {/* Rating */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              {totalBookings} Total Bookings - Rating:&nbsp;
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
        </div>
      </div>
      <div className="h-[1.5px] bg-event-blue w-full"></div>

      {/* Event Details */}
      <div className="text-sm text-gray-600 space-y-1 py-2 pb-4">
        <p className="flex justify-between">
          <span className="font-medium">Event Type:</span> {eventType}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Event Date:</span> {eventDate}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Event Location:</span> {eventLocation}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">No. of Guests:</span> {guests}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Services Needed:</span> {servicesNeeded}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Budget:</span>{' '}
          <span className="text-event-blue font-bold">{budget}</span>
        </p>
        {additionalInfo && (
          <p className="flex justify-between">
            <span className="font-medium">Additional Info:</span>{' '}
            {additionalInfo}
          </p>
        )}
      </div>

      {/* Action Buttons - Only show for active requests */}
      {status === 'active' && (
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            ✕ Reject Offer
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center gap-1 justify-center bg-event-blue text-white py-2 rounded-lg font-semibold hover:bg-event-blue-hover transition-colors"
          >
            <FaEye /> Accept Offer
          </button>
          {onCounterOffer && (
            <button
              onClick={onCounterOffer}
              className="flex-1 flex items-center gap-1 justify-center bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              📝 Counter Offer
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ServiceRequestCard
