'use client'
import { useState } from 'react'
import InvoiceTable from '@/components/vendors/Invoice'
import CreateInvoiceModal from '@/components/ui/modals/CreateInvoiceModal'

export default function InvoicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateInvoice = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Invoice Management</h1>
          <button 
            onClick={handleCreateInvoice}
            className="text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-1 sm:gap-2 transition-colors text-sm" 
            style={{ backgroundColor: '#032D71' }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Create Invoice</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
        <InvoiceTable />
        
        {/* Create Invoice Modal */}
        <CreateInvoiceModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  )
}
