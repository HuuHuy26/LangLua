import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { heritageApi, setAuthToken } from '../services/api';
import type { AuthStatusResponse } from '../types';

interface AuthContextValue {
  status: AuthStatusResponse | null;
  loading: boolean;
  refreshStatus: () => Promise<void>;
  claimAdmin: (payload: { name: string; email: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStatus = useCallback(async () => {
    try {
      const data = await heritageApi.getAuthStatus();
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  const claimAdmin = async (payload: { name: string; email: string; password: string }) => {
    const res = await heritageApi.claimAdmin(payload);
    setAuthToken(res.token);
    await refreshStatus();
  };

  const login = async (payload: { email: string; password: string }) => {
    const res = await heritageApi.loginAdmin(payload);
    setAuthToken(res.token);
    await refreshStatus();
  };

  const logout = () => {
    setAuthToken(null);
    setStatus((prev) => (prev ? { ...prev, authenticated: false, user: null } : null));
  };

  return (
    <AuthContext.Provider value={{ status, loading, refreshStatus, claimAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
