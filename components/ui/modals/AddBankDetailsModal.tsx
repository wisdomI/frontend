'use client'

import { useState, useEffect } from 'react'
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { useWithdrawal } from '@/hooks/useWithdrawal'
import { Bank } from '@/types/api'

interface AddBankDetailsModalProps {
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: () => void
}

const AddBankDetailsModal = ({ isOpen: externalIsOpen, onClose: externalOnClose, onSuccess }: AddBankDetailsModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const onClose = externalOnClose || (() => setInternalIsOpen(false))
  
  const { banks, loading: fetchingBanks, resolveAccount, createBankAccount } = useWithdrawal()
  
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankCode: '',
    accountName: '',
  })
  
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        accountNumber: '',
        bankCode: '',
        accountName: '',
      })
      setVerified(false)
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  const handleVerifyAccount = async () => {
    if (!formData.accountNumber || !formData.bankCode) {
      setError('Please enter account number and select a bank')
      return
    }

    if (formData.accountNumber.length < 10) {
      setError('Account number must be at least 10 digits')
      return
    }

    try {
      setVerifying(true)
      setError(null)
      
      const result = await resolveAccount(formData.accountNumber, formData.bankCode)
      
      if (result && result.accountName) {
        setFormData(prev => ({ ...prev, accountName: result.accountName }))
        setVerified(true)
        setError(null)
      } else {
        setError('Could not verify account. Please check your details.')
      }
    } catch (err: any) {
      console.error('Error verifying account:', err)
      setError(err.response?.data?.message || 'Failed to verify account. Please try again.')
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  const handleSave = async () => {
    if (!verified) {
      setError('Please verify your account first')
      return
    }

    if (!formData.accountName || !formData.accountNumber || !formData.bankCode) {
      setError('Please complete all fields')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const selectedBank = banks.find(b => b.code === formData.bankCode)
      
      await createBankAccount({
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        bankCode: formData.bankCode,
        bankName: selectedBank?.name || '',
      })

      setSuccess(true)
      
      // Show success message briefly then close
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
    } catch (err: any) {
      console.error('Error saving bank account:', err)
      setError(err.response?.data?.message || 'Failed to save bank account. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {externalIsOpen === undefined && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Bank Details
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Add Bank Details</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Bank account added successfully!
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Security Notice */}
              {!success && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Your banking information is encrypted and stored securely.
                  </p>
                </div>
              )}

              {!success && (
                <>
                  {/* Select Bank */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.bankCode}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, bankCode: e.target.value, accountName: '' }))
                        setVerified(false)
                        setError(null)
                      }}
                      disabled={fetchingBanks || verifying || saving}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {fetchingBanks ? 'Loading banks...' : 'Choose your bank'}
                      </option>
                      {banks.map((bank: Bank) => (
                        <option key={bank.code} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bank Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setFormData(prev => ({ ...prev, accountNumber: value, accountName: '' }))
                        setVerified(false)
                        setError(null)
                      }}
                      placeholder="Enter 10-digit account number"
                      maxLength={10}
                      disabled={verifying || saving}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.accountNumber.length}/10 digits
                    </p>
                  </div>

                  {/* Verify Account Button */}
                  {!verified && (
                    <button
                      onClick={handleVerifyAccount}
                      disabled={!formData.accountNumber || !formData.bankCode || formData.accountNumber.length < 10 || verifying || saving}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {verifying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Verifying...
                        </>
                      ) : (
                        'Verify Account'
                      )}
                    </button>
                  )}

                  {/* Account Name (Shown after verification) */}
                  {verified && formData.accountName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Name
                      </label>
                      <div className="w-full p-3 border-2 border-green-500 bg-green-50 rounded-lg flex items-center gap-2">
                        <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{formData.accountName}</span>
                      </div>
                    </div>
                  )}

                  {/* Save Button (Only show after verification) */}
                  {verified && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Bank Details'
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddBankDetailsModal
