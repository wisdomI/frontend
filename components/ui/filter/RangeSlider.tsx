'use client'

import React from 'react'

interface RangeSliderProps {
  min: number
  max: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  minLimit?: number
  maxLimit?: number
  label?: string
  unit?: string
}

export default function RangeSlider({ 
  min, 
  max, 
  onMinChange, 
  onMaxChange, 
  minLimit = 1, 
  maxLimit = 100,
  label = "Distance",
  unit = "km"
}: RangeSliderProps) {
  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= minLimit && numValue <= maxLimit) {
      if (type === 'min') {
        onMinChange(numValue)
      } else {
        onMaxChange(numValue)
      }
    }
  }

  const createHandleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startValue = type === 'min' ? min : max
    const sliderWidth = e.currentTarget.parentElement?.offsetWidth || 0
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaPercent = (deltaX / sliderWidth) * 100
      const newValue = Math.max(minLimit, Math.min(maxLimit, Math.round(startValue + deltaPercent)))
      
      if (type === 'min' && newValue < max) {
        onMinChange(newValue)
      } else if (type === 'max' && newValue > min) {
        onMaxChange(newValue)
      }
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3">{label}</h3>
      
      {/* Input Fields */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Min ({unit})</label>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={min}
            onChange={(e) => handleInputChange('min', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-event-blue focus:border-transparent text-center"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Max ({unit})</label>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={max}
            onChange={(e) => handleInputChange('max', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-event-blue focus:border-transparent text-center"
          />
        </div>
      </div>
      
      <div className="relative px-2">
        {/* Slider Track */}
        <div className="relative h-2 bg-gray-200 rounded-lg">
          {/* Active Range */}
          <div 
            className="absolute h-2 bg-event-blue rounded-lg transition-all duration-150"
            style={{ 
              left: `${(min / maxLimit) * 100}%`, 
              width: `${((max - min) / maxLimit) * 100}%` 
            }}
          ></div>
          
          {/* Min Handle */}
          <div
            className="absolute w-5 h-5 bg-white border-2 border-event-blue rounded-full cursor-pointer shadow-lg transform -translate-y-1.5 transition-all duration-150 hover:scale-110"
            style={{ 
              left: `calc(${(min / maxLimit) * 100}% - 10px)`,
              zIndex: min > max - 1 ? 10 : 5
            }}
            onMouseDown={createHandleMouseDown('min')}
          />
          
          {/* Max Handle */}
          <div
            className="absolute w-5 h-5 bg-white border-2 border-event-blue rounded-full cursor-pointer shadow-lg transform -translate-y-1.5 transition-all duration-150 hover:scale-110"
            style={{ 
              left: `calc(${(max / maxLimit) * 100}% - 10px)`,
              zIndex: max < min + 1 ? 10 : 5
            }}
            onMouseDown={createHandleMouseDown('max')}
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-3">
          <span className="text-sm text-gray-600 transition-all duration-150">
            {min}{unit} ({Math.round(min * 4)} mins)
          </span>
          <span className="text-sm text-gray-600 transition-all duration-150">
            {max}{unit} ({Math.round(max * 9)} mins)
          </span>
        </div>
      </div>
    </div>
  )
}
