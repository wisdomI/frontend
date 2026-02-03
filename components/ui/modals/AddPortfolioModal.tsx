'use client'

import { useState } from 'react'
import { FiX, FiUpload } from 'react-icons/fi'
import { portfolioAPI } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'

interface AddPortfolioModalProps {
  onSave?: (data: any) => void
  onSuccess?: () => void
}

const AddPortfolioModal = ({ onSave, onSuccess }: AddPortfolioModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    files: [] as File[]
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { addNotification } = useApp()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'application/pdf']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({ ...prev, files: 'Only JPEG, PNG, PDF, and MP4 files are allowed' }))
      return
    }
    
    // Validate file sizes (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, files: 'Files must be under 50MB' }))
      return
    }
    
    setErrors(prev => ({ ...prev, files: '' }))
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = 'Project title is required'
    }
    
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required'
    }
    
    if (formData.files.length === 0) {
      newErrors.files = 'Please upload at least one file'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      addNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      return
    }

    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('projectTitle', formData.projectTitle)
      formDataToSend.append('description', formData.projectDescription)

      // Add media files
      formData.files.forEach((file) => {
        formDataToSend.append('mediaUrl', file)
      })

      const response = await portfolioAPI.create(formDataToSend)
      console.log('Portfolio creation response:', response)
      
      addNotification({
        type: 'success',
        message: 'Portfolio created successfully!'
      })
      
      // Pass the created portfolio data to the parent component
      onSave?.(response.data)
      
      // Call onSuccess to refresh the list
      onSuccess?.()
      
      setIsOpen(false)
      setFormData({
        projectTitle: '',
        projectDescription: '',
        files: []
      })
      setErrors({})
    } catch (error: any) {
      console.error('Error saving portfolio:', error)
      console.error('Portfolio error response:', error.response?.data)
      console.error('Portfolio error status:', error.response?.status)
      
      let errorMessage = 'Failed to create portfolio'
      
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. Portfolio creation requires vendor account privileges. Please ensure you are logged in as a vendor.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      addNotification({
        type: 'error',
        message: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors font-medium"
      >
        + Add Portfolio
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                <h3 className="text-lg font-semibold text-gray-900">Add Portfolio</h3>
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
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, projectTitle: e.target.value }))
                    if (errors.projectTitle) setErrors(prev => ({ ...prev, projectTitle: '' }))
                  }}
                  placeholder="Enter Title"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.projectTitle && (
                  <p className="mt-1 text-sm text-red-500">{errors.projectTitle}</p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea
                  rows={4}
                  value={formData.projectDescription}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, projectDescription: e.target.value }))
                    if (errors.projectDescription) setErrors(prev => ({ ...prev, projectDescription: '' }))
                  }}
                  placeholder="Type here"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.projectDescription && (
                  <p className="mt-1 text-sm text-red-500">{errors.projectDescription}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files *</label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  errors.files ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-gray-400 text-sm mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,video/mp4,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Browse File
                  </label>
                </div>
                {errors.files && (
                  <p className="mt-1 text-sm text-red-500">{errors.files}</p>
                )}
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
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={loading}
                className={`w-full py-3 rounded-lg transition-colors font-medium ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddPortfolioModal
