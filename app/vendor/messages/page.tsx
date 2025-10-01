'use client'

import { useState } from 'react'
import { FiSearch, FiVideo, FiPhone, FiMoreHorizontal, FiPaperclip, FiSmile, FiCamera, FiMic, FiSend } from 'react-icons/fi'
import MediaModal from '@/components/ui/modals/MediaModal'
import InvoiceModal from '@/components/ui/modals/InvoiceModal'
import AttachmentDropdown from '@/components/ui/AttachmentDropdown'
import PlaceholderImage from '@/components/ui/PlaceholderImage'

interface Message {
  id: string
  content: string
  sender: 'user' | 'vendor'
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  onlineStatus: 'online' | 'away' | 'offline'
  messages: Message[]
}

const MessagesPage = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [showConversationList, setShowConversationList] = useState(true)

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Daniel Adebayo',
      avatar: '/images/avatar1.jpg',
      lastMessage: 'Typing...',
      timestamp: '4:54pm',
      unreadCount: 2,
      onlineStatus: 'online',
      messages: [
        {
          id: '1',
          content: 'Please I will like us to discuss about thd Cake request for my daughter',
          sender: 'user',
          timestamp: '4:54pm',
          isRead: true
        },
        {
          id: '2',
          content: 'Oh that\'s nice. Thanks for choosing UK Cakes & Cream',
          sender: 'vendor',
          timestamp: '4:54pm',
          isRead: true
        }
      ]
    },
    {
      id: '2',
      name: 'Adaeze Nora',
      avatar: '/images/avatar2.jpg',
      lastMessage: 'Good day Tate. Trust you are...',
      timestamp: '4:54pm',
      unreadCount: 0,
      onlineStatus: 'away',
      messages: []
    },
    {
      id: '3',
      name: 'Mariam Michael',
      avatar: '/images/avatar3.jpg',
      lastMessage: 'I will like us to negotiate and the',
      timestamp: '4:54pm',
      unreadCount: 1,
      onlineStatus: 'offline',
      messages: []
    },
    {
      id: '4',
      name: 'Chizzy Mary',
      avatar: '/images/avatar4.jpg',
      lastMessage: 'Daniel Williams_CV.',
      timestamp: '4:54pm',
      unreadCount: 0,
      onlineStatus: 'online',
      messages: []
    }
  ]

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (activeTab) {
      case 'unread':
        return matchesSearch && conv.unreadCount > 0
      case 'archived':
        return matchesSearch // In a real app, this would filter archived conversations
      default:
        return matchesSearch
    }
  })

  const currentConversation = conversations.find(conv => conv.id === activeConversation)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  const handleAttachmentSelect = (type: string) => {
    setShowAttachmentDropdown(false)
    switch (type) {
      case 'media':
        setShowMediaModal(true)
        break
      case 'invoice':
        setShowInvoiceModal(true)
        break
      default:
        break
    }
  }

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId)
    // On mobile, hide conversation list when a chat is selected
    if (window.innerWidth < 1024) {
      setShowConversationList(false)
    }
  }

  const handleBackToConversations = () => {
    setShowConversationList(true)
    setActiveConversation(null)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Back button for mobile */}
            {!showConversationList && (
              <button
                onClick={handleBackToConversations}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Messages</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Conversation List */}
        <div className={`${showConversationList ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/3 bg-white border-r border-gray-200 flex-col`}>
          {/* Search */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Name or Keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'archived', label: 'Archived' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium ${
                  activeTab === tab.key
                    ? 'text-event-blue border-b-2 border-event-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  activeConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200">
                      <PlaceholderImage 
                        width={40} 
                        height={40} 
                        className="w-full h-full rounded-full"
                        alt={conversation.name}
                      />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                      conversation.onlineStatus === 'online' ? 'bg-green-500' :
                      conversation.onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs sm:text-sm text-gray-600 truncate flex-1">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-event-blue text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[16px] sm:min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className={`${!showConversationList ? 'flex' : 'hidden'} lg:flex flex-1 flex-col`}>
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200">
                      <PlaceholderImage 
                        width={32} 
                        height={32} 
                        className="w-full h-full rounded-full"
                        alt={currentConversation.name}
                      />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                      currentConversation.onlineStatus === 'online' ? 'bg-green-500' :
                      currentConversation.onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{currentConversation.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">UK Cakes & Cream</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiVideo className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiMoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Date Separator */}
                <div className="text-center">
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 sm:px-3 py-1 rounded-full">Today</span>
                </div>

                {/* Message Bubbles */}
                {currentConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'vendor' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                        message.sender === 'vendor'
                          ? 'bg-white border border-gray-200'
                          : 'bg-event-blue text-white'
                      }`}
                    >
                      <p className="text-xs sm:text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        message.sender === 'vendor' ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.sender === 'vendor' && message.isRead && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowAttachmentDropdown(!showAttachmentDropdown)}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiPaperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                    {showAttachmentDropdown && (
                      <AttachmentDropdown onSelect={handleAttachmentSelect} />
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-event-blue focus:border-transparent text-sm"
                    />
                  </div>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiSmile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiCamera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiMic className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-1.5 sm:p-2 bg-event-blue text-white rounded-full hover:bg-event-blue-hover transition-colors"
                  >
                    <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiSearch className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-sm text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MediaModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
      />
      
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        transaction={{
          id: 'mock-transaction-id',
          dateTime: new Date().toISOString(),
          invoiceNumber: 'INV-001',
          vendor: 'Mock Vendor',
          paymentMethod: 'credit-card',
          amount: 0,
          status: 'unpaid'
        }}
      />
    </div>
  )
}

export default MessagesPage