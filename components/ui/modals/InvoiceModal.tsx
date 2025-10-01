'use client'

import React, { useState } from 'react'
import { FiX, FiDownload, FiCreditCard } from 'react-icons/fi'

interface Transaction {
  id: string
  dateTime: string
  invoiceNumber: string
  vendor: string
  paymentMethod: string
  amount: number
  status: 'unpaid' | 'overdue' | 'paid'
}

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction
}

export default function InvoiceModal({ isOpen, onClose, transaction }: InvoiceModalProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const handleDownload = () => {
    // Simulate download
    console.log('Downloading invoice:', transaction.invoiceNumber)
  }

  const handlePayment = () => {
    setShowPaymentModal(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">EventHub</h1>
              <p className="text-sm text-gray-600 mt-1">Issued On: 13th July, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">Invoice No #{transaction.invoiceNumber}</p>
              <p className="text-sm text-gray-600 mt-1">Due On: 12th Aug, 2025</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">From</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">UK</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">UK Cakes & Cream</p>
                  <p className="text-sm text-gray-600">Fresh Delicious Bakery</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">To</h3>
              <p className="font-medium text-gray-900">Adeboye Daniel</p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-blue-600 text-white px-4 py-3">
              <div className="grid grid-cols-3 text-sm font-medium">
                <span>Description</span>
                <span>Qty</span>
                <span>Amount</span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { description: 'Small Chops', qty: '20', amount: 100000 },
                { description: '3 Tier Cake', qty: '1', amount: 100000 },
                { description: '10 Packs of drinks', qty: '20', amount: 100000 },
                { description: 'Small Chops', qty: '-', amount: 100000 },
                { description: '3 Tier Cake', qty: '20', amount: 100000 },
                { description: '10 Packs of drinks', qty: '20', amount: 100000 }
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-3 px-4 py-3 text-sm">
                  <span className="text-gray-900">{item.description}</span>
                  <span className="text-gray-600">{item.qty}</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal</span>
                <span>{formatCurrency(100000)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Discount - 10%</span>
                <span>{formatCurrency(1200)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold bg-blue-50 px-3 py-2 rounded">
                <span>Total Amount</span>
                <span>{formatCurrency(100120)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>
            {transaction.status !== 'paid' && (
              <button
                onClick={handlePayment}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <FiCreditCard className="w-4 h-4" />
                <span>Proceed to Pay</span>
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Thanks for your patronage.</p>
          </div>
        </div>
      </div>
    </div>
  )
}