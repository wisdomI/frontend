import { useState, useEffect } from 'react'
import { withdrawalAPI } from '@/lib/api'
import { Bank, BankAccount, Withdrawal, WithdrawalStats } from '@/types/api'

export const useWithdrawal = () => {
  const [banks, setBanks] = useState<Bank[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [stats, setStats] = useState<WithdrawalStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBanks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.getAllBanks()
      setBanks(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch banks')
      console.error('Error fetching banks:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBankAccounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.getBankAccounts()
      setBankAccounts(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bank accounts')
      console.error('Error fetching bank accounts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWithdrawals = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.getAllWithdrawals()
      setWithdrawals(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch withdrawals')
      console.error('Error fetching withdrawals:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.getWithdrawalStats()
      setStats(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch withdrawal stats')
      console.error('Error fetching withdrawal stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const resolveAccount = async (accountNumber: string, bankCode: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.resolveAccount({ accountNumber, bankCode })
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resolve account')
      console.error('Error resolving account:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createBankAccount = async (data: Partial<BankAccount>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.createBankAccount(data)
      await fetchBankAccounts() // Refresh bank accounts
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create bank account')
      console.error('Error creating bank account:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBankAccount = async (id: string, data: Partial<BankAccount>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.updateBankAccount(id, data)
      await fetchBankAccounts() // Refresh bank accounts
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update bank account')
      console.error('Error updating bank account:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBankAccount = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await withdrawalAPI.deleteBankAccount(id)
      await fetchBankAccounts() // Refresh bank accounts
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete bank account')
      console.error('Error deleting bank account:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const withdraw = async (bankAccountId: string, amount: number, pin: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.withdraw({ bankAccountId, amount, pin })
      await fetchWithdrawals() // Refresh withdrawals
      await fetchStats() // Refresh stats
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process withdrawal')
      console.error('Error processing withdrawal:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const verifyPin = async (withdrawalId: string, pin: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await withdrawalAPI.verifyPin({ withdrawalId, pin })
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify PIN')
      console.error('Error verifying PIN:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchAll = async () => {
    await Promise.all([
      fetchBanks(),
      fetchBankAccounts(),
      fetchWithdrawals(),
      fetchStats()
    ])
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    banks,
    bankAccounts,
    withdrawals,
    stats,
    loading,
    error,
    refetch: fetchAll,
    refetchBanks: fetchBanks,
    refetchBankAccounts: fetchBankAccounts,
    refetchWithdrawals: fetchWithdrawals,
    refetchStats: fetchStats,
    resolveAccount,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    withdraw,
    verifyPin
  }
}
