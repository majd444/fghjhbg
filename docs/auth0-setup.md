# Auth0 Integration Setup

This document outlines how to set up Auth0 for both development and production environments.

## Environment Variables

The following environment variables must be set for Auth0 integration to work properly:

```
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
```

## Development Environment

In development mode, the application will use mock Auth0 data if any of the following conditions are met:
- Environment variables are not set
- `USE_REAL_AUTH0_IN_DEV` flag is set to `false` in `auth0-utils.ts`
- Auth0 API calls fail

To use real Auth0 credentials in development:
1. Set all the environment variables above
2. Set `USE_REAL_AUTH0_IN_DEV` to `true` in `auth0-utils.ts`

## Production Environment

For production, you **must** set all the environment variables with valid Auth0 credentials:

1. Create an Auth0 tenant if you don't have one already
2. Register a new Machine-to-Machine application in Auth0
3. Grant the application access to the Auth0 Management API
4. Set the required environment variables in your production environment

### Required API Permissions

The Auth0 application needs the following permissions:
- `read:users`
- `read:user_idp_tokens`
- `read:logs`

### Testing Production Setup

To verify your Auth0 integration is working in production:

1. Check that users can authenticate via Google OAuth
2. Verify that consistent account IDs are generated for users
3. Confirm that user logs are being retrieved from Auth0
4. Test the `/api/auth/logs` endpoint to ensure it returns real Auth0 logs

## Troubleshooting

If you encounter issues with Auth0 integration:

1. Check that all environment variables are correctly set
2. Verify that your Auth0 application has the necessary permissions
3. Look for error messages in the server logs
4. Test the Auth0 Management API directly using Postman or curl
