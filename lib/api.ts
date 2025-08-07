import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  logout: () =>
    api.post('/auth/logout'),
}

// Customer API calls (Service Providers)
export const customerAPI = {
  getAll: (params?: any) =>
    api.get('/customers', { params }),
  
  getById: (id: string) =>
    api.get(`/customers/${id}`),
  
  create: (customerData: any) =>
    api.post('/customers', customerData),
  
  update: (id: string, customerData: any) =>
    api.put(`/customers/${id}`, customerData),
}

// Legacy vendor API calls (for backward compatibility)
export const vendorAPI = {
  getAll: (params?: any) =>
    api.get('/vendors', { params }),
  
  getById: (id: string) =>
    api.get(`/vendors/${id}`),
  
  create: (vendorData: any) =>
    api.post('/vendors', vendorData),
  
  update: (id: string, vendorData: any) =>
    api.put(`/vendors/${id}`, vendorData),
}

// Booking API calls
export const bookingAPI = {
  create: (bookingData: any) =>
    api.post('/bookings', bookingData),
  
  getById: (id: string) =>
    api.get(`/bookings/${id}`),
  
  getUserBookings: () =>
    api.get('/bookings/user'),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
}

// Chat API calls
export const chatAPI = {
  getConversations: () =>
    api.get('/chat/conversations'),
  
  getMessages: (conversationId: string) =>
    api.get(`/chat/conversations/${conversationId}/messages`),
  
  sendMessage: (conversationId: string, message: string) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { message }),
}

export default api