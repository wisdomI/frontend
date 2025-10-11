'use client'

import React, { useState } from 'react'
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi'

interface Attendee {
  id: string
  name: string
}

interface ScheduleMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (meetingData: any) => void
}

const ScheduleMeetingModal = ({ isOpen, onClose, onSchedule }: ScheduleMeetingModalProps) => {
  const [formData, setFormData] = useState({
    meetingTitle: 'First Alignment Call',
    frequency: 'one-off',
    startDate: '12/05/2025',
    endDate: '23/05/2025',
    startTime: '9:00 am',
    endTime: '9:30 am',
    description: 'This meeting is to align on my requirements with Client.'
  })
  
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: '1', name: 'Uka Tobechukwu' },
    { id: '2', name: 'Adeyemi Samuel' }
  ])
  
  const [newAttendee, setNewAttendee] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'application/pdf']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      alert('Only JPEG, PNG, PDF, and MP4 files are allowed')
      return
    }
    
    // Validate file sizes (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert('Files must be under 50MB')
      return
    }
    
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const addAttendee = () => {
    if (newAttendee.trim()) {
      const newAttendeeObj = {
        id: Date.now().toString(),
        name: newAttendee.trim()
      }
      setAttendees(prev => [...prev, newAttendeeObj])
      setNewAttendee('')
    }
  }

  const removeAttendee = (id: string) => {
    setAttendees(prev => prev.filter(attendee => attendee.id !== id))
  }

  const handleSchedule = async () => {
    setLoading(true)
    
    try {
      const meetingData = {
        ...formData,
        attendees,
        files: uploadedFiles
      }
      
      await onSchedule(meetingData)
      
      // Reset form
      setFormData({
        meetingTitle: '',
        frequency: 'one-off',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: ''
      })
      setAttendees([])
      setUploadedFiles([])
      setNewAttendee('')
      
      onClose()
    } catch (error) {
      console.error('Error scheduling meeting:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add New Meeting</h3>
              <p className="text-sm text-gray-600">Kindly fill in your Event details.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meeting Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
            <input
              type="text"
              value={formData.meetingTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, meetingTitle: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="one-off">One-Off</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Meeting Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Invite Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invite Attendees</label>
            <div className="border border-gray-300 rounded-lg p-3 min-h-[60px]">
              <div className="flex flex-wrap gap-2 mb-2">
                {attendees.map((attendee) => (
                  <span
                    key={attendee.id}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {attendee.name}
                    <button
                      onClick={() => removeAttendee(attendee.id)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAttendee()}
                placeholder="Type to add attendees..."
                className="w-full border-0 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
              <p className="text-gray-400 text-sm mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,video/mp4,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="meeting-file-upload"
              />
              <label
                htmlFor="meeting-file-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Browse File
              </label>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
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

          {/* Meeting Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Description (Optional)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the meeting purpose..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Schedule Button */}
          <button
            onClick={handleSchedule}
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
                Scheduling...
              </span>
            ) : (
              'Schedule Meeting'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScheduleMeetingModal
