import { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchAuthStatus,
  login as loginRequest,
  logout as logoutRequest
} from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState(null);

  // Protected routes wait on this flag so they do not redirect before the
  // startup authentication check has completed.
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    fetchAuthStatus()
      .then((data) => {
        if (isActive) {
          setIsAuthenticated(Boolean(data.isAuthenticated));
          setEmail(data.email ?? null);
        }
      })
      .catch(() => {
        // If the check itself fails, treat the user as unauthenticated.
        if (isActive) {
          setIsAuthenticated(false);
          setEmail(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function login(emailInput, password) {
    const data = await loginRequest(emailInput, password);
    setIsAuthenticated(true);
    setEmail(data.email ?? null);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      // The local state is cleared regardless so the interface never shows an
      // authenticated view after a logout attempt.
      setIsAuthenticated(false);
      setEmail(null);
    }
  }

  // Called when a request unexpectedly returns 401, e.g. an expired session.
  function clearAuth() {
    setIsAuthenticated(false);
    setEmail(null);
  }

  const value = {
    isAuthenticated,
    email,
    isAuthLoading,
    login,
    logout,
    clearAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
