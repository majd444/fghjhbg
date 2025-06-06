"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/lib/hooks/use-toast";
import { useUser } from '@/lib/contexts/UserContext';
import { useRouter } from 'next/navigation';

/**
 * TrialSandbox component allows users to simulate subscription payments
 * without actually charging a credit card. This is useful for testing
 * the subscription flow in a development environment.
 */
export default function TrialSandbox() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateSubscriptionPlan } = useUser();
  const router = useRouter();

  // Simulate activating a subscription plan
  const activatePlan = async (planType: 'FREE' | 'BASIC' | 'PRO') => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update subscription in user context
      if (updateSubscriptionPlan) {
        updateSubscriptionPlan(planType);
      }
      
      // Show success message
      toast({
        title: `${planType} Plan Activated`,
        description: `You have successfully activated the ${planType} plan in sandbox mode.`,
      });
      
      // Store sandbox activation in localStorage
      localStorage.setItem('sandbox_subscription', planType);
      localStorage.setItem('sandbox_activated_at', new Date().toISOString());
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/home?sandbox_payment_success=true&plan=' + planType);
      }, 1500);
    } catch (error) {
      console.error('Error activating sandbox plan:', error);
      toast({
        variant: "destructive",
        title: "Activation Error",
        description: "Failed to activate the sandbox plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 border-2 border-yellow-300 bg-yellow-50">
      <CardHeader className="bg-yellow-100 border-b border-yellow-200">
        <CardTitle className="text-center text-yellow-800">
          🧪 Subscription Sandbox Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <p className="text-yellow-700 mb-4">
            Test the subscription flow without using real payment methods.
            This sandbox allows you to simulate subscription activations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100 border-gray-300"
            onClick={() => activatePlan('FREE')}
            disabled={isLoading}
          >
            {isLoading ? 'Activating...' : 'Activate Free Plan'}
          </Button>
          
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => activatePlan('BASIC')}
            disabled={isLoading}
          >
            {isLoading ? 'Activating...' : 'Activate Basic Plan'}
          </Button>
          
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => activatePlan('PRO')}
            disabled={isLoading}
          >
            {isLoading ? 'Activating...' : 'Activate Pro Plan'}
          </Button>
        </div>
        
        <div className="mt-6 text-xs text-center text-yellow-600">
          <p>Note: This is a sandbox environment for testing purposes only.</p>
          <p>No actual payments will be processed.</p>
        </div>
      </CardContent>
    </Card>
  );
}
