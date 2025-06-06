import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { IntegrationFeedback } from "./integration-feedback";
import { IntegrationTestPanel } from "./integration-test-panel";
import HtmlCssPlugin from "./plugins/HtmlCssPlugin";
import {
  WordPressLogo,
  WhatsAppLogo,
  InstagramLogo,
  MessengerLogo,
  TelegramLogo,
  DiscordLogo,
  AgentiveLogo
} from "@/components/ui/platform-logos";

interface IntegrationCardProps {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color: string;
  initialLetter: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
  isDisconnecting?: boolean;
  agentId?: string;
  agentName?: string;
  accentColor?: string;
  backgroundColor?: string;
  welcomeMessage?: string;
}

export function IntegrationCard({ 
  id, 
  name, 
  description, 
  color, 
  initialLetter, 
  isConnected,
  onConnect,
  onDisconnect,
  isDisconnecting = false,
  agentId = '',
  agentName = '',
  accentColor = '#3B82FF',
  backgroundColor = '#F3F4F6',
  welcomeMessage = 'Hello! How can I help you today?'
}: IntegrationCardProps) {
  const [showTestPanel, setShowTestPanel] = useState(false);

  // For HTML & CSS plugin, we'll use our custom component
  if (id === "html-css") {
    return (
      <HtmlCssPlugin
        connected={isConnected}
        onConnect={onConnect}
        agentId={agentId}
        agentName={agentName}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        welcomeMessage={welcomeMessage}
      />
    );
  }
  
  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      <div className="flex items-start p-4">
        <div className="mr-4">
          {id === "wordpress" ? (
            <WordPressLogo />
          ) : id === "whatsapp" ? (
            <WhatsAppLogo />
          ) : id === "instagram" ? (
            <InstagramLogo />
          ) : id === "messenger" ? (
            <MessengerLogo />
          ) : id === "telegram" ? (
            <TelegramLogo />
          ) : id === "discord" ? (
            <DiscordLogo />
          ) : id === "agentive" ? (
            <AgentiveLogo />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
              <span className="text-lg font-semibold">{initialLetter}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            {isConnected ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                Not Connected
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {isConnected ? (
              <>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={onDisconnect}
                  disabled={isDisconnecting}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTestPanel(!showTestPanel)}
                >
                  <Wrench className="h-4 w-4 mr-1.5" />
                  Test Integration
                  {showTestPanel ? (
                    <ChevronUp className="h-4 w-4 ml-1.5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  )}
                </Button>
                
                <IntegrationFeedback 
                  _integrationId={id}
                  integrationName={name}
                />
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onConnect}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {isConnected && showTestPanel && (
        <div className="border-t">
          <IntegrationTestPanel 
            integrationId={id}
            integrationName={name}
          />
        </div>
      )}
    </div>
  );
}
