'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'

export default function ClientPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuthContext()

  useEffect(() => {
    if (loading) return
    
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }

    // Redirect to client dashboard as the main landing page for all client types
    console.log('ClientPage: Redirecting to dashboard for user:', user.id, 'accountType:', user.accountType)
    router.push('/client/dashboard')
  }, [router, user, isAuthenticated, loading])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
