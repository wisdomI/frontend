'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { FiX, FiTrash2, FiCloud, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { bidAPI } from '@/lib/api'
import type { CreateBidRequest } from '@/types/api'
import SimpleDatePicker from '@/components/ui/SimpleDatePicker'

export type PlaceBidMarketplaceRequest = {
  id: string | number
  title: string
  location?: string
  date?: string
  budget?: string
}

interface PlaceBidModalProps {
  isOpen: boolean
  onClose: () => void
  serviceRequest: PlaceBidMarketplaceRequest
}

const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  isOpen,
  onClose,
  serviceRequest
}) => {
  const [bidAmount, setBidAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [proposalDetails, setProposalDetails] = useState('')
  const [additionalServices, setAdditionalServices] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setBidAmount('')
      setStartDate('')
      setEndDate('')
      setProposalDetails('')
      setAdditionalServices('')
      setUploadedFiles([])
      setErrorMessage(null)
    }
  }, [isOpen, serviceRequest?.id])

  const parsedAdditionalServices = useMemo(() => {
    if (!additionalServices.trim()) {
      return []
    }

    return additionalServices
      .split(/[\n,]/)
      .map(service => service.trim())
      .filter(Boolean)
  }, [additionalServices])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index))
  }

  const formatDateForApi = (value: string) => {
    if (!value) return null

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return null
    }

    const pad = (num: number) => num.toString().padStart(2, '0')

    return [
      `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
      'T',
      `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`,
    ].join('')
  }

  const handleSubmitBid = async () => {
    if (isSubmitting) return

    setErrorMessage(null)

    const sanitizedAmount = bidAmount.replace(/[^\d.]/g, '')
    const numericAmount = parseFloat(sanitizedAmount)

    if (!serviceRequest?.id) {
      setErrorMessage('Invalid service request. Please refresh and try again.')
      return
    }

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Enter a valid bid amount greater than zero.')
      return
    }

    if (!startDate || !endDate) {
      setErrorMessage('Select both a start and an end date.')
      return
    }

    const startIso = formatDateForApi(startDate)
    const endIso = formatDateForApi(endDate)

    if (!startIso || !endIso) {
      setErrorMessage('Provided dates are invalid. Please use the date picker.')
      return
    }

    if (new Date(startIso).getTime() >= new Date(endIso).getTime()) {
      setErrorMessage('End date must be after the start date.')
      return
    }

    if (!proposalDetails.trim()) {
      setErrorMessage('Add some proposal details to describe your offer.')
      return
    }

    const payload: CreateBidRequest = {
      serviceRequestId: String(serviceRequest.id),
      bidAmount: numericAmount,
      startDate: startIso,
      endDate: endIso,
      proposedDetails: proposalDetails.trim(),
      additionalServices: parsedAdditionalServices
    }

    setIsSubmitting(true)

    try {
      let response
      if (uploadedFiles.length > 0) {
        const formData = new FormData()
        formData.append('serviceRequestId', payload.serviceRequestId)
        formData.append('bidAmount', payload.bidAmount.toString())
        formData.append('startDate', payload.startDate)
        formData.append('endDate', payload.endDate)
        formData.append('proposedDetails', payload.proposedDetails)

        if (payload.additionalServices.length > 0) {
          payload.additionalServices.forEach((service, index) => {
            formData.append(`additionalServices[${index}]`, service)
          })
        }

        uploadedFiles.forEach((file) => {
          formData.append('images', file)
        })

        response = await bidAPI.create(formData)
      } else {
        response = await bidAPI.create(payload)
      }
      
      console.log('✅ Bid submitted successfully:', response.data)
      console.log('📤 Bid sent to backend endpoint: POST /bids/')
      console.log('📋 Clients can view this bid on: /client/bidding (Received Bids tab)')
      toast.success('Bid submitted successfully')
      onClose()
    } catch (error: any) {
      const responseData = error?.response?.data
      const message =
        responseData?.message ||
        (Array.isArray(responseData?.errors) ? responseData.errors.join(', ') : undefined) ||
        responseData?.error ||
        error?.message ||
        'Failed to submit bid. Please try again.'

      console.error('❌ Bid submission failed', {
        payload,
        hasFiles: uploadedFiles.length > 0,
        response: responseData,
        status: error?.response?.status,
        fullError: error,
      })
      
      // Log the full error response for debugging
      if (responseData) {
        console.error('Backend error details:', JSON.stringify(responseData, null, 2))
      }

      setErrorMessage(message)
      toast.error(`Unable to submit bid: ${message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Place Your Bid</h2>
            <p className="text-sm text-gray-500 mt-1">{serviceRequest.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex">
          {/* Left Panel - Bid Information */}
          <div className="flex-1 p-6">
            {/* Your Bid Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount (₦)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Delivery Timeline */}
            <div className="mb-6">
              <SimpleDatePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                label="Delivery Timeline"
                required
              />
            </div>

            {/* Proposal Details */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposal Details
              </label>
              <textarea
                placeholder="Describe your approach, experience etc"
                value={proposalDetails}
                onChange={(e) => setProposalDetails(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Right Panel - File Upload and Additional Services */}
          <div className="w-80 border-l border-gray-200 p-6">
            {/* File Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Upload</h3>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-blue-400 transition-colors">
                <FiCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                <p className="text-xs text-gray-500 mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                <input
                  type="file"
                  multiple
                  accept=".jpeg,.jpg,.png,.pdf,.mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                >
                  Browse File
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">Size: {`${(file.size / 1024).toFixed(0)}kb`}</p>
                      </div>
                      <button
                        onClick={() => handleFileRemove(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Services
              </label>
              <textarea
                placeholder="Any extra services you can provide"
                value={additionalServices}
                onChange={(e) => setAdditionalServices(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 px-6 text-sm text-red-600">
            <FiAlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmitBid}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"></path>
              </svg>
            )}
            <span>{isSubmitting ? 'Submitting Bid...' : 'Submit Bid'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceBidModal
