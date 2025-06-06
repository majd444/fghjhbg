"use client"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AgentiveWidget } from "@/components/agentive/agentive-widget"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function AgentiveWidgetDemo() {
  const [agentId, setAgentId] = useState("25fd29f8-8365-4ce2-b3f2-f78e1b57f148");
  const [agentName, setAgentName] = useState("Demo Assistant");
  const [buttonText, setButtonText] = useState("Chat with AI");
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Agentive Widget Demo</h1>
            
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Widget Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Agent ID</label>
                  <Input 
                    value={agentId} 
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="Enter agent ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Agent Name</label>
                  <Input 
                    value={agentName} 
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter agent name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <Input 
                    value={buttonText} 
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <Select value={position} onValueChange={(value) => setPosition(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Integration Example</h2>
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
{`"use client"
import { AgentiveWidget } from "@/components/agentive/agentive-widget"

export default function YourPage() {
  return (
    <div>
      {/* Your page content */}
      <h1>Your Page Content</h1>
      
      {/* Agentive Widget */}
      <AgentiveWidget
        agentId="${agentId}"
        agentName="${agentName}"
        buttonText="${buttonText}"
        position="${position}"
      />
    </div>
  )
}`}
                </pre>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Demo Content</h2>
              <p className="mb-4">
                This is a demo page showing how the Agentive Widget can be integrated into any page of your application.
                The widget appears as a floating button that opens a chat interface when clicked.
              </p>
              <p className="mb-4">
                You can customize the widget's appearance and behavior using the configuration options above.
                Try changing the settings to see how the widget updates in real-time.
              </p>
              <p>
                The Agentive Widget is powered by the Agentive API, which provides advanced AI capabilities for your application.
                You can use it to add chatbot functionality to any page with minimal code.
              </p>
            </Card>
          </div>
        </main>
      </div>

      {/* The actual widget */}
      <AgentiveWidget
        agentId={agentId}
        agentName={agentName}
        buttonText={buttonText}
        position={position}
      />
    </div>
  )
}
