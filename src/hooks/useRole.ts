import { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { authService } from '@/services/auth';
import { hasRouteAccess } from '@/constants/roles';

export function useRole() {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const unsubscribe = authService.subscribe((updatedUser) => {
      setUser(updatedUser);
    });
    return unsubscribe;
  }, []);

  const loginWithKey = (key: 'qc' | 'supervisor' | 'supplier' | 'admin') => {
    return authService.login(key);
  };

  const loginWithCredentials = (identifier: string, rawPassword: string) => {
    return authService.loginWithCredentials(identifier, rawPassword);
  };

  const loginUser = (userProfile: UserProfile) => {
    return authService.loginUser(userProfile);
  };

  const logout = () => {
    authService.logout();
  };

  const checkAccess = (path: string) => {
    if (!user) return false;
    return hasRouteAccess(user.role, path);
  };

  return {
    user,
    role: user ? user.role : null,
    isAuthenticated: user !== null,
    loginWithKey,
    loginWithCredentials,
    loginUser,
    logout,
    checkAccess,
  };
}
