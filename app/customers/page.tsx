'use client'

import React, { useState } from 'react'
import CustomerCard from '@/components/customer/CustomerCard'

// Mock customer data
const mockCustomers = [
  {
    id: '1',
    name: 'Elite Photography',
    email: 'contact@elitephoto.com',
    phone: '(555) 123-4567',
    description: 'Professional wedding and event photography with 10+ years of experience',
    services: ['Wedding Photography', 'Event Photography', 'Portrait Photography'],
    location: {
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    pricing: {
      startingPrice: 1500,
      currency: 'USD'
    },
    portfolio: {
      images: ['/images/portfolio1.jpg', '/images/portfolio2.jpg'],
      videos: []
    },
    rating: {
      average: 4.8,
      count: 24
    },
    availability: {
      calendar: [],
      timeSlots: ['9:00 AM', '2:00 PM', '6:00 PM']
    },
    verified: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Delicious Catering Co.',
    email: 'info@deliciouscatering.com',
    phone: '(555) 234-5678',
    description: 'Full-service catering for weddings, corporate events, and special occasions',
    services: ['Wedding Catering', 'Corporate Catering', 'Party Catering'],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    pricing: {
      startingPrice: 50,
      currency: 'USD'
    },
    portfolio: {
      images: ['/images/catering1.jpg', '/images/catering2.jpg'],
      videos: []
    },
    rating: {
      average: 4.6,
      count: 18
    },
    availability: {
      calendar: [],
      timeSlots: ['10:00 AM', '3:00 PM', '7:00 PM']
    },
    verified: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '3',
    name: 'Sound & Lights Pro',
    email: 'booking@soundlightspro.com',
    phone: '(555) 345-6789',
    description: 'Professional audio and lighting services for all types of events',
    services: ['Audio Equipment', 'Lighting Setup', 'DJ Services'],
    location: {
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    pricing: {
      startingPrice: 800,
      currency: 'USD'
    },
    portfolio: {
      images: ['/images/audio1.jpg', '/images/lighting1.jpg'],
      videos: []
    },
    rating: {
      average: 4.9,
      count: 32
    },
    availability: {
      calendar: [],
      timeSlots: ['8:00 AM', '1:00 PM', '5:00 PM']
    },
    verified: true,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-01-25')
  }
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Filter customers based on search term
    if (value.trim() === '') {
      setCustomers(mockCustomers)
    } else {
      const filtered = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase()) ||
        customer.description.toLowerCase().includes(value.toLowerCase()) ||
        customer.services.some(service => 
          service.toLowerCase().includes(value.toLowerCase())
        )
      )
      setCustomers(filtered)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Event Service Providers</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search service providers..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No service providers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}