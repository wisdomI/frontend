'use client'

import { FiUsers, FiPaperclip, FiImage, FiFileText } from 'react-icons/fi'

interface AttachmentDropdownProps {
  onSelect: (type: string) => void
}

const AttachmentDropdown: React.FC<AttachmentDropdownProps> = ({ onSelect }) => {
  const attachments = [
    {
      id: 'schedule',
      label: 'Schedule Meeting',
      icon: <FiUsers className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-event-blue',
      iconColor: 'text-event-blue'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FiPaperclip className="w-5 h-5" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-400'
    },
    {
      id: 'media',
      label: 'Pictures & Videos',
      icon: <FiImage className="w-5 h-5" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-400'
    },
    {
      id: 'invoice',
      label: 'Generate Invoice',
      icon: <FiFileText className="w-5 h-5" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-400'
    }
  ]

  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-2">
        {attachments.map((attachment) => (
          <button
            key={attachment.id}
            onClick={() => onSelect(attachment.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
              attachment.id === 'schedule' ? 'bg-blue-50' : ''
            }`}
          >
            <div className={`${attachment.iconColor}`}>
              {attachment.icon}
            </div>
            <span className={`text-sm font-medium ${attachment.textColor}`}>
              {attachment.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AttachmentDropdown
