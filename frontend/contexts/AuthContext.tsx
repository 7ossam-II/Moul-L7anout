'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/lib/types/api.types';
import { api } from '@/lib/api/endpoints';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getCurrentUser();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    
    if (res.success && res.data) {
      const data = res.data as unknown as { user: User; token: string };
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}