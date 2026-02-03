'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  MoreVertical,
  ChevronRight,
  Shield,
  Trash2,
  Lock,
  Eye
} from 'lucide-react'
import CustomDropdown from '@/components/ui/CustomDropdown'
import { authAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function SuperAdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClients: 0,
    newThisMonth: 0,
    suspended: 0
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await authAPI.getAll({ limit: 100 }).catch(() => ({ data: { data: [] } }))
        
        if (response.data?.data) {
          const userList = Array.isArray(response.data.data) ? response.data.data : []
          setUsers(userList)
          
          // Calculate stats locally if backend doesn't provide them yet
          // Or we could use a specific stats endpoint if available
          setStats({
            totalUsers: userList.length,
            activeClients: userList.filter((u: any) => u.accountType === 'client' || u.accountType === 'individual').length,
            newThisMonth: userList.filter((u: any) => {
              const date = new Date(u.createdAt)
              const now = new Date()
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            }).length,
            suspended: userList.filter((u: any) => u.status === 'suspended').length // Assuming status field exists
          })
        }
      } catch (error) {
        console.error('Failed to fetch users:', (error as any).message)
        toast.error('Failed to load users')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const name = `${user.firstName || ''} ${user.lastName || ''} ${user.businessName || ''}`.trim()
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    // Map backend roles to filter options if needed
    const userRole = user.accountType === 'individual' || user.accountType === 'business' ? 'Client' : 
                     user.accountType === 'vendor' ? 'Vendor' : user.accountType
                     
    const matchesRole = roleFilter === 'All Roles' || 
                        (roleFilter === 'Client' && (user.accountType === 'individual' || user.accountType === 'business' || user.accountType === 'client')) ||
                        (roleFilter === 'Vendor' && user.accountType === 'vendor')
                        
    // Status handling might vary based on backend response
    const matchesStatus = statusFilter === 'All Status' || (user.status || 'Active') === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-raleway text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-raleway mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Clients</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-raleway mt-2">{stats.activeClients}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">New This Month</h3>
          <p className="text-3xl font-bold text-green-600 font-raleway mt-2">+{stats.newThisMonth}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Suspended</h3>
          <p className="text-3xl font-bold text-red-500 font-raleway mt-2">{stats.suspended}</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B2E6F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <div className="w-40 min-w-[160px]">
            <CustomDropdown 
              options={[
                { label: 'All Roles', value: 'All Roles' },
                { label: 'Client', value: 'Client' },
                { label: 'Vendor', value: 'Vendor' },
              ]}
              selected={roleFilter}
              onChange={setRoleFilter}
              buttonClassName="py-2"
            />
          </div>
          <div className="w-40 min-w-[160px]">
             <CustomDropdown 
              options={[
                { label: 'All Status', value: 'All Status' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' },
              ]}
              selected={statusFilter}
              onChange={setStatusFilter}
              buttonClassName="py-2"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 bg-white whitespace-nowrap">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Name / Email</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Role</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Joined Date</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Last Active</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-8">
                          <div className="space-y-4">
                              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 animate-pulse rounded"></div>)}
                          </div>
                      </td>
                  </tr>
              ) : (
                filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#0B2E6F] font-bold text-sm">
                        {(user.firstName || user.businessName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName ? `${user.firstName} ${user.lastName}` : (user.businessName || 'Unknown')}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{user.accountType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      (user.status || 'Active') === 'Active' ? 'bg-green-100 text-green-700' : 
                      (user.status || 'Active') === 'Suspended' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastActive || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#0B2E6F] hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend User">
                        <Lock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No users found</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} users</p>
          {/* Pagination controls */}
        </div>
      </div>
    </div>
  )
}

