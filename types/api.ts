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
  accountType: 'individual' | 'business' | 'vendor' | 'admin'
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
  accessToken: string
  refreshToken: string
  user: User
}

export interface PasswordResetRequest {
  email: string
}

export interface ValidateCodeRequest {
  email: string
  code: string
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
  location?: string
  website?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateProfileRequest {
  displayPicture?: File
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
}

// Portfolio Types
export interface Portfolio {
  id: string
  userId: string
  title: string
  description: string
  categoryId: string
  mediaUrl: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CreatePortfolioRequest {
  title: string
  description: string
  categoryId: string
  mediaUrl: File[]
  tags: string[]
}

// Service Offering Types
export interface ServiceOffering {
  id: string
  userId: string
  title: string
  description: string
  categoryId: string
  price: number
  duration: string
  mediaUrl: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
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

// Meeting Types
export interface Meeting {
  id: string
  title: string
  description: string
  meetingDate: string
  startTime: string
  endTime: string
  attendees: string[]
  meetingType: 'video' | 'phone' | 'in-person'
  location?: string
  meetingLink?: string
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'monthly'
  recurrenceEndDate?: string
  attachment?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateMeetingRequest {
  title: string
  description: string
  meetingDate: string
  startTime: string
  endTime: string
  attendees: string[]
  meetingType: 'video' | 'phone' | 'in-person'
  location?: string
  meetingLink?: string
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'monthly'
  recurrenceEndDate?: string
  attachment?: File
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
  images: File[]
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
