import { useState } from 'react'
import { authAPI } from '@/lib/api'
import { 
  RegisterRequest, 
  LoginRequest, 
  VerifyEmailRequest, 
  ResendVerificationRequest,
  PasswordResetRequest,
  ValidateCodeRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  RevokeRefreshTokenRequest,
  LogoutRequest
} from '@/types/api'

export const useAuthEnhanced = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.register(userData)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (loginData: LoginRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.login(loginData)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (data: VerifyEmailRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.verifyEmail(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email verification failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationCode = async (data: ResendVerificationRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.resendVerificationCode(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (data: PasswordResetRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.resetPassword(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const validateResetCode = async (data: ValidateCodeRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.validateResetCode(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid reset code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const setNewPassword = async (data: ResetPasswordRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.setNewPassword(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set new password')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async (data: RefreshTokenRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.refresh(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Token refresh failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const revokeRefreshToken = async (data: RevokeRefreshTokenRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.revokeRefreshToken(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke refresh token')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async (data: LogoutRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.logout(data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getMe = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.me()
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user info')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.update(id, data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.delete(id)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    register,
    login,
    verifyEmail,
    resendVerificationCode,
    resetPassword,
    validateResetCode,
    setNewPassword,
    refreshToken,
    revokeRefreshToken,
    logout,
    getMe,
    updateUser,
    deleteUser,
  }
}
