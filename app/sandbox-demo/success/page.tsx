"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface SubscriptionDetails {
  plan: string;
  amount: string;
  interval: string;
  currency: string;
}

export default function SuccessPage() {
  const [plan, setPlan] = useState<string>('');
  const [activatedAt, setActivatedAt] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails>({
    plan: 'Basic Annual',
    amount: '100.00',
    interval: 'year',
    currency: 'USD'
  });
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setIsLoading(true);
        
        // Get payment details from URL parameters
        const paymentLinkId = searchParams.get('payment_link');
        const sessionId = searchParams.get('session_id');
        const paymentId = paymentLinkId || sessionId;
        
        if (paymentId) {
          // Store the payment ID
          setPaymentId(paymentId);
          localStorage.setItem('stripe_payment_id', paymentId);
        } else {
          // Try to get from localStorage as fallback
          const storedPaymentId = localStorage.getItem('stripe_payment_id');
          if (storedPaymentId) {
            setPaymentId(storedPaymentId);
          }
        }
        
        // Get subscription data from localStorage or URL parameters
        const subscription = localStorage.getItem('sandbox_subscription');
        const planFromUrl = searchParams.get('plan');
        const activationDate = new Date().toISOString();
        
        // Set plan name
        if (planFromUrl) {
          setPlan(planFromUrl);
          localStorage.setItem('sandbox_subscription', planFromUrl);
        } else if (subscription) {
          setPlan(subscription);
        } else {
          setPlan('Basic Annual'); // Default plan matching the Stripe interface
          localStorage.setItem('sandbox_subscription', 'Basic Annual');
        }
        
        // Set subscription details
        setSubscriptionDetails({
          plan: planFromUrl || subscription || 'Basic Annual',
          amount: '100.00', // From the Stripe payment interface
          interval: 'year',
          currency: 'USD'
        });
        
        // Set activation date to now
        setActivatedAt(new Date().toLocaleString());
        localStorage.setItem('sandbox_activated_at', activationDate);
        
      } catch (err) {
        console.error('Error fetching payment details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [searchParams]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-300 shadow-lg">
          <CardHeader className="bg-green-100 border-b border-green-200">
            <CardTitle className="text-center text-green-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Subscription Activated!
            </CardTitle>
            <CardDescription className="text-center text-green-700">
              Your payment was successful
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800">Subscription Details</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Plan:</div>
                  <div className="font-medium">{plan || 'Basic Annual'}</div>
                  <div className="text-gray-600">Amount:</div>
                  <div className="font-medium">${subscriptionDetails.amount} per {subscriptionDetails.interval}</div>
                  <div className="text-gray-600">Status:</div>
                  <div className="font-medium text-green-600">Active</div>
                  <div className="text-gray-600">Activated on:</div>
                  <div className="font-medium">{activatedAt || 'Just now'}</div>
                  <div className="text-gray-600">Payment ID:</div>
                  <div className="font-medium text-xs truncate">{paymentId || 'N/A'}</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800">What's Next?</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Your account has been upgraded to {plan || 'Basic Annual'} features</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>You can manage your subscription from your account settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/sandbox-demo">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Sandbox
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>This is a sandbox environment for testing purposes only.</p>
          <p className="mt-2">No actual subscription has been activated.</p>
          {paymentId && (
            <p className="mt-2 text-xs">Payment Link ID: {paymentId}</p>
          )}
        </div>
      </div>
    </div>
  );
}
