"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import useIntegrations, { Integration } from "@/hooks/integrations/useIntegrations";
import { WordPressLogo, WhatsAppLogo, InstagramLogo, MessengerLogo, TelegramLogo, DiscordLogo } from "@/components/ui/platform-logos";

export default function IntegrationsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const { 
    integrations, 
    loading, 
    error, 
    saveIntegration, 
    disconnectIntegration 
  } = useIntegrations();
  
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);
  
  const filteredIntegrations = activeTab === "all" 
    ? integrations 
    : integrations.filter(integration => 
        activeTab === "connected" ? integration.isConnected : !integration.isConnected
      );

  // Handle input changes in the form
  const handleInputChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset form when dialog opens with a new integration
  useEffect(() => {
    if (selectedIntegration) {
      // Initialize with existing credentials if available
      setFormState(selectedIntegration.credentials || {});
    }
  }, [selectedIntegration]);

  const handleConnectIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsDialogOpen(true);
  };

  const handleSaveIntegration = async () => {
    if (selectedIntegration) {
      setIsSaving(true);
      
      try {
        const success = await saveIntegration(selectedIntegration.id, formState);
        
        if (success) {
          setIsDialogOpen(false);
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDisconnectIntegration = async (integrationId: string) => {
    setIsDisconnecting(integrationId);
    
    try {
      await disconnectIntegration(integrationId);
    } finally {
      setIsDisconnecting(null);
    }
  };

  // Show loading state when fetching integrations
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        <span>Loading integration settings...</span>
      </div>
    );
  }
  
  // Show error state if there's an issue
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load integrations</h3>
        <p className="text-red-700">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredIntegrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-lg font-medium">No {activeTab === "connected" ? "connected" : "available"} integrations</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                {activeTab === "connected" 
                  ? "You haven't connected any integrations yet. Connect your first integration to get started." 
                  : "All available integrations are already connected."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      {integration.id === "wordpress" ? (
                        <WordPressLogo />
                      ) : integration.id === "whatsapp" ? (
                        <WhatsAppLogo />
                      ) : integration.id === "instagram" ? (
                        <InstagramLogo />
                      ) : integration.id === "messenger" ? (
                        <MessengerLogo />
                      ) : integration.id === "telegram" ? (
                        <TelegramLogo />
                      ) : integration.id === "discord" ? (
                        <DiscordLogo />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${integration.color}`}>
                          <span className="text-lg font-semibold">{integration.initialLetter}</span>
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        {integration.isConnected && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <CardDescription>{integration.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    {integration.isConnected ? (
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          className="flex-1" 
                          onClick={() => handleDisconnectIntegration(integration.id)}
                          disabled={isDisconnecting === integration.id}
                        >
                          {isDisconnecting === integration.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Disconnecting
                            </>
                          ) : (
                            'Disconnect'
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleConnectIntegration(integration)}
                        >
                          Settings
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleConnectIntegration(integration)}
                      >
                        Connect
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Configure your {selectedIntegration?.name} integration settings below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                id="api-key" 
                placeholder="Enter your API key" 
                value={formState["api-key"] || ""}
                onChange={(e) => handleInputChange("api-key", e.target.value)}
              />
            </div>
            
            {selectedIntegration?.id === "wordpress" && (
              <div className="space-y-2">
                <Label htmlFor="site-url">WordPress Site URL</Label>
                <Input 
                  id="site-url" 
                  type="url" 
                  placeholder="https://yoursite.com" 
                  value={formState["site-url"] || ""}
                  onChange={(e) => handleInputChange("site-url", e.target.value)}
                />
              </div>
            )}

            {selectedIntegration?.id === "discord" && (
              <div className="space-y-2">
                <Label htmlFor="bot-token">Bot Token</Label>
                <Input 
                  id="bot-token" 
                  placeholder="Enter your Discord bot token" 
                  value={formState["bot-token"] || ""}
                  onChange={(e) => handleInputChange("bot-token", e.target.value)}
                />
              </div>
            )}
            
            {selectedIntegration?.id === "whatsapp" && (
              <div className="space-y-2">
                <Label htmlFor="phone-number-id">Phone Number ID</Label>
                <Input 
                  id="phone-number-id" 
                  placeholder="Enter your WhatsApp phone number ID" 
                  value={formState["phone-number-id"] || ""}
                  onChange={(e) => handleInputChange("phone-number-id", e.target.value)}
                />
              </div>
            )}
            
            {selectedIntegration?.id === "telegram" && (
              <div className="space-y-2">
                <Label htmlFor="bot-token">Bot Token</Label>
                <Input 
                  id="bot-token" 
                  placeholder="Enter your Telegram bot token" 
                  value={formState["bot-token"] || ""}
                  onChange={(e) => handleInputChange("bot-token", e.target.value)}
                />
              </div>
            )}
            
            {selectedIntegration?.setupGuideUrl && (
              <div className="mt-4">
                <a 
                  href={selectedIntegration.setupGuideUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  View setup guide
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveIntegration} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                selectedIntegration?.isConnected ? 'Update' : 'Connect'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8 px-4 py-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <span className="text-sm text-gray-600">More integrations coming soon!</span>
        </div>
        <Button variant="ghost" size="sm">
          Request Integration
        </Button>
      </div>
    </div>
  );
}
