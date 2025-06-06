# Auth0 Integration Documentation

This document outlines how Auth0 authentication is integrated with our SaaS chatbot backend and frontend systems.

## Architecture Overview

Our authentication system uses Auth0 for user authentication and identity management, with the following components:

1. **Frontend Auth0 Provider**: Handles login/signup flows and stores user information
2. **Backend Authentication Middleware**: Validates Auth0 tokens and ensures users exist in our database
3. **Database Integration**: Links Auth0 user IDs with our internal account system

## Authentication Flow

1. **User Login/Signup**:
   - User authenticates via Auth0 (Google, GitHub, Microsoft, or Apple)
   - Auth0 redirects back to our application with an access token and ID token
   - Frontend stores tokens and user information

2. **Account Creation/Update**:
   - Frontend calls `/api/account` endpoint with Auth0 user ID and profile information
   - Backend creates or updates the user account in the SQLite database
   - User ID and account ID are stored in HTTP-only cookies

3. **API Authentication**:
   - Each API request includes the Auth0 token in the Authorization header
   - Backend middleware validates the token and retrieves the user account
   - If no account exists, one is automatically created

## Key Components

### Frontend Components

#### Auth0 Provider (`components/providers/auth0-provider.tsx`)

```typescript
// Wraps the application with Auth0 context
// Handles login/signup flows and token management
// Calls backend API to create/update user accounts
```

#### User Context (`lib/contexts/UserContext.tsx`)

```typescript
// Manages user state and subscription information
// Integrates with Auth0 user profile
// Provides user information to components
```

### Backend Components

#### Authentication Utilities (`lib/auth-utils.ts`)

```typescript
// Extracts user ID from cookies and authorization headers
// Validates Auth0 tokens
// Enforces authentication on API routes
```

#### Account API (`app/api/account/route.ts`)

```typescript
// Creates and updates user accounts
// Links Auth0 user IDs with internal accounts
// Stores user IDs in cookies for server-side access
```

#### Account Database (`lib/database/account-db.ts`)

```typescript
// SQLite adapter for account storage
// CRUD operations for user accounts
// Queries by user ID or email
```

## Security Considerations

1. **Token Storage**:
   - Access tokens stored in memory only
   - ID tokens stored in HTTP-only cookies
   - Refresh tokens managed by Auth0

2. **Cookie Security**:
   - HTTP-only cookies prevent JavaScript access
   - Secure flag enabled in production
   - SameSite policy enforced

3. **API Security**:
   - All API routes protected by authentication middleware
   - JWT validation with proper audience and issuer checks
   - Rate limiting on authentication endpoints

## Environment Variables

The following environment variables must be configured for Auth0 integration:

```
# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://your-api-identifier
NEXT_PUBLIC_AUTH0_REDIRECT_URI=https://your-app-url/callback
```

## Testing Authentication

1. **Development Mode**:
   - In development, a default user ID is allowed for testing
   - Set `NODE_ENV=development` to enable development features

2. **Auth0 Testing**:
   - Use Auth0's test users or create test accounts
   - Test social connections with Auth0 development keys

## Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**:
   - Check that Auth0 environment variables are correctly set
   - Verify that cookies are being properly set and sent
   - Ensure the Auth0 audience matches between frontend and backend

2. **Missing User Accounts**:
   - Check that the account creation API is being called after login
   - Verify that the user ID is correctly extracted from Auth0 tokens
   - Check database connectivity and permissions

3. **Token Validation Failures**:
   - Ensure the Auth0 domain and audience are correctly configured
   - Check for clock skew between servers
   - Verify that tokens haven't expired

## Future Improvements

1. **Role-Based Access Control**:
   - Implement Auth0 roles and permissions
   - Add role-based middleware for API routes

2. **Multi-Factor Authentication**:
   - Enable MFA through Auth0 configuration
   - Add UI components for MFA enrollment

3. **Enhanced Token Management**:
   - Implement token refresh logic
   - Add token revocation on logout
