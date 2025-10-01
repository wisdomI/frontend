'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { messageAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { Message, Conversation } from '@/types/api'
import { FiSend, FiPaperclip, FiSearch, FiMoreVertical, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi'

interface MessageManagerProps {
  selectedRecipientId?: string
  onRecipientSelect?: (recipientId: string) => void
}

export default function MessageManager({ selectedRecipientId, onRecipientSelect }: MessageManagerProps) {
  const { user } = useAuthContext()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [editText, setEditText] = useState('')

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await messageAPI.getConversations()
      setConversations(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch conversations')
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await messageAPI.unreadCount()
      setUnreadCount(response.data.data?.count || 0)
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (recipientId: string) => {
    try {
      const response = await messageAPI.getConversation(recipientId)
      setMessages(response.data.data || [])
      
      // Mark conversation as read
      await messageAPI.markConversationAsRead(recipientId)
      
      // Update unread count
      fetchUnreadCount()
    } catch (err) {
      setError('Failed to fetch messages')
      console.error('Error fetching messages:', err)
    }
  }, [])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      // Get the recipient ID from participants (assuming current user is not the recipient)
      const currentUserId = user?.id
      const recipient = selectedConversation.participants.find(p => p.id !== currentUserId)
      if (!recipient) {
        setError('Could not identify recipient')
        return
      }
      
      const response = await messageAPI.send({
        recipientId: recipient.id,
        message: newMessage,
        messageType: 'text'
      })
      
      setMessages([...messages, response.data.data])
      setNewMessage('')
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      setError('Failed to send message')
      console.error('Error sending message:', err)
    }
  }

  // Edit message
  const editMessage = async (messageId: string, newText: string) => {
    try {
      await messageAPI.edit(messageId, newText)
      
      // Update local messages
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, message: newText, isEdited: true } : msg
      ))
      
      setEditingMessage(null)
      setEditText('')
    } catch (err) {
      setError('Failed to edit message')
      console.error('Error editing message:', err)
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      await messageAPI.delete(messageId)
      setMessages(messages.filter(msg => msg.id !== messageId))
    } catch (err) {
      setError('Failed to delete message')
      console.error('Error deleting message:', err)
    }
  }

  // Search messages
  const searchMessages = async (query: string) => {
    if (!query.trim()) return
    
    try {
      const response = await messageAPI.search({ q: query })
      // Handle search results - you might want to show them in a separate view
      console.log('Search results:', response.data.data)
    } catch (err) {
      setError('Failed to search messages')
      console.error('Error searching messages:', err)
    }
  }

  useEffect(() => {
    fetchConversations()
    fetchUnreadCount()
  }, [])

  useEffect(() => {
    if (selectedRecipientId) {
      const conversation = conversations.find(c => 
        c.participants.some(p => p.id === selectedRecipientId)
      )
      if (conversation) {
        setSelectedConversation(conversation)
        fetchMessages(selectedRecipientId)
      }
    }
  }, [selectedRecipientId, conversations, fetchMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-refresh conversations every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations()
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Messages</h3>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations
                .filter(conv => {
                  const currentUserId = user?.id
                  const recipient = conv.participants.find(p => p.id !== currentUserId)
                  return recipient && (
                    recipient.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    recipient.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    recipient.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    recipient.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                })
                .map((conversation) => {
                  const currentUserId = user?.id
                  const recipient = conversation.participants.find(p => p.id !== currentUserId)
                  return (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation)
                    if (recipient) {
                      fetchMessages(recipient.id)
                    }
                    onRecipientSelect?.(recipient?.id || '')
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id 
                      ? 'bg-blue-50 border-r-2 border-blue-600' 
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {(recipient?.firstName?.charAt(0) || recipient?.businessName?.charAt(0) || recipient?.email?.charAt(0) || 'U').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {recipient?.businessName || `${recipient?.firstName || ''} ${recipient?.lastName || ''}`.trim() || recipient?.email}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.message || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage?.createdAt && 
                          new Date(conversation.lastMessage.createdAt).toLocaleDateString()
                        }
                      </span>
                    </div>
                  </div>
                </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {(() => {
                      const currentUserId = user?.id
                      const recipient = selectedConversation.participants.find(p => p.id !== currentUserId)
                      return (recipient?.firstName?.charAt(0) || recipient?.businessName?.charAt(0) || recipient?.email?.charAt(0) || 'U').toUpperCase()
                    })()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {(() => {
                      const currentUserId = user?.id
                      const recipient = selectedConversation.participants.find(p => p.id !== currentUserId)
                      return recipient?.businessName || `${recipient?.firstName || ''} ${recipient?.lastName || ''}`.trim() || recipient?.email
                    })()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {(() => {
                      const currentUserId = user?.id
                      const recipient = selectedConversation.participants.find(p => p.id !== currentUserId)
                      return recipient?.email
                    })()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {editingMessage?.id === message.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-gray-900"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editMessage(message.id, editText)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingMessage(null)
                                setEditText('')
                              }}
                              className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-75">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                            {message.senderId === user?.id && (
                              <div className="flex items-center space-x-1">
                                {message.isRead ? (
                                  <FiCheck className="w-3 h-3" />
                                ) : (
                                  <FiCheck className="w-3 h-3" />
                                )}
                                {(message as any).isEdited && (
                                  <span className="text-xs opacity-75">edited</span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {message.senderId === user?.id && (
                            <div className="flex items-center space-x-1 mt-1">
                              <button
                                onClick={() => {
                                  setEditingMessage(message)
                                  setEditText(message.message)
                                }}
                                className="text-xs opacity-75 hover:opacity-100"
                              >
                                <FiEdit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="text-xs opacity-75 hover:opacity-100"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex items-center space-x-3">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiPaperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-700 underline text-xs mt-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
