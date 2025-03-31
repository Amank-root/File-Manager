import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('access_token')?.value;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/files', '/profile'];
  const authRoutes = ['/login', '/register'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // If we're on a protected route and don't have a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If we have a token, check if it's valid
  if (token) {
    try {
      const decoded = jwtDecode<{exp: number}>(token);
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      
      // If token is expired and on protected route, redirect to login
      if (Date.now() > expirationTime && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // If token is valid and on auth route, redirect to dashboard
      if (Date.now() <= expirationTime && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // If token is invalid and on protected route, redirect to login
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}; 