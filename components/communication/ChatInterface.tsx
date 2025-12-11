"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Search, Paperclip, Smile, Camera, Mic, Send, Video, Phone, MoreVertical, Plus } from 'lucide-react'

interface ChatInterfaceProps {
  basePath?: string
}

export default function ChatInterface({ basePath = '/communication-admin' }: ChatInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all')
  const [message, setMessage] = useState('')
  const [activeChatId, setActiveChatId] = useState<string | null>('1')
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(true) // Start with chat open for desktop, or if an ID is present

  const handleChatSelect = (id: string) => {
    setActiveChatId(id)
    setIsMobileChatOpen(true)
  }

  const handleBackToList = () => {
    setIsMobileChatOpen(false)
  }

  const conversations = [
    {
      id: '1',
      name: 'Daniel Adebayo',
      avatar: '/images/avatar-1.jpg', // Placeholder
      lastMessage: 'Typing...',
      time: '4:54pm',
      unread: 0,
      isTyping: true,
      online: true
    },
    {
      id: '2',
      name: 'Adaeze Nora',
      avatar: '/images/avatar-2.jpg',
      lastMessage: 'Good day Tate. Trust you are...',
      time: '4:54pm',
      unread: 2,
      online: false
    },
    {
      id: '3',
      name: 'Mariam Michael',
      avatar: '/images/avatar-3.jpg',
      lastMessage: 'I will like us to negotiate and the',
      time: '4:54pm',
      unread: 2,
      online: true
    },
    {
      id: '4',
      name: 'Chizzy Mary',
      avatar: '/images/avatar-4.jpg',
      lastMessage: 'I will like us to negotiate and the',
      time: '4:54pm',
      unread: 2,
      online: false
    },
    {
      id: '5',
      name: 'Adaeze Nora',
      avatar: '/images/avatar-5.jpg',
      lastMessage: 'Daniel Williams_CV...',
      isFile: true,
      time: '4:54pm',
      unread: 2,
      online: false
    },
    {
      id: '6',
      name: 'Mariam Michael',
      avatar: '/images/avatar-6.jpg',
      lastMessage: 'Image2643.jpeg',
      isImage: true,
      time: '4:54pm',
      unread: 2,
      online: false
    },
  ]

  const currentChat = {
    id: '1',
    name: 'John Smith',
    avatar: '/images/avatar-john.jpg',
    online: true,
    messages: [
      {
        id: '1',
        type: 'date',
        content: '23rd Jan, 2025'
      },
      {
        id: '2',
        sender: 'user', // John
        content: "Hi, I'm having trouble processing my payment for the wedding event. The card keeps getting declined.",
        time: '4:54pm'
      },
      {
        id: '3',
        sender: 'admin', // Me
        content: "Hello John! I'm sorry to hear that. Let me help you with this. Can you confirm which payment method you're trying to use?",
        time: '4:54pm'
      },
      {
        id: '4',
        sender: 'user',
        content: "Hello John! I'm sorry to hear that. Let me help you with this. Can you confirm which payment method you're trying to use?\n\nI'm using my Visa card ending in 4532.",
        time: '4:54pm'
      },
      {
        id: '5',
        sender: 'admin',
        content: "Thank you. I can see the transaction attempts. It appears your bank may be flagging this as unusual activity. I recommend contacting your bank or trying an alternative payment method. Would you like me to send you a payment link with other options?",
        time: '4:54pm',
        status: 'read'
      },
      {
        id: '6',
        sender: 'user',
        content: "Oh that's nice. Thanks for your help!",
        time: '4:54pm'
      }
    ]
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-4">
        <Link 
          href={basePath}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chat Support
        </Link>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 relative">
        {/* Sidebar */}
        <div className={`
          w-full md:w-80 border-r border-gray-200 flex flex-col bg-white
          ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}
        `}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Chat Support</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name or Keyword"
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'all' ? 'border-[#0B2E6F] text-[#0B2E6F]' : 'border-transparent text-gray-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'unread' ? 'border-[#0B2E6F] text-[#0B2E6F]' : 'border-transparent text-gray-500'}`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'archived' ? 'border-[#0B2E6F] text-[#0B2E6F]' : 'border-transparent text-gray-500'}`}
            >
              Archived
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`p-4 flex gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${activeChatId === chat.id ? 'bg-blue-50/50' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {/* Placeholder for avatar */}
                    <span className="text-sm font-medium text-gray-500">{chat.name.charAt(0)}</span>
                  </div>
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${chat.isTyping ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center bg-[#0B2E6F] text-white text-[10px] font-bold rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`
          flex-1 flex-col bg-[#F9FAFB]
          ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}
        `}>
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center h-[73px]">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBackToList}
                className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="font-semibold text-green-700">JS</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <h2 className="font-semibold text-gray-900">{currentChat.name}</h2>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <button className="hover:text-gray-900 p-2"><Video className="w-5 h-5" /></button>
              <button className="hover:text-gray-900 p-2"><Phone className="w-5 h-5" /></button>
              <button className="hover:text-gray-900 p-2"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChat.messages.map((msg) => {
              if (msg.type === 'date') {
                return (
                  <div key={msg.id} className="flex justify-center my-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{msg.content}</span>
                  </div>
                )
              }

              const isMe = msg.sender === 'admin'
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-xl px-4 py-3 ${
                    isMe 
                      ? 'bg-white border border-gray-200 text-gray-800' // Outgoing
                      : 'bg-white border border-gray-200 text-gray-800' // Incoming (Style matching image - both seem white/light)
                  }`}>
                    {/* 
                       In the image:
                       Incoming (John): White bg, sharp corner top-left?
                       Outgoing (Admin): White bg, checkmark icon?
                       Actually, looking closer at the image:
                       John (User): White bubble, left aligned.
                       Admin (Me): White bubble, right aligned, with double checkmarks.
                       They all look like white bubbles on a light gray background.
                    */}
                    <div className="flex flex-col gap-1">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <div className={`flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-end'}`}>
                        {isMe && <span className="text-gray-400">✓✓</span>}
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
              <button className="text-gray-400 hover:text-gray-600"><Plus className="w-5 h-5" /></button>
              <button className="text-gray-400 hover:text-gray-600"><Smile className="w-5 h-5" /></button>
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
              />
              <button className="text-gray-400 hover:text-gray-600"><Camera className="w-5 h-5" /></button>
              <button className="text-gray-400 hover:text-gray-600"><Mic className="w-5 h-5" /></button>
              <button className="text-[#0B2E6F] hover:text-[#092456] ml-2"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

