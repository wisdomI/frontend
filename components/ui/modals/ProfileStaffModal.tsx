'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft, FiChevronDown } from 'react-icons/fi'

interface ProfileStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; email: string; phone: string; role: string }) => void
}

export default function ProfileStaffModal({ 
  isOpen, 
  onClose, 
  onSave 
}: ProfileStaffModalProps) {
  const [staffName, setStaffName] = useState('Elizabeth Odeh')
  const [staffEmail, setStaffEmail] = useState('elizabethodeh@gmail.com')
  const [phoneNumber, setPhoneNumber] = useState('70397668988')
  const [countryCode, setCountryCode] = useState('+234')
  const [roleName, setRoleName] = useState('Support')
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

  if (!isOpen) return null

  const roles = ['Support', 'Supervisor', 'Manager', 'Admin']

  const handleSave = () => {
    const staffData = {
      name: staffName,
      email: staffEmail,
      phone: `${countryCode}${phoneNumber}`,
      role: roleName
    }
    onSave(staffData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1">
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Profile Staff</h2>
          </div>
          <button onClick={onClose} className="p-1">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Staff Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Name
            </label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>

          {/* Staff Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Email
            </label>
            <input
              type="email"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>

          {/* Staff Phone Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Phone Number
            </label>
            <div className="flex">
              {/* Country Code Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-l-lg border-r-0 bg-gray-50">
                  <div className="w-6 h-4 bg-green-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                    NG
                  </div>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              {/* Phone Number Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Role Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name
            </label>
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              >
                <span>{roleName}</span>
                <FiChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleName(role)
                        setIsRoleDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 text-white font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: '#032D71' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
