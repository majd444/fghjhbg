"use client";

import { Switch } from "@/components/ui/switch";

interface BillingToggleProps {
  isAnnual: boolean;
  onToggle: (value: boolean) => void;
}

const BillingToggle = ({ isAnnual, onToggle }: BillingToggleProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center mb-12 gap-4">
      <span className={`text-lg ${!isAnnual ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
        Monthly Billing
      </span>
      
      <div className="flex items-center gap-2">
        <Switch
          checked={isAnnual}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-blue-600"
        />
        <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
          Save up to 20%
        </span>
      </div>
      
      <span className={`text-lg ${isAnnual ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
        Annual Billing
      </span>
    </div>
  );
};

export default BillingToggle;
