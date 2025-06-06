import { useState, useEffect } from 'react';

export interface UserInfo {
  sub: string;
  name: string;
  nickname: string;
  picture: string;
  email: string;
  email_verified: boolean;
  given_name?: string;
  family_name?: string;
  updated_at?: string;
}

/**
 * Hook to retrieve and manage user information
 * This hook will fetch user information from the API if it's not already available
 */
export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        
        // First check if we have user info in a cookie
        const userInfoCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_info='));
          
        if (userInfoCookie) {
          // Parse the cookie value
          const userInfoValue = userInfoCookie.split('=')[1];
          try {
            const parsedUserInfo = JSON.parse(decodeURIComponent(userInfoValue));
            setUserInfo(parsedUserInfo);
            setIsLoading(false);
            return;
          } catch (e) {
            console.error('Failed to parse user info from cookie:', e);
            // Continue to fetch from API
          }
        }
        
        // If no cookie or parsing failed, fetch from API
        const response = await fetch('/api/auth/userinfo');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user info: ${response.status}`);
        }
        
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we're authenticated
    const isAuthenticated = document.cookie
      .split('; ')
      .some(row => row.startsWith('is_authenticated=true'));
      
    if (isAuthenticated) {
      fetchUserInfo();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { userInfo, isLoading, error };
}

export default useUserInfo;
