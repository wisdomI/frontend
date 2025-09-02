import { BookingData } from '@/data/mockBookings';
import Image from 'next/image';
import { MessageCircle, FileText } from 'lucide-react';

interface PendingBookingCardProps {
  booking: BookingData;
}

export default function PendingBookingCard({ booking }: PendingBookingCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative">
      {/* Action Icons (Top-Right) */}
     

      {/* Top Section */}
      <div className="flex gap-6">
        {/* Left: Event Image + Status + Progress */}
        <div className="flex flex-col items-start gap-4">
          <div className="relative w-48 h-32 rounded-xl overflow-hidden">
            <Image
              src={booking.image}
              alt={booking.eventTitle}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-600">Status</span>
            <span className="bg-yellow text-black px-3 py-1 rounded-md text-sm font-medium">
              Awaiting Payment
            </span>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            View Progress Tracker
          </button>
        </div>

        {/* Right: Vendor Info + Event Title + Meta */}
        <div className="flex-1">
          {/* Vendor */}
          <div className="flex items-center  w-full  justify-between gap-6 mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
              <Image
                src={booking.vendorLogo}
                alt={booking.vendorName}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className='flex  items-center'>
            <h3 className="text-lg font-semibold text-blue-800 underline">
              {booking.vendorName}
            </h3>
            <div className="flex justify-between items-center gap-6">
            <div className="text-right">
              <span className="text-sm text-gray-600">Total Visit</span>
              <div className="flex items-center gap-2 justify-end">
                <div className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">✓</span>
                  </span>
                  {booking.totalVisit}
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Accepted {booking.acceptedHours}</div>
            </div>
          </div>
          </div>
          </div>
          {/* Event Title */}
          <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {booking.eventTitle}
          </h2>
          <div className="flex gap-2">
        <button className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
          <MessageCircle size={20} />
        </button>
        <button className="w-10 h-10  rounded-full flex items-center justify-center text-red-500  transition-colors">
          <FileText size={20} />
        </button>
      </div>
          </div>
          
          <div className="w-full h-0.5 bg-blue-600 mb-4"></div>

          {/* Meta Info */}
         
           {/* Event Details */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Event Type:</span>
          <span className="text-gray-900">{booking.eventType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Event Date:</span>
          <span className="text-gray-900">{booking.eventDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Event Location:</span>
          <span className="text-gray-900">{booking.eventLocation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">No. of Guests:</span>
          <span className="text-gray-900">{booking.numberOfGuests}</span>
        </div>
      </div>

      {/* Services Needed */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-gray-600">Services Needed:</span>
        <div className="flex gap-2 flex-wrap justify-end">
          {booking.servicesNeeded.map((service, index) => (
            <span
              key={index}
              className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mt-4 flex justify-between">
        <span className="text-gray-600">Budget:</span>
        <span className="text-gray-900 font-medium">{booking.budget}</span>
      </div>

      {/* Additional Information */}
      <div className="mt-4 flex justify-between items-start">
        <span className="text-gray-600">Additional Information</span>
        <div className="text-right max-w-md">
          <p className="text-gray-900 text-sm">{booking.additionalInfo}</p>
        </div>
      </div>
        </div>
        
      </div>

     
    </div>
  );
}
