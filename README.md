# SaaS Chatbot Platform

A multi-platform chatbot integration system with Auth0 authentication, SQLite database, and plugin architecture. This platform allows users to create and deploy AI chatbots across multiple platforms including websites, WordPress, and WhatsApp.

## Features

### Authentication & User Management
- **Auth0 Integration**: Secure user authentication with multiple providers:
  - Google Sign-In
  - GitHub Authentication
  - Microsoft Account Login
  - Apple ID Sign-In
- **User Profile Management**: Store and manage user profiles with Auth0 user IDs
- **HTTP-only Cookies**: Secure authentication with HTTP-only cookies
- **Role-Based Access Control**: Different permission levels for users

### Multi-Platform Integration
- **WordPress Plugin**: Embed chatbots on WordPress sites
- **WhatsApp Integration**: Connect chatbots to WhatsApp Business API
- **HTML & CSS Embedding**: Customizable chat widget for any website
  - Custom styling and branding options
  - Position control (bottom-right, bottom-left, etc.)
  - Domain whitelisting for security
- **Extensible Architecture**: Support for additional platforms (Instagram, Messenger, etc.)

### Database & Storage
- **SQLite Persistence**: Reliable database storage for all chatbot data
- **User Account Management**: Link Auth0 profiles to database accounts
- **Plugin Configuration Storage**: Store platform-specific settings
- **Conversation History**: Track and store chat interactions

### API & Backend
- **RESTful API Endpoints**: Comprehensive API for all platform functions
- **Rate Limiting**: Prevent API abuse
- **Security Headers**: Helmet integration for secure HTTP headers
- **Health Monitoring**: Health check endpoint for deployment monitoring

## Deployment

### Backend (Sevalla)

#### Prerequisites
- GitHub account with repository access
- Sevalla account and CLI installed (`npm install -g @sevalla/cli`)
- Auth0 account with configured application and API

#### Deployment Steps

1. **Initialize GitHub Repository**
   ```bash
   npm run github-init
   ```
   This script will:
   - Initialize a Git repository if not already done
   - Create a `.gitignore` file if needed
   - Add and commit all files
   - Connect to your GitHub repository
   - Push the code to GitHub

2. **Verify Environment Variables**
   ```bash
   npm run check-env
   ```
   Ensure all required environment variables are set in your `.env` file:

3. **Configure Auth0**
   - In your Auth0 Dashboard, update the callback URLs to include your Sevalla deployment URL
   - Configure the API permissions and scopes
   - Enable the social connections you want to use (Google, GitHub, Microsoft, Apple)

4. **Deploy to Sevalla**
   ```bash
   npm run sevalla-deploy
   ```
   This will:
   - Check for Sevalla CLI installation
   - Validate your Sevalla configuration
   - Build the application
   - Deploy to Sevalla with database persistence

5. **Configure Environment Variables in Sevalla**
   - `NODE_ENV`: Set to `production` for production deployment
   - `PORT`: The port to run the server on (default: 3002)
   - `DEFAULT_API_KEY`: API key for authenticating API requests
   - `NEXT_PUBLIC_APP_URL`: The URL of your frontend application
   - `NEXT_PUBLIC_AUTH0_DOMAIN`: Your Auth0 domain
   - `NEXT_PUBLIC_AUTH0_CLIENT_ID`: Your Auth0 client ID
   - `NEXT_PUBLIC_AUTH0_AUDIENCE`: Your Auth0 audience URL
   - `DB_PATH`: Path to the database file (default: `/app/data/chatbot.sqlite`)

### Frontend (Netlify)

The frontend is deployed separately on Netlify with Auth0 integration.

1. **Connect to GitHub Repository**
   - Link your GitHub repository to Netlify

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Install Auth0 Plugin**
   - Add the official Netlify Auth0 plugin from the Netlify plugins directory
   - Configure the plugin with your Auth0 credentials

4. **Set Environment Variables**
   - Configure the same Auth0 environment variables as the backend
   - Set `NEXT_PUBLIC_API_URL` to point to your Sevalla backend URL

