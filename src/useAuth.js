/**
 * useAuth.js
 * ─────────────────────────────────────────────────────────────
 * Authentication hook and provider
 */

import React, {
  createContext, useContext, useState, useEffect, useCallback
} from 'react';
import { useLocalStorage } from './hooks/Use_LocalStorage';
import { STORAGE_KEYS } from './hooks/Use_Storekey';

// API base URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─────────────────────────────────────────────────────────────
// Auth API Functions
// ─────────────────────────────────────────────────────────────
export const authApi = {
  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { authenticated: false, user: null };
    }

    try {
      const response = await fetch(`${API}/api/user/session`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          // Update stored user data
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem('auth_token', data.token);
          }
          return { authenticated: true, user: data.user };
        }
      }

      // If we get a 401/403, clear invalid session
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        return { authenticated: false, user: null };
      }

      // Try to use stored user data as fallback
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          return { authenticated: true, user: userData };
        } catch (e) {
          return { authenticated: false, user: null };
        }
      }

      return { authenticated: false, user: null };
    } catch (error) {
      // Network error - try to use stored data
      console.warn('Auth check network error:', error.message);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          return { authenticated: true, user: userData };
        } catch (e) {
          return { authenticated: false, user: null };
        }
      }
      return { authenticated: false, user: null };
    }
  },

  login: async (email, password) => {
    const response = await fetch(`${API}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 200) {
      throw new Error(data.error || data.message || 'Login failed');
    }

    // Store session data
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));

    return data;
  },

  logout: async () => {
    const token = localStorage.getItem('auth_token');
    try {
      await fetch(`${API}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Ignore network errors during logout
      console.warn('Logout network error:', error.message);
    } finally {
      // Always clear local session data
      localStorage.removeItem('auth_token');
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.clear();
    }
  },

  signup: async (firstName, lastName, email, password) => {
    const response = await fetch(`${API}/api/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Signup failed');
    }

    return data;
  },

  googleCallback: async (googleUserInfo) => {
    const response = await fetch(`${API}/api/auth/google`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleUserInfo),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Google login failed');
    }

    // Store session data
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));

    return data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API}/api/user/change-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to change password');
    }

    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
    }

    return data;
  },

  toggle2FA: async (enable) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const endpoint = enable ? '/api/user/2fa/enable' : '/api/user/2fa/disable';
    const response = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ${enable ? 'enable' : 'disable'} 2FA`);
    }

    return response.json();
  },

  getProfile: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API}/api/user/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to load profile');
    }

    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
    }

    return data;
  }
};

// ─────────────────────────────────────────────────────────────
// Auth Context
// ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─────────────────────────────────────────────────────────────
// Auth Provider
// ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Re-hydrate session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authApi.checkAuth();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Email/password login
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Signup
  const signup = useCallback(async (firstName, lastName, email, password) => {
    setError(null);
    try {
      const data = await authApi.signup(firstName, lastName, email, password);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Google OAuth
  const googleLogin = useCallback(async (googleUserInfo) => {
    setError(null);
    try {
      const data = await authApi.googleCallback(googleUserInfo);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout error:', error.message);
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    clearError,
    login,
    signup,
    googleLogin,
    logout,
    authApi,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// useAuth Hook
// ─────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

export default useAuth;