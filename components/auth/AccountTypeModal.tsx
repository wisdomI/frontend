'use client'

import React, { useState } from 'react'
import { FaUser, FaBuilding, FaTimes } from 'react-icons/fa'

interface Props {
  onSelect: (id: string) => void
  onClose: () => void
}

const AccountTypeModal: React.FC<Props> = ({ onSelect, onClose }) => {
  const [selected, setSelected] = useState<string>('')

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect(id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-8 md:w-[1000px] md:h-[460px] max-w-auto bg-white rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded-lg w-8 h-8 flex items-center justify-center"
        >
          <FaTimes size={14} />
        </button>

        <h2 className="text-2xl font-bold  font-heading text-event-blue mb-2">
          Which of these best describes you?
        </h2>
        <p className="text-gray-600 font-sans mb-8">
          Let us know the kind of account you want to create.
        </p>

        <div className="grid grid-cols-2 md:gap-16 md:mx-16 ">
          {/* Individual/Organization Option */}
          <div
            onClick={() => handleSelect('individual')}
            className={`cursor-pointer rounded-2xl p-8 border-2 transition-all ${selected === 'individual'
              ? 'bg-event-blue text-white border-event-blue'
              : 'bg-white text-gray-800 flex items-center  font-heading flex-col justify-col border-gray-200 hover:border-event-blue hover:bg-event-blue hover:text-white'
              }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${selected === 'individual' ? 'bg-white' : 'bg-blue-50'
              }`}>
              <FaUser size={24} className={selected === 'individual' ? 'text-event-blue' : 'text-event-blue'} />
            </div>
            <p className="font-medium text-lg leading-tight">
              I am an Individual/Organization looking for a Service
            </p>
          </div>

          {/* Event Vendor Option */}
          <div
            onClick={() => handleSelect('vendor')}
            className={`cursor-pointer rounded-2xl p-8 border-2 transition-all ${selected === 'vendor'
              ? 'bg-event-blue text-white border-event-blue'
              : 'bg-gray-50 text-gray-800 border-gray-200 font-heading flex flex-col justify-center items-center hover:bg-event-blue hover:text-white  hover:border-event-blue hover:bg-event-blue'
              }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${selected === 'vendor' ? 'bg-white' : 'bg-blue-50'
              }`}>
              <FaBuilding size={24} className={selected === 'vendor' ? 'text-event-blue' : 'text-event-blue'} />
            </div>
            <p className="font-medium text-lg leading-tight">
              I am an Event Vendor providing a service
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountTypeModal