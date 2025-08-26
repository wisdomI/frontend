'use client'

import React from 'react'
import Link from 'next/link'
import { Star, MapPin, Phone, Mail, CheckCircle } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  description: string
  services: string[]
  location: {
    city: string
    state: string
    zipCode: string
  }
  pricing: {
    startingPrice: number
    currency: string
  }
  portfolio: {
    images: string[]
    videos: string[]
  }
  rating: {
    average: number
    count: number
  }
  availability: {
    calendar: any[]
    timeSlots: string[]
  }
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

interface CustomerCardProps {
  customer: Customer
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {customer.portfolio.images.length > 0 ? (
          <img
            src={customer.portfolio.images[0]}
            alt={customer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-lg font-semibold">
            {customer.name.charAt(0)}
          </div>
        )}
        {customer.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 truncate">
            {customer.name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{customer.rating.average}</span>
            <span className="text-gray-500">({customer.rating.count})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {customer.description}
        </p>

        {/* Services */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {customer.services.slice(0, 2).map((service, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {service}
              </span>
            ))}
            {customer.services.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{customer.services.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{customer.location.city}, {customer.location.state}</span>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <span className="text-lg font-semibold text-green-600">
            From ${customer.pricing.startingPrice}
          </span>
          <span className="text-gray-500 text-sm ml-1">
            {customer.pricing.currency}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{customer.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/customers/${customer.id}`}
            className="flex-1 bg-event-blue text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Profile
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}