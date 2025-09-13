import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/booking', '/chat']
  
  
  // Vendor-only routes
  const vendorRoutes = ['/dashboard/vendor']
  
  // Client-only routes
  const clientRoutes = ['/dashboard/client']

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Get auth token from cookies or headers
  const authToken = request.cookies.get('authToken')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '')

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For authenticated users, check role-based access
  if (authToken) {
    // In a real app, you would decode the JWT token to get user role
    // For now, we'll assume the role is stored in a cookie
    const userRole = request.cookies.get('userRole')?.value

    // Check vendor routes
    if (vendorRoutes.some(route => pathname.startsWith(route)) && userRole !== 'vendor') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Check client routes
    if (clientRoutes.some(route => pathname.startsWith(route)) && userRole !== 'client') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}