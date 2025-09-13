'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/ui/Button'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 min-w-0">
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 lg:px-5 py-2 lg:py-3 border-t border-b border-l border-gray-300 text-sm focus:outline-none h-10 lg:h-12 rounded-l-xl min-w-0"
      />
      <Button
        type="submit"
        className="bg-event-blue text-white px-4 lg:px-8 py-2 lg:py-3 rounded-xl hover:bg-event-blue-hover transition-colors h-10 lg:h-12 flex items-center flex-shrink-0"
      >
        <svg
          className="w-4 h-4 mr-1 lg:mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Search</span>
      </Button>
    </form>
  )
}
