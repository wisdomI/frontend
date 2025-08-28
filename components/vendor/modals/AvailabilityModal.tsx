'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetAvailability: () => void;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ 
  isOpen, 
  onClose, 
  onSetAvailability 
}) => {
  const [currentMonth, setCurrentMonth] = useState('July, 2025');
  
  const availableDates = [
    {
      date: '29th July, 2025',
      day: 'Wednesday',
      times: '9:00 am - 11 am; 2:00 pm - 2:30 pm'
    },
    {
      date: '31th July, 2025',
      day: 'Friday',
      times: '9:00 am - 11 am; 2:00 pm - 2:30 pm'
    }
  ];

  const weekDays = [
    { date: 27, day: 'Mon', available: false },
    { date: 28, day: 'Tue', available: false },
    { date: 29, day: 'Wed', available: true },
    { date: 30, day: 'Thu', available: false },
    { date: 31, day: 'Fri', available: true },
    { date: 1, day: 'Sat', available: false }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">My Availability</h2>
          <button
            onClick={onClose}
            className="bg-event-blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-700">{currentMonth}</h3>
            <div className="flex gap-2">
              <button className="bg-event-blue text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="bg-event-blue text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-2xl ${
                  day.available 
                    ? 'bg-event-blue text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className="text-2xl font-bold mb-1">{day.date}</div>
                <div className="text-sm">{day.day}</div>
              </div>
            ))}
          </div>

          {/* Available Times */}
          <div className="space-y-4 mb-8">
            {availableDates.map((availability, index) => (
              <div key={index} className="border-l-4 border-event-blue pl-4">
                <div className="text-lg font-semibold text-event-blue mb-1">
                  {availability.date} - {availability.day}
                </div>
                <div className="text-gray-600">
                  {availability.times}
                </div>
              </div>
            ))}
          </div>

          {/* Set Availability Button */}
          <button
            onClick={() => {
              onSetAvailability();
              onClose();
            }}
            className="w-full bg-event-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-2xl">+</span>
            Set Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;