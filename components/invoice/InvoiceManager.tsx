'use client'

import React, { useState, useEffect } from 'react'
import { useInvoice } from '@/hooks/useInvoice'
import { FiPlus, FiDownload, FiEye, FiEdit, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

interface InvoiceManagerProps {
  viewType?: 'all' | 'my' | 'sent' | 'received'
}

export default function InvoiceManager({ viewType = 'all' }: InvoiceManagerProps) {
  const {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    downloadInvoice,
    viewInvoice,
    updatePaymentStatus,
    payInvoice
  } = useInvoice()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  useEffect(() => {
    fetchInvoices()
  }, [viewType])

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      await createInvoice(invoiceData)
      toast.success('Invoice created successfully')
      setShowCreateModal(false)
    } catch (err) {
      toast.error('Failed to create invoice')
    }
  }

  const handleUpdateInvoice = async (id: string, invoiceData: any) => {
    try {
      await updateInvoice(id, invoiceData)
      toast.success('Invoice updated successfully')
      setShowEditModal(false)
      setEditingInvoice(null)
    } catch (err) {
      toast.error('Failed to update invoice')
    }
  }

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id)
        toast.success('Invoice deleted successfully')
      } catch (err) {
        toast.error('Failed to delete invoice')
      }
    }
  }

  const handleDownloadInvoice = async (id: string) => {
    try {
      const response = await downloadInvoice(id)
      const blob = response.data || (response as unknown as Blob)
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      if (a.parentNode) {
        a.parentNode.removeChild(a)
      }
      toast.success('Invoice downloaded successfully')
    } catch (err) {
      toast.error('Failed to download invoice')
    }
  }

  const handleViewInvoice = async (id: string) => {
    try {
      const invoice = await viewInvoice(id)
      setSelectedInvoice(invoice)
    } catch (err) {
      toast.error('Failed to view invoice')
    }
  }

  const handleUpdatePaymentStatus = async (id: string, status: string) => {
    try {
      await updatePaymentStatus(id, { status })
      toast.success('Payment status updated successfully')
    } catch (err) {
      toast.error('Failed to update payment status')
    }
  }

  const handlePayInvoice = async (id: string) => {
    try {
      await payInvoice(id)
      toast.success('Payment initiated successfully')
    } catch (err) {
      toast.error('Failed to initiate payment')
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <p className="text-gray-600">Manage your invoices and payments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.clientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.clientEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Invoice"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Download Invoice"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingInvoice(invoice)
                          setShowEditModal(true)
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit Invoice"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Invoice"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No invoices found</div>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <CreateInvoiceModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateInvoice}
        />
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && editingInvoice && (
        <EditInvoiceModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingInvoice(null)
          }}
          invoice={editingInvoice}
          onSubmit={(data: any) => handleUpdateInvoice(editingInvoice.id, data)}
        />
      )}

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <ViewInvoiceModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
          onUpdateStatus={handleUpdatePaymentStatus}
          onPay={handlePayInvoice}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}
    </div>
  )
}

// Placeholder components - these would need to be implemented
function CreateInvoiceModal({ isOpen, onClose, onSubmit }: any) {
  // Implementation needed
  return null
}

function EditInvoiceModal({ isOpen, onClose, invoice, onSubmit }: any) {
  // Implementation needed
  return null
}

function ViewInvoiceModal({ isOpen, onClose, invoice, onUpdateStatus, onPay }: any) {
  // Implementation needed
  return null
}
