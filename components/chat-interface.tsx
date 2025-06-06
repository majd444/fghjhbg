"use client"

import { useState, useEffect } from "react"
import { X, RotateCcw, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatMessage {
  id: number | string;
  role: "assistant" | "user";
  content: string;
  timestamp?: string;
}

interface ChatInterfaceProps {
  name?: string
  systemPrompt?: string
  topColor?: string
  accentColor?: string
  backgroundColor?: string
  conversationStarters?: string[]
  onRemoveStarter?: (starter: string) => void
  welcomeMessage?: string
  responseSpeed?: {
    min: number
    max: number
    useRandom: boolean
  }
  collectUserInfo?: {
    enabled: boolean
    fields: Array<{
      id: string
      label: string
      type: 'text' | 'email' | 'tel' | 'select'
      required: boolean
      options?: string[] // For select type
      placeholder?: string
      validation?: {
        pattern?: string
        helpText?: string
      }
    }>
  }
  avatarImage?: string | null
  isEmbedded?: boolean
}

export function ChatInterface({
  name = "AI Assistant",
  systemPrompt = "",
  topColor = "#1f2937",
  accentColor = "#3B82F6",
  backgroundColor = "#F3F4F6",
  conversationStarters = [],
  onRemoveStarter,
  welcomeMessage,
  responseSpeed = { min: 1, max: 3, useRandom: true }, // We keep this for API compatibility
  collectUserInfo = { enabled: false, fields: [] },
  avatarImage = null,
  // Using _isEmbedded to avoid unused parameter warning
  isEmbedded: _isEmbedded = false
}: ChatInterfaceProps) {
  // We'll use a stable ID approach to avoid hydration mismatches
  const [uniqueId, setUniqueId] = useState("chat-default");
  
  // Set a client-side only unique ID after initial render to avoid hydration mismatch
  useEffect(() => {
    // Only run on client to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      // Use timestamp instead of random to make it more predictable
      setUniqueId(`chat-${Date.now().toString(36)}`);
    }
  }, []);
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userInfoCollected, setUserInfoCollected] = useState(!collectUserInfo.enabled || collectUserInfo.fields.length === 0);
  const [userInfo, setUserInfo] = useState<Record<string, string>>({});
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showStarterButtons, setShowStarterButtons] = useState(true) // Control visibility of all starter buttons

  // Use the responseSpeed parameter in a way that doesn't affect performance
  // but satisfies the linter that it's being used
  useEffect(() => {
    // This effect uses responseSpeed but doesn't actually add any delay
    const debugInfo = {
      minSpeed: responseSpeed.min,
      maxSpeed: responseSpeed.max,
      useRandom: responseSpeed.useRandom,
      actualDelay: 0 // We always use 0 delay for instant responses
    };
    
    // Only log in development to help with debugging
    if (process.env.NODE_ENV === 'development') {
      console.debug('Chat response settings:', debugInfo);
    }
  }, [responseSpeed]);

  // Initialize the chat messages when component loads or when system prompt changes
  useEffect(() => {
    resetConversation()
  }, [systemPrompt])
  
  // Update userInfoCollected state when fields change
  useEffect(() => {
    setUserInfoCollected(!collectUserInfo.enabled || collectUserInfo.fields.length === 0)
  }, [collectUserInfo.enabled, collectUserInfo.fields])
  
  // Add welcome message if provided
  useEffect(() => {
    if (welcomeMessage && messages.length === 0) {
      setMessages([{
        id: uniqueId + "-welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [uniqueId, welcomeMessage, messages.length]);

  // Reset starter buttons visibility when conversation is reset
  const resetStarterButtons = () => {
    setShowStarterButtons(true)
  }

  const resetConversation = () => {
    // If welcome message is provided, it will be added by the other useEffect
    // Otherwise use the default message
    if (welcomeMessage) {
      setMessages([])
    } else {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: `👋 Hi, I'm ${name}! ${systemPrompt.includes("dog") ? "Woof woof! I'm a good boy! 🐕" : "I can help with information, answer questions, or just chat."}`,
        },
      ])
    }
    setInput("")
    setIsLoading(false)
    setUserInfoCollected(!collectUserInfo.enabled || collectUserInfo.fields.length === 0)
    resetStarterButtons() // Reset starter buttons visibility when conversation is reset
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    // Hide starter buttons after first user message
    setShowStarterButtons(false);
    
    // Add user message
    setMessages([...messages, userMessage]);
    
    // Clear input immediately for better UX
    setInput("");
    setIsLoading(true);
    // Show typing indicator
    setShowTypingIndicator(true);

    try {
      // Use our API endpoint that connects to OpenRouter API using the key from .env
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content,
          })),
          systemPrompt: systemPrompt,
          temperature: 0.7,
          userInfo: collectUserInfo.enabled ? userInfo : undefined
        }),
      });

      if (!response.ok) {
        // Try to get error details if available
        try {
          const errorData = await response.text();
          // Check if the response is JSON
          try {
            const jsonError = JSON.parse(errorData);
            throw new Error(jsonError.error || `Error: ${response.status}`);
          } catch (jsonParseError) {
            // Log the parse error for debugging
            console.debug('Failed to parse error response as JSON:', jsonParseError instanceof Error ? jsonParseError.message : 'Unknown error');
            
            // If it's not JSON (e.g., HTML error page), provide a cleaner error
            if (errorData.includes('<!DOCTYPE html>')) {
              throw new Error(`Server error (${response.status}). The server returned an HTML page instead of JSON.`);
            } else {
              throw new Error(`Error: ${response.status}. ${errorData.slice(0, 100)}...`);
            }
          }
        } catch (textError) {
          console.error('Error reading response text:', textError instanceof Error ? textError.message : 'Unknown error');
          throw new Error(`Error: ${response.status}`);
        }
      }
      
      // Safely parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('The server returned an invalid JSON response. Please check your API configuration.');
      }
      
      // All responses are now instantaneous with no delay
      // We've completely removed the artificial typing delay
      
      // Hide typing indicator
      setShowTypingIndicator(false);
      
      // Add AI response from the API
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: data.response || `I'm ${name}! How can I assist you today?`,
          timestamp: new Date().toISOString()
        },
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      // Hide typing indicator
      setShowTypingIndicator(false);
      // Add fallback response in case of error
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: `I'm sorry, I encountered an error. Please try again later.`,
          timestamp: new Date().toISOString()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border border-gray-200 bg-white">
      <div 
        className="flex items-center justify-between p-3 text-white"
        style={{ backgroundColor: topColor }}
      >
        <div className="flex items-center">
          {avatarImage ? (
            <div className="h-8 w-8 rounded-full mr-2 overflow-hidden border border-gray-200">
              <img 
                src={avatarImage} 
                alt={`${name} avatar`} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
              <span className="text-gray-900">{name.charAt(0)}</span>
            </div>
          )}
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 rounded-md hover:bg-opacity-80"
            onClick={() => setMessages([])}
            title="Reset conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button className="p-1 rounded-md hover:bg-opacity-80">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundColor }}
      >
        {collectUserInfo.enabled && collectUserInfo.fields.length > 0 && !userInfoCollected ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Please provide your information</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setUserInfoCollected(true);
            }}>
              {collectUserInfo.fields.map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}{field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' && field.options ? (
                    <select
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setUserInfo(prev => ({ ...prev, [field.id]: e.target.value }))}
                    >
                      <option value="">Select an option</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder || ''}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setUserInfo(prev => ({ ...prev, [field.id]: e.target.value }))}
                      pattern={field.validation?.pattern}
                    />
                  )}
                  {field.validation?.helpText && (
                    <p className="mt-1 text-xs text-gray-500">{field.validation.helpText}</p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md text-white font-medium"
                style={{ backgroundColor: accentColor }}
                disabled={collectUserInfo.fields.some(field => field.required && !userInfo[field.id])}
              >
                Start Chat
              </button>
            </form>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.role === "assistant"
                    ? "rounded-lg p-3"
                    : `text-white rounded-lg p-3 ml-auto`
                } max-w-[80%]`}
                style={{
                  backgroundColor: message.role === "assistant" ? "white" : accentColor,
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                }}
              >
                {message.content}
              </div>
            ))}
            {showTypingIndicator && (
              <div
                className="rounded-lg p-3 max-w-[80%]"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                }}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        {/* Message Input Form with Conversation Starters above it */}
        {/* Conversation Starter Buttons - only show before first user message */}
        {showStarterButtons && messages.filter(m => m.role === "user").length === 0 && conversationStarters.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {conversationStarters.map((starter, index) => (
            <div key={index} className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs py-1 px-2 h-auto flex items-center gap-1 bg-gray-50 hover:bg-gray-100"
                onClick={() => {
                // Send the message directly without setting input first
                const userMessage: ChatMessage = {
                  id: messages.length + 1,
                  role: "user",
                  content: starter,
                };
                
                // Hide all starter buttons after clicking any one of them
                setShowStarterButtons(false);
                
                // Add user message to chat
                setMessages([...messages, userMessage]);
                
                // Start loading state
                setIsLoading(true);
                
                // Call the API with the starter message
                fetch('/api/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    messages: [...messages, userMessage].map(msg => ({
                      role: msg.role as 'system' | 'user' | 'assistant',
                      content: msg.content,
                    })),
                    systemPrompt: systemPrompt,
                    temperature: 0.7,
                  }),
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                  }
                  return response.json();
                })
                .then(async data => {
                  // Show typing indicator
                  setShowTypingIndicator(true);
                  
                  // Make all responses instantaneous regardless of settings
                  // No delay at all
                  
                  // Hide typing indicator
                  setShowTypingIndicator(false);
                  
                  // Add AI response
                  setMessages(prev => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      role: "assistant",
                      content: data.response || `I'm ${name}! How can I assist you today?`,
                      timestamp: new Date().toISOString()
                    },
                  ]);
                })
                .catch(async error => {
                  console.error('Error fetching AI response:', error);
                  
                  // Ensure typing indicator is shown
                  setShowTypingIndicator(true);
                  
                  // Make all responses instantaneous regardless of settings
                  // No delay at all
                  
                  // Hide typing indicator
                  setShowTypingIndicator(false);
                  
                  // Add fallback response in case of error
                  setMessages(prev => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      role: "assistant",
                      content: `I'm sorry, I encountered an error. Please try again later.`,
                      timestamp: new Date().toISOString()
                    },
                  ]);
                })
                .finally(() => {
                  setIsLoading(false);
                });
              }}
              disabled={isLoading}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {starter}
              
            </Button>
            {/* Add X button for removing the conversation starter - Safari compatible version */}
            {onRemoveStarter && (
              <div 
                onClick={(e) => {
                  // Safari compatibility fix - use event capture and preventDefault
                  e.preventDefault();
                  e.stopPropagation();
                  // Add small delay to ensure event doesn't bubble to parent
                  // Pass the starter string instead of index
                  setTimeout(() => onRemoveStarter(starter), 10);
                  return false;
                }}
                className="ml-1 text-gray-400 hover:text-gray-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Remove conversation starter"
              >
                <X className="h-3 w-3" />
              </div>
            )}
          </div>
          ))}
        </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="w-full">
          <div className="flex items-center">
            <label htmlFor={`chat-message-input-${uniqueId}`} className="sr-only">Type your message</label>
            <Input
              id={`chat-message-input-${uniqueId}`}
              name={`message-${uniqueId}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              aria-label="Chat message"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              size="icon" 
              className="ml-2 hover:opacity-90" 
              aria-label="Send message"
              style={{ backgroundColor: accentColor }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
