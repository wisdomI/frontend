'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  Trash2,
  Plus,
} from 'lucide-react'

// Mock Data
const stats = [
  {
    label: 'Total Users',
    value: '5,235',
    icon: null, // No icon shown in the design for stats, just centered text
  },
  {
    label: 'Active Events',
    value: '456',
    icon: null,
  },
  {
    label: 'Escrow Balance',
    value: '₦12.5M',
    icon: null,
  },
  {
    label: 'Active Disputes',
    value: '46',
    icon: null,
  },
]

const admins = [
  { role: 'Verification Admin', id: 1 },
  { role: 'Escrow Admin', id: 2 },
  { role: 'Dispute Admin', id: 3 },
  { role: 'Marketplace Admin', id: 4 },
  { role: 'Analytics Admin', id: 5 },
  { role: 'Communication Admin', id: 6 },
]

const escalations = [
  {
    id: 1,
    title: 'High Value Payout',
    description: '₦2.5M - Awaiting approval',
    color: 'bg-[#FFE8C8]', // Light Orange/Yellow
    border: 'border-l-4 border-[#FFA500]',
  },
  {
    id: 2,
    title: 'Flagged Vendor',
    description: 'Verification Admin flagged account',
    color: 'bg-[#FAD2E1]', // Light Pink
    border: 'border-l-4 border-[#E91E63]',
  },
  {
    id: 3,
    title: 'Dispute Escalation',
    description: 'Case #1234 needs final decision',
    color: 'bg-[#FFFAC8]', // Pale Yellow
    border: 'border-l-4 border-[#FFD700]',
  },
  {
    id: 4,
    title: 'Missed Payment Schedule',
    description: 'Escrow Admin flagged Client',
    color: 'bg-[#D0D3FC]', // Light Blue/Purple
    border: 'border-l-4 border-[#4B0082]',
  },
]

export default function AdminDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Ms.Fola (Super Admin)</h1>
          <span className="text-2xl">👋🏽</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#0B2E6F] mb-2">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2/3 width) - Admin Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Admin Management</h2>
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">{admin.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/super-admin/admins/${admin.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 flex justify-center">
                  <Link 
                    href="/super-admin/admins/create"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1/3 width) - Recent Escalations */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Escalations</h2>
              <div className="space-y-4">
                {escalations.map((item) => (
                  <Link 
                    key={item.id}
                    href={`/super-admin/escalations/${item.id}`}
                    className={`block p-4 rounded-lg ${item.color} ${item.border} hover:opacity-90 transition-opacity`}
                  >
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Sections - Outside the grid */}
        <div className="space-y-8">
            {/* Quick Access */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/super-admin/invoices" className="bg-white p-6 rounded-xl border border-black flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900">All Invoices</h3>
                  <p className="text-xs text-gray-500 mt-1">100 invoices</p>
                </Link>
                <Link href="/super-admin/access-history" className="bg-white p-6 rounded-xl border border-black flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900">Access History</h3>
                  <p className="text-xs text-gray-500 mt-1">2 Active Admins</p>
                </Link>
                <Link href="/super-admin/analytics" className="bg-white p-6 rounded-xl border border-black flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-xs text-gray-500 mt-1">All analytics & reports</p>
                </Link>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/super-admin/settings/commission" className="bg-white p-6 rounded-xl border border-black flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900">Commission rates</h3>
                  <p className="text-xs text-gray-500 mt-1">Currently 5%</p>
                </Link>
                <Link href="/super-admin/settings/escrow" className="bg-white p-6 rounded-xl border border-black flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900">Escrow Rules</h3>
                  <p className="text-xs text-gray-500 mt-1">Release Timelines</p>
                </Link>
                <Link href="/super-admin/settings/partnerships" className="bg-white p-6 rounded-xl border border-black flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900">Partnerships</h3>
                  <p className="text-xs text-gray-500 mt-1">PSPs & Insurance</p>
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
