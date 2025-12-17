'use client'

import React, { useState } from 'react'
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

// Mock Data
const users = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'johndoe@gmail.com', 
    role: 'Client', 
    status: 'Active', 
    dateJoined: '2025-01-15',
    eventsCreated: 5,
    lastActive: '2 mins ago'
  },
  { 
    id: 2, 
    name: 'Sarah Smith', 
    email: 'sarah.smith@yahoo.com', 
    role: 'Client', 
    status: 'Active', 
    dateJoined: '2025-02-10',
    eventsCreated: 12,
    lastActive: '1 day ago'
  },
  { 
    id: 3, 
    name: 'Michael Johnson', 
    email: 'mj.events@gmail.com', 
    role: 'Vendor', 
    status: 'Suspended', 
    dateJoined: '2024-11-05',
    eventsCreated: 0,
    lastActive: '2 weeks ago'
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    email: 'emily.d@outlook.com', 
    role: 'Client', 
    status: 'Active', 
    dateJoined: '2025-03-20',
    eventsCreated: 2,
    lastActive: '5 hours ago'
  },
  { 
    id: 5, 
    name: 'David Wilson', 
    email: 'david.w@gmail.com', 
    role: 'Client', 
    status: 'Inactive', 
    dateJoined: '2024-12-01',
    eventsCreated: 0,
    lastActive: '3 months ago'
  },
]

export default function SuperAdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-asul text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-asul mt-2">12,450</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Clients</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-asul mt-2">8,234</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">New This Month</h3>
          <p className="text-3xl font-bold text-green-600 font-asul mt-2">+450</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Suspended</h3>
          <p className="text-3xl font-bold text-red-500 font-asul mt-2">23</p>
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
                { label: 'Vendor', value: 'Vendor' }, // Though vendors might be in a separate tab, sometimes mixed
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#0B2E6F] font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      user.status === 'Suspended' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.dateJoined}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastActive}</td>
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
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-[#0B2E6F] text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

