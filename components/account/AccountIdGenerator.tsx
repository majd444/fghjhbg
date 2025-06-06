'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * This component silently generates and stores account IDs for users
 * It doesn't render any UI elements and works in the background
 */
const AccountIdGenerator = () => {
  // Using _isGenerating to indicate we're aware it's not directly used
  // but we need the state to trigger re-renders during the generation process
  const [_isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateAccountId = async () => {
      try {
        setIsGenerating(true);
        
        // Check if account ID already exists in cookies
        const hasAccountId = document.cookie
          .split('; ')
          .some(row => row.startsWith('account_id='));
          
        if (hasAccountId) {
          console.log('Account ID already exists');
          return;
        }
        
        // Generate a temporary account ID for anonymous users
        const tempAccountId = `acc_${uuidv4()}`;
        
        // Get user ID from cookies if available (for logged in users)
        const userIdCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_id='));
          
        const userId = userIdCookie 
          ? userIdCookie.split('=')[1] 
          : `anonymous-${Date.now()}`;
          
        // Get email from cookies if available
        const userInfoCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_info='));
          
        let email = '';
        if (userInfoCookie) {
          try {
            const userInfo = JSON.parse(decodeURIComponent(userInfoCookie.split('=')[1]));
            email = userInfo.email || '';
          } catch (e) {
            console.error('Failed to parse user info cookie:', e);
          }
        }
        
        // If no email is available, use a placeholder
        if (!email) {
          email = `anonymous-${Date.now()}@example.com`;
        }
        
        // Call the API to create or retrieve an account ID
        const response = await fetch('/api/account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, userId }),
        });
        
        if (!response.ok) {
          // If API call fails, store temporary account ID in cookie
          document.cookie = `account_id=${tempAccountId}; path=/; max-age=${30 * 24 * 60 * 60}`;
          console.log('Using temporary account ID:', tempAccountId);
        } else {
          const data = await response.json();
          console.log('Account ID created/retrieved:', data.account?.accountId);
        }
      } catch (error) {
        console.error('Error generating account ID:', error);
      } finally {
        setIsGenerating(false);
      }
    };
    
    generateAccountId();
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default AccountIdGenerator;
