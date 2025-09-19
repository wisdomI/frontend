'use client'

import { useState } from 'react'
import { FiX, FiPlus } from 'react-icons/fi'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  amount: number
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose }) => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: 'Small Chops',
      quantity: 20,
      amount: 100000
    }
  ])
  const [discount, setDiscount] = useState(10)
  const [selectedDate, setSelectedDate] = useState('12/05/2025')
  const [selectedClient, setSelectedClient] = useState('Daniel Adebayo')

  const clients = ['Daniel Adebayo', 'Adaeze Nora', 'Mariam Michael', 'Chizzy Mary']

  const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      amount: 0
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(items => items.filter(item => item.id !== id))
    }
  }

  const handleSaveAndSend = () => {
    // In a real app, this would save the invoice and send it
    console.log('Invoice saved and sent:', {
      items: invoiceItems,
      discount,
      total,
      client: selectedClient,
      dueDate: selectedDate
    })
    onClose()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Create Invoice</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Invoice No #7674</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">Kindly fill in your invoice details</p>

          <div className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
              <div className="relative">
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent appearance-none bg-white"
                >
                  {clients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Invoice Items */}
            {invoiceItems.map((item, index) => (
              <div key={item.id} className="space-y-4 p-4 border border-gray-200 rounded-lg relative">
                {invoiceItems.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description {index + 1}</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Quantity</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, 'amount', parseInt(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    />
                    {index === 0 && (
                      <button
                        onClick={addNewItem}
                        className="px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors flex items-center space-x-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Discount</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                placeholder="10 %"
              />
              <p className="text-sm text-red-600 mt-1">-{formatCurrency(discountAmount)}</p>
            </div>

            {/* Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-lg font-semibold">
                {formatCurrency(total)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-event-blue text-event-blue rounded-lg hover:bg-event-blue hover:text-white transition-colors"
            >
              Preview Receipt
            </button>
            <button
              onClick={handleSaveAndSend}
              className="px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors"
            >
              Save & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceModal
