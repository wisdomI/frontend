'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { FiChevronDown, FiPlus, FiX } from 'react-icons/fi'

const GoogleChart = dynamic(() => import('react-google-charts').then(m => m.Chart), { ssr: false })

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function MyEarningsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Over' | 'Under' | 'On Track'>('All')
  const filterRef = useRef<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [googleRendered, setGoogleRendered] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setStatusFilterOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const timeout = setTimeout(() => {
      if (!googleRendered) setUseFallback(true)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [isMounted, googleRendered])

  // Mock data
  const summary = {
    total: 2500000,
    planned: 2500000,
    actual: 2435000,
  }
  const balance = summary.total - summary.actual

  const categories = useMemo(() => ([
    { name: 'Catering', planned: 800000, actual: 750000 },
    { name: 'Decoration', planned: 400000, actual: 420000 },
    { name: 'Photography', planned: 300000, actual: 280000 },
    { name: 'Entertainment', planned: 200000, actual: 220000 },
    { name: 'Venue', planned: 700000, actual: 700000 },
    { name: 'Transport', planned: 150000, actual: 170000 },
    { name: 'Miscellaneous', planned: 100000, actual: 85000 },
  ]), [])

  const filteredCategories = categories.filter(c => {
    const diff = c.actual - c.planned
    if (statusFilter === 'All') return true
    if (statusFilter === 'Over') return diff > 0
    if (statusFilter === 'Under') return diff < 0
    return diff === 0
  })

  const plannedVsActualData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        label: 'Planned',
        data: categories.map(c => c.planned),
        backgroundColor: '#FBBF24',
      },
      {
        label: 'Actual',
        data: categories.map(c => c.actual),
        backgroundColor: '#032D71',
      },
    ],
  }
  const plannedVsActualOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
  }

  const googlePieData = useMemo(() => {
    const rows = categories.map(c => [c.name, c.planned])
    return [['Category', 'Planned'], ...rows]
  }, [categories])

  const googlePieOptions = useMemo(() => ({
    is3D: true,
    legend: { position: 'bottom', textStyle: { fontSize: 12 } },
    chartArea: { width: '90%', height: '80%' },
    colors: ['#2563EB','#F59E0B','#10B981','#EF4444','#8B5CF6','#14B8A6','#F97316'],
    backgroundColor: 'transparent',
  }), [])

  const progressPercent = Math.min(100, Math.round((summary.actual / summary.total) * 100))

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0">
      <Script src="https://www.gstatic.com/charts/loader.js" strategy="afterInteractive" />
      <ClientPageHeader
        breadcrumbs={[{ label: 'My Account' }, { label: 'Budget Tracker', isActive: true }]}
        title="Budget Tracker"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard title="Total Budget" value={summary.total} color="text-emerald-600" />
        <SummaryCard title="Planned Spend" value={summary.planned} color="text-pink-500" />
        <SummaryCard title="Actual Spend" value={summary.actual} color="text-emerald-600" />
        <SummaryCard title="Balance" value={balance} color="text-blue-600" />
      </div>

      {/* Utilization */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Budget Utilization</h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="text-right text-xs text-gray-600 mt-1">{progressPercent}%</div>
      </section>

      {/* Planned vs Actual */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Planned VS Actual</h3>
        <div className="w-full">
          <div className="h-56 sm:h-64 lg:h-80 xl:h-96">
            <Bar data={plannedVsActualData} options={plannedVsActualOptions} />
          </div>
        </div>
      </section>

      {/* Budget by Category + Add Budget */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Budget By Category</h3>
          <button onClick={() => setShowAddModal(true)} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium w-full sm:w-auto shrink-0">Add Budget</button>
        </div>
        <div className="w-full">
          <div className="h-56 sm:h-64 lg:h-80 xl:h-96 w-full">
            {isMounted && !useFallback ? (
              <GoogleChart
                chartType="PieChart"
                chartVersion="current"
                width="100%"
                height="100%"
                data={googlePieData}
                options={googlePieOptions}
                loader={<div className="text-center text-sm text-gray-500">Loading chart...</div>}
                rootProps={{ 'data-testid': 'budget-pie' }}
                chartEvents={[
                  { eventName: 'ready', callback: () => setGoogleRendered(true) },
                  { eventName: 'error', callback: () => setUseFallback(true) },
                ]}
              />
            ) : (
              <Doughnut 
                data={{
                  labels: categories.map(c => c.name),
                  datasets: [
                    {
                      data: categories.map(c => c.planned),
                      backgroundColor: ['#2563EB','#F59E0B','#10B981','#EF4444','#8B5CF6','#14B8A6','#F97316'],
                      borderWidth: 1,
                      hoverOffset: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } } },
                  cutout: '0%',
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Category Breakdown */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Category Breakdown</h3>
          <div className="relative" ref={filterRef}>
            <button onClick={() => setStatusFilterOpen(!statusFilterOpen)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm w-full sm:w-auto">
              Filter by: <span className="font-semibold">{statusFilter === 'All' ? 'Status' : statusFilter}</span>
              <FiChevronDown className="w-4 h-4" />
            </button>
            {statusFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm">
                {(['All','Over','Under','On Track'] as const).map(s => (
                  <button key={s} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter===s?'bg-blue-50 text-blue-900 font-semibold':''}`} onClick={() => { setStatusFilter(s); setStatusFilterOpen(false) }}>{s === 'All' ? 'Status' : s}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Planned</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actual</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Difference</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCategories.map((c) => {
                const diff = c.actual - c.planned
                const pct = Math.round(Math.abs(diff) / c.planned * 1000) / 10
                const status: 'Over' | 'Under' | 'On Track' = diff > 0 ? 'Over' : diff < 0 ? 'Under' : 'On Track'
                return (
                  <tr key={c.name} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{c.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">₦{formatN(c.planned)}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">₦{formatN(c.actual)}</td>
                    <td className={`px-6 py-3 text-sm ${diff>0?'text-red-600':'text-emerald-600'}`}>{diff>0?'-':''}₦{formatN(Math.abs(diff))} ({pct}%)</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status==='Over'?'bg-red-100 text-red-800':status==='Under'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-800'}`}>{status==='On Track'?'On Budget': status==='Over'?'Over Budget':'Under Budget'}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile list */}
        <div className="md:hidden divide-y">
          {filteredCategories.map((c) => {
            const diff = c.actual - c.planned
            const pct = Math.round(Math.abs(diff) / c.planned * 1000) / 10
            const status: 'Over' | 'Under' | 'On Track' = diff > 0 ? 'Over' : diff < 0 ? 'Under' : 'On Track'
            return (
              <div key={c.name} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status==='Over'?'bg-red-100 text-red-800':status==='Under'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-800'}`}>{status==='On Track'?'On Budget': status==='Over'?'Over Budget':'Under Budget'}</span>
                </div>
                <div className="text-xs text-gray-600">Planned: ₦{formatN(c.planned)}</div>
                <div className="text-xs text-gray-600">Actual: ₦{formatN(c.actual)}</div>
                <div className={`text-xs ${diff>0?'text-red-600':'text-emerald-600'}`}>Diff: {diff>0?'-':''}₦{formatN(Math.abs(diff))} ({pct}%)</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Add Budget Modal */}
      {showAddModal && (
        <AddBudgetModal onClose={() => setShowAddModal(false)} onSaved={() => { setShowAddModal(false); setShowSuccess(true) }} />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowSuccess(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8">
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setShowSuccess(false)}><FiX /></button>
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Budget Created Successfully</h3>
              <p className="text-sm text-gray-600">Your budget has been created successfully!</p>
              <div className="pt-2">
                <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold" onClick={() => setShowSuccess(false)}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className={`text-xl sm:text-2xl font-bold mt-1 ${color}`}>₦{formatN(value)}</div>
    </div>
  )
}

function formatN(n: number) {
  return new Intl.NumberFormat('en-NG').format(n)
}

function AddBudgetModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState('')
  const [total, setTotal] = useState('')
  const [lines, setLines] = useState([{ category: '', amount: '' }])

  const addLine = () => setLines(prev => [...prev, { category: '', amount: '' }])
  const updateLine = (i: number, key: 'category' | 'amount', val: string) => {
    setLines(prev => prev.map((l, idx) => idx===i? { ...l, [key]: val } : l))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Add New Budget</h3>
          <button className="text-gray-500" onClick={onClose}><FiX /></button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Event Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter event title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Event Total Budget</label>
            <input value={total} onChange={e=>setTotal(e.target.value)} placeholder="Enter event budget" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">Category</label>
                <select value={l.category} onChange={e=>updateLine(i,'category',e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm">
                  <option value="">Select category</option>
                  <option>Catering</option>
                  <option>Decoration</option>
                  <option>Photography</option>
                  <option>Entertainment</option>
                  <option>Venue</option>
                  <option>Transport</option>
                  <option>Miscellaneous</option>
                </select>
                <FiChevronDown className="absolute right-3 bottom-3 text-gray-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount (₦)</label>
                <input value={l.amount} onChange={e=>updateLine(i,'amount',e.target.value)} placeholder="Enter amount" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button onClick={addLine} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm"><FiPlus /> Add</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button onClick={onSaved} className="flex-1 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold">Save Expense</button>
          <button onClick={onClose} className="flex-1 px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
        </div>
      </div>
    </div>
  )
}

