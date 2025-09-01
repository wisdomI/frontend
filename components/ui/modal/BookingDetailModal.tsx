'use client';

import React from 'react';
import { X, MessageCircle, FileText, Star, Play } from 'lucide-react';
import { BookingData } from '@/data/mockBookings';
import Image from 'next/image';

interface BookingDetailModalProps {
  booking: BookingData;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
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

  const getButtonText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'View Tracker';
      case 'In Progress':
        return 'View Progress Tracker';
      case 'Completed':
        return 'View Progress Tracker';
      case 'Cancelled':
        return 'View Tracker';
      case 'Awaiting Payment':
        return 'View Progress Tracker';
      default:
        return 'View Tracker';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={booking.image}
                alt={booking.eventTitle}
                width={120}
                height={90}
                className="rounded-lg object-cover"
              />
              {/* Image dots indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Image
                  src={booking.vendorLogo}
                  alt={booking.vendorName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{booking.vendorName}</h2>
                <h3 className="text-lg font-medium text-gray-700">{booking.eventTitle}</h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Total Visit</span>
                <div className="bg-event-blue text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="text-sm">✓</span>
                  <span className="font-semibold">{booking.totalVisit}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Accepted {booking.acceptedHours}</p>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 bg-event-blue text-white rounded-lg hover:bg-blue-700">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <FileText className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status and Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Status</span>
              <span className={getStatusBadge(booking.status)}>
                {booking.status}
                {booking.progressUpdate?.hasUpdate && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {booking.progressUpdate.message}
                  </span>
                )}
              </span>
            </div>
            
            <button className="bg-event-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {getButtonText(booking.status)}
            </button>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Event Type:</span>
              <span className="text-gray-900 font-medium">{booking.eventType}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Event Date:</span>
              <span className="text-gray-900 font-medium">{booking.eventDate}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Event Location:</span>
              <span className="text-gray-900 font-medium">{booking.eventLocation}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">No. of Guests:</span>
              <span className="text-gray-900 font-medium">{booking.numberOfGuests}</span>
            </div>
          </div>

          {/* Services Needed */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Services Needed:</span>
            <div className="flex gap-2">
              {booking.servicesNeeded.map((service, index) => (
                <span
                  key={index}
                  className="bg-event-blue text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {service}
                  <X className="w-3 h-3" />
                </span>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Budget:</span>
            <span className="text-gray-900 font-medium">{booking.budget}</span>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Additional Information</span>
              <p className="text-gray-900 max-w-md text-right">{booking.additionalInfo}</p>
            </div>
          </div>

          {/* Reviews Section - Only show for completed bookings */}
          {booking.status === 'Completed' && booking.review && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Reviews and Ratings</h4>
              
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {booking.review.comment}
                </p>
                
                {/* Review Images */}
                <div className="flex gap-3 mb-4">
                  {booking.review.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      {index === 3 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {renderStars(booking.review.rating)}
                  </div>
                  <span className="text-gray-900 font-semibold">Excellent</span>
                </div>
              </div>
              
              {/* Review CTA */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Over {booking.review.clientsWaiting}k Clients are waiting for your review</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>
                </div>
                <button className="bg-event-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Leave a Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;