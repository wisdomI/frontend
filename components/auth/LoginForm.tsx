'use client'

import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ForgetPasswordModal from './ForgetPasswordModal'

interface LoginModalProps {
  onClose: () => void
  onRegister?: () => void
}

export default function LoginModal({ onClose, onRegister }: LoginModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    'individual' | 'vendor' | 'planner'
  >('individual')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.password.trim()) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1500))

      // For now, we'll simulate a successful login for any valid email/password
      // In a real app, you'd make an API call here

      // Mock validation - you can customize this
      const mockUsers = [
        { email: 'user@example.com', password: 'password123', type: 'individual' },
        { email: 'vendor@example.com', password: 'password123', type: 'vendor' },
        { email: 'admin@example.com', password: 'admin123', type: 'admin' }
      ]

      const user = mockUsers.find(u =>
        u.email.toLowerCase() === formData.email.toLowerCase() &&
        u.password === formData.password
      )

      if (user) {
        // Store user info in localStorage (in a real app, use proper auth state management)
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          type: user.type,
          isAuthenticated: true,
          // isVerified: true // Comment out verification check for now
        }))

        // Close modal
        onClose()

        // Route to dashboard based on user type
        if (activeTab === 'vendor') {
          router.push('/vendor/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError('Invalid email or password')
      }

    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In with Firebase Auth
    toast('Google Sign-In not yet connected', {
      description: 'This feature will be available soon with Firebase authentication.',
      action: {
        label: 'OK',
        onClick: () => console.log('Toast dismissed'),
      },
    })
  }

  const handleAppleSignIn = () => {
    // TODO: Implement Apple Sign-In with Firebase Auth
    toast('Apple Sign-In not yet connected', {
      description: 'This feature will be available soon with Firebase authentication.',
      action: {
        label: 'OK',
        onClick: () => console.log('Toast dismissed'),
      },
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-gray-50 rounded-2xl w-full max-w-lg p-12 relative max-h-[92vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded-lg w-8 h-8 flex items-center justify-center"
          >
            <FaTimes size={14} />
          </button>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full mt-4 p-1 mb-6">
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex-1 py-2 rounded-full text-sm font-sans font-medium transition-all ${activeTab === 'individual'
                ? 'bg-white shadow text-event-blue'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Individual/Org
            </button>
            <button
              onClick={() => setActiveTab('vendor')}
              className={`flex-1 py-2 rounded-full text-sm font-sans font-medium transition-all ${activeTab === 'vendor'
                ? 'bg-white shadow text-event-blue'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Event Vendor
            </button>
            {/* <button
              onClick={() => setActiveTab('planner')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'planner'
                  ? 'bg-white shadow text-event-blue'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Event Planner
            </button> */}
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-heading font-bold text-event-blue mb-2">
            Login to EventHub
          </h2>
          <p className="text-gray-600 font-sans mb-4">
            Kindly fill in your details to Login
          </p>

          {/* Test Credentials Info */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-sans font-medium mb-1">Test Credentials:</p>
            <p className="text-blue-700 text-xs font-sans">Email: user@example.com | Password: password123</p>
            <p className="text-blue-700 text-xs font-sans">Email: vendor@example.com | Password: password123</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-sans">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block font-sans font-medium mb-2 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-event-blue focus:border-event-blue outline-none font-sans"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block font-sans font-medium mb-2 text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-event-blue focus:border-event-blue outline-none font-sans"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-event-blue text-sm font-sans font-medium hover:underline"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-event-blue text-white py-3 rounded-full hover:bg-blue-800 transition-colors font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mb-6 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={onRegister}
              className="text-event-blue font-medium hover:underline"
            >
              Register
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <hr className="flex-1 border-event-blue" />
            <span className="mx-4 text-sm text-gray-500">Or Login with</span>
            <hr className="flex-1 border-event-blue" />
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign in with Google"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={isLoading}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign in with Apple"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Forgot Password Modal */}
        <ForgetPasswordModal
          open={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      </div>
    </>
  )
}