'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft, FiCheck, FiTrash2 } from 'react-icons/fi'
import { useWithdrawal } from '@/hooks/useWithdrawal'
import AddBankDetailsModal from './AddBankDetailsModal'

interface ChangeBankDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (bankName: string, accountNumber: string) => void
}

export default function ChangeBankDetailsModal({ 
  isOpen, 
  onClose, 
  onSave 
}: ChangeBankDetailsModalProps) {
  const { bankAccounts, loading: loadingBankAccounts, deleteBankAccount, refetchBankAccounts } = useWithdrawal()
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleDeleteBankAccount = async (bankAccountId: string) => {
    if (!confirm('Are you sure you want to delete this bank account?')) {
      return
    }

    try {
      setDeletingBankId(bankAccountId)
      await deleteBankAccount(bankAccountId)
      await refetchBankAccounts()
      // Call legacy onSave if provided for backward compatibility
      if (onSave) {
        onSave('', '')
      }
    } catch (error: any) {
      console.error('Error deleting bank account:', error)
      alert(error.response?.data?.message || 'Failed to delete bank account')
    } finally {
      setDeletingBankId(null)
    }
  }

  const handleBankAccountAdded = async () => {
    await refetchBankAccounts()
    setShowAddBankModal(false)
    // Call legacy onSave if provided for backward compatibility
    if (onSave && bankAccounts.length > 0) {
      onSave(bankAccounts[0].bankName, bankAccounts[0].accountNumber)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Manage Bank Details</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Manage your bank accounts for withdrawals. You can add multiple accounts and delete any you no longer need.
              </p>
            </div>

            {/* Loading State */}
            {loadingBankAccounts && !bankAccounts?.length ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading bank accounts...</p>
                </div>
              </div>
            ) : bankAccounts && bankAccounts.length > 0 ? (
              /* Bank Accounts List */
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700">Your Bank Accounts</h3>
                {bankAccounts.map((account) => (
                  <div key={account.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          🏦
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Bank Account</h4>
                          {account.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full mt-1">
                              <FiCheck className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBankAccount(account.id)}
                        disabled={deletingBankId === account.id || bankAccounts.length === 1}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={bankAccounts.length === 1 ? 'Cannot delete your only bank account' : 'Delete bank account'}
                      >
                        {deletingBankId === account.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="space-y-1 ml-13">
                      <p className="text-sm font-medium text-gray-900">{account.bankName}</p>
                      <p className="text-sm text-gray-600">{account.accountNumber}</p>
                      <p className="text-sm text-gray-600">{account.accountName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🏦
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts</h3>
                <p className="text-gray-500 text-sm mb-6">Add a bank account to receive payments and withdraw earnings</p>
              </div>
            )}

            {/* Add Bank Account Button */}
            <button
              onClick={() => setShowAddBankModal(true)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {bankAccounts && bankAccounts.length > 0 ? 'Add Another Bank Account' : 'Add Bank Account'}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full mt-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Add Bank Details Modal */}
      <AddBankDetailsModal
        isOpen={showAddBankModal}
        onClose={() => setShowAddBankModal(false)}
        onSuccess={handleBankAccountAdded}
      />
    </>
  )
}
