import { useState, useEffect } from 'react'
import { invoiceAPI } from '@/lib/api'
import { Invoice, CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceStats } from '@/types/api'

export const useInvoice = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [stats, setStats] = useState<InvoiceStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.getAll(params)
      setInvoices(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoices')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoiceById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.getById(id)
      setInvoice(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoiceByNumber = async (invoiceNumber: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.getByNumber(invoiceNumber)
      setInvoice(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.getStats()
      setStats(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoice stats')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createInvoice = async (data: CreateInvoiceRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.create(data)
      setInvoices(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateInvoice = async (id: string, data: UpdateInvoiceRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.update(id, data)
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === id ? response.data.data : invoice
        )
      )
      if (invoice?.id === id) {
        setInvoice(response.data.data)
      }
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await invoiceAPI.delete(id)
      setInvoices(prev => prev.filter(invoice => invoice.id !== id))
      if (invoice?.id === id) {
        setInvoice(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.download(id)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const viewInvoice = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.view(id)
      setInvoice(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to view invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (id: string, data: { status: string; notes?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.updatePaymentStatus(id, data)
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === id ? response.data.data : invoice
        )
      )
      if (invoice?.id === id) {
        setInvoice(response.data.data)
      }
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update payment status')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const markOverdue = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.markOverdue()
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark invoices overdue')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const payInvoice = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.pay(id)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to pay invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getNextInstallment = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.getNextInstallment(id)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get next installment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const payInstallment = async (data: { installmentId: string; email: string; amount: string; callbackUrl?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.payInstallment(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to pay installment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const markInstallmentOverdue = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.markInstallmentOverdue()
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark installments overdue')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getReminders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.getReminders()
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get reminders')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const markReminderAsSent = async (installmentId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceAPI.markReminderAsSent(installmentId)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark reminder as sent')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
    fetchStats()
  }, [])

  return {
    invoices,
    invoice,
    stats,
    loading,
    error,
    fetchInvoices,
    fetchInvoiceById,
    fetchInvoiceByNumber,
    fetchStats,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    downloadInvoice,
    viewInvoice,
    updatePaymentStatus,
    markOverdue,
    payInvoice,
    getNextInstallment,
    payInstallment,
    markInstallmentOverdue,
    getReminders,
    markReminderAsSent,
  }
}
