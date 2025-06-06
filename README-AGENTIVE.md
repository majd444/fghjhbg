# Agentive API Integration

This document provides a quick overview of the Agentive API integration implemented in this application.

## Overview

The Agentive API integration allows you to add powerful AI chatbot capabilities to your application using the Agentive platform. The integration includes:

1. **API Service Layer** - Handles communication with the Agentive API
2. **Server-side API Endpoint** - Manages chat sessions and proxies requests to Agentive
3. **Reusable Components** - Chat interface and widget components for easy integration
4. **Demo Page** - Showcases the widget with customization options

## Components

### 1. Agentive API Service

Located at: `/lib/services/agentive-api.ts`

This service provides functions to:
- Create new chat sessions with the Agentive API
- Send messages to existing chat sessions
- Handle API responses

### 2. API Endpoint

Located at: `/app/api/agentive-chat/route.ts`

This Next.js API route:
- Manages chat sessions for different agents
- Proxies requests to the Agentive API
- Returns responses in a consistent format

### 3. Chat Components

#### Agentive Chat Component

Located at: `/components/agentive/agentive-chat.tsx`

A reusable chat interface that:
- Displays messages in a conversation format
- Handles user input and API communication
- Can be embedded in any page

#### Agentive Widget Component

Located at: `/components/agentive/agentive-widget.tsx`

A floating chat widget that:
- Can be added to any page with minimal code
- Appears as a button that expands to a chat interface
- Is fully customizable (position, text, appearance)

### 4. Demo Page

Located at: `/app/demo/agentive-widget/page.tsx`

A demonstration page that:
- Shows how to use the Agentive Widget
- Provides live customization options
- Includes code examples for integration

## Configuration

The integration uses these environment variables:

```
AGENTIVE_API_KEY=c8bc40f2-e83d-4e92-ac2b-d5bd6444da0a
AGENTIVE_ASSISTANT_ID=25fd29f8-8365-4ce2-b3f2-f78e1b57f148
```

These are configured in:
- `.env.local` for local development
- `netlify.toml` for Netlify deployment

## Usage

### Adding the Chat Interface to a Page

```tsx
import { AgentiveChat } from "@/components/agentive/agentive-chat"

export default function YourPage() {
  return (
    <div>
      <h1>Your Page Title</h1>
      <div className="h-[500px]">
        <AgentiveChat agentId="your-agent-id" />
      </div>
    </div>
  )
}
```

### Adding the Chat Widget to a Page

```tsx
import { AgentiveWidget } from "@/components/agentive/agentive-widget"

export default function YourPage() {
  return (
    <div>
      <h1>Your Page Content</h1>
      {/* Other content */}
      
      <AgentiveWidget
        agentId="your-agent-id"
        buttonText="Chat with AI"
        position="bottom-right"
      />
    </div>
  )
}
```

## Testing Locally

1. Start the development server:

```bash
npm run dev
```

2. Access the demo page at: http://localhost:3000/demo/agentive-widget

3. Test the chat interface at: http://localhost:3000/chat/agentive/25fd29f8-8365-4ce2-b3f2-f78e1b57f148

4. View the agents page with the new Agentive Chat option: http://localhost:3000/agents

## Deployment

For deployment instructions, see:
- `AGENTIVE_INTEGRATION.md` for detailed Agentive integration information
- `NETLIFY_DEPLOYMENT.md` for Netlify deployment instructions

## Additional Resources

- [Agentive API Documentation](https://agentivehub.com/docs)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [React Components Best Practices](https://reactjs.org/docs/thinking-in-react.html)
