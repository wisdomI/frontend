'use client'
import React, { useState } from 'react'
import { FiX, FiCalendar, FiUpload, FiTrash2, FiCloud } from 'react-icons/fi'

interface PlaceBidModalProps {
  isOpen: boolean
  onClose: () => void
  serviceRequest: {
    id: number
    title: string
    location: string
    date: string
    budget: string
  }
}

const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  isOpen,
  onClose,
  serviceRequest
}) => {
  const [bidAmount, setBidAmount] = useState('')
  const [startDate, setStartDate] = useState('12/05/2025')
  const [endDate, setEndDate] = useState('23/05/2025')
  const [proposalDetails, setProposalDetails] = useState('')
  const [additionalServices, setAdditionalServices] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Cake Image.jpeg', size: '854kb' },
    { id: 2, name: 'Cake Image.jpeg', size: '854kb' }
  ])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).map((file, index) => ({
        id: uploadedFiles.length + index + 1,
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)}kb`
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const handleFileRemove = (fileId: number) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId))
  }

  const handleSubmitBid = () => {
    // Handle bid submission logic here
    console.log('Bid submitted:', {
      bidAmount,
      startDate,
      endDate,
      proposalDetails,
      additionalServices,
      uploadedFiles
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Place Your Bid</h2>
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
                type="text"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Delivery Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Timeline</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>
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
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">Size: {file.size}</p>
                      </div>
                      <button
                        onClick={() => handleFileRemove(file.id)}
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

        {/* Submit Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmitBid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Submit Bid
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceBidModal
