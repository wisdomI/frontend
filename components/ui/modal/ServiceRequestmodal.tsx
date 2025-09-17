'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { PlusIcon, CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/solid'
import SuccessModal from './SuccessNotificationModal'

export default function PostServiceModal({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    eventTitle: '',
    eventType: '',
    startDate: '12/05/2023',
    endDate: '23/05/2023',
    eventLocation: '',
    eventCity: '',
    servicesNeeded: '',
    numberOfGuests: '',
    budgetRange: '',
    additionalInformation: '',
    eventPlanner: 'Yes',
    aiSuggestion: 'No',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files).filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'].includes(file.type)
      const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB
      return isValidType && isValidSize
    })
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isFormValid = () => {
    return formData.eventTitle.trim() !== '' &&
           formData.eventType !== '' &&
           formData.startDate !== '' &&
           formData.endDate !== '' &&
           formData.eventLocation !== '' &&
           formData.eventCity !== '' &&
           formData.servicesNeeded !== '' &&
           formData.numberOfGuests !== '' &&
           formData.budgetRange !== ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      setIsOpen(false)
      setShowSuccess(true)
      // Reset form
      setFormData({
        eventTitle: '',
        eventType: '',
        startDate: '12/05/2023',
        endDate: '23/05/2023',
        eventLocation: '',
        eventCity: '',
        servicesNeeded: '',
        numberOfGuests: '',
        budgetRange: '',
        additionalInformation: '',
        eventPlanner: 'Yes',
        aiSuggestion: 'No',
      })
      setUploadedFiles([])
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
  }

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Post a Service Request
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Kindly fill in your Event details
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-event-blue h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  placeholder="Enter Event Title"
                  required
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  required
                >
                  <option value="">Select</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="graduation">Graduation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Event Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                      required
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                      required
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location
                </label>
                <select
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  required
                >
                  <option value="">Select State</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="kano">Kano</option>
                  <option value="rivers">Rivers</option>
                  <option value="oyo">Oyo</option>
                </select>
              </div>

              {/* Event City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event City
                </label>
                <p className="text-xs text-gray-500 mb-2">(Select the City you will like to Host your event)</p>
                <select
                  name="eventCity"
                  value={formData.eventCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  required
                >
                  <option value="">Select City</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="ikoyi">Ikoyi</option>
                  <option value="lekki">Lekki</option>
                  <option value="maitama">Maitama</option>
                  <option value="asokoro">Asokoro</option>
                </select>
              </div>

              {/* Services Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Needed
                </label>
                <select
                  name="servicesNeeded"
                  value={formData.servicesNeeded}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  required
                >
                  <option value="">Select Services</option>
                  <option value="catering">Catering</option>
                  <option value="photography">Photography</option>
                  <option value="decoration">Decoration</option>
                  <option value="music">Music & Entertainment</option>
                  <option value="makeup">Makeup & Beauty</option>
                  <option value="transportation">Transportation</option>
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  placeholder="Enter no. of Guests"
                  min="1"
                  required
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <input
                  type="text"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  placeholder="e.g N100,000 - N200,000"
                  required
                />
              </div>
            </div>

            {/* Right Column - File Upload & Additional Information */}
            <div className="space-y-6">
              {/* File Upload Section */}
              <div>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver ? 'border-[#0B2E6F] bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-xs text-gray-500 mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-event-blue text-white px-6 py-2 rounded-lg hover:bg-event-blue-hover transition-colors"
                  >
                    Browse File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpeg,.jpg,.png,.pdf,.mp4"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">Size: {formatFileSize(file.size)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent resize-none"
                  placeholder="Enter here"
                />
              </div>

              {/* Event Planner Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you like an Event planner to organize your event?
                </label>
                <select
                  name="eventPlanner"
                  value={formData.eventPlanner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* AI Suggestion Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you like AI to suggest Best profile for your event?
                </label>
                <select
                  name="aiSuggestion"
                  value={formData.aiSuggestion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full max-w-md py-4 rounded-lg font-medium transition-colors ${
                isFormValid()
                  ? 'bg-event-blue text-white hover:bg-event-blue-hover'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Request Service
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-yellow-400 text-event-blue font-semibold text-center py-2 md:py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm"
        >
          <PlusIcon className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Post Service Request</span>
          <span className="sm:hidden">Post Request</span>
        </button>
      )}

      {mounted && createPortal(modalContent, document.body)}

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  )
}