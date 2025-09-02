'use client';

import React from 'react';

interface VendorProfileCardProps {
  vendorName: string;
  vendorImage: string;
  description: string;
  badgeText?: string;
  totalRequests?: number;
}

const VendorProfileCard: React.FC<VendorProfileCardProps> = ({
  vendorName,
  vendorImage,
  description,
  badgeText = "Top Rated",
  totalRequests = 120
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header with badges */}
      {/* <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="bg-event-blue text-white px-4 py-2 rounded-lg">
          <span className="font-sans font-medium text-sm">{badgeText}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-gray-600 text-sm">Total Request</span>
          <div className="bg-event-blue text-white px-3 py-1 rounded-lg flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-sans font-medium">{totalRequests}</span>
          </div>
        </div>
      </div> */}

      {/* Profile Content */}
      <div className="p-4 mb-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-green-500">
            <img 
              src={vendorImage} 
              alt={vendorName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-gray-900">
              {vendorName}
            </h2>
          </div>
        </div>

        <p className="text-gray-600 font-sans text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default VendorProfileCard;
