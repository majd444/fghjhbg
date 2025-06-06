"use client";

import { ReactNode } from 'react';
import { UserContextProvider } from '@/lib/contexts/UserContext';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <UserContextProvider>
      {children}
    </UserContextProvider>
  );
}
