import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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

export default clerkMiddleware((auth, request) => {
  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return;
  }
  
  // Protect seller routes
  if (isSellerRoute(request)) {
    auth().protect();
    return;
  }
  
  // For all other routes, require authentication
  auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
