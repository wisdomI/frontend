'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import NewAdminMailModal from '@/components/ui/modals/NewAdminMailModal'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function CreateAdminPage() {
  const router = useRouter()
  const [showMailModal, setShowMailModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'verification_admin',
    status: 'active'
  })

  const [generatedPassword, setGeneratedPassword] = useState('')

  const generateStrongPassword = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    return `EventHub@${randomDigits}!`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.role) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      
      const password = generateStrongPassword()
      setGeneratedPassword(password)
      
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        adminType: formData.role,
        status: formData.status,
        password: password // Send generated password to backend
      }

      await adminAPI.createAdmin(payload)
      
      toast.success('Admin created successfully')
      setCreatedEmail(formData.email)
      setShowMailModal(true)
    } catch (error: any) {
      console.error('Failed to create admin:', (error as any).message)
      toast.error(error?.response?.data?.message || 'Failed to create admin account')
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Create New Admin</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">First Name</label>
              <input
                type="text"
                placeholder="Chisom"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Email Address</label>
              <input
                type="email"
                placeholder="chisom@eventhub.com"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Last Name</label>
              <input
                type="text"
                placeholder="Igwe"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Phone Number</label>
              <input
                type="tel"
                placeholder="08012345678"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            {/* Admin Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Admin Role</label>
              <div className="relative">
                <select
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="verification_admin">Verification Admin</option>
                  <option value="escrow_admin">Escrow Admin</option>
                  <option value="dispute_admin">Dispute Admin</option>
                  <option value="marketplace_admin">Marketplace Admin</option>
                  <option value="communication_admin">Communication Admin</option>
                  <option value="escrow_analytics_admin">Analytics Admin</option>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Admin'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <NewAdminMailModal 
        isOpen={showMailModal}
        onClose={() => setShowMailModal(false)}
        onConfirm={() => {
          setShowMailModal(false)
          router.push('/super-admin')
        }}
        email={createdEmail}
        phoneNumber={formData.phone}
        name={formData.firstName}
        password={generatedPassword}
      />
    </div>
  )
}
