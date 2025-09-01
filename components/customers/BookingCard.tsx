'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Star } from 'lucide-react';
import { BookingData } from '@/data/mockBookings';
import BookingDetailModal from '@/components/ui/modal/BookingDetailModal';

interface BookingCardProps {
  booking: BookingData;
  onViewProgress?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewProgress }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'In Progress':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Completed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'Cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Awaiting Payment':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600';
      case 'In Progress':
        return 'text-green-600';
      case 'Completed':
        return 'text-gray-600';
      case 'Cancelled':
        return 'text-red-600';
      case 'Awaiting Payment':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Event Image */}
        <div className="flex-shrink-0">
          <img
            src={booking.image}
            alt={booking.eventTitle}
            className="w-32 h-24 object-cover rounded-lg"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            {/* Vendor Info */}
            <div className="flex items-center gap-3">
              <img
                src={booking.vendorImage}
                alt={booking.vendorName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{booking.vendorName}</h3>
                  {booking.verified && (
                    <span className="bg-event-blue text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{booking.eventTitle}</p>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Total Visit</span>
              <div className="bg-event-blue text-white px-3 py-1 rounded-full flex items-center gap-1">
                <span className="text-sm">✓</span>
                <span className="font-semibold">{booking.totalVisit}</span>
              </div>
              <span className="text-sm text-gray-500">Accepted {booking.acceptedHours}</span>
              <div className="flex gap-2">
                <button className="p-2 bg-event-blue text-white rounded-lg hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Event Type</span>
                <span className="text-sm text-gray-900">{booking.eventType}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Event Date</span>
                <span className="text-sm text-gray-900">{booking.eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Event Location</span>
                <span className="text-sm text-gray-900">{booking.eventLocation}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">No of Guests</span>
                <span className="text-sm text-gray-900">{booking.numberOfGuests}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Services Needed</span>
                <span className="text-sm text-gray-900">{booking.servicesNeeded.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Budget</span>
                <span className="text-sm text-gray-900">{booking.budget}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Additional Information</p>
            <p className="text-sm text-gray-900">{booking.additionalInfo}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <span className={getStatusBadge(booking.status)}>
              {booking.status}
              {booking.progressUpdate?.hasUpdate && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {booking.progressUpdate.message}
                </span>
              )}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                {booking.status === 'In Progress' ? 'View Progress Tracker' : 'View Tracker'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={booking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BookingCard;