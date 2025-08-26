'use client';

import React, { useState } from 'react';
import { Search, Phone, Video, Smile, Send, CheckCircle2, File, Image, MoreVertical, PlusIcon, CameraIcon, MicIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { mockConversations } from '@/data/mockmessages';
import { Conversation, Message } from '@/types/message';
import HeaderSwitch from '@/components/ui/HeaderSwitch';
import MediaModal from '@/components/ui/modal/MediaModal';
import PlusMenuModal from '@/components/ui/modal/PlusMenuModal';
import ViewMediaDropdown from '@/components/ui/dropdown/ViewMediaDropdown';
import ImagePreview from '@/components/ui/ImagePreview';

const MessagesComponent = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isViewMediaDropdownOpen, setIsViewMediaDropdownOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

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
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    // Create message with text and/or files
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage || (selectedFiles.length > 0 ? `Sent ${selectedFiles.length} file(s)` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent'
    };

    // Update the conversation with the new message
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));

    // Clear input and files
    setNewMessage('');
    setSelectedFiles([]);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handlePlusAction = (action: string) => {
    console.log('Plus action:', action);
    // Handle different actions here
    switch (action) {
      case 'schedule-meeting':
        console.log('Opening schedule meeting modal');
        break;
      case 'documents':
        console.log('Opening documents');
        break;
      case 'generate-invoice':
        console.log('Opening invoice generator');
        break;
      case 'pictures-videos':
        // This will be handled by the file input in PlusMenuModal
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg mt-3 ">
      {/* Page Header */}
      <h1 className="text-[20px] font-semibold font-heading text-gray-900 ">Messages</h1>

      <div className="flex h-full bg-white rounded-lg mb-10 py-2">
        {/* Left Sidebar - Conversations List */}
        <div className="w-1/3 flex flex-col p-4 border-r border-gray-200">
          {/* Header */}
      

          <div className="mb-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 font-normal font-sans transform -translate-y-1/2 text-gray-700 h-4 w-4" />
              <Input
                placeholder="Search by Name or Keyword"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
          <div className="flex-1 overflow-y-auto shadow-sm border border-gray-200 rounded-xl mt-3">
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
                          <p className='font-sans font-normal p-2'>2</p>
                        </div>
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
        <div className="flex-1 flex flex-col p-4">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 mb-3 border border-gray-200 bg-white shadow-sm rounded-lg">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 border-4 border-green-500">
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

            <div className="flex items-center gap-2 relative">
              <Button variant="ghost" size="sm">
                <Video className="h-5 w-5 hover:border-gray-500 text-gray-600" />
              </Button>
              <Button variant="ghost" size="sm">
                <Phone className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewMediaDropdownOpen(!isViewMediaDropdownOpen)}
                >
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </Button>
                <ViewMediaDropdown
                  isOpen={isViewMediaDropdownOpen}
                  onClose={() => setIsViewMediaDropdownOpen(false)}
                  onViewMedia={() => setIsMediaModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg relative"
            style={{
              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 100%)'
            }}
          >
            {selectedConversation.messages.map((message, index) => {
              const showDate = index === 0 ||
                (index > 0 && selectedConversation.messages[index - 1].timestamp !== message.timestamp);

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center mb-4">
                      <span className="text-xs font-sans text-gray-900 px-3 py-1 rounded-full">
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

          {/* File Preview Area */}
          {selectedFiles.length > 0 && (
            <div className="p-3 mb-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-3">
                {selectedFiles.map((file, index) => (
                  <ImagePreview
                    key={`${file.name}-${index}`}
                    file={file}
                    onRemove={() => removeFile(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-2 my-2 rounded-lg shadow-sm border border-gray-200 bg-white relative">
            <div className="flex items-center gap-1">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                >
                  <PlusIcon className="h-5 w-5" />
                </Button>
                <PlusMenuModal
                  isOpen={isPlusMenuOpen}
                  onClose={() => setIsPlusMenuOpen(false)}
                  onAction={handlePlusAction}
                  onFileUpload={handleFileUpload}
                />
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Smile className="h-5 w-5" />
              </Button>

              <Input
                placeholder="Type a message"
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="flex-1 border-none shadow-none"
              />
              <div className='flex items-center gap-4 mx-2'>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const fileArray = Array.from(files);
                      handleFileUpload(fileArray);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                  id="camera-input"
                />
                <label htmlFor="camera-input" className="cursor-pointer">
                  <CameraIcon className="h-5 w-5 text-gray-500 hover:text-event-blue transition-colors" />
                </label>
                <MicIcon className="h-5 w-5 text-gray-500" />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && selectedFiles.length === 0}
                className="hover:text-event-blue"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
      />
      </div>
    
  );
};

export default MessagesComponent;