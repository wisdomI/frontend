'use client'

import { useState } from 'react'
import InvoiceReceipt from '@/components/ui/InvoiceReceipt'
import { Invoice } from '@/types/api'

export default function BookingForm() {
  const [showReceipt, setShowReceipt] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate booking completion
    setBookingComplete(true)
    setShowReceipt(true)
  }

  // Mock booking data for receipt
  const mockBookingReceipt: Invoice = {
    id: 'booking-001',
    invoiceNumber: 'BK-2025-001',
    userId: 'user-123',
    clientEmail: 'client@example.com',
    clientName: 'John Doe',
    dueDate: new Date().toISOString(),
    paymentPattern: 'full_upfront',
    items: [
      { description: 'Event Planning Service', quantity: 1, amount: 500, total: 500 },
      { description: 'Platform Fee', quantity: 1, amount: 25, total: 25 }
    ],
    subtotal: 525,
    discount: 0,
    total: 525,
    status: 'paid',
    notes: 'Booking completed successfully',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (showReceipt) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Your booking has been successfully completed.</p>
        </div>
        
        <InvoiceReceipt data={mockBookingReceipt} type="invoice" showActions={true} />
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setShowReceipt(false)}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Book Another Service
          </button>
          <button
            onClick={() => window.location.href = '/client/dashboard'}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
          Event Type
        </label>
        <select
          id="eventType"
          name="eventType"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue"
        >
          <option value="">Select event type</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate Event</option>
          <option value="birthday">Birthday Party</option>
          <option value="anniversary">Anniversary</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          id="guests"
          name="guests"
          placeholder="e.g., 100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue"
        />
      </div>
      
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Event Duration
        </label>
        <select
          id="duration"
          name="duration"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue"
        >
          <option value="">Select duration</option>
          <option value="2-4">2-4 hours</option>
          <option value="4-6">4-6 hours</option>
          <option value="6-8">6-8 hours</option>
          <option value="full-day">Full day</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Event Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Enter venue address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue"
        />
      </div>
      
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          rows={3}
          placeholder="Any special requirements or requests..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Booking Summary</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Service Fee:</span>
            <span>$500</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee:</span>
            <span>$25</span>
          </div>
          <div className="flex justify-between font-medium border-t pt-2">
            <span>Total:</span>
            <span>$525</span>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        onClick={handleBookingSubmit}
        className="w-full bg-event-blue text-white py-3 px-4 rounded-lg hover:bg-event-blue-hover font-medium transition-colors"
      >
        Book Now
      </button>
    </form>
  )
}