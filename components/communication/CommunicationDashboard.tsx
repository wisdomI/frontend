"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { communicationAdminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface CommunicationDashboardProps {
  basePath?: string
  userRole?: string
}

export default function CommunicationDashboard({ basePath = '/communication-admin', userRole = 'Communication Admin' }: CommunicationDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Active Campaigns', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Messages Sent', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
    { label: 'Open Rate', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
  ])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [dashboardRes, announcementsRes, scheduledRes, chatsRes] = await Promise.all([
                communicationAdminAPI.getDashboard().catch(() => ({ data: { data: {} } })),
                communicationAdminAPI.getAnnouncements().catch(() => ({ data: { data: [] } })),
                communicationAdminAPI.getScheduledAnnouncements().catch(() => ({ data: { data: [] } })),
                communicationAdminAPI.getConversations().catch(() => ({ data: { data: [] } }))
            ])

            const dashboardData = dashboardRes.data?.data || {}
            setStats([
                { label: 'Active Campaigns', value: dashboardData.activeCampaigns?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
                { label: 'Messages Sent', value: dashboardData.messagesSent?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
                { label: 'Open Rate', value: dashboardData.openRate ? `${dashboardData.openRate}%` : '0%', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
            ])

            const allAnnouncements = [
                ...(Array.isArray(announcementsRes.data.data) ? announcementsRes.data.data : []),
                ...(Array.isArray(scheduledRes.data.data) ? scheduledRes.data.data : []).map((a: any) => ({ ...a, status: 'Scheduled' }))
            ]
            setAnnouncements(allAnnouncements.slice(0, 5)) // Show top 5

            if (chatsRes.data?.data) {
                setTickets(Array.isArray(chatsRes.data.data) ? chatsRes.data.data : [])
            }

        } catch (error) {
            console.error('Error loading communication dashboard:', error)
            toast.error('Failed to load communication data')
        } finally {
            setIsLoading(false)
        }
    }
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-700'
      case 'In Review': return 'bg-yellow-100 text-yellow-700'
      case 'Escalated': return 'bg-blue-100 text-blue-700'
      case 'Scheduled': return 'bg-yellow-400 text-white'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-raleway text-gray-800 flex items-center gap-2">
          Welcome Back, {userRole} <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
            ) : (
                <span className={`text-3xl font-bold font-raleway ${stat.color} mb-2`}>{stat.value}</span>
            )}
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Announcements Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
          <Link 
            href={`${basePath}/announcement/create`}
            className="flex items-center gap-2 text-sm text-white bg-[#0B2E6F] px-4 py-2 rounded-lg hover:bg-[#092456]"
          >
            <Plus className="w-4 h-4" />
            Create Announcement
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {isLoading ? (
              <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>)}
              </div>
          ) : (
            announcements.length > 0 ? announcements.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Sent to: {item.recipientType || item.sentTo}</p>
                <p className="text-xs text-gray-400 mt-1">Delivery: {item.deliveryType || item.delivery}</p>
                {item.scheduledAt && (
                  <p className="text-xs text-gray-500 mt-1">Scheduled: {new Date(item.scheduledAt).toLocaleString()}</p>
                )}
              </div>
              <div className="mt-4 md:mt-0 text-right">
                {item.status === 'Scheduled' ? (
                  <span className="px-4 py-1.5 rounded-md text-sm font-medium bg-[#FBBF24] text-white">
                    {item.status}
                  </span>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Delivered: {item.delivered || '-'}</p>
                    <p className="text-sm text-gray-600">Opens: {item.opens || '-'}</p>
                  </div>
                )}
              </div>
            </div>
          )) : (
              <p className="text-gray-500 text-center">No recent announcements</p>
          ))}
        </div>
      </div>

      {/* Chat Support Queue */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chat Support Queue</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="pb-4 px-4">TICKET ID</th>
                  <th className="pb-4 px-4">USER</th>
                  <th className="pb-4 px-4">USER TYPE</th>
                  <th className="pb-4 px-4">CATEGORY</th>
                  <th className="pb-4 px-4">STATUS</th>
                  <th className="pb-4 px-4">DATE CREATED</th>
                  <th className="pb-4 px-4">DATE OPENED</th>
                  <th className="pb-4 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                    <tr>
                        <td colSpan={8} className="py-8">
                            <div className="flex justify-center"><div className="h-8 w-full max-w-md bg-gray-100 animate-pulse rounded"></div></div>
                        </td>
                    </tr>
                ) : (
                 tickets.length > 0 ? tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">Case #{ticket.id.substring(0, 8)}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{ticket.user?.name || ticket.participants?.[0]?.firstName || 'Unknown'}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.user?.type || ticket.participants?.[0]?.accountType || '-'}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.category || 'General'}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(ticket.status || 'Open')}`}>
                        {ticket.status || 'Open'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : '-'}</td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`${basePath}/chat/${ticket.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#0B2E6F] hover:bg-[#092456]"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={8} className="py-4 text-center text-sm text-gray-500">No active tickets</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-center mt-8 pb-4 gap-4">
             {/* Pagination controls would go here */}
          </div>
        </div>
      </div>
    </div>
  )
}
