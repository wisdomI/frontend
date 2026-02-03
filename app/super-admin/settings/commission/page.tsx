'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function CommissionSettingsPage() {
  const [tiers, setTiers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTiers()
  }, [])

  const fetchTiers = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getCommissionTiers()
      if (response.data && Array.isArray(response.data.data)) {
        setTiers(response.data.data)
      } else {
        setTiers([])
      }
    } catch (error) {
      console.error('Failed to fetch commission tiers:', error)
      toast.error('Failed to load commission tiers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTier = (index: number, field: string, value: any) => {
    const newTiers = [...tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setTiers(newTiers)
  }

  const handleSaveAll = async () => {
    try {
      setIsSaving(true)
      const promises = tiers.map(tier => {
        const payload = {
            name: tier.name || `Tier ${tier.tierNumber}`,
            description: tier.description || 'Commission tier',
            minAmount: Number(String(tier.minAmount).replace(/[^0-9.]/g, '')),
            maxAmount: Number(String(tier.maxAmount).replace(/[^0-9.]/g, '')),
            vendorRate: Number(String(tier.vendorRate).replace(/[^0-9.]/g, ''))
        }
        
        if (tier.id) {
            return adminAPI.updateCommissionTier(tier.id, payload)
        } else {
            return adminAPI.createCommissionTier({
                ...payload,
                tierNumber: tier.tierNumber || 1
            })
        }
      })

      await Promise.all(promises)
      toast.success('Commission tiers saved successfully')
      fetchTiers()
    } catch (error: any) {
      console.error('Failed to save tiers:', error)
      toast.error(error?.response?.data?.message || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTier = async (index: number) => {
      const tier = tiers[index]
      if (tier.id) {
          if (!confirm('Are you sure you want to delete this tier?')) return
          try {
              await adminAPI.deleteCommissionTier(tier.id)
              toast.success('Tier deleted')
              const newTiers = tiers.filter((_, i) => i !== index)
              setTiers(newTiers)
          } catch (error) {
              toast.error('Failed to delete tier')
          }
      } else {
          // Just remove from local state if not saved yet
          const newTiers = tiers.filter((_, i) => i !== index)
          setTiers(newTiers)
      }
  }

  const handleAddTier = () => {
      setTiers([...tiers, {
          name: `Tier ${tiers.length + 1}`,
          description: '',
          tierNumber: tiers.length + 1,
          minAmount: 0,
          maxAmount: 0,
          vendorRate: 0
      }])
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
            <h1 className="text-2xl font-bold text-gray-900 font-raleway">Commission Rates Settings</h1>
            <button 
                onClick={handleSaveAll}
                disabled={isSaving || isLoading}
                className="bg-[#0B2E6F] text-white px-4 py-2 rounded-lg hover:bg-[#09255a] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
            </button>
          </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0B2E6F]" />
            </div>
        ) : (
            <div className="space-y-8">
              {tiers.map((tier, index) => (
                <div key={tier.id || index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
                    <button 
                        onClick={() => handleDeleteTier(index)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-semibold text-gray-900 mb-6">{tier.name || `Tier ${index + 1}`}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Minimum (₦)</label>
                        <input
                            type="number"
                            value={tier.minAmount}
                            onChange={(e) => handleUpdateTier(index, 'minAmount', e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-center font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Maximum (₦)</label>
                        <input
                            type="number"
                            value={tier.maxAmount}
                            onChange={(e) => handleUpdateTier(index, 'maxAmount', e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-center font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Vendors rate (%)</label>
                        <input
                            type="number"
                            value={tier.vendorRate}
                            onChange={(e) => handleUpdateTier(index, 'vendorRate', e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                        />
                    </div>
                    </div>
                </div>
              ))}

              <button 
                onClick={handleAddTier}
                className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Tier
              </button>
            </div>
        )}
      </div>
    </div>
  )
}
