'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Bell, ChevronDown, Search, LogOut, Settings, User, MessageSquare } from 'lucide-react';
import Logo from '@/public/images/primary-logo.png';
import LocationSelect from './select/LocationSelect';
import NotificationBadge from './NotificationBadge';
import { mockUser, mockNotifications } from '@/data/mockUser';

const DashboardHeader = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery, 'in', selectedLocation);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout logic
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center min-w-[160px]">
            <a href="/dashboard" className="text-2xl font-bold text-event-blue">
              <Image 
                src={Logo}
                alt="EventHub logo"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </a>
          </div>
          
          {/* Center Section - Location Dropdown and Search */}
          <div className="flex items-center space-x-0 flex-1 max-w-2xl mx-8">
            {/* Location Dropdown */}
            <div className="min-w-[180px]">
              <div className="[&>div>button]:rounded-l-lg [&>div>button]:rounded-r-none [&>div>button]:bg-event-blue [&>div>button]:text-white [&>div>button]:border-event-blue [&>div>button]:h-10 [&>div>button]:hover:bg-event-blue-hover">
                <LocationSelect
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  placeholder="Select Location"
                />
              </div>
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Services, Vendors"
                className="flex-1 px-4 py-2 border-t border-b border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue h-10"
              />
              <button
                type="submit"
                className="bg-event-blue text-white px-6 py-2 rounded-r-lg hover:bg-event-blue-hover transition-colors h-10 flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Search</span>
              </button>
            </form>
          </div>

          {/* Right Section - Notifications and Profile */}
          <div className="flex items-center space-x-4 min-w-[200px] justify-end">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="relative p-2 text-gray-600 hover:text-event-blue transition-colors"
              >
                <Bell className="w-5 h-5" />
                <NotificationBadge count={mockUser.notifications.unread} color="red" />
              </button>

              {/* Notifications Dropdown */}
              {isNotificationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsNotificationDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-event-blue rounded-full mt-2"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="text-sm text-event-blue hover:text-event-blue-hover font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="relative">
              <a
                href="/dashboard/messages"
                className="relative p-2 text-gray-600 hover:text-event-blue transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <NotificationBadge count={mockUser.notifications.messages} color="green" />
              </a>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="relative">
                  <img
                    src={mockUser.avatar || '/images/default-avatar.png'}
                    alt={mockUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/default-avatar.png';
                    }}
                  />
                  {mockUser.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{mockUser.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-20">
                    <div className="p-2">
                      <a
                        href="/dashboard/profile"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </a>
                      <a
                        href="/dashboard/settings"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </a>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;