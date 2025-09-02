'use client';

import React from 'react';
import { RiLinkM, RiMapPinLine } from "react-icons/ri";
import { Calendar, Plus } from 'lucide-react';

interface VendorContactInfoProps {
  websiteUrl?: string;
  location?: string;
  travelInfo?: string;
  availabilityStatus?: string;
  nextBookingDate?: string;
  onCheckAvailability: () => void;
  onRequestService: () => void;
}

const VendorContactInfo: React.FC<VendorContactInfoProps> = ({
  websiteUrl = "www.eventhub.com/ruthiebridalmakeovers",
  location = "Abuja, Nigeria",
  travelInfo = "+ Northern Nlg only",
  availabilityStatus = "Busy until Feb 15, 2025",
  nextBookingDate = "Feb 15, 2025",
  onCheckAvailability,
  onRequestService
}) => {
  return (
    <div className="bg-white rounded-xl p-4 mt-4 border border-gray-200 space-y-4">
      {/* Website URL */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-event-blue rounded-lg flex items-center justify-center">
          <RiLinkM className="w-5 h-5 text-white" />
        </div>
        <span className="text-event-blue font-sans text-sm underline">
          {websiteUrl}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-event-blue rounded-lg flex items-center justify-center">
          <RiMapPinLine className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center justify-between flex-1">
          <span className="font-sans text-gray-700">{location}</span>
          <span className="text-gray-500 font-sans">{travelInfo}</span>
        </div>
      </div>

      {/* Availability Status */}
      <div className="w-full border-2 bg-[#d3e7ff] border-event-blue py-2 px-4 mb-4 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5 text-event-blue" />
          <span className="font-sans text-event-blue font-medium text-center">
            {availabilityStatus}
          </span>
        </div>
      </div>

      {/* Check Availability Button */}
      <button
        onClick={onCheckAvailability}
        className="w-full border-2 border-event-blue bg-white mb-4 text-event-blue py-2 px-4 rounded-lg hover:bg-event-blue hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Calendar className="w-5 h-5" />
        <span className="font-sans">Check Availability</span>
      </button>

      {/* Request Service Button */}
      <button
        onClick={onRequestService}
        className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-event-blue transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-sans">Request Service</span>
      </button>
    </div>
  );
};

export default VendorContactInfo;