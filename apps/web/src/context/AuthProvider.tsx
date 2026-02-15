'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getCurrentUser,
  signIn as PuterSignIn,
  signOut as PuterSignOut,
} from '@/lib/puter.action';
import { AuthContext, AuthState } from '@/types/auth.types';

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  username: null,
  userId: null,
};

const AuthContextImpl = createContext<AuthContext | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContextImpl);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);

  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        isSignedIn: !!user,
        username: user?.username || null,
        userId: user?.uuid || null,
      });
      return !!user;
    } catch (error) {
      console.error(`Error in refreshing auth state : ${error}`);
      setAuthState(DEFAULT_AUTH_STATE);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshAuth();
    };
    initializeAuth();
  }, []);

  const signIn = async () => {
    await PuterSignIn();
    return await refreshAuth();
  };

  const signOut = async () => {
    PuterSignOut();
    return await refreshAuth();
  };

  const value = useMemo(
    () => ({ ...authState, refreshAuth, signIn, signOut }),
    [authState]
  );

  return (
    <AuthContextImpl.Provider value={value}>
      {children}
    </AuthContextImpl.Provider>
  );
};

export default AuthProvider;
