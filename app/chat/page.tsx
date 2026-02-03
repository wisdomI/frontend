'use client'

import { useState, useEffect } from 'react'
import ChatWindow from '@/components/chat/ChatWindow'
import { useMessaging } from '@/hooks/useMessaging'
import { useAuthContext } from '@/contexts/AuthContext'

export default function ChatPage() {
  const { user } = useAuthContext()
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const { conversations, loading, error, sendMessage } = useMessaging()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-600">Failed to load conversations</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <h3 className="font-medium">
                    {conversation.participants.find(p => p.id !== user?.id)?.firstName + ' ' + 
                     conversation.participants.find(p => p.id !== user?.id)?.lastName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {conversation.lastMessage?.message || 'No messages yet'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {conversation.lastMessage?.createdAt ? 
                      new Date(conversation.lastMessage.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-3">
          {selectedConversation ? (
            <ChatWindow 
              conversation={selectedConversation}
              onSendMessage={sendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h3>
                <p className="text-sm text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}