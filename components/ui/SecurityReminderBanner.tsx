'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiX } from 'react-icons/fi'

export default function SecurityReminderBanner() {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-blue-100 rounded-lg mx-4 mt-4 mb-4 px-4 py-3 shadow-sm relative">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-3 pr-6">
          {/* Shield Icon */}
          <div className="flex-shrink-0">
            <Image 
              src="/images/material-symbols_security-rounded.svg"
              alt="Security Shield"
              width={26}
              height={26}
              className="w-8 h-8"
            />
          </div>
          
          {/* Security Reminder Text */}
          <span className="text-lg font-bold text-gray-500 font-raleway">
            Security Reminder: <span className="font-asul"> EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system </span> .
          </span>
        </div>
      </div>
      
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1 hover:bg-blue-200 rounded-full transition-colors"
        aria-label="Close security reminder"
      >
        <FiX className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )
}

