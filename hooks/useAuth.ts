import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { RegisterRequest, LoginRequest, User, AuthResponse } from '@/types/api'
import { useApi, useApiMutation } from './useApi'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (userData: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  verifyEmail: (email: string, code: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  validateResetCode: (email: string, code: string) => Promise<boolean>
  confirmPasswordReset: (email: string, code: string, newPassword: string, confirmPassword: string) => Promise<boolean>
  refreshUser: () => Promise<void>
  clearError: () => void
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const response = await authAPI.me()
          setUser(response.data.data || response.data)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authAPI.login(credentials)
      const authData = response.data.data || response.data
      
      if (authData.accessToken) {
        localStorage.setItem('accessToken', authData.accessToken)
      }
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      setUser(authData.user || null)
      
      return true
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: RegisterRequest): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      await authAPI.register(userData)
      return true
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true)
    
    try {
      if (user?.id) {
        await authAPI.logout({ userId: user.id })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setLoading(false)
      router.push('/auth/login')
    }
  }, [router])

  const verifyEmail = useCallback(async (email: string, code: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      await authAPI.verifyEmail({ email, code })
      return true
    } catch (error: any) {
      setError(error.response?.data?.message || 'Email verification failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      await authAPI.resetPassword({ email })
      return true
    } catch (error: any) {
      setError(error.response?.data?.message || 'Password reset request failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const validateResetCode = useCallback(async (email: string, code: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      await authAPI.validateResetCode({ code })
      return true
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid reset code')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const confirmPasswordReset = useCallback(async (
    email: string, 
    code: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      await authAPI.setNewPassword({ email, newPassword, code, confirmPassword: newPassword })
      return true
    } catch (error: any) {
      setError(error.response?.data?.message || 'Password reset failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const response = await authAPI.me()
      setUser(response.data.data || response.data)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    verifyEmail,
    resetPassword,
    validateResetCode,
    confirmPasswordReset,
    refreshUser,
    clearError
  }
}

// Hook for specific auth operations
export function useLogin() {
  const wrappedLogin = async (credentials: LoginRequest) => {
    const response = await authAPI.login(credentials)
    return response.data
  }
  return useApiMutation<AuthResponse, LoginRequest>(wrappedLogin)
}

export function useRegister() {
  const wrappedRegister = async (userData: RegisterRequest) => {
    const response = await authAPI.register(userData)
    return response.data
  }
  return useApiMutation<AuthResponse, RegisterRequest>(wrappedRegister)
}

export function useEmailVerification() {
  const wrappedVerifyEmail = async (data: { email: string; verificationCode: string }) => {
    const response = await authAPI.verifyEmail({ email: data.email, code: data.verificationCode })
    return response.data
  }
  return useApiMutation<{}, { email: string; verificationCode: string }>(wrappedVerifyEmail)
}

export function usePasswordReset() {
  const wrappedResetPassword = async (data: { email: string }) => {
    const response = await authAPI.resetPassword({ email: data.email })
    return response.data
  }
  return useApiMutation<{}, { email: string }>(wrappedResetPassword)
}