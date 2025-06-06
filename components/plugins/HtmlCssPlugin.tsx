import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';

interface HtmlCssPluginProps {
  connected?: boolean;
  onConnect: () => void;
  agentId?: string;
  agentName?: string;
  accentColor?: string;
  backgroundColor?: string;
  welcomeMessage?: string;
}

const HtmlCssPlugin = ({ 
  connected = false,
  onConnect,
  agentId = '',
  agentName = 'AI Assistant',
  accentColor = '#3B82FF',
  backgroundColor = '#F3F4F6',
  welcomeMessage = 'Hello! How can I help you today?'
}: HtmlCssPluginProps): React.ReactNode => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  
  // Base URL for the API - use localhost:3006 for local testing
  const baseUrl = typeof window !== 'undefined' ? 
    process.env.NODE_ENV === 'development' ? 'http://localhost:3006' : `${window.location.protocol}//${window.location.host}` : 
    'https://agentivehub.com';
  
  // Generate embed code snippets
  const htmlCode = `<!-- Agentive Chatbot Widget -->
<script src="${baseUrl}/api/embed/chatbot.js" 
  data-agent-id="${agentId}" 
  data-accent-color="${accentColor}" 
  data-background-color="${backgroundColor}" 
  data-position="bottom-right"
  data-welcome-message="${welcomeMessage}"
  data-title="Chat with ${agentName}"
  async>
</script>`;

  const reactCode = `import { useEffect } from 'react';

export default function ChatWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "${baseUrl}/api/embed/chatbot.js";
    script.async = true;
    script.dataset.agentId = "${agentId}";
    script.dataset.accentColor = "${accentColor}";
    script.dataset.backgroundColor = "${backgroundColor}";
    script.dataset.position = "bottom-right";
    script.dataset.welcomeMessage = "${welcomeMessage}";
    script.dataset.title = "Chat with ${agentName}";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return null; // This component doesn't render anything
}`;

  const pythonCode = `import requests

# Initialize the API key and agent ID
api_key = "YOUR_API_KEY" # Replace with your actual API key
agent_id = "${agentId}"

# Create a new chat session
chat_session = requests.post(
    '${baseUrl}/api/chat/session',
    json={
        "api_key": api_key,
        "agent_id": agent_id,
    }
)

# Get the chat session ID
chat_session_id = chat_session.json()["session_id"]
   
# Send a message to the chat session
chat_response = requests.post(
    '${baseUrl}/api/chat',
    json={
        "api_key": api_key,
        "session_id": chat_session_id,
        "agent_id": agent_id,
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)

# Print the response
print(chat_response.json())`;

  const handleCopyCode = () => {
    let codeToCopy = '';
    
    switch(activeTab) {
      case 'html':
        codeToCopy = htmlCode;
        break;
      case 'react':
        codeToCopy = reactCode;
        break;
      case 'python':
        codeToCopy = pythonCode;
        break;
      default:
        codeToCopy = htmlCode;
    }
    
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Check if agent ID is missing and show a warning
  const isAgentIdMissing = !agentId || agentId.trim() === '';
  const agentIdWarning = isAgentIdMissing ? 
    "⚠️ No agent ID detected. Make sure to save your agent configuration first." : 
    "";
  
  const handleConnect = () => {
    setDialogOpen(true);
    onConnect();
  };
  return (
    <>
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-blue-600"
            >
              <path d="M2 12h10M12 2v20M22 12h-5M17 7l5 5-5 5"/>
            </svg>
          </div>
          <div>
            <h3 className="font-medium">HTML & CSS</h3>
            <p className={`text-sm ${connected ? 'text-green-600' : 'text-gray-500'}`}>
              {connected ? 'Connected' : 'Not Connected'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Embed your chatbot directly on your website with custom styling
        </p>
        <div className="mt-4">
          <Button 
            onClick={handleConnect} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-600"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
    
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>HTML & CSS Integration</DialogTitle>
          <DialogDescription>
            Copy the code below to embed your chatbot on your website.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="python">Python API</TabsTrigger>
            </TabsList>
            <TabsContent value="html" className="mt-4">
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                  {htmlCode}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="react" className="mt-4">
              <div className="relative">
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                  {isAgentIdMissing && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                      {agentIdWarning}
                    </div>
                  )}
                  <pre className="text-xs whitespace-pre-wrap">{reactCode}</pre>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="python" className="mt-4">
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                  {pythonCode}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-2">
          <Label htmlFor="allowed-domains">Allowed Domains (Optional)</Label>
          <Input 
            id="allowed-domains" 
            placeholder="example.com, mysite.org" 
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to allow all domains, or enter comma-separated domains to restrict embedding
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={handleCopyCode} className="flex items-center gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default HtmlCssPlugin;
