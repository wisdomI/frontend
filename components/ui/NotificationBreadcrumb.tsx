'use client'

import React, { useState } from 'react'

interface NotificationBreadcrumbProps {
  message: string
  type?: 'info' | 'warning' | 'success' | 'error'
  icon?: 'shield' | 'info' | 'warning' | 'check' | 'alert'
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export default function NotificationBreadcrumb({
  message,
  type = 'info',
  icon = 'shield',
  dismissible = true,
  onDismiss,
  className = 'flex items-start'
}: NotificationBreadcrumbProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  if (!isVisible) return null

  // Define colors based on type
  const typeStyles = {
    info: 'bg-[#d3e7ff] border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }

  // Define icons
  const renderIcon = () => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0"
    
    switch (icon) {
      case 'shield':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 19.9C13.6167 19.4 14.9667 18.4127 16.05 16.938C17.1333 15.4633 17.7667 13.8173 17.95 12H12V4.12499L6 6.37499V11.55C6 11.6667 6.01667 11.8167 6.05 12H12V19.9ZM12 21.9C11.8833 21.9 11.775 21.8917 11.675 21.875C11.575 21.8583 11.475 21.8333 11.375 21.8C9.125 21.05 7.33333 19.6627 6 17.638C4.66667 15.6133 4 13.434 4 11.1V6.37499C4 5.95833 4.121 5.58333 4.363 5.24999C4.605 4.91666 4.91733 4.67499 5.3 4.52499L11.3 2.27499C11.5333 2.19166 11.7667 2.14999 12 2.14999C12.2333 2.14999 12.4667 2.19166 12.7 2.27499L18.7 4.52499C19.0833 4.67499 19.396 4.91666 19.638 5.24999C19.88 5.58333 20.0007 5.95833 20 6.37499V11.1C20 13.4333 19.3333 15.6127 18 17.638C16.6667 19.6633 14.875 21.0507 12.625 21.8C12.525 21.8333 12.425 21.8583 12.325 21.875C12.225 21.8917 12.1167 21.9 12 21.9Z" fill="#032D71"/>
          </svg>
        )
      case 'info':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'check':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'alert':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
  <div  className='flex container mx-auto '>
    
    <div className= { `container   rounded-xl md:mt-6 mt-4  mx-4   ${typeStyles[type]} ${className}`}>
      <div className=" flex  px-4 ">
        <div className="flex items-center justify-between py-3 mx-4 ">
          <div className="flex items-center">
            {renderIcon()}
            <span className=" mx-4 md:text-[18px]   text-auto  tracking-wide font-semibold font-heading text-center text-[#4c4c4c] ">
              <span className='font-sans text-[18px] '> Security Reminder: </span>
              {message}
            </span>
          </div>
          
          {/* {dismissible && (
            <button
              onClick={handleDismiss}
              className="ml-4 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )} */}
        </div>
      </div>
    </div>

    </div>
  )
}