"use client";

import { createContext, useContext, ReactNode } from 'react';

type RoleContextType = {
  roleId: number | null;
  userId: string | null;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children, roleId, userId }: { children: ReactNode, roleId: number | null, userId: string | null }) => {
  return (
    <RoleContext.Provider value={{ roleId, userId }}>
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