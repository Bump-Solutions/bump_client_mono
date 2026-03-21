import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginApi, refreshTokenApi } from '../../services/api';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
};

type AuthContextType = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ accessToken: null, refreshToken: null, user: null });

  const refreshToken = async () => {
    if (!auth.refreshToken) return false;
    try {
      const { accessToken, refreshToken: newRefreshToken } = await refreshTokenApi(auth.refreshToken);
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', newRefreshToken);
      setAuth(prev => ({ ...prev, accessToken, refreshToken: newRefreshToken }));
      return true;
    } catch {
      logout();
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const { accessToken, refreshToken, user } = await loginApi(email, password);
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    setAuth({ accessToken, refreshToken, user });
  };

  const logout = () => {
    SecureStore.deleteItemAsync('accessToken');
    SecureStore.deleteItemAsync('refreshToken');
    setAuth({ accessToken: null, refreshToken: null, user: null });
  };


  useEffect(() => {
    (async () => {
      const refresh = await SecureStore.getItemAsync('refreshToken');
      if (!refresh) {
        logout();
      } else {
        await refreshToken();
      }
    })();
  }, []);

  return <AuthContext.Provider value={{ auth, login, logout, refreshToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};