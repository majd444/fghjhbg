"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@/hooks/useAuth0';
import Cookies from 'js-cookie';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    // Check for authentication from multiple sources
    const checkAuth = () => {
      // Get authentication state from various sources
      const cookieAuth = Cookies.get('is_authenticated') === 'true';
      const localStorageAuth = localStorage.getItem('is_authenticated') === 'true';
      const accessTokenAuth = !!Cookies.get('auth0.access_token');
      
      console.log('Auth state check:', { 
        isAuthenticated, 
        cookieAuth, 
        localStorageAuth, 
        accessTokenAuth,
        authLoading: isLoading
      });
      
      // Consider authenticated if any auth source indicates so
      const effectivelyAuthenticated = isAuthenticated || cookieAuth || localStorageAuth || accessTokenAuth;
      
      if (effectivelyAuthenticated) {
        // Check if payment is completed
        const paymentCompleted = Cookies.get('payment_completed') === 'true';
        console.log('Payment status:', { paymentCompleted });
        
        if (paymentCompleted) {
          // If authenticated and payment completed, redirect to home
          router.push('/home');
        } else {
          // If authenticated but payment not completed, redirect to payment
          router.push('/payment');
        }
      } else if (!isLoading) {
        // If definitely not authenticated, redirect to landing page
        router.push('/landing');
      }
    };
    
    // Check immediately and also after a slight delay to allow for Auth0 to initialize
    checkAuth();
    const timer = setTimeout(checkAuth, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}
