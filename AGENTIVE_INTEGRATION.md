# Agentive API Integration Guide

This document explains how to integrate and deploy the Agentive chatbot API with your Next.js application.

## Overview

The Agentive API integration allows you to connect your application to the Agentive AI platform, providing advanced chatbot capabilities. This integration uses the Agentive API endpoints to create chat sessions and send/receive messages.

## Integration Components

1. **Agentive API Service** (`/lib/services/agentive-api.ts`)
   - Handles communication with the Agentive API
   - Manages chat sessions and message exchange

2. **API Route** (`/app/api/agentive-chat/route.ts`)
   - Provides a server-side endpoint for your frontend to communicate with Agentive
   - Manages session persistence

3. **Chat Interface** (`/app/chat/agentive/[id]/page.tsx`)
   - Provides a user interface for interacting with the Agentive chatbot
   - Handles message display and user input

## Configuration

### Environment Variables

The following environment variables need to be set:

```
AGENTIVE_API_KEY=your-api-key
AGENTIVE_ASSISTANT_ID=your-assistant-id
```

These are already configured in `.env.local` and `netlify.toml` with the provided values:
- API Key: `c8bc40f2-e83d-4e92-ac2b-d5bd6444da0a`
- Assistant ID: `25fd29f8-8365-4ce2-b3f2-f78e1b57f148`

## Deployment

### Netlify Deployment

The application is configured for deployment on Netlify. The `netlify.toml` file includes the necessary environment variables for the Agentive API.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Netlify account
3. Click "New site from Git" and select your repository
4. Netlify will automatically detect the Next.js configuration
5. Deploy the site

### Environment Variables on Netlify

The environment variables are already configured in the `netlify.toml` file. If you need to update them:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Add or update the environment variables:
   - `AGENTIVE_API_KEY`
   - `AGENTIVE_ASSISTANT_ID`

## Usage

### Accessing the Agentive Chat

1. Navigate to the Agents page
2. Click on "Agentive Chat" for any agent
3. Start chatting with the Agentive-powered assistant

### API Usage Examples

#### JavaScript/TypeScript

```javascript
// Create a new chat session
const response = await fetch('/api/agentive-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello!' }],
    agentId: 'your-agent-id',
  }),
});

const data = await response.json();
console.log(data.response); // The AI's response
```

#### Python (for external API access)

```python
import requests

# Create a new chat session
response = requests.post(
    'https://your-netlify-site.netlify.app/api/agentive-chat',
    json={
        'messages': [{'role': 'user', 'content': 'Hello!'}],
        'agentId': 'your-agent-id',
    }
)

data = response.json()
print(data['response'])  # The AI's response
```

#### cURL

```bash
# Create a new chat session and send a message
curl -X POST https://your-netlify-site.netlify.app/api/agentive-chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "agentId": "your-agent-id"
  }'
```

## Customization

### Changing the Default Assistant

To use a different Agentive assistant:

1. Update the `AGENTIVE_ASSISTANT_ID` environment variable
2. Redeploy your application

### Styling the Chat Interface

The chat interface uses Tailwind CSS for styling. You can customize the appearance by modifying the classes in `/app/chat/agentive/[id]/page.tsx`.

## Troubleshooting

### Common Issues

1. **API Key Invalid**: Ensure your Agentive API key is correct and active
2. **Network Errors**: Check your network connection and Agentive API status
3. **Session Expiration**: Sessions may expire after a period of inactivity; the application will automatically create a new session

### Debugging

The application logs API requests and responses to the console. Check your browser's developer tools or server logs for error messages.

## Security Considerations

- The API key is stored in environment variables and not exposed to the client
- All API requests are made server-side to protect your credentials
- User messages are sent to the Agentive API and subject to their privacy policy
