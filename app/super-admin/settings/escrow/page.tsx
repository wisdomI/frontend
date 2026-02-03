'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function EscrowSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ruleId, setRuleId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    holdingPeriod: 7,
    releaseBufferPeriod: 24,
    refundRequestWindow: 30,
    name: 'Default Escrow Rule',
    description: 'General escrow settings'
  })

  useEffect(() => {
    fetchEscrowRules()
  }, [])

  const fetchEscrowRules = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getEscrowRules()
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        // Assume we're editing the first available rule as the "global" one
        const rule = response.data.data[0]
        setRuleId(rule.id)
        setFormData({
          holdingPeriod: rule.holdingPeriod || 7,
          releaseBufferPeriod: rule.releaseBufferPeriod || 24,
          refundRequestWindow: rule.refundRequestWindow || 30,
          name: rule.name || 'Default Escrow Rule',
          description: rule.description || 'General escrow settings'
        })
      }
    } catch (error) {
      console.error('Failed to fetch escrow rules:', error)
      toast.error('Failed to load escrow settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = {
        name: formData.name,
        description: formData.description,
        holdingPeriod: Number(formData.holdingPeriod),
        releaseBufferPeriod: Number(formData.releaseBufferPeriod),
        refundRequestWindow: Number(formData.refundRequestWindow)
      }

      if (ruleId) {
        await adminAPI.updateEscrowRule(ruleId, payload)
        toast.success('Escrow settings updated successfully')
      } else {
        const res = await adminAPI.createEscrowRule(payload)
        if (res.data?.data?.id) {
            setRuleId(res.data.data.id)
        }
        toast.success('Escrow settings created successfully')
      }
    } catch (error: any) {
      console.error('Failed to save escrow rules:', error)
      toast.error(error?.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Escrow Rules & Timeline</h1>
        </div>

        {loading ? (
             <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0B2E6F]" />
            </div>
        ) : (
            <div className="space-y-8">
            <div className="space-y-6">
                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Fund Holding Period (Days)</label>
                <input
                    type="number"
                    value={formData.holdingPeriod}
                    onChange={(e) => setFormData({...formData, holdingPeriod: Number(e.target.value)})}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                />
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Release Buffer Period (Hours)</label>
                <input
                    type="number"
                    value={formData.releaseBufferPeriod}
                    onChange={(e) => setFormData({...formData, releaseBufferPeriod: Number(e.target.value)})}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                />
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Refund Request Window (Days)</label>
                <input
                    type="number"
                    value={formData.refundRequestWindow}
                    onChange={(e) => setFormData({...formData, refundRequestWindow: Number(e.target.value)})}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
                />
                </div>
            </div>

            <div className="flex gap-4 pt-8">
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors flex justify-center items-center gap-2"
                >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
                </button>
                <button className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
                </button>
            </div>
            </div>
        )}
      </div>
    </div>
  )
}
