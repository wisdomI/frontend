import React from 'react'
import { useFinancialAnalytics } from '@/hooks/useFinancialAnalytics'
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics'
import { useNotifications } from '@/hooks/useNotifications'
import { useSettings } from '@/hooks/useSettings'
import { useWithdrawal } from '@/hooks/useWithdrawal'
import { useEnhancedEarnings } from '@/hooks/useEnhancedEarnings'
import { useAvailability } from '@/hooks/useAvailability'
import { usePayments } from '@/hooks/usePayments'

const ApiIntegrationExamples: React.FC = () => {
  // Financial Analytics
  const { profitAnalysis, loading: financialLoading, error: financialError } = useFinancialAnalytics()

  // Performance Analytics
  const { 
    dashboard, 
    clientGrowth, 
    servicePerformance, 
    analytics,
    loading: performanceLoading,
    error: performanceError 
  } = usePerformanceAnalytics()

  // Notifications
  const { 
    notificationCount, 
    loading: notificationLoading,
    error: notificationError,
  } = useNotifications()

  // Settings
  const { 
    settings, 
    loading: settingsLoading,
    error: settingsError,
    createPin,
    changePin,
    verifyPin,
    updateNotificationSettings,
    updateProfileSettings
  } = useSettings()

  // Withdrawal/Bank Management
  const { 
    banks, 
    bankAccounts, 
    withdrawals, 
    stats: withdrawalStats,
    loading: withdrawalLoading,
    error: withdrawalError,
    resolveAccount,
    createBankAccount,
    withdraw
  } = useWithdrawal()

  // Enhanced Earnings
  const { 
    earnings, 
    summary, 
    statsOverview, 
    analytics: earningsAnalytics,
    loading: earningsLoading,
    error: earningsError,
    searchEarnings,
    fetchEarningsByStatus
  } = useEnhancedEarnings()

  // Availability
  const { 
    availabilities, 
    stats: availabilityStats, 
    availableVendors,
    loading: availabilityLoading,
    error: availabilityError
  } = useAvailability()

  // Payments
  const { 
    payments, 
    loading: paymentsLoading,
    error: paymentsError,
    createPaymentAccount
  } = usePayments()

  const handleCreatePin = async () => {
    try {
      await createPin({ pin: '1234', confirmPin: '1234' })
      console.log('PIN created successfully')
    } catch (error) {
      console.error('Failed to create PIN:', error)
    }
  }

  const handleWithdraw = async () => {
    try {
      if (bankAccounts.length > 0) {
        await withdraw(bankAccounts[0].id, 1000, '1234')
        console.log('Withdrawal processed successfully')
      }
    } catch (error) {
      console.error('Failed to process withdrawal:', error)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">API Integration Examples</h1>
      
      {/* Financial Analytics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Financial Analytics</h2>
        {financialLoading && <p>Loading profit analysis...</p>}
        {financialError && <p className="text-red-500">Error: {financialError}</p>}
        {profitAnalysis && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Total Revenue:</strong> ${profitAnalysis.totalRevenue}</p>
              <p><strong>Total Expenses:</strong> ${profitAnalysis.totalExpenses}</p>
              <p><strong>Net Profit:</strong> ${profitAnalysis.netProfit}</p>
              <p><strong>Profit Margin:</strong> {profitAnalysis.profitMargin}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Performance Analytics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
        {performanceLoading && <p>Loading performance analytics...</p>}
        {performanceError && <p className="text-red-500">Error: {performanceError}</p>}
        {dashboard && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p><strong>Total Clients:</strong> {dashboard.totalClients}</p>
              <p><strong>Active Clients:</strong> {dashboard.activeClients}</p>
              <p><strong>New Clients This Month:</strong> {dashboard.newClientsThisMonth}</p>
            </div>
            <div>
              <p><strong>Total Earnings:</strong> ${dashboard.totalEarnings}</p>
              <p><strong>Monthly Earnings:</strong> ${dashboard.monthlyEarnings}</p>
              <p><strong>Client Growth Rate:</strong> {dashboard.clientGrowthRate}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        {notificationLoading && <p>Loading notifications...</p>}
        {notificationError && <p className="text-red-500">Error: {notificationError}</p>}
        {!notificationLoading && !notificationError && (
          <div className="space-y-2">
            <p>
              <strong>Unread Notifications:</strong> {notificationCount}
            </p>
            <p className="text-sm text-gray-600">
              The notifications hook currently exposes the unread count while the full notifications API is under construction.
            </p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        {settingsLoading && <p>Loading settings...</p>}
        {settingsError && <p className="text-red-500">Error: {settingsError}</p>}
        <div className="space-y-4">
          <button 
            onClick={handleCreatePin}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Create PIN
          </button>
          {settings && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Profile Visibility:</strong> {settings.profileVisibility}</p>
                <p><strong>Show Contact Info:</strong> {settings.showContactInfo ? 'Yes' : 'No'}</p>
                <p><strong>Show Portfolio:</strong> {settings.showPortfolio ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p><strong>Show Reviews:</strong> {settings.showReviews ? 'Yes' : 'No'}</p>
                <p><strong>Show Availability:</strong> {settings.showAvailability ? 'Yes' : 'No'}</p>
                <p><strong>PIN Enabled:</strong> {settings.pinEnabled ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal/Bank Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Withdrawal & Bank Management</h2>
        {withdrawalLoading && <p>Loading withdrawal data...</p>}
        {withdrawalError && <p className="text-red-500">Error: {withdrawalError}</p>}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Banks</h3>
              <p>Available Banks: {banks.length}</p>
            </div>
            <div>
              <h3 className="font-semibold">Bank Accounts</h3>
              <p>Your Accounts: {bankAccounts.length}</p>
            </div>
            <div>
              <h3 className="font-semibold">Withdrawals</h3>
              <p>Total Withdrawals: {withdrawals.length}</p>
            </div>
          </div>
          {bankAccounts.length > 0 && (
            <button 
              onClick={handleWithdraw}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Process Withdrawal
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Earnings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Enhanced Earnings</h2>
        {earningsLoading && <p>Loading earnings data...</p>}
        {earningsError && <p className="text-red-500">Error: {earningsError}</p>}
        {summary && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p><strong>Total Earnings:</strong> ${summary.totalEarnings}</p>
              <p><strong>Pending Earnings:</strong> ${summary.pendingEarnings}</p>
            </div>
            <div>
              <p><strong>Completed Earnings:</strong> ${summary.completedEarnings}</p>
              <p><strong>Withdrawn Earnings:</strong> ${summary.withdrawnEarnings}</p>
            </div>
            <div>
              <p><strong>Monthly Earnings:</strong> ${summary.monthlyEarnings}</p>
              <p><strong>Yearly Earnings:</strong> ${summary.yearlyEarnings}</p>
            </div>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Availability</h2>
        {availabilityLoading && <p>Loading availability data...</p>}
        {availabilityError && <p className="text-red-500">Error: {availabilityError}</p>}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold">Availability Slots</h3>
            <p>Total Slots: {availabilities.length}</p>
          </div>
          <div>
            <h3 className="font-semibold">Available Vendors</h3>
            <p>Count: {availableVendors.length}</p>
          </div>
          <div>
            <h3 className="font-semibold">Stats</h3>
            {availabilityStats && (
              <p>Availability Rate: {availabilityStats.availabilityRate}%</p>
            )}
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Payments</h2>
        {paymentsLoading && <p>Loading payments data...</p>}
        {paymentsError && <p className="text-red-500">Error: {paymentsError}</p>}
        <div>
          <p><strong>Total Payment Accounts:</strong> {payments.length}</p>
        </div>
      </div>
    </div>
  )
}

export default ApiIntegrationExamples