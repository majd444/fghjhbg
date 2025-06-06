"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  title: string;
  price: {
    monthly: number;
    annual: number;
  };
  messages: string;
  features: string[];
  isPopular?: boolean;
  isAnnual: boolean;
  ctaText: string;
  onSelect: () => void;
}

const PricingCard = ({ 
  title, 
  price, 
  messages, 
  features, 
  isPopular = false, 
  isAnnual,
  ctaText,
  onSelect 
}: PricingCardProps) => {
  const currentPrice = isAnnual ? price.annual : price.monthly;
  const monthlyEquivalent = isAnnual ? (price.annual / 12).toFixed(2) : price.monthly;
  const savings = isAnnual ? (price.monthly * 12) - price.annual : 0;

  return (
    <Card className={`relative h-full transition-all duration-300 hover:shadow-xl ${
      isPopular 
        ? 'border-2 border-blue-500 shadow-lg md:scale-105' 
        : 'border border-gray-200 hover:border-gray-300'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="mt-4">
          {currentPrice === 0 ? (
            <div className="text-4xl font-bold text-gray-900">Free</div>
          ) : (
            <>
              <div className="text-4xl font-bold text-gray-900">
                ${currentPrice}
                <span className="text-lg font-normal text-gray-500">
                  {isAnnual ? '/year' : '/month'}
                </span>
              </div>
              {isAnnual && savings > 0 && (
                <div className="text-sm text-green-600 font-medium mt-1">
                  Save ${savings}/year
                </div>
              )}
              {isAnnual && (
                <div className="text-sm text-gray-500 mt-1">
                  ${monthlyEquivalent}/month billed annually
                </div>
              )}
            </>
          )}
        </div>
        <div className="text-lg font-semibold text-blue-600 mt-2">
          {messages}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        <ul className="space-y-3 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
          <Button 
            onClick={onSelect}
            className={`w-full py-6 transition-all duration-200 ${
              isPopular 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            {ctaText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
