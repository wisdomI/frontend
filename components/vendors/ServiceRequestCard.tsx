import { FC } from 'react'
import { FaStar, FaEye } from 'react-icons/fa'
import client from '../../public/images/client.png'
import Image from 'next/image'

interface ServiceRequestCardProps {
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
}

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
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
          <span className="text-sm text-gray-500">{sentTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg font-asul">{eventTitle}</p>
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

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          // onClick={onReject}
          className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50"
        >
          ✕ Reject Offer
        </button>
        <button
          // onClick={onAccept}
          className="flex-1 flex items-center gap-1 justify-center bg-event-blue text-white py-2 rounded-lg font-semibold hover:bg-event-blue-dark"
        >
          <FaEye /> Accept Offer
        </button>
      </div>
    </div>
  )
}

export default ServiceRequestCard
