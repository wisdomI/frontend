// Check if we're in a browser environment and Firebase is configured
const isFirebaseConfigured = typeof window !== 'undefined' && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

let auth: any = null
let googleProvider: any = null

if (isFirebaseConfigured) {
  try {
    const { initializeApp, getApps } = require('firebase/app')
    const { 
      getAuth, 
      GoogleAuthProvider
    } = require('firebase/auth')

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }

    // Initialize Firebase only if it hasn't been initialized already
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

export { auth }

// Email/Password Authentication
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    return { user: null, error: 'Firebase not configured. Please set up your Firebase environment variables.' }
  }
  
  try {
    const { signInWithEmailAndPassword } = require('firebase/auth')
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const signUpWithEmail = async (email: string, password: string) => {
  if (!auth) {
    return { user: null, error: 'Firebase not configured. Please set up your Firebase environment variables.' }
  }
  
  try {
    const { createUserWithEmailAndPassword } = require('firebase/auth')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Google Authentication
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    return { user: null, error: 'Firebase not configured. Please set up your Firebase environment variables.' }
  }
  
  try {
    const { signInWithPopup } = require('firebase/auth')
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Sign Out
export const signOutUser = async () => {
  if (!auth) {
    return { error: 'Firebase not configured' }
  }
  
  try {
    const { signOut } = require('firebase/auth')
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Auth State Observer
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!auth) {
    callback(null)
    return () => {}
  }
  
  try {
    const { onAuthStateChanged } = require('firebase/auth')
    return onAuthStateChanged(auth, callback)
  } catch (error) {
    console.error('Auth state change error:', error)
    callback(null)
    return () => {}
  }
}

// Get current user
export const getCurrentUser = () => {
  return auth?.currentUser || null
}

// Get user token
export const getUserToken = async () => {
  const user = getCurrentUser()
  if (user) {
    try {
      return await user.getIdToken()
    } catch (error) {
      console.error('Error getting user token:', error)
      return null
    }
  }
  return null
}