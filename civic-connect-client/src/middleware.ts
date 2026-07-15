import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Decode JWT payload (Edge-compatible)
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    
    const role = payload.role;
    const path = request.nextUrl.pathname;

    // RBAC: Check role against path
    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (path.startsWith('/officer') && role !== 'OFFICER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Assume /citizen is for any authenticated user including citizens

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/citizen/:path*',
    '/department/:path*',
    '/admin/:path*'
  ],
};
