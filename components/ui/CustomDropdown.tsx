'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownOption {
  label: string
  value: string
  color?: string // Optional color for status dots etc.
}

interface CustomDropdownProps {
  label?: string // Optional label above the dropdown
  options: DropdownOption[]
  selected: string
  onChange: (value: string) => void
  placeholder?: string
  width?: string // Optional custom width class, defaults to w-full
  buttonClassName?: string // Optional additional classes for the button
}

export default function CustomDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select option',
  width = 'w-full',
  buttonClassName = ''
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find(opt => opt.value === selected)

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] transition-all hover:bg-gray-50 ${width} ${buttonClassName}`}
      >
        <span className={!selected ? 'text-gray-400' : 'text-gray-900'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-[#F0F4FF] flex items-center justify-between transition-colors
                  ${selected === option.value ? 'bg-[#F0F4FF] text-[#0B2E6F] font-medium' : 'text-gray-700'}
                  ${option.color ? option.color : ''}
                `}
              >
                <span>{option.label}</span>
                {selected === option.value && <Check className="w-4 h-4 text-[#0B2E6F]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

