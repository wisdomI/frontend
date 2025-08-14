'use client'

import React, { useState } from 'react'
import { FaUser, FaBuilding, FaCalendarCheck, FaTimes } from 'react-icons/fa'

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
      icon: <FaUser size={28} className="text-blue-500" />,
    },
    {
      id: 'vendor',
      title: 'I am an Event Vendor providing a service',
      description: '',
      icon: <FaBuilding size={28} className="text-white" />,
    },
    {
      id: 'planner',
      title: 'I am an Event Planner managing your service',
      description: '',
      icon: <FaCalendarCheck size={28} className="text-blue-500" />,
    },
  ]

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect(id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-auto ml-0">
      <div className="p-6 w-full max-w-3xl bg-white rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-1 bg-event-blue rounded"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-center mb-2">
          Which of these best describes you?
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Let us know the kind of account you want to create.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map(option => {
            const isSelected = selected === option.id
            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`cursor-pointer flex flex-col items-center justify-center rounded-2xl p-6 border transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500 hover:bg-event-blue hover:text-white'
                }`}
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 ${
                    isSelected ? 'bg-event-blue' : 'bg-blue-100'
                  }`}
                >
                  {option.icon}
                </div>
                <p className={`text-center font-medium text-sm`}>
                  {option.title}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AccountTypeModal
