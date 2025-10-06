'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types/api'
import { authAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setUserData: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Skip initialization if we're on the login page to prevent 403 errors
        if (typeof window !== 'undefined' && window.location.pathname === '/auth/login') {
          console.log('AuthContext: Skipping initialization on login page')
          setLoading(false)
          return
        }

        // Check both localStorage and cookies for token
        const token = localStorage.getItem('accessToken') || 
                     (typeof document !== 'undefined' ? 
                       document.cookie.split(';').find(c => c.trim().startsWith('authToken='))?.split('=')[1] : null)
        
        if (!token) {
          console.log('AuthContext: No token found, user not authenticated')
          setLoading(false)
          return
        }

        console.log('AuthContext: Token found, attempting to initialize user...')

        // Try the standard /auth/me endpoint first
        const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
        const resp = await fetch(`${apiUrl}/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        console.log('AuthContext: /auth/me response status:', resp.status)

        if (resp.status === 403) {
          // Vendor token: build minimal user from JWT payload
          console.log('AuthContext: 403 response - creating vendor user from token')
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            console.log('AuthContext: Token payload:', payload)
            
            const vendorUser = {
              id: payload.id,
              accountType: payload.accountType || 'vendor' as const,
              email: payload.email || '',
              isEmailVerified: true,
              createdAt: new Date(payload.iat * 1000).toISOString(),
              updatedAt: new Date(payload.iat * 1000).toISOString(),
            }
            console.log('AuthContext: Created vendor user:', vendorUser)
            setUser(vendorUser)
          } catch (tokenError) {
            console.error('AuthContext: Failed to decode token:', tokenError)
            // If token cannot be decoded, treat as unauthenticated
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            if (typeof document !== 'undefined') {
              document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
              document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
              document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            }
          } finally {
            setLoading(false)
          }
          return
        }

        if (!resp.ok) {
          console.log('AuthContext: Non-403 failure, invalidating tokens')
          // Non-403 failures invalidate tokens
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          if (typeof document !== 'undefined') {
            document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          }
          setLoading(false)
          return
        }

        const data = await resp.json()
        const userData = data.data || data
        console.log('AuthContext: Retrieved user data:', userData)
        setUser(userData)
        setLoading(false)
      } catch (error) {
        console.error('AuthContext: Initialization error:', error)
        // Network or unexpected error: clear any stale tokens
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        if (typeof document !== 'undefined') {
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const refreshUser = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      
      if (!token) {
        throw new Error('No access token found')
      }
      
      // First try the standard /auth/me endpoint
      const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
      let fetchResponse = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (fetchResponse.status === 403) {
        // For vendor accounts, create user data from token since backend doesn't support vendor /me endpoint
        console.log('AuthContext: 403 response - creating vendor user from token')
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          console.log('AuthContext: Token payload:', payload)
          
          // Create minimal user data from token
          const userData = {
            id: payload.id,
            accountType: 'vendor' as const,
            email: payload.email || '',
            isEmailVerified: true,
            createdAt: new Date(payload.iat * 1000).toISOString(),
            updatedAt: new Date(payload.iat * 1000).toISOString()
          }
          
          console.log('AuthContext: Created vendor user data:', userData)
          setUser(userData)
          console.log('AuthContext: Vendor user set successfully')
          return
        } catch (tokenError) {
          console.error('AuthContext: Failed to decode token:', tokenError)
          throw new Error('Failed to decode user token')
        }
      }
      
      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch user data: ${fetchResponse.status}`)
      }
      
      const fetchData = await fetchResponse.json()
      const userData = fetchData.data || fetchData
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }

  const setUserData = (userData: User) => {
    console.log('AuthContext: Setting user data directly:', userData)
    setUser(userData)
  }

  const logout = async () => {
    try {
      if (user?.id) {
        await authAPI.logout({ userId: user.id })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      
      // Clear cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
      
      setUser(null)
      router.push('/auth/login')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
    setUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}