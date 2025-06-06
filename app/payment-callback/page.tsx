"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@/hooks/useAuth0";
import { Loader2 } from "lucide-react";

export default function PaymentCallback() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function handlePaymentRedirect() {
      if (!isLoading && isAuthenticated && user) {
        setProcessingPayment(true);
        
        try {
          // Get the selected plan from localStorage
          const selectedPlanStr = localStorage.getItem("selectedPlan");
          
          if (!selectedPlanStr) {
            setError("No plan information found. Please try again.");
            return;
          }
          
          const selectedPlan = JSON.parse(selectedPlanStr);
          
          if (selectedPlan.price === 0) {
            // For free tier, create user directly
            const response = await fetch("/api/create-user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                plan: "free",
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to create user account");
            }
            
            // Clear the selected plan from localStorage
            localStorage.removeItem("selectedPlan");
            
            // Redirect to home
            window.location.href = "/home";
          } else {
            // For paid plans, redirect to Stripe checkout
            const response = await fetch("/api/create-checkout-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                priceId: selectedPlan.priceId,
                email: user.email,
                name: user.name,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to create checkout session");
            }

            const { sessionId } = await response.json();
            
            // Redirect to Stripe Checkout
            const stripe = await import("@stripe/stripe-js").then(module => module.loadStripe(
              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51OTK2dCrjRNWNkHr3skJrOl9Ux6cGi0bWi3QlIcyvFWr3PJxSCX1p3RkQSYYA0BUlYKgIX2j5hO4YcZVfYrCTXpI00FXOJ7tQO"
            ));
            
            if (stripe) {
              await stripe.redirectToCheckout({ sessionId });
            } else {
              throw new Error("Failed to load Stripe");
            }
          }
        } catch (error: any) {
          console.error("Payment flow error:", error);
          setError(error.message || "An error occurred processing your payment.");
        } finally {
          setProcessingPayment(false);
        }
      }
    }

    handlePaymentRedirect();
  }, [isLoading, isAuthenticated, user]);

  if (isLoading || processingPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Setting up your account...</h1>
        <p className="text-gray-600 mt-2">Please wait while we prepare everything for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
          <p className="font-medium">Error: {error}</p>
        </div>
        <button
          onClick={() => window.location.href = "/pricing"}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Pricing
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg mb-6">
          <p className="font-medium">You need to be logged in to continue.</p>
        </div>
        <button
          onClick={() => window.location.href = "/pricing"}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Pricing
        </button>
      </div>
    );
  }

  return null;
}
