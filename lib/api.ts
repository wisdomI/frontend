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
  UpdateBidRequest,
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
  Receipt,
  CreateReceiptRequest,
  ReceiptStats,
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
  TeamStats,
  ProfitAnalysis,
  PerformanceDashboard,
  ClientGrowth,
  ServicePerformance,
  Notification,
  NotificationPreferences,
  NotificationStats,
  UserSettings,
  Bank,
  BankAccount,
  Withdrawal,
  WithdrawalStats,
  Availability,
  AvailabilityStats
} from '@/types/api'

// Backend API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-a3nd.onrender.com/api/v1'

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
  // Skip adding auth headers for public endpoints
  const publicEndpoints = [
    // Auth endpoints
    '/auth/login', 
    '/auth/register', 
    '/auth/verify-email', 
    '/auth/resend-verification-code', 
    '/password/reset', 
    '/password/validate-code', 
    '/password/reset-password',
    // Public service browsing endpoints (GET only)
    '/service/',
    '/service?',
    // Ratings (public read access)
    '/ratings/stats/',
    '/ratings/reviewee/',
    // Categories (public read access for browsing)
    '/categories/'
  ]
  
  // Check if this is a GET request to public service endpoints
  // IMPORTANT: Only GET requests to /service/ are public, POST/PUT/DELETE require auth
  // Also, /service/me requires auth (user's own services)
  const isPublicGetRequest = config.method?.toLowerCase() === 'get' && 
    !config.url?.includes('/service/me') && // /service/me needs auth
    (config.url?.includes('/service/') || 
     config.url?.includes('/service?') || 
     config.url?.includes('/ratings/stats/') ||
     config.url?.includes('/ratings/reviewee/') ||
     config.url?.includes('/categories/'))
  
  // Check if this is a POST/PUT/DELETE to /service/ - these need auth
  const isServiceMutation = (config.method?.toLowerCase() === 'post' || 
                             config.method?.toLowerCase() === 'put' || 
                             config.method?.toLowerCase() === 'delete' || 
                             config.method?.toLowerCase() === 'patch') &&
    config.url?.includes('/service/')
  
  // Check if this is a mutation to /categories/ - these need auth
  const isCategoryMutation = (config.method?.toLowerCase() === 'post' || 
                              config.method?.toLowerCase() === 'put' || 
                              config.method?.toLowerCase() === 'delete' || 
                              config.method?.toLowerCase() === 'patch') &&
    config.url?.includes('/categories/')
  
  // /service/me always needs auth (user's own services)
  const isServiceMe = config.url?.includes('/service/me')
  
  const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint))
  
  // Only skip auth for truly public endpoints (not mutations to /service/ or /categories/, not /service/me)
  if ((isPublicEndpoint || isPublicGetRequest) && !isServiceMutation && !isCategoryMutation && !isServiceMe) {
    console.log('API: Skipping auth header for public endpoint:', config.url, 'method:', config.method)
    return config
  }
  
  // Log when we're adding auth to service mutations or /service/me
  if (isServiceMutation || isServiceMe) {
    console.log('API: Adding auth header for service endpoint:', config.url, 'method:', config.method)
  }
  
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
            return config
          } else {
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
            }
          })
        }
      }
    } catch (e) {
      console.log('⚠️ Could not decode token for expiry check')
    }
    
    config.headers.Authorization = `Bearer ${token}`
    console.log('API: Setting Authorization header for', config.url)
    console.log('API: Authorization header value:', config.headers.Authorization?.substring(0, 80) + '...')
  } else {
    console.log('API: No token found for request to:', config.url)
  }
  
  // DEBUG: Log all headers being sent (for service endpoint debugging)
  if (config.url?.includes('/service')) {
    console.log('🔍 SERVICE REQUEST HEADERS:', {
      'Authorization': config.headers.Authorization ? '✅ Present (Bearer ...)' : '❌ Missing',
      'Content-Type': config.headers['Content-Type'],
      'All headers': Object.keys(config.headers)
    })
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
    
    // Log the full response structure properly
    console.log('🔄 Token Refresh: Full response object:', res)
    console.log('🔄 Token Refresh: Response data:', res.data)
    console.log('🔄 Token Refresh: Response data (stringified):', JSON.stringify(res.data, null, 2))
    console.log('🔄 Token Refresh: Response type:', typeof res.data)
    console.log('🔄 Token Refresh: Response keys:', Object.keys(res.data || {}))
    
    // Try multiple possible response structures
    const responseData = res?.data
    
    // Log nested structure if it exists - check ALL possible nested paths
    if (responseData?.data) {
      console.log('🔄 Token Refresh: Found nested data object')
      console.log('🔄 Token Refresh: Nested data type:', typeof responseData.data)
      console.log('🔄 Token Refresh: Nested data keys:', Object.keys(responseData.data || {}))
      console.log('🔄 Token Refresh: Nested data (stringified):', JSON.stringify(responseData.data, null, 2))
      
      // Check if nested data is an object with more nesting
      if (responseData.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
        console.log('🔄 Token Refresh: Checking deeply nested paths...')
        console.log('🔄 Token Refresh: data.data?.accessToken:', responseData.data.data?.accessToken)
        console.log('🔄 Token Refresh: data.data?.token:', responseData.data.data?.token)
      }
    }
    
    // Try to extract token from multiple possible locations
    // Check direct properties first
    console.log('🔄 Token Refresh: Checking token locations...')
    console.log('  - responseData?.accessToken:', responseData?.accessToken ? 'FOUND' : 'not found')
    console.log('  - responseData?.token:', responseData?.token ? 'FOUND' : 'not found')
    console.log('  - responseData?.access_token:', responseData?.access_token ? 'FOUND' : 'not found')
    
    // Check nested properties
    if (responseData?.data) {
      console.log('  - responseData?.data?.accessToken:', responseData?.data?.accessToken ? 'FOUND' : 'not found')
      console.log('  - responseData?.data?.token:', responseData?.data?.token ? 'FOUND' : 'not found')
      console.log('  - responseData?.data?.access_token:', responseData?.data?.access_token ? 'FOUND' : 'not found')
      
      // Check if data itself is the token string
      if (typeof responseData.data === 'string') {
        console.log('  - responseData.data (as string):', 'FOUND (data is token string)')
      }
      
      // Check deeply nested
      if (responseData.data?.data) {
        console.log('  - responseData?.data?.data?.accessToken:', responseData?.data?.data?.accessToken ? 'FOUND' : 'not found')
        console.log('  - responseData?.data?.data?.token:', responseData?.data?.data?.token ? 'FOUND' : 'not found')
      }
    }
    
    // Helper function to find JWT token in any object (recursive search)
    const findJWTInObject = (obj: any, depth = 0): string | undefined => {
      if (depth > 3) return undefined // Prevent infinite recursion
      if (!obj || typeof obj !== 'object') return undefined
      
      // Check if this object itself is a string that looks like a JWT
      if (typeof obj === 'string' && obj.startsWith('eyJ')) {
        return obj
      }
      
      // Check all string properties for JWT-like tokens
      for (const key in obj) {
        const value = obj[key]
        if (typeof value === 'string' && value.startsWith('eyJ') && value.split('.').length === 3) {
          return value
        }
        // Recursively search nested objects
        if (typeof value === 'object' && value !== null) {
          const found = findJWTInObject(value, depth + 1)
          if (found) return found
        }
      }
      return undefined
    }
    
    const newAccessToken: string | undefined = 
      responseData?.accessToken ||                    // Direct accessToken
      responseData?.data?.accessToken ||              // Nested in data.accessToken
      responseData?.data?.data?.accessToken ||        // Deeply nested
      responseData?.data?.token ||                    // Nested in data.token
      responseData?.data?.data?.token ||              // Deeply nested token
      responseData?.token ||                          // Direct token
      responseData?.data?.access_token ||             // Snake case nested
      responseData?.data?.data?.access_token ||       // Deeply nested snake case
      responseData?.access_token ||                   // Snake case direct
      responseData?.authToken ||                      // Alternative field name
      responseData?.data?.authToken ||                // Nested authToken
      responseData?.jwt ||                            // JWT field
      responseData?.data?.jwt ||                      // Nested JWT
      responseData?.jwtToken ||                       // JWT token field
      responseData?.data?.jwtToken ||                 // Nested JWT token
      (responseData?.data && typeof responseData.data === 'string' ? responseData.data : undefined) || // If data is the token itself
      (responseData?.data?.data && typeof responseData.data.data === 'string' ? responseData.data.data : undefined) || // If data.data is the token
      findJWTInObject(responseData) // Fallback: search entire response for JWT-like strings
    
    console.log('🔄 Token Refresh: Extracted token:', {
      hasToken: !!newAccessToken,
      tokenLength: newAccessToken?.length,
      tokenPreview: newAccessToken ? `${newAccessToken.substring(0, 20)}...` : 'none',
      responseStructure: {
        hasData: !!responseData?.data,
        dataType: typeof responseData?.data,
        dataKeys: responseData?.data && typeof responseData.data === 'object' ? Object.keys(responseData.data) : 'not an object',
        topLevelKeys: Object.keys(responseData || {})
      }
    })
    
    if (newAccessToken && typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
      console.log('✅ Token Refresh: Successfully stored new access token')
      
      // Also update the refresh token if provided
      const newRefreshToken = responseData?.refreshToken || 
                             responseData?.data?.refreshToken ||
                             responseData?.data?.refresh_token ||
                             responseData?.refresh_token
      if (newRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
        console.log('✅ Token Refresh: Also updated refresh token')
      }
    } else {
      console.error('❌ Token Refresh: No access token in response:', res.data)
      console.error('❌ Token Refresh: Full response structure:', JSON.stringify(res.data, null, 2))
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
              // Ensure we use the fresh token from localStorage
              const freshToken = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : newToken
              originalRequest.headers.Authorization = `Bearer ${freshToken || newToken}`
              console.log('✅ Token Refresh (403): Retrying request with new token:', originalRequest.url)
              return api(originalRequest)
            } else {
              // Token refresh failed for 403, but don't redirect for public endpoints
              
              const publicEndpoints = ['/service/', '/services', '/meetings', '/categories/']
              const isPublicEndpoint = publicEndpoints.some(endpoint => 
                originalRequest.url?.includes(endpoint)
              )
              
              if (!isPublicEndpoint && typeof window !== 'undefined') {
                localStorage.removeItem(ACCESS_TOKEN_KEY)
                localStorage.removeItem(REFRESH_TOKEN_KEY)
                window.location.href = '/auth/login'
              } else {
              }
            }
          }
        } catch (e) {
          // Token decode failed
        }
      }
    }

    if (status === 401 && !originalRequest?._retry) {
      // Check if this is a public endpoint - if so, don't try to refresh or redirect
      const publicGetEndpoints = ['/service/', '/service?', '/ratings/stats/', '/ratings/reviewee/']
      const isPublicGetEndpoint = originalRequest.method?.toLowerCase() === 'get' && 
        publicGetEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))
      
      if (isPublicGetEndpoint) {
        console.log('🌐 401 on public endpoint - backend requires auth but frontend allows anonymous access:', originalRequest.url)
        // Return the error without attempting refresh or redirect
        // This allows the frontend to handle it gracefully (e.g., show "No services available")
        return Promise.reject(error)
      }
      
      console.log('🔒 401 Unauthorized: Attempting token refresh for', originalRequest.url)
      
      if (isRefreshing) {
        console.log('🔄 Token refresh already in progress, queueing request...')
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (token) {
              // Ensure we use the fresh token from localStorage
              const freshToken = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : token
              originalRequest.headers.Authorization = `Bearer ${freshToken || token}`
              console.log('✅ Token Refresh (queued): Retrying request with new token:', originalRequest.url)
              resolve(api(originalRequest))
            } else {
              console.error('❌ Token Refresh (queued): No token available, rejecting request')
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
        // Ensure we use the fresh token from localStorage (in case it was updated)
        const freshToken = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : newToken
        originalRequest.headers.Authorization = `Bearer ${freshToken || newToken}`
        console.log('✅ Token Refresh: Retrying request with new token:', originalRequest.url)
        return api(originalRequest)
      } else {
        console.error('❌ Token Refresh: Failed to get new token, cannot retry request')
        
        // Don't redirect for public endpoints that should be accessible without authentication
        const publicEndpoints = ['/service/', '/services', '/meetings', '/categories/']
        const isPublicEndpoint = publicEndpoints.some(endpoint => 
          originalRequest.url?.includes(endpoint)
        )
        
        if (!isPublicEndpoint && typeof window !== 'undefined') {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          window.location.href = '/auth/login'
        }
      }
    }

    // Handle network errors (backend down)
    if (!status && error.code === 'ERR_NETWORK') {
      console.error('🚨 Backend server appears to be down or unreachable:', API_BASE_URL)
      console.error('🚨 Network error details:', error.message)
      
      // Show user-friendly error for critical endpoints
      const criticalEndpoints = ['/auth/login', '/auth/register', '/auth/me']
      const isCriticalEndpoint = criticalEndpoints.some(endpoint => 
        originalRequest.url?.includes(endpoint)
      )
      
      if (isCriticalEndpoint && typeof window !== 'undefined') {
        // Enhanced error message for better user understanding
        console.error('🚨 Critical API endpoint failed - backend may be down')
        console.error('🚨 This could be due to:')
        console.error('   • Server maintenance')
        console.error('   • CORS policy restrictions')
        console.error('   • Network connectivity issues')
        console.error('   • Backend service unavailable')
      }
      
      return Promise.reject(error)
    }

    // Log other errors for debugging (but suppress expected errors)
    const suppressedEndpoints = ['/profile/', '/meetings/', '/categories/stats', '/auth/', '/portfolio/user/']
    const isSuppressedEndpoint = suppressedEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    )
    
    if (status && !isSuppressedEndpoint) {
      console.log(`⚠️ API Error ${status}:`, originalRequest.url, error.message)
    } else if (status && isSuppressedEndpoint) {
      // Suppress these errors completely - they're expected to fail or require special permissions
      return Promise.reject(error)
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
  
  // Role Management
  switchRole: (role: string) => api.post<ApiResponse>('/auth/switch-role', { role }),
  addVendorRole: (vendorData: { businessName: string; businessAddress: string; businessEmail: string; businessPhone: string }) => 
    api.post<ApiResponse>('/auth/add-vendor-role', vendorData),
  getRoles: () => api.get<ApiResponse<any[]>>('/auth/roles'),
  
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
  getAll: (params?: SearchParams) => api.get<ApiResponse<Portfolio[]>>('/portfolio/all', { params }),
  getById: (id: string) => api.get<ApiResponse<Portfolio>>(`/portfolio/${id}`),
  getUserPortfolios: (userId: string) => api.get<ApiResponse<Portfolio[]>>(`/portfolio/user/${userId}`),
  update: (id: string, data: FormData) => api.patch<ApiResponse<Portfolio>>(`/portfolio/single-portfolio/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeMedia: (id: string, mediaUrl: string) => api.delete<ApiResponse>(`/portfolio/${id}/media`, { data: { mediaUrl } }),
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
  userServices: () => api.get<ApiResponse<ServiceOffering[]>>('/service/user-services'),
  
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
  // Basic CRUD operations
  create: (data: FormData | any) => {
    if (data instanceof FormData) {
      // Don't set Content-Type manually - axios will set it with boundary automatically
      return api.post<ApiResponse<ServiceRequest>>('/service-requests/', data);
    } else {
      return api.post<ApiResponse<ServiceRequest>>('/service-requests/', data);
    }
  },
  getAll: (params?: ServiceRequestSearchParams) => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/', { params }),
  getMy: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/my'),
  getAssigned: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/assigned'),
  getOpen: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/open'),
  getUpcoming: () => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/upcoming'),
  search: (params: ServiceRequestSearchParams) => api.get<ApiResponse<ServiceRequest[]>>('/service-requests/search', { params }),
  getStats: () => api.get<ApiResponse<ServiceRequestStats>>('/service-requests/stats'),
  getById: (id: string) => api.get<ApiResponse<ServiceRequest>>(`/service-requests/${id}`),
  update: (id: string, data: FormData | any) => {
    if (data instanceof FormData) {
      // Don't set Content-Type manually - axios will set it with boundary automatically
      return api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}`, data);
    } else {
      return api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}`, data);
    }
  },
  delete: (id: string) => api.delete<ApiResponse>(`/service-requests/${id}`),
  
  // Vendor response operations
  vendorAccept: (id: string, data?: any) => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/vendor-accept`, data),
  vendorReject: (id: string, data?: any) => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/vendor-reject`, data),
  toggleStatus: (id: string, data?: any) => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/toggle-status`, data),
  
  // Admin operations
  assignPlanner: (id: string, data: { plannerId: string; notes?: string }) => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/assignPlanner`, data),
  updateStatus: (id: string, data: { status: string; notes?: string }) => api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/update-status`, data),
  
  // Vendor response management
  getVendorResponses: (id: string) => api.get<ApiResponse<any[]>>(`/service-requests/${id}/vendor-responses/`),
  getVendorResponseHistory: () => api.get<ApiResponse<any[]>>('/service-requests/vendor-responses/history'),
  
  // Bulk operations
  bulkVendorResponses: (data: any[]) => api.patch<ApiResponse<any>>('/service-requests/bulk-vendor-responses', data),
}

