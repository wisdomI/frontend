'use client'

import { useState } from 'react'
import { FiX, FiArrowLeft } from 'react-icons/fi'
import PlaceholderImage from '@/components/ui/PlaceholderImage'

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'links' | 'documents'>('photos')

  const tabs = [
    { id: 'photos', label: 'Photos and Videos' },
    { id: 'links', label: 'Links' },
    { id: 'documents', label: 'Documents' }
  ]

  const photosData = [
    {
      month: 'August 2025',
      items: [
        { id: 1, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 2, type: 'photo', thumbnail: '/images/woman-laptop.jpg' },
        { id: 3, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 4, type: 'photo', thumbnail: '/images/woman-laptop.jpg' },
        { id: 5, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 6, type: 'photo', thumbnail: '/images/woman-laptop.jpg' },
        { id: 7, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 8, type: 'photo', thumbnail: '/images/woman-laptop.jpg' }
      ]
    },
    {
      month: 'July 2025',
      items: [
        { id: 9, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 10, type: 'photo', thumbnail: '/images/woman-laptop.jpg' },
        { id: 11, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 12, type: 'photo', thumbnail: '/images/woman-laptop.jpg' },
        { id: 13, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 14, type: 'photo', thumbnail: '/images/woman-laptop.jpg' },
        { id: 15, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 16, type: 'photo', thumbnail: '/images/woman-laptop.jpg' }
      ]
    },
    {
      month: 'June 2025',
      items: [
        { id: 17, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 18, type: 'photo', thumbnail: '/images/woman-laptop.jpg' },
        { id: 19, type: 'video', thumbnail: '/images/business-meeting.jpg', duration: '1:05' },
        { id: 20, type: 'photo', thumbnail: '/images/woman-laptop.jpg' }
      ]
    }
  ]

  const linksData = [
    {
      month: 'August 2025',
      items: [
        { id: 1, title: 'Event Halls', url: 'google.com/eventhalls', thumbnail: '/images/event-halls.jpg', timestamp: '3/8/24, 4:05pm' }
      ]
    },
    {
      month: 'July 2025',
      items: [
        { id: 2, title: 'Event Halls', url: 'google.com/eventhalls', thumbnail: '/images/event-halls.jpg', timestamp: '3/8/24, 4:05pm' }
      ]
    },
    {
      month: 'June 2025',
      items: [
        { id: 3, title: 'Event Halls', url: 'google.com/eventhalls', thumbnail: '/images/event-halls.jpg', timestamp: '3/8/24, 4:05pm' }
      ]
    }
  ]

  const documentsData = [
    {
      month: 'August 2025',
      items: [
        { id: 1, name: 'Cookery Book.pdf', type: 'pdf', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' },
        { id: 2, name: 'Cookery Book.doc', type: 'word', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' },
        { id: 3, name: 'Cookery Book.xlsx', type: 'excel', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' }
      ]
    },
    {
      month: 'July 2025',
      items: [
        { id: 4, name: 'Cookery Book.pdf', type: 'pdf', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' },
        { id: 5, name: 'Cookery Book.doc', type: 'word', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' },
        { id: 6, name: 'Cookery Book.xlsx', type: 'excel', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' }
      ]
    },
    {
      month: 'June 2025',
      items: [
        { id: 7, name: 'Cookery Book.pdf', type: 'pdf', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' },
        { id: 8, name: 'Cookery Book.doc', type: 'word', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' },
        { id: 9, name: 'Cookery Book.xlsx', type: 'excel', pages: '2 pages', size: '125KB', timestamp: '3/8/24, 4:05pm' }
      ]
    }
  ]

  const renderPhotos = () => (
    <div className="space-y-6">
      {photosData.map((section) => (
        <div key={section.month}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.month}</h3>
          <div className="grid grid-cols-4 gap-3">
            {section.items.map((item) => (
              <div key={item.id} className="relative group cursor-pointer">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <PlaceholderImage 
                    width="100%" 
                    height="100%" 
                    className="w-full h-full"
                    alt="Media"
                  />
                </div>
                {item.type === 'video' && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>{item.duration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderLinks = () => (
    <div className="space-y-6">
      {linksData.map((section) => (
        <div key={section.month}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.month}</h3>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <PlaceholderImage 
                    width="100%" 
                    height="100%" 
                    className="w-full h-full"
                    alt={item.title}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                  <p className="text-sm text-blue-600 underline truncate">{item.url}</p>
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      {documentsData.map((section) => (
        <div key={section.month}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.month}</h3>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.type === 'pdf' ? 'bg-red-100' :
                  item.type === 'word' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <span className={`text-xs font-bold ${
                    item.type === 'pdf' ? 'text-red-600' :
                    item.type === 'word' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {item.type === 'pdf' ? 'PDF' : item.type === 'word' ? 'W' : 'X'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.pages} | {item.size}</p>
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Media</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-6 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-event-blue border-b-2 border-event-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'photos' && renderPhotos()}
          {activeTab === 'links' && renderLinks()}
          {activeTab === 'documents' && renderDocuments()}
        </div>
      </div>
    </div>
  )
}

export default MediaModal
