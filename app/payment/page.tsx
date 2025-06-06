"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/contexts/UserContext';
import { useAuth0 } from '@/hooks/useAuth0';
import { useToast } from "@/lib/hooks/use-toast";
import BillingToggle from './components/BillingToggle';
import PricingCard from './components/PricingCard';
import PaymentSuccessHandler from './components/PaymentSuccessHandler';
import TrialSandbox from './components/TrialSandbox';
import SandboxNav from './components/SandboxNav';

interface Plan {
  title: string;
  price: { monthly: number; annual: number };
  messages: string;
  features: string[];
  ctaText: string;
  isPopular: boolean;
  checkoutLinks?: {
    monthly: string | null;
    annual: string | null;
  };
  // Stripe price IDs for creating checkout sessions
  priceIds?: {
    monthly: string | null;
    annual: string | null;
  };
}

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // We only need authentication status and login function
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Always call the hook, but only use its value when mounted
  const userContext = useUser();
  const safeUserContext = mounted ? userContext : null;
  const updateSubscriptionPlan = safeUserContext?.updateSubscriptionPlan;
  
  // Client-side only effect
  useEffect(() => {
    setMounted(true);
    
    // Check for payment_cancelled parameter
    const paymentCancelled = searchParams.get('payment_cancelled');
    if (paymentCancelled === 'true') {
      toast({
        title: "Payment Cancelled",
        description: "You've cancelled the checkout process. You can try again whenever you're ready.",
        variant: "destructive",
      });
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('payment_cancelled');
      router.replace(url.pathname);
    }
  }, [toast, searchParams, router]);

  const handlePlanSelect = async (plan: Plan, isCurrentlyAnnual: boolean) => {
    setIsLoading(true);
    const currentPrice = isCurrentlyAnnual ? plan.price.annual : plan.price.monthly;

    // If not authenticated, redirect to login first
    if (!isAuthenticated) {
      // Store selected plan in localStorage to retrieve after login
      localStorage.setItem('selectedPlan', JSON.stringify({
        title: plan.title,
        price: currentPrice,
        isAnnual: isCurrentlyAnnual
      }));
      
      // Store the return path
      localStorage.setItem('auth_return_path', '/payment');
      
      // Redirect to login
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your purchase."
      });
      
      await loginWithRedirect();
      setIsLoading(false);
      return;
    }
    
    // For free plan, just update the subscription status
    if (plan.title === "Free") {
      if (updateSubscriptionPlan) {
        updateSubscriptionPlan("FREE");
        toast({
          title: "Free Plan Selected",
          description: "You are now on the Free plan."
        });
        router.push('/home');
      }
      setIsLoading(false);
      return;
    }
    
    // For paid plans, check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe to a paid plan.",
        variant: "destructive",
      });
      setIsLoading(false);
      router.push('/login');
      return;
    }
    
    // Save selected plan to localStorage for after payment completion
    const planPrice = isCurrentlyAnnual ? plan.price.annual : plan.price.monthly;
    localStorage.setItem('selectedPlan', JSON.stringify({
      title: plan.title,
      price: planPrice,
      isAnnual: isCurrentlyAnnual
    }));
    
    // Check if we have direct checkout links first (more reliable)
    if (plan.checkoutLinks) {
      // Fall back to direct checkout links if available
      const stripeUrl = isCurrentlyAnnual ? plan.checkoutLinks.annual : plan.checkoutLinks.monthly;
      
      if (stripeUrl) {
        // We already stored this in localStorage above, no need to do it again
        
        toast({
          title: `${plan.title} Plan Selected`,
          description: `Redirecting to checkout for the ${plan.title} plan...`,
        });
        
        window.location.href = stripeUrl;
      } else {
        toast({
          title: "Checkout Error",
          description: "The checkout link for this plan is currently unavailable. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else {
      // Neither price IDs nor checkout links available
      console.error("No payment options available for plan:", plan.title);
      toast({
        title: "Configuration Error",
        description: "Plan configuration is incomplete. Please contact support.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const pricingPlans: Plan[] = [
    {
      title: "Free",
      price: { monthly: 0, annual: 0 },
      messages: "250 messages/month",
      features: [
        "Basic chatbot functionality",
        "Community support",
        "Standard response time",
        "Basic integrations"
      ],
      ctaText: "Get Started Free",
      isPopular: false,
      checkoutLinks: { monthly: null, annual: null }, // No checkout for free plan
      priceIds: { monthly: null, annual: null } // No price IDs for free plan
    },
    {
      title: "Basic",
      price: { monthly: 10, annual: 100 }, // $10/month, $100/year
      messages: "2,500 messages/month",
      features: [
        "Everything in Free",
        "Email support",
        "Advanced chatbot features",
        "Custom branding",
        "Analytics dashboard"
      ],
      ctaText: isLoading ? "Processing..." : "Start Basic Plan",
      isPopular: true,
      // Live checkout links for direct payment
      checkoutLinks: {
        monthly: "https://buy.stripe.com/dRm7sL6183cX6D7fB818c04", // Replace with your actual live monthly link
        annual: "https://buy.stripe.com/dRm7sL6183cX6D7fB818c04"   // Replace with your actual live annual link
      },
      // Stripe Price IDs for checkout session
      priceIds: {
        monthly: "price_1OzGvdGuwOtuJGatHvBFXXXX", // Replace with your actual price ID
        annual: "price_1OzGvdGuwOtuJGatcWPFXXXX"  // Replace with your actual price ID
      }
    },
    {
      title: "Pro",
      price: { monthly: 20, annual: 200 }, // $20/month, $200/year
      messages: "6,000 messages/month",
      features: [
        "Everything in Basic",
        "Advanced analytics",
        "Priority support",
        "Third-party integrations",
        "Custom webhooks",
        "API access",
        "Team collaboration"
      ],
      ctaText: isLoading ? "Processing..." : "Get Started",
      isPopular: false,
      // Live checkout links for direct payment
      checkoutLinks: {
        monthly: "https://buy.stripe.com/dRm7sL6183cX6D7fB818c04", // Replace with your actual live monthly link
        annual: "https://buy.stripe.com/dRm7sL6183cX6D7fB818c04"   // Replace with your actual live annual link
      },
      // Stripe Price IDs for checkout session
      priceIds: {
        monthly: "price_1OzGwHGuwOtuJGatXXXXXXXX", // Replace with your actual price ID
        annual: "price_1OzGwHGuwOtuJGatXXXXXXXX"  // Replace with your actual price ID
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SandboxNav />
      <div className="py-16 px-4">
      {/* Payment Success Handler - invisible component that handles redirects */}
      <PaymentSuccessHandler />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with our service by selecting the plan that best fits your needs.
            All plans include a 7-day free trial. Cancel anytime.
          </p>
        </div>
        
        {/* Billing Toggle */}
        <div className="mb-12">
          <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.title}
              plan={plan}
              isAnnual={isAnnual}
              onSelect={() => handlePlanSelect(plan, isAnnual)}
              disabled={isLoading}
            />
          ))}
        </div>
        
        {/* Trial Sandbox */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Developer Testing</h2>
          <TrialSandbox />
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-16">
          <p>Secure payment processing by Stripe. Your payment information is never stored on our servers.</p>
          <p className="mt-2">Questions? Contact our support team at support@example.com</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PricingPage;