5. **Configure Redirects**
   - Add necessary redirects in `netlify.toml` for Auth0 callback handling

## Development

### Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
   NEXT_PUBLIC_AUTH0_AUDIENCE=https://your-api-identifier
   NEXT_PUBLIC_AUTH0_REDIRECT_URI=http://localhost:3000/callback
   NODE_ENV=development
   PORT=3002
   DEFAULT_API_KEY=dev-api-key
   DB_PATH=./data/chatbot.sqlite
   ```

3. **Initialize Database**
   ```bash
   npm run db-init
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open http://localhost:3002 in your browser

### Plugin Development

To develop new platform plugins:

1. Create a new plugin class in `lib/plugins/` that extends `BasePlugin`
2. Implement required methods: `sendMessage`, `handleWebhook`, `validateConfig`
3. Register the plugin in the plugin registry
4. Add database migrations for plugin-specific tables if needed

## Database

The application uses SQLite for data storage with the following structure:

- **accounts**: User accounts linked to Auth0 IDs
- **agents**: Chatbot agents with configurations
- **plugins**: Plugin configurations for different platforms
- **conversations**: Chat conversation history
- **messages**: Individual messages within conversations
- **api_keys**: API keys for authentication
- **usage**: API usage tracking

**Database Persistence**:
- In development: Database files are stored in the `./data` directory
- In Sevalla: Database is stored in a persistent volume mounted at `/app/data`
- In Netlify: Database is not persistent between deployments (use Sevalla for backend)

## API Documentation

### Authentication Endpoints

- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/logout` - Logout current user
- `GET /api/auth/callback` - Auth0 callback handler

### User & Account Endpoints

- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile
- `GET /api/account` - Get account information
- `POST /api/account` - Update account settings

### Plugin Endpoints

- `GET /api/plugins` - List available plugins
- `GET /api/plugins/[id]` - Get plugin details
- `POST /api/plugins/[id]/configure` - Configure plugin
- `DELETE /api/plugins/[id]` - Remove plugin configuration
- `GET /api/plugins/[id]/status` - Check plugin connection status

### Webhook Endpoints

- `POST /api/webhooks/[platform]` - Receive platform-specific events
- `GET /api/embed/chat` - Embedded chat interface
- `GET /api/embed/chatbot.js` - Embedded chat widget script

### Health & Monitoring

- `GET /api/health` - Health check endpoint
- `GET /api/status` - System status information

## Troubleshooting

### Auth0 Integration Issues

- **Login Fails**: Verify Auth0 domain, client ID, and audience in environment variables
- **Callback Errors**: Check that callback URLs are correctly configured in Auth0 dashboard
- **Missing User ID**: Ensure middleware is correctly extracting user_id from cookies
- **Social Login Issues**: Verify social connections are enabled in Auth0 dashboard

### Database Issues

- **Database Not Found**: Check DB_PATH environment variable and ensure directory exists
- **Permission Errors**: Verify file permissions on the database directory
- **Data Loss on Deployment**: Ensure volume mounts are correctly configured in Sevalla

### Plugin Connection Issues

- **WordPress Plugin Not Connecting**: Verify API keys and URLs in plugin configuration
- **WhatsApp Integration Failing**: Check WhatsApp Business API credentials
- **Embed Script Not Loading**: Verify allowed domains in HTML & CSS plugin configuration

### Deployment Issues

- **Sevalla CLI Not Found**: Install with `npm install -g @sevalla/cli`
- **Environment Variables Missing**: Run `npm run check-env` to identify missing variables
- **Build Failures**: Check for syntax errors or missing dependencies
- **Auth0 Redirect Issues**: Verify frontend and backend URLs match Auth0 configuration

- `/api/agents`: Manage chatbot agents
- `/api/plugins`: Configure and manage platform integrations
- `/api/embed`: Endpoints for embedded chat widget
- `/api/account`: User account management

## Authentication

The system uses Auth0 for authentication and automatically creates user accounts in the database when users log in. Each user has a unique account ID that is used to associate their data across the platform.
