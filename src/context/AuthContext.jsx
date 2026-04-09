import { createContext, useContext, useState } from 'react';

import { getDemoUser, initializeDemoData } from '../demoStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user] = useState(() => {
    initializeDemoData();
    return getDemoUser();
  });
  const loading = false;

  const login = async () => {
    return { user: getDemoUser() };
  };

  const register = async () => {
    return { user: getDemoUser() };
  };

  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
