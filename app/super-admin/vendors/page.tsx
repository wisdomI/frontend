'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Shield,
  Star,
  MapPin
} from 'lucide-react'
import CustomDropdown from '@/components/ui/CustomDropdown'

// Mock Data
const vendors = [
  { 
    id: 1, 
    businessName: 'Royal Events Ltd', 
    contactName: 'James Royal',
    email: 'contact@royalevents.com', 
    category: 'Event Planner', 
    status: 'Verified', 
    rating: 4.8,
    location: 'Lagos, Nigeria',
    dateJoined: '2025-01-10'
  },
  { 
    id: 2, 
    businessName: 'Sparkle Decor', 
    contactName: 'Sarah Sparkle',
    email: 'sarah@sparkledecor.com', 
    category: 'Decoration', 
    status: 'Pending', 
    rating: 0,
    location: 'Abuja, Nigeria',
    dateJoined: '2025-02-15'
  },
  { 
    id: 3, 
    businessName: 'Elite Catering Services', 
    contactName: 'Chef Michael',
    email: 'info@elitecatering.com', 
    category: 'Catering', 
    status: 'Verified', 
    rating: 4.5,
    location: 'Lagos, Nigeria',
    dateJoined: '2024-11-20'
  },
  { 
    id: 4, 
    businessName: 'Sound Masters', 
    contactName: 'DJ Cool',
    email: 'dj@soundmasters.com', 
    category: 'Entertainment', 
    status: 'Rejected', 
    rating: 0,
    location: 'Port Harcourt, Nigeria',
    dateJoined: '2025-03-01'
  },
  { 
    id: 5, 
    businessName: 'Lens Magic Photography', 
    contactName: 'Peter Lens',
    email: 'peter@lensmagic.com', 
    category: 'Photography', 
    status: 'Verified', 
    rating: 4.9,
    location: 'Lagos, Nigeria',
    dateJoined: '2024-12-05'
  },
]

export default function SuperAdminVendorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All Categories' || vendor.category === categoryFilter
    const matchesStatus = statusFilter === 'All Status' || vendor.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-asul text-gray-800">Vendor Management</h1>
        <p className="text-gray-600 mt-1">Oversee vendor verification, performance, and details</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Vendors</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-asul mt-2">1,240</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Verified Vendors</h3>
          <p className="text-3xl font-bold text-green-600 font-asul mt-2">985</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Pending Verification</h3>
          <p className="text-3xl font-bold text-amber-500 font-asul mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Top Rated (>4.5)</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-asul mt-2">320</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search vendors by business name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B2E6F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <div className="w-40 min-w-[160px]">
            <CustomDropdown 
              options={[
                { label: 'All Categories', value: 'All Categories' },
                { label: 'Event Planner', value: 'Event Planner' },
                { label: 'Catering', value: 'Catering' },
                { label: 'Photography', value: 'Photography' },
                { label: 'Decoration', value: 'Decoration' },
                { label: 'Entertainment', value: 'Entertainment' },
              ]}
              selected={categoryFilter}
              onChange={setCategoryFilter}
              buttonClassName="py-2"
            />
          </div>
          <div className="w-40 min-w-[160px]">
             <CustomDropdown 
              options={[
                { label: 'All Status', value: 'All Status' },
                { label: 'Verified', value: 'Verified' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
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

      {/* Vendors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Business / Contact</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Location</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Rating</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E0E7FF] rounded-lg flex items-center justify-center text-[#0B2E6F] font-bold text-sm">
                        {vendor.businessName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vendor.businessName}</p>
                        <p className="text-sm text-gray-500">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vendor.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {vendor.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      vendor.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                      vendor.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {vendor.status === 'Verified' && <Shield className="w-3 h-3 mr-1" />}
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className={`w-4 h-4 ${vendor.rating > 0 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      {vendor.rating > 0 ? vendor.rating : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#0B2E6F] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
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
          <p className="text-sm text-gray-500">Showing {filteredVendors.length} of {vendors.length} vendors</p>
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

