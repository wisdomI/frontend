'use client'

import React from 'react'
import { FiCalendar } from 'react-icons/fi'

interface ClientPageHeaderProps {
  breadcrumbs: {
    label: string
    href?: string
    isActive?: boolean
  }[]
  title: string
  showDateRange?: boolean
  fromDate?: string
  toDate?: string
  onFromDateChange?: (date: string) => void
  onToDateChange?: (date: string) => void
  children?: React.ReactNode
}

export default function ClientPageHeader({
  breadcrumbs,
  title,
  showDateRange = false,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  children
}: ClientPageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {crumb.href ? (
              <a href={crumb.href} className="hover:text-gray-900">
                {crumb.label}
              </a>
            ) : (
              <span className={crumb.isActive ? 'text-gray-900 font-medium' : ''}>
                {crumb.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && <span>›</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        {/* Date Range Filter or Custom Content */}
        {showDateRange ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">From:</span>
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{fromDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">To:</span>
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{toDate}</span>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
