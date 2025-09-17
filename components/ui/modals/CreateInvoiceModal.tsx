'use client'
import React, { useState } from 'react'
import { FiX, FiCalendar, FiChevronDown, FiPlus, FiArrowLeft } from 'react-icons/fi'
import InvoicePreview from './InvoicePreview'

interface CreateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [invoiceDate, setInvoiceDate] = useState('12/05/2025')
  const [selectedClient, setSelectedClient] = useState('')
  const [description, setDescription] = useState('Small Chops')
  const [quantity, setQuantity] = useState(20)
  const [amount, setAmount] = useState('₦ 100,000.00')
  const [discount, setDiscount] = useState('10 %')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [invoiceItems, setInvoiceItems] = useState([
    { id: 1, description: 'Small Chops', quantity: 20, amount: '₦ 100,000.00' }
  ])

  const calculateDiscountAmount = () => {
    const totalAmount = 100000
    const discountPercent = parseFloat(discount.replace('%', ''))
    return totalAmount * (discountPercent / 100)
  }

  const calculateTotalAmount = () => {
    const totalAmount = 100000
    const discountAmount = calculateDiscountAmount()
    return totalAmount - discountAmount
  }

  const handleAddItem = () => {
    const newItem = {
      id: invoiceItems.length + 1,
      description: '',
      quantity: 1,
      amount: '₦ 0.00'
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  const handleSaveAndSend = () => {
    // Handle save and send logic
    console.log('Invoice saved and sent')
    onClose()
  }

  const handlePreviewReceipt = () => {
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
  }

  const getInvoiceData = () => {
    const subtotal = invoiceItems.reduce((sum, item) => {
      const amount = parseFloat(item.amount.replace(/[₦,]/g, '')) || 0
      return sum + amount
    }, 0)

    const discountAmount = calculateDiscountAmount()
    const total = subtotal - discountAmount

    return {
      invoiceNumber: '#7674',
      issuedDate: '13th July, 2025',
      dueDate: '12th Aug, 2025',
      from: {
        name: 'UK Cakes & Cream',
        email: 'info@ukcakesandcream.com'
      },
      to: {
        name: selectedClient || 'Adeboye Daniel',
        email: 'adeboyedaniel@gmail.com'
      },
      items: invoiceItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        amount: item.amount
      })),
      subtotal,
      discount: discount.replace('%', ''),
      discountAmount,
      total
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>
              <p className="text-sm text-gray-600">Kindly fill in your invoice details</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Invoice No #7674</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Invoice Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <input
                type="text"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Select Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
            <div className="relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
              >
                <option value="">Select an Option</option>
                <option value="client1">Client 1</option>
                <option value="client2">Client 2</option>
                <option value="client3">Client 3</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
            
            {invoiceItems.map((item, index) => (
              <div key={item.id} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description {index + 1}</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updatedItems = [...invoiceItems]
                      updatedItems[index].description = e.target.value
                      setInvoiceItems(updatedItems)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                </div>

                {/* Quantity and Amount Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Quantity</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedItems = [...invoiceItems]
                          updatedItems[index].quantity = parseInt(e.target.value) || 0
                          setInvoiceItems(updatedItems)
                        }}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                      />
                      <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="text"
                      value={item.amount}
                      onChange={(e) => {
                        const updatedItems = [...invoiceItems]
                        updatedItems[index].amount = e.target.value
                        setInvoiceItems(updatedItems)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleAddItem}
                    className="px-6 py-3 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: '#032D71' }}
                  >
                    <FiPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
            
            {/* Overall Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Discount</label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                />
                <div className="text-sm text-gray-600">
                  -₦{calculateDiscountAmount().toLocaleString()}.00
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">
                ₦{calculateTotalAmount().toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 p-6 border-t border-gray-200">
          <button
            onClick={handlePreviewReceipt}
            className="flex-1 px-6 py-3 border-2 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            style={{ borderColor: '#032D71', color: '#032D71' }}
          >
            Preview Receipt
          </button>
          <button
            onClick={handleSaveAndSend}
            className="flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#032D71' }}
          >
            Save & Send
          </button>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <InvoicePreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        invoiceData={getInvoiceData()}
      />
    </div>
  )
}

export default CreateInvoiceModal
