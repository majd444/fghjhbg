"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthSyncPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Synchronizing authentication state...");
  
  useEffect(() => {
    const syncAuth = () => {
      const isAuth = searchParams.get('auth') === 'true';
      const redirectTo = searchParams.get('redirect') || '/';
      
      console.log('AuthSync: Setting auth state to', isAuth);
      
      if (isAuth) {
        // Set client-side cookies and localStorage
        Cookies.set('is_authenticated', 'true', { path: '/', expires: 30 });
        localStorage.setItem('is_authenticated', 'true');
        
        // Optional: Set payment status if provided
        const payment = searchParams.get('payment');
        if (payment === 'true') {
          Cookies.set('payment_completed', 'true', { path: '/', expires: 365 });
          localStorage.setItem('payment_completed', 'true');
        }
        
        setMessage("Authentication synchronized! Redirecting...");
      } else {
        setMessage("Authentication failed. Redirecting to landing page...");
      }
      
      // Redirect after a brief delay
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    };
    
    syncAuth();
  }, [router, searchParams]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Authentication</h2>
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center text-gray-600">{message}</p>
      </div>
    </div>
  );
}
