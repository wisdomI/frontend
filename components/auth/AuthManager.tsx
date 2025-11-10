'use client'

import React, { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useAuthEnhanced } from '@/hooks/useAuthEnhanced'
import { FiUser, FiBriefcase, FiRefreshCw, FiPlus, FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { ButtonLoader } from '@/components/ui/Loader'

interface AuthManagerProps {
  onRoleSwitch?: (newRole: string) => void
  onVendorRoleAdded?: () => void
}

export default function AuthManager({ onRoleSwitch, onVendorRoleAdded }: AuthManagerProps) {
  const { user } = useAuthContext()
  const { 
    switchRole, 
    addVendorRole, 
    getRoles, 
    loading, 
    error 
  } = useAuthEnhanced()

  const [showRoleSwitch, setShowRoleSwitch] = useState(false)
  const [showVendorForm, setShowVendorForm] = useState(false)
  const [availableRoles, setAvailableRoles] = useState<any[]>([])
  const [vendorFormData, setVendorFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    businessPhone: ''
  })

  const handleRoleSwitch = async (role: string) => {
    try {
      await switchRole(role)
      toast.success(`Switched to ${role} role`)
      setShowRoleSwitch(false)
      onRoleSwitch?.(role)
      // Refresh the page to update the UI
      window.location.reload()
    } catch (err) {
      toast.error('Failed to switch role')
    }
  }

  const handleAddVendorRole = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addVendorRole(vendorFormData)
      toast.success('Vendor role added successfully')
      setShowVendorForm(false)
      setVendorFormData({
        businessName: '',
        businessAddress: '',
        businessEmail: '',
        businessPhone: ''
      })
      onVendorRoleAdded?.()
      // Refresh the page to update the UI
      window.location.reload()
    } catch (err) {
      toast.error('Failed to add vendor role')
    }
  }

  const fetchAvailableRoles = async () => {
    try {
      const roles = await getRoles()
      setAvailableRoles(roles.data || [])
    } catch (err) {
      toast.error('Failed to fetch available roles')
    }
  }

  const openRoleSwitch = () => {
    setShowRoleSwitch(true)
    fetchAvailableRoles()
  }

  if (!user) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Account Management</h3>
        <div className="flex space-x-2">
          <button
            onClick={openRoleSwitch}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Switch Role</span>
          </button>
          {user.accountType === 'individual' && (
            <button
              onClick={() => setShowVendorForm(true)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Vendor Role</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {user.accountType === 'vendor' ? (
              <FiBriefcase className="w-5 h-5 text-blue-600" />
            ) : (
              <FiUser className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              {user.accountType}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber || 'Not provided'}</p>
          {user.businessName && (
            <p><strong>Business:</strong> {user.businessName}</p>
          )}
        </div>
      </div>

      {/* Role Switch Modal */}
      {showRoleSwitch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Switch Role</h3>
              <button
                onClick={() => setShowRoleSwitch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {availableRoles.map((role) => (
                <button
                  key={role.name}
                  onClick={() => handleRoleSwitch(role.name)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    {role.name === 'vendor' ? (
                      <FiBriefcase className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FiUser className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="font-medium capitalize">{role.name}</span>
                  </div>
                  {user.accountType === role.name && (
                    <FiCheck className="w-5 h-5 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Role Modal */}
      {showVendorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Vendor Role</h3>
              <button
                onClick={() => setShowVendorForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddVendorRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={vendorFormData.businessName}
                  onChange={(e) => setVendorFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  required
                  value={vendorFormData.businessAddress}
                  onChange={(e) => setVendorFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  value={vendorFormData.businessEmail}
                  onChange={(e) => setVendorFormData(prev => ({ ...prev, businessEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <input
                  type="tel"
                  required
                  value={vendorFormData.businessPhone}
                  onChange={(e) => setVendorFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVendorForm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <ButtonLoader loading={loading} loadingText="Adding vendor role...">
                    Add Vendor Role
                  </ButtonLoader>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}
