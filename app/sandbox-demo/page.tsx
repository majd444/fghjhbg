"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// Next.js imports
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SandboxDemo() {
  const [isLoading, setIsLoading] = useState(false);
  // State for form fields
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiryDate, setExpiryDate] = useState("12/25");
  const [cvc, setCvc] = useState("123");
  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("test@example.com");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [price, setPrice] = useState(10);
  const [isAnnual, setIsAnnual] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const router = useRouter();
  
  const handleSelectPlan = (plan: string, planPrice: number) => {
    setSelectedPlan(plan);
    setPrice(planPrice);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Store subscription info in localStorage
      localStorage.setItem('sandbox_subscription', selectedPlan || 'BASIC');
      localStorage.setItem('sandbox_activated_at', new Date().toISOString());
      localStorage.setItem('payment_completed', 'true');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/sandbox-demo/success');
      }, 2000);
    }, 1500);
  };
  
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto border-green-300 shadow-lg">
          <CardHeader className="bg-green-100 border-b border-green-200">
            <CardTitle className="text-center text-green-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-green-700 mb-4">
              Your {selectedPlan} subscription has been activated successfully.
            </p>
            <p className="text-gray-600 text-sm">
              You will be redirected to the home page in a moment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sandbox Checkout</h1>
            <p className="text-gray-600">Test the subscription flow without real payments</p>
          </div>
          <Link href="/payment">
            <Button variant="outline">
              Back to Payment
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={`border-2 ${selectedPlan === 'FREE' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-xs text-gray-500">per month</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic features
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  250 messages/month
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSelectPlan('FREE', 0)}
              >
                Select
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={`border-2 ${selectedPlan === 'BASIC' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>
                <div className="text-2xl font-bold">$10</div>
                <div className="text-xs text-gray-500">per month</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Free
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  2,500 messages/month
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleSelectPlan('BASIC', 10)}
              >
                Select
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={`border-2 ${selectedPlan === 'PRO' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                <div className="text-2xl font-bold">$20</div>
                <div className="text-xs text-gray-500">per month</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Basic
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  6,000 messages/month
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleSelectPlan('PRO', 20)}
              >
                Select
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {selectedPlan && (
          <Card className="border-2 border-blue-200 bg-blue-50 mb-8">
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>
                Complete your {selectedPlan} subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="card-number">Card number</Label>
                    <Input 
                      id="card-number" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="expiry">Expiry date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name on card</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="annual-billing"
                      checked={isAnnual}
                      onCheckedChange={setIsAnnual}
                    />
                    <Label htmlFor="annual-billing">Annual billing (save 20%)</Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>
                        Pay ${isAnnual ? (price * 12 * 0.8).toFixed(2) : price.toFixed(2)} {isAnnual ? 'annually' : 'monthly'}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="text-xs text-gray-500">
              This is a sandbox environment. No actual payment will be processed.
            </CardFooter>
          </Card>
        )}
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>This is a sandbox environment for testing purposes only.</p>
          <p className="mt-2">No actual payments will be processed.</p>
        </div>
      </div>
    </div>
  );
}
