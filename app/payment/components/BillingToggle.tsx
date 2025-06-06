"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { Dispatch, SetStateAction } from "react";

interface BillingToggleProps {
  isAnnual: boolean;
  setIsAnnual: Dispatch<SetStateAction<boolean>>;
}

const BillingToggle = ({ isAnnual, setIsAnnual }: BillingToggleProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      <Label 
        htmlFor="billing-toggle" 
        className={`text-lg font-medium transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}
      >
        Monthly
      </Label>
      <Switch
        id="billing-toggle"
        checked={isAnnual}
        onCheckedChange={setIsAnnual}
        className="data-[state=checked]:bg-green-600"
      />
      <div className="flex items-center space-x-2">
        <Label 
          htmlFor="billing-toggle" 
          className={`text-lg font-medium transition-colors ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}
        >
          Annual
        </Label>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
          Save up to $40
        </span>
      </div>
    </div>
  );
};

export default BillingToggle;
