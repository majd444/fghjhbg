import { useState, useEffect } from "react";

// Types
export interface IntegrationCredential {
  id: string;
  name: string;
  credentials: Record<string, string>;
  isActive: boolean;
  updatedAt?: Date;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  initialLetter: string;
  color: string;
  isConnected: boolean;
  setupGuideUrl?: string;
  credentials?: Record<string, string>;
}

// Hook for managing integrations
export default function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "agentive",
      name: "Agentive",
      description: "Connect your chatbot to the Agentive API",
      icon: "/images/integrations/agentive.svg",
      initialLetter: "A",
      color: "bg-blue-600 text-white",
      isConnected: false,
      setupGuideUrl: "https://agentivehub.com/docs"
    },
    {
      id: "wordpress",
      name: "WordPress",
      description: "Add your chatbot to WordPress sites",
      icon: "/images/integrations/wordpress.svg",
      initialLetter: "W",
      color: "bg-blue-100 text-blue-700",
      isConnected: false,
      setupGuideUrl: "https://wordpress.org/plugins/"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Connect to WhatsApp Business API",
      icon: "/images/integrations/whatsapp.svg",
      initialLetter: "W",
      color: "bg-green-100 text-green-700",
      isConnected: false,
      setupGuideUrl: "https://business.whatsapp.com/"
    },
    {
      id: "html-css",
      name: "HTML & CSS",
      description: "Embed your chatbot on any website",
      icon: "/images/integrations/html-css.svg",
      initialLetter: "H",
      color: "bg-blue-100 text-blue-600",
      isConnected: false,
      setupGuideUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML"
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Connect to Instagram messaging",
      icon: "/images/integrations/instagram.svg",
      initialLetter: "I",
      color: "bg-purple-100 text-purple-700",
      isConnected: false,
      setupGuideUrl: "https://developers.facebook.com/docs/instagram-api/"
    },
    {
      id: "messenger",
      name: "Messenger",
      description: "Add to Facebook Messenger",
      icon: "/images/integrations/messenger.svg",
      initialLetter: "M",
      color: "bg-indigo-100 text-indigo-700",
      isConnected: false,
      setupGuideUrl: "https://developers.facebook.com/docs/messenger-platform/"
    },
    {
      id: "telegram",
      name: "Telegram",
      description: "Deploy as a Telegram bot",
      icon: "/images/integrations/telegram.svg",
      initialLetter: "T",
      color: "bg-sky-100 text-sky-700",
      isConnected: false,
      setupGuideUrl: "https://core.telegram.org/bots/api"
    },
    {
      id: "discord",
      name: "Discord",
      description: "Add to Discord servers",
      icon: "/images/integrations/discord.svg",
      initialLetter: "D",
      color: "bg-indigo-100 text-indigo-700",
      isConnected: false,
      setupGuideUrl: "https://discord.com/developers/docs/intro"
    }
  ]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch integrations from API
  const fetchIntegrations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use absolute URL to avoid routing issues
      const response = await fetch('/api/integrations', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      // Check response type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response:', contentType);
        const text = await response.text();
        console.error('Response text:', text.substring(0, 500));
        throw new Error(`API returned non-JSON response: ${contentType}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch integrations');
      }
      
      // Merge API data with our static integration definitions
      const updatedIntegrations = integrations.map(integration => {
        const savedIntegration = data.integrations?.find(
          (item: IntegrationCredential) => item.id === integration.id
        );
        
        if (savedIntegration) {
          return {
            ...integration,
            isConnected: savedIntegration.isActive,
            credentials: savedIntegration.credentials
          };
        }
        
        return integration;
      });
      
      setIntegrations(updatedIntegrations);
    } catch (err: any) {
      console.error('Error fetching integrations:', err);
      setError(err.message || 'Failed to fetch integrations');
      
      // Even if the API call fails, we still want to display the integrations UI
      // Just mark them all as not connected
      return setIntegrations(integrations.map(integration => ({
        ...integration,
        isConnected: false,
        credentials: undefined
      })));
    } finally {
      setLoading(false);
    }
  };

  // Connect/save an integration
  const saveIntegration = async (
    integrationId: string, 
    credentials: Record<string, string>
  ) => {
    setError(null);
    
    try {
      const integration = integrations.find(i => i.id === integrationId);
      
      if (!integration) {
        throw new Error('Integration not found');
      }
      
      const payload = {
        id: integrationId,
        name: integration.name,
        credentials,
        isActive: true
      };
      
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save integration');
      }
      
      // Update local state with new connection status
      setIntegrations(prev => 
        prev.map(item => 
          item.id === integrationId 
            ? { ...item, isConnected: true, credentials } 
            : item
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error saving integration:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  // Disconnect an integration
  const disconnectIntegration = async (integrationId: string) => {
    setError(null);
    
    try {
      const response = await fetch(`/api/integrations?id=${integrationId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to disconnect integration');
      }
      
      // Update local state
      setIntegrations(prev => 
        prev.map(item => 
          item.id === integrationId 
            ? { ...item, isConnected: false, credentials: undefined } 
            : item
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error disconnecting integration:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  // Fetch integrations on mount
  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    integrations,
    loading,
    error,
    saveIntegration,
    disconnectIntegration,
    refreshIntegrations: fetchIntegrations
  };
}
