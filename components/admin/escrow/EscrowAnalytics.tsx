'use client'

import React, { useState } from 'react'
import { Download } from 'lucide-react'
import CustomDropdown from '@/components/ui/CustomDropdown'

// Mock chart component
const MockChart = ({ timeframe }: { timeframe: string }) => (
  <div className="w-full h-64 bg-gray-50 rounded-lg flex items-end justify-between px-4 pb-4 border border-dashed border-gray-200 relative overflow-hidden">
     <div className="absolute top-4 left-4 text-xs text-gray-400">Company Performance ({timeframe})</div>
     {/* Simple visualization of lines */}
     <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 200" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="160" x2="400" y2="160" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="0" y1="120" x2="400" y2="120" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="0" y1="80" x2="400" y2="80" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="0" y1="40" x2="400" y2="40" stroke="#E5E7EB" strokeWidth="1" />
        
        {/* Data Lines change slightly based on timeframe to simulate "functional" update */}
        {timeframe === 'Last 6 months' ? (
          <>
            <path d="M0 100 Q 100 90, 200 60 T 400 40" fill="none" stroke="#0B2E6F" strokeWidth="2" />
            <path d="M0 130 Q 100 120, 200 90 T 400 70" fill="none" stroke="#F59E0B" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M0 120 Q 100 80, 200 100 T 400 60" fill="none" stroke="#0B2E6F" strokeWidth="2" />
            <path d="M0 150 Q 100 140, 200 110 T 400 90" fill="none" stroke="#F59E0B" strokeWidth="2" />
          </>
        )}
     </svg>
     <div className="z-10 w-full flex justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-200 mt-auto">
        {timeframe === 'Last 7 days' ? (
          <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></>
        ) : (
          <><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></>
        )}
     </div>
  </div>
)

export default function EscrowAnalytics() {
  const stats = [
    { label: 'Total Revenue', value: '₦45.2M', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Active Users', value: '2,345', color: 'text-[#0B2E6F]', border: 'border-[#EAB308]' },
    { label: 'Events this month', value: '678', color: 'text-[#0B2E6F]', border: 'border-[#22C55E]' },
    { label: 'Dispute Rate', value: '2.3%', color: 'text-[#0B2E6F]', border: 'border-[#EF4444]' },
  ]

  const [timeframe, setTimeframe] = useState('Last 6 months')
  const [category, setCategory] = useState('All Categories')
  const [reportType, setReportType] = useState('Weekly Summary')
  const [sendTo, setSendTo] = useState('Super Admin')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-asul text-gray-800 flex items-center gap-2">
          Welcome Back, Escrow & Analytics Admin <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            <span className={`text-4xl font-bold font-asul ${stat.color} mb-2`}>{stat.value}</span>
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-semibold text-gray-800">Performance Metrics</h2>
           <div className="flex gap-2">
             <div className="w-40">
               <CustomDropdown 
                 options={[
                   { label: 'Last 7 days', value: 'Last 7 days' },
                   { label: 'Last 30 days', value: 'Last 30 days' },
                   { label: 'Last 3 months', value: 'Last 3 months' },
                   { label: 'Last 6 months', value: 'Last 6 months' },
                 ]}
                 selected={timeframe}
                 onChange={setTimeframe}
                 buttonClassName="py-1.5 px-3 text-sm"
               />
             </div>
             <div className="w-40">
               <CustomDropdown 
                 options={[
                   { label: 'All Categories', value: 'All Categories' },
                   { label: 'Weddings', value: 'Weddings' },
                   { label: 'Corporate', value: 'Corporate' },
                   { label: 'Parties', value: 'Parties' },
                 ]}
                 selected={category}
                 onChange={setCategory}
                 buttonClassName="py-1.5 px-3 text-sm"
               />
             </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
           <MockChart timeframe={timeframe} />
           <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-[#0B2E6F] rounded-full"></div>
                 <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-[#F59E0B] rounded-full"></div>
                 <span className="text-gray-600">Target</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-gray-300 rounded-full"></div>
                 <span className="text-gray-600">Last Quarter</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Performing Vendors */}
         <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Vendors</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
               {[
                 { name: 'Royal Events', events: '68 events', amount: '₦3.2M' },
                 { name: 'UK Cakes & Cream', events: '45 events', amount: '₦2.5M' },
                 { name: 'Elite Catering', events: '35 events', amount: '₦1.7M' },
               ].map((vendor, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <div>
                      <h3 className="font-semibold text-gray-800">{vendor.name}</h3>
                      <p className="text-xs text-gray-500">{vendor.events}</p>
                    </div>
                    <span className="font-bold text-green-600">{vendor.amount}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Flagged Anomalies */}
         <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Flagged Anomalies</h2>
            <div className="space-y-3">
               <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-800 text-sm">Suspicious activity</h3>
                  <p className="text-xs text-gray-600 mt-1">Vendor XYZ: Unusual refund pattern</p>
               </div>
               <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-800 text-sm">Revenue Drop</h3>
                  <p className="text-xs text-gray-600 mt-1">Category: Photography (-15%)</p>
               </div>
            </div>
         </div>
      </div>

      {/* Report Generator */}
      <div className="pt-4">
         <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Generator</h2>
         <div className="bg-gray-50 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
               <CustomDropdown 
                 label="Report Type"
                 options={[
                   { label: 'Weekly Summary', value: 'Weekly Summary' },
                   { label: 'Monthly Revenue', value: 'Monthly Revenue' },
                   { label: 'Vendor Performance', value: 'Vendor Performance' },
                   { label: 'Dispute Analysis', value: 'Dispute Analysis' },
                 ]}
                 selected={reportType}
                 onChange={setReportType}
               />
            </div>
            
            <div className="flex-1 w-full">
               <CustomDropdown 
                 label="Send to"
                 options={[
                   { label: 'Super Admin', value: 'Super Admin' },
                   { label: 'All Admins', value: 'All Admins' },
                   { label: 'Escrow Admin', value: 'Escrow Admin' },
                 ]}
                 selected={sendTo}
                 onChange={setSendTo}
               />
            </div>

            <button className="bg-[#0B2E6F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#09255a] flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center h-[46px]">
               <Download className="w-5 h-5" />
               Generate & Send Report
            </button>
         </div>
      </div>
    </div>
  )
}

