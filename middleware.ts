import { NextResponse, type NextRequest } from 'next/server';

// This function handles routing based on authentication state
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for various authentication indicators
  // We'll check multiple cookie options since the app might be using different auth methods
  const accessToken = request.cookies.get('auth0.access_token')?.value;
  const isAuthenticatedCookie = request.cookies.get('is_authenticated')?.value === 'true';
  const userIdCookie = request.cookies.get('user_id')?.value;
  const accountIdCookie = request.cookies.get('account_id')?.value;
  const authHeader = request.headers.get('authorization');
  
  // User is authenticated if ANY of these auth indicators are present
  const isAuthenticated = !!accessToken || isAuthenticatedCookie || !!userIdCookie || !!accountIdCookie || !!authHeader;
  
  // Get payment status from cookies
  const hasCompletedPayment = request.cookies.get('payment_completed')?.value === 'true';
  
  // Public paths that don't require authentication
  const isPublicPath = 
    pathname === '/landing' || 
    pathname === '/' || 
    pathname === '/auth-sync' || 
    pathname === '/api/health' ||
    pathname.startsWith('/auth/') || 
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/account') ||
    pathname.startsWith('/api/embed/chatbot.js') ||
    pathname.startsWith('/api/embed/chat') ||
    pathname.startsWith('/embed/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('favicon.ico');
    
  // API paths that require authentication but should return 401 instead of redirecting
  const isApiPath = pathname.startsWith('/api/') && !isPublicPath;
  
  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicPath) {
    // For API routes, return 401 Unauthorized instead of redirecting
    if (isApiPath) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Authentication required to access this endpoint' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // For regular routes, redirect to landing page
    return NextResponse.redirect(new URL('/landing', request.url));
  }
  
  // If user is authenticated but hasn't completed payment and trying to access home
  if (isAuthenticated && !hasCompletedPayment && pathname === '/home') {
    return NextResponse.redirect(new URL('/payment', request.url));
  }
  
  // For root path (/), redirect based on auth status
  if (pathname === '/') {
    // If authenticated, check payment status
    if (isAuthenticated) {
      if (hasCompletedPayment) {
        // If payment completed, go to home
        return NextResponse.redirect(new URL('/home', request.url));
      } else {
        // If not paid, go to payment
        return NextResponse.redirect(new URL('/payment', request.url));
      }
    } else {
      // If not authenticated, go to landing
      return NextResponse.redirect(new URL('/landing', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files (.svg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};
