'use client'

import { useState, useEffect, useCallback } from 'react'
import { messageAPI } from '@/lib/api'
import { Message, Conversation } from '@/types/api'

interface UseMessagingOptions {
  autoFetch?: boolean
  refreshInterval?: number
}

export function useMessaging(options: UseMessagingOptions = {}) {
  const { autoFetch = true, refreshInterval = 30000 } = options
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await messageAPI.getConversations()
      setConversations(response.data || [])
    } catch (err) {
      setError('Failed to fetch conversations')
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMessages = useCallback(async (recipientId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await messageAPI.getConversation(recipientId)
      setMessages(response.data || [])
    } catch (err) {
      setError('Failed to fetch messages')
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await messageAPI.unreadCount()
      setUnreadCount(response.data?.count || 0)
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }, [])

  const sendMessage = useCallback(async (recipientId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    try {
      setError(null)
      const response = await messageAPI.send({
        recipientId,
        message,
        messageType
      })
      
      // Add the new message to the current messages
      const sentMessage = response.data
      if (!sentMessage) {
        throw new Error('Message send succeeded but no payload was returned')
      }

      setMessages(prev => [...prev, sentMessage])
      
      // Refresh conversations to update last message
      await fetchConversations()
      await fetchUnreadCount()
      
      return sentMessage
    } catch (err) {
      setError('Failed to send message')
      console.error('Error sending message:', err)
      throw err
    }
  }, [fetchConversations, fetchUnreadCount])

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await messageAPI.markAsRead(messageId)
      await fetchUnreadCount()
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }, [fetchUnreadCount])

  const markConversationAsRead = useCallback(async (recipientId: string) => {
    try {
      await messageAPI.markConversationAsRead(recipientId)
      await fetchUnreadCount()
    } catch (err) {
      console.error('Error marking conversation as read:', err)
    }
  }, [fetchUnreadCount])

  const editMessage = useCallback(async (messageId: string, newMessage: string) => {
    try {
      setError(null)
      await messageAPI.edit(messageId, newMessage)
      
      // Update local messages
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, message: newMessage, isEdited: true } : msg
      ))
      
      await fetchConversations()
    } catch (err) {
      setError('Failed to edit message')
      console.error('Error editing message:', err)
      throw err
    }
  }, [fetchConversations])

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setError(null)
      await messageAPI.delete(messageId)
      
      // Remove from local messages
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
      
      await fetchConversations()
    } catch (err) {
      setError('Failed to delete message')
      console.error('Error deleting message:', err)
      throw err
    }
  }, [fetchConversations])

  const searchMessages = useCallback(async (query: string, page: number = 1, limit: number = 20) => {
    try {
      setLoading(true)
      setError(null)
      const response = await messageAPI.search({ q: query, page, limit })
      return response.data || []
    } catch (err) {
      setError('Failed to search messages')
      console.error('Error searching messages:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getOnlineStatus = useCallback(async (userId: string) => {
    try {
      const response = await messageAPI.getOnlineStatus(userId)
      return response.data
    } catch (err) {
      console.error('Error getting online status:', err)
      throw err
    }
  }, [])

  const conversationExists = useCallback(async (recipientId: string) => {
    try {
      const response = await messageAPI.conversationExists(recipientId)
      return response.data?.exists || false
    } catch (err) {
      console.error('Error checking conversation existence:', err)
      return false
    }
  }, [])

  const getLatestMessage = useCallback(async (recipientId: string) => {
    try {
      const response = await messageAPI.latestMessage(recipientId)
      return response.data
    } catch (err) {
      console.error('Error getting latest message:', err)
      return null
    }
  }, [])

  const getConversationStats = useCallback(async () => {
    try {
      const response = await messageAPI.getStats()
      return response.data
    } catch (err) {
      console.error('Error getting conversation stats:', err)
      throw err
    }
  }, [])

  // Auto-refresh conversations and unread count
  useEffect(() => {
    if (autoFetch) {
      fetchConversations()
      fetchUnreadCount()
    }
  }, [autoFetch, fetchConversations, fetchUnreadCount])

  // Set up auto-refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchConversations()
        fetchUnreadCount()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [refreshInterval, fetchConversations, fetchUnreadCount])

  return {
    conversations,
    messages,
    unreadCount,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    fetchUnreadCount,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    editMessage,
    deleteMessage,
    searchMessages,
    getOnlineStatus,
    conversationExists,
    getLatestMessage,
    getConversationStats,
    setMessages,
    setError
  }
}