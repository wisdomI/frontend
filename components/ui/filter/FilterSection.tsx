'use client'

import React, { ReactNode } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

export default function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div>
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>
      {isOpen && children}
    </div>
  )
}
