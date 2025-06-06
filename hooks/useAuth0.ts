"use client";

import { useAuth0 as useAuth0Original } from "@auth0/auth0-react";

// Wrapper around the original useAuth0 hook to add any custom functionality
export const useAuth0 = () => {
  const auth0 = useAuth0Original();
  
  // Custom loginWithRedirect that handles connections properly
  const loginWithRedirect = async (options?: any) => {
    try {
      // Default parameters
      const defaultParams = {
        authorizationParams: {
          // Don't include connection parameter by default
          // Let Auth0 handle the connection choices
          prompt: "login", // Always show the login screen
          scope: process.env.NEXT_PUBLIC_AUTH0_SCOPE || "openid profile email"
        }
      };

      // For social logins, we'll use the universal login screen
      // rather than trying to specify connections directly
      // This is more reliable across different Auth0 account setups
      if (options?.authorizationParams?.connection) {
        console.log(`Logging in with connection: ${options.authorizationParams.connection}`);
      }

      // Merge options
      const mergedOptions = {
        ...defaultParams,
        ...options,
        authorizationParams: {
          ...defaultParams.authorizationParams,
          ...options?.authorizationParams
        }
      };

      return await auth0.loginWithRedirect(mergedOptions);
    } catch (error) {
      console.error("Auth0 login error:", error);
      throw error;
    }
  };

  return {
    ...auth0,
    loginWithRedirect
  };
};
