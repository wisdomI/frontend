'use client'

import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

interface LocationDropdownProps {
  locations: string[]
  selectedLocation: string
  isOpen: boolean
  onToggle: () => void
  onLocationSelect: (location: string) => void
  placeholder?: string
}

export default function LocationDropdown({ 
  locations, 
  selectedLocation, 
  isOpen, 
  onToggle, 
  onLocationSelect,
  placeholder = "Select Location"
}: LocationDropdownProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3">Location</h3>
      <div className="relative">
        <button 
          onClick={onToggle}
          className="w-full bg-event-blue text-white px-3 py-2 rounded flex items-center justify-between hover:bg-event-blue-hover transition-colors text-sm"
        >
          <span>{selectedLocation || placeholder}</span>
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-32 overflow-y-auto">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => onLocationSelect(location)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t last:rounded-b"
              >
                {location}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
