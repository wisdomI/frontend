'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft, FiChevronDown } from 'react-icons/fi'

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function CreateRoleModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)

  if (!isOpen) return null

  const permissions = [
    'Schedule Meetings',
    'Help & Support',
    'Manage Bookings',
    'Invoice Management',
    'Service Requests',
    'Marketplace Access',
    'Performance Analytics',
    'Rating & Reviews'
  ]

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const handleRemovePermission = (permission: string) => {
    setSelectedPermissions(prev => prev.filter(p => p !== permission))
  }

  const handleCreate = () => {
    onConfirm()
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
            <h2 className="text-lg font-semibold text-gray-900">Create Role</h2>
          </div>
          <button onClick={onClose} className="p-1">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Role Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>

          {/* Permissions Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            
            {/* Selected Permissions */}
            {selectedPermissions.length > 0 && (
              <div className="mb-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {selectedPermissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {permission}
                      <button
                        onClick={() => handleRemovePermission(permission)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPermissionsOpen(!isPermissionsOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              >
                <span className="text-gray-500">Select an Option</span>
                <FiChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {isPermissionsOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {permissions.map((permission) => (
                    <button
                      key={permission}
                      onClick={() => handlePermissionToggle(permission)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                        selectedPermissions.includes(permission) ? 'bg-blue-50' : ''
                      }`}
                    >
                      {permission}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="w-full py-3 text-white font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: '#032D71' }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
