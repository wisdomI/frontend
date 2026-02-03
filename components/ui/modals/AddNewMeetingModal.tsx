'use client'
import React, { useState } from 'react'
import { FiX, FiArrowLeft, FiCalendar, FiClock, FiChevronDown, FiCloud, FiTrash2, FiPlus } from 'react-icons/fi'

interface AddNewMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (meetingData: any) => void
}

const AddNewMeetingModal: React.FC<AddNewMeetingModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [meetingTitle, setMeetingTitle] = useState('First Alignment Call')
  const [frequency, setFrequency] = useState('One-Off')
  const [startDate, setStartDate] = useState('12/05/2025')
  const [endDate, setEndDate] = useState('23/05/2025')
  const [startTime, setStartTime] = useState('9:00 am')
  const [endTime, setEndTime] = useState('9:30 am')
  const [attendees, setAttendees] = useState(['Uka Tobechukwu', 'Adeyemi Samuel'])
  const [newAttendee, setNewAttendee] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Cake Image.jpeg', size: '854kb' },
    { id: 2, name: 'Cake Image.jpeg', size: '854kb' }
  ])
  const [description, setDescription] = useState('This meeting is to align on my requirements with Client')

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

  const handleAddAttendee = () => {
    if (newAttendee.trim() && !attendees.includes(newAttendee.trim())) {
      setAttendees([...attendees, newAttendee.trim()])
      setNewAttendee('')
    }
  }

  const handleRemoveAttendee = (attendeeToRemove: string) => {
    setAttendees(attendees.filter(attendee => attendee !== attendeeToRemove))
  }

  const handleSaveMeeting = () => {
    const meetingData = {
      title: meetingTitle,
      frequency,
      startDate,
      endDate,
      startTime,
      endTime,
      attendees,
      files: uploadedFiles,
      description
    }
    onSave(meetingData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Meeting</h2>
              <p className="text-sm text-gray-600">Kindly fill in your Event details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Meeting Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
            <div className="relative">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              >
                <option value="One-Off">One-Off</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Meeting Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Meeting Date & Time</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <div className="relative">
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <div className="relative">
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Invite Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invite Attendees</label>
            
            {/* Existing Attendees */}
            <div className="flex flex-wrap gap-2 mb-3">
              {attendees.map((attendee, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>{attendee}</span>
                  <button
                    onClick={() => handleRemoveAttendee(attendee)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Attendee */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add attendee..."
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAttendee()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              />
              <button
                onClick={handleAddAttendee}
                className="px-4 py-2 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#032D71' }}
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Upload</label>
            
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
                className="px-4 py-2 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
                style={{ backgroundColor: '#032D71' }}
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

          {/* Meeting Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSaveMeeting}
            className="w-full px-6 py-3 text-white rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#032D71' }}
          >
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddNewMeetingModal
