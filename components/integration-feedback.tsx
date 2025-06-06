import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IntegrationFeedbackProps {
  _integrationId: string;
  integrationName: string;
}

export function IntegrationFeedback({
  _integrationId,
  integrationName
}: IntegrationFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would submit to your backend
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback. We'll review it shortly.",
      });
      
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      
      toast({
        title: "Submission failed",
        description: "Failed to submit feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs gap-1.5"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        Report Issue
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report an Issue with {integrationName}</DialogTitle>
            <DialogDescription>
              Let us know if you're experiencing any problems with your {integrationName} integration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Describe the issue you're experiencing..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[150px]"
            />
            
            <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-md text-sm">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>
                Note: This feedback is for reporting technical issues only. For urgent help, please contact support directly.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !feedback.trim()}>
              {isLoading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
