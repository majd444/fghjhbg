import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Loader2 } from "lucide-react";

interface IntegrationTestPanelProps {
  integrationId: string;
  integrationName: string;
}

export function IntegrationTestPanel({ 
  integrationId, 
  integrationName 
}: IntegrationTestPanelProps) {
  const [testMessage, setTestMessage] = useState("Hello! This is a test message from my chatbot.");
  const [testDestination, setTestDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTest = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "Test message required",
        description: "Please enter a test message to send.",
        variant: "destructive",
      });
      return;
    }

    // For platforms that need a destination (phone number, chat ID, etc.)
    if (
      (integrationId === "whatsapp" || 
       integrationId === "telegram") && 
      !testDestination.trim()
    ) {
      toast({
        title: "Destination required",
        description: `Please enter a valid ${
          integrationId === "whatsapp" ? "phone number" : "chat ID"
        } to send the test message to.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/integrations/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          integrationId,
          message: testMessage,
          destination: testDestination || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test message");
      }

      setTestResult({
        success: true,
        message: `Successfully sent test message to ${integrationName}.`,
      });

      toast({
        title: "Test successful",
        description: `Your test message was sent to ${integrationName} successfully.`,
      });
    } catch (error) {
      console.error("Test message error:", error);
      
      setTestResult({
        success: false,
        message: error instanceof Error 
          ? error.message 
          : "An unexpected error occurred while testing.",
      });

      toast({
        title: "Test failed",
        description: error instanceof Error 
          ? error.message 
          : "Failed to send test message. Please check your integration credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine placeholder text based on integration type
  const getDestinationPlaceholder = () => {
    switch (integrationId) {
      case "whatsapp":
        return "Phone number (e.g., +1234567890)";
      case "telegram":
        return "Chat ID";
      case "discord":
        return "Channel ID";
      default:
        return "Destination ID";
    }
  };

  // Determine if we need a destination field
  const needsDestination = ["whatsapp", "telegram", "discord"].includes(integrationId);

  return (
    <div className="space-y-4 p-4 border rounded-md bg-slate-50">
      <h3 className="text-lg font-medium">Test Your {integrationName} Integration</h3>
      
      <div className="space-y-3">
        <Textarea
          placeholder="Enter a test message to send"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          className="min-h-[80px]"
        />
        
        {needsDestination && (
          <Input
            placeholder={getDestinationPlaceholder()}
            value={testDestination}
            onChange={(e) => setTestDestination(e.target.value)}
          />
        )}

        <Button 
          onClick={handleTest}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Test Message...
            </>
          ) : (
            "Send Test Message"
          )}
        </Button>
      </div>

      {testResult && (
        <div className={`p-3 rounded-md flex items-start gap-2 ${
          testResult.success 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {testResult.success ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          )}
          <p>{testResult.message}</p>
        </div>
      )}

      <div className="text-xs text-slate-500 mt-2">
        <p>
          Note: This will send an actual message through your integration.
          {integrationId === "wordpress" 
            ? " The test will check if your embed code works correctly."
            : ""}
        </p>
      </div>
    </div>
  );
}
