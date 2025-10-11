'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'
import { useAuthContext } from '@/contexts/AuthContext'

interface LoginFormProps {
  accountType?: 'individual' | 'vendor'
}

export default function LoginForm({ accountType = 'individual' }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [justLoggedIn, setJustLoggedIn] = useState(false)
  const { addNotification } = useApp()
  const { isAuthenticated, user, refreshUser, setUserData } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)

  // Handle redirect after successful login
  useEffect(() => {
    console.log('LoginForm: Redirect useEffect triggered', {
      justLoggedIn,
      isAuthenticated,
      hasUser: !!user,
      userAccountType: user?.accountType
    })
    
    if (justLoggedIn && user) {
      console.log('LoginForm: All conditions met, redirecting based on account type:', user.accountType)
      
      // Always redirect based on user account type
      let redirectPath = '/auth/login' // Default fallback
      
      if (user.accountType === 'vendor') {
        redirectPath = '/vendor'
        console.log('LoginForm: Redirecting vendor to /vendor')
      } else if (user.accountType === 'individual' || user.accountType === 'business') {
        redirectPath = '/client/dashboard'
        console.log('LoginForm: Redirecting client to /client/dashboard')
      } else if (user.accountType === 'admin') {
        redirectPath = '/dashboard/admin'
        console.log('LoginForm: Redirecting admin to /dashboard/admin')
      }
      
      // Use multiple redirect methods to ensure it works
      setTimeout(() => {
        console.log('LoginForm: Executing redirect to:', redirectPath)
        
        // Try router.push first
        router.push(redirectPath)
        
        // Fallback to window.location if router.push doesn't work
        setTimeout(() => {
          console.log('LoginForm: Fallback redirect using window.location')
          window.location.href = redirectPath
        }, 500)
      }, 100)
    }
  }, [justLoggedIn, user, router, isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('LoginForm: Starting login process...')
      console.log('LoginForm: Login credentials:', {
        email: formData.email,
        passwordLength: formData.password.length,
        hasPassword: !!formData.password
      })
      
      // Call the real API
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      })
      
      console.log('LoginForm: Login response received:', response.data)
      
      // Extract tokens and user data from response
      let accessToken = null
      let refreshToken = null
      let userData = null
      
      const responseData: any = response.data
      
      // Try different possible response structures
      if (responseData.data?.data?.accessToken) {
        // Structure: response.data.data.data
        accessToken = responseData.data.data.accessToken
        refreshToken = responseData.data.data.refreshToken
        userData = responseData.data.data.user || responseData.data.user
      } else if (responseData.data?.accessToken) {
        // Structure: response.data.accessToken
        accessToken = responseData.data.accessToken
        refreshToken = responseData.data.refreshToken
        userData = responseData.data.user
      } else if (responseData.accessToken) {
        // Structure: response.accessToken
        accessToken = responseData.accessToken
        refreshToken = responseData.refreshToken
        userData = responseData.user
      } else if (responseData.data?.tokens?.accessToken) {
        // Structure: response.data.tokens.accessToken
        accessToken = responseData.data.tokens.accessToken
        refreshToken = responseData.data.tokens.refreshToken
        userData = responseData.data.user
      } else if (responseData.tokens?.accessToken) {
        // Structure: response.tokens.accessToken
        accessToken = responseData.tokens.accessToken
        refreshToken = responseData.tokens.refreshToken
        userData = responseData.user
      }
      
      console.log('LoginForm: Extracted data:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        hasUserData: !!userData 
      })
      
      if (!accessToken) {
        throw new Error('No access token received from server')
      }
      
      // Store tokens in localStorage and cookies
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // Also set cookies for middleware
      document.cookie = `authToken=${accessToken}; path=/; max-age=3600; SameSite=Lax`
      
      // Map account types to middleware roles
      let middlewareRole = userData.accountType
      if (userData.accountType === 'individual' || userData.accountType === 'business') {
        middlewareRole = 'client'
      } else if (userData.accountType === 'vendor') {
        middlewareRole = 'vendor'
      }
      
      document.cookie = `userRole=${middlewareRole}; path=/; max-age=3600; SameSite=Lax`
      
      console.log('LoginForm: Cookies set:', {
        authToken: !!accessToken,
        userRole: middlewareRole,
        originalAccountType: userData.accountType
      })
      if (refreshToken) {
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`
      }
      
      // Handle user data - either from response or from token
      if (!userData) {
        console.log('LoginForm: No user data in response, will extract from token')
        // For vendor accounts or when user data isn't in response, extract from token
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          userData = {
            id: payload.id,
            accountType: payload.accountType || accountType,
            email: payload.email || formData.email,
            isEmailVerified: true,
            createdAt: new Date(payload.iat * 1000).toISOString(),
            updatedAt: new Date(payload.iat * 1000).toISOString()
          }
          console.log('LoginForm: Created user data from token:', userData)
        } catch (tokenError) {
          console.error('LoginForm: Failed to decode token:', tokenError)
          throw new Error('Failed to extract user information from token')
        }
      }
      
      // Override account type based on user selection if needed
      if (accountType === 'vendor' && userData.accountType !== 'vendor') {
        console.log('LoginForm: Overriding account type to vendor based on user selection')
        userData = {
          ...userData,
          accountType: 'vendor'
        }
      }
      
      // Set user data directly in AuthContext
      console.log('LoginForm: Setting user data in context:', userData)
      setUserData(userData)
      
      addNotification({
        type: 'success',
        message: 'Successfully signed in!'
      })
      
      // Determine redirect path immediately
      let redirectPath = '/auth/login' // Default fallback
      
      if (userData.accountType === 'vendor') {
        redirectPath = '/vendor'
      } else if (userData.accountType === 'individual' || userData.accountType === 'business') {
        redirectPath = '/client/dashboard'
      } else if (userData.accountType === 'admin') {
        redirectPath = '/dashboard/admin'
      }
      
      console.log('LoginForm: Immediate redirect to:', redirectPath)
      
      // Add a small delay to ensure cookies are set before redirect
      setTimeout(() => {
        console.log('LoginForm: Attempting redirect after cookie setup')
        
        // Try immediate redirect first
        try {
          router.push(redirectPath)
          console.log('LoginForm: router.push called successfully')
        } catch (routerError) {
          console.error('LoginForm: router.push failed:', routerError)
          // Fallback to window.location
          console.log('LoginForm: Using window.location fallback')
          window.location.href = redirectPath
        }
      }, 200)
      
      // Set flags for useEffect redirect as backup
      setJustLoggedIn(true)
      setLoading(false)
      
    } catch (error: any) {
      console.error('LoginForm: Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      })
      
      let errorMessage = 'Failed to sign in'
      if (error.response?.status === 403) {
        const message = error.response?.data?.message || ''
        console.error('LoginForm: 403 Forbidden - Server response:', error.response?.data)
        
        if (message.includes('Operation timeout')) {
          errorMessage = 'Server timeout. Please try again or contact support.'
        } else if (message.includes('Access denied')) {
          errorMessage = 'Access denied. Please check your credentials or contact support.'
        } else if (message.includes('user has')) {
          // This is the specific error we're seeing
          errorMessage = 'Account type mismatch. Please ensure you are using the correct login credentials for your account type.'
        } else if (message.includes('Please verify your email')) {
          // Email verification required
          errorMessage = 'Please verify your email before logging in. Check your inbox for a verification email.'
        } else {
          errorMessage = `Access denied: ${message || 'Please verify your account status or contact support.'}`
        }
      } else if (error.response?.status === 422) {
        const message = error.response?.data?.message || ''
        if (message.includes('password') && message.includes('validation')) {
          errorMessage = 'Invalid password format. Password must contain uppercase, lowercase, number, and special character (@$!%*?&).'
        } else {
          errorMessage = 'Invalid credentials. Please check your email and password.'
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Add special handling for email verification
      if (error.response?.status === 403 && error.response?.data?.message?.includes('Please verify your email')) {
        addNotification({
          type: 'error',
          message: 'Please verify your email before logging in. Check your inbox for a verification email or contact support.'
        })
      } else {
        addNotification({
          type: 'error',
          message: errorMessage
        })
      }
      setLoading(false)
    }
  }

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#032D71]"
            placeholder="Enter Email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#032D71] pr-10"
              placeholder="Enter Password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                /* Eye-off icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.02-2.93 2.99-5.14 5.41-6.44" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                  <path d="M10.58 5.05A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.3 11.3 0 0 1-2.11 3.36" />
                </svg>
              ) : (
                /* Eye icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end -mt-1">
          <a href="/auth/reset-password" className="text-[#032D71] text-sm font-semibold">Forgot Password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-full text-white bg-[#0F2D62] hover:opacity-90 transition font-semibold"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

        <div className="text-center text-sm text-gray-600">Don&apos;t have an account? <a href="/auth/register" className="text-[#032D71] font-semibold">Register</a></div>

        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">Or Login with</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="flex items-center justify-center gap-6">
          <Image src="/google.svg" alt="Google" width={28} height={28} />
          <Image src="/apple.svg" alt="Apple" width={28} height={28} />
        </div>
      </form>
    </div>
  )
}