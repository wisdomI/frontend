'use client'

import React from 'react'

interface CheckboxGroupProps {
  items: string[]
  selectedItems: string[]
  onItemToggle: (item: string) => void
  className?: string
}

export default function CheckboxGroup({ 
  items, 
  selectedItems, 
  onItemToggle, 
  className = "" 
}: CheckboxGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <label key={item} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => onItemToggle(item)}
            className="w-3 h-3 text-event-blue border-gray-300 rounded focus:ring-event-blue"
          />
          <span className="text-sm text-gray-700">{item}</span>
        </label>
      ))}
    </div>
  )
}
