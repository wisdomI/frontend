'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { FiUser, FiEdit2, FiCamera } from 'react-icons/fi'
import { useAuthContext } from '@/contexts/AuthContext'
import { profileAPI } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'
import Calendar, { CalendarEvent } from '@/components/ui/Calendar'

// Type for slot selection
interface SlotInfo {
  start: Date | string
  end: Date | string
  slots: Date[] | string[]
  action: 'select' | 'click' | 'doubleClick'
}

export default function VendorProfileSettingsPage() {
  const { user } = useAuthContext()
  const { addNotification } = useApp()
  const [activeTab, setActiveTab] = useState<'Profile Details' | 'Calendar'>('Profile Details')
  const [isEditing, setIsEditing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [displayPicture, setDisplayPicture] = useState<File | null>(null)
  const [displayPicturePreview, setDisplayPicturePreview] = useState<string | null>(null)
  
  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    // Sample events
    {
      id: 1,
      title: 'Meeting with Client',
      start: new Date(2025, 0, 15, 10, 0),
      end: new Date(2025, 0, 15, 11, 0),
    },
    {
      id: 2,
      title: 'Event Planning Session',
      start: new Date(2025, 0, 20, 14, 0),
      end: new Date(2025, 0, 20, 16, 0),
    },
  ])

  const tabs = [
    { id: 'Profile Details', label: 'Profile Details' },
    { id: 'Calendar', label: 'Calendar' }
  ] as const

  const handleDisplayPictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        addNotification({
          type: 'error',
          message: 'Please select a valid image file (JPEG or PNG)'
        })
        return
      }
      
      // Validate file size (5MB max for profile pictures)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        addNotification({
          type: 'error',
          message: 'File size must be under 5MB'
        })
        return
      }
      
      setDisplayPicture(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setDisplayPicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Upload to server
      setUploadingImage(true)
      try {
        const formData = new FormData()
        formData.append('displayPicture', file)
        
        await profileAPI.updateDisplayPicture(user?.id || '', formData)
        addNotification({
          type: 'success',
          message: 'Profile picture updated successfully!'
        })
      } catch (error) {
        console.error('Error uploading image:', error)
        addNotification({
          type: 'error',
          message: 'Failed to upload profile picture'
        })
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleRemoveImage = async () => {
    try {
      await profileAPI.removeDisplayPicture(user?.id || '')
      setDisplayPicture(null)
      setDisplayPicturePreview(null)
      setProfileImage(null)
      addNotification({
        type: 'success',
        message: 'Profile picture removed successfully!'
      })
    } catch (error) {
      console.error('Error removing image:', error)
      addNotification({
        type: 'error',
        message: 'Failed to remove profile picture'
      })
    }
  }

  const handleSaveProfile = () => {
    addNotification({
      type: 'success',
      message: 'Profile updated successfully!'
    })
  }

  // Calendar event handlers
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    const title = window.prompt('New Event Name')
    if (title) {
      const newEvent: CalendarEvent = {
        id: calendarEvents.length + 1,
        title,
        start: slotInfo.start as Date,
        end: slotInfo.end as Date,
      }
      setCalendarEvents([...calendarEvents, newEvent])
      addNotification({
        type: 'success',
        message: 'Event created successfully!'
      })
    }
  }, [calendarEvents, addNotification])

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    const deleteEvent = window.confirm(`Delete event "${event.title}"?`)
    if (deleteEvent) {
      setCalendarEvents(calendarEvents.filter(e => e.id !== event.id))
      addNotification({
        type: 'success',
        message: 'Event deleted successfully!'
      })
    }
  }, [calendarEvents, addNotification])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-[#0B2E6F] border-b-2 border-[#0B2E6F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'Profile Details' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Profile Details</h2>
              
              {/* Profile Picture Section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {uploadingImage ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0B2E6F]"></div>
                      </div>
                    ) : displayPicturePreview || profileImage ? (
                      <Image 
                        src={displayPicturePreview || profileImage || ''} 
                        alt="Business Display Picture" 
                        fill
                        className="object-cover" 
                      />
                    ) : (user?.businessName || user?.firstName || user?.displayName) ? (
                      <span className="text-2xl font-semibold text-gray-600">
                        {(user?.businessName || user?.firstName || user?.displayName || 'V').charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <FiUser className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <button 
                    onClick={() => document.getElementById('display-picture-upload')?.click()}
                    disabled={uploadingImage}
                    className="absolute -bottom-1 -right-1 bg-[#0B2E6F] text-white p-2 rounded-full hover:bg-[#0A285F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiEdit2 className="w-3 h-3" />
                  </button>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleDisplayPictureChange}
                    className="hidden"
                    id="display-picture-upload"
                  />
                  {(displayPicturePreview || profileImage) && !uploadingImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiCamera className="w-2 h-2" />
                    </button>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.businessName || user?.firstName || 'Business Name'}
                  </h3>
                  <p className="text-gray-600">
                    {user?.businessName || user?.firstName + ' ' + user?.lastName || 'Vendor'}
                  </p>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-2 px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Calendar' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Calendar</h2>
              <p className="text-gray-600 mb-4">
                Click on a time slot to create a new event. Click on an existing event to delete it.
              </p>
              
              <Calendar
                events={calendarEvents}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                defaultView="month"
                views={['month', 'week', 'day', 'agenda']}
                selectable={true}
                style={{ height: 600 }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSaveProfile}
            className="px-6 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
