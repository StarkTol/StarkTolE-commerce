import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
  '/all-products',
  '/product/(.*)',
  '/api/upload',
  '/api/test-db'
]);

// Define admin/seller routes
const isSellerRoute = createRouteMatcher([
  '/seller(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }
  
  const { userId } = await auth();
  
  // If user is not authenticated, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // For seller routes, ensure user is authenticated (already checked above)
  if (isSellerRoute(request)) {
    return NextResponse.next();
  }
  
  // For all other protected routes, user is authenticated
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
