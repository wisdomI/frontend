'use client'

import React, { useState, useRef } from 'react'
import { X, Upload, Calendar, Clock, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    eventType: '',
    ticketType: '',
    teamMembers: '',
    isPromoted: false,
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 font-asul">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-2 bg-[#0B2E6F] rounded-md text-white hover:bg-[#0d3a8a] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Event Title</label>
            <input
              type="text"
              placeholder="Enter Event Title"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Event Description</label>
            <textarea
              placeholder="Describe your event"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Event Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Event Time</label>
              <div className="relative">
                <input
                  type="time"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Venue</label>
            <input
              type="text"
              placeholder="Enter venue"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Event Type</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all text-gray-700 appearance-none bg-white"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option value="" disabled>Select Type</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Ticket Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ticket Type</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all text-gray-700 appearance-none bg-white"
                value={formData.ticketType}
                onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
              >
                <option value="" disabled>Select Type</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Event Poster */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Event Poster</label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-[#0B2E6F] bg-blue-50' : 'border-gray-300 hover:border-[#0B2E6F] hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,video/mp4,application/pdf"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                   <Upload className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedFile ? selectedFile.name : 'Choose a file or drag & drop it here'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPEG, PNG, PDG, and MP4 formats, up to 50MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="mt-2 px-6 py-2 bg-[#0B2E6F] text-white text-sm font-medium rounded-lg hover:bg-[#0d3a8a] transition-colors"
                >
                  Browse File
                </button>
              </div>
            </div>
          </div>

          {/* Assign Team Members */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Assign Team Members</label>
            <input
              type="text"
              placeholder="Enter team members"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0B2E6F] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              value={formData.teamMembers}
              onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
            />
          </div>

          {/* Promote Event */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Promote Event</h4>
              <p className="text-xs text-gray-500 mt-1">Boost visibility with featured placement</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPromoted: !formData.isPromoted })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2E6F] focus:ring-offset-2 ${
                formData.isPromoted ? 'bg-[#0B2E6F]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isPromoted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-4 mt-auto">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            className="flex-1 px-6 py-3 bg-[#0B2E6F] text-white font-semibold rounded-lg hover:bg-[#0d3a8a] transition-colors"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  )
}

