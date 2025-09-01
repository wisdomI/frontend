"use client";

import React, { useState } from "react";
import { Calendar, User, MapPin, Plus, Edit, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Meeting {
  id: string;
  title: string;
  organizer: string; // Changed from client to organizer to match design
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  location: string;
  type: "consultation" | "planning" | "review" | "delivery";
  color: string;
}

const GanttChart: React.FC = () => {
  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Wedding Planning Consultation",
      organizer: "Sarah Johnson",
      startDate: new Date(2024, 6, 19, 10, 0), // July 19, 2024, 10:00 AM
      endDate: new Date(2024, 6, 19, 12, 0),   // July 19, 2024, 12:00 PM
      duration: 2,
      status: "scheduled",
      location: "EventHub Office",
      type: "consultation",
      color: "#3B82F6"
    },
    {
      id: "2", 
      title: "Venue Site Visit",
      organizer: "Michael Chen",
      startDate: new Date(2024, 6, 20, 14, 0), // July 20, 2024, 2:00 PM
      endDate: new Date(2024, 6, 20, 16, 30),  // July 20, 2024, 4:30 PM
      duration: 2.5,
      status: "scheduled",
      location: "Grand Ballroom",
      type: "planning",
      color: "#10B981"
    },
    {
      id: "3",
      title: "Final Review Meeting",
      organizer: "Emma Davis",
      startDate: new Date(2024, 6, 21, 9, 0),  // July 21, 2024, 9:00 AM
      endDate: new Date(2024, 6, 21, 10, 30),  // July 21, 2024, 10:30 AM
      duration: 1.5,
      status: "completed",
      location: "Virtual Meeting",
      type: "review",
      color: "#8B5CF6"
    },
    {
      id: "4",
      title: "Event Setup Coordination",
      organizer: "David Wilson",
      startDate: new Date(2024, 6, 22, 8, 0),   // July 22, 2024, 8:00 AM
      endDate: new Date(2024, 6, 22, 17, 0),    // July 22, 2024, 5:00 PM
      duration: 9,
      status: "in-progress",
      location: "Convention Center",
      type: "delivery",
      color: "#F59E0B"
    }
  ]);

  // Date range state for navigation
  const [fromDate, setFromDate] = useState<Date>(new Date(2024, 6, 19)); // July 19, 2024
  const [toDate, setToDate] = useState<Date>(new Date(2024, 6, 25)); // July 25, 2024
  const [isFromDateOpen, setIsFromDateOpen] = useState(false);
  const [isToDateOpen, setIsToDateOpen] = useState(false);

  // Generate time slots from 8 AM to 6 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      const time12 = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = time12 === 0 ? 12 : time12;
      slots.push({
        hour24: hour,
        display: `${displayHour} ${ampm}`,
        value: `${hour.toString().padStart(2, '0')}:00`
      });
    }
    return slots;
  };

  // Generate days based on date range
  const generateDateRange = () => {
    const days = [];
    const currentDate = new Date(fromDate);
    
    while (currentDate <= toDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const timeSlots = generateTimeSlots();
  const dateRange = generateDateRange();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateHeader = (date: Date) => {
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' : 
                   day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
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
    const top = ((startHour - 8) * 64 + (startMinute / 60) * 64); // 64px per hour
    const height = meeting.duration * 64; // 64px per hour
    return { top, height };
  };

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-6">
          {/* Date Range Pickers */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">From</span>
              <Popover open={isFromDateOpen} onOpenChange={setIsFromDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(fromDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => {
                      if (date) {
                        setFromDate(date);
                        setIsFromDateOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">To</span>
              <Popover open={isToDateOpen} onOpenChange={setIsToDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(toDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => {
                      if (date) {
                        setToDate(date);
                        setIsToDateOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button className="bg-event-blue text-white hover:bg-event-blue-hover transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Gantt Chart */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header with dates */}
        <div className={`grid border-b border-gray-200`} style={{ gridTemplateColumns: `120px repeat(${dateRange.length}, 1fr)` }}>
          <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-center">
            <span className="text-sm font-medium text-gray-600">Time</span>
          </div>
          {dateRange.map((day, index) => (
            <div key={index} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-gray-900">{formatDateHeader(day)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {getMeetingsForDay(day).length} meetings
              </div>
            </div>
          ))}
        </div>

        {/* Time slots and meetings */}
        <div className={`grid relative`} style={{ gridTemplateColumns: `120px repeat(${dateRange.length}, 1fr)` }}>
          {/* Time column */}
          <div className="border-r border-gray-200">
            {timeSlots.map((timeSlot, index) => (
              <div key={index} className="h-16 p-3 border-b border-gray-100 flex items-center">
                <span className="text-xs text-gray-500 font-medium">{timeSlot.display}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {dateRange.map((day, dayIndex) => (
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
                      className="absolute left-2 right-2 pointer-events-auto cursor-pointer rounded-md shadow-sm"
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 32)}px`,
                        backgroundColor: meeting.color,
                      }}
                    >
                      <div className="h-full rounded-md p-2 text-white text-xs overflow-hidden">
                        <div className="font-semibold truncate text-sm">{meeting.title}</div>
                        <div className="opacity-90 truncate text-xs mt-1">
                          By {meeting.organizer}
                        </div>
                        <div className="opacity-75 text-xs mt-1">
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


    </div>
  );
};

export default GanttChart;