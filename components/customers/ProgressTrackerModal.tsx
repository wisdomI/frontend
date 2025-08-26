'use client';

import React from 'react';
import { X, Star, MessageCircle, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingData {
  id: string;
  vendorName: string;
  vendorImage: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  numberOfGuests: number;
  servicesNeeded: string[];
  budget: string;
  additionalInfo: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled';
  totalPaid: string;
  acceptedHours: string;
  image: string;
  verified: boolean;
}

interface ProgressTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingData;
}

interface TaskProgress {
  name: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  week: number;
}

const ProgressTrackerModal: React.FC<ProgressTrackerModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  if (!isOpen) return null;

  const tasks: TaskProgress[] = [
    { name: 'Planning', status: 'Completed', week: 1 },
    { name: 'Design and Preparation', status: 'Completed', week: 2 },
    { name: 'Small Chops Making', status: 'In Progress', week: 3 },
    { name: 'Cake Baking', status: 'Not Started', week: 4 },
    { name: 'Final Review and Delivery', status: 'Not Started', week: 4 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'In Progress':
        return 'bg-yellow text-white';
      case 'Not Started':
        return 'bg-gray-300 text-gray-700';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow';
      case 'Not Started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Progress Tracker</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vendor Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={booking.image}
              alt={booking.eventTitle}
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div className="flex items-center gap-3">
              <img
                src={booking.vendorImage}
                alt={booking.vendorName}
                className="w-12 h-12 rounded-full object-cover"
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
                <p className="text-gray-600">{booking.eventTitle}</p>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <span className="text-sm text-gray-500">Updated {booking.acceptedHours}</span>
              <div className="flex gap-2">
                <button className="p-2 bg-event-blue text-white rounded-lg hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Project Duration */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Project Duration - 12th July, 2025 - 30th July, 2025
            </h4>

            {/* Week Headers */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Task Breakdown</span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Week 1</div>
                  <div className="text-xs text-gray-500">12/07/2025</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Week 2</div>
                  <div className="text-xs text-gray-500">19/07/2025</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Week 3</div>
                  <div className="text-xs text-gray-500">26/07/2025</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Week 4</div>
                  <div className="text-xs text-gray-500">12/07/2025</div>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Timeline */}
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-48 text-sm text-gray-700">{task.name}</div>
                  <div className="flex-1 relative">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((week) => (
                        <div
                          key={week}
                          className={`flex-1 h-8 rounded ${
                            week === task.week
                              ? getProgressBarColor(task.status)
                              : week < task.week && task.status === 'Completed'
                              ? 'bg-green-500'
                              : 'bg-gray-100'
                          }`}
                        />
                      ))}
                    </div>
                    {task.week <= 4 && (
                      <div
                        className={`absolute top-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}
                        style={{
                          left: `${((task.week - 1) / 4) * 100}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {task.status}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackerModal;