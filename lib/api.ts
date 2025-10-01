import axios from 'axios'
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  PasswordResetRequest,
  ValidateCodeRequest,
  ResetPasswordRequest,
  CreateProfileRequest,
  CreatePortfolioRequest,
  CreateServiceRequest,
  CreateMeetingRequest,
  MeetingResponse,
  CheckConflictsRequest,
  CreateServiceRequestData,
  CreateVendorServiceRequestData,
  CreateBidRequest,
  CreateVendorResponseRequest,
  CreateRatingRequest,
  SendMessageRequest,
  CreateProgressTrackerRequest,
  CreateDeliverableRequest,
  CreateCategoryRequest,
  SearchParams,
  ServiceRequestSearchParams,
  ApiResponse,
  User,
  Profile,
  Portfolio,
  ServiceOffering,
  Meeting,
  ServiceRequest,
  VendorServiceRequest,
  Bid,
  VendorResponse,
  Rating,
  Message,
  Conversation,
  ProgressTracker,
  Deliverable,
  Category,
  MeetingStats,
  ServiceRequestStats,
  BidStats,
  VendorResponseStats,
  ProgressTrackerStats,
  MessageStats,
  RatingStats,
  CategoryStats
} from '@/types/api'

const API_BASE_URL = 'https://backend-a3nd.onrender.com/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token helpers
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

const setAuthHeader = (config: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('API: Setting Authorization header:', `Bearer ${token.substring(0, 20)}...`)
  } else {
    console.log('API: No token found for request to:', config.url)
  }
  return config
}

// Request interceptor to add auth token
api.interceptors.request.use((config) => setAuthHeader(config))

// Attempt token refresh
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null
  if (!refreshToken) return null

  try {
    const res = await api.post('/auth/refresh-token', undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    const newAccessToken: string | undefined = res?.data?.accessToken || res?.data?.data?.accessToken
    if (newAccessToken && typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
    }
    return newAccessToken || null
  } catch (e) {
    return null
  }
}

// Response interceptor for 401 -> refresh -> retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status

    if (status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            } else {
              reject(error)
            }
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      const newToken = await refreshAccessToken()
      isRefreshing = false

      pendingRequests.forEach((cb) => cb(newToken))
      pendingRequests = []

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          window.location.href = '/auth/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// Authentication & User Management API
export const authAPI = {
  // Registration
  register: (userData: RegisterRequest) => api.post<ApiResponse<AuthResponse>>('/auth/register', userData),
  
  // Email Verification
  verifyEmail: (email: string, verificationCode: string) => api.post<ApiResponse>('/auth/verify-email', { email, verificationCode }),
  resendVerificationCode: (email: string) => api.post<ApiResponse>('/auth/resend-verification', { email }),
  
  // Login
  login: (loginData: LoginRequest) => api.post<ApiResponse<AuthResponse>>('/auth/login', loginData),
  
  // Token Management
  refresh: () => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null
    return api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token', undefined, {
      headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}
    })
  },
  logout: () => api.post<ApiResponse>('/auth/logout'),
  
  // User Information
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  getById: (id: string) => api.get<ApiResponse<User>>(`/auth/${id}`),
  getAll: (params?: SearchParams) => api.get<ApiResponse<User[]>>('/auth/', { params }),
  update: (id: string, data: Partial<User>) => api.patch<ApiResponse<User>>(`/auth/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/auth/${id}`),
  
  // Password Reset
  resetPassword: (data: PasswordResetRequest) => api.post<ApiResponse>('/password/reset', data),
  validateCode: (data: ValidateCodeRequest) => api.post<ApiResponse>('/password/validate-code', data),
  resetPasswordConfirm: (data: ResetPasswordRequest) => api.post<ApiResponse>('/password/reset-password', data),
}

// Profile Management API
export const profileAPI = {
  create: (data: FormData) => api.post<ApiResponse<Profile>>('/profile/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  me: () => api.get<ApiResponse<Profile>>('/profile/me'),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Profile[]>>('/profile/all', { params }),
  getById: (id: string) => api.get<ApiResponse<Profile>>(`/profile/${id}`),
  update: (id: string, data: FormData) => api.patch<ApiResponse<Profile>>(`/profile/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateDisplayPicture: (userId: string, data: FormData) => api.patch<ApiResponse<Profile>>(`/profile/${userId}/display-picture`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeDisplayPicture: (userId: string) => api.delete<ApiResponse>(`/profile/${userId}/display-picture`),
  delete: (userId: string) => api.delete<ApiResponse>(`/profile/${userId}`),
}

// Portfolio Management API (Vendors Only)
export const portfolioAPI = {
  create: (data: FormData) => api.post<ApiResponse<Portfolio>>('/portfolio/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Portfolio[]>>('/portfolio/all', { params }),
  getById: (id: string) => api.get<ApiResponse<Portfolio>>(`/portfolio/${id}`),
  getUserPortfolios: (userId: string) => api.get<ApiResponse<Portfolio[]>>(`/portfolio/user/${userId}`),
  getMyPortfolios: () => api.get<ApiResponse<Portfolio[]>>('/portfolio/user-portfolios'),
  update: (id: string, data: FormData) => api.patch<ApiResponse<Portfolio>>(`/portfolio/single-portfolio/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeMedia: (id: string) => api.delete<ApiResponse>(`/portfolio/${id}/media`),
  delete: (id: string) => api.delete<ApiResponse>(`/portfolio/${id}`),
}

// Service Offerings API (Vendors Only)
export const serviceAPI = {
  create: (data: FormData) => api.post<ApiResponse<ServiceOffering>>('/service/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  myServices: () => api.get<ApiResponse<ServiceOffering[]>>('/service/me'),
  getAll: (params?: SearchParams) => api.get<ApiResponse<ServiceOffering[]>>('/service/', { params }),
  getById: (id: string) => api.get<ApiResponse<ServiceOffering>>(`/service/${id}`),
  userServices: () => api.get<ApiResponse<ServiceOffering[]>>('/service/user-services'),
  update: (id: string, data: FormData) => api.patch<ApiResponse<ServiceOffering>>(`/service/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeMedia: (id: string) => api.delete<ApiResponse>(`/service/${id}/media`),
  delete: (id: string) => api.delete<ApiResponse>(`/service/${id}`),
}

// Meeting Management API
export const meetingAPI = {
  create: (data: FormData) => api.post<ApiResponse<Meeting>>('/meetings/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Meeting[]>>('/meetings/', { params }),
  getMy: () => api.get<ApiResponse<Meeting[]>>('/meetings/my'),
  getAttendances: () => api.get<ApiResponse<Meeting[]>>('/meetings/attendances'),
  getByEmail: (email: string) => api.get<ApiResponse<Meeting[]>>(`/meetings/email/${email}`),
  getById: (id: string) => api.get<ApiResponse<Meeting>>(`/meetings/${id}`),
  update: (id: string, data: FormData) => api.patch<ApiResponse<Meeting>>(`/meetings/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete<ApiResponse>(`/meetings/${id}`),
  getInstances: (id: string) => api.get<ApiResponse<Meeting[]>>(`/meetings/${id}/instances`),
  toggleStatus: (id: string) => api.patch<ApiResponse<Meeting>>(`/meetings/${id}/toggle-status`),
  respond: (meetingId: string, attendeeId: string, response: MeetingResponse) => api.post<ApiResponse>(`/meetings/${meetingId}/attendees/${attendeeId}/respond`, response),
  getStats: () => api.get<ApiResponse<MeetingStats>>('/meetings/stats'),
  getUpcoming: () => api.get<ApiResponse<Meeting[]>>('/meetings/upcoming'),
  checkConflicts: (data: CheckConflictsRequest) => api.post<ApiResponse<{ hasConflicts: boolean; conflicts: Meeting[] }>>('/meetings/check-conflicts', data),
}

// Service Requests API
export const serviceRequestAPI = {
  create: (data: FormData) => api.post<ApiResponse<ServiceRequest>>('/service-requests/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: ServiceRequestSearchParams) => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/', { params }),
  getMy: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/my'),
  getAssigned: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/assigned'),
  getOpen: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/open'),
  getUpcoming: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/upcoming'),
  search: (params: ServiceRequestSearchParams) => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/search', { params }),
  getStats: () => api.get<ApiResponse<ServiceRequestStats>>('/service-requests/stats'),
  getById: (id: string) => api.get<ApiResponse<ServiceRequest>>(`/service-requests/${id}`),
  update: (id: string, data: FormData) => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete<ApiResponse>(`/service-requests/${id}`),
  toggleStatus: (id: string) => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/toggle-status`),
  assignPlanner: (id: string, plannerId: string) => api.post<ApiResponse<ServiceRequest>>(`/service-requests/${id}/assign-planner`, { plannerId }),
  updateStatus: (id: string, status: 'open' | 'in-progress' | 'completed' | 'cancelled') => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/update-status`, { status }),
}

// Vendor Service Requests API
export const vendorServiceRequestAPI = {
  create: (data: FormData) => api.post<ApiResponse<VendorServiceRequest>>('/vendor-service-requests/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: SearchParams) => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/', { params }),
  getMy: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/my'),
  getReceived: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/received'),
  getPending: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/pending'),
  getUpcoming: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/upcoming'),
  search: (params: ServiceRequestSearchParams) => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/search', { params }),
  getStats: () => api.get<ApiResponse<ServiceRequestStats>>('/vendor-service-requests/stats'),
  getById: (id: string) => api.get<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}`),
  update: (id: string, data: FormData) => api.patch<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete<ApiResponse>(`/vendor-service-requests/${id}`),
  toggleStatus: (id: string) => api.patch<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}/toggle-status`),
  respond: (id: string, response: { response: 'accepted' | 'declined' | 'counter_offer' }) => api.patch<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}/respond`, response),
}

// Bidding System API
export const bidAPI = {
  create: (data: FormData) => api.post<ApiResponse<Bid>>('/bids/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Bid[]>>('/bids/', { params }),
  getWithDetails: (params?: SearchParams) => api.get<ApiResponse<Bid[]>>('/bids/details', { params }),
  getStats: () => api.get<ApiResponse<BidStats>>('/bids/stats'),
  getById: (id: string) => api.get<ApiResponse<Bid>>(`/bids/${id}`),
  update: (id: string, data: Partial<Bid>) => api.put<ApiResponse<Bid>>(`/bids/${id}`, data),
  withdraw: (id: string) => api.patch<ApiResponse<Bid>>(`/bids/${id}/withdraw`),
  delete: (id: string) => api.delete<ApiResponse>(`/bids/${id}`),
  accept: (id: string) => api.patch<ApiResponse<Bid>>(`/bids/requester/${id}/accept`),
  reject: (id: string) => api.patch<ApiResponse<Bid>>(`/bids/requester/${id}/reject`),
}

// Vendor Responses API
export const vendorResponseAPI = {
  create: (data: CreateVendorResponseRequest) => api.post<ApiResponse<VendorResponse>>('/vendor-responses/', data),
  getAll: (params?: SearchParams) => api.get<ApiResponse<VendorResponse[]>>('/vendor-responses/', { params }),
  getRequests: (params?: SearchParams) => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-responses/requests', { params }),
  getStats: () => api.get<ApiResponse<VendorResponseStats>>('/vendor-responses/stats'),
  getById: (id: string) => api.get<ApiResponse<VendorResponse>>(`/vendor-responses/${id}`),
  update: (id: string, data: Partial<CreateVendorResponseRequest>) => api.put<ApiResponse<VendorResponse>>(`/vendor-responses/${id}`, data),
  withdraw: (id: string) => api.patch<ApiResponse<VendorResponse>>(`/vendor-responses/${id}/withdraw`),
  delete: (id: string) => api.delete<ApiResponse>(`/vendor-responses/${id}`),
}

// Rating & Reviews API
export const ratingAPI = {
  create: (data: FormData) => api.post<ApiResponse<Rating>>('/ratings/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getById: (id: string) => api.get<ApiResponse<Rating>>(`/ratings/${id}`),
  update: (id: string, data: FormData) => api.patch<ApiResponse<Rating>>(`/ratings/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete<ApiResponse>(`/ratings/${id}`),
  getByReviewer: (userId: string) => api.get<ApiResponse<Rating[]>>(`/ratings/reviewer/${userId}`),
  getByReviewee: (userId: string) => api.get<ApiResponse<Rating[]>>(`/ratings/reviewee/${userId}`),
  getStats: (userId: string) => api.get<ApiResponse<RatingStats>>(`/ratings/stats/${userId}`),
  getMy: () => api.get<ApiResponse<Rating[]>>('/ratings/my/ratings'),
}