// Vendor Service Requests API
export const vendorServiceRequestAPI = {
  create: (data: FormData) => {
    // Don't set Content-Type manually - axios will set it with boundary automatically
    return api.post<ApiResponse<VendorServiceRequest>>('/vendor-service-requests/', data);
  },
  getAll: (params?: SearchParams) => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/', { params }),
  getMy: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/my'),
  getReceived: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/received'),
  getPending: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/pending'),
  getUpcoming: () => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/upcoming'),
  search: (params: ServiceRequestSearchParams) => api.get<ApiResponse<VendorServiceRequest[]>>('/vendor-service-requests/search', { params }),
  getStats: () => api.get<ApiResponse<ServiceRequestStats>>('/vendor-service-requests/stats'),
  getById: (id: string) => api.get<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}`),
  update: (id: string, data: FormData) => {
    // Don't set Content-Type manually - axios will set it with boundary automatically
    return api.patch<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}`, data);
  },
  delete: (id: string) => api.delete<ApiResponse>(`/vendor-service-requests/${id}`),
  toggleStatus: (id: string) => api.patch<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}/toggle-status`),
  respond: (id: string, response: { response: 'accepted' | 'declined' | 'counter_offer' }) => api.patch<ApiResponse<VendorServiceRequest>>(`/vendor-service-requests/${id}/respond`, response),
}

// Vendor Response API
export const vendorResponseAPI = {
  getAll: (params?: SearchParams) => api.get<ApiResponse<VendorResponse[]>>('/service-requests/vendor-responses/', { params }),
  getById: (id: string) => api.get<ApiResponse<VendorResponse>>(`/service-requests/vendor-responses/${id}`),
  create: (data: any) => api.post<ApiResponse<VendorResponse>>('/service-requests/vendor-responses/', data),
  update: (id: string, data: any) => api.patch<ApiResponse<VendorResponse>>(`/service-requests/vendor-responses/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/service-requests/vendor-responses/${id}`),
  withdraw: (id: string) => api.patch<ApiResponse<VendorResponse>>(`/service-requests/vendor-responses/${id}/withdraw`),
  getHistory: () => api.get<ApiResponse<VendorResponse[]>>('/service-requests/vendor-responses/history'),
  getStats: () => api.get<ApiResponse<any>>('/service-requests/vendor-responses/stats'),
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
  download: (id: string) => api.get<ApiResponse<Blob>>(`/invoices/${id}/download`),
  view: (id: string) => api.get<ApiResponse<Invoice>>(`/invoices/${id}/view`),
  updatePaymentStatus: (id: string, data: { status: string; notes?: string }) => api.patch<ApiResponse<Invoice>>(`/invoices/${id}/payment-status`, data),
  markOverdue: () => api.post<ApiResponse>('/invoices/mark-overdue'),
  pay: (id: string) => api.get<ApiResponse>(`/invoices/pay/${id}`),
  getNextInstallment: (id: string) => api.get<ApiResponse<any>>(`/invoices/${id}/next-installment`),
  payInstallment: (data: { installmentId: string; email: string; amount: string; callbackUrl?: string }) => api.post<ApiResponse>('/invoices/installment/pay', data),
  markInstallmentOverdue: () => api.post<ApiResponse>('/invoices/installments/mark-overdue'),
  getReminders: () => api.get<ApiResponse>('/invoices/installments/reminders'),
  markReminderAsSent: (installmentId: string) => api.get<ApiResponse>(`/invoices/installments/${installmentId}/reminder-sent`),
}

// Receipt API
export const receiptAPI = {
  create: (data: CreateReceiptRequest) => api.post<ApiResponse<Receipt>>('/receipts/', data),
  getAll: (params?: SearchParams) => api.get<ApiResponse<Receipt[]>>('/receipts/', { params }),
  getById: (id: string) => api.get<ApiResponse<Receipt>>(`/receipts/${id}`),
  getByNumber: (receiptNumber: string) => api.get<ApiResponse<Receipt>>(`/receipts/number/${receiptNumber}`),
  getStats: () => api.get<ApiResponse<ReceiptStats>>('/receipts/stats'),
  generateFromInvoice: (invoiceId: string) => api.post<ApiResponse<Receipt>>(`/receipts/generate-from-invoice/${invoiceId}`),
  download: (id: string) => api.get<ApiResponse<Blob>>(`/receipts/${id}/download`),
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
  // Create bid - POST /bids/details (as per API spec)
  create: (data: CreateBidRequest) => api.post<ApiResponse<Bid>>('/bids/details', data),
  
  // Get bids - GET /bids
  getAll: (params?: SearchParams) => api.get<ApiResponse<Bid[]>>('/bids/', { params }),
  
  // Get bids with details - GET /bids/details
  getWithDetails: (params?: SearchParams) => api.get<ApiResponse<Bid[]>>('/bids/details', { params }),
  
  // Get bid stats - GET /bids/stats
  getStats: () => api.get<ApiResponse<BidStats>>('/bids/stats'),
  
  // Get bid by ID - GET /bids/:id
  getById: (id: string) => api.get<ApiResponse<Bid>>(`/bids/${id}`),
  
  // Update bid - PATCH /bids/:id
  update: (id: string, data: UpdateBidRequest) => api.patch<ApiResponse<Bid>>(`/bids/${id}`, data),
  
  // Withdraw bid - PATCH /bids/:id/withdraw
  withdraw: (id: string) => api.patch<ApiResponse<Bid>>(`/bids/${id}/withdraw`),
  
  // Delete bid - DELETE /bids/:id/withdraw (as per API spec)
  delete: (id: string) => api.delete<ApiResponse>(`/bids/${id}/withdraw`),
  
  // Accept bid - PATCH /bids/:id/accept
  accept: (id: string) => api.patch<ApiResponse<Bid>>(`/bids/${id}/accept`),
  
  // Reject bid - PATCH /bids/:id/reject
  reject: (id: string) => api.patch<ApiResponse<Bid>>(`/bids/${id}/reject`),
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
  getParents: () => api.get<ApiResponse<Category[]>>('/categories/parents'),
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

// Financial Analytics API
export const financialAnalyticsAPI = {
  getProfitAnalysis: () => api.get<ApiResponse<ProfitAnalysis>>('/financial-analytics/profit-analysis'),
}

// Performance Analytics API
export const performanceAnalyticsAPI = {
  getDashboard: () => api.get<ApiResponse<PerformanceDashboard>>('/analytics/dashboard/'),
  getClientGrowth: () => api.get<ApiResponse<ClientGrowth>>('/analytics/client-growth/'),
  getEarnings: () => api.get<ApiResponse<any>>('/analytics/client-growth/'), // Note: Same endpoint as client growth in docs
  getServicePerformance: () => api.get<ApiResponse<ServicePerformance>>('/analytics/client-growth/'), // Note: Same endpoint as client growth in docs
  getInsights: () => api.get<ApiResponse<any>>('/analytics/client-growth/'), // Note: Same endpoint as client growth in docs
  getAnalytics: () => api.get<ApiResponse<any>>('/analytics/'),
  getMonthlyTrends: () => api.get<ApiResponse<any>>('/analytics/'),
  getTopPerformingServices: () => api.get<ApiResponse<any>>('/analytics/'),
  getReport: () => api.get<ApiResponse<any>>('/analytics/'),
}

// Progress/Availability API
export const availabilityAPI = {
  getAll: () => api.get<ApiResponse<Availability[]>>('/service-requests/'),
  getById: (id: string) => api.get<ApiResponse<Availability>>(`/service-requests/${id}`),
  findAvailableVendors: () => api.get<ApiResponse<any>>('/service-requests/vendors/available'),
  getStats: () => api.get<ApiResponse<AvailabilityStats>>('/service-requests/stats'),
}

// Notification API
export const notificationAPI = {
  create: (data: Partial<Notification>) => api.post<ApiResponse<Notification>>('/notifications/', data),
  getAll: () => api.get<ApiResponse<Notification[]>>('/notifications/'),
  getById: (id: string) => api.get<ApiResponse<Notification>>(`/notifications/${id}`),
  markAsRead: (id: string) => api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch<ApiResponse<any>>('/notifications/read-all'),
  getStats: () => api.get<ApiResponse<NotificationStats>>('/notifications/stats/overview'),
  createPreferences: (data: NotificationPreferences) => api.post<ApiResponse<NotificationPreferences>>('/notifications/preferences', data),
  getPreferences: () => api.get<ApiResponse<NotificationPreferences>>('/notifications/preferences'),
  updatePreferences: (data: Partial<NotificationPreferences>) => api.patch<ApiResponse<NotificationPreferences>>('/notifications/preferences', data),
}

// Settings API
export const settingsAPI = {
  getAll: () => api.get<ApiResponse<UserSettings>>('/settings/'),
  createPin: (data: { pin: string; confirmPin: string }) => api.post<ApiResponse<any>>('/settings/pin/create', data),
  changePin: (data: { oldPin: string; newPin: string; confirmNewPin: string }) => api.patch<ApiResponse<any>>('/settings/pin/change', data),
  verifyPin: (data: { pin: string }) => api.post<ApiResponse<any>>('/settings/pin/verify', data),
  updateNotificationSettings: (data: Partial<NotificationPreferences>) => api.patch<ApiResponse<NotificationPreferences>>('/settings/notification', data),
  updateProfileSettings: (data: Partial<UserSettings>) => api.patch<ApiResponse<UserSettings>>('/settings/profile', data),
}

// Withdrawal/Bank Management API
export const withdrawalAPI = {
  getAllBanks: () => api.get<ApiResponse<Bank[]>>('/withdrawal/banks'),
  resolveAccount: (data: { accountNumber: string; bankCode: string }) => api.get<ApiResponse<any>>('/withdrawal/banks/resolve-account', { params: data }),
  createBankAccount: (data: Partial<BankAccount>) => api.post<ApiResponse<BankAccount>>('/withdrawal/bank-accounts', data),
  getBankAccounts: () => api.get<ApiResponse<BankAccount[]>>('/withdrawal/bank-accounts'),
  getBankAccountById: (id: string) => api.get<ApiResponse<BankAccount>>(`/withdrawal/bank-accounts/${id}`),
  updateBankAccount: (id: string, data: Partial<BankAccount>) => api.patch<ApiResponse<BankAccount>>(`/withdrawal/bank-accounts/${id}`, data),
  deleteBankAccount: (id: string) => api.delete<ApiResponse<any>>(`/withdrawal/bank-accounts/${id}`),
  withdraw: (data: { bankAccountId: string; amount: number; pin: string }) => api.post<ApiResponse<Withdrawal>>('/withdrawal/withdraw', data),
  verifyPin: (data: { withdrawalId: string; pin: string }) => api.post<ApiResponse<any>>('/withdrawal/withdraw/verify-pin', data),
  getAllWithdrawals: () => api.get<ApiResponse<Withdrawal[]>>('/withdrawal/withdraw/'),
  getWithdrawalById: (id: string) => api.get<ApiResponse<Withdrawal>>(`/withdrawal/withdraw/${id}`),
  getWithdrawalStats: () => api.get<ApiResponse<WithdrawalStats>>('/withdrawal/withdraw/stats/summary'),
  // Admin endpoints
  getAllWithdrawalsAdmin: () => api.get<ApiResponse<Withdrawal[]>>('/withdrawal/admin/withdrawals'),
  updateWithdrawalStatus: (id: string, data: { status: string }) => api.patch<ApiResponse<Withdrawal>>(`/withdrawal/admin/withdrawals/${id}/status`, data),
}

// Enhanced Earnings API (from documentation)
export const enhancedEarningsAPI = {
  getSummary: () => api.get<ApiResponse<EarningsOverview>>('/earnings/summary'),
  getStatsOverview: () => api.get<ApiResponse<EarningsOverview>>('/earnings/stats/overview'),
  getAnalytics: () => api.get<ApiResponse<any>>('/earnings/analytics'),
  getComparison: () => api.get<ApiResponse<any>>('/earnings/comparison'),
  search: (params?: any) => api.get<ApiResponse<Earning[]>>('/earnings/search', { params }),
  getByStatus: (status: string) => api.get<ApiResponse<Earning[]>>(`/earnings/status/${status}`),
  getByDateRange: (params?: any) => api.get<ApiResponse<Earning[]>>('/earnings/data-range', { params }),
  getAll: () => api.get<ApiResponse<Earning[]>>('/earnings/'),
  getById: (id: string) => api.get<ApiResponse<Earning>>(`/earnings/${id}`),
}

// Payments API
export const paymentsAPI = {
  getAll: () => api.get<ApiResponse<any[]>>('/payments/'),
  deleteById: (id: string) => api.delete<ApiResponse<any>>(`/payments/${id}`),
  createAccount: (data: any) => api.post<ApiResponse<any>>('/payments/', data),
}

// Travel API (placeholder - endpoints not fully documented yet)
export const travelAPI = {
  // These endpoints will be implemented when the backend travel endpoints are documented
  getAll: () => api.get<ApiResponse<any[]>>('/travel/'),
  getById: (id: string) => api.get<ApiResponse<any>>(`/travel/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/travel/', data),
  update: (id: string, data: any) => api.patch<ApiResponse<any>>(`/travel/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<any>>(`/travel/${id}`),
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
