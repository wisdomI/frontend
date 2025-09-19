'use client'

import { useState } from 'react'
import SetAvailabilityModal from '@/components/ui/modals/SetAvailabilityModal'

interface AvailabilitySlot {
  id: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

const Availability = () => {
  const [showModal, setShowModal] = useState(false)

  const days = [
    { date: '27', day: 'Mon' },
    { date: '28', day: 'Tue' },
    { date: '29', day: 'Wed', active: true },
    { date: '30', day: 'Thu' },
    { date: '31', day: 'Fri', active: true },
    { date: '01', day: 'Sat' },
  ]

  const handleSaveAvailability = (slots: AvailabilitySlot[]) => {
    console.log('Availability saved:', slots)
    // Here you would typically save to your backend
    // For now, we'll just show a success message
    alert('Your availability has been set successfully!')
  }

  return (
    <>
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">My Availability</h3>
        <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto">
          {days.map(d => (
            <div
              key={d.date}
              className={`flex flex-col items-center px-2 sm:px-3 py-2 rounded-lg flex-shrink-0 ${
                d.active ? 'bg-event-blue text-white' : 'bg-gray-100'
              }`}
            >
              <span className="text-xs">{d.day}</span>
              <span className="font-bold text-sm sm:text-base">{d.date}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-event-blue text-white w-full py-2 rounded-lg text-sm sm:text-base hover:bg-event-blue-hover transition-colors"
        >
          + Set Availability
        </button>
      </div>

      <SetAvailabilityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAvailability}
      />
    </>
  )
}

export default Availability
