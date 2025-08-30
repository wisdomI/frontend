"use client";

import React, { useState } from "react";
import { Calendar, Clock, User, MapPin, Plus, Edit, Trash2 } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  location: string;
  type: "consultation" | "planning" | "review" | "delivery";
  color: string;
}

const GanttChart: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Wedding Planning Consultation",
      client: "Sarah & John",
      startDate: new Date(2025, 7, 29, 10, 0), // Aug 29, 2025, 10:00 AM
      endDate: new Date(2025, 7, 29, 12, 0),   // Aug 29, 2025, 12:00 PM
      duration: 2,
      status: "scheduled",
      location: "EventHub Office",
      type: "consultation",
      color: "#3B82F6"
    },
    {
      id: "2", 
      title: "Venue Site Visit",
      client: "Corporate Event Co.",
      startDate: new Date(2025, 7, 30, 14, 0), // Aug 30, 2025, 2:00 PM
      endDate: new Date(2025, 7, 30, 16, 30),  // Aug 30, 2025, 4:30 PM
      duration: 2.5,
      status: "scheduled",
      location: "Grand Ballroom",
      type: "planning",
      color: "#10B981"
    },
    {
      id: "3",
      title: "Final Review Meeting",
      client: "Birthday Celebration",
      startDate: new Date(2025, 7, 31, 9, 0),  // Aug 31, 2025, 9:00 AM
      endDate: new Date(2025, 7, 31, 10, 30),  // Aug 31, 2025, 10:30 AM
      duration: 1.5,
      status: "completed",
      location: "Virtual Meeting",
      type: "review",
      color: "#8B5CF6"
    },
    {
      id: "4",
      title: "Event Setup Coordination",
      client: "Tech Conference 2025",
      startDate: new Date(2025, 8, 1, 8, 0),   // Sep 1, 2025, 8:00 AM
      endDate: new Date(2025, 8, 1, 17, 0),    // Sep 1, 2025, 5:00 PM
      duration: 9,
      status: "in-progress",
      location: "Convention Center",
      type: "delivery",
      color: "#F59E0B"
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");

  // Generate time slots for the day view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Generate days for the week view
  const generateWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const timeSlots = generateTimeSlots();
  const weekDays = generateWeekDays();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "consultation": return <User className="w-4 h-4" />;
      case "planning": return <Calendar className="w-4 h-4" />;
      case "review": return <Edit className="w-4 h-4" />;
      case "delivery": return <MapPin className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMeetingsForDay = (date: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.startDate);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const calculatePosition = (meeting: Meeting) => {
    const startHour = meeting.startDate.getHours();
    const startMinute = meeting.startDate.getMinutes();
    const top = ((startHour - 8) * 60 + startMinute) * (60 / 60); // 60px per hour
    const height = meeting.duration * 60; // 60px per hour
    return { top, height };
  };

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Meeting Schedule</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["day", "week", "month"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  viewMode === mode
                    ? "bg-white text-event-blue shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue"
          />
          <button className="bg-event-blue text-white px-4 py-2 rounded-lg hover:bg-event-blue-hover transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </button>
        </div>
      </div>

      {/* Week View Gantt Chart */}
      {viewMode === "week" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header with days */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-gray-50 border-r border-gray-200">
              <span className="text-sm font-medium text-gray-600">Time</span>
            </div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                <div className="text-sm font-medium text-gray-900">{formatDate(day)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {getMeetingsForDay(day).length} meetings
                </div>
              </div>
            ))}
          </div>

          {/* Time slots and meetings */}
          <div className="grid grid-cols-8 relative">
            {/* Time column */}
            <div className="border-r border-gray-200">
              {timeSlots.map((time, index) => (
                <div key={index} className="h-16 p-2 border-b border-gray-100 text-xs text-gray-500">
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-gray-200 last:border-r-0">
                {/* Time slot grid */}
                {timeSlots.map((_, timeIndex) => (
                  <div key={timeIndex} className="h-16 border-b border-gray-100"></div>
                ))}
                
                {/* Meetings for this day */}
                <div className="absolute inset-0 pointer-events-none">
                  {getMeetingsForDay(day).map((meeting) => {
                    const { top, height } = calculatePosition(meeting);
                    return (
                      <div
                        key={meeting.id}
                        className="absolute left-1 right-1 pointer-events-auto cursor-pointer"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: meeting.color,
                        }}
                      >
                        <div className="h-full rounded-md p-2 text-white text-xs overflow-hidden">
                          <div className="font-medium truncate">{meeting.title}</div>
                          <div className="opacity-90 truncate">{meeting.client}</div>
                          <div className="opacity-75 text-xs">
                            {formatTime(meeting.startDate)} - {formatTime(meeting.endDate)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meeting List View */}
      {viewMode === "month" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
          <div className="grid gap-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full mt-1"
                      style={{ backgroundColor: meeting.color }}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{meeting.client}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(meeting.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(meeting.startDate)} - {formatTime(meeting.endDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(meeting.type)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === "day" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">{formatDate(selectedDate)}</h3>
          </div>
          <div className="relative">
            {timeSlots.map((time, index) => (
              <div key={index} className="flex border-b border-gray-100">
                <div className="w-20 p-3 text-xs text-gray-500 border-r border-gray-200">
                  {time}
                </div>
                <div className="flex-1 h-16 relative">
                  {/* Meetings for this time slot */}
                  {getMeetingsForDay(selectedDate)
                    .filter(meeting => {
                      const meetingHour = meeting.startDate.getHours();
                      return meetingHour === parseInt(time.split(':')[0]);
                    })
                    .map((meeting) => (
                      <div
                        key={meeting.id}
                        className="absolute inset-x-2 inset-y-1 rounded-md p-2 text-white text-sm cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: meeting.color }}
                      >
                        <div className="font-medium">{meeting.title}</div>
                        <div className="text-xs opacity-90">{meeting.client}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttChart;