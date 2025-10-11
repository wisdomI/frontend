import axios from 'axios'
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  PasswordResetRequest,
  ValidateCodeRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  RefreshTokenRequest,
  RevokeRefreshTokenRequest,
  LogoutRequest,
  CreateProfileRequest,
  UpdateProfileRequest,
  UpdateProfilePictureRequest,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  CreateServiceOfferingRequest,
  UpdateServiceOfferingRequest,
  CreateServiceRequest,
  CreateMeetingRequest,
  UpdateMeetingRequest,
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
  CategoryStats,
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceStats,
  Earning,
  EarningsOverview,
  Expense,
  CreateExpenseRequest,
  ExpensesOverview,
  Team,
  TeamMember,
  CreateTeamRequest,
  UpdateTeamRequest,
  InviteTeamMemberRequest,
  TeamStats
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

const setAuthHeader = async (config: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null
  if (token) {
    // Check if token is expired or about to expire
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      const expiresIn = payload.exp - now
      
      if (payload.exp && payload.exp < now) {
        console.log('⚠️ Token is EXPIRED, attempting refresh before request...')
        
        // Try to refresh before making the request
        if (!isRefreshing) {
          isRefreshing = true
          const newToken = await refreshAccessToken()
          isRefreshing = false
          
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`
            console.log('✅ Token refreshed proactively, using new token')
            return config
          } else {
            console.log('❌ Proactive refresh failed, request will likely fail')
            localStorage.removeItem(ACCESS_TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
          }
        }
      } else if (expiresIn < 60) {
        // Token expires in less than 60 seconds, refresh proactively
        console.log(`⏰ Token expires in ${expiresIn}s, refreshing proactively...`)
        
        if (!isRefreshing) {
          // Don't wait for refresh, just trigger it
          refreshAccessToken().then(newToken => {
            if (newToken) {
              console.log('✅ Proactive token refresh complete')
            }
          })
        }
      }
    } catch (e) {
      console.log('⚠️ Could not decode token for expiry check')
    }
    
    config.headers.Authorization = `Bearer ${token}`
    console.log('API: Setting Authorization header for', config.url)
  } else {
    console.log('API: No token found for request to:', config.url)
  }
  return config
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => setAuthHeader(config),
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Attempt token refresh
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null
  if (!refreshToken) {
    console.log('🔄 Token Refresh: No refresh token found')
    return null
  }

  console.log('🔄 Token Refresh: Attempting to refresh access token...')
  
  try {
    const res = await api.post('/auth/refresh-token', { refreshToken }, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    
    console.log('🔄 Token Refresh: Response received:', res.data)
    
    const newAccessToken: string | undefined = res?.data?.accessToken || res?.data?.data?.accessToken
    if (newAccessToken && typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
      console.log('✅ Token Refresh: Success! New token saved')
    } else {
      console.error('❌ Token Refresh: No access token in response:', res.data)
    }
    return newAccessToken || null
  } catch (e: any) {
    console.error('❌ Token Refresh: Failed with error:', e)
    console.error('❌ Token Refresh: Error details:', {
      message: e.message,
      status: e.response?.status,
      data: e.response?.data,
      code: e.code
    })
    
    // If refresh token is invalid or expired, clear tokens
    if (e.response?.status === 401 || e.response?.status === 403) {
      console.log('🔄 Token Refresh: Refresh token is invalid, clearing all tokens')
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      }
    }
    
    return null
  }
}

// Response interceptor for 401 -> refresh -> retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status

    // Handle 403 errors - could be access control OR expired token
    if (status === 403 && !originalRequest?._retry) {
      // Check if token might be expired
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Math.floor(Date.now() / 1000)
          const isExpired = payload.exp && payload.exp < now
          
          // If token is expired, try to refresh
          if (isExpired) {
            originalRequest._retry = true
            
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

            isRefreshing = true
            const newToken = await refreshAccessToken()
            isRefreshing = false

            pendingRequests.forEach((cb) => cb(newToken))
            pendingRequests = []

            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return api(originalRequest)
            }
          }
        } catch (e) {
          // Token decode failed
        }
      }
    }

    if (status === 401 && !originalRequest?._retry) {
      console.log('🔒 401 Unauthorized: Attempting token refresh for', originalRequest.url)
      
      if (isRefreshing) {
        console.log('🔄 Token refresh already in progress, queueing request...')
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
        console.log('✅ Token refreshed, retrying original request:', originalRequest.url)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } else {
        console.log('❌ Token refresh failed, redirecting to login...')
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          window.location.href = '/auth/login'
        }
      }
    }

    // Log other errors for debugging
    if (status) {
      console.log(`⚠️ API Error ${status}:`, originalRequest.url, error.message)
    }

    return Promise.reject(error)
  }
)

// Authentication & User Management API
export const authAPI = {
  // Registration
  register: (userData: RegisterRequest) => api.post<ApiResponse<AuthResponse>>('/auth/register', userData),
  
  // Email Verification
  verifyEmail: (data: VerifyEmailRequest) => api.post<ApiResponse>('/auth/verify-email', data),
  resendVerificationCode: (data: ResendVerificationRequest) => api.post<ApiResponse>('/auth/resend-verification-code', data),
  
  // Login
  login: (loginData: LoginRequest) => api.post<ApiResponse<AuthResponse>>('/auth/login', loginData),
  
  // Password Reset
  resetPassword: (data: PasswordResetRequest) => api.post<ApiResponse>('/password/reset', data),
  validateResetCode: (data: ValidateCodeRequest) => api.post<ApiResponse>('/password/validate-code', data),
  setNewPassword: (data: ResetPasswordRequest) => api.post<ApiResponse>('/password/reset-password', data),
  
  // Token Management
  refresh: (data: RefreshTokenRequest) => api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token', data),
  revokeRefreshToken: (data: RevokeRefreshTokenRequest) => api.post<ApiResponse>('/auth/revoke-refresh-token', data),
  logout: (data: LogoutRequest) => api.post<ApiResponse>('/auth/logout', data),
  
  // User Information
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  getById: (id: string) => api.get<ApiResponse<User>>(`/auth/${id}`),
  getAll: (params?: SearchParams) => api.get<ApiResponse<User[]>>('/auth/', { params }),
  update: (id: string, data: Partial<User>) => api.patch<ApiResponse<User>>(`/auth/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/auth/${id}`),
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
  getAll: (params?: SearchParams) => api.get<ApiResponse<Portfolio[]>>('/portfolio/', { params }), // Changed from /portfolio/all to /portfolio/
  getById: (id: string) => api.get<ApiResponse<Portfolio>>(`/portfolio/${id}`),
  getUserPortfolios: (userId: string) => api.get<ApiResponse<Portfolio[]>>(`/portfolio/user/${userId}`),
  // getMyPortfolios: Endpoint doesn't exist - removed
  update: (id: string, data: FormData) => api.patch<ApiResponse<Portfolio>>(`/portfolio/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeMedia: (id: string) => api.delete<ApiResponse>(`/portfolio/${id}/media`),
  delete: (id: string) => api.delete<ApiResponse>(`/portfolio/${id}`),
}

// Service Offerings API (Vendors Only)
// Backend confirmed actual route: /api/v1/service/
export const serviceAPI = {
  create: (data: FormData) => api.post<ApiResponse<ServiceOffering>>('/service/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  // GET endpoints - Backend confirmed: /service/me (not /service/my)
  myServices: () => api.get<ApiResponse<ServiceOffering[]>>('/service/me'),
  getAll: (params?: SearchParams) => api.get<ApiResponse<ServiceOffering[]>>('/service/', { params }),
  getById: (id: string) => api.get<ApiResponse<ServiceOffering>>(`/service/${id}`),
  userServices: () => api.get<ApiResponse<ServiceOffering[]>>('/service/user'),
  
  // Update and delete use different route (/service/:id instead of /profile/serviceOffering)
  update: (id: string, data: FormData) => api.patch<ApiResponse<ServiceOffering>>(`/service/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeMedia: (id: string, mediaUrl: string) => api.delete<ApiResponse>(`/service/${id}/media`, { data: { mediaUrl } }),
  delete: (id: string) => api.delete<ApiResponse>(`/service/${id}`),
}

// Meeting Management API
export const meetingAPI = {
  create: (data: CreateMeetingRequest) => api.post<ApiResponse<Meeting>>('/meetings/', data),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Meeting[]>>('/meetings/', { params }),
  getMy: () => api.get<ApiResponse<Meeting[]>>('/meetings/my'),
  getAttendances: () => api.get<ApiResponse<Meeting[]>>('/meetings/attendances'),
  getByEmail: (email: string) => api.get<ApiResponse<Meeting[]>>(`/meetings/email/${email}`),
  getById: (id: string) => api.get<ApiResponse<Meeting>>(`/meetings/${id}`),
  update: (id: string, data: UpdateMeetingRequest) => api.patch<ApiResponse<Meeting>>(`/meetings/${id}`, data),
  toggleStatus: (id: string) => api.patch<ApiResponse<Meeting>>(`/meetings/${id}/toggle-status`),
  getInstances: (id: string) => api.get<ApiResponse<Meeting[]>>(`/meetings/${id}/instances`),
  delete: (id: string) => api.delete<ApiResponse>(`/meetings/${id}`),
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

// Invoice Management API
export const invoiceAPI = {
  create: (data: CreateInvoiceRequest) => api.post<ApiResponse<Invoice>>('/invoices/', data),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Invoice[]>>('/invoices/', { params }),
  getById: (id: string) => api.get<ApiResponse<Invoice>>(`/invoices/${id}`),
  getByNumber: (invoiceNumber: string) => api.get<ApiResponse<Invoice>>(`/invoices/number/${invoiceNumber}`),
  getStats: () => api.get<ApiResponse<InvoiceStats>>('/invoices/stats'),
  update: (id: string, data: UpdateInvoiceRequest) => api.patch<ApiResponse<Invoice>>(`/invoices/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/invoices/${id}`),
  sendToClient: (id: string) => api.post<ApiResponse>(`/invoices/${id}/send`),
  markAsPaid: (id: string) => api.patch<ApiResponse<Invoice>>(`/invoices/${id}/mark-paid`),
  markAsOverdue: (id: string) => api.patch<ApiResponse<Invoice>>(`/invoices/${id}/mark-overdue`),
}

// Earnings API
export const earningsAPI = {
  getOverview: () => api.get<ApiResponse<EarningsOverview>>('/earnings/stats/overview'),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Earning[]>>('/earnings/', { params }),
  getById: (id: string) => api.get<ApiResponse<Earning>>(`/earnings/${id}`),
  getByStatus: (status: 'pending' | 'completed' | 'withdrawn') => api.get<ApiResponse<Earning[]>>(`/earnings/status/${status}`),
  getByDateRange: (startDate: string, endDate: string) => api.get<ApiResponse<Earning[]>>('/earnings/range', { params: { startDate, endDate } }),
  getTotalEarnings: () => api.get<ApiResponse<{ total: number }>>('/earnings/total'),
}

// Expenses API
export const expensesAPI = {
  create: (data: CreateExpenseRequest) => api.post<ApiResponse<Expense>>('/expenses/', data),
  getOverview: () => api.get<ApiResponse<ExpensesOverview>>('/expenses/stats/overview'),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Expense[]>>('/expenses/', { params }),
  getById: (id: string) => api.get<ApiResponse<Expense>>(`/expenses/${id}`),
  getByCategory: (category: string) => api.get<ApiResponse<Expense[]>>(`/expenses/category/${category}`),
  getByDateRange: (startDate: string, endDate: string) => api.get<ApiResponse<Expense[]>>('/expenses/range', { params: { startDate, endDate } }),
  update: (id: string, data: Partial<CreateExpenseRequest>) => api.patch<ApiResponse<Expense>>(`/expenses/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/expenses/${id}`),
}

// Teams & Roles API
export const teamsAPI = {
  // Teams
  create: (data: CreateTeamRequest) => api.post<ApiResponse<Team>>('/teams/', data),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Team[]>>('/teams/', { params }),
  getById: (id: string) => api.get<ApiResponse<Team>>(`/teams/${id}`),
  update: (id: string, data: UpdateTeamRequest) => api.patch<ApiResponse<Team>>(`/teams/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/teams/${id}`),
  toggleStatus: (id: string) => api.patch<ApiResponse<Team>>(`/teams/${id}/toggle-status`),
  getStats: () => api.get<ApiResponse<TeamStats>>('/teams/stats'),
  
  // Team Members
  inviteMember: (data: InviteTeamMemberRequest) => api.post<ApiResponse<TeamMember>>('/teams/members', data),
  getMembers: (teamId: string) => api.get<ApiResponse<TeamMember[]>>(`/teams/${teamId}/members`),
  getAllMembers: () => api.get<ApiResponse<TeamMember[]>>('/teams/members'),
  getMemberById: (memberId: string) => api.get<ApiResponse<TeamMember>>(`/teams/members/${memberId}`),
  updateMember: (memberId: string, data: { role?: string; status?: string }) => api.patch<ApiResponse<TeamMember>>(`/teams/members/${memberId}`, data),
  removeMember: (memberId: string) => api.delete<ApiResponse>(`/teams/members/${memberId}`),
  resendInvitation: (memberId: string) => api.post<ApiResponse>(`/teams/members/${memberId}/resend-invitation`),
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
  getAll: (params?: SearchParams) => api.get<ApiResponse<Rating[]>>('/ratings/', { params }),
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

// Customer Management API
export const customerAPI = {
  getAll: (options?: any) => api.get<ApiResponse<any[]>>('/customers/', { params: options }),
  getById: (id: string) => api.get<ApiResponse<any>>(`/customers/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/customers/', data),
  update: (id: string, data: any) => api.patch<ApiResponse<any>>(`/customers/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/customers/${id}`),
}

// Vendor Earnings & Payment API
export const vendorEarningsAPI = {
  // Earnings - Use generic earnings API
  getEarnings: (params?: { page?: number; limit?: number; from?: string; to?: string }) => 
    api.get<ApiResponse<Earning[]>>('/earnings/', { params }),
  getEarningsStats: () => api.get<ApiResponse<EarningsOverview>>('/earnings/stats/overview'),
  getEarningsOverview: () => api.get<ApiResponse<EarningsOverview>>('/earnings/stats/overview'),
  
  // Payments & Withdrawals
  getWithdrawals: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<any[]>>('/vendor/withdrawals', { params }),
  requestWithdrawal: (data: { amount: number; bankDetails: any }) => 
    api.post<ApiResponse<any>>('/vendor/withdrawals', data),
  getWithdrawalHistory: () => api.get<ApiResponse<any[]>>('/vendor/withdrawals/history'),
  
  // Bank Details
  getBankDetails: () => api.get<ApiResponse<any>>('/vendor/bank-details'),
  updateBankDetails: (data: any) => api.put<ApiResponse<any>>('/vendor/bank-details', data),
  
  // Payment Status
  getPaymentStatus: () => api.get<ApiResponse<any>>('/vendor/payment-status'),
}

// Vendor Analytics & Performance API
export const vendorAnalyticsAPI = {
  // Performance Metrics
  getPerformanceMetrics: (params?: { period?: string; from?: string; to?: string }) => 
    api.get<ApiResponse<any>>('/vendor/analytics/performance', { params }),
  getEngagementMetrics: () => api.get<ApiResponse<any>>('/vendor/analytics/engagement'),
  getClientInsights: () => api.get<ApiResponse<any>>('/vendor/analytics/clients'),
  
  // Revenue Analytics
  getRevenueAnalytics: (params?: { period?: string }) => 
    api.get<ApiResponse<any>>('/vendor/analytics/revenue', { params }),
  getServicePerformance: () => api.get<ApiResponse<any[]>>('/vendor/analytics/services'),
  getEventTypeAnalytics: () => api.get<ApiResponse<any[]>>('/vendor/analytics/event-types'),
  
  // Conversion Tracking
  getConversionMetrics: () => api.get<ApiResponse<any>>('/vendor/analytics/conversion'),
  getProfileViews: () => api.get<ApiResponse<any>>('/vendor/analytics/profile-views'),
}

// Vendor Team Management API
export const vendorTeamAPI = {
  // Staff Management - Updated to use correct teams API endpoints
  getStaff: (params?: { page?: number; limit?: number; role?: string }) => 
    api.get<ApiResponse<TeamMember[]>>('/teams/members', { params }),
  addStaff: (data: { name?: string; email: string; phone: string; role: string; teamId?: string }) => {
    // Map to InviteTeamMemberRequest format
    const inviteData: InviteTeamMemberRequest = {
      teamId: data.teamId || 'default-team-id', // May need to get default team
      email: data.email,
      phoneNumber: data.phone,
      role: data.role as any
    }
    return api.post<ApiResponse<TeamMember>>('/teams/members', inviteData)
  },
  updateStaff: (id: string, data: any) => api.patch<ApiResponse<TeamMember>>(`/teams/members/${id}`, data),
  removeStaff: (id: string) => api.delete<ApiResponse>(`/teams/members/${id}`),
  
  // Roles & Permissions - May need separate role management endpoints
  getRoles: () => api.get<ApiResponse<any[]>>('/teams/roles'),
  createRole: (data: { name: string; permissions: string[] }) => 
    api.post<ApiResponse<any>>('/teams/roles', data),
  updateRole: (id: string, data: any) => api.patch<ApiResponse<any>>(`/teams/roles/${id}`, data),
  deleteRole: (id: string) => api.delete<ApiResponse>(`/teams/roles/${id}`),
  
  // Team Stats
  getTeamStats: () => api.get<ApiResponse<TeamStats>>('/teams/stats'),
}

// Vendor Subscription Management API
export const vendorSubscriptionAPI = {
  // Subscription Status
  getSubscriptionStatus: () => api.get<ApiResponse<any>>('/vendor/subscription/status'),
  getSubscriptionPlans: () => api.get<ApiResponse<any[]>>('/vendor/subscription/plans'),
  
  // Subscription Management
  upgradeSubscription: (planId: string) => api.post<ApiResponse<any>>('/vendor/subscription/upgrade', { planId }),
  downgradeSubscription: (planId: string) => api.post<ApiResponse<any>>('/vendor/subscription/downgrade', { planId }),
  cancelSubscription: () => api.post<ApiResponse<any>>('/vendor/subscription/cancel'),
  
  // Billing
  getBillingHistory: () => api.get<ApiResponse<any[]>>('/vendor/subscription/billing'),
  getCurrentInvoice: () => api.get<ApiResponse<any>>('/vendor/subscription/current-invoice'),
  updatePaymentMethod: (data: any) => api.put<ApiResponse<any>>('/vendor/subscription/payment-method', data),
}

// Additional missing endpoints from documentation


// Profile API - missing endpoints
profileAPI.getAll = (params?: SearchParams) => api.get<ApiResponse<Profile[]>>('/profile/all', { params })
profileAPI.getById = (id: string) => api.get<ApiResponse<Profile>>(`/profile/${id}`)
profileAPI.updateDisplayPicture = (userId: string, data: FormData) => api.patch<ApiResponse<Profile>>(`/profile/${userId}/display-picture`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
profileAPI.removeDisplayPicture = (userId: string) => api.delete<ApiResponse>(`/profile/${userId}/display-picture`)
profileAPI.delete = (userId: string) => api.delete<ApiResponse>(`/profile/${userId}`)

// Utility function to check token status (for debugging)
export const checkTokenStatus = () => {
  if (typeof window === 'undefined') return null
  
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  
  if (!accessToken) {
    console.log('🔍 Token Status: No access token found')
    return { hasToken: false }
  }
  
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    const expiresIn = payload.exp - now
    const isExpired = payload.exp < now
    
    const status = {
      hasToken: true,
      hasRefreshToken: !!refreshToken,
      isExpired,
      expiresIn,
      expiresInMinutes: Math.floor(expiresIn / 60),
      userId: payload.id,
      issuedAt: new Date(payload.iat * 1000).toLocaleString(),
      expiresAt: new Date(payload.exp * 1000).toLocaleString()
    }
    
    console.log('🔍 Token Status:', status)
    return status
  } catch (e) {
    console.error('❌ Token Status: Could not decode token')
    return { hasToken: true, error: 'Invalid token format' }
  }
}

// Make checkTokenStatus available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).checkTokenStatus = checkTokenStatus
}

export default api