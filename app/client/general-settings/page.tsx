'use client'

import { useEffect, useRef, useState } from 'react'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import { FiChevronDown, FiX } from 'react-icons/fi'
import { useApi } from '@/hooks/useApi'

type TabKey = 'notification' | 'integrations'

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('notification')

  // API hooks
  const { data: settingsData, loading: settingsLoading, error: settingsError } = useApi(() => Promise.resolve({ 
    data: {
      notifications: {
        vendorTask: true,
        offerDecision: false,
        newChat: false,
        escrowConfirmed: true,
        refundProcessed: false,
        outstandingPayment: false,
        channelInApp: true,
        channelEmail: false,
        channelSms: false,
        platformFeatures: true,
        platformNewsletter: false,
      },
      integrations: {
        meetings: true,
        siteVisits: true,
        planning: true,
        payments: true,
        followUps: false,
      },
      syncFrequency: 'Every 15 minutes',
      reminderTime: '1 Hour before'
    }, 
    message: 'success', 
    success: true 
  }))
  const { data: saveResponse, loading: saveLoading, error: saveError, execute: saveSettings } = useApi(() => Promise.resolve({ data: {}, message: 'success', success: true }))

  // Notification toggles
  const [noti, setNoti] = useState({
    vendorTask: true,
    offerDecision: false,
    newChat: false,
    escrowConfirmed: true,
    refundProcessed: false,
    outstandingPayment: false,
    channelInApp: true,
    channelEmail: false,
    channelSms: false,
    platformFeatures: true,
    platformNewsletter: false,
  })

  const toggle = (key: keyof typeof noti) => setNoti(prev => ({ ...prev, [key]: !prev[key] }))

  // Integrations state
  const [syncItems, setSyncItems] = useState({
    meetings: true,
    siteVisits: true,
    planning: true,
    payments: true,
    followUps: false,
  })
  const toggleSync = (k: keyof typeof syncItems) => setSyncItems(p => ({ ...p, [k]: !p[k] }))

  const [frequency, setFrequency] = useState('Every 15 minutes')
  const [reminder, setReminder] = useState('1 Hour before')
  const [openSelect, setOpenSelect] = useState<'freq' | 'rem' | null>(null)
  const selectsRef = useRef<HTMLDivElement | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Load settings from API
  useEffect(() => {
    if (settingsData) {
      setNoti(prev => settingsData.notifications || prev)
      setSyncItems(prev => settingsData.integrations || prev)
      setFrequency(prev => settingsData.syncFrequency || prev)
      setReminder(prev => settingsData.reminderTime || prev)
    }
  }, [settingsData])

  const frequencyOptions = ['Every 15 minutes','Every 30 minutes','Every 60 minutes','Every 2 hours','Everyday']
  const reminderOptions = ['15 minutes before','30 minutes before','1 Hour before','1 Day before']

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (selectsRef.current && !selectsRef.current.contains(e.target as Node)) setOpenSelect(null)
    }
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenSelect(null) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onEsc) }
  }, [])

  const saveIntegrations = async () => {
    try {
      const settingsPayload = {
        notifications: noti,
        integrations: syncItems,
        syncFrequency: frequency,
        reminderTime: reminder
      }
      
      await saveSettings(settingsPayload)
      setShowSuccess(true)
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[{ label: 'My Account' }, { label: 'General Settings', isActive: true }]}
        title="General Settings"
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
        <div className="px-3 sm:px-4 lg:px-6 pt-3">
          <div className="inline-flex bg-[#0B2E6F] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('notification')}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab==='notification' ? 'bg-white text-[#0B2E6F]' : 'text-white'}`}
            >
              Notification
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab==='integrations' ? 'bg-white text-[#0B2E6F]' : 'text-white'}`}
            >
              Integrations
            </button>
          </div>
        </div>

        {activeTab === 'notification' && (
          <div className="p-3 sm:p-4 lg:p-6">
            <p className="text-sm text-gray-700 mb-4">Please select the types of notifications you would like to receive</p>
            <div className="grid grid-cols-1 gap-4">
              <section className="bg-gray-50 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Project & Event Updates</h3>
                <div className="space-y-3">
                  <ToggleRow label="Vendor Planner added or updated a Task" checked={noti.vendorTask} onChange={() => toggle('vendorTask')} />
                  <ToggleRow label="Vendor Accept/Decline Offer" checked={noti.offerDecision} onChange={() => toggle('offerDecision')} />
                  <ToggleRow label="New Chat Message (Vendor/Planner)" checked={noti.newChat} onChange={() => toggle('newChat')} />
                </div>
              </section>

              <section className="bg-gray-50 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payments & Finance</h3>
                <div className="space-y-3">
                  <ToggleRow label="Escrow Deposit Confirmed" checked={noti.escrowConfirmed} onChange={() => toggle('escrowConfirmed')} />
                  <ToggleRow label="Refund Processed" checked={noti.refundProcessed} onChange={() => toggle('refundProcessed')} />
                  <ToggleRow label="Outstanding Payment Reminder" checked={noti.outstandingPayment} onChange={() => toggle('outstandingPayment')} />
                </div>
              </section>

              <section className="bg-gray-50 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Communication Channels</h3>
                <div className="space-y-3">
                  <ToggleRow label="In‑app" checked={noti.channelInApp} onChange={() => toggle('channelInApp')} />
                  <ToggleRow label="Email" checked={noti.channelEmail} onChange={() => toggle('channelEmail')} />
                  <ToggleRow label="SMS" checked={noti.channelSms} onChange={() => toggle('channelSms')} />
                </div>
              </section>

              <section className="bg-gray-50 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Platform Update</h3>
                <div className="space-y-3">
                  <ToggleRow label="New Features/Discounts" checked={noti.platformFeatures} onChange={() => toggle('platformFeatures')} />
                  <ToggleRow label="Newsletter/Blogs" checked={noti.platformNewsletter} onChange={() => toggle('platformNewsletter')} />
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="p-3 sm:p-4 lg:p-6" ref={selectsRef}>
            <section className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Calendar Sync</h3>
              <p className="text-sm text-gray-600">Stay organized by syncing your event planning activities with your personal calendar.</p>
              <div className="mt-4">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-3V2h-2v2H10V2H8v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V9h14v10z"/></svg>
                  Connect Google Calendar
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What to sync:</h4>
                  <div className="space-y-2">
                    <CheckRow label="Vendor meetings & consultations" checked={syncItems.meetings} onChange={() => toggleSync('meetings')} />
                    <CheckRow label="Site visits & venue tours" checked={syncItems.siteVisits} onChange={() => toggleSync('siteVisits')} />
                    <CheckRow label="Planning deadlines & milestones" checked={syncItems.planning} onChange={() => toggleSync('planning')} />
                    <CheckRow label="Payment due dates" checked={syncItems.payments} onChange={() => toggleSync('payments')} />
                    <CheckRow label="Follow-up reminders" checked={syncItems.followUps} onChange={() => toggleSync('followUps')} />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm text-gray-700 mb-1">Sync Frequency</label>
                      <button
                        onClick={() => setOpenSelect(openSelect === 'freq' ? null : 'freq')}
                        className="w-full text-left bg-white border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm"
                        aria-expanded={openSelect==='freq'}
                      >
                        {frequency}
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </button>
                      {openSelect==='freq' && (
                        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30">
                          <ul className="py-1 text-sm">
                            {frequencyOptions.map(opt => (
                              <li key={opt}>
                                <button
                                  onClick={() => { setFrequency(opt); setOpenSelect(null) }}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${frequency===opt? 'bg-blue-50 font-semibold text-blue-900' : 'text-gray-800'}`}
                                >
                                  {opt}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm text-gray-700 mb-1">Default reminder time:</label>
                      <button
                        onClick={() => setOpenSelect(openSelect === 'rem' ? null : 'rem')}
                        className="w-full text-left bg-white border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm"
                        aria-expanded={openSelect==='rem'}
                      >
                        {reminder}
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </button>
                      {openSelect==='rem' && (
                        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30">
                          <ul className="py-1 text-sm">
                            {reminderOptions.map(opt => (
                              <li key={opt}>
                                <button
                                  onClick={() => { setReminder(opt); setOpenSelect(null) }}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${reminder===opt? 'bg-blue-50 font-semibold text-blue-900' : 'text-gray-800'}`}
                                >
                                  {opt}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={saveIntegrations} 
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowSuccess(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8">
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setShowSuccess(false)}><FiX /></button>
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Calendar Synced Successfully</h3>
              <p className="text-sm text-gray-600">Your preferences have been saved successfully!</p>
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

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-800">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
        aria-pressed={checked}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-start gap-3 text-sm text-gray-800">
      <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  )
}
