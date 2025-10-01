'use client'

import React, { useState } from 'react'
import { FaUser, FaBuilding, FaTimes } from 'react-icons/fa'

type AccountOption = {
  id: string
  title: string
  description: string
  icon: JSX.Element
}

interface Props {
  onSelect: (id: string) => void
  onClose: () => void
}

const AccountTypeModal: React.FC<Props> = ({ onSelect, onClose }) => {
  const [selected, setSelected] = useState<string>('')

  const options: AccountOption[] = [
    {
      id: 'individual',
      title: 'I am an Individual/Organization looking for a Service',
      description: '',
      icon: <FaUser className="text-blue-500 w-5 h-5 sm:w-7 sm:h-7" />,
    },
    {
      id: 'vendor',
      title: 'I am an Event Vendor providing a service',
      description: '',
      icon: <FaBuilding className="text-white w-5 h-5 sm:w-7 sm:h-7" />,
    },
  ]

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect(id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded-lg hover:opacity-90 z-10"
        >
          <FaTimes />
        </button>
        
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 mt-8 sm:mt-0">
            Which of these best describes you?
          </h2>
          <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
            Let us know the kind of account you want to create.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            {options.map(option => {
              const isSelected = selected === option.id
              return (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`cursor-pointer flex flex-col items-center justify-center rounded-2xl p-4 sm:p-6 border transition-all w-full sm:w-48 h-40 sm:h-48 ${
                    isSelected
                      ? 'bg-event-blue text-white'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-event-blue hover:bg-event-blue hover:text-white'
                  }`}
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full mb-3 sm:mb-4 ${
                      isSelected ? 'bg-event-blue' : 'bg-blue-100'
                    }`}
                  >
                    {option.icon}
                  </div>
                  <p className={`text-center font-medium text-xs sm:text-sm leading-tight`}>
                    {option.title}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountTypeModal
