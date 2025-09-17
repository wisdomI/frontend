'use client'

import React, { useState } from 'react'
import { FiLock, FiRefreshCw, FiUnlock } from 'react-icons/fi'
import CreatePINModal from '@/components/ui/modals/CreatePINModal'
import ChangePINModal from '@/components/ui/modals/ChangePINModal'
import ResetPINModal from '@/components/ui/modals/ResetPINModal'
import PINSuccessModal from '@/components/ui/modals/PINSuccessModal'

export default function PINSetupTab() {
  const [isCreatePINModalOpen, setIsCreatePINModalOpen] = useState(false)
  const [isChangePINModalOpen, setIsChangePINModalOpen] = useState(false)
  const [isResetPINModalOpen, setIsResetPINModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successModalType, setSuccessModalType] = useState<'create' | 'change' | 'reset'>('create')

  const handleCreatePIN = () => {
    setIsCreatePINModalOpen(true)
  }

  const handleChangePIN = () => {
    setIsChangePINModalOpen(true)
  }

  const handleResetPIN = () => {
    setIsResetPINModalOpen(true)
  }

  const handlePINCreated = () => {
    setIsCreatePINModalOpen(false)
    setSuccessModalType('create')
    setIsSuccessModalOpen(true)
  }

  const handlePINChanged = () => {
    setIsChangePINModalOpen(false)
    setSuccessModalType('change')
    setIsSuccessModalOpen(true)
  }

  const handlePINReset = () => {
    setIsResetPINModalOpen(false)
    setSuccessModalType('reset')
    setIsSuccessModalOpen(true)
  }

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false)
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create PIN Card */}
        <div 
          className="bg-blue-600 text-white rounded-lg p-6 cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={handleCreatePIN}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-4">
            <FiLock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Create PIN</h3>
          <p className="text-blue-100 text-sm">Create a PIN for your earning withdrawal</p>
        </div>

        {/* Change PIN Card */}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleChangePIN}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <FiRefreshCw className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Change PIN</h3>
          <p className="text-gray-600 text-sm">Change your withdrawal PIN</p>
        </div>

        {/* Reset PIN Card */}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleResetPIN}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <FiUnlock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Reset PIN</h3>
          <p className="text-gray-600 text-sm">Reset your withdrawal PIN</p>
        </div>
      </div>

      {/* Modals */}
      <CreatePINModal
        isOpen={isCreatePINModalOpen}
        onClose={() => setIsCreatePINModalOpen(false)}
        onSuccess={handlePINCreated}
      />
      
      <ChangePINModal
        isOpen={isChangePINModalOpen}
        onClose={() => setIsChangePINModalOpen(false)}
        onSuccess={handlePINChanged}
      />
      
      <ResetPINModal
        isOpen={isResetPINModalOpen}
        onClose={() => setIsResetPINModalOpen(false)}
        onSuccess={handlePINReset}
      />
      
      <PINSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        type={successModalType}
      />
    </div>
  )
}
