# Deploying to Netlify

This guide covers the steps needed to deploy this Next.js SaaS application to Netlify with Auth0 integration.

## Prerequisites

- A Netlify account
- An Auth0 account and tenant (sign up at https://auth0.com/signup if needed)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select your Git provider and authenticate
4. Select your repository

### 2. Configure Build Settings

Netlify should automatically detect that this is a Next.js project and suggest the following settings:

- **Build command**: `npm run build`
- **Publish directory**: `.next`

These settings are already configured in the `netlify.toml` file.

### 3. Install and Configure the Auth0 Extension

Netlify offers an official Auth0 integration that streamlines the connection process:

1. **Install the Auth0 Extension**:
   - As a Team Owner, navigate to the Extensions page for your team in the Netlify UI
   - Search for Auth0 and select it in the search results
   - On the details page, select Install

2. **Link Your Auth0 Tenant**:
   - From your team's Sites list, select your site
   - Navigate to the Access & security settings page
   - Scroll to find the Auth0 extension settings
   - Select "Link an Auth0 tenant" and follow the prompts to authorize Netlify to access your tenant
   - If you don't have an Auth0 account, select "Sign up with Auth0" and follow the prompts

3. **Configure the Extension**:
   - After connecting your tenant, configure the extension for your site
   - The extension will automatically set up the necessary environment variables

### 4. Additional Environment Variables

In addition to the variables set by the Auth0 extension, you may need to set these additional variables in the Netlify dashboard (Site settings > Build & deploy > Environment):

```
USE_REAL_DATABASE=true
AGENTIVE_API_KEY=c8bc40f2-e83d-4e92-ac2b-d5bd6444da0a
AGENTIVE_ASSISTANT_ID=25fd29f8-8365-4ce2-b3f2-f78e1b57f148
```

These environment variables are also configured in the `netlify.toml` file, but you may want to update them with your own Agentive API credentials.

### 5. Database Configuration

For the SQLite database:

1. Be aware that Netlify's filesystem is ephemeral - data stored in SQLite will not persist between deployments
2. For production, consider using:
   - A serverless database like Fauna, Supabase, or Neon
   - Or adapt the database adapter to use a service like AWS RDS or MongoDB Atlas

### 6. Securing API Routes with Auth0

With the official Netlify Auth0 integration, you can secure your API routes using the Auth0 JWT verification. Here's how to implement it in your Netlify Functions:

1. **Create a Netlify Function with Auth0 Protection**:

```javascript
// Example: netlify/functions/protected-api.js
import { auth } from '@netlify/auth0';

export const handler = auth(async (event, context) => {
  // The user is authenticated if this code runs
  // context.auth contains the Auth0 user information
  
  const user = context.auth.user;
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'This is a protected API route',
      user: {
        userId: user.sub,
        email: user.email
      }
    })
  };
});
```

2. **Testing Locally**:

You can test your protected functions locally using Netlify Dev:

```bash
netlify dev
```

3. **Calling Protected APIs from the Frontend**:

When calling protected APIs, make sure to include the authentication token:

```javascript
// Example using @auth0/auth0-react
import { useAuth0 } from '@auth0/auth0-react';

function CallProtectedAPI() {
  const { getAccessTokenSilently } = useAuth0();
  
  const callAPI = async () => {
    const token = await getAccessTokenSilently();
    
    const response = await fetch('/.netlify/functions/protected-api', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log(data);
  };
  
  return <button onClick={callAPI}>Call Protected API</button>;
}
```

### 7. Authentication Callback URLs

The Auth0 extension will automatically configure the callback URLs, but you can verify or update them in your Auth0 dashboard to include your Netlify domain:

```
https://your-netlify-app.netlify.app/api/auth/callback
https://your-netlify-app.netlify.app/api/auth/google/callback
https://your-netlify-app.netlify.app/api/auth/github/callback
https://your-netlify-app.netlify.app/api/auth/microsoft/callback
https://your-netlify-app.netlify.app/api/auth/apple/callback
```

### 6. Deploy

1. Click "Deploy site" in the Netlify dashboard
2. Wait for the build and deployment to complete
3. Your site will be available at a Netlify subdomain (e.g., `your-app.netlify.app`)
4. You can configure a custom domain in the Netlify settings

## Continuous Deployment

Netlify automatically sets up continuous deployment from your Git repository. Any changes pushed to your main branch will trigger a new build and deployment.

## Troubleshooting

- **API Routes**: Make sure API routes are working correctly by checking the Netlify Functions logs
- **Authentication**: Verify that Auth0 callback URLs are correctly configured
- **Database**: If using SQLite, remember that data won't persist between deployments

## Additional Resources

- [Netlify Next.js Plugin Documentation](https://github.com/netlify/netlify-plugin-nextjs)
- [Auth0 Deployment Guide](https://auth0.com/docs/quickstart/webapp/nextjs/01-login)
- [Next.js on Netlify Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
