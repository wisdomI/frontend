import { useState, useEffect } from 'react'
import { Receipt, CreateReceiptRequest, ReceiptStats } from '@/types/api'
import { receiptAPI } from '@/lib/api'

export const useReceipt = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [stats, setStats] = useState<ReceiptStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration - PIXEL PERFECT match to image
  const mockReceipts: Receipt[] = [
    {
      id: '1',
      receiptNumber: '7674',
      companyName: 'EventHub',
      companyTagline: 'Fresh & Delicious Bakery',
      companyEmail: 'info@ukcakesandcream.com',
      clientName: 'Adeboye Daniel',
      clientEmail: 'adeboyedaniel@gmail.com',
      issuedDate: '2025-07-13',
      paidDate: '2025-08-02',
      items: [
        { description: 'Small Chops', quantity: 20, amount: 100000 },
        { description: '3 Tier Cake', quantity: 1, amount: 100000 },
        { description: '10 Packs of drinks', quantity: 20, amount: 100000 },
        { description: 'Small Chops', quantity: '-', amount: 100000 },
        { description: '3 Tier Cake', quantity: 20, amount: 100000 },
        { description: '10 Packs of drinks', quantity: 20, amount: 100000 }
      ],
      subtotal: 100000, // Matches image subtotal
      discount: 1200,
      discountPercentage: 10,
      total: 10200, // Matches image total exactly
      status: 'paid',
      notes: 'Thank you for your business!',
      createdAt: '2025-07-13T10:00:00Z',
      updatedAt: '2025-08-02T14:30:00Z'
    }
  ]

  const fetchReceipts = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      
      // Try API call first, fallback to mock data if it fails
      try {
        const response = await receiptAPI.getAll(params)
        setReceipts(response.data.data || [])
        return response.data
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError)
        // Fallback to mock data for demonstration
        setReceipts(mockReceipts)
        return { data: { data: mockReceipts } }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch receipts')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchReceiptById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundReceipt = mockReceipts.find(r => r.id === id)
      if (!foundReceipt) {
        throw new Error('Receipt not found')
      }
      
      setReceipt(foundReceipt)
      return { data: { data: foundReceipt } }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch receipt')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createReceipt = async (data: CreateReceiptRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        receiptNumber: (Math.floor(Math.random() * 9000) + 1000).toString(),
        companyName: 'EventHub',
        companyTagline: 'Fresh & Delicious Bakery',
        companyEmail: 'info@ukcakesandcream.com',
        issuedDate: new Date().toISOString().split('T')[0],
        paidDate: new Date().toISOString().split('T')[0],
        status: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        total: data.subtotal - (data.discount || 0),
        discount: data.discount || 0,
        ...data
      }
      
      setReceipts(prev => [...prev, newReceipt])
      return { data: { data: newReceipt } }
    } catch (err: any) {
      setError(err.message || 'Failed to create receipt')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockStats: ReceiptStats = {
        totalReceipts: mockReceipts.length,
        paidReceipts: mockReceipts.filter(r => r.status === 'paid').length,
        pendingReceipts: mockReceipts.filter(r => r.status === 'pending').length,
        cancelledReceipts: mockReceipts.filter(r => r.status === 'cancelled').length,
        totalRevenue: mockReceipts.reduce((sum, r) => sum + r.total, 0),
        pendingRevenue: mockReceipts
          .filter(r => r.status === 'pending')
          .reduce((sum, r) => sum + r.total, 0)
      }
      
      setStats(mockStats)
      return { data: { data: mockStats } }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch receipt stats')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const generateReceiptFromInvoice = async (invoiceId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // This would typically fetch an invoice and convert it to a receipt
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const receipt = mockReceipts[0] // Use first mock receipt as example
      setReceipt(receipt)
      return { data: { data: receipt } }
    } catch (err: any) {
      setError(err.message || 'Failed to generate receipt from invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReceipts()
    fetchStats()
  }, [])

  return {
    receipts,
    receipt,
    stats,
    loading,
    error,
    fetchReceipts,
    fetchReceiptById,
    createReceipt,
    fetchStats,
    generateReceiptFromInvoice,
  }
}
