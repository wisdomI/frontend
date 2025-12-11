"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface CommunicationDashboardProps {
  basePath?: string
  userRole?: string
}

export default function CommunicationDashboard({ basePath = '/communication-admin', userRole = 'Communication Admin' }: CommunicationDashboardProps) {
  const stats = [
    { label: 'Active Campaigns', value: '12', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Messages Sent', value: '45.6K', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
    { label: 'Open Rate', value: '68%', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
  ]

  const announcements = [
    {
      title: 'New Feature Launch',
      sentTo: 'All Users | Oct 7, 2025',
      delivery: 'Push Notification, Email',
      delivered: '5,234',
      opens: '3,567 (68%)',
      status: null
    },
    {
      title: 'Maintenance Notice',
      sentTo: 'All Vendors',
      delivery: 'Push Notification, Email',
      scheduled: 'Oct 10, 2025 - 2:00 AM',
      status: 'Scheduled',
      statusColor: 'bg-yellow-400 text-white' 
    }
  ]

  const tickets = [
    { id: '1234', user: 'John Doe', type: 'Client', category: 'General Inquiry', status: 'Open', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1235', user: 'Mary Jane', type: 'Client', category: 'Payment Issue', status: 'In Review', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1236', user: 'Ile Iyan Foods', type: 'Vendor', category: 'Dispute', status: 'Escalated', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1237', user: 'John Doe', type: 'Client', category: 'Account Issue', status: 'Open', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1238', user: 'Elite Catering', type: 'Vendor', category: 'Payment Issue', status: 'In Review', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1239', user: 'John Doe', type: 'Client', category: 'Dispute', status: 'Open', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1240', user: 'John Doe', type: 'Client', category: 'General Inquiry', status: 'Open', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1241', user: 'John Doe', type: 'Client', category: 'Dispute', status: 'In Review', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
    { id: '1242', user: 'Ruthie Rentals', type: 'Vendor', category: 'Payment Issue', status: 'In Review', dateCreated: '2025-10-15', dateOpened: '2025-10-16 09:30 AM' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-700'
      case 'In Review': return 'bg-yellow-100 text-yellow-700'
      case 'Escalated': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-asul text-gray-800 flex items-center gap-2">
          Welcome Back, {userRole} <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            <span className={`text-3xl font-bold font-asul ${stat.color} mb-2`}>{stat.value}</span>
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
          {announcements.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Sent to: {item.sentTo}</p>
                <p className="text-xs text-gray-400 mt-1">Delivery: {item.delivery}</p>
                {item.scheduled && (
                  <p className="text-xs text-gray-500 mt-1">Scheduled: {item.scheduled}</p>
                )}
              </div>
              <div className="mt-4 md:mt-0 text-right">
                {item.status === 'Scheduled' ? (
                  <span className="px-4 py-1.5 rounded-md text-sm font-medium bg-[#FBBF24] text-white">
                    {item.status}
                  </span>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Delivered: {item.delivered}</p>
                    <p className="text-sm text-gray-600">Opens: {item.opens}</p>
                  </div>
                )}
              </div>
            </div>
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
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">Case #{ticket.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{ticket.user}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.type}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.category}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.dateCreated}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{ticket.dateOpened}</td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`${basePath}/chat/${ticket.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#0B2E6F] hover:bg-[#092456]"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-center mt-8 pb-4 gap-4">
            <p className="text-sm text-gray-500">
               Showing 1- 10 of 20
            </p>
            <div className="flex items-center gap-2 text-sm">
               <button className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                 </svg>
                 Previous
               </button>
               
               <button className="w-8 h-8 flex items-center justify-center bg-[#0B2E6F] text-white rounded-lg text-sm font-medium">1</button>
               <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">2</button>
               <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">3</button>
               <span className="text-gray-400 px-1">...</span>
               <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">7</button>
               <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">10</button>
               
               <button className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-gray-700">
                 Next
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
