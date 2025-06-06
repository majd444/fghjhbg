# Sevalla Deployment Guide for SaaS Chatbot Backend

This guide provides step-by-step instructions for deploying the SaaS chatbot backend server on Sevalla, including Auth0 integration, database persistence, and multi-platform plugin support.

## Prerequisites

Before deploying to Sevalla, ensure you have:

1. A Sevalla account (sign up at [https://sevalla.com](https://sevalla.com) if you don't have one)
2. The Sevalla CLI installed on your local machine
3. Your project code ready for deployment
4. API keys for any third-party services your chatbot uses

## Project Structure Overview

The backend server consists of:

- Express.js server with API endpoints for:
  - API key management
  - API usage tracking
  - Plugin interaction logging
  - HTML & CSS plugin integration
- SQLite database for persistence
- Environment variables for configuration

## Step 1: Prepare Your Project for Sevalla

### Install Sevalla CLI

```bash
npm install -g @sevalla/cli
```

### Login to Sevalla

```bash
sevalla login
```

### Initialize Sevalla in Your Project

Navigate to your backend server directory and run:

```bash
cd server
sevalla init
```

This will create a `sevalla.json` configuration file in your project.

## Step 2: Configure Auth0 Integration

### Auth0 Configuration

1. **Set Up Auth0 Application**
   - Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
   - Navigate to Applications > Applications
   - Select your existing application or create a new Regular Web Application
   - Configure the following settings:
     - Allowed Callback URLs: `https://your-sevalla-app-url.sevalla.app/callback, https://your-frontend-url.netlify.app/callback`
     - Allowed Logout URLs: `https://your-sevalla-app-url.sevalla.app, https://your-frontend-url.netlify.app`
     - Allowed Web Origins: `https://your-sevalla-app-url.sevalla.app, https://your-frontend-url.netlify.app`

2. **Set Up Auth0 API**
   - Navigate to Applications > APIs
   - Select your existing API or create a new one
   - Note the API Identifier (audience) value

3. **Enable Social Connections**
   - Navigate to Authentication > Social
   - Enable and configure the connections you want (Google, GitHub, Microsoft, Apple)

### Environment Variables

Ensure the following Auth0-related environment variables are set in your Sevalla deployment:

```
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://your-api-identifier
NEXT_PUBLIC_AUTH0_REDIRECT_URI=https://your-sevalla-app-url.sevalla.app/callback
```

## Step 3: Configure Sevalla for Your Project

Edit the `sevalla.json` file to match your project requirements:

```json
{
  "name": "chatbot-backend",
  "type": "node",
  "env": "production",
  "region": "us-east-1",
  "resources": {
    "database": {
      "type": "sqlite",
      "persistent": true
    }
  },
  "build": {
    "command": "npm install"
  },
  "start": {
    "command": "node index.js"
  },
  "port": 3001,
  "scale": {
    "min": 1,
    "max": 5
  }
}
```

## Step 3: Set Up Environment Variables

Sevalla allows you to set environment variables securely. You'll need to configure:

```bash
# Set environment variables
sevalla env set DEFAULT_API_KEY=your_default_api_key
sevalla env set API_USAGE_ENDPOINT=https://your-app.sevalla.app/api/usage/track
sevalla env set PLUGIN_INTERACTION_ENDPOINT=https://your-app.sevalla.app/api/embed/chat
sevalla env set NEXT_PUBLIC_APP_URL=https://your-frontend-app.com
```

## Step 4: Configure Database Persistence

Since we're using SQLite, we need to ensure data persistence. Sevalla supports persistent storage for SQLite databases:

```bash
sevalla storage create --name chatbot-db --size 1GB
sevalla storage mount --name chatbot-db --path /app/data
```

Update your server code to use the persistent storage path:

```javascript
// In index.js
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/app/data/chatbot.db' 
  : './chatbot.db';

const db = new Database(dbPath);
```

## Step 5: Deploy to Sevalla

Deploy your application to Sevalla:

```bash
sevalla deploy
```

This will build and deploy your application to Sevalla's infrastructure.

## Step 6: Configure Your Frontend

Update your frontend application to use the new Sevalla backend URL:

1. Set the `API_USAGE_ENDPOINT` environment variable in your frontend app to point to your Sevalla deployment
2. Update the enhanced HTML & CSS plugin to use the Sevalla backend URL
3. Update the embed script to point to your Sevalla backend

## Step 7: Verify the Deployment

After deployment, verify that:

1. The backend server is running correctly
2. API keys are being managed securely
3. API usage is being tracked properly
4. The HTML & CSS plugin integration is working

You can check the logs to monitor your application:

```bash
sevalla logs
```

## Monitoring and Scaling

Sevalla provides monitoring and scaling capabilities:

- View application metrics: `sevalla metrics`
- Scale your application: `sevalla scale --min 2 --max 10`
- Set up alerts: `sevalla alerts create --metric cpu --threshold 80`

## Security Considerations

1. **API Key Management**: API keys are stored securely in environment variables and never exposed directly to users.
2. **Rate Limiting**: The server includes rate limiting to prevent abuse.
3. **CORS**: CORS is configured to allow only specific origins.
4. **Helmet**: Security headers are set using Helmet middleware.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

```bash
# Check if the database file exists
sevalla exec -- ls -la /app/data

# Verify database permissions
sevalla exec -- chmod 644 /app/data/chatbot.db
```

### API Tracking Not Working

If API tracking isn't working:

   Set up regular database backups using Sevalla's backup functionality:

   ```bash
   sevalla backup create --volume data
   ```

   Schedule regular backups:

   ```bash
   sevalla backup schedule --volume data --cron "0 0 * * *"
   ```

## Step 9: Multi-Platform Plugin Configuration

The SaaS chatbot backend supports multiple integration platforms through its plugin architecture:

### Available Plugins

1. **WordPress Plugin**
   - Allows embedding chatbots on WordPress sites
   - Supports custom styling and positioning
   - Handles webhook events from WordPress

2. **WhatsApp Plugin**
   - Connects chatbots to WhatsApp Business API
   - Handles message sending and receiving
   - Supports media messages and quick replies

3. **HTML & CSS Plugin**
   - Enables direct embedding on any website
   - Provides customizable chat widget
   - Supports domain whitelisting for security

### Plugin Configuration

To configure plugins on your deployed instance:

1. **Access the Plugin Management API**

   ```
   POST https://your-sevalla-app-url.sevalla.app/api/plugins
   ```

   With the following JSON body:

   ```json
   {
     "platform": "html-css",
     "agentId": "your-agent-id",
     "config": {
       "allowedDomains": ["example.com"],
       "primaryColor": "#0088cc",
       "position": "bottom-right"
     }
   }
   ```

2. **Test Plugin Integration**

   For HTML & CSS plugin, test the embed code:

   ```html
   <script src="https://your-sevalla-app-url.sevalla.app/api/embed/chatbot.js?id=your-plugin-id"></script>
   ```

## Step 10: Monitor and Maintain

After deployment, you can monitor your application using the Sevalla dashboard:

```bash
sevalla dashboard
```

This will open the Sevalla dashboard in your browser, where you can:

- Monitor resource usage
- View logs
- Manage environment variables
- Scale your application

## Conclusion

Your SaaS chatbot backend is now deployed on Sevalla with:

- Secure Auth0 authentication with multiple providers (Google, GitHub, Microsoft, Apple)
- Persistent SQLite database with user accounts linked to Auth0 IDs
- Multi-platform plugin architecture supporting WordPress, WhatsApp, and HTML & CSS embedding
- API key management and usage tracking
- Embedded chat widget functionality

For more information, refer to the [Sevalla documentation](https://docs.sevalla.com).
