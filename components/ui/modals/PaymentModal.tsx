'use client'

import React, { useState } from 'react'
import { FiX, FiCopy, FiCreditCard } from 'react-icons/fi'

interface Transaction {
  id: string
  dateTime: string
  invoiceNumber: string
  vendor: string
  paymentMethod: string
  amount: number
  status: 'unpaid' | 'overdue' | 'paid'
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction
  onSuccess: () => void
}

const banks = [
  'Access Bank',
  'United Bank for Africa (UBA)',
  'Keystone Bank',
  'Sterling Bank',
  'Zenith Bank',
  'Union Bank',
  'Kuda Microfinance Bank',
  'First Bank'
]

export default function PaymentModal({ isOpen, onClose, transaction, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'transfer'>('card')
  const [selectedBank, setSelectedBank] = useState('')
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [pin, setPin] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess()
    }, 2000)
  }

  const copyAccountNumber = () => {
    navigator.clipboard.writeText('0123456781')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Payment Section */}
          <div className="lg:w-1/2 p-6 bg-gray-50">
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pay With:
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'card', label: 'Card' },
                    { value: 'bank', label: 'Bank' },
                    { value: 'transfer', label: 'Transfer' }
                  ].map((method) => (
                    <label key={method.value} className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Card Payment */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="XXXX - XXXX - XXXX - XXXX"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="XXX"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Accepted:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        V
                      </div>
                      <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        V
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Payment */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose your bank
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowBankDropdown(!showBankDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                      >
                        <span className={selectedBank ? 'text-gray-900' : 'text-gray-500'}>
                          {selectedBank || 'Choose your bank'}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showBankDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {banks.map((bank) => (
                            <button
                              key={bank}
                              onClick={() => {
                                setSelectedBank(bank)
                                setShowBankDropdown(false)
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your account number
                    </label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Transfer Payment */}
              {paymentMethod === 'transfer' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">Transfer {formatCurrency(transaction.amount)} to:</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Bank:</span>
                        <span className="ml-2 text-sm text-gray-900">Polaris Bank</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Account Number:</span>
                        <span className="text-lg font-bold text-gray-900">0123456781</span>
                        <button
                          onClick={copyAccountNumber}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiCopy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-red-600">
                        Expires in <span className="font-bold">10:00</span> minutes
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PIN Entry for Card */}
              {paymentMethod === 'card' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your 4 digit pin to confirm this payment
                  </label>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="password"
                        maxLength={1}
                        value={pin[index] || ''}
                        onChange={(e) => {
                          const newPin = pin.split('')
                          newPin[index] = e.target.value
                          setPin(newPin.join(''))
                        }}
                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-bold"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ${formatCurrency(transaction.amount)}`
                )}
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:w-1/2 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-4 py-2">
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
                    <div key={index} className="grid grid-cols-3 px-4 py-2 text-sm">
                      <span className="text-gray-900">{item.description}</span>
                      <span className="text-gray-600">{item.qty}</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(100000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount - 10%</span>
                    <span>{formatCurrency(1200)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold bg-blue-50 px-2 py-1 rounded mt-2">
                    <span>Total Amount</span>
                    <span>{formatCurrency(100120)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
