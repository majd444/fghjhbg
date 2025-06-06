"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUser } from '@/lib/contexts/UserContext';
import { useAuth0 } from '@/hooks/useAuth0';
import { useToast } from '@/lib/hooks/use-toast';

export default function HomeSuccessHandler() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  // Always call hooks unconditionally for React rules compliance
  const userContext = useUser();
  const safeUserContext = mounted ? userContext : null;
  const { isAuthenticated } = useAuth0();
  const { toast } = useToast();
  
  // Client-side only effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    // Check if this is a redirect back from a successful payment
    const isSuccess = searchParams.get('payment_success');
    const plan = searchParams.get('plan');
    
    if (isSuccess === 'true' && isAuthenticated && plan) {
      // Set payment completed cookie
      Cookies.set('payment_completed', 'true', { 
        expires: 365, // expires in 1 year
        path: '/',
        sameSite: 'strict'
      });
      
      // Update subscription plan based on URL parameter
      if (safeUserContext?.updateSubscriptionPlan) {
        safeUserContext.updateSubscriptionPlan(plan as 'FREE' | 'BASIC' | 'PRO');
        
        // Show success notification
        toast({
          title: "Payment Successful",
          description: `Your ${plan.toLowerCase()} plan has been activated. Enjoy your new features!`,
          duration: 5000,
        });
      }
      
      // Clean up localStorage
      localStorage.removeItem('selectedPlan');
      
      // Remove the query parameters to clean up the URL
      // This is a client-side operation that doesn't reload the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams, userContext, isAuthenticated, toast]);
  
  // This component doesn't render anything
  return null;
}
