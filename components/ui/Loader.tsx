'use client'

import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

export default function Loader({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const colorClasses = {
    primary: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600'
  }

  return (
    <div 
      className={`animate-spin rounded-full border-2 border-transparent ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
      style={{
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color === 'primary' ? '#2563eb' : color === 'white' ? '#ffffff' : '#4b5563',
        borderLeftColor: color === 'primary' ? '#2563eb' : color === 'white' ? '#ffffff' : '#4b5563'
      }}
    />
  )
}

// Button-specific loader component
interface ButtonLoaderProps {
  loading: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
}

export function ButtonLoader({ 
  loading, 
  loadingText, 
  children, 
  className = '' 
}: ButtonLoaderProps) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader size="sm" color="white" className="mr-2" />
        {loadingText && <span>{loadingText}</span>}
      </div>
    )
  }
  
  return <>{children}</>
}
