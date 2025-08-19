"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
  signup: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This is a mock implementation. In a real app, you'd check for a token in localStorage or a cookie.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && (pathname === '/login' || pathname === '/signup')) {
      router.push('/dashboard');
    }
  }, [user, pathname, router]);

  const login = (email: string) => {
    const userData = { email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const signup = (email: string) => {
    const userData = { email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
