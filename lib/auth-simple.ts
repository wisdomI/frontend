// Simplified auth without Firebase for initial setup
export interface User {
  uid: string
  email: string | null
  displayName: string | null
  role?: 'client' | 'vendor' | 'admin'
}

// Mock users for testing
const mockUsers = {
  'vendor@test.com': {
    uid: 'vendor-user-id',
    email: 'vendor@test.com',
    displayName: 'Test Vendor',
    role: 'vendor' as const,
    password: 'vendor123'
  },
  'client@test.com': {
    uid: 'client-user-id',
    email: 'client@test.com',
    displayName: 'Test Client',
    role: 'client' as const,
    password: 'client123'
  },
  'admin@test.com': {
    uid: 'admin-user-id',
    email: 'admin@test.com',
    displayName: 'Test Admin',
    role: 'admin' as const,
    password: 'admin123'
  }
}

// Mock auth functions for development
export const signInWithEmail = async (
  email: string,
  password: string,
  expectedRole?: 'client' | 'vendor'
) => {
  console.log('signInWithEmail called with:', email, password)
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const user = mockUsers[email as keyof typeof mockUsers]
  console.log('Found user:', user)
  
  if (user && user.password === password) {
    // Enforce selected account type when provided
    if (expectedRole && user.role !== expectedRole) {
      return {
        user: null,
        error: `Selected "${expectedRole === 'vendor' ? 'Event Vendor' : 'Individual/Org'}" but this account is a "${user.role}". Switch selection or use the correct account.`,
      }
    }
    console.log('Password matches, storing user in localStorage')
    // Store user in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify(user))
      console.log('User stored in localStorage')
      
      // Set cookies for middleware
      document.cookie = `authToken=mock-jwt-token; path=/; max-age=86400` // 24 hours
      document.cookie = `userRole=${user.role}; path=/; max-age=86400` // 24 hours
      console.log('Cookies set for middleware')
      
      // Notify auth state change
      setTimeout(() => {
        console.log('Notifying auth state change with user:', user)
        notifyAuthStateChange(user as any)
      }, 100)
    }
    console.log('Returning success result')
    return { user: user as any, error: null }
  } else {
    console.log('Invalid credentials')
    return { user: null, error: 'Invalid email or password' }
  }
}

export const signUpWithEmail = async (email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const mockUser: User = {
    uid: 'new-user-id',
    email: email,
    displayName: 'New User',
    role: 'client' // Default role for new users
  }

  // Store user in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
    
    // Set cookies for middleware
    document.cookie = `authToken=mock-jwt-token; path=/; max-age=86400` // 24 hours
    document.cookie = `userRole=${mockUser.role}; path=/; max-age=86400` // 24 hours
    
    // Notify auth state change
    setTimeout(() => notifyAuthStateChange(mockUser as any), 100)
  }

  return { user: mockUser as any, error: null }
}

export const signInWithGoogle = async (expectedRole?: 'client' | 'vendor') => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const mockUser: User = {
    uid: 'mock-google-user-id',
    email: 'demo@google.com',
    displayName: 'Google Demo User',
    role: expectedRole || 'client'
  }

  // Store user in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
    
    // Set cookies for middleware
    document.cookie = `authToken=mock-jwt-token; path=/; max-age=86400` // 24 hours
    document.cookie = `userRole=${mockUser.role}; path=/; max-age=86400` // 24 hours
    
    // Notify auth state change
    setTimeout(() => notifyAuthStateChange(mockUser as any), 100)
  }

  return { user: mockUser as any, error: null }
}

export const sendPasswordResetEmail = async (email: string) => {
  // Simulate reset email send
  await new Promise(resolve => setTimeout(resolve, 800))
  return { error: null }
}

export const signOutUser = async () => {
  console.log('signOutUser: Starting logout process...')
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Clear user from localStorage
  if (typeof window !== 'undefined') {
    console.log('signOutUser: Clearing localStorage...')
    localStorage.removeItem('mockUser')
    console.log('signOutUser: localStorage cleared')
    
    // Clear cookies
    console.log('signOutUser: Clearing cookies...')
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    console.log('signOutUser: Cookies cleared')
    
    // Notify auth state change
    console.log('signOutUser: Notifying auth state change...')
    setTimeout(() => {
      console.log('signOutUser: Calling notifyAuthStateChange with null')
      notifyAuthStateChange(null)
    }, 100)
  }
  
  console.log('signOutUser: Logout process completed')
  return { error: null }
}

// Store callbacks for auth state changes
let authCallbacks: ((user: User | null) => void)[] = []

// Function to notify all callbacks of auth state change
const notifyAuthStateChange = (user: User | null) => {
  console.log('notifyAuthStateChange: Called with user:', user)
  console.log('notifyAuthStateChange: Number of callbacks:', authCallbacks.length)
  authCallbacks.forEach((callback, index) => {
    console.log(`notifyAuthStateChange: Calling callback ${index}`)
    try {
      callback(user)
      console.log(`notifyAuthStateChange: Callback ${index} executed successfully`)
    } catch (error) {
      console.error(`notifyAuthStateChange: Error in callback ${index}:`, error)
    }
  })
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // Add callback to the list
  authCallbacks.push(callback)
  
  // Check for existing user in localStorage and call immediately
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('mockUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setTimeout(() => callback(user), 100)
      } catch (error) {
        setTimeout(() => callback(null), 100)
      }
    } else {
      setTimeout(() => callback(null), 100)
    }
  } else {
    setTimeout(() => callback(null), 100)
  }
  
  // Return unsubscribe function
  return () => {
    authCallbacks = authCallbacks.filter(cb => cb !== callback)
  }
}

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('mockUser')
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (error) {
        return null
      }
    }
  }
  return null
}

export const getUserToken = async () => {
  const user = getCurrentUser()
  return user ? 'mock-jwt-token' : null
}