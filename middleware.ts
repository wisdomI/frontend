import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/booking', '/chat', '/vendor', '/client']
  
  
  // Vendor-only routes
  const vendorRoutes = ['/vendor']
  
  // Client-only routes
  const clientRoutes = ['/client']

  // Admin-only routes
  const adminRoutes = [
    '/dashboard/admin', 
    '/super-admin',
    '/marketplace-admin',
    '/communication-admin',
    '/dispute-admin',
    '/escrow-admin',
    '/verification-admin'
  ]

  // Check if the current path is protected
  const isProtectedRoute = 
    protectedRoutes.some(route => pathname.startsWith(route)) ||
    adminRoutes.some(route => pathname.startsWith(route))

  // Get auth token from cookies or headers
  const authToken = request.cookies.get('authToken')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '')


  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !authToken) {
    const isGenericAdminRoute = pathname.startsWith('/admin') || adminRoutes.some(route => pathname.startsWith(route));
    // If it's an admin route, redirect to admin login
    if (isGenericAdminRoute) {
       const loginUrl = new URL('/admin/auth/login', request.url)
       loginUrl.searchParams.set('redirect', pathname)
       return NextResponse.redirect(loginUrl)
    }

    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For authenticated users, check role-based access
  if (authToken) {
    // In a real app, you would decode the JWT token to get user role
    // For now, we'll assume the role is stored in a cookie
    const userRole = request.cookies.get('userRole')?.value

    // console.log('Middleware role check performed')

    // Skip role-based redirects if user role is not set (during login process)
    if (!userRole) {
      // console.log('Middleware: No user role set')
      // Don't do any role-based redirects, allow the request to proceed
    } else {
      // Check vendor routes
      if (vendorRoutes.some(route => pathname.startsWith(route)) && userRole !== 'vendor') {
        // console.log('Middleware: Redirecting non-vendor')
        return NextResponse.redirect(new URL('/client/dashboard', request.url))
      }

      // Check client routes
      if (clientRoutes.some(route => pathname.startsWith(route)) && userRole !== 'client') {
        // console.log('Middleware: Redirecting non-client')
        return NextResponse.redirect(new URL('/vendor', request.url))
      }

      // Check admin routes
      if (adminRoutes.some(route => pathname.startsWith(route)) && userRole !== 'admin') {
        // console.log('Middleware: Redirecting non-admin')
        // Determine where to redirect based on their actual role
        if (userRole === 'vendor') {
            return NextResponse.redirect(new URL('/vendor', request.url))
        } else {
            return NextResponse.redirect(new URL('/client/dashboard', request.url))
        }
      }
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    // Azure endpoints commented out - using Render backend only
    // https://eventhub-asgpata8c3aeapgu.westeurope-01.azurewebsites.net
    // wss://eventhub-asgpata8c3aeapgu.westeurope-01.azurewebsites.net
    "default-src 'self'; connect-src 'self' http://localhost:3000 http://localhost:3001 https://localhost:3000 https://localhost:3001 ws://localhost:3000 ws://localhost:3001 wss://localhost:3000 wss://localhost:3001 https://backend-a3nd.onrender.com wss://backend-a3nd.onrender.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.google.com; style-src 'self' 'unsafe-inline' https://www.gstatic.com; style-src-elem 'self' 'unsafe-inline' https://www.gstatic.com; img-src 'self' data: https:; font-src 'self' data:;"
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
