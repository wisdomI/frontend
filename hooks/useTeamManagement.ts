import { useState, useEffect } from 'react'
import { teamsAPI } from '@/lib/api'
import { Team, TeamMember, CreateTeamRequest, UpdateTeamRequest, InviteTeamMemberRequest, TeamStats } from '@/types/api'

export const useTeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.getAll(params)
      setTeams(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teams')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.getById(id)
      setTeam(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.getStats()
      setStats(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team stats')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createTeam = async (data: CreateTeamRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.create(data)
      setTeams(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTeam = async (id: string, data: UpdateTeamRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.update(id, data)
      setTeams(prev => 
        prev.map(team => 
          team.id === id ? response.data.data : team
        )
      )
      if (team?.id === id) {
        setTeam(response.data.data)
      }
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update team')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTeam = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await teamsAPI.delete(id)
      setTeams(prev => prev.filter(team => team.id !== id))
      if (team?.id === id) {
        setTeam(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete team')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleTeamStatus = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.toggleStatus(id)
      setTeams(prev => 
        prev.map(team => 
          team.id === id ? response.data.data : team
        )
      )
      if (team?.id === id) {
        setTeam(response.data.data)
      }
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle team status')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async (teamId?: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = teamId 
        ? await teamsAPI.getMembers(teamId)
        : await teamsAPI.getAllMembers()
      setMembers(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team members')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchMemberById = async (memberId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.getMemberById(memberId)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team member')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const inviteMember = async (data: InviteTeamMemberRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.inviteMember(data)
      setMembers(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to invite team member')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMember = async (memberId: string, data: { role?: string; status?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.updateMember(memberId, data)
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId ? response.data.data : member
        )
      )
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update team member')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      setLoading(true)
      setError(null)
      await teamsAPI.removeMember(memberId)
      setMembers(prev => prev.filter(member => member.id !== memberId))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove team member')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resendInvitation = async (memberId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teamsAPI.resendInvitation(memberId)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend invitation')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
    fetchMembers()
    fetchStats()
  }, [])

  return {
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
    resendInvitation,
  }
}
