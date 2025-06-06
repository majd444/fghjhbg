# Deployment Guide

This guide provides step-by-step instructions for deploying the SaaS chatbot backend to GitHub and Sevalla.

## GitHub Deployment

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and sign in to your account
   - Click on the "+" icon in the top right corner and select "New repository"
   - Name your repository (e.g., `saas-chatbot-backend`)
   - Choose "Private" for repository visibility
   - Click "Create repository"

2. **Push Your Code to GitHub**
   ```bash
   # Navigate to your project directory
   cd /path/to/frontend_backup_20250516_105537
   
   # Initialize Git repository (if not already done)
   git init
   git branch -m main
   
   # Add all files to Git
   git add .
   
   # Commit the changes
   git commit -m "Initial commit with Auth0 integration and database fixes"
   
   # Add the remote repository
   git remote add origin https://github.com/yourusername/saas-chatbot-backend.git
   
   # Push to GitHub
   git push -u origin main
   ```

## Sevalla Deployment

### Prerequisites

1. **Install Sevalla CLI**
   ```bash
   npm install -g sevalla-cli
   ```

2. **Log in to Sevalla**
   ```bash
   sevalla login
   ```

### Deployment Options

#### Option 1: Using the Deployment Script

1. **Make the deployment script executable**
   ```bash
   chmod +x deploy-sevalla.js
   ```

2. **Run the deployment script**
   ```bash
   node deploy-sevalla.js
   ```

#### Option 2: Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Sevalla**
   ```bash
   sevalla deploy
   ```

### Environment Variables

After deployment, configure the following environment variables in the Sevalla dashboard:

- `NODE_ENV`: Set to `production`
- `PORT`: The port to run the server on (default: 3002)
- `DEFAULT_API_KEY`: API key for authenticating API requests
- `NEXT_PUBLIC_APP_URL`: The URL of your frontend application
- `NEXT_PUBLIC_AUTH0_DOMAIN`: Your Auth0 domain
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`: Your Auth0 client ID
- `NEXT_PUBLIC_AUTH0_AUDIENCE`: Your Auth0 audience URL

## Database Persistence

Sevalla uses volumes to ensure database persistence. The `sevalla.config.js` file includes a volume configuration that mounts the `/app/data` directory to ensure your SQLite database is preserved between deployments.

## Connecting Frontend to Backend

After deploying your backend to Sevalla, update your frontend environment variables to point to the new backend URL:

1. In your frontend project, update the `.env` file:
   ```
   NEXT_PUBLIC_API_URL=https://your-sevalla-app-url.sevalla.app
   ```

2. Redeploy your frontend to Netlify

## Verifying Deployment

1. Check the health endpoint: `https://your-sevalla-app-url.sevalla.app/api/health`
2. Test the authentication flow by logging in through your frontend application
3. Monitor the logs in the Sevalla dashboard for any errors

## Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**
   - Check that Auth0 environment variables are correctly set
   - Verify that the Auth0 audience matches between frontend and backend

2. **Database Connection Issues**
   - Ensure the volume is correctly mounted
   - Check file permissions on the data directory

3. **CORS Errors**
   - Verify that your backend allows requests from your frontend domain

For additional help, refer to the [Sevalla documentation](https://docs.sevalla.app) or contact support.
