'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown } from 'lucide-react'

export default function EditAdminPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // In a real app, we would fetch admin data using params.id
  const [formData, setFormData] = useState({
    fullName: 'Chisom Igwe',
    email: 'chisom@eventhub.com',
    existingRole: 'Verification Admin',
    newRole: 'Communication Admin',
    status: 'Active'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Update logic here
    router.push('/super-admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Edit Admin</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Full Name</label>
              <input
                type="text"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Email Address</label>
              <input
                type="email"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Existing Admin Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Existing Admin Role</label>
              <div className="relative">
                <select
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] cursor-pointer"
                  value={formData.existingRole}
                  onChange={(e) => setFormData({ ...formData, existingRole: e.target.value })}
                >
                  <option value="Verification Admin">Verification Admin</option>
                  <option value="Escrow Admin">Escrow Admin</option>
                  <option value="Dispute Admin">Dispute Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Status</label>
              <div className="relative">
                <select
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Add Admin Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Add Admin Role</label>
              <div className="relative">
                <select
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] cursor-pointer"
                  value={formData.newRole}
                  onChange={(e) => setFormData({ ...formData, newRole: e.target.value })}
                >
                  <option value="Communication Admin">Communication Admin</option>
                  <option value="Analytics Admin">Analytics Admin</option>
                  <option value="Marketplace Admin">Marketplace Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors min-w-[200px]"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-w-[200px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

