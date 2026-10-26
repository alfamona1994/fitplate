"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "fitplate_token";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only read localStorage after the component mounts (client-side)
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) setToken(storedToken);
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  };

  const logout = () => {
    setToken(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};