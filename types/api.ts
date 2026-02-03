// Base API Response Types
export interface ApiResponse<T = any> {
  message: string
  data: T
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextCursor?: string
  previousCursor?: string
}

export interface ApiError {
  message: string
  httpCode: number
  errorType: string
  details?: Record<string, string>
}

// User Types
export interface User {
  id: string
  firstName?: string
  lastName?: string
  businessName?: string
  businessAddress?: string
  businessEmail?: string
  email: string
  phoneNumber?: string
  accountType: 'client' | 'individual' | 'business' | 'vendor' | 'admin'
  isEmailVerified: boolean
  displayName?: string
  createdAt: string
  updatedAt: string
}

export interface RegisterRequest {
  firstName?: string
  lastName?: string
  businessName?: string
  businessAddress?: string
  businessEmail?: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  accountType: 'individual' | 'business' | 'vendor'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken?: string
  refreshToken?: string
  user?: User
  // For registration response
  message?: string
  data?: {
    message: string
    data: {
      id: string
      email: string
    }
  }
}

export interface PasswordResetRequest {
  email: string
}

export interface ValidateCodeRequest {
  code: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RevokeRefreshTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  userId: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
  confirmPassword: string
}

// Profile Types
export interface Profile {
  id: string
  userId: string
  displayPicture?: string
  bio?: string
  city?: string
  country?: string
  skills?: string[]
  gender?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProfileRequest {
  displayPicture?: File
  bio?: string
  city?: string
  country?: string
  skills?: string[]
  gender?: string
}

export interface UpdateProfileRequest {
  bio?: string
  city?: string
  country?: string
  skills?: string[]
  gender?: string
}

export interface UpdateProfilePictureRequest {
  displayPicture: File
}

// Portfolio Types
export interface Portfolio {
  id: string
  userId: string
  projectTitle: string
  description: string
  mediaUrl: string[]
  createdAt: string
  updatedAt: string
}

export interface CreatePortfolioRequest {
  projectTitle: string
  description: string
  mediaUrl: File[]
}

export interface UpdatePortfolioRequest {
  projectTitle?: string
  description?: string
  mediaUrl?: File[]
}

// Service Offering Types
export interface ServiceOffering {
  id: string
  userId: string
  serviceName: string
  description: string
  categoryIds: string[]
  pricingTitle: string
  price: number
  mediaUrl: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Populated fields from backend
  User?: {
    id: string
    firstName?: string
    lastName?: string
    businessName?: string
    businessAddress?: string
    businessEmail?: string
    email: string
    phoneNumber?: string
    accountType: string
    isVerified?: boolean
  }
  Profile?: {
    id: string
    userId: string
    displayPicture?: string
    bio?: string
    city?: string
    country?: string
    skills?: string[]
    gender?: string
  }
  averageRating?: number
  totalReviews?: number
}

export interface CreateServiceRequest {
  title: string
  description: string
  categoryId: string
  price: number
  duration: string
  mediaUrl: File[]
  isActive: boolean
}

export interface CreateServiceOfferingRequest {
  serviceOfferings: Array<{
    serviceName: string
    description: string
    categoryIds: string[]
    pricingTitle: string
    price: number
  }>
  mediaUrl: File[]
}

export interface UpdateServiceOfferingRequest {
  serviceName?: string
  description?: string
  categoryIds?: string[]
  pricingTitle?: string
  price?: number
  mediaUrl?: File[]
}

// Meeting Types
export interface Meeting {
  id: string
  title: string
  description: string
  frequency: string
  meetingDate: string
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  isRecurring: boolean
  meetingLink?: string
  location?: string
  attendees: Array<{
    email: string
    firstName?: string
    lastName?: string
  }>
  status: 'active' | 'inactive' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateMeetingRequest {
  title: string
  description?: string
  frequency: string
  meetingDate: string
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  isRecurring: boolean
  meetingLink?: string
  location?: string
  attendees: Array<{
    email: string
    firstName?: string
    lastName?: string
  }>
}

export interface UpdateMeetingRequest {
  title?: string
  description?: string
  frequency?: string
  meetingDate?: string
  startTime?: string
  endTime?: string
  startDate?: string
  endDate?: string
  isRecurring?: boolean
  meetingLink?: string
  location?: string
  attendees?: Array<{
    email: string
    firstName?: string
    lastName?: string
  }>
}

export interface MeetingResponse {
  response: 'accepted' | 'declined' | 'tentative'
}

export interface CheckConflictsRequest {
  meetingDate: string
  startTime: string
  endTime: string
  attendees: string[]
}

// Service Request Types
export interface ServiceRequest {
  id: string
  eventTitle: string
  eventType: string
  eventStartDate: string
  eventEndDate: string
  eventLocation: string
  eventCity: string
  servicesNeeded: string[]
  numberOfGuests: number
  budgetRange: string
  images: string[]
  additionalInformation?: string
  needsEventPlanner: boolean
  needsAISuggestions: boolean
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateServiceRequestData {
  eventTitle: string
  eventType: string
  eventStartDate: string
  eventEndDate: string
  eventLocation: string
  eventCity: string
  servicesNeeded: string[]
  numberOfGuests: number
  budgetRange: string
  images: File[]
  additionalInformation?: string
  needsEventPlanner: boolean
  needsAISuggestions: boolean
}

// Vendor Service Request Types
export interface VendorServiceRequest extends ServiceRequest {
  vendorId: string
}

export interface CreateVendorServiceRequestData extends CreateServiceRequestData {
  vendorId: string
}

// Bid Types
export interface Bid {
  id: string
  serviceRequestId: string
  vendorId: string
  bidAmount: number
  startDate: string
  endDate: string
  proposedDetails: string
  additionalServices: string[]
  images: string[]
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  createdAt: string
  updatedAt: string
}

export interface CreateBidRequest {
  serviceRequestId: string
  bidAmount: number
  startDate: string
  endDate: string
  proposedDetails: string
  additionalServices: string[]
  images?: File[]
}

export interface UpdateBidRequest {
  bidAmount?: number
  startDate?: string
  endDate?: string
  proposedDetails?: string
  additionalServices?: string[]
  images?: File[]
}

// Vendor Response Types
export interface VendorResponse {
  id: string
  vendorServiceRequestId: string
  vendorId: string
  responseType: 'accept' | 'reject' | 'counter_offer'
  responseMessage: string
  counterOfferPrice?: number
  counterOfferDeliveryDate?: string
  counterOfferDeliveryTime?: string
  counterOfferSetupHours?: number
  counterOfferMessage?: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  createdAt: string
  updatedAt: string
}

export interface CreateVendorResponseRequest {
  vendorServiceRequestId: string
  responseType: 'accept' | 'reject' | 'counter_offer'
  responseMessage: string
  counterOfferPrice?: number
  counterOfferDeliveryDate?: string
  counterOfferDeliveryTime?: string
  counterOfferSetupHours?: number
  counterOfferMessage?: string
}

// Rating & Review Types
export interface Rating {
  id: string
  reviewerId: string
  revieweeId: string
  rating: number
  review: string
  workRelationshipType: 'meeting' | 'service_request' | 'bid' | 'vendor_service_request'
  workRelationshipId: string
  attachments: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateRatingRequest {
  revieweeId: string
  rating: number
  review: string
  workRelationshipType: 'meeting' | 'service_request' | 'bid' | 'vendor_service_request'
  workRelationshipId: string
  attachments: File[]
}

// Message Types
export interface Message {
  id: string
  senderId: string
  recipientId: string
  message: string
  messageType: 'text' | 'image' | 'file'
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface SendMessageRequest {
  recipientId: string
  message: string
  messageType?: 'text' | 'image' | 'file'
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

// Progress Tracker Types
export interface ProgressTracker {
  id: string
  projectName: string
  clientId: string
  serviceRequestId?: string
  vendorId: string
  startDate: string
  endDate: string
  description: string
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled'
  deliverables: Deliverable[]
  createdAt: string
  updatedAt: string
}

export interface CreateProgressTrackerRequest {
  projectName: string
  clientId: string
  serviceRequestId?: string
  startDate: string
  endDate: string
  description: string
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled'
}

export interface Deliverable {
  id: string
  progressTrackerId: string
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  createdAt: string
  updatedAt: string
}

export interface CreateDeliverableRequest {
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
}

// Category Types
export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  isActive: boolean
  subcategories?: Category[]
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
  parentId?: string
  isActive: boolean
}

// Search and Filter Types
export interface SearchParams {
  q?: string
  location?: string
  budget?: string
  category?: string
  page?: number
  limit?: number
  cursor?: string
  sortBy?: 'createdAt' | 'price' | 'rating' | 'popularity' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface ServiceRequestSearchParams extends SearchParams {
  eventType?: string
  servicesNeeded?: string[]
  needsEventPlanner?: boolean
}

// Statistics Types
export interface MeetingStats {
  totalMeetings: number
  upcomingMeetings: number
  completedMeetings: number
  cancelledMeetings: number
}

export interface ServiceRequestStats {
  totalRequests: number
  openRequests: number
  inProgressRequests: number
  completedRequests: number
  cancelledRequests: number
}

export interface BidStats {
  totalBids: number
  pendingBids: number
  acceptedBids: number
  rejectedBids: number
  withdrawnBids: number
}

export interface VendorResponseStats {
  totalResponses: number
  acceptedResponses: number
  rejectedResponses: number
  counterOffers: number
  pendingResponses: number
}

export interface ProgressTrackerStats {
  totalTrackers: number
  notStarted: number
  inProgress: number
  completed: number
  onHold: number
  cancelled: number
}

export interface MessageStats {
  totalMessages: number
  unreadMessages: number
  totalConversations: number
}

export interface RatingStats {
  totalRatings: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface CategoryStats {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  mainCategories: number
  subcategories: number
}

// File Upload Types
export interface FileUploadConfig {
  maxSize: number // in bytes
  allowedTypes: string[]
  maxFiles: number
}

export const FILE_UPLOAD_CONFIGS = {
  profilePicture: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    maxFiles: 1
  },
  portfolioMedia: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
    maxFiles: 5
  },
  serviceMedia: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
    maxFiles: 5
  },
  meetingAttachment: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    maxFiles: 1
  },
  serviceRequestImages: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    maxFiles: 10
  },
  ratingAttachments: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
    maxFiles: 5
  }
} as const

// WebSocket Types
export interface WebSocketMessage {
  type: 'message' | 'notification' | 'status_update'
  data: any
  timestamp: string
}

export interface MessageWebSocketData {
  recipientId: string
  message: string
  messageType?: 'text' | 'image' | 'file'
}

export interface NotificationWebSocketData {
  type: 'new_bid' | 'bid_accepted' | 'new_message' | 'meeting_reminder' | 'rating_received'
  title: string
  message: string
  data?: any
}

// Invoice Types
export interface InvoiceItem {
  description: string
  quantity: number
  amount: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  userId: string
  clientEmail: string
  clientName: string
  dueDate: string
  paymentPattern: 'full_upfront' | 'installment' | 'milestone'
  items: InvoiceItem[]
  subtotal: number
  discount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceRequest {
  clientEmail: string
  clientName: string
  dueDate: string
  paymentPattern: 'full_upfront' | 'installment' | 'milestone'
  items: InvoiceItem[]
  discount?: number
  notes?: string
}

export interface UpdateInvoiceRequest {
  clientEmail?: string
  clientName?: string
  dueDate?: string
  paymentPattern?: 'full_upfront' | 'installment' | 'milestone'
  items?: InvoiceItem[]
  discount?: number
  notes?: string
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
}

export interface InvoiceStats {
  totalInvoices: number
  paidInvoices: number
  pendingInvoices: number
  overdueInvoices: number
  totalRevenue: number
  pendingRevenue: number
}

// Earnings Types
export interface Earning {
  id: string
  userId: string
  amount: number
  source: 'service' | 'booking' | 'subscription' | 'other'
  description?: string
  date: string
  invoiceId?: string
  serviceRequestId?: string
  status: 'pending' | 'completed' | 'withdrawn'
  createdAt: string
  updatedAt: string
}

export interface EarningsOverview {
  totalEarnings: number
  pendingEarnings: number
  completedEarnings: number
  withdrawnEarnings: number
  monthlyEarnings: number
  yearlyEarnings: number
}

// Expenses Types
export interface Expense {
  id: string
  userId: string
  category: 'marketing' | 'equipment' | 'supplies' | 'travel' | 'staff' | 'other'
  amount: number
  date: string
  description?: string
  receiptUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseRequest {
  category: 'marketing' | 'equipment' | 'supplies' | 'travel' | 'staff' | 'other'
  amount: number
  date: string
  description?: string
  receiptUrl?: string
}

export interface ExpensesOverview {
  totalExpenses: number
  monthlyExpenses: number
  yearlyExpenses: number
  expensesByCategory: Record<string, number>
}

// Teams & Roles Types
export interface Team {
  id: string
  name: string
  description?: string
  vendorId: string
  vendor?: {
    id: string
    firstName: string
    lastName: string
    businessName: string
    email: string
  }
  memberCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId?: string
  email: string
  phoneNumber: string
  role: 'admin' | 'manager' | 'support' | 'coordinator' | 'assistant'
  status: 'pending' | 'active' | 'inactive'
  invitedBy: string
  joinedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTeamRequest {
  name: string
  description?: string
}

export interface UpdateTeamRequest {
  name?: string
  description?: string
  isActive?: boolean
}

export interface InviteTeamMemberRequest {
  teamId: string
  email: string
  phoneNumber: string
  role: 'admin' | 'manager' | 'support' | 'coordinator' | 'assistant'
}

export interface TeamStats {
  totalTeams: number
  activeTeams: number
  totalMembers: number
  activeMembers: number
  pendingInvitations: number
}

// Financial Analytics Types
export interface ProfitAnalysis {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  monthlyTrends: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
  categoryBreakdown: Array<{
    category: string
    revenue: number
    expenses: number
    profit: number
  }>
}

// Performance Analytics Types
export interface PerformanceDashboard {
  totalClients: number
  activeClients: number
  newClientsThisMonth: number
  clientGrowthRate: number
  totalEarnings: number
  monthlyEarnings: number
  topServices: Array<{
    serviceName: string
    bookings: number
    revenue: number
  }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export interface ClientGrowth {
  totalClients: number
  newClients: number
  returningClients: number
  clientRetentionRate: number
  growthByMonth: Array<{
    month: string
    newClients: number
    totalClients: number
  }>
}

export interface ServicePerformance {
  totalServices: number
  activeServices: number
  topPerformingServices: Array<{
    serviceName: string
    bookings: number
    revenue: number
    rating: number
  }>
  serviceCategories: Array<{
    category: string
    services: number
    bookings: number
    revenue: number
  }>
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'payment_update' | 'new_message' | 'bid_update' | 'new_bid' | 'meeting_reminder' | 'rating_received' | 'system' | string
  title: string
  message: string
  data?: any
  priority: 'low' | 'medium' | 'high'
  channels: string[]
  isRead: boolean
  scheduledAt?: string
  expiresAt?: string
  maxRetries?: number
  createdAt: string
  updatedAt: string
}

export interface CreateNotificationRequest {
  userId: string
  type: string
  title: string
  message: string
  data?: any
  priority?: 'low' | 'medium' | 'high'
  channels?: string[]
  scheduledAt?: string
  expiresAt?: string
  maxRetries?: number
}

export interface NotificationPreferences {
  jobAlerts: boolean
  newJobMatches: boolean
  clientsPostedJob: boolean
  newChatMessage: boolean
  escrowDepositConfirmed: boolean
  paymentReleased: boolean
  refundCancellationNotice: boolean
  inAppNotifications: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  platformPromotions: boolean
  verificationUpdates: boolean
}

export interface NotificationStats {
  totalNotifications: number
  unreadNotifications: number
  notificationsByType: Record<string, number>
  notificationsByPriority: Record<string, number>
}

// Settings Types
export interface UserSettings {
  profileVisibility: 'public' | 'private' | 'contacts-only'
  showContactInfo: boolean
  showPortfolio: boolean
  showReviews: boolean
  showAvailability: boolean
  notificationPreferences: NotificationPreferences
  pinEnabled: boolean
}

export interface GeneralSettings {
  timezone: string
  language: string
  currency: string
}

// Withdrawal/Bank Types
export interface Bank {
  id: string
  name: string
  code: string
  country: string
}

export interface BankAccount {
  id: string
  userId: string
  accountName: string
  accountNumber: string
  bankCode: string
  bankName: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Withdrawal {
  id: string
  userId: string
  bankAccountId: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  reference: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

export interface WithdrawalStats {
  totalWithdrawals: number
  pendingWithdrawals: number
  completedWithdrawals: number
  failedWithdrawals: number
  totalAmount: number
  pendingAmount: number
}

// Availability Types
export interface Availability {
  id: string
  userId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface AvailabilityStats {
  totalSlots: number
  availableSlots: number
  bookedSlots: number
  availabilityRate: number
}

// Receipt Types (matching EventHub design)
export interface ReceiptItem {
  description: string
  quantity: number | string
  amount: number
}

export interface Receipt {
  id: string
  receiptNumber: string
  companyName: string
  companyLogo?: string
  companyTagline?: string
  companyEmail: string
  clientName: string
  clientEmail: string
  issuedDate: string
  paidDate: string
  items: ReceiptItem[]
  subtotal: number
  discount: number
  discountPercentage?: number
  total: number
  status: 'paid' | 'pending' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateReceiptRequest {
  clientName: string
  clientEmail: string
  items: ReceiptItem[]
  subtotal: number
  discount?: number
  discountPercentage?: number
  notes?: string
}

export interface ReceiptStats {
  totalReceipts: number
  paidReceipts: number
  pendingReceipts: number
  cancelledReceipts: number
  totalRevenue: number
  pendingRevenue: number
}