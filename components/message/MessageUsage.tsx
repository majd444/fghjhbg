"use client";

import { useUser } from "@/lib/contexts/UserContext";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const MessageUsage = () => {
  const { userData, remainingMessages, hasReachedLimit } = useUser();
  
  if (!userData) return null;

  const usagePercentage = userData.messageLimit > 0 
    ? Math.round((userData.messagesUsed / userData.messageLimit) * 100) 
    : 0;
    
  const getProgressColor = () => {
    if (usagePercentage >= 90) return "bg-red-500";
    if (usagePercentage >= 75) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Message Usage</span>
        <span className="font-medium">{userData.messagesUsed} / {userData.messageLimit}</span>
      </div>
      
      <Progress 
        value={usagePercentage} 
        className={`h-2 ${getProgressColor()}`}
      />
      
      <div className="text-xs text-muted-foreground">
        {remainingMessages} messages remaining
      </div>

      {hasReachedLimit && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Message limit reached</AlertTitle>
          <AlertDescription>
            You've reached your {userData.messageLimit} message limit for your {userData.subscriptionPlan.toLowerCase()} plan.
            Please upgrade your plan to continue using the service.
          </AlertDescription>
        </Alert>
      )}

      {usagePercentage >= 90 && !hasReachedLimit && (
        <Alert className="mt-4 border-amber-500 text-amber-600 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Approaching limit</AlertTitle>
          <AlertDescription>
            You're about to reach your message limit.
            Consider upgrading your plan for uninterrupted service.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
