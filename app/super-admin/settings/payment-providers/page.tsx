'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Save, Loader2, Check, X, CreditCard } from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function PaymentProvidersPage() {
  const [psps, setPsps] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPSP, setNewPSP] = useState({
      name: '',
      type: 'flutterwave',
      isDefault: false,
      isEnabled: true,
      supportedCurrencies: ['NGN'],
      supportedPaymentMethods: ['card', 'transfer']
  })

  useEffect(() => {
    fetchPSPs()
  }, [])

  const fetchPSPs = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getPSPs()
      if (response.data && Array.isArray(response.data.data)) {
        setPsps(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch PSPs:', error)
      toast.error('Failed to load payment providers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePSP = async () => {
      try {
          await adminAPI.createPSP(newPSP)
          toast.success('Payment provider added')
          setShowCreateModal(false)
          fetchPSPs()
          setNewPSP({
            name: '',
            type: 'flutterwave',
            isDefault: false,
            isEnabled: true,
            supportedCurrencies: ['NGN'],
            supportedPaymentMethods: ['card', 'transfer']
          })
      } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Failed to add provider')
      }
  }

  const handleToggleStatus = async (id: string) => {
      try {
          await adminAPI.togglePSPStatus(id)
          toast.success('Status updated')
          fetchPSPs()
      } catch (error) {
          toast.error('Failed to update status')
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 font-raleway">Payment Service Providers</h1>
            <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#0B2E6F] text-white px-4 py-2 rounded-lg hover:bg-[#09255a] transition-colors flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Provider
            </button>
          </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0B2E6F]" />
            </div>
        ) : (
            <div className="space-y-4">
                {psps.length > 0 ? psps.map((psp) => (
                    <div key={psp.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0B2E6F]">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    {psp.name}
                                    {psp.isDefault && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Default</span>}
                                </h3>
                                <p className="text-sm text-gray-500 capitalize">{psp.type}</p>
                                <div className="flex gap-2 mt-1">
                                    {psp.supportedCurrencies?.map((curr: string) => (
                                        <span key={curr} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{curr}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${psp.isEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {psp.isEnabled ? 'Active' : 'Inactive'}
                            </span>
                            <button 
                                onClick={() => handleToggleStatus(psp.id)}
                                className={`p-2 rounded-lg transition-colors ${psp.isEnabled ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                title={psp.isEnabled ? 'Disable' : 'Enable'}
                            >
                                {psp.isEnabled ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
                        No payment providers found. Add one to get started.
                    </div>
                )}
            </div>
        )}

        {/* Simple Create Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Add Payment Provider</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input 
                                type="text" 
                                className="w-full border rounded-lg p-2"
                                value={newPSP.name}
                                onChange={e => setNewPSP({...newPSP, name: e.target.value})}
                                placeholder="e.g. Flutterwave"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select 
                                className="w-full border rounded-lg p-2"
                                value={newPSP.type}
                                onChange={e => setNewPSP({...newPSP, type: e.target.value})}
                            >
                                <option value="flutterwave">Flutterwave</option>
                                <option value="paystack">Paystack</option>
                                <option value="stripe">Stripe</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="isDefault"
                                checked={newPSP.isDefault}
                                onChange={e => setNewPSP({...newPSP, isDefault: e.target.checked})}
                            />
                            <label htmlFor="isDefault" className="text-sm">Set as default</label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCreatePSP}
                            className="flex-1 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#09255a]"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}
