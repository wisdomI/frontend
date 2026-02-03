'use client'

import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

interface CounterOfferModalProps {
  request: {
    id: number
    clientName: string
    eventTitle: string
    budget: string
    servicesNeeded: string
    eventDate: string
    eventLocation: string
    guests: number
  }
  onClose: () => void
  onSubmit: (offerData: any) => void
}

export default function CounterOfferModal({ request, onClose, onSubmit }: CounterOfferModalProps) {
  const [pricingItems, setPricingItems] = useState([
    { id: 1, service: 'Base Cake (3-tier, serves 120)', price: '150000' },
    { id: 2, service: 'Fresh Flower Decoration', price: '90000' },
    { id: 3, service: 'Setup & Delivery', price: '80000' }
  ])

  const [serviceModifications, setServiceModifications] = useState({
    deliveryDate: '15/07/2025',
    deliveryTime: '2:00 PM',
    setupTime: '3 Hours'
  })

  const [counterOfferMessage, setCounterOfferMessage] = useState(
    "Hi! I'd love to create your wedding cake. For a 3-tier cake serving 120 with fresh flowers and professional setup, my pricing is ₦330,000. This includes premium ingredients, custom design consultation, and white-glove delivery service. I can work with your timeline and I'm confident you'll love the result! Let me know if you'd like to discuss any adjustments."
  )

  const updateMessageWithTotal = () => {
    const total = calculateTotal()
    const formattedTotal = formatCurrency(total)
    const updatedMessage = counterOfferMessage.replace(/₦[\d,]+/, formattedTotal)
    setCounterOfferMessage(updatedMessage)
  }

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePricingChange = (id: number, price: string) => {
    setPricingItems(prev => prev.map(item => 
      item.id === id ? { ...item, price } : item
    ))
    // Update message with new total after state update
    setTimeout(() => {
      const total = pricingItems.reduce((total, item) => {
        if (item.id === id) {
          return total + parseInt(price || '0')
        }
        return total + parseInt(item.price || '0')
      }, 0)
      const formattedTotal = formatCurrency(total)
      setCounterOfferMessage(prev => prev.replace(/₦[\d,]+/, formattedTotal))
    }, 0)
  }

  const handleServiceChange = (id: number, service: string) => {
    setPricingItems(prev => prev.map(item => 
      item.id === id ? { ...item, service } : item
    ))
  }

  const addPricingItem = () => {
    const newId = Math.max(...pricingItems.map(item => item.id)) + 1
    setPricingItems(prev => [...prev, { id: newId, service: 'New Service', price: '0' }])
  }

  const removePricingItem = (id: number) => {
    if (pricingItems.length > 1) {
      setPricingItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleServiceModificationChange = (field: string, value: string) => {
    setServiceModifications(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateTotal = () => {
    return pricingItems.reduce((total, item) => total + parseInt(item.price || '0'), 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦')
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (calculateTotal() <= 0) {
      newErrors.pricing = 'At least one pricing item is required'
    }
    
    if (!serviceModifications.deliveryDate.trim()) {
      newErrors.deliveryDate = 'Delivery date is required'
    }
    
    if (!counterOfferMessage.trim()) {
      newErrors.message = 'Counter offer message is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        pricingItems,
        serviceModifications,
        counterOfferMessage,
        totalAmount: calculateTotal(),
        originalRequest: request
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create your counter offer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Pricing Adjustments */}
          <div>
            <h3 className="text-lg font-semibold text-event-blue mb-4">Pricing Adjustments</h3>
            <div className="space-y-4">
              {pricingItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.service}
                      onChange={(e) => handleServiceChange(item.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:outline-none mb-2 text-sm font-medium text-gray-700"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePricingChange(item.id, e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  {pricingItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePricingItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTimes size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              {/* Add Service Button */}
              <button
                type="button"
                onClick={addPricingItem}
                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-event-blue hover:text-event-blue transition-colors"
              >
                + Add Service Item
              </button>
              
              {/* Total Counter-Offer */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Counter-Offer</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Modifications */}
          <div>
            <h3 className="text-lg font-semibold text-event-blue mb-4">Service Modifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={serviceModifications.deliveryDate}
                    onChange={(e) => handleServiceModificationChange('deliveryDate', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:outline-none"
                    placeholder="DD/MM/YYYY"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <input
                  type="text"
                  value={serviceModifications.deliveryTime}
                  onChange={(e) => handleServiceModificationChange('deliveryTime', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:outline-none"
                  placeholder="2:00 PM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setup Time
                </label>
                <input
                  type="text"
                  value={serviceModifications.setupTime}
                  onChange={(e) => handleServiceModificationChange('setupTime', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:outline-none"
                  placeholder="3 Hours"
                />
              </div>
            </div>
          </div>

          {/* Counter Offer Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Counter Offer Message
            </label>
            <textarea
              value={counterOfferMessage}
              onChange={(e) => setCounterOfferMessage(e.target.value)}
              rows={6}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-event-blue focus:outline-none ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your counter offer message here..."
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-event-blue text-white rounded-lg font-medium hover:bg-event-blue-hover transition-colors"
            >
              Submit Counter Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

