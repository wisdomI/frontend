'use client'

import { useState } from 'react'
import { FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi'

interface PricingPackage {
  id: string
  title: string
  price: string
}

interface AddServiceOfferingModalProps {
  onSave?: (data: any) => void
}

const AddServiceOfferingModal = ({ onSave }: AddServiceOfferingModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    serviceTitle: '',
    serviceCategory: '',
    serviceNiche: '',
    serviceDescription: '',
    files: [] as File[],
    pricingPackages: [
      { id: '1', title: '', price: '' }
    ] as PricingPackage[]
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const addPricingPackage = () => {
    const newPackage: PricingPackage = {
      id: Date.now().toString(),
      title: '',
      price: ''
    }
    setFormData(prev => ({
      ...prev,
      pricingPackages: [...prev.pricingPackages, newPackage]
    }))
  }

  const removePricingPackage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.filter(pkg => pkg.id !== id)
    }))
  }

  const updatePricingPackage = (id: string, field: keyof PricingPackage, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.map(pkg =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    }))
  }

  const handleSave = () => {
    console.log('Service offering saved:', formData)
    onSave?.(formData)
    setIsOpen(false)
    setFormData({
      serviceTitle: '',
      serviceCategory: '',
      serviceNiche: '',
      serviceDescription: '',
      files: [],
      pricingPackages: [{ id: '1', title: '', price: '' }]
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Add Service Offering
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Add Service Offering</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Service Offering Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Offering Title</label>
                <input
                  type="text"
                  value={formData.serviceTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceTitle: e.target.value }))}
                  placeholder="Enter Title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Service Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Category</label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceCategory: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select service category</option>
                  <option value="catering">Catering</option>
                  <option value="photography">Photography</option>
                  <option value="dj">DJ Services</option>
                  <option value="decorations">Decorations</option>
                  <option value="venue">Venue</option>
                </select>
              </div>

              {/* Service Niche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Niche</label>
                <select
                  value={formData.serviceNiche}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceNiche: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select service niche</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                </select>
              </div>

              {/* Service Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Offering Description</label>
                <textarea
                  rows={4}
                  value={formData.serviceDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceDescription: e.target.value }))}
                  placeholder="Type here"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-gray-400 text-sm mb-4">JPEG, PNG, PDG, and MP4 formats, up to 50MB</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="service-file-upload"
                  />
                  <label
                    htmlFor="service-file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Browse File
                  </label>
                </div>
              </div>

              {/* Uploaded Files */}
              {formData.files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">Size: {(file.size / 1024).toFixed(0)}kb</p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Packages */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Pricing Package Title & Price</h4>
                <div className="space-y-4">
                  {formData.pricingPackages.map((pkg, index) => (
                    <div key={pkg.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={pkg.title}
                          onChange={(e) => updatePricingPackage(pkg.id, 'title', e.target.value)}
                          placeholder="e.g Basic, Standard, Classic"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => updatePricingPackage(pkg.id, 'price', e.target.value)}
                          placeholder="e.g N10,000.00"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      {formData.pricingPackages.length > 1 && (
                        <button
                          onClick={() => removePricingPackage(pkg.id)}
                          className="p-3 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addPricingPackage}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddServiceOfferingModal
