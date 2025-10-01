import { useState, useEffect } from 'react'
// Local chat API placeholder to satisfy original interface
const chatAPI = {
  getConversations: async () => ({ data: [] as any[] }),
  getMessages: async (_conversationId: string) => ({ data: [] as any[] }),
  sendMessage: async (_conversationId: string, _content: string) => ({ data: { id: Date.now().toString(), content: _content } }),
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const response = await chatAPI.getConversations()
        setConversations(response.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  return {
    conversations,
    loading,
    error,
  }
}

export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return

      try {
        setLoading(true)
        const response = await chatAPI.getMessages(conversationId)
        setMessages(response.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [conversationId])

  const sendMessage = async (content: string) => {
    try {
      const response = await chatAPI.sendMessage(conversationId, content)
      const newMsg: Message = {
        id: response.data.id,
        senderId: 'me',
        content: content,
        timestamp: new Date(),
        read: false,
      }
      setMessages(prev => [...prev, newMsg])
      return newMsg
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
      throw err
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
  }
}