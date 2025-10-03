'use client'

import React from 'react'

interface Breadcrumb {
  label: string
  href?: string
  isActive?: boolean
}

interface VendorPageHeaderProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  subtitle?: string
  actions?: React.ReactNode
}

export default function VendorPageHeader({ 
  title, 
  breadcrumbs = [], 
  subtitle, 
  actions 
}: VendorPageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
                <span
                  className={`text-sm font-medium ${
                    breadcrumb.isActive
                      ? 'text-gray-500'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {breadcrumb.href && !breadcrumb.isActive ? (
                    <a href={breadcrumb.href}>{breadcrumb.label}</a>
                  ) : (
                    breadcrumb.label
                  )}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-asul">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="mt-4 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
