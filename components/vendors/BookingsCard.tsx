import { FC } from 'react'
import { FaStar, FaEye } from 'react-icons/fa'
import client from '../../public/images/client.png'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { MessageOutlined } from '@ant-design/icons'
import { VscMilestone } from 'react-icons/vsc'
import { MdSupportAgent } from 'react-icons/md'


interface BookingsCardProps {
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
  completed?:boolean
}

const BookingsCard: FC<BookingsCardProps> = ({
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
  completed
}) => {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
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
          <div className="flex items-center gap-3">
            <Button className={`flex items-center p-1 gap-2 text-event-blue ${completed ? "bg-white text-blue-700 border border-event-blue" : "bg-event-blue text-white"}`}>
              <VscMilestone width="24" height="24" className={`${completed ? "text-event-blue"  : "text-white"}`}/>
              {completed
                ? 'View progress tracker'
                : 'Create progress tracker'}
            </Button>
            <p
              className={`border ${completed ? 'border-gray-500 text-gray-500' : 'border-green-600 text-green-600'}  p-1 px-2 font-medium rounded-md`}
            >
              In progress
            </p>
            <div className="p-2 py-1 bg-event-blue rounded-lg">
              <MessageOutlined
                style={{
                  fontSize: 18,
                  color: '#fff',
                }}
              />
            </div>
            <div className="p-1 bg-[#FEC240] rounded-lg">
              <MdSupportAgent className="text-black text-2xl" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">{eventTitle}</p>
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
    </div>
  )
}

export default BookingsCard
