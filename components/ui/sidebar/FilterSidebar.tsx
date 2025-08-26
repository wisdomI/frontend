'use client';

import React, { useState } from 'react';
import LocationSelect from '../select/LocationSelect';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['entertainment', 'beauty-grooming', 'event-support', 'kids-special-fun']);
  const [selectedBudget, setSelectedBudget] = useState<string[]>(['50000-99000', '1000000-1999000', '2000000+']);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<string[]>(['top-rated', 'rising-stars']);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startDate, setStartDate] = useState('12/05/2023');
  const [endDate, setEndDate] = useState('23/06/2023');
  const [budgetRange, setBudgetRange] = useState([20, 50]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    budget: true,
    location: false,
    availability: false
  });

  const categories = [
    { id: 'catering-drinks', label: 'Catering & Drinks' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'event-rentals', label: 'Event Rentals & Equipment' },
    { id: 'decoration-setup', label: 'Decoration and Setup' },
    { id: 'media-content', label: 'Media & Content' },
    { id: 'beauty-grooming', label: 'Beauty & Grooming' },
    { id: 'event-support', label: 'Event Support Services' },
    { id: 'fashion-styling', label: 'Fashion & Styling' },
    { id: 'vendors-materials', label: 'Vendors for Event Materials' },
    { id: 'kids-special-fun', label: 'Kids & Special Fun Vendors' },
    { id: 'hotels-restaurants', label: 'Hotels & Restaurants' },
    { id: 'gifts-registry', label: 'Gifts Registry' },
    { id: 'logistics-misc', label: 'Logistics & Miscellaneous' },
    { id: 'content-creators', label: 'Content Creators' }
  ];

  const budgetOptions = [
    { id: '20000-49000', label: '₦20,000 - ₦49,000' },
    { id: '50000-99000', label: '₦50,000 - ₦99,000' },
    { id: '100000-299000', label: '₦100,000 - ₦299,000' },
    { id: '300000-599000', label: '₦300,000 - ₦599,000' },
    { id: '600000-999000', label: '₦600,000 - ₦999,000' },
    { id: '1000000-1999000', label: '₦1,000,000 - ₦1,999,000' },
    { id: '2000000+', label: '> ₦2,000,000' }
  ];

  const filterOptions = [
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'rising-stars', label: 'Rising Stars' },
    { id: 'best-valued', label: 'Best Valued' },
    { id: 'most-booked', label: 'Most Booked' }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBudgetToggle = (budgetId: string) => {
    setSelectedBudget(prev =>
      prev.includes(budgetId)
        ? prev.filter(id => id !== budgetId)
        : [...prev, budgetId]
    );
  };

  const toggleFilterOption = (optionId: string) => {
    setSelectedFilterOptions((prev: string[]) => 
      prev.includes(optionId) 
        ? prev.filter((id: string) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-heading font-semibold text-gray-800">Filter</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-event-blue text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Category Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-medium text-gray-800">Category</h3>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-event-blue border-gray-300 rounded focus:ring-event-blue"
                  />
                  <span className="text-sm font-sans text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-medium text-gray-800">Budget</h3>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div className="space-y-2 mb-4">
              {budgetOptions.map((budget) => (
                <label key={budget.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBudget.includes(budget.id)}
                    onChange={() => handleBudgetToggle(budget.id)}
                    className="w-4 h-4 text-event-blue border-gray-300 rounded focus:ring-event-blue"
                  />
                  <span className="text-sm font-sans text-gray-700">{budget.label}</span>
                </label>
              ))}
            </div>

            {/* Budget Range Slider */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-sans text-gray-500 mb-2">
                <span>20m</span>
                <span>50m</span>
              </div>
              <div className="flex justify-between text-xs font-sans text-gray-500 mb-3">
                <span>our mins</span>
                <span>4a mins</span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={budgetRange[0]}
                  onChange={(e) => setBudgetRange([parseInt(e.target.value), budgetRange[1]])}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={budgetRange[1]}
                  onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Select Filter Options */}
          <div>
            <h3 className="font-heading font-medium text-gray-800 mb-3">Select Filter Options</h3>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleFilterOption(option.id)}
                  className={`px-3 py-2 text-sm font-sans border rounded-lg transition-colors ${
                    selectedFilterOptions.includes(option.id)
                      ? 'bg-event-blue text-white border-event-blue'
                      : 'border-gray-300 text-gray-700 hover:border-event-blue hover:text-event-blue'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="font-heading font-medium text-gray-800 mb-3">Location</h3>
            <LocationSelect
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Select Location"
            />
          </div>

          {/* Availability Section */}
          <div>
            <h3 className="font-heading font-medium text-gray-800 mb-3">Availability</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-sans text-gray-600 mb-1">Start Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue text-sm font-sans"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-sans text-gray-600 mb-1">End Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue text-sm font-sans"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button className="w-full bg-yellow-500 text-black py-3 px-4 rounded font-sans font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center">
            <span className="mr-2">+</span>
            Post Service Request
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;