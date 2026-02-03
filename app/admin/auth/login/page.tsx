'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, X } from 'lucide-react'

import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { useAuthContext } from '@/contexts/AuthContext'

export default function AdminLoginPage() {
  const router = useRouter()
  const { setUserData } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await adminAPI.login({
        email,
        password
      })

      const responseData = response.data as any
      // Handle double nesting of data object (response.data.data.data.accessToken)
      const token = responseData.data?.data?.accessToken || 
                    responseData.data?.accessToken || 
                    responseData.accessToken || 
                    responseData.data?.data?.token || 
                    responseData.data?.token || 
                    responseData.token ||
                    responseData.data?.data?.access_token ||
                    responseData.data?.access_token ||
                    responseData.access_token

      if (token) {
        const refreshToken = responseData.data?.data?.refreshToken || 
                             responseData.data?.refreshToken || 
                             responseData.refreshToken || ''
                             
        localStorage.setItem('accessToken', token)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('userAccountType', 'admin') // Force admin type
        
        // Also set cookies for middleware
        document.cookie = `authToken=${token}; path=/; max-age=3600; SameSite=Lax`
        document.cookie = `userRole=admin; path=/; max-age=3600; SameSite=Lax`

        // Set user data in context
        // Check for admin object inside nested data
        const user = responseData.data?.data?.admin || 
                     responseData.data?.admin || 
                     responseData.data?.data?.user || 
                     responseData.data?.user || 
                     responseData.data
                     
        if (user) {
          setUserData({
            ...user,
            accountType: 'admin' // Ensure account type is admin
          })
        }
        
        toast.success('Login successful')
        
        // Redirect based on admin role (if available in user object) or default to super-admin
        const adminType = user?.adminType || 'super_admin'
        
        if (adminType === 'super_admin') {
           router.push('/super-admin')
        } else if (adminType === 'escrow_admin') {
           router.push('/escrow-admin')
        } else if (adminType === 'dispute_admin') {
           router.push('/dispute-admin')
        } else if (adminType === 'verification_admin') {
           router.push('/verification-admin')
        } else if (adminType === 'marketplace_admin') {
           router.push('/marketplace-admin')
        } else if (adminType === 'communication_admin') {
           router.push('/communication-admin')
        } else {
           router.push('/super-admin')
        }
      } else {
        throw new Error('No access token received')
      }
    } catch (err: any) {
      console.error('Admin Login Error:', err)
      const message = err.response?.data?.message || err.message || 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/" className="text-gray-400 hover:text-gray-500">
          <X className="h-6 w-6" />
        </Link>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-raleway text-[#0B2E6F]">Login to EventHub Admin Portal</h2>
        <p className="text-sm text-gray-600">Kindly fill in your details to Login</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#0B2E6F] focus:border-[#0B2E6F] bg-gray-50 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link 
            href="/admin/auth/reset-password" 
            className="text-sm font-semibold text-[#0B2E6F] hover:text-[#092456]"
          >
            Forgot Password?
          </Link>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0B2E6F] hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2E6F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

