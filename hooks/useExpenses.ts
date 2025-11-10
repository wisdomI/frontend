import { useState, useEffect } from 'react'
import { expensesAPI } from '@/lib/api'
import { Expense, CreateExpenseRequest, ExpensesOverview } from '@/types/api'

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [expense, setExpense] = useState<Expense | null>(null)
  const [overview, setOverview] = useState<ExpensesOverview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesAPI.getAll(params)
      setExpenses(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expenses')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenseById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesAPI.getById(id)
      setExpense(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expense')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchOverview = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesAPI.getOverview()
      setOverview(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expenses overview')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchExpensesByCategory = async (category: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesAPI.getByCategory(category)
      setExpenses(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expenses by category')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchExpensesByDateRange = async (startDate: string, endDate: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesAPI.getByDateRange(startDate, endDate)
      setExpenses(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expenses by date range')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createExpense = async (data: CreateExpenseRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesAPI.create(data)
      setExpenses(prev => [...prev, response.data.data])
      // Refresh overview to update totals
      await fetchOverview()
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create expense')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateExpense = async (id: string, data: Partial<CreateExpenseRequest>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesAPI.update(id, data)
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === id ? response.data.data : expense
        )
      )
      if (expense?.id === id) {
        setExpense(response.data.data)
      }
      // Refresh overview to update totals
      await fetchOverview()
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update expense')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await expensesAPI.delete(id)
      setExpenses(prev => prev.filter(expense => expense.id !== id))
      if (expense?.id === id) {
        setExpense(null)
      }
      // Refresh overview to update totals
      await fetchOverview()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete expense')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
    fetchOverview()
  }, [])

  return {
    expenses,
    expense,
    overview,
    loading,
    error,
    fetchExpenses,
    fetchExpenseById,
    fetchOverview,
    fetchExpensesByCategory,
    fetchExpensesByDateRange,
    createExpense,
    updateExpense,
    deleteExpense,
  }
}