// Messaging System API
export const messageAPI = {
  send: (payload: SendMessageRequest) => api.post<ApiResponse<Message>>('/message/', payload),
  getConversation: (recipientId: string, page?: number, limit?: number) => api.get<ApiResponse<Message[]>>('/message/conversation', { params: { recipientId, page, limit } }),
  markAsRead: (messageId: string) => api.patch<ApiResponse>(`/message/read`, { messageId }),
  unreadCount: () => api.get<ApiResponse<{ count: number }>>('/message/unread'),
  getConversations: (page?: number, limit?: number) => api.get<ApiResponse<Conversation[]>>('/message/conversations', { params: { page, limit } }),
  getStats: () => api.get<ApiResponse<MessageStats>>('/message/conversation/stats'),
  conversationExists: (recipientId: string) => api.get<ApiResponse<{ exists: boolean }>>('/message/conversation/exists', { params: { recipientId } }),
  latestMessage: (recipientId: string) => api.get<ApiResponse<Message>>('/message/conversation/latest', { params: { recipientId } }),
  markBulkAsRead: (messageIds: string[]) => api.patch<ApiResponse>('/message/read/bulk', { messageIds }),
  markConversationAsRead: (recipientId: string) => api.patch<ApiResponse>('/message/conversation/read', { recipientId }),
  getOnlineStatus: (userId: string) => api.get<ApiResponse<{ isOnline: boolean; lastSeen?: string }>>('/message/online-status', { params: { userId } }),
  search: (params: { q: string; page?: number; limit?: number }) => api.get<ApiResponse<Message[]>>('/message/search', { params }),
  edit: (messageId: string, message: string) => api.patch<ApiResponse<Message>>('/message/edit', { messageId, message }),
  delete: (messageId: string) => api.delete<ApiResponse>('/message/delete', { data: { messageId } }),
  getById: (messageId: string) => api.get<ApiResponse<Message>>(`/message/${messageId}`),
  health: () => api.get<ApiResponse<{ status: string }>>('/message/health'),
}

