import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useMessaging } from '@/hooks/useMessaging'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useMeetings } from '@/hooks/useMeetings'
import { usePagination } from '@/lib/pagination'
import { createFormData, validateProfilePicture } from '@/lib/fileUpload'
import { profileAPI, portfolioAPI, serviceAPI, ratingAPI } from '@/lib/api'
import { RegisterRequest, CreateServiceRequestData, CreateMeetingRequest } from '@/types/api'

// Example: User Registration Component
export const UserRegistrationExample: React.FC = () => {
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    accountType: 'individual',
    firstName: '',
    lastName: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await register(formData)
    if (success) {
      console.log('Registration successful!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Account Type</label>
        <select
          value={formData.accountType}
          onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value as any }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="individual">Individual</option>
          <option value="business">Business</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>

      {formData.accountType === 'individual' && (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </>
      )}

      {(formData.accountType === 'business' || formData.accountType === 'vendor') && (
        <>
          <input
            type="text"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            placeholder="Business Address"
            value={formData.businessAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

// Example: File Upload Component
export const FileUploadExample: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validation = validateProfilePicture(selectedFile)
      if (validation.isValid) {
        setFile(selectedFile)
        setError(null)
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(selectedFile)
      } else {
        setError(validation.errors.join(', '))
        setFile(null)
        setPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('displayPicture', file)
      
      await profileAPI.updateDisplayPicture('user-id', formData)
      console.log('File uploaded successfully!')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {preview && (
        <div className="relative w-32 h-32">
          <Image src={preview} alt="Preview" fill className="object-cover rounded-lg" />
        </div>
      )}

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      )}
    </div>
  )
}

// Example: Service Request Creation
export const ServiceRequestExample: React.FC = () => {
  const { createRequest, loading, error } = useServiceRequests()
  const [formData, setFormData] = useState<CreateServiceRequestData>({
    eventTitle: '',
    eventType: '',
    eventStartDate: '',
    eventEndDate: '',
    eventLocation: '',
    eventCity: '',
    servicesNeeded: [],
    numberOfGuests: 0,
    budgetRange: '',
    images: [],
    additionalInformation: '',
    needsEventPlanner: false,
    needsAISuggestions: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSubmit = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value as string)
    })
    const success = await createRequest(formDataToSubmit)
    if (success) {
      console.log('Service request created successfully!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Event Title"
        value={formData.eventTitle}
        onChange={(e) => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
        required
      />

      <input
        type="text"
        placeholder="Event Type (wedding, corporate, etc.)"
        value={formData.eventType}
        onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          value={formData.eventStartDate}
          onChange={(e) => setFormData(prev => ({ ...prev, eventStartDate: e.target.value }))}
          className="w-full rounded-md border-gray-300 shadow-sm"
          required
        />
        <input
          type="date"
          value={formData.eventEndDate}
          onChange={(e) => setFormData(prev => ({ ...prev, eventEndDate: e.target.value }))}
          className="w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <input
        type="text"
        placeholder="Event Location"
        value={formData.eventLocation}
        onChange={(e) => setFormData(prev => ({ ...prev, eventLocation: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
        required
      />

      <input
        type="text"
        placeholder="Event City"
        value={formData.eventCity}
        onChange={(e) => setFormData(prev => ({ ...prev, eventCity: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
        required
      />

      <input
        type="number"
        placeholder="Number of Guests"
        value={formData.numberOfGuests}
        onChange={(e) => setFormData(prev => ({ ...prev, numberOfGuests: parseInt(e.target.value) }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
        required
      />

      <input
        type="text"
        placeholder="Budget Range (e.g., 5000-10000)"
        value={formData.budgetRange}
        onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
        required
      />

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.needsEventPlanner}
            onChange={(e) => setFormData(prev => ({ ...prev, needsEventPlanner: e.target.checked }))}
            className="mr-2"
          />
          Needs Event Planner
        </label>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.needsAISuggestions}
            onChange={(e) => setFormData(prev => ({ ...prev, needsAISuggestions: e.target.checked }))}
            className="mr-2"
          />
          Needs AI Suggestions
        </label>
      </div>

      <textarea
        placeholder="Additional Information"
        value={formData.additionalInformation}
        onChange={(e) => setFormData(prev => ({ ...prev, additionalInformation: e.target.value }))}
        className="w-full rounded-md border-gray-300 shadow-sm"
        rows={3}
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Service Request'}
      </button>
    </form>
  )
}

// Example: Messaging Component
export const MessagingExample: React.FC = () => {
  const {
    conversations,
    messages,
    unreadCount,
    sendMessage,
    fetchConversations,
    fetchMessages,
    loading,
    error
  } = useMessaging()
  
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecipient || !messageText.trim()) return

    const success = await sendMessage(selectedRecipient, messageText, 'text')

    if (success) {
      setMessageText('')
    }
  }

  return (
    <div className="flex h-96 border rounded-lg">
      {/* Conversations List */}
      <div className="w-1/3 border-r p-4">
        <h3 className="font-semibold mb-4">Conversations ({unreadCount} unread)</h3>
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                const recipient = conversation.participants.find(p => p.id !== 'current-user-id')
                if (recipient) {
                  setSelectedRecipient(recipient.id)
                  fetchMessages(recipient.id)
                }
              }}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                conversation.unreadCount > 0 ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium">
                {conversation.participants.find(p => p.id !== 'current-user-id')?.firstName || 'Unknown'}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {conversation.lastMessage?.message || 'No messages'}
              </div>
              {conversation.unreadCount > 0 && (
                <div className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mt-1">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRecipient ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.senderId === 'current-user-id' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs ${
                      message.senderId === 'current-user-id'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !messageText.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {error && (
        <div className="absolute bottom-4 right-4 bg-red-600 text-white p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}

// Example: Pagination Component
export const PaginationExample: React.FC = () => {
  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const [items, setItems] = useState<any[]>([])

  const loadItems = useCallback(async () => {
    try {
      // Simulate API call with pagination
      const response = await fetch(`/api/items?page=${pagination.params.page}&limit=${pagination.params.limit}`)
      const data = await response.json()
      setItems(data.items)
      pagination.updateFromResponse(data.pagination)
    } catch (error) {
      console.error('Failed to load items:', error)
    }
  }, [pagination])

  useEffect(() => {
    loadItems()
  }, [pagination.params.page, pagination.params.limit, loadItems])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Showing {items.length} of {pagination.pagination.totalItems} items
        </h3>
        <select
          value={pagination.pagination.itemsPerPage}
          onChange={(e) => pagination.setLimit(parseInt(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg">
            Item {index + 1}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={pagination.previousPage}
          disabled={!pagination.pagination.hasPreviousPage}
          className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="px-3 py-1">
          Page {pagination.pagination.currentPage} of {pagination.pagination.totalPages}
        </span>

        <button
          onClick={pagination.nextPage}
          disabled={!pagination.pagination.hasNextPage}
          className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// Main Example Component
export const ApiIntegrationExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('registration')

  const tabs = [
    { id: 'registration', label: 'User Registration', component: <UserRegistrationExample /> },
    { id: 'upload', label: 'File Upload', component: <FileUploadExample /> },
    { id: 'service-request', label: 'Service Request', component: <ServiceRequestExample /> },
    { id: 'messaging', label: 'Messaging', component: <MessagingExample /> },
    { id: 'pagination', label: 'Pagination', component: <PaginationExample /> }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">API Integration Examples</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  )
}
