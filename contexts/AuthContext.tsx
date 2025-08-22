'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/lib/auth-simple'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Pretend user is always logged in
  const [user] = useState<User | null>({
    id: '1',
    uid: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    displayName: 'Demo User'
  } as User)
  const [loading] = useState(false)

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: true, // always true
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
