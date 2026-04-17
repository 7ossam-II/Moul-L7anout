'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const { user, isLoading, isAuthenticated, login, logout, refreshUser } = useAuthContext();

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    isBuyer: user?.role === 'buyer',
    isSeller: user?.role === 'seller',
    isWorker: user?.role === 'worker',
    isDelivery: user?.role === 'delivery',
    isAdmin: user?.role === 'admin',
  };
}