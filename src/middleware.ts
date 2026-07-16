import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard and app routes
  const protectedPaths = ['/dashboard', '/resume-builder', '/cover-letter', '/interview-coach', '/job-tracker']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const token = request.cookies.get('sb-access-token')
    
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/resume-builder/:path*', '/cover-letter/:path*', '/interview-coach/:path*', '/job-tracker/:path*']
}