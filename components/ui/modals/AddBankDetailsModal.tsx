'use client'

import { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface AddBankDetailsModalProps {
  onSave?: (data: any) => void
}

const AddBankDetailsModal = ({ onSave }: AddBankDetailsModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    accountNumber: '',
    bank: '',
    accountName: '',
    bvn: '',
    nin: '',
    phoneNumber: ''
  })

  const handleSave = () => {
    console.log('Bank details saved:', formData)
    onSave?.(formData)
    setIsOpen(false)
    setFormData({
      accountNumber: '',
      bank: '',
      accountName: '',
      bvn: '',
      nin: '',
      phoneNumber: ''
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Edit Bank details
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Add Bank Details</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Your banking information is encrypted and stored securely. We never store your full BVN.
                </p>
              </div>

              {/* Bank Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Enter account number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Select Bank */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select bank</label>
                <select
                  value={formData.bank}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose bank</option>
                  <option value="access">Access Bank</option>
                  <option value="gtb">GTBank</option>
                  <option value="firstbank">First Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="uba">UBA</option>
                  <option value="fidelity">Fidelity Bank</option>
                  <option value="stanbic">Stanbic IBTC</option>
                  <option value="union">Union Bank</option>
                </select>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                    placeholder="Enter Account name"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Verify Name
                  </button>
                </div>
              </div>

              {/* BVN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Verification Number (BVN)</label>
                <input
                  type="text"
                  value={formData.bvn}
                  onChange={(e) => setFormData(prev => ({ ...prev, bvn: e.target.value }))}
                  placeholder="Enter BVN"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Used for identity verification. Dial *565*0# to get your BVN.</p>
              </div>

              {/* NIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National Identification Number (NIN)</label>
                <input
                  type="text"
                  value={formData.nin}
                  onChange={(e) => setFormData(prev => ({ ...prev, nin: e.target.value }))}
                  placeholder="Enter NIN"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Used for identity verification. Dial *565*0# to get your BVN.</p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter Phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddBankDetailsModal
