# Auth0 Integration Guide

This guide provides comprehensive instructions for setting up, configuring, and testing the Auth0 integration in both development and production environments.

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Auth0 Tenant Configuration](#auth0-tenant-configuration)
4. [Database Integration](#database-integration)
5. [Authentication Strategies](#authentication-strategies)
6. [User Profile Management](#user-profile-management)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Overview

Our application uses Auth0 for authentication and user management. The integration provides:

- Consistent account IDs across login sessions
- User profile data synchronization
- Support for multiple authentication strategies
- Secure token handling and storage
- Development mode with mock data fallbacks

## Environment Setup

### Required Environment Variables

```
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
```

### Development Mode

In development, the application can run without real Auth0 credentials by using mock data. To control this behavior:

1. Set `USE_REAL_AUTH0_IN_DEV` in `lib/auth0-utils.ts` to:
   - `false`: Always use mock data (default)
   - `true`: Attempt real Auth0 API calls, fall back to mock data on failure

### Production Mode

For production, you **must** set all environment variables with valid Auth0 credentials.

## Auth0 Tenant Configuration

1. **Create an Auth0 Application**:
   - Go to the Auth0 Dashboard
   - Create a new "Regular Web Application"
   - Configure the callback URLs to include your application's callback paths

2. **Configure API Permissions**:
   - Go to "APIs" > "Auth0 Management API"
   - Authorize your application to use the Management API
   - Grant the following permissions:
     - `read:users`
     - `read:user_idp_tokens`
     - `read:logs`

3. **Set Up Social Connections**:
   - Go to "Authentication" > "Social"
   - Configure Google OAuth connection
   - Enable additional connections as needed (GitHub, Microsoft, Apple)

## Database Integration

The application uses a database adapter pattern that allows switching between mock storage and real database implementations:

1. **Mock Database** (default):
   - In-memory storage for development and testing
   - Data is lost when the server restarts
   - No configuration required
   - Best for quick development and testing

2. **SQLite Database** (persistent storage):
   - Set `USE_REAL_DATABASE=true` in your environment
   - Data is stored in `data/accounts.db` file
   - Provides persistent storage across server restarts
   - No additional setup required beyond the environment variable

3. **Custom Database** (advanced):
   - Implement a custom adapter that conforms to the `AccountDatabase` interface in `lib/database/account-db.ts`
   - Update the `getAccountDatabase()` factory function to return your implementation
   - Useful for integrating with external database systems (MongoDB, PostgreSQL, etc.)

## Authentication Strategies

The application supports multiple authentication strategies through Auth0:

1. **Google OAuth** (enabled by default)
2. **GitHub** (requires configuration)
3. **Microsoft** (requires configuration)
4. **Apple** (requires configuration)
5. **Email/Password** (requires configuration)

To enable additional strategies:

1. Update the `enabled` flag in `lib/auth/auth-strategies.ts`
2. Configure the corresponding connection in your Auth0 tenant
3. Implement the callback handler in `/app/api/auth/[strategy]/callback/route.ts`

## User Profile Management

The application provides APIs for managing user profiles:

1. **GET /api/auth/profile**:
   - Retrieves user profile information
   - Requires user ID in cookie or query parameter

2. **PUT /api/auth/profile**:
   - Updates user profile information
   - Accepts name, picture, and metadata fields

3. **PATCH /api/auth/profile**:
   - Syncs user profile with Auth0
   - Updates local profile with latest Auth0 data

## Testing

### Development Testing

1. **Authentication Flow**:
   ```
   # Start the development server
   npm run dev
   
   # Test Google OAuth login
   # Navigate to /login in your browser
   ```

2. **Profile API**:
   ```
   # Get user profile
   curl -X GET http://localhost:3000/api/auth/profile
   
   # Update user profile
   curl -X PUT http://localhost:3000/api/auth/profile \
     -H "Content-Type: application/json" \
     -d '{"name": "Updated Name", "picture": "https://example.com/picture.jpg"}'
   
   # Sync with Auth0
   curl -X PATCH http://localhost:3000/api/auth/profile
   ```

3. **Auth Strategies API**:
   ```
   # Get available authentication strategies
   curl -X GET http://localhost:3000/api/auth/strategies
   ```

### Production Testing

1. Verify environment variables are correctly set
2. Test each authentication strategy
3. Confirm account IDs are consistent across logins
4. Verify user profile synchronization works

## Troubleshooting

### Common Issues

1. **404 Error from Auth0 API**:
   - Check that environment variables are correctly set
   - Verify API permissions in Auth0 dashboard
   - Ensure your Auth0 tenant is properly configured

2. **Inconsistent Account IDs**:
   - Check that `generateConsistentAccountId` is being used
   - Verify Auth0 user IDs are being correctly passed

3. **Missing User Profile Data**:
   - Check Auth0 user profile for missing fields
   - Verify profile synchronization is working

### Debugging

Enable detailed logging by setting:
```
DEBUG=auth0:*
```

This will output detailed information about Auth0 API calls and responses.

---

For additional help, refer to the [Auth0 Documentation](https://auth0.com/docs) or contact the development team.
