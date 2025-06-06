"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode, useEffect, useState } from "react";
import { UserContextProvider } from "@/lib/contexts/UserContext";

interface Auth0ProviderProps {
  children: ReactNode;
}

export const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderProps) => {
  const [isClient, setIsClient] = useState(false);
  
  // Using environment variables with fallbacks
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "dev-l1xgk0jrahgc55wv.us.auth0.com";
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "Sdo0dth3DsQ614fvWIG5bRPI3DEZnrtN";
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "https://dev-l1xgk0jrahgc55wv.us.auth0.com/api/v2/";
  
  // Since Next.js does SSR, we need to ensure window is available before using it
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get the current origin for redirect URI
  const origin = isClient && typeof window !== "undefined" ? window.location.origin : "";
  
  // Use the specified redirect URI from env or fall back to current origin
  const redirectUri = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || origin;
  
  const onRedirectCallback = async (appState: any, user: any) => {
    // Store Auth0 user ID in cookie for server-side access
    if (user?.sub) {
      document.cookie = `auth0_id=${user.sub};path=/;max-age=${60 * 60 * 24 * 7};${process.env.NODE_ENV === 'production' ? 'secure;' : ''}`;
      
      // Also store in localStorage for client-side access
      localStorage.setItem('auth0_user_id', user.sub);
      
      // Create or update user account via API
      try {
        const response = await fetch('/api/account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getTokenSilently()}`
          },
          body: JSON.stringify({
            userId: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture
          })
        });
        
        if (!response.ok) {
          console.error('Failed to create/update user account:', await response.text());
        }
      } catch (error) {
        console.error('Error creating/updating user account:', error);
      }
    }
    
    // Redirect to the intended destination
    const returnTo = appState?.returnTo || "/home";
    window.location.href = returnTo;
  };

  // Don't render the Auth0Provider during SSR
  if (!isClient) {
    return <>{children}</>;
  }

  // Make sure we have all required values
  if (!(domain && clientId && redirectUri)) {
    console.error("Missing Auth0 configuration values:", { domain, clientId, redirectUri });
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
        scope: "openid profile email",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </Auth0Provider>
  );
};
