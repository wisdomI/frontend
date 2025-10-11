'use client'

import { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface AddTravelInfoModalProps {
  onSave?: (data: any) => void
}

const AddTravelInfoModal = ({ onSave }: AddTravelInfoModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    baseLocation: '',
    travelWillingness: 'local',
    minimumBookingValue: '',
    accommodationRequired: false
  })

  const handleSave = () => {
    console.log('Travel info saved:', formData)
    onSave?.(formData)
    setIsOpen(false)
    setFormData({
      baseLocation: '',
      travelWillingness: 'local',
      minimumBookingValue: '',
      accommodationRequired: false
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors font-medium"
      >
        + Add Travel Information
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Add Travel Information</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Base Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Location (Primary Service Area)
                </label>
                <input
                  type="text"
                  value={formData.baseLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, baseLocation: e.target.value }))}
                  placeholder="Enter Location"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Travel Willingness */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Travel Willingness</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="travelWillingness"
                      value="local"
                      checked={formData.travelWillingness === 'local'}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelWillingness: e.target.value }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Local Only</div>
                      <div className="text-sm text-gray-500">I only serve customers in my base location</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="travelWillingness"
                      value="neighboring"
                      checked={formData.travelWillingness === 'neighboring'}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelWillingness: e.target.value }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Neighboring States</div>
                      <div className="text-sm text-gray-500">I can travel to states that border my base location</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="travelWillingness"
                      value="nationwide"
                      checked={formData.travelWillingness === 'nationwide'}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelWillingness: e.target.value }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Nationwide</div>
                      <div className="text-sm text-gray-500">I can travel anywhere in Nigeria</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="travelWillingness"
                      value="regional"
                      checked={formData.travelWillingness === 'regional'}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelWillingness: e.target.value }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Regional States Only</div>
                      <div className="text-sm text-gray-500">I can travel to states within my region</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Minimum Booking Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Booking Value for Travel (₦)
                </label>
                <input
                  type="text"
                  value={formData.minimumBookingValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimumBookingValue: e.target.value }))}
                  placeholder="E.g. 200,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Accommodation Required */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accommodationRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, accommodationRequired: e.target.checked }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Accommodation Required</div>
                    <div className="text-sm text-gray-500">Check if client must provide accommodation for overnight stays</div>
                  </div>
                </label>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddTravelInfoModal
