import { BookingData } from '@/data/mockBookings';
import Image from 'next/image';
import { MessageCircle, FileText } from 'lucide-react';

interface PendingBookingCardProps {
  booking: BookingData;
}

export default function PendingBookingCard({ booking }: PendingBookingCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
      {/* Action Icons (Top-Right) */}
      <div className="absolute top-6 right-6 flex gap-2">
        <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
          <MessageCircle size={20} />
        </button>
        <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
          <FileText size={20} />
        </button>
      </div>

      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Event Image */}
          <div className="relative w-48 h-32 rounded-xl overflow-hidden">
            <Image
              src={booking.image}
              alt={booking.eventTitle}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Vendor Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                <Image
                  src={booking.vendorLogo}
                  alt={booking.vendorName}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 underline">
                {booking.vendorName}
              </h3>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {booking.eventTitle}
            </h2>
            <div className="w-full h-0.5 bg-blue-600 mb-4"></div>
          </div>
        </div>
        
        {/* Right Side Info */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-sm text-gray-600">Total Visit</span>
            <div className="flex items-center gap-2 justify-end">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Left Column (Larger Span) */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Status</span>
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-md text-sm font-medium">
              Awaiting Payment
            </span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <span className="text-xs">📊</span>
            View Progress Tracker
          </button>
        </div>

        {/* Right Column (Event Details) */}
        <div className="space-y-4">
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
      </div>

      {/* Services Needed */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-gray-600">Services Needed:</span>
        <div className="flex gap-2">
          {booking.servicesNeeded.map((service, index) => (
            <span
              key={index}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {service}
              <button className="text-white hover:text-gray-200">×</button>
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
  );
}