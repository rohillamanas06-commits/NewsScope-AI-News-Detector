import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/api';

interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
  last_login?: string;
  credits?: number;
  credits_used?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  credits: number;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        setCredits(response.user.credits || 0);
      }
    } catch (error) {
      // User not logged in
      setUser(null);
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCredits = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        setCredits(response.user.credits || 0);
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await authApi.signup(name, email, password);
    if (response.success && response.user) {
      setUser(response.user);
      setCredits(response.user.credits || 5);
    } else {
      throw new Error(response.message || 'Signup failed');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.success && response.user) {
      setUser(response.user);
      setCredits(response.user.credits || 0);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setCredits(0);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
    credits,
    refreshCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};