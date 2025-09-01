'use client';

import { useState } from 'react';
import { mockBookings, BookingData } from '@/data/mockBookings';
import PendingBookingCard from '@/components/customers/PendingBookingCard';
import ActiveBookingCard from '@/components/customers/ActiveBookingCard';
import CompletedBookingCard from '@/components/customers/CompletedBookingCard';
import CancelledBookingCard from '@/components/customers/CancelledBookingCard';

type BookingStatus = 'Pending' | 'Active' | 'Completed' | 'Cancelled';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('Pending');

  const getFilteredBookings = (status: BookingStatus): BookingData[] => {
    if (status === 'Active') {
      return mockBookings.filter(booking => 
        booking.status === 'In Progress' || booking.status === 'Awaiting Payment'
      );
    }
    return mockBookings.filter(booking => booking.status === status);
  };

  const renderBookingCard = (booking: BookingData) => {
    switch (activeTab) {
      case 'Pending':
        return <PendingBookingCard key={booking.id} booking={booking} />;
      case 'Active':
        return <ActiveBookingCard key={booking.id} booking={booking} />;
      case 'Completed':
        return <CompletedBookingCard key={booking.id} booking={booking} />;
      case 'Cancelled':
        return <CancelledBookingCard key={booking.id} booking={booking} />;
      default:
        return null;
    }
  };

  const tabs: BookingStatus[] = ['Pending', 'Active', 'Completed', 'Cancelled'];
  const filteredBookings = getFilteredBookings(activeTab);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Manage Bookings</h1>
        
        {/* Tab Navigation */}
        <div className="bg-blue-900 rounded-lg p-1 inline-flex w-full ">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3  text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'border-white border-b-2 text-white shadow-sm pb-2'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(renderBookingCard)
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No {activeTab.toLowerCase()} bookings</div>
            <p className="text-gray-500">Your {activeTab.toLowerCase()} bookings will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}