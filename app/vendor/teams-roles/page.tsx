'use client'

import React, { useState } from 'react'
import { FiPlus, FiUser, FiUsers, FiSettings, FiEye, FiClock } from 'react-icons/fi'
import CreateRoleModal from '@/components/ui/modals/CreateRoleModal'
import ProfileStaffModal from '@/components/ui/modals/ProfileStaffModal'
import ChangeRoleModal from '@/components/ui/modals/ChangeRoleModal'
import TeamsSuccessModal from '@/components/ui/modals/TeamsSuccessModal'

export default function TeamsRolesPage() {
  const [activeTab, setActiveTab] = useState<'Team Members' | 'Role Permissions' | 'Invite History'>('Team Members')
  
  // Modal states
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false)
  const [isProfileStaffModalOpen, setIsProfileStaffModalOpen] = useState(false)
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successModalType, setSuccessModalType] = useState<'create-role' | 'profile-staff' | 'disable-profile'>('create-role')
  
  // Team members data
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: number
    name: string
    email: string
    phone: string
    role: string
    dateAdded: string
  }>>([
    // Sample data for testing
    {
      id: 1,
      name: 'Elizabeth Odeh',
      email: 'elizabethodeh@gmail.com',
      phone: '+23470397668988',
      role: 'Support',
      dateAdded: '20/07/2025; 02:25pm'
    }
  ])

  const roles = [
    {
      title: 'Co-ordinator',
      description: 'Manages day-to-day operations, client communication, and coordination',
      permissions: 'Can: View & respond to direct requests., manage bookings, communicate with clients, access reports'
    },
    {
      title: 'Sales Representative',
      description: 'Handles leads, proposals, and client acquisition for new events',
      permissions: 'Can: View requests, create bids, manage client contacts, basic access'
    },
    {
      title: 'Assistant',
      description: 'Provides administrative support with limited access to sensitive information',
      permissions: 'Can: View & respond to direct requests, basic client info, schedule bookings, limited editing'
    }
  ]

  const handleCreateRole = () => {
    setIsCreateRoleModalOpen(true)
  }

  const handleProfileStaff = () => {
    setIsProfileStaffModalOpen(true)
  }

  const handleViewHistory = () => {
    // Navigate to view history page
    console.log('Navigate to view history')
  }

  const handleRoleCreated = () => {
    setIsCreateRoleModalOpen(false)
    setSuccessModalType('create-role')
    setIsSuccessModalOpen(true)
  }

  const handleStaffProfiled = (staffData: { name: string; email: string; phone: string; role: string }) => {
    const newMember = {
      id: teamMembers.length + 1,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      role: staffData.role,
      dateAdded: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }) + '; ' + new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      })
    }
    
    setTeamMembers(prev => [...prev, newMember])
    setIsProfileStaffModalOpen(false)
    setSuccessModalType('profile-staff')
    setIsSuccessModalOpen(true)
  }

  const handleProfileDisabled = () => {
    setIsChangeRoleModalOpen(false)
    setSuccessModalType('disable-profile')
    setIsSuccessModalOpen(true)
  }

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teams & Roles</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {(['Team Members', 'Role Permissions', 'Invite History'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Team Members' && (
          <div className="space-y-8">
            {teamMembers.length === 0 ? (
              <>
                {/* Empty State */}
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiUser className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">You are currently the only user</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm">
                    Add staff to grow your team and streamline your event management
                  </p>
                  <button
                    onClick={handleProfileStaff}
                    className="px-6 py-3 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    style={{ backgroundColor: '#032D71' }}
                  >
                    <FiPlus className="w-5 h-5" />
                    Add Team Members
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Team Members Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                      <button
                        onClick={handleProfileStaff}
                        className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        style={{ backgroundColor: '#032D71' }}
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Team Member
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teamMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.dateAdded}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Available Roles Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h4>
                    <p className="text-gray-600 mb-4 text-sm">{role.description}</p>
                    <p className="text-sm text-gray-500 font-medium">{role.permissions}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Role Permissions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Role Permissions</h3>
              <button
                onClick={handleCreateRole}
                className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#032D71' }}
              >
                <FiPlus className="w-4 h-4" />
                Create Role
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">Role permissions management will be implemented here.</p>
            </div>
          </div>
        )}

        {activeTab === 'Invite History' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Invite History</h3>
              <button
                onClick={handleViewHistory}
                className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#032D71' }}
              >
                <FiEye className="w-4 h-4" />
                View History
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">Invite history will be displayed here.</p>
            </div>
          </div>
        )}

        {/* Action Buttons for other tabs */}
        {(activeTab === 'Role Permissions' || activeTab === 'Invite History') && (
          <div className="flex gap-4 justify-end mt-8">
            <button
              onClick={handleCreateRole}
              className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#032D71' }}
            >
              <FiPlus className="w-4 h-4" />
              Create Role
            </button>
            <button
              onClick={handleProfileStaff}
              className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#032D71' }}
            >
              <FiUsers className="w-4 h-4" />
              Profile Staff
            </button>
            <button
              onClick={handleViewHistory}
              className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#032D71' }}
            >
              <FiClock className="w-4 h-4" />
              View History
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onConfirm={handleRoleCreated}
      />

      <ProfileStaffModal
        isOpen={isProfileStaffModalOpen}
        onClose={() => setIsProfileStaffModalOpen(false)}
        onSave={handleStaffProfiled}
      />

      <ChangeRoleModal
        isOpen={isChangeRoleModalOpen}
        onClose={() => setIsChangeRoleModalOpen(false)}
        onConfirm={handleProfileDisabled}
        action="Disable"
      />

      <TeamsSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        type={successModalType}
      />
    </div>
  )
}