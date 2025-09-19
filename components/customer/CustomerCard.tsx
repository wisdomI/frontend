import React from 'react'
import Image from 'next/image'
import { Customer } from '@/types/customer'
import { formatCurrency } from '@/lib/utils'

interface CustomerCardProps {
  customer?: Customer
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  // Default customer data for when no customer is provided (for demo purposes)
  const defaultCustomer = {
    id: '1',
    name: 'Elite Photography',
    description: 'Professional wedding and event photography',
    pricing: { startingPrice: 500, currency: 'USD' },
    rating: { average: 4.8, count: 24 },
    portfolio: { images: [] }
  }

  const customerData = customer || defaultCustomer

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        <Image
          src={customerData.portfolio?.images?.[0] || "/images/placeholder-customer.jpg"}
          alt={customerData.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
          }}
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{customerData.name}</h3>
        <p className="text-gray-600 mb-3">{customerData.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(customerData.rating?.average || 0))}
            {'☆'.repeat(5 - Math.floor(customerData.rating?.average || 0))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({customerData.rating?.average || 0}) {customerData.rating?.count || 0} reviews
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-event-blue">
            Starting at {formatCurrency(customerData.pricing?.startingPrice || 0)}
          </span>
          <button className="bg-event-blue text-white px-4 py-2 rounded-lg hover:bg-event-blue-hover transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}