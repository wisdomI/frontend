'use client'

import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { 
  FilterSection, 
  CheckboxGroup, 
  RangeSlider, 
  LocationDropdown, 
  DateRangePicker,
  FilterModalProps, 
  FilterState 
} from '../filter'

export default function FilterModal({ isOpen, onClose, onApplyFilters }: FilterModalProps) {
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
  const [startDate, setStartDate] = useState('2023-05-12')
  const [endDate, setEndDate] = useState('2023-05-23')
  
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

  const handleMinDistanceChange = (value: number) => {
    setDistanceRange(prev => {
      const newRange = { ...prev, min: value }
      if (newRange.min >= newRange.max) {
        newRange.max = Math.min(newRange.min + 1, 100)
      }
      return newRange
    })
  }

  const handleMaxDistanceChange = (value: number) => {
    setDistanceRange(prev => {
      const newRange = { ...prev, max: value }
      if (newRange.max <= newRange.min) {
        newRange.min = Math.max(newRange.max - 1, 1)
      }
      return newRange
    })
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setIsLocationOpen(false)
  }

  const handleShowResults = () => {
    const filterState: FilterState = {
      categories: selectedCategories,
      budgets: selectedBudgets,
      filter: selectedFilter,
      distance: distanceRange,
      dates: { start: startDate, end: endDate },
      location: selectedLocation
    }
    
    if (onApplyFilters) {
      onApplyFilters(filterState)
    }
    
    console.log('Filter results:', filterState)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="w-64 flex-shrink-0 h-full bg-white overflow-y-auto">
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
          <FilterSection
            title="Category"
            isOpen={isCategoryOpen}
            onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <CheckboxGroup
              items={categories}
              selectedItems={selectedCategories}
              onItemToggle={handleCategoryToggle}
            />
          </FilterSection>

          {/* Budget Section */}
          <FilterSection
            title="Budget"
            isOpen={isBudgetOpen}
            onToggle={() => setIsBudgetOpen(!isBudgetOpen)}
          >
            <CheckboxGroup
              items={budgetRanges}
              selectedItems={selectedBudgets}
              onItemToggle={handleBudgetToggle}
            />
          </FilterSection>

          {/* Distance Slider */}
          <RangeSlider
            min={distanceRange.min}
            max={distanceRange.max}
            onMinChange={handleMinDistanceChange}
            onMaxChange={handleMaxDistanceChange}
            minLimit={1}
            maxLimit={100}
            label="Distance"
            unit="km"
          />

          {/* Filter Options */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Select filter Options</h3>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedFilter(option)}
                  className={`w-full h-10 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center ${
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
          <LocationDropdown
            locations={locations}
            selectedLocation={selectedLocation}
            isOpen={isLocationOpen}
            onToggle={() => setIsLocationOpen(!isLocationOpen)}
            onLocationSelect={handleLocationSelect}
          />

          {/* Availability */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
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
