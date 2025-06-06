"use client"
import { useState, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot } from "lucide-react"

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AgentiveChatProps {
  agentId: string;
  agentName?: string;
  initialMessages?: Message[];
  className?: string;
}

export function AgentiveChat({
  agentId,
  agentName = "Agentive AI",
  initialMessages = [],
  className = "",
}: AgentiveChatProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [{
          id: "welcome-message",
          role: "assistant",
          content: "👋 Hi, I'm your Agentive AI Assistant! How can I help you today?",
        }]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(agentName);

  // Fetch agent details on load if no name provided
  useEffect(() => {
    if (agentName === "Agentive AI" && agentId) {
      const fetchAgentDetails = async () => {
        try {
          const response = await fetch(`/api/agents/${agentId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.agent && data.agent.name) {
              setDisplayName(data.agent.name);
            }
          }
        } catch (error) {
          console.error("Error fetching agent details:", error);
        }
      };

      fetchAgentDetails();
    }
  }, [agentId, agentName]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Send message to our Agentive API endpoint
      const response = await fetch('/api/agentive-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          agentId: agentId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || "Sorry, I couldn't process your request."
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, there was an error processing your request. Please try again later."
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-medium">{displayName}</h2>
            <p className="text-sm text-gray-500">Powered by Agentive</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce delay-100"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type your message..." 
            className="flex-1" 
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="shrink-0 bg-blue-500 hover:bg-blue-600" 
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
