'use client'

import { Bell, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/vendors/SearchBar'
import { MessageOutlined } from '@ant-design/icons'
import { FaArrowDown, FaChevronDown } from 'react-icons/fa6'
import { ArrowDownIcon } from '@heroicons/react/20/solid'
// import { Input } from '@/components/ui/input'
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,a
// } from '@/components/ui/dropdown-menu'

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="w-full bg-white shadow px-3 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left section with hamburger and search */}
      <div className="flex items-center flex-1 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 mr-2 flex-shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Section */}
        <div className="flex-1 min-w-0">
          <SearchBar
            placeholder="Search for anything"
            onSearch={query => {
              console.log('Searching for:', query)
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 lg:gap-4 ml-2 flex-shrink-0">
        {/* Notifications */}
        <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] text-center">
            2
          </span>
        </div>

        {/* Messages */}
        <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
          <MessageOutlined className="text-gray-600" width={20} height={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] text-center">
            5
          </span>
        </div>

        {/* User Profile - Hidden on mobile */}
        <div className="hidden lg:block px-3 py-2">
          <p className="text-sm font-medium text-gray-700">UK Cakes & Cream</p>
        </div>
        
        {/* Logout Button */}
        <Button
          variant="primary"
          className="text-white rounded-lg py-2 px-3 lg:py-3 lg:px-4 flex items-center gap-1 lg:gap-2 text-sm lg:text-base whitespace-nowrap"
        >
          <span className="hidden lg:inline">Logout</span>
          <span className="lg:hidden">Out</span>
          <FaChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
      </div>
    </header>
  )
}
