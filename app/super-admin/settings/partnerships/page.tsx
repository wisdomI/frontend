'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'

export default function PartnershipsSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Payment Service Providers (PSPs) & Insurance</h1>
        </div>

        <div className="space-y-12">
          {/* PSP Management */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">PSP Management</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Active PSP</h3>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Flutterwave</p>
                    <p className="text-xs text-gray-500">Status: Active</p>
                  </div>
                  <button className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors">
                    Disable
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Paystack</p>
                    <p className="text-xs text-gray-500">Status: Active</p>
                  </div>
                  <button className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors">
                    Disable
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Add New PSP</h3>
                <div className="relative">
                  <select className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] cursor-pointer">
                    <option>Select new PSP</option>
                    <option>Stripe</option>
                    <option>Monnify</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                <button className="w-full py-2.5 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors">
                  Add PSP
                </button>
              </div>
            </div>
          </section>

          {/* Insurance Management */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Insurance Management</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Active Coverage</p>
                <p className="text-2xl font-bold text-green-600">5,345</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Active Insurance Plans</h3>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Client Protection</p>
                    <p className="text-xs text-gray-500">AXA Insurance</p>
                    <p className="text-xs text-gray-400">Active till Dec 31, 2025</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm text-green-600 font-medium">2k + Coverage</p>
                    <button className="px-4 py-1.5 bg-[#00A3FF] text-white text-xs font-medium rounded hover:bg-[#008DD1] transition-colors">
                      View details
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Vendor Protection</p>
                    <p className="text-xs text-gray-500">AIICO Insurance</p>
                    <p className="text-xs text-gray-400">Active till Mar 31, 2026</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm text-green-600 font-medium">3k + Coverage</p>
                    <button className="px-4 py-1.5 bg-[#00A3FF] text-white text-xs font-medium rounded hover:bg-[#008DD1] transition-colors">
                      View details
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <button className="w-full py-2.5 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors">
                  Add new Insurance plan
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
