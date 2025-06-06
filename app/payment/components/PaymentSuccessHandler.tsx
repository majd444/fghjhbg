"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUser } from '@/lib/contexts/UserContext';
import { useAuth0 } from '@/hooks/useAuth0';

export default function PaymentSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  // Always call the hook unconditionally, but only use its value when mounted
  const userContext = useUser();
  const safeUserContext = mounted ? userContext : null;
  const { isAuthenticated } = useAuth0();
  
  // Client-side only effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    // Check if this is a redirect back from a successful payment
    const isSuccess = searchParams.get('payment_success');
    const isSandboxSuccess = searchParams.get('sandbox_payment_success');
    const isStripeSuccess = searchParams.get('session_id') || searchParams.get('payment_intent') || searchParams.get('setup_intent');
    
    // Either our payment_success param, sandbox success, or Stripe's success parameters indicate success
    if ((isSuccess === 'true' || isSandboxSuccess === 'true' || isStripeSuccess) && isAuthenticated) {
      // Set payment completed cookie (secure, httpOnly cookies must be set server-side)
      // This is a client-side cookie just for session indication
      Cookies.set('payment_completed', 'true', { 
        expires: 365, // expires in 1 year
        path: '/',
        sameSite: 'strict'
      });
      
      // Get the plan information from localStorage
      const selectedPlanData = localStorage.getItem('selectedPlan');
      
      if (selectedPlanData) {
        const planData = JSON.parse(selectedPlanData);
        
        // Determine subscription type based on price or title
        if (safeUserContext?.updateSubscriptionPlan) {
          if (planData.price === 10 || planData.title === 'Basic') {
            safeUserContext.updateSubscriptionPlan('BASIC');
          } else if (planData.price === 20 || planData.title === 'Pro') {
            safeUserContext.updateSubscriptionPlan('PRO');
          }
        }
        
        // Clean up localStorage
        localStorage.removeItem('selectedPlan');
      }
      
      // Redirect to home page with a small delay to ensure context updates are applied
      console.log('Payment successful, redirecting to home page...');
      setTimeout(() => {
        router.push('/home');
      }, 500);
    }
  }, [searchParams, router, userContext, isAuthenticated]);
  
  // This component doesn't render anything
  return null;
}
