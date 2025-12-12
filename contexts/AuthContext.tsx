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
        // OPTIMIZED: Only access localStorage during initialization (inside useEffect)
        const token = localStorage.getItem('accessToken') || 
                     (typeof document !== 'undefined' ? 
                       document.cookie.split(';').find(c => c.trim().startsWith('authToken='))?.split('=')[1] : null)
        
        if (!token) {
          setLoading(false)
          return
        }

        // For initial load, try to use token directly without blocking
        // This allows the page to render while auth loads in background
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          
          // Check if token is expired
          const now = Math.floor(Date.now() / 1000)
          if (payload.exp && payload.exp < now) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            setLoading(false)
            return
          }
          
          // Create minimal user from JWT payload for immediate rendering
          // Check multiple possible fields for accountType (some backends use different field names)
          // Also check localStorage for accountType preference (set during login)
          const storedAccountType = typeof window !== 'undefined' ? localStorage.getItem('userAccountType') : null
          const accountType = payload.accountType || payload.role || payload.userType || payload.type || storedAccountType || 'client'
          
          console.log('🔍 AuthContext: JWT payload accountType:', {
            accountType: payload.accountType,
            role: payload.role,
            userType: payload.userType,
            type: payload.type,
            storedAccountType,
            finalAccountType: accountType,
            allPayload: payload
          })
          
          const userFromToken = {
            id: payload.id,
            accountType: accountType as 'client' | 'vendor' | 'admin' | 'individual' | 'business',
            email: payload.email || '',
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            businessName: payload.businessName || '',
            isEmailVerified: true,
            createdAt: new Date(payload.iat * 1000).toISOString(),
            updatedAt: new Date(payload.iat * 1000).toISOString(),
          }
          
          console.log('🔍 AuthContext: Created user from token:', userFromToken)
          
          // Set user immediately to unblock rendering
          setUser(userFromToken)
          setLoading(false)
          
          // Fetch full user data in background without blocking
          try {
            const apiUrl = 'https://backend-a3nd.onrender.com/api/v1'
            const resp = await fetch(`${apiUrl}/auth/me`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })

            if (resp.status === 403) {
              // Already set user from JWT above, just ensure token is stored
              if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', token)
              }
              return
            }

            if (resp.ok) {
              const data = await resp.json()
              const userData = data.data || data
              
              // Update with full user data
              setUser(userData)
              
              if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', token)
              }
            }
          } catch (backgroundError) {
            console.log('Background auth fetch failed, using JWT data:', backgroundError)
            // Already have user from JWT, so this is OK
          }
        } catch (tokenError) {
          console.error('AuthContext: Failed to decode token:', tokenError)
          // Clear invalid tokens but don't block
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          if (typeof document !== 'undefined') {
            document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('AuthContext: Initialization error:', error)
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
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          
          // Check multiple possible fields for accountType
          const accountType = payload.accountType || payload.role || payload.userType || payload.type || 'client'
          
          console.log('🔍 AuthContext refreshUser: JWT payload accountType:', {
            accountType: payload.accountType,
            role: payload.role,
            userType: payload.userType,
            type: payload.type,
            finalAccountType: accountType
          })
          
          // Create minimal user data from token
          const userData = {
            id: payload.id,
            accountType: accountType as 'client' | 'vendor' | 'admin' | 'individual' | 'business',
            email: payload.email || '',
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            businessName: payload.businessName || '',
            isEmailVerified: true,
            createdAt: new Date(payload.iat * 1000).toISOString(),
            updatedAt: new Date(payload.iat * 1000).toISOString()
          }
          
          console.log('🔍 AuthContext refreshUser: Created user data:', userData)
          setUser(userData)
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
      localStorage.removeItem('userAccountType')
      
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