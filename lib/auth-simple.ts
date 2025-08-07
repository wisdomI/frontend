// Simplified auth without Firebase for initial setup
export interface User {
  uid: string
  email: string | null
  displayName: string | null
}

// Mock auth functions for development
export const signInWithEmail = async (email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const mockUser: User = {
    uid: 'mock-user-id',
    email: email,
    displayName: 'Demo User'
  }

  return { user: mockUser, error: null }
}

export const signUpWithEmail = async (email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const mockUser: User = {
    uid: 'mock-user-id',
    email: email,
    displayName: 'Demo User'
  }

  return { user: mockUser, error: null }
}

export const signInWithGoogle = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const mockUser: User = {
    uid: 'mock-google-user-id',
    email: 'demo@google.com',
    displayName: 'Google Demo User'
  }

  return { user: mockUser, error: null }
}

export const signOutUser = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  return { error: null }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // Mock auth state change
  setTimeout(() => callback(null), 100)
  return () => { } // Unsubscribe function
}

export const getCurrentUser = () => {
  return null
}

export const getUserToken = async () => {
  return null
}