"use client"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AgentiveChat } from "@/components/agentive/agentive-chat"

export default function AgentiveChatPage({ params }: { params: { id: string } }) {
  const agentId = params.id;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          <AgentiveChat agentId={agentId} />
        </main>
      </div>
    </div>
  )
}
