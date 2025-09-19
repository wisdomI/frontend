'use client'

import { useState } from 'react'
import { FiX, FiPlus, FiCalendar, FiClock } from 'react-icons/fi'

interface AvailabilitySlot {
  id: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

interface SetAvailabilityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (slots: AvailabilitySlot[]) => void
}

const SetAvailabilityModal = ({ isOpen, onClose, onSave }: SetAvailabilityModalProps) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([
    {
      id: '1',
      startDate: '12/05/2025',
      endDate: '12/05/2025',
      startTime: '9:00 am',
      endTime: '9:00 am'
    }
  ])

  const addSlot = () => {
    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      startDate: '12/05/2025',
      endDate: '12/05/2025',
      startTime: '9:00 am',
      endTime: '9:00 am'
    }
    setSlots([...slots, newSlot])
  }

  const removeSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id))
  }

  const updateSlot = (id: string, field: keyof AvailabilitySlot, value: string) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ))
  }

  const handleSave = () => {
    onSave(slots)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">Set Availability</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">Select your unavailable Date & Time</p>

          {slots.map((slot, index) => (
            <div key={slot.id} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Select your unavailable Date & Time
                </h4>
                {slots.length > 1 && (
                  <button
                    onClick={() => removeSlot(slot.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={slot.startDate}
                        onChange={(e) => updateSlot(slot.id, 'startDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="12/05/2025"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={slot.endDate}
                        onChange={(e) => updateSlot(slot.id, 'endDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="12/05/2025"
                      />
                    </div>
                  </div>
                </div>

                {/* Time Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={slot.startTime}
                        onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                      >
                        <option value="9:00 am">9:00 am</option>
                        <option value="10:00 am">10:00 am</option>
                        <option value="11:00 am">11:00 am</option>
                        <option value="12:00 pm">12:00 pm</option>
                        <option value="1:00 pm">1:00 pm</option>
                        <option value="2:00 pm">2:00 pm</option>
                        <option value="3:00 pm">3:00 pm</option>
                        <option value="4:00 pm">4:00 pm</option>
                        <option value="5:00 pm">5:00 pm</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={slot.endTime}
                        onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                      >
                        <option value="9:00 am">9:00 am</option>
                        <option value="10:00 am">10:00 am</option>
                        <option value="11:00 am">11:00 am</option>
                        <option value="12:00 pm">12:00 pm</option>
                        <option value="1:00 pm">1:00 pm</option>
                        <option value="2:00 pm">2:00 pm</option>
                        <option value="3:00 pm">3:00 pm</option>
                        <option value="4:00 pm">4:00 pm</option>
                        <option value="5:00 pm">5:00 pm</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={addSlot}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <FiPlus className="w-4 h-4" />
              Add
            </button>
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
  )
}

export default SetAvailabilityModal
