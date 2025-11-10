'use client'

import React, { useState } from 'react'
import { authAPI, profileAPI, serviceAPI, meetingAPI, serviceRequestAPI, bidAPI, ratingAPI, messageAPI, categoryAPI, notificationAPI, settingsAPI, withdrawalAPI, earningsAPI, expensesAPI, teamsAPI, invoiceAPI, receiptAPI, vendorEarningsAPI, vendorAnalyticsAPI, vendorTeamAPI, vendorSubscriptionAPI, financialAnalyticsAPI, performanceAnalyticsAPI, availabilityAPI, enhancedEarningsAPI, paymentsAPI, travelAPI, customerAPI, vendorServiceRequestAPI, vendorResponseAPI, progressTrackerAPI } from '@/lib/api'

interface TestResult {
  endpoint: string
  method: string
  status: 'pending' | 'success' | 'error'
  response?: any
  error?: string
  duration?: number
}

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = {
    'all': 'All Endpoints',
    'auth': 'Authentication',
    'profile': 'Profile Management',
    'services': 'Service Management',
    'meetings': 'Meetings',
    'service-requests': 'Service Requests',
    'bidding': 'Bidding System',
    'ratings': 'Ratings & Reviews',
    'messaging': 'Messaging',
    'categories': 'Categories',
    'notifications': 'Notifications',
    'settings': 'Settings',
    'withdrawal': 'Withdrawal & Banking',
    'earnings': 'Earnings',
    'expenses': 'Expenses',
    'teams': 'Teams',
    'invoices': 'Invoices',
    'receipts': 'Receipts',
    'vendor': 'Vendor APIs',
    'analytics': 'Analytics',
    'availability': 'Availability',
    'payments': 'Payments',
    'travel': 'Travel',
    'customers': 'Customers',
    'progress': 'Progress Tracking'
  }

  const testEndpoints = [
    // Authentication
    { category: 'auth', name: 'Register User', method: 'POST', endpoint: '/auth/register', test: () => authAPI.register({
      businessName: 'Test Business',
      businessAddress: '123 Test St, Lagos, Nigeria',
      businessEmail: 'test@business.com',
      email: 'test@example.com',
      phoneNumber: '+234-802-123-4567',
      password: 'TestPass123@',
      confirmPassword: 'TestPass123@',
      accountType: 'vendor'
    }) },
    { category: 'auth', name: 'Login User', method: 'POST', endpoint: '/auth/login', test: () => authAPI.login({
      email: 'test@example.com',
      password: 'TestPass123@'
    }) },
    { category: 'auth', name: 'Get User Info', method: 'GET', endpoint: '/auth/me', test: () => authAPI.me() },
    { category: 'auth', name: 'Refresh Token', method: 'POST', endpoint: '/auth/refresh-token', test: () => authAPI.refresh({ refreshToken: 'test-refresh-token' }) },
    { category: 'auth', name: 'Logout', method: 'POST', endpoint: '/auth/logout', test: () => authAPI.logout({ userId: 'test-user-id' }) },

    // Profile Management
    { category: 'profile', name: 'Get Profile', method: 'GET', endpoint: '/profile/me', test: () => profileAPI.me() },
    { category: 'profile', name: 'Get All Profiles', method: 'GET', endpoint: '/profile/all', test: () => profileAPI.getAll() },
    { category: 'profile', name: 'Get Profile by ID', method: 'GET', endpoint: '/profile/:id', test: () => profileAPI.getById('test-id') },
    { category: 'profile', name: 'Update Profile', method: 'PATCH', endpoint: '/profile/:id', test: () => profileAPI.update('test-id', new FormData()) },
    { category: 'profile', name: 'Update Display Picture', method: 'PATCH', endpoint: '/profile/:id/display-picture', test: () => profileAPI.updateDisplayPicture('test-id', new FormData()) },
    { category: 'profile', name: 'Remove Display Picture', method: 'DELETE', endpoint: '/profile/:id/display-picture', test: () => profileAPI.removeDisplayPicture('test-id') },
    { category: 'profile', name: 'Delete Profile', method: 'DELETE', endpoint: '/profile/:id', test: () => profileAPI.delete('test-id') },

    // Service Management
    { category: 'services', name: 'Get My Services', method: 'GET', endpoint: '/service/me', test: () => serviceAPI.myServices() },
    { category: 'services', name: 'Get All Services', method: 'GET', endpoint: '/service/', test: () => serviceAPI.getAll() },
    { category: 'services', name: 'Get Service by ID', method: 'GET', endpoint: '/service/:id', test: () => serviceAPI.getById('test-id') },
    { category: 'services', name: 'Get User Services', method: 'GET', endpoint: '/service/user-services', test: () => serviceAPI.userServices() },
    { category: 'services', name: 'Create Service', method: 'POST', endpoint: '/service/', test: () => serviceAPI.create(new FormData()) },
    { category: 'services', name: 'Update Service', method: 'PATCH', endpoint: '/service/:id', test: () => serviceAPI.update('test-id', new FormData()) },
    { category: 'services', name: 'Remove Service Media', method: 'DELETE', endpoint: '/service/:id/media', test: () => serviceAPI.removeMedia('test-id', 'test-url') },
    { category: 'services', name: 'Delete Service', method: 'DELETE', endpoint: '/service/:id', test: () => serviceAPI.delete('test-id') },

    // Meetings
    { category: 'meetings', name: 'Get All Meetings', method: 'GET', endpoint: '/meetings/', test: () => meetingAPI.getAll() },
    { category: 'meetings', name: 'Get My Meetings', method: 'GET', endpoint: '/meetings/my', test: () => meetingAPI.getMy() },
    { category: 'meetings', name: 'Get Attendances', method: 'GET', endpoint: '/meetings/attendances', test: () => meetingAPI.getAttendances() },
    { category: 'meetings', name: 'Get Meeting by ID', method: 'GET', endpoint: '/meetings/:id', test: () => meetingAPI.getById('test-id') },
    { category: 'meetings', name: 'Get Meeting Stats', method: 'GET', endpoint: '/meetings/stats', test: () => meetingAPI.getStats() },
    { category: 'meetings', name: 'Get Upcoming Meetings', method: 'GET', endpoint: '/meetings/upcoming', test: () => meetingAPI.getUpcoming() },
    { category: 'meetings', name: 'Create Meeting', method: 'POST', endpoint: '/meetings/', test: () => meetingAPI.create({
      title: 'Test Meeting',
      description: 'Test Description',
      frequency: 'once',
      meetingDate: '2024-12-31',
      startTime: '10:00',
      endTime: '11:00',
      startDate: '2024-12-31',
      endDate: '2024-12-31',
      isRecurring: false,
      attendees: [{ email: 'test@example.com', firstName: 'Test', lastName: 'User' }]
    }) },
    { category: 'meetings', name: 'Update Meeting', method: 'PATCH', endpoint: '/meetings/:id', test: () => meetingAPI.update('test-id', {
      title: 'Updated Meeting'
    }) },
    { category: 'meetings', name: 'Toggle Meeting Status', method: 'PATCH', endpoint: '/meetings/:id/toggle-status', test: () => meetingAPI.toggleStatus('test-id') },
    { category: 'meetings', name: 'Delete Meeting', method: 'DELETE', endpoint: '/meetings/:id', test: () => meetingAPI.delete('test-id') },

    // Service Requests
    { category: 'service-requests', name: 'Get All Service Requests', method: 'GET', endpoint: '/service-requests/', test: () => serviceRequestAPI.getAll() },
    { category: 'service-requests', name: 'Get My Service Requests', method: 'GET', endpoint: '/service-requests/my', test: () => serviceRequestAPI.getMy() },
    { category: 'service-requests', name: 'Get Assigned Service Requests', method: 'GET', endpoint: '/service-requests/assigned', test: () => serviceRequestAPI.getAssigned() },
    { category: 'service-requests', name: 'Get Open Service Requests', method: 'GET', endpoint: '/service-requests/open', test: () => serviceRequestAPI.getOpen() },
    { category: 'service-requests', name: 'Get Upcoming Service Requests', method: 'GET', endpoint: '/service-requests/upcoming', test: () => serviceRequestAPI.getUpcoming() },
    { category: 'service-requests', name: 'Get Service Request Stats', method: 'GET', endpoint: '/service-requests/stats', test: () => serviceRequestAPI.getStats() },
    { category: 'service-requests', name: 'Get Service Request by ID', method: 'GET', endpoint: '/service-requests/:id', test: () => serviceRequestAPI.getById('test-id') },
    { category: 'service-requests', name: 'Search Service Requests', method: 'GET', endpoint: '/service-requests/search', test: () => serviceRequestAPI.search({ eventType: 'wedding' }) },
    { category: 'service-requests', name: 'Create Service Request', method: 'POST', endpoint: '/service-requests/', test: () => serviceRequestAPI.create({
      eventTitle: 'Test Event',
      eventType: 'wedding',
      eventStartDate: '2024-12-31',
      eventEndDate: '2024-12-31',
      eventLocation: 'Test Location',
      eventCity: 'Lagos',
      servicesNeeded: ['test-service-id'],
      numberOfGuests: 100,
      budgetRange: '10000-50000',
      additionalInformation: 'Test info',
      needsEventPlanner: false,
      needsAISuggestions: false
    }) },
    { category: 'service-requests', name: 'Update Service Request', method: 'PATCH', endpoint: '/service-requests/:id', test: () => serviceRequestAPI.update('test-id', {
      eventTitle: 'Updated Event'
    }) },
    { category: 'service-requests', name: 'Toggle Service Request Status', method: 'PATCH', endpoint: '/service-requests/:id/toggle-status', test: () => serviceRequestAPI.toggleStatus('test-id') },
    { category: 'service-requests', name: 'Delete Service Request', method: 'DELETE', endpoint: '/service-requests/:id', test: () => serviceRequestAPI.delete('test-id') },

    // Bidding System
    { category: 'bidding', name: 'Get All Bids', method: 'GET', endpoint: '/bids/', test: () => bidAPI.getAll() },
    { category: 'bidding', name: 'Get Bids with Details', method: 'GET', endpoint: '/bids/details', test: () => bidAPI.getWithDetails() },
    { category: 'bidding', name: 'Get Bid Stats', method: 'GET', endpoint: '/bids/stats', test: () => bidAPI.getStats() },
    { category: 'bidding', name: 'Get Bid by ID', method: 'GET', endpoint: '/bids/:id', test: () => bidAPI.getById('test-id') },
    { category: 'bidding', name: 'Create Bid', method: 'POST', endpoint: '/bids/details', test: () => bidAPI.create({
      serviceRequestId: 'test-service-request-id',
      bidAmount: 50000,
      startDate: '2024-12-31',
      endDate: '2024-12-31',
      proposedDetails: 'Test proposal',
      additionalServices: ['extra-service']
    }) },
    { category: 'bidding', name: 'Update Bid', method: 'PATCH', endpoint: '/bids/:id', test: () => bidAPI.update('test-id', {
      bidAmount: 60000
    }) },
    { category: 'bidding', name: 'Withdraw Bid', method: 'PATCH', endpoint: '/bids/:id/withdraw', test: () => bidAPI.withdraw('test-id') },
    { category: 'bidding', name: 'Accept Bid', method: 'PATCH', endpoint: '/bids/:id/accept', test: () => bidAPI.accept('test-id') },
    { category: 'bidding', name: 'Reject Bid', method: 'PATCH', endpoint: '/bids/:id/reject', test: () => bidAPI.reject('test-id') },
    { category: 'bidding', name: 'Delete Bid', method: 'DELETE', endpoint: '/bids/:id/withdraw', test: () => bidAPI.delete('test-id') },

    // Categories
    { category: 'categories', name: 'Get All Categories', method: 'GET', endpoint: '/categories/', test: () => categoryAPI.getAll() },
    { category: 'categories', name: 'Get Category Stats', method: 'GET', endpoint: '/categories/stats', test: () => categoryAPI.getStats() },
    { category: 'categories', name: 'Get Category by ID', method: 'GET', endpoint: '/categories/:id', test: () => categoryAPI.getById('test-id') },
    { category: 'categories', name: 'Get Category Hierarchy', method: 'GET', endpoint: '/categories/hierarchy', test: () => categoryAPI.getHierarchy() },
    { category: 'categories', name: 'Get Main Categories', method: 'GET', endpoint: '/categories/main', test: () => categoryAPI.getMain() },
    { category: 'categories', name: 'Get Subcategories', method: 'GET', endpoint: '/categories/:id/subcategories', test: () => categoryAPI.getSubcategories('test-id') },
    { category: 'categories', name: 'Create Category', method: 'POST', endpoint: '/categories/', test: () => categoryAPI.create({
      name: 'Test Category',
      description: 'Test Description',
      isActive: true
    }) },
    { category: 'categories', name: 'Update Category', method: 'PATCH', endpoint: '/categories/:id', test: () => categoryAPI.update('test-id', {
      name: 'Updated Category'
    }) },
    { category: 'categories', name: 'Toggle Category Status', method: 'PATCH', endpoint: '/categories/:id/toggle-status', test: () => categoryAPI.toggleStatus('test-id') },
    { category: 'categories', name: 'Delete Category', method: 'DELETE', endpoint: '/categories/:id', test: () => categoryAPI.delete('test-id') },

    // Notifications
    { category: 'notifications', name: 'Get All Notifications', method: 'GET', endpoint: '/notifications/', test: () => notificationAPI.getAll() },
    { category: 'notifications', name: 'Get Notification by ID', method: 'GET', endpoint: '/notifications/:id', test: () => notificationAPI.getById('test-id') },
    { category: 'notifications', name: 'Get Notification Stats', method: 'GET', endpoint: '/notifications/stats/overview', test: () => notificationAPI.getStats() },
    { category: 'notifications', name: 'Mark Notification as Read', method: 'PATCH', endpoint: '/notifications/:id/read', test: () => notificationAPI.markAsRead('test-id') },
    { category: 'notifications', name: 'Mark All Notifications as Read', method: 'PATCH', endpoint: '/notifications/read-all', test: () => notificationAPI.markAllAsRead() },
    { category: 'notifications', name: 'Get Notification Preferences', method: 'GET', endpoint: '/notifications/preferences', test: () => notificationAPI.getPreferences() },
    { category: 'notifications', name: 'Create Notification', method: 'POST', endpoint: '/notifications/', test: () => notificationAPI.create({
      type: 'system',
      title: 'Test Notification',
      message: 'Test message',
      priority: 'medium',
      channels: ['in-app']
    }) },
    { category: 'notifications', name: 'Create Notification Preferences', method: 'POST', endpoint: '/notifications/preferences', test: () => notificationAPI.createPreferences({
      jobAlerts: true,
      newJobMatches: true,
      clientsPostedJob: true,
      newChatMessage: true,
      escrowDepositConfirmed: true,
      paymentReleased: true,
      refundCancellationNotice: true,
      inAppNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      platformPromotions: true,
      verificationUpdates: true
    }) },
    { category: 'notifications', name: 'Update Notification Preferences', method: 'PATCH', endpoint: '/notifications/preferences', test: () => notificationAPI.updatePreferences({
      emailNotifications: false
    }) },

    // Settings
    { category: 'settings', name: 'Get All Settings', method: 'GET', endpoint: '/settings/', test: () => settingsAPI.getAll() },
    { category: 'settings', name: 'Create PIN', method: 'POST', endpoint: '/settings/pin/create', test: () => settingsAPI.createPin({
      pin: '1234',
      confirmPin: '1234'
    }) },
    { category: 'settings', name: 'Change PIN', method: 'PATCH', endpoint: '/settings/pin/change', test: () => settingsAPI.changePin({
      oldPin: '1234',
      newPin: '5678',
      confirmNewPin: '5678'
    }) },
    { category: 'settings', name: 'Verify PIN', method: 'POST', endpoint: '/settings/pin/verify', test: () => settingsAPI.verifyPin({
      pin: '1234'
    }) },
    { category: 'settings', name: 'Update Notification Settings', method: 'PATCH', endpoint: '/settings/notification', test: () => settingsAPI.updateNotificationSettings({
      emailNotifications: false
    }) },
    { category: 'settings', name: 'Update Profile Settings', method: 'PATCH', endpoint: '/settings/profile', test: () => settingsAPI.updateProfileSettings({
      profileVisibility: 'public'
    }) },

    // Withdrawal & Banking
    { category: 'withdrawal', name: 'Get All Banks', method: 'GET', endpoint: '/withdrawal/banks', test: () => withdrawalAPI.getAllBanks() },
    { category: 'withdrawal', name: 'Resolve Account', method: 'GET', endpoint: '/withdrawal/banks/resolve-account', test: () => withdrawalAPI.resolveAccount({
      accountNumber: '1234567890',
      bankCode: '044'
    }) },
    { category: 'withdrawal', name: 'Get Bank Accounts', method: 'GET', endpoint: '/withdrawal/bank-accounts', test: () => withdrawalAPI.getBankAccounts() },
    { category: 'withdrawal', name: 'Get Bank Account by ID', method: 'GET', endpoint: '/withdrawal/bank-accounts/:id', test: () => withdrawalAPI.getBankAccountById('test-id') },
    { category: 'withdrawal', name: 'Create Bank Account', method: 'POST', endpoint: '/withdrawal/bank-accounts', test: () => withdrawalAPI.createBankAccount({
      accountName: 'Test Account',
      accountNumber: '1234567890',
      bankCode: '044'
    }) },
    { category: 'withdrawal', name: 'Update Bank Account', method: 'PATCH', endpoint: '/withdrawal/bank-accounts/:id', test: () => withdrawalAPI.updateBankAccount('test-id', {
      accountName: 'Updated Account'
    }) },
    { category: 'withdrawal', name: 'Delete Bank Account', method: 'DELETE', endpoint: '/withdrawal/bank-accounts/:id', test: () => withdrawalAPI.deleteBankAccount('test-id') },
    { category: 'withdrawal', name: 'Get All Withdrawals', method: 'GET', endpoint: '/withdrawal/withdraw/', test: () => withdrawalAPI.getAllWithdrawals() },
    { category: 'withdrawal', name: 'Get Withdrawal by ID', method: 'GET', endpoint: '/withdrawal/withdraw/:id', test: () => withdrawalAPI.getWithdrawalById('test-id') },
    { category: 'withdrawal', name: 'Get Withdrawal Stats', method: 'GET', endpoint: '/withdrawal/withdraw/stats/summary', test: () => withdrawalAPI.getWithdrawalStats() },
    { category: 'withdrawal', name: 'Process Withdrawal', method: 'POST', endpoint: '/withdrawal/withdraw', test: () => withdrawalAPI.withdraw({
      bankAccountId: 'test-bank-id',
      amount: 10000,
      pin: '1234'
    }) },
    { category: 'withdrawal', name: 'Verify PIN for Withdrawal', method: 'POST', endpoint: '/withdrawal/withdraw/verify-pin', test: () => withdrawalAPI.verifyPin({
      withdrawalId: 'test-withdrawal-id',
      pin: '1234'
    }) },

    // Earnings
    { category: 'earnings', name: 'Get Earnings Overview', method: 'GET', endpoint: '/earnings/stats/overview', test: () => earningsAPI.getOverview() },
    { category: 'earnings', name: 'Get All Earnings', method: 'GET', endpoint: '/earnings/', test: () => earningsAPI.getAll() },
    { category: 'earnings', name: 'Get Earnings by ID', method: 'GET', endpoint: '/earnings/:id', test: () => earningsAPI.getById('test-id') },
    { category: 'earnings', name: 'Get Earnings by Status', method: 'GET', endpoint: '/earnings/status/:status', test: () => earningsAPI.getByStatus('pending') },
    { category: 'earnings', name: 'Get Earnings by Date Range', method: 'GET', endpoint: '/earnings/range', test: () => earningsAPI.getByDateRange('2024-01-01', '2024-12-31') },
    { category: 'earnings', name: 'Get Total Earnings', method: 'GET', endpoint: '/earnings/total', test: () => earningsAPI.getTotalEarnings() },

    // Enhanced Earnings
    { category: 'earnings', name: 'Get Earnings Summary', method: 'GET', endpoint: '/earnings/summary', test: () => enhancedEarningsAPI.getSummary() },
    { category: 'earnings', name: 'Get Earnings Analytics', method: 'GET', endpoint: '/earnings/analytics', test: () => enhancedEarningsAPI.getAnalytics() },
    { category: 'earnings', name: 'Get Earnings Comparison', method: 'GET', endpoint: '/earnings/comparison', test: () => enhancedEarningsAPI.getComparison() },
    { category: 'earnings', name: 'Search Earnings', method: 'GET', endpoint: '/earnings/search', test: () => enhancedEarningsAPI.search() },
    { category: 'earnings', name: 'Get Earnings by Date Range (Enhanced)', method: 'GET', endpoint: '/earnings/data-range', test: () => enhancedEarningsAPI.getByDateRange() },

    // Expenses
    { category: 'expenses', name: 'Get Expenses Overview', method: 'GET', endpoint: '/expenses/stats/overview', test: () => expensesAPI.getOverview() },
    { category: 'expenses', name: 'Get All Expenses', method: 'GET', endpoint: '/expenses/', test: () => expensesAPI.getAll() },
    { category: 'expenses', name: 'Get Expense by ID', method: 'GET', endpoint: '/expenses/:id', test: () => expensesAPI.getById('test-id') },
    { category: 'expenses', name: 'Get Expenses by Category', method: 'GET', endpoint: '/expenses/category/:category', test: () => expensesAPI.getByCategory('marketing') },
    { category: 'expenses', name: 'Get Expenses by Date Range', method: 'GET', endpoint: '/expenses/range', test: () => expensesAPI.getByDateRange('2024-01-01', '2024-12-31') },
    { category: 'expenses', name: 'Create Expense', method: 'POST', endpoint: '/expenses/', test: () => expensesAPI.create({
      category: 'marketing',
      amount: 5000,
      date: '2024-12-31',
      description: 'Test expense'
    }) },
    { category: 'expenses', name: 'Update Expense', method: 'PATCH', endpoint: '/expenses/:id', test: () => expensesAPI.update('test-id', {
      amount: 6000
    }) },
    { category: 'expenses', name: 'Delete Expense', method: 'DELETE', endpoint: '/expenses/:id', test: () => expensesAPI.delete('test-id') },

    // Teams
    { category: 'teams', name: 'Get All Teams', method: 'GET', endpoint: '/teams/', test: () => teamsAPI.getAll() },
    { category: 'teams', name: 'Get Team by ID', method: 'GET', endpoint: '/teams/:id', test: () => teamsAPI.getById('test-id') },
    { category: 'teams', name: 'Get Team Stats', method: 'GET', endpoint: '/teams/stats', test: () => teamsAPI.getStats() },
    { category: 'teams', name: 'Create Team', method: 'POST', endpoint: '/teams/', test: () => teamsAPI.create({
      name: 'Test Team',
      description: 'Test Description'
    }) },
    { category: 'teams', name: 'Update Team', method: 'PATCH', endpoint: '/teams/:id', test: () => teamsAPI.update('test-id', {
      name: 'Updated Team'
    }) },
    { category: 'teams', name: 'Toggle Team Status', method: 'PATCH', endpoint: '/teams/:id/toggle-status', test: () => teamsAPI.toggleStatus('test-id') },
    { category: 'teams', name: 'Delete Team', method: 'DELETE', endpoint: '/teams/:id', test: () => teamsAPI.delete('test-id') },
    { category: 'teams', name: 'Get All Team Members', method: 'GET', endpoint: '/teams/members', test: () => teamsAPI.getAllMembers() },
    { category: 'teams', name: 'Get Team Members', method: 'GET', endpoint: '/teams/:id/members', test: () => teamsAPI.getMembers('test-id') },
    { category: 'teams', name: 'Get Team Member by ID', method: 'GET', endpoint: '/teams/members/:id', test: () => teamsAPI.getMemberById('test-id') },
    { category: 'teams', name: 'Invite Team Member', method: 'POST', endpoint: '/teams/members', test: () => teamsAPI.inviteMember({
      teamId: 'test-team-id',
      email: 'test@example.com',
      phoneNumber: '+234-802-123-4567',
      role: 'manager'
    }) },
    { category: 'teams', name: 'Update Team Member', method: 'PATCH', endpoint: '/teams/members/:id', test: () => teamsAPI.updateMember('test-id', {
      role: 'admin'
    }) },
    { category: 'teams', name: 'Remove Team Member', method: 'DELETE', endpoint: '/teams/members/:id', test: () => teamsAPI.removeMember('test-id') },
    { category: 'teams', name: 'Resend Invitation', method: 'POST', endpoint: '/teams/members/:id/resend-invitation', test: () => teamsAPI.resendInvitation('test-id') },

    // Invoices
    { category: 'invoices', name: 'Get All Invoices', method: 'GET', endpoint: '/invoices/', test: () => invoiceAPI.getAll() },
    { category: 'invoices', name: 'Get Invoice by ID', method: 'GET', endpoint: '/invoices/:id', test: () => invoiceAPI.getById('test-id') },
    { category: 'invoices', name: 'Get Invoice by Number', method: 'GET', endpoint: '/invoices/number/:number', test: () => invoiceAPI.getByNumber('INV-001') },
    { category: 'invoices', name: 'Get Invoice Stats', method: 'GET', endpoint: '/invoices/stats', test: () => invoiceAPI.getStats() },
    { category: 'invoices', name: 'Create Invoice', method: 'POST', endpoint: '/invoices/', test: () => invoiceAPI.create({
      clientEmail: 'test@example.com',
      clientName: 'Test Client',
      dueDate: '2024-12-31',
      paymentPattern: 'full_upfront',
      items: [{
        description: 'Test Item',
        quantity: 1,
        amount: 10000,
        total: 10000
      }]
    }) },
    { category: 'invoices', name: 'Update Invoice', method: 'PATCH', endpoint: '/invoices/:id', test: () => invoiceAPI.update('test-id', {
      clientName: 'Updated Client'
    }) },
    { category: 'invoices', name: 'Delete Invoice', method: 'DELETE', endpoint: '/invoices/:id', test: () => invoiceAPI.delete('test-id') },
    { category: 'invoices', name: 'Download Invoice', method: 'GET', endpoint: '/invoices/:id/download', test: () => invoiceAPI.download('test-id') },
    { category: 'invoices', name: 'View Invoice', method: 'GET', endpoint: '/invoices/:id/view', test: () => invoiceAPI.view('test-id') },
    { category: 'invoices', name: 'Update Payment Status', method: 'PATCH', endpoint: '/invoices/:id/payment-status', test: () => invoiceAPI.updatePaymentStatus('test-id', {
      status: 'paid'
    }) },
    { category: 'invoices', name: 'Mark Overdue', method: 'POST', endpoint: '/invoices/mark-overdue', test: () => invoiceAPI.markOverdue() },
    { category: 'invoices', name: 'Pay Invoice', method: 'GET', endpoint: '/invoices/pay/:id', test: () => invoiceAPI.pay('test-id') },

    // Receipts
    { category: 'receipts', name: 'Get All Receipts', method: 'GET', endpoint: '/receipts/', test: () => receiptAPI.getAll() },
    { category: 'receipts', name: 'Get Receipt by ID', method: 'GET', endpoint: '/receipts/:id', test: () => receiptAPI.getById('test-id') },
    { category: 'receipts', name: 'Get Receipt by Number', method: 'GET', endpoint: '/receipts/number/:number', test: () => receiptAPI.getByNumber('RCP-001') },
    { category: 'receipts', name: 'Get Receipt Stats', method: 'GET', endpoint: '/receipts/stats', test: () => receiptAPI.getStats() },
    { category: 'receipts', name: 'Create Receipt', method: 'POST', endpoint: '/receipts/', test: () => receiptAPI.create({
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      items: [{
        description: 'Test Item',
        quantity: 1,
        amount: 10000
      }],
      subtotal: 10000
    }) },
    { category: 'receipts', name: 'Generate Receipt from Invoice', method: 'POST', endpoint: '/receipts/generate-from-invoice/:id', test: () => receiptAPI.generateFromInvoice('test-id') },
    { category: 'receipts', name: 'Download Receipt', method: 'GET', endpoint: '/receipts/:id/download', test: () => receiptAPI.download('test-id') },

    // Vendor APIs
    { category: 'vendor', name: 'Get Vendor Earnings', method: 'GET', endpoint: '/earnings/', test: () => vendorEarningsAPI.getEarnings() },
    { category: 'vendor', name: 'Get Vendor Earnings Stats', method: 'GET', endpoint: '/earnings/stats/overview', test: () => vendorEarningsAPI.getEarningsStats() },
    { category: 'vendor', name: 'Get Vendor Earnings Overview', method: 'GET', endpoint: '/earnings/stats/overview', test: () => vendorEarningsAPI.getEarningsOverview() },
    { category: 'vendor', name: 'Get Vendor Withdrawals', method: 'GET', endpoint: '/vendor/withdrawals', test: () => vendorEarningsAPI.getWithdrawals() },
    { category: 'vendor', name: 'Request Withdrawal', method: 'POST', endpoint: '/vendor/withdrawals', test: () => vendorEarningsAPI.requestWithdrawal({
      amount: 10000,
      bankDetails: { accountNumber: '1234567890', bankCode: '044' }
    }) },
    { category: 'vendor', name: 'Get Withdrawal History', method: 'GET', endpoint: '/vendor/withdrawals/history', test: () => vendorEarningsAPI.getWithdrawalHistory() },
    { category: 'vendor', name: 'Get Bank Details', method: 'GET', endpoint: '/vendor/bank-details', test: () => vendorEarningsAPI.getBankDetails() },
    { category: 'vendor', name: 'Update Bank Details', method: 'PUT', endpoint: '/vendor/bank-details', test: () => vendorEarningsAPI.updateBankDetails({
      accountNumber: '1234567890',
      bankCode: '044'
    }) },
    { category: 'vendor', name: 'Get Payment Status', method: 'GET', endpoint: '/vendor/payment-status', test: () => vendorEarningsAPI.getPaymentStatus() },

    // Vendor Analytics
    { category: 'analytics', name: 'Get Performance Metrics', method: 'GET', endpoint: '/vendor/analytics/performance', test: () => vendorAnalyticsAPI.getPerformanceMetrics() },
    { category: 'analytics', name: 'Get Engagement Metrics', method: 'GET', endpoint: '/vendor/analytics/engagement', test: () => vendorAnalyticsAPI.getEngagementMetrics() },
    { category: 'analytics', name: 'Get Client Insights', method: 'GET', endpoint: '/vendor/analytics/clients', test: () => vendorAnalyticsAPI.getClientInsights() },
    { category: 'analytics', name: 'Get Revenue Analytics', method: 'GET', endpoint: '/vendor/analytics/revenue', test: () => vendorAnalyticsAPI.getRevenueAnalytics() },
    { category: 'analytics', name: 'Get Service Performance', method: 'GET', endpoint: '/vendor/analytics/services', test: () => vendorAnalyticsAPI.getServicePerformance() },
    { category: 'analytics', name: 'Get Event Type Analytics', method: 'GET', endpoint: '/vendor/analytics/event-types', test: () => vendorAnalyticsAPI.getEventTypeAnalytics() },
    { category: 'analytics', name: 'Get Conversion Metrics', method: 'GET', endpoint: '/vendor/analytics/conversion', test: () => vendorAnalyticsAPI.getConversionMetrics() },
    { category: 'analytics', name: 'Get Profile Views', method: 'GET', endpoint: '/vendor/analytics/profile-views', test: () => vendorAnalyticsAPI.getProfileViews() },

    // Vendor Team Management
    { category: 'vendor', name: 'Get Vendor Staff', method: 'GET', endpoint: '/teams/members', test: () => vendorTeamAPI.getStaff() },
    { category: 'vendor', name: 'Add Vendor Staff', method: 'POST', endpoint: '/teams/members', test: () => vendorTeamAPI.addStaff({
      email: 'test@example.com',
      phone: '+234-802-123-4567',
      role: 'manager'
    }) },
    { category: 'vendor', name: 'Update Vendor Staff', method: 'PATCH', endpoint: '/teams/members/:id', test: () => vendorTeamAPI.updateStaff('test-id', {
      role: 'admin'
    }) },
    { category: 'vendor', name: 'Remove Vendor Staff', method: 'DELETE', endpoint: '/teams/members/:id', test: () => vendorTeamAPI.removeStaff('test-id') },
    { category: 'vendor', name: 'Get Vendor Roles', method: 'GET', endpoint: '/teams/roles', test: () => vendorTeamAPI.getRoles() },
    { category: 'vendor', name: 'Create Vendor Role', method: 'POST', endpoint: '/teams/roles', test: () => vendorTeamAPI.createRole({
      name: 'Test Role',
      permissions: ['read', 'write']
    }) },
    { category: 'vendor', name: 'Update Vendor Role', method: 'PATCH', endpoint: '/teams/roles/:id', test: () => vendorTeamAPI.updateRole('test-id', {
      name: 'Updated Role'
    }) },
    { category: 'vendor', name: 'Delete Vendor Role', method: 'DELETE', endpoint: '/teams/roles/:id', test: () => vendorTeamAPI.deleteRole('test-id') },
    { category: 'vendor', name: 'Get Vendor Team Stats', method: 'GET', endpoint: '/teams/stats', test: () => vendorTeamAPI.getTeamStats() },

    // Vendor Subscription
    { category: 'vendor', name: 'Get Subscription Status', method: 'GET', endpoint: '/vendor/subscription/status', test: () => vendorSubscriptionAPI.getSubscriptionStatus() },
    { category: 'vendor', name: 'Get Subscription Plans', method: 'GET', endpoint: '/vendor/subscription/plans', test: () => vendorSubscriptionAPI.getSubscriptionPlans() },
    { category: 'vendor', name: 'Upgrade Subscription', method: 'POST', endpoint: '/vendor/subscription/upgrade', test: () => vendorSubscriptionAPI.upgradeSubscription('plan-id') },
    { category: 'vendor', name: 'Downgrade Subscription', method: 'POST', endpoint: '/vendor/subscription/downgrade', test: () => vendorSubscriptionAPI.downgradeSubscription('plan-id') },
    { category: 'vendor', name: 'Cancel Subscription', method: 'POST', endpoint: '/vendor/subscription/cancel', test: () => vendorSubscriptionAPI.cancelSubscription() },
    { category: 'vendor', name: 'Get Billing History', method: 'GET', endpoint: '/vendor/subscription/billing', test: () => vendorSubscriptionAPI.getBillingHistory() },
    { category: 'vendor', name: 'Get Current Invoice', method: 'GET', endpoint: '/vendor/subscription/current-invoice', test: () => vendorSubscriptionAPI.getCurrentInvoice() },
    { category: 'vendor', name: 'Update Payment Method', method: 'PUT', endpoint: '/vendor/subscription/payment-method', test: () => vendorSubscriptionAPI.updatePaymentMethod({
      cardNumber: '1234567890123456',
      expiryDate: '12/25',
      cvv: '123'
    }) },

    // Financial Analytics
    { category: 'analytics', name: 'Get Profit Analysis', method: 'GET', endpoint: '/financial-analytics/profit-analysis', test: () => financialAnalyticsAPI.getProfitAnalysis() },

    // Performance Analytics
    { category: 'analytics', name: 'Get Performance Dashboard', method: 'GET', endpoint: '/analytics/dashboard/', test: () => performanceAnalyticsAPI.getDashboard() },
    { category: 'analytics', name: 'Get Client Growth', method: 'GET', endpoint: '/analytics/client-growth/', test: () => performanceAnalyticsAPI.getClientGrowth() },
    { category: 'analytics', name: 'Get Performance Earnings', method: 'GET', endpoint: '/analytics/client-growth/', test: () => performanceAnalyticsAPI.getEarnings() },
    { category: 'analytics', name: 'Get Service Performance', method: 'GET', endpoint: '/analytics/client-growth/', test: () => performanceAnalyticsAPI.getServicePerformance() },
    { category: 'analytics', name: 'Get Performance Insights', method: 'GET', endpoint: '/analytics/client-growth/', test: () => performanceAnalyticsAPI.getInsights() },
    { category: 'analytics', name: 'Get Analytics', method: 'GET', endpoint: '/analytics/', test: () => performanceAnalyticsAPI.getAnalytics() },
    { category: 'analytics', name: 'Get Monthly Trends', method: 'GET', endpoint: '/analytics/', test: () => performanceAnalyticsAPI.getMonthlyTrends() },
    { category: 'analytics', name: 'Get Top Performing Services', method: 'GET', endpoint: '/analytics/', test: () => performanceAnalyticsAPI.getTopPerformingServices() },
    { category: 'analytics', name: 'Get Report', method: 'GET', endpoint: '/analytics/', test: () => performanceAnalyticsAPI.getReport() },

    // Availability
    { category: 'availability', name: 'Get All Availability', method: 'GET', endpoint: '/service-requests/', test: () => availabilityAPI.getAll() },
    { category: 'availability', name: 'Get Availability by ID', method: 'GET', endpoint: '/service-requests/:id', test: () => availabilityAPI.getById('test-id') },
    { category: 'availability', name: 'Find Available Vendors', method: 'GET', endpoint: '/service-requests/vendors/available', test: () => availabilityAPI.findAvailableVendors() },
    { category: 'availability', name: 'Get Availability Stats', method: 'GET', endpoint: '/service-requests/stats', test: () => availabilityAPI.getStats() },

    // Payments
    { category: 'payments', name: 'Get All Payments', method: 'GET', endpoint: '/payments/', test: () => paymentsAPI.getAll() },
    { category: 'payments', name: 'Delete Payment by ID', method: 'DELETE', endpoint: '/payments/:id', test: () => paymentsAPI.deleteById('test-id') },
    { category: 'payments', name: 'Create Payment Account', method: 'POST', endpoint: '/payments/', test: () => paymentsAPI.createAccount({
      accountType: 'bank',
      accountNumber: '1234567890'
    }) },

    // Travel (Placeholder)
    { category: 'travel', name: 'Get All Travel', method: 'GET', endpoint: '/travel/', test: () => travelAPI.getAll() },
    { category: 'travel', name: 'Get Travel by ID', method: 'GET', endpoint: '/travel/:id', test: () => travelAPI.getById('test-id') },
    { category: 'travel', name: 'Create Travel', method: 'POST', endpoint: '/travel/', test: () => travelAPI.create({
      destination: 'Lagos',
      date: '2024-12-31'
    }) },
    { category: 'travel', name: 'Update Travel', method: 'PATCH', endpoint: '/travel/:id', test: () => travelAPI.update('test-id', {
      destination: 'Abuja'
    }) },
    { category: 'travel', name: 'Delete Travel', method: 'DELETE', endpoint: '/travel/:id', test: () => travelAPI.delete('test-id') },

    // Customers
    { category: 'customers', name: 'Get All Customers', method: 'GET', endpoint: '/customers/', test: () => customerAPI.getAll() },
    { category: 'customers', name: 'Get Customer by ID', method: 'GET', endpoint: '/customers/:id', test: () => customerAPI.getById('test-id') },
    { category: 'customers', name: 'Create Customer', method: 'POST', endpoint: '/customers/', test: () => customerAPI.create({
      name: 'Test Customer',
      email: 'test@example.com'
    }) },
    { category: 'customers', name: 'Update Customer', method: 'PATCH', endpoint: '/customers/:id', test: () => customerAPI.update('test-id', {
      name: 'Updated Customer'
    }) },
    { category: 'customers', name: 'Delete Customer', method: 'DELETE', endpoint: '/customers/:id', test: () => customerAPI.delete('test-id') },

    // Vendor Service Requests
    { category: 'service-requests', name: 'Get All Vendor Service Requests', method: 'GET', endpoint: '/vendor-service-requests/', test: () => vendorServiceRequestAPI.getAll() },
    { category: 'service-requests', name: 'Get My Vendor Service Requests', method: 'GET', endpoint: '/vendor-service-requests/my', test: () => vendorServiceRequestAPI.getMy() },
    { category: 'service-requests', name: 'Get Received Vendor Service Requests', method: 'GET', endpoint: '/vendor-service-requests/received', test: () => vendorServiceRequestAPI.getReceived() },
    { category: 'service-requests', name: 'Get Pending Vendor Service Requests', method: 'GET', endpoint: '/vendor-service-requests/pending', test: () => vendorServiceRequestAPI.getPending() },
    { category: 'service-requests', name: 'Get Upcoming Vendor Service Requests', method: 'GET', endpoint: '/vendor-service-requests/upcoming', test: () => vendorServiceRequestAPI.getUpcoming() },
    { category: 'service-requests', name: 'Search Vendor Service Requests', method: 'GET', endpoint: '/vendor-service-requests/search', test: () => vendorServiceRequestAPI.search({ eventType: 'wedding' }) },
    { category: 'service-requests', name: 'Get Vendor Service Request Stats', method: 'GET', endpoint: '/vendor-service-requests/stats', test: () => vendorServiceRequestAPI.getStats() },
    { category: 'service-requests', name: 'Get Vendor Service Request by ID', method: 'GET', endpoint: '/vendor-service-requests/:id', test: () => vendorServiceRequestAPI.getById('test-id') },
    { category: 'service-requests', name: 'Create Vendor Service Request', method: 'POST', endpoint: '/vendor-service-requests/', test: () => vendorServiceRequestAPI.create(new FormData()) },
    { category: 'service-requests', name: 'Update Vendor Service Request', method: 'PATCH', endpoint: '/vendor-service-requests/:id', test: () => vendorServiceRequestAPI.update('test-id', new FormData()) },
    { category: 'service-requests', name: 'Delete Vendor Service Request', method: 'DELETE', endpoint: '/vendor-service-requests/:id', test: () => vendorServiceRequestAPI.delete('test-id') },
    { category: 'service-requests', name: 'Toggle Vendor Service Request Status', method: 'PATCH', endpoint: '/vendor-service-requests/:id/toggle-status', test: () => vendorServiceRequestAPI.toggleStatus('test-id') },
    { category: 'service-requests', name: 'Respond to Vendor Service Request', method: 'PATCH', endpoint: '/vendor-service-requests/:id/respond', test: () => vendorServiceRequestAPI.respond('test-id', {
      response: 'accepted'
    }) },

    // Vendor Responses
    { category: 'service-requests', name: 'Get All Vendor Responses', method: 'GET', endpoint: '/service-requests/vendor-responses/', test: () => vendorResponseAPI.getAll() },
    { category: 'service-requests', name: 'Get Vendor Response by ID', method: 'GET', endpoint: '/service-requests/vendor-responses/:id', test: () => vendorResponseAPI.getById('test-id') },
    { category: 'service-requests', name: 'Create Vendor Response', method: 'POST', endpoint: '/service-requests/vendor-responses/', test: () => vendorResponseAPI.create({
      vendorServiceRequestId: 'test-id',
      responseType: 'accept',
      responseMessage: 'Test response'
    }) },
    { category: 'service-requests', name: 'Update Vendor Response', method: 'PATCH', endpoint: '/service-requests/vendor-responses/:id', test: () => vendorResponseAPI.update('test-id', {
      responseMessage: 'Updated response'
    }) },
    { category: 'service-requests', name: 'Delete Vendor Response', method: 'DELETE', endpoint: '/service-requests/vendor-responses/:id', test: () => vendorResponseAPI.delete('test-id') },
    { category: 'service-requests', name: 'Withdraw Vendor Response', method: 'PATCH', endpoint: '/service-requests/vendor-responses/:id/withdraw', test: () => vendorResponseAPI.withdraw('test-id') },
    { category: 'service-requests', name: 'Get Vendor Response History', method: 'GET', endpoint: '/service-requests/vendor-responses/history', test: () => vendorResponseAPI.getHistory() },
    { category: 'service-requests', name: 'Get Vendor Response Stats', method: 'GET', endpoint: '/service-requests/vendor-responses/stats', test: () => vendorResponseAPI.getStats() },

    // Progress Tracking
    { category: 'progress', name: 'Get All Progress Trackers', method: 'GET', endpoint: '/progress-trackers/', test: () => progressTrackerAPI.getAll() },
    { category: 'progress', name: 'Get Progress Tracker Stats', method: 'GET', endpoint: '/progress-trackers/stats', test: () => progressTrackerAPI.getStats() },
    { category: 'progress', name: 'Get Progress Tracker by ID', method: 'GET', endpoint: '/progress-trackers/:id', test: () => progressTrackerAPI.getById('test-id') },
    { category: 'progress', name: 'Create Progress Tracker', method: 'POST', endpoint: '/progress-trackers/', test: () => progressTrackerAPI.create({
      projectName: 'Test Project',
      clientId: 'test-client-id',
      startDate: '2024-12-31',
      endDate: '2025-01-31',
      description: 'Test description',
      status: 'not-started'
    }) },
    { category: 'progress', name: 'Update Progress Tracker', method: 'PUT', endpoint: '/progress-trackers/:id', test: () => progressTrackerAPI.update('test-id', {
      projectName: 'Updated Project'
    }) },
    { category: 'progress', name: 'Update Progress Tracker Status', method: 'PATCH', endpoint: '/progress-trackers/:id/status', test: () => progressTrackerAPI.updateStatus('test-id', 'in-progress') },
    { category: 'progress', name: 'Delete Progress Tracker', method: 'DELETE', endpoint: '/progress-trackers/:id', test: () => progressTrackerAPI.delete('test-id') },
    { category: 'progress', name: 'Create Deliverable', method: 'POST', endpoint: '/progress-trackers/:id/deliverables', test: () => progressTrackerAPI.createDeliverable('test-id', {
      title: 'Test Deliverable',
      description: 'Test description',
      dueDate: '2024-12-31',
      status: 'pending'
    }) },
    { category: 'progress', name: 'Update Deliverable', method: 'PUT', endpoint: '/progress-trackers/deliverables/:id', test: () => progressTrackerAPI.updateDeliverable('test-id', {
      title: 'Updated Deliverable'
    }) },
    { category: 'progress', name: 'Update Deliverable Status', method: 'PATCH', endpoint: '/progress-trackers/deliverables/:id/status', test: () => progressTrackerAPI.updateDeliverableStatus('test-id', 'completed') },
    { category: 'progress', name: 'Delete Deliverable', method: 'DELETE', endpoint: '/progress-trackers/deliverables/:id', test: () => progressTrackerAPI.deleteDeliverable('test-id') },

    // Ratings & Reviews
    { category: 'ratings', name: 'Get All Ratings', method: 'GET', endpoint: '/ratings/', test: () => ratingAPI.getAll() },
    { category: 'ratings', name: 'Get Rating by ID', method: 'GET', endpoint: '/ratings/:id', test: () => ratingAPI.getById('test-id') },
    { category: 'ratings', name: 'Get Ratings by Reviewer', method: 'GET', endpoint: '/ratings/reviewer/:id', test: () => ratingAPI.getByReviewer('test-id') },
    { category: 'ratings', name: 'Get Ratings by Reviewee', method: 'GET', endpoint: '/ratings/reviewee/:id', test: () => ratingAPI.getByReviewee('test-id') },
    { category: 'ratings', name: 'Get Rating Stats', method: 'GET', endpoint: '/ratings/stats/:id', test: () => ratingAPI.getStats('test-id') },
    { category: 'ratings', name: 'Get My Ratings', method: 'GET', endpoint: '/ratings/my/ratings', test: () => ratingAPI.getMy() },
    { category: 'ratings', name: 'Create Rating', method: 'POST', endpoint: '/ratings/', test: () => ratingAPI.create(new FormData()) },
    { category: 'ratings', name: 'Update Rating', method: 'PATCH', endpoint: '/ratings/:id', test: () => ratingAPI.update('test-id', new FormData()) },
    { category: 'ratings', name: 'Delete Rating', method: 'DELETE', endpoint: '/ratings/:id', test: () => ratingAPI.delete('test-id') },

    // Messaging
    { category: 'messaging', name: 'Send Message', method: 'POST', endpoint: '/message/', test: () => messageAPI.send({
      recipientId: 'test-recipient-id',
      message: 'Test message',
      messageType: 'text'
    }) },
    { category: 'messaging', name: 'Get Conversation', method: 'GET', endpoint: '/message/conversation', test: () => messageAPI.getConversation('test-recipient-id') },
    { category: 'messaging', name: 'Mark Message as Read', method: 'PATCH', endpoint: '/message/read', test: () => messageAPI.markAsRead('test-message-id') },
    { category: 'messaging', name: 'Get Unread Count', method: 'GET', endpoint: '/message/unread', test: () => messageAPI.unreadCount() },
    { category: 'messaging', name: 'Get Conversations', method: 'GET', endpoint: '/message/conversations', test: () => messageAPI.getConversations() },
    { category: 'messaging', name: 'Get Message Stats', method: 'GET', endpoint: '/message/conversation/stats', test: () => messageAPI.getStats() },
    { category: 'messaging', name: 'Check Conversation Exists', method: 'GET', endpoint: '/message/conversation/exists', test: () => messageAPI.conversationExists('test-recipient-id') },
    { category: 'messaging', name: 'Get Latest Message', method: 'GET', endpoint: '/message/conversation/latest', test: () => messageAPI.latestMessage('test-recipient-id') },
    { category: 'messaging', name: 'Mark Bulk Messages as Read', method: 'PATCH', endpoint: '/message/read/bulk', test: () => messageAPI.markBulkAsRead(['test-message-id']) },
    { category: 'messaging', name: 'Mark Conversation as Read', method: 'PATCH', endpoint: '/message/conversation/read', test: () => messageAPI.markConversationAsRead('test-recipient-id') },
    { category: 'messaging', name: 'Get Online Status', method: 'GET', endpoint: '/message/online-status', test: () => messageAPI.getOnlineStatus('test-user-id') },
    { category: 'messaging', name: 'Search Messages', method: 'GET', endpoint: '/message/search', test: () => messageAPI.search({ q: 'test' }) },
    { category: 'messaging', name: 'Edit Message', method: 'PATCH', endpoint: '/message/edit', test: () => messageAPI.edit('test-message-id', 'Updated message') },
    { category: 'messaging', name: 'Delete Message', method: 'DELETE', endpoint: '/message/delete', test: () => messageAPI.delete('test-message-id') },
    { category: 'messaging', name: 'Get Message by ID', method: 'GET', endpoint: '/message/:id', test: () => messageAPI.getById('test-message-id') },
    { category: 'messaging', name: 'Get Message Health', method: 'GET', endpoint: '/message/health', test: () => messageAPI.health() }
  ]

  const runTest = async (test: any) => {
    const startTime = Date.now()
    const result: TestResult = {
      endpoint: test.endpoint,
      method: test.method,
      status: 'pending'
    }

    setResults(prev => [...prev, result])

    try {
      const response = await test.test()
      const duration = Date.now() - startTime
      
      setResults(prev => prev.map(r => 
        r.endpoint === test.endpoint && r.method === test.method 
          ? { ...r, status: 'success', response: response.data, duration }
          : r
      ))
    } catch (error: any) {
      const duration = Date.now() - startTime
      
      setResults(prev => prev.map(r => 
        r.endpoint === test.endpoint && r.method === test.method 
          ? { 
              ...r, 
              status: 'error', 
              error: error.response?.data?.message || error.message || 'Unknown error',
              duration 
            }
          : r
      ))
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setResults([])
    
    const testsToRun = selectedCategory === 'all' 
      ? testEndpoints 
      : testEndpoints.filter(test => test.category === selectedCategory)

    for (const test of testsToRun) {
      await runTest(test)
      // Add a small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setIsRunning(false)
  }

  const runSingleTest = async (test: any) => {
    await runTest(test)
  }

  const clearResults = () => {
    setResults([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  const filteredTests = selectedCategory === 'all' 
    ? testEndpoints 
    : testEndpoints.filter(test => test.category === selectedCategory)

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const pendingCount = results.filter(r => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EventHub API Test Suite</h1>
          <p className="text-gray-600 mb-6">Test all API endpoints to ensure they&apos;re working correctly</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={clearResults}
                disabled={isRunning}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredTests.length}</div>
              <div className="text-sm text-blue-700">Total Tests</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            <p className="text-gray-600 mt-1">Showing {filteredTests.length} tests for {categories[selectedCategory as keyof typeof categories]}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response/Error</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test, index) => {
                  const result = results.find(r => r.endpoint === test.endpoint && r.method === test.method)
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result?.status || 'pending')}`}>
                          {getStatusIcon(result?.status || 'pending')} {result?.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          test.method === 'GET' ? 'bg-green-100 text-green-800' :
                          test.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          test.method === 'PATCH' ? 'bg-yellow-100 text-yellow-800' :
                          test.method === 'PUT' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {test.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {test.endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result?.duration ? `${result.duration}ms` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {result?.response ? (
                          <span className="text-green-600">Success</span>
                        ) : result?.error ? (
                          <span className="text-red-600" title={result.error}>{result.error}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => runSingleTest(test)}
                          disabled={isRunning}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Run Test
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}