"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Minimize, Maximize } from "lucide-react"
import { AgentiveChat } from "./agentive-chat"

interface AgentiveWidgetProps {
  agentId: string;
  agentName?: string;
  buttonText?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function AgentiveWidget({
  agentId,
  agentName,
  buttonText = "Chat with AI",
  position = 'bottom-right',
  className = "",
}: AgentiveWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClasses[position]} z-50 shadow-lg ${className}`}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`fixed ${positionClasses[position]} z-50 bg-white rounded-lg shadow-xl overflow-hidden 
            ${isMinimized ? 'w-64 h-12' : 'w-80 sm:w-96 h-[500px]'} 
            transition-all duration-200 ease-in-out`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>{agentName || "Agentive Chat"}</span>
            </div>
            <div className="flex items-center space-x-2">
              {isMinimized ? (
                <Maximize 
                  className="h-4 w-4 cursor-pointer" 
                  onClick={() => setIsMinimized(false)} 
                />
              ) : (
                <Minimize 
                  className="h-4 w-4 cursor-pointer" 
                  onClick={() => setIsMinimized(true)} 
                />
              )}
              <X 
                className="h-4 w-4 cursor-pointer" 
                onClick={() => setIsOpen(false)} 
              />
            </div>
          </div>

          {/* Chat content */}
          {!isMinimized && (
            <div className="h-[calc(100%-48px)]">
              <AgentiveChat 
                agentId={agentId} 
                agentName={agentName}
                className="h-full"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
