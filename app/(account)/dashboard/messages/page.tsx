'use client';

import React, { useState } from 'react';
import { Search, Phone, Video, MoreHorizontal, Paperclip, Smile, Send, CheckCircle2, File, Image, MoreVertical, PlusIcon, CameraIcon, Mic2Icon, MicIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import  Button  from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockConversations } from '@/data/mockmessages';
import { Conversation, Message } from '@/types/message';

const MessagesComponent = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'Unread') {
      return matchesSearch && conv.isUnread;
    }
    if (activeTab === 'Archived') {
      return matchesSearch && false; // No archived messages in mock data
    }
    return matchesSearch;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // This would  send the message to backend
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent'
    };

    // Update the conversation with the new message
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    
    setNewMessage('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-full bg-white mr-6 " >
      {/* Left Sidebar - Conversations List */}
       
      <div className="w-1/3  flex flex-col ml-4">
        {/* Header */}

        <h1 className="text-xl font-semibold font-heading  text-gray-900 mb-4">Messages</h1>
        <div className=" mb-3  ">
        
          {/* Search */}
          <div className="relative b-4">
            <Search className="absolute left-3 top-1/2  font-normal font-sans transform -translate-y-1/2 text-gray-700 h-4 w-4" />
            <Input
              placeholder="Search by Name or Keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-xl border border-gray-200">
          {(['All', 'Unread', 'Archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab
                  ? 'text-event-blue border-blue-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto shadow-sm bder border-gray-200 rounded-xl mt-3 ">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={cn(
                'flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors',
                selectedConversation.id === conversation.id && 'bg-blue-50'
              )}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback className="bg-blue-900 text-white">
                  {getInitials(conversation.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {conversation.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    {conversation.isUnread && (
                      <div className="w-5 h-5 bg-event-blue rounded-full flex items-center justify-center text-white p-2">
                        <p className='font-sans font-normal p-2'>2</p></div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {conversation.hasAttachment && (
                    <>
                      {conversation.attachmentType === 'image' ? (
                        <Image className="h-3 w-3 text-gray-400" />
                      ) : (
                        <File className="h-3 w-3 text-gray-400" />
                      )}
                    </>
                  )}
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col mx-6">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-1 mb-3 my-10 border border-gray-200 bg-white shadow-sm rounded-lg">
          <div className="flex items-center">
            <Avatar className=" mx-2 h-10 w-10 mr-3 border-4 border-green-500">
              <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
              <AvatarFallback className="bg-event-blue text-white">
                {getInitials(selectedConversation.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedConversation.name}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="underfined" size="md">
              <Video className="h-5 w-5 hover:border-gray-500 text-gray-600" />
            </Button>
            <Button variant="undefined" size="md">
              <Phone className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="undefined" size="md">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {selectedConversation.messages.map((message, index) => {
            const showDate = index === 0 || 
              (index > 0 && selectedConversation.messages[index - 1].timestamp !== message.timestamp);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center mb-4">
                    <span className="text-xs font-sans  text-gray-900 px-3 py-1 rounded-full ">
                      {index === 0 ? "23rd Jan 2025" : message.timestamp === "Yesterday" ? "Yesterday" : "Today"}
                    </span>
                  </div>
                )}
                
                <div className={cn(
                  'flex',
                  message.isOwn ? 'justify-end' : 'justify-start'
                )}>
                  <div className={cn(
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.isOwn 
                      ? 'bg-white text-gray-900 rounded-br-none' 
                      : 'bg-white text-gray-900 rounded-bl-none shadow-sm border'
                  )}>
                    <p className="text-sm">{message.content}</p>
                    <div className={cn(
                      'flex items-center gap-1 mt-1',
                      message.isOwn ? 'justify-end' : 'justify-start'
                    )}>
                      <span className={cn(
                        'text-xs',
                        message.isOwn ? 'text-gray-900' : 'text-gray-900'
                      )}>
                        {message.timestamp}
                      </span>
                      {message.isOwn && message.status && (
                        <CheckCircle2 className={cn(
                          'h-3 w-3',
                          message.status === 'read' ? 'text-gray-900' : 'text-gray-600'
                        )} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="p-2 my-2 rounded-lg shadow-sm border border-gray-200 bg-white">
          <div className="flex items-center gap-1">
            <Button variant="undefined" size="md" className="text-gray-500">
              <PlusIcon className="h-5 w-5" />
            </Button>
            <Button variant="undefined" size="md" className="text-gray-500">
              <Smile className="h-5 w-5" />
            </Button>
            
            <Input
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="flex-1 border-none shadow-none"
            />
            <div className='flex items-center gap-4 mx-2 '>

              <CameraIcon className="h-5 w-5 text-gray-500" />
            < MicIcon   className="h-5 w-5 text-gray-500" />
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className=" hover:text-event-blue"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesComponent;