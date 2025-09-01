'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectMenuItem } from '@/store/dashboardSlice';
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext';
import BookingCard from '@/components/customers/BookingCard';
import ProgressTrackerModal from '@/components/customers/ProgressTrackerModal';
import { mockBookings, BookingData } from '@/data/mockBookings';

export default function ManageBookingsPage() {
  const [bookings] = useState<BookingData[]>(mockBookings);
  const [activeTab, setActiveTab] = useState<'Pending' | 'In Progress' | 'Completed' | 'Cancelled'>('Pending');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { showNotification } = useNotificationBreadcrumb();

  useEffect(() => {
    dispatch(
      selectMenuItem({
        view: 'bookings',
        breadcrumb: { label: 'Manage Bookings', path: '/dashboard/bookings' },
      })
    );

    if (showNotification) {
      showNotification({
        message: "Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.",
        type: "info",
        icon: "shield",
        dismissible: true,
        autoHide: false,
      });
    }
  }, [dispatch, showNotification]);

  const filteredBookings = bookings.filter(booking => booking.status === activeTab);

  const handleViewProgress = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsProgressModalOpen(true);
  };

  const tabs = [
    { key: 'Pending' as const, label: 'Pending', count: bookings.filter(b => b.status === 'Pending').length },
    { key: 'In Progress' as const, label: 'In Progress', count: bookings.filter(b => b.status === 'In Progress').length },
    { key: 'Completed' as const, label: 'Completed', count: bookings.filter(b => b.status === 'Completed').length },
    { key: 'Cancelled' as const, label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Page Header */}
      <h1 className="text-[20px] font-semibold font-heading text-gray-900 mb-6">Manage Bookings</h1>
      
      {/* Tab Navigation */}
      <div className="bg-event-blue rounded-lg p-3 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-event-blue'
                  : 'text-white hover:bg-blue-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewProgress={() => handleViewProgress(booking)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab.toLowerCase()} bookings</h3>
            <p className="text-gray-500">
              {activeTab === 'Pending' && "No pending bookings at the moment."}
              {activeTab === 'In Progress' && "No active bookings at the moment."}
              {activeTab === 'Completed' && "No completed bookings yet."}
              {activeTab === 'Cancelled' && "No cancelled bookings."}
            </p>
          </div>
        )}
      </div>

      {/* Progress Tracker Modal */}
      {selectedBooking && (
        <ProgressTrackerModal
          isOpen={isProgressModalOpen}
          onClose={() => setIsProgressModalOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
}