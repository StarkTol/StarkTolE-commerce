import { NextResponse } from 'next/server';

// Simple middleware that allows all requests to pass through
export function middleware(request) {
  return NextResponse.next();
}

// Only run middleware on API routes if needed
export const config = {
  matcher: [
    // Only match API routes for now
    '/(api)(.*)',
  ],
};
