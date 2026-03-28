import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { type AuthModel, type ProfileMetaModel } from "@bump/core/models";

type AuthContextType = {
  auth: AuthModel | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthModel | null>>;
  meta: ProfileMetaModel | null;
  setMeta: React.Dispatch<React.SetStateAction<ProfileMetaModel | null>>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | null>(null);
  const [meta, setMeta] = useState<ProfileMetaModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('auth');
    await SecureStore.deleteItemAsync('meta');
    setAuth(null);
    setMeta(null);
  };

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedAuth = await SecureStore.getItemAsync('auth');
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }

        const storedMeta = await SecureStore.getItemAsync('meta');
        if (storedMeta) {
          setMeta(JSON.parse(storedMeta));
        }
      } catch (e) {
        console.error('Failed to load stored auth session', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, meta, setMeta, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
