'use client'

import React, { useState, useEffect } from 'react'
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
            accountType: payload.accountType || 'vendor',
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
      let errorMessage = 'Failed to sign in'
      if (error.response?.status === 403) {
        const message = error.response?.data?.message || ''
        if (message.includes('Operation timeout')) {
          errorMessage = 'Server timeout. Please try again or contact support.'
        } else {
          errorMessage = 'Access denied. Please check your credentials or contact support.'
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
      
      addNotification({
        type: 'error',
        message: errorMessage
      })
      setLoading(false)
    }
  }

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-event-blue focus:border-event-blue"
          placeholder="Email address"
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-event-blue focus:border-event-blue"
          placeholder="Password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-event-blue focus:ring-event-blue border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-event-blue hover:opacity-80 transition-all">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-event-blue hover:bg-event-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-event-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="spinner w-5 h-5"></div>
          ) : (
            'Sign in'
          )}
        </button>
      </div>
    </form>
    </div>
  )
}