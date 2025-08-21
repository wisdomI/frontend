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

export default function DashboardHeader() {
  return (
    <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Search Section */}
      <div className="flex w-1/2">
        <SearchBar
          placeholder="Search for anything"
          onSearch={query => {
            console.log('Searching for:', query)
          }}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            2
          </span>
        </div>

        {/* Messages */}
        <div className="relative cursor-pointer">
          <MessageOutlined className="text-gray-600" width={120} height={120} />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            5
          </span>
        </div>

        {/* User Profile */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/logo.png" alt="User" />
              <AvatarFallback>UK</AvatarFallback>
            </Avatar>
            <span className="font-medium">UK Cakes & Cream</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <p>UK Cakes & Cream</p>
        {/* Logout Button */}
        <Button
          variant="primary"
          className="text-white rounded-lg py-3 px-4 flex items-center gap-2"
        >
          Logout
          <FaChevronDown />
        </Button>
      </div>
    </header>
  )
}
