'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Trash2,
  Plus,
} from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    {
      label: 'Total Users',
      value: '-',
      icon: null,
    },
    {
      label: 'Active Events',
      value: '-',
      icon: null,
    },
    {
      label: 'Escrow Balance',
      value: '-',
      icon: null,
    },
    {
      label: 'Active Disputes',
      value: '-',
      icon: null,
    },
  ])

  const [admins, setAdmins] = useState<any[]>([])
  const [escalations, setEscalations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [dashboardRes, adminsRes, activityLogsRes] = await Promise.all([
          adminAPI.getDashboard().catch(e => ({ data: { data: null } })), // Fallback if fails
          adminAPI.getAllAdmins().catch(e => ({ data: { data: [] } })),
          adminAPI.getActivityLogs().catch(e => ({ data: { data: [] } }))
        ])
        
        // Parse Dashboard Stats
        const dashboardData = dashboardRes.data?.data || {}
        setStats([
          {
            label: 'Total Users',
            value: dashboardData.totalUsers?.toLocaleString() || '0',
            icon: null,
          },
          {
            label: 'Active Events',
            value: dashboardData.activeEvents?.toLocaleString() || '0',
            icon: null,
          },
          {
            label: 'Escrow Balance',
            value: dashboardData.escrowBalance ? `₦${dashboardData.escrowBalance.toLocaleString()}` : '₦0',
            icon: null,
          },
          {
            label: 'Active Disputes',
            value: dashboardData.activeDisputes?.toLocaleString() || '0',
            icon: null,
          },
        ])

        // Parse Admins
        if (adminsRes.data?.data) {
          setAdmins(Array.isArray(adminsRes.data.data) ? adminsRes.data.data : [])
        }

        // Parse Escalations (using Activity Logs or Dashboard alerts as proxy if available)
        // For now, we'll keep the mock structure if API doesn't return escalations directly
        // But if dashboardData has escalations, use them.
        if (dashboardData.escalations) {
           setEscalations(dashboardData.escalations)
        } else {
            // Keep some mock/empty or try to derive from logs
            setEscalations([])
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', (error as any).message)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back, (Super Admin)</h1>
          <span className="text-2xl">👋🏽</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
              ) : (
                  <p className="text-2xl font-bold text-[#0B2E6F] mb-2">{stat.value}</p>
              )}
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
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    admins.length > 0 ? (
                        admins.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors">
                            <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{admin.firstName} {admin.lastName}</span>
                                <span className="text-xs text-gray-500">{admin.adminType || admin.role || 'Admin'}</span>
                            </div>
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
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No admins found</p>
                    )
                )}
                
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
                {escalations.length > 0 ? (
                    escalations.map((item: any) => (
                    <Link 
                        key={item.id}
                        href={`/super-admin/escalations/${item.id}`}
                        className={`block p-4 rounded-lg ${item.color || 'bg-yellow-50'} ${item.border || 'border-l-4 border-yellow-400'} hover:opacity-90 transition-opacity`}
                    >
                        <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </Link>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No recent escalations</p>
                )}
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
                  <p className="text-xs text-gray-500 mt-1">View Invoices</p>
                </Link>
                <Link href="/super-admin/access-history" className="bg-white p-6 rounded-xl border border-black flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900">Access History</h3>
                  <p className="text-xs text-gray-500 mt-1">View Access Logs</p>
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
                  <p className="text-xs text-gray-500 mt-1">Manage rates</p>
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
