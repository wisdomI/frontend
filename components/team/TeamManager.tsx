'use client'

import React, { useState, useEffect } from 'react'
import { useTeamManagement } from '@/hooks/useTeamManagement'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiUsers, FiMail, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

export default function TeamManager() {
  const {
    teams,
    team,
    members,
    stats,
    loading,
    error,
    fetchTeams,
    fetchTeamById,
    fetchStats,
    createTeam,
    updateTeam,
    deleteTeam,
    toggleTeamStatus,
    fetchMembers,
    fetchMemberById,
    inviteMember,
    updateMember,
    removeMember,
    resendInvitation
  } = useTeamManagement()

  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
  const [showEditTeamModal, setShowEditTeamModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  useEffect(() => {
    fetchTeams()
    fetchMembers()
    fetchStats()
  }, [])

  const handleCreateTeam = async (teamData: any) => {
    try {
      await createTeam(teamData)
      toast.success('Team created successfully')
      setShowCreateTeamModal(false)
    } catch (err) {
      toast.error('Failed to create team')
    }
  }

  const handleUpdateTeam = async (id: string, teamData: any) => {
    try {
      await updateTeam(id, teamData)
      toast.success('Team updated successfully')
      setShowEditTeamModal(false)
      setEditingTeam(null)
    } catch (err) {
      toast.error('Failed to update team')
    }
  }

  const handleDeleteTeam = async (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteTeam(id)
        toast.success('Team deleted successfully')
      } catch (err) {
        toast.error('Failed to delete team')
      }
    }
  }

  const handleToggleTeamStatus = async (id: string) => {
    try {
      await toggleTeamStatus(id)
      toast.success('Team status updated')
    } catch (err) {
      toast.error('Failed to update team status')
    }
  }

  const handleInviteMember = async (inviteData: any) => {
    try {
      await inviteMember(inviteData)
      toast.success('Invitation sent successfully')
      setShowInviteModal(false)
      fetchMembers()
    } catch (err) {
      toast.error('Failed to send invitation')
    }
  }

  const handleUpdateMember = async (memberId: string, memberData: any) => {
    try {
      await updateMember(memberId, memberData)
      toast.success('Member updated successfully')
      fetchMembers()
    } catch (err) {
      toast.error('Failed to update member')
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(memberId)
        toast.success('Member removed successfully')
        fetchMembers()
      } catch (err) {
        toast.error('Failed to remove member')
      }
    }
  }

  const handleResendInvitation = async (memberId: string) => {
    try {
      await resendInvitation(memberId)
      toast.success('Invitation resent successfully')
    } catch (err) {
      toast.error('Failed to resend invitation')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'invited': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage your teams and team members</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Team</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiMail className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTeams || 0}</div>
            <div className="text-sm text-gray-600">Total Teams</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.activeTeams || 0}</div>
            <div className="text-sm text-gray-600">Active Teams</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.totalMembers || 0}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingInvitations || 0}</div>
            <div className="text-sm text-gray-600">Pending Invites</div>
          </div>
        </div>
      )}

      {/* Teams Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Teams</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {teams.map((team) => {
            const teamStatus = (team as any).status ?? 'active'
            const memberCount = (team as any).memberCount ?? 0

            return (
              <div key={team.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{team.name}</h4>
                    <p className="text-sm text-gray-600">{team.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teamStatus)}`}>
                        {teamStatus}
                      </span>
                      <span className="text-xs text-gray-500">
                        {memberCount} members
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team)
                      fetchTeamById(team.id)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Team"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTeam(team)
                      setShowEditTeamModal(true)
                    }}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Edit Team"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleTeamStatus(team.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Toggle Status"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Team"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              </div>
            )
          })}
        </div>
        {teams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No teams found</div>
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => {
                const memberUser = (member as any).user ?? {}
                const memberTeam = (member as any).team ?? {}
                const memberStatus = (member as any).status ?? 'active'
                const memberRole = (member as any).role ?? 'member'
                const memberCreatedAt = (member as any).createdAt

                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {memberUser.firstName?.charAt(0)}
                            {memberUser.lastName?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {memberUser.firstName} {memberUser.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {memberTeam.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {memberUser.email ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {memberRole}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMemberStatusColor(memberStatus)}`}>
                      {memberStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {memberCreatedAt ? new Date(memberCreatedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {memberStatus === 'invited' && (
                        <button
                          onClick={() => handleResendInvitation(member.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Resend Invitation"
                        >
                          <FiMail className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedMember(member)
                          fetchMemberById(member.id)
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="View Member"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove Member"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {members.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No team members found</div>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <CreateTeamModal
          isOpen={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          onSubmit={handleCreateTeam}
        />
      )}

      {/* Edit Team Modal */}
      {showEditTeamModal && editingTeam && (
        <EditTeamModal
          isOpen={showEditTeamModal}
          onClose={() => {
            setShowEditTeamModal(false)
            setEditingTeam(null)
          }}
          team={editingTeam}
          onSubmit={(data: any) => handleUpdateTeam(editingTeam.id, data)}
        />
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteMember}
          teams={teams}
        />
      )}

      {/* View Team Modal */}
      {selectedTeam && (
        <ViewTeamModal
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
          team={selectedTeam}
          onUpdateMember={handleUpdateMember}
          onRemoveMember={handleRemoveMember}
        />
      )}

      {/* View Member Modal */}
      {selectedMember && (
        <ViewMemberModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember}
          onUpdate={handleUpdateMember}
          onRemove={handleRemoveMember}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}
    </div>
  )
}

// Placeholder components - these would need to be implemented
function CreateTeamModal({ isOpen, onClose, onSubmit }: any) {
  return null
}

function EditTeamModal({ isOpen, onClose, team, onSubmit }: any) {
  return null
}

function InviteMemberModal({ isOpen, onClose, onSubmit, teams }: any) {
  return null
}

function ViewTeamModal({ isOpen, onClose, team, onUpdateMember, onRemoveMember }: any) {
  return null
}

function ViewMemberModal({ isOpen, onClose, member, onUpdate, onRemove }: any) {
  return null
}
