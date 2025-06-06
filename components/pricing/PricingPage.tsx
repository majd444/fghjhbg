"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import BillingToggle from "./BillingToggle";
import { useToast } from "@/components/ui/use-toast";
import { useAuth0 } from "@/hooks/useAuth0";
import { loadStripe } from "@stripe/stripe-js";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51OTK2dCrjRNWNkHr3skJrOl9Ux6cGi0bWi3QlIcyvFWr3PJxSCX1p3RkQSYYA0BUlYKgIX2j5hO4YcZVfYrCTXpI00FXOJ7tQO");

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  const handlePlanSelect = async (planName: string, price: number, priceId: string) => {
    if (!isAuthenticated) {
      // Store the selected plan in localStorage to retrieve after auth
      localStorage.setItem("selectedPlan", JSON.stringify({ name: planName, price, priceId }));
      
      // Redirect to Auth0 login
      loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
          redirect_uri: `${window.location.origin}/payment-callback`
        }
      });
      return;
    }

    if (price === 0) {
      // For free tier, create user in database directly
      try {
        const response = await fetch("/api/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            name: user?.name,
            plan: "free",
          }),
        });

        if (response.ok) {
          toast({
            title: "Free Plan Activated",
            description: "Your account has been set up. Redirecting to dashboard...",
          });
          // Redirect to home after short delay
          setTimeout(() => {
            window.location.href = "/home";
          }, 1500);
        } else {
          toast({
            title: "Error",
            description: "Failed to set up your account. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Account setup error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // For paid plans, redirect to Stripe checkout
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            email: user?.email,
            name: user?.name,
          }),
        });

        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          
          if (error) {
            toast({
              title: "Payment Error",
              description: error.message || "An error occurred during checkout.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Checkout initialization error:", error);
        toast({
          title: "Checkout Error",
          description: "Failed to initialize checkout. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const pricingPlans = [
    {
      title: "Free",
      price: { monthly: 0, annual: 0 },
      priceId: { monthly: "", annual: "" }, // No Stripe price ID for free tier
      messages: "250 messages/month",
      features: [
        "Basic chatbot functionality",
        "Community support",
        "Standard response time",
        "Basic integrations"
      ],
      ctaText: "Get Started Free",
      isPopular: false
    },
    {
      title: "Basic",
      price: { monthly: 10, annual: 100 },
      priceId: { 
        monthly: "price_1OTK4ZCrjRNWNkHrDJd9Dz8E", 
        annual: "price_1OTK4ZCrjRNWNkHrh4OOxjM2" 
      },
      messages: "2,500 messages/month",
      features: [
        "Everything in Free",
        "Email support",
        "Advanced chatbot features",
        "Custom branding",
        "Analytics dashboard"
      ],
      ctaText: "Start Basic Plan",
      isPopular: true
    },
    {
      title: "Pro",
      price: { monthly: 20, annual: 200 },
      priceId: { 
        monthly: "price_1OTK5UCrjRNWNkHr0mbDnHKZ", 
        annual: "price_1OTK5UCrjRNWNkHrcNs5cIwp" 
      },
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
      ctaText: "Get Pro Plan",
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select the perfect plan for your business needs. Scale your chatbot operations 
            with our flexible pricing tiers designed to grow with you.
          </p>
        </div>

        {/* Billing Toggle */}
        <BillingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              messages={plan.messages}
              features={plan.features}
              isPopular={plan.isPopular}
              isAnnual={isAnnual}
              ctaText={plan.ctaText}
              onSelect={() => handlePlanSelect(
                plan.title, 
                isAnnual ? plan.price.annual : plan.price.monthly,
                isAnnual ? plan.priceId.annual : plan.priceId.monthly
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