// Progress Tracking API
export const progressTrackerAPI = {
  create: (data: CreateProgressTrackerRequest) => api.post<ApiResponse<ProgressTracker>>('/progress-trackers/', data),
  getAll: (params?: SearchParams) => api.get<ApiResponse<ProgressTracker[]>>('/progress-trackers/', { params }),
  getStats: () => api.get<ApiResponse<ProgressTrackerStats>>('/progress-trackers/stats'),
  getById: (id: string) => api.get<ApiResponse<ProgressTracker>>(`/progress-trackers/${id}`),
  update: (id: string, data: Partial<CreateProgressTrackerRequest>) => api.put<ApiResponse<ProgressTracker>>(`/progress-trackers/${id}`, data),
  updateStatus: (id: string, status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled') => api.patch<ApiResponse<ProgressTracker>>(`/progress-trackers/${id}/status`, { status }),
  delete: (id: string) => api.delete<ApiResponse>(`/progress-trackers/${id}`),
  
  // Deliverables
  createDeliverable: (progressTrackerId: string, data: CreateDeliverableRequest) => api.post<ApiResponse<Deliverable>>(`/progress-trackers/${progressTrackerId}/deliverables`, data),
  updateDeliverable: (id: string, data: Partial<CreateDeliverableRequest>) => api.put<ApiResponse<Deliverable>>(`/progress-trackers/deliverables/${id}`, data),
  updateDeliverableStatus: (id: string, status: 'pending' | 'in-progress' | 'completed' | 'overdue') => api.patch<ApiResponse<Deliverable>>(`/progress-trackers/deliverables/${id}/status`, { status }),
  deleteDeliverable: (id: string) => api.delete<ApiResponse>(`/progress-trackers/deliverables/${id}`),
}

// Category Management API
export const categoryAPI = {
  create: (data: CreateCategoryRequest) => api.post<ApiResponse<Category>>('/categories/', data),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Category[]>>('/categories/', { params }),
  getStats: () => api.get<ApiResponse<CategoryStats>>('/categories/stats'),
  update: (id: string, data: Partial<CreateCategoryRequest>) => api.patch<ApiResponse<Category>>(`/categories/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/categories/${id}`),
  toggleStatus: (id: string) => api.patch<ApiResponse<Category>>(`/categories/${id}/toggle-status`),
  getHierarchy: () => api.get<ApiResponse<Category[]>>('/categories/hierarchy'),
  getMain: () => api.get<ApiResponse<Category[]>>('/categories/main'),
  getById: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`),
  getSubcategories: (parentId: string) => api.get<ApiResponse<Category[]>>(`/categories/${parentId}/subcategories`),
}

// Additional missing endpoints from documentation

// Resend Verification Code (missing from authAPI)
authAPI.resendVerificationCode = (email: string) => api.post<ApiResponse>('/auth/resend-verification', { email })

// Profile API - missing endpoints
profileAPI.getAll = (params?: SearchParams) => api.get<ApiResponse<Profile[]>>('/profile/all', { params })
profileAPI.getById = (id: string) => api.get<ApiResponse<Profile>>(`/profile/${id}`)
profileAPI.updateDisplayPicture = (userId: string, data: FormData) => api.patch<ApiResponse<Profile>>(`/profile/${userId}/display-picture`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
profileAPI.removeDisplayPicture = (userId: string) => api.delete<ApiResponse>(`/profile/${userId}/display-picture`)
profileAPI.delete = (userId: string) => api.delete<ApiResponse>(`/profile/${userId}`)

export default api