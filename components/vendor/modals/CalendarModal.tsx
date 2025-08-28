'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState('July, 2025');
  const [selectedDates, setSelectedDates] = useState<number[]>([11, 17]);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Generate calendar days for July 2025
  const calendarDays = [
    27, 28, 29, 30, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31
  ];

  const toggleDate = (date: number) => {
    if (date < 1 || date > 31) return; // Only allow current month dates
    
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const isSelected = (date: number) => selectedDates.includes(date);
  const isCurrentMonth = (date: number) => date >= 1 && date <= 31;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">{currentMonth}</span>
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                onClick={() => toggleDate(date)}
                className={`
                  aspect-square flex items-center justify-center text-sm font-medium rounded-full transition-colors
                  ${!isCurrentMonth(date) 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : isSelected(date)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                disabled={!isCurrentMonth(date)}
              >
                {date}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;