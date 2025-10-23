"use client";

import { createContext, useContext, ReactNode } from 'react';

type RoleContextType = {
  roleId: number | null;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children, roleId }: { children: ReactNode, roleId: number | null }) => {
  return (
    <RoleContext.Provider value={{ roleId }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};