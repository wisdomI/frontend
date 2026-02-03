'use client'

import React, { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import CustomDropdown from '@/components/ui/CustomDropdown'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

// Mock chart component (reusing for now as actual charting library is not specified)
const MockChart = ({ timeframe }: { timeframe: string }) => (
  <div className="w-full h-64 bg-gray-50 rounded-lg flex items-end justify-between px-4 pb-4 border border-dashed border-gray-200 relative overflow-hidden">
     <div className="absolute top-4 left-4 text-xs text-gray-400">Platform Growth ({timeframe})</div>
     <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 200" preserveAspectRatio="none">
        <line x1="0" y1="160" x2="400" y2="160" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="0" y1="120" x2="400" y2="120" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="0" y1="80" x2="400" y2="80" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="0" y1="40" x2="400" y2="40" stroke="#E5E7EB" strokeWidth="1" />
        
        {timeframe === 'Last 6 months' ? (
          <>
            <path d="M0 140 Q 100 130, 200 100 T 400 60" fill="none" stroke="#22C55E" strokeWidth="2" />
            <path d="M0 100 Q 100 90, 200 60 T 400 30" fill="none" stroke="#0B2E6F" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M0 150 Q 100 110, 200 130 T 400 80" fill="none" stroke="#22C55E" strokeWidth="2" />
            <path d="M0 120 Q 100 80, 200 100 T 400 50" fill="none" stroke="#0B2E6F" strokeWidth="2" />
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

export default function SuperAdminAnalytics() {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Total Revenue', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#22C55E]' },
    { label: 'Active Events', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#EAB308]' },
    { label: 'Escrow Balance', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#EF4444]' },
  ])
  const [isLoading, setIsLoading] = useState(true)

  const [timeframe, setTimeframe] = useState('Last 6 months')
  const [category, setCategory] = useState('All Categories')
  const [reportType, setReportType] = useState('Platform Summary')
  const [sendTo, setSendTo] = useState('Me')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Use general admin dashboard endpoint for overview stats
        const dashboardRes = await adminAPI.getDashboard().catch(() => ({ data: { data: {} } }))
        const data = dashboardRes.data?.data || {}

        setStats([
          { label: 'Total Users', value: data.totalUsers?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
          { label: 'Total Revenue', value: data.totalRevenue ? `₦${data.totalRevenue.toLocaleString()}` : '₦0', color: 'text-[#0B2E6F]', border: 'border-[#22C55E]' },
          { label: 'Active Events', value: data.activeEvents?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#EAB308]' },
          { label: 'Escrow Balance', value: data.escrowBalance ? `₦${data.escrowBalance.toLocaleString()}` : '₦0', color: 'text-[#0B2E6F]', border: 'border-[#EF4444]' },
        ])

      } catch (error) {
        console.error('Error fetching super admin analytics:', error)
        toast.error('Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-raleway text-gray-800 flex items-center gap-2">
          Platform Analytics <span className="text-2xl">📊</span>
        </h1>
        <p className="text-gray-600 mt-1">Comprehensive overview of platform performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            {isLoading ? (
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
            ) : (
                <span className={`text-4xl font-bold font-raleway ${stat.color} mb-2`}>{stat.value}</span>
            )}
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-semibold text-gray-800">Growth Metrics</h2>
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
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
           <MockChart timeframe={timeframe} />
           <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-[#0B2E6F] rounded-full"></div>
                 <span className="text-gray-600">Users</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-[#22C55E] rounded-full"></div>
                 <span className="text-gray-600">Revenue</span>
              </div>
           </div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="pt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">System Report</h2>
         <div className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-6 items-end shadow-sm">
            <div className="flex-1 w-full">
               <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
               <CustomDropdown 
                 options={[
                   { label: 'Platform Summary', value: 'Platform Summary' },
                   { label: 'User Growth', value: 'User Growth' },
                   { label: 'Financial Report', value: 'Financial Report' },
                   { label: 'System Health', value: 'System Health' },
                 ]}
                 selected={reportType}
                 onChange={setReportType}
                 buttonClassName="w-full justify-between"
               />
            </div>
            
            <div className="flex-1 w-full">
               <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
               <div className="flex gap-4">
                   <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">PDF</button>
                   <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">CSV</button>
               </div>
            </div>

            <button className="bg-[#0B2E6F] text-white py-2.5 px-6 rounded-lg font-medium hover:bg-[#09255a] flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto h-[42px]">
               <Download className="w-4 h-4" />
               Download Report
            </button>
         </div>
      </div>
    </div>
  )
}
