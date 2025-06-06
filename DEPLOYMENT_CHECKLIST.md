# Deployment Checklist

Use this checklist to ensure a smooth deployment of the SaaS chatbot backend to GitHub and Sevalla.

## Pre-Deployment Checks

- [ ] All Auth0 integration code is working properly
- [ ] Database connections and migrations are properly configured
- [ ] Environment variables are documented in `.env.example`
- [ ] Health check endpoint is working (`/api/health`)
- [ ] API endpoints are properly authenticated
- [ ] Server entry point is correctly configured in `sevalla.config.js`

## GitHub Deployment

- [ ] Create a new GitHub repository (e.g., `saas-chatbot-backend`)
- [ ] Initialize Git repository locally
  ```bash
  git init
  git branch -m main
  ```
- [ ] Add all files to Git
  ```bash
  git add .
  ```
- [ ] Commit the changes
  ```bash
  git commit -m "Initial commit with Auth0 integration and database fixes"
  ```
- [ ] Add the remote repository
  ```bash
  git remote add origin https://github.com/yourusername/saas-chatbot-backend.git
  ```
- [ ] Push to GitHub
  ```bash
  git push -u origin main
  ```

## Sevalla Deployment

- [ ] Install Sevalla CLI (if not already installed)
  ```bash
  npm install -g sevalla-cli
  ```
- [ ] Log in to Sevalla
  ```bash
  sevalla login
  ```
- [ ] Run the database initialization script
  ```bash
  npm run db-init
  ```
- [ ] Deploy to Sevalla
  ```bash
  npm run sevalla-deploy
  ```
- [ ] Verify deployment status
  ```bash
  sevalla status
  ```

## Post-Deployment Configuration

- [ ] Configure environment variables in Sevalla dashboard:
  - `NODE_ENV`: Set to `production`
  - `PORT`: The port to run the server on (default: 3002)
  - `DEFAULT_API_KEY`: API key for authenticating API requests
  - `NEXT_PUBLIC_APP_URL`: The URL of your frontend application
  - `NEXT_PUBLIC_AUTH0_DOMAIN`: Your Auth0 domain
  - `NEXT_PUBLIC_AUTH0_CLIENT_ID`: Your Auth0 client ID
  - `NEXT_PUBLIC_AUTH0_AUDIENCE`: Your Auth0 audience URL

- [ ] Verify database persistence by checking the volume configuration
- [ ] Test the health check endpoint: `https://your-sevalla-app-url.sevalla.app/api/health`
- [ ] Test authentication flow by logging in through the frontend application

## Frontend Configuration

- [ ] Update frontend environment variables to point to the new backend URL
  ```
  NEXT_PUBLIC_API_URL=https://your-sevalla-app-url.sevalla.app
  ```
- [ ] Redeploy frontend to Netlify
- [ ] Test end-to-end authentication flow

## Monitoring and Maintenance

- [ ] Set up monitoring for the Sevalla deployment
- [ ] Configure alerts for server errors
- [ ] Document the deployment process for future reference
- [ ] Schedule regular database backups

## Troubleshooting Common Issues

- **401 Unauthorized Errors**: Check Auth0 environment variables and audience configuration
- **Database Connection Issues**: Verify volume mounting and file permissions
- **CORS Errors**: Ensure backend allows requests from frontend domain
- **Missing User Accounts**: Check account creation API and database connectivity
