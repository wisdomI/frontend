'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

export default function CreateInsurancePlanPage() {
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    price: '',
    coverageAmount: '',
    description: '',
    features: ['']
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submission logic here
    console.log('Submitting insurance plan:', formData)
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Link href="/super-admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold font-asul text-gray-800">Create New Insurance Plan</h1>
        <p className="text-gray-600 mt-1">Add a new insurance coverage option for events</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plan Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Premium Event Coverage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Insurance Provider</label>
              <input
                type="text"
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                placeholder="e.g. AXA Mansard"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Premium Price (₦)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700">Coverage Limit (₦)</label>
              <input
                type="text"
                id="coverageAmount"
                name="coverageAmount"
                value={formData.coverageAmount}
                onChange={handleChange}
                placeholder="e.g. 5000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed description of the plan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Plan Features / Benefits</label>
              <button 
                type="button" 
                onClick={addFeature}
                className="text-sm text-[#0B2E6F] font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all"
                  />
                  {formData.features.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeFeature(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            <Link 
              href="/super-admin"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

