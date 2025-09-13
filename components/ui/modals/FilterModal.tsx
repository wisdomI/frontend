'use client'

import React, { useState } from 'react'
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Entertainment',
    'Beauty & Grooming', 
    'Event Support Services',
    'Kids & Special Fun Vendors'
  ])
  
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([
    '₦50,000 - ₦99,000',
    '₦1,000,000 - ₦1,999,000',
    '> ₦2,000,000'
  ])
  
  const [selectedFilter, setSelectedFilter] = useState('Top Rated')
  const [distanceRange, setDistanceRange] = useState({ min: 2, max: 5 })
  const [startDate, setStartDate] = useState('12/05/2023')
  const [endDate, setEndDate] = useState('23/05/2023')
  
  // New state for collapsible sections and location
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isBudgetOpen, setIsBudgetOpen] = useState(true)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('Select Location')

  const categories = [
    'Catering & Drinks',
    'Event Rentals & Equipment', 
    'Decoration and Setup',
    'Media & Content',
    'Fashion & Styling',
    'Vendors for Event Materials',
    'Hotels & Restaurants',
    'Gifts Registry',
    'Logistics & Miscellaneous',
    'Content Creators',
    'Entertainment',
    'Beauty & Grooming',
    'Event Support Services',
    'Kids & Special Fun Vendors'
  ]

  const budgetRanges = [
    '₦20,000 - ₦49,000',
    '₦50,000 - ₦99,000',
    '₦100,000 - ₦299,000',
    '₦300,000 - ₦599,000',
    '₦600,000 - ₦999,000',
    '₦1,000,000 - ₦1,999,000',
    '> ₦2,000,000'
  ]

  const filterOptions = ['Top Rated', 'Rising Stars', 'Best Valued', 'Most Booked']

  const locations = [
    'Lagos',
    'Abuja', 
    'Port Harcourt',
    'Kano',
    'Ibadan',
    'Enugu',
    'Abeokuta',
    'Jos',
    'Ilorin',
    'Owerri'
  ]

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleBudgetToggle = (budget: string) => {
    setSelectedBudgets(prev => 
      prev.includes(budget) 
        ? prev.filter(b => b !== budget)
        : [...prev, budget]
    )
  }

  const handleDistanceChange = (type: 'min' | 'max', value: number) => {
    setDistanceRange(prev => {
      const newRange = { ...prev, [type]: value }
      // Ensure min doesn't exceed max and vice versa
      if (type === 'min' && newRange.min >= newRange.max) {
        newRange.max = Math.min(newRange.min + 1, 100)
      } else if (type === 'max' && newRange.max <= newRange.min) {
        newRange.min = Math.max(newRange.max - 1, 1)
      }
      return newRange
    })
  }

  const handleDistanceInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      handleDistanceChange(type, numValue)
    }
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setIsLocationOpen(false)
  }

  const handleShowResults = () => {
    // Handle filter results
    console.log('Filter results:', {
      categories: selectedCategories,
      budgets: selectedBudgets,
      filter: selectedFilter,
      distance: distanceRange,
      dates: { start: startDate, end: endDate }
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="w-64 flex-shrink-0 h-full bg-white overflow-y-auto">
      <style jsx>{`
        /* Smooth transitions for all slider elements */
        .slider-track {
          transition: all 0.15s ease-out;
        }
        .slider-handle {
          transition: all 0.15s ease-out;
        }
        .slider-handle:hover {
          transform: translateY(-6px) scale(1.1);
        }
        .slider-handle:active {
          transform: translateY(-6px) scale(1.05);
        }
      `}</style>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Category Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <h3 className="text-base font-semibold text-gray-800">Category</h3>
              <ChevronDownIcon 
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
            {isCategoryOpen && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-3 h-3 text-event-blue border-gray-300 rounded focus:ring-event-blue"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Budget Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setIsBudgetOpen(!isBudgetOpen)}
            >
              <h3 className="text-base font-semibold text-gray-800">Budget</h3>
              <ChevronDownIcon 
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isBudgetOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
            {isBudgetOpen && (
              <div className="space-y-2">
                {budgetRanges.map((budget) => (
                  <label key={budget} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBudgets.includes(budget)}
                      onChange={() => handleBudgetToggle(budget)}
                      className="w-3 h-3 text-event-blue border-gray-300 rounded focus:ring-event-blue"
                    />
                    <span className="text-sm text-gray-700">{budget}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Distance Slider */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Distance</h3>
            
            {/* Distance Input Fields */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Min (km)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={distanceRange.min}
                  onChange={(e) => handleDistanceInputChange('min', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-event-blue focus:border-transparent text-center"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Max (km)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={distanceRange.max}
                  onChange={(e) => handleDistanceInputChange('max', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-event-blue focus:border-transparent text-center"
                />
              </div>
            </div>
            
            <div className="relative px-2">
              {/* Slider Track */}
              <div className="relative h-2 bg-gray-200 rounded-lg">
                {/* Active Range */}
                <div 
                  className="absolute h-2 bg-event-blue rounded-lg transition-all duration-150"
                  style={{ 
                    left: `${(distanceRange.min / 100) * 100}%`, 
                    width: `${((distanceRange.max - distanceRange.min) / 100) * 100}%` 
                  }}
                ></div>
                
                {/* Min Handle */}
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-event-blue rounded-full cursor-pointer shadow-lg transform -translate-y-1.5 transition-all duration-150 hover:scale-110"
                  style={{ 
                    left: `calc(${(distanceRange.min / 100) * 100}% - 10px)`,
                    zIndex: distanceRange.min > distanceRange.max - 1 ? 10 : 5
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    const startX = e.clientX
                    const startValue = distanceRange.min
                    const sliderWidth = e.currentTarget.parentElement?.offsetWidth || 0
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = moveEvent.clientX - startX
                      const deltaPercent = (deltaX / sliderWidth) * 100
                      const newValue = Math.max(1, Math.min(100, Math.round(startValue + deltaPercent)))
                      
                      if (newValue < distanceRange.max) {
                        setDistanceRange(prev => ({ ...prev, min: newValue }))
                      }
                    }
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove)
                      document.removeEventListener('mouseup', handleMouseUp)
                    }
                    
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                  }}
                />
                
                {/* Max Handle */}
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-event-blue rounded-full cursor-pointer shadow-lg transform -translate-y-1.5 transition-all duration-150 hover:scale-110"
                  style={{ 
                    left: `calc(${(distanceRange.max / 100) * 100}% - 10px)`,
                    zIndex: distanceRange.max < distanceRange.min + 1 ? 10 : 5
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    const startX = e.clientX
                    const startValue = distanceRange.max
                    const sliderWidth = e.currentTarget.parentElement?.offsetWidth || 0
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = moveEvent.clientX - startX
                      const deltaPercent = (deltaX / sliderWidth) * 100
                      const newValue = Math.max(1, Math.min(100, Math.round(startValue + deltaPercent)))
                      
                      if (newValue > distanceRange.min) {
                        setDistanceRange(prev => ({ ...prev, max: newValue }))
                      }
                    }
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove)
                      document.removeEventListener('mouseup', handleMouseUp)
                    }
                    
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                  }}
                />
              </div>
              
              {/* Labels */}
              <div className="flex justify-between mt-3">
                <span className="text-sm text-gray-600 transition-all duration-150">{distanceRange.min}km (20 mins)</span>
                <span className="text-sm text-gray-600 transition-all duration-150">{distanceRange.max}km (45 mins)</span>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Select filter Options</h3>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedFilter(option)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    selectedFilter === option
                      ? 'bg-event-blue text-white'
                      : 'bg-white text-gray-700 border border-event-blue hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Location</h3>
            <div className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full bg-event-blue text-white px-3 py-2 rounded flex items-center justify-between hover:bg-event-blue-hover transition-colors text-sm"
              >
                <span>{selectedLocation}</span>
                <ChevronDownIcon 
                  className={`w-4 h-4 transition-transform ${
                    isLocationOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {isLocationOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-32 overflow-y-auto">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t last:rounded-b"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Availability</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <div className="relative">
                  <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value="2023-05-12"
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 text-sm border border-event-blue rounded focus:ring-1 focus:ring-event-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <div className="relative">
                  <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value="2023-05-23"
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 text-sm border border-event-blue rounded focus:ring-1 focus:ring-event-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Show Results Button - Fixed at bottom */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleShowResults}
            className="w-full bg-event-blue text-white py-3 rounded font-semibold text-sm hover:bg-event-blue-hover transition-colors"
          >
            Show Result (12)
          </button>
        </div>
      </div>
    </div>
  )
}
