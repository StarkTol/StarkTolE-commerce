import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Check if required Clerk environment variables are present
const hasClerkConfig = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;

export default clerkMiddleware((auth, request) => {
  // If Clerk is not configured, allow all requests to pass through
  if (!hasClerkConfig) {
    console.warn('Clerk environment variables not configured. Authentication disabled.');
    return NextResponse.next();
  }
  
  // Otherwise, use default Clerk middleware behavior
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
