'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { StoreSubdomainData } from '@/lib/api/subdomain';

interface StoreContextType {
  store: StoreSubdomainData;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  store: StoreSubdomainData;
  children: ReactNode;
}

export function StoreProvider({ store, children }: StoreProviderProps) {
  return (
    <StoreContext.Provider value={{ store }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export function useStoreData() {
  const { store } = useStore();
  return store;
}