"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/contexts/UserContext';
import { useAuth0 } from '@/hooks/useAuth0';
import { useToast } from "@/lib/hooks/use-toast";
import SandboxNav from '../payment/components/SandboxNav';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Cookies from 'js-cookie';

export default function SandboxPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription");
  const [customPlanName, setCustomPlanName] = useState("");
  const [customPlanPrice, setCustomPlanPrice] = useState("10");
  const [isAnnual, setIsAnnual] = useState(false);
  const [trialDays, setTrialDays] = useState("7");
  
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const userContext = useUser();
  const safeUserContext = mounted ? userContext : null;
  const { updateSubscriptionPlan } = safeUserContext || {};
  
  // Client-side only effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get current subscription from localStorage
  const getCurrentSubscription = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sandbox_subscription') || 'NONE';
    }
    return 'NONE';
  };
  
  // Get subscription activation date
  const getActivationDate = () => {
    if (typeof window !== 'undefined') {
      const date = localStorage.getItem('sandbox_activated_at');
      return date ? new Date(date).toLocaleString() : 'Never';
    }
    return 'Never';
  };

  // Simulate activating a subscription plan
  const activatePlan = async (planType: 'FREE' | 'BASIC' | 'PRO' | 'CUSTOM') => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to use the sandbox.",
        variant: "destructive",
      });
      loginWithRedirect();
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For custom plan, use the provided name
      const finalPlanType = planType === 'CUSTOM' ? customPlanName.toUpperCase() : planType;
      
      // Update subscription in user context
      if (updateSubscriptionPlan) {
        updateSubscriptionPlan(finalPlanType as any);
      }
      
      // Set cookies
      Cookies.set('payment_completed', 'true', { 
        expires: 365, // expires in 1 year
        path: '/',
        sameSite: 'strict'
      });
      
      // Store sandbox activation in localStorage
      localStorage.setItem('sandbox_subscription', finalPlanType);
      localStorage.setItem('sandbox_activated_at', new Date().toISOString());
      
      if (planType === 'CUSTOM') {
        localStorage.setItem('sandbox_custom_plan', JSON.stringify({
          name: customPlanName,
          price: parseFloat(customPlanPrice),
          isAnnual,
          trialDays: parseInt(trialDays, 10)
        }));
      }
      
      // Show success message
      toast({
        title: `${finalPlanType} Plan Activated`,
        description: `You have successfully activated the ${finalPlanType} plan in sandbox mode.`,
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
  
  // Clear subscription data
  const clearSubscription = () => {
    if (updateSubscriptionPlan) {
      updateSubscriptionPlan('FREE');
    }
    
    Cookies.remove('payment_completed', { path: '/' });
    localStorage.removeItem('sandbox_subscription');
    localStorage.removeItem('sandbox_activated_at');
    localStorage.removeItem('sandbox_custom_plan');
    localStorage.removeItem('selectedPlan');
    
    toast({
      title: "Subscription Cleared",
      description: "All subscription data has been cleared.",
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  // Go to payment page
  const goToPayment = () => {
    router.push('/payment');
  };
  
  // Current subscription info
  const currentSubscription = getCurrentSubscription();
  const activationDate = getActivationDate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SandboxNav />
      <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscription Sandbox</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test the subscription flow without using real payment methods.
          </p>
        </div>
        
        <Card className="mb-8 border-2 border-yellow-300 bg-yellow-50">
          <CardHeader className="bg-yellow-100 border-b border-yellow-200">
            <CardTitle className="flex items-center">
              <span className="mr-2">🧪</span> Current Sandbox Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Plan</p>
                <p className="text-lg font-bold">
                  {currentSubscription === 'NONE' ? (
                    'No Active Subscription'
                  ) : (
                    <span className="flex items-center">
                      {currentSubscription}
                      <Badge className="ml-2 bg-green-500">ACTIVE</Badge>
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Activated On</p>
                <p className="text-lg font-bold">{activationDate}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                variant="outline" 
                className="bg-white hover:bg-gray-100"
                onClick={goToPayment}
              >
                Go to Payment Page
              </Button>
              <Button 
                variant="destructive" 
                onClick={clearSubscription}
                disabled={currentSubscription === 'NONE'}
              >
                Clear Subscription Data
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="subscription">Standard Plans</TabsTrigger>
            <TabsTrigger value="custom">Custom Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Activate Standard Plan</CardTitle>
                <CardDescription>
                  Choose one of the standard subscription plans to activate in sandbox mode.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Plan</CardTitle>
                <CardDescription>
                  Define a custom subscription plan with your own parameters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input 
                        id="plan-name" 
                        placeholder="Enterprise" 
                        value={customPlanName}
                        onChange={(e) => setCustomPlanName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="plan-price">Price</Label>
                      <Input 
                        id="plan-price" 
                        type="number" 
                        placeholder="50" 
                        value={customPlanPrice}
                        onChange={(e) => setCustomPlanPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trial-days">Trial Days</Label>
                      <Input 
                        id="trial-days" 
                        type="number" 
                        placeholder="14" 
                        value={trialDays}
                        onChange={(e) => setTrialDays(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="annual-billing"
                        checked={isAnnual}
                        onCheckedChange={setIsAnnual}
                      />
                      <Label htmlFor="annual-billing">Annual Billing</Label>
                    </div>
                  </div>
                  
                  <Button
                    className="bg-green-600 hover:bg-green-700 mt-4"
                    onClick={() => activatePlan('CUSTOM')}
                    disabled={isLoading || !customPlanName}
                  >
                    {isLoading ? 'Activating...' : 'Activate Custom Plan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-gray-500 mt-16">
          <p>This is a sandbox environment for testing purposes only.</p>
          <p className="mt-2">No actual payments will be processed.</p>
        </div>
      </div>
      </div>
    </div>
  );
}
