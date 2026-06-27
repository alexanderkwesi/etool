// hooks/SecurityProvider.js
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useLocalStorage } from "./Use_LocalStorage";
import { STORAGE_KEYS } from "./Use_Storekey";

// API base URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Security Context
const SecurityContext = createContext();

// Security Provider Component - Standalone, no dependencies
export const SecurityProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState("basic");
  const [securityLogs, setSecurityLogs] = useState([]);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [error, setError] = useState(null);

  // Use localStorage utilities
  const { getItem, setItem, removeItem } = useLocalStorage;

  // Log security events
  const logSecurityEvent = useCallback((eventType, description, severity = "info") => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      eventType,
      description,
      severity,
      userId: user?.id || "unknown",
      userAgent: navigator.userAgent,
    };

    setSecurityLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs.slice(0, 49)];
      try {
        setItem("security_logs", updatedLogs);
      } catch (e) {
        console.warn("Failed to save security logs:", e);
      }
      return updatedLogs;
    });
  }, [user, setItem]);

  // Check authentication status with backend
  const checkAuth = useCallback(async () => {
    try {
      const token = getItem("auth_token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return false;
      }

      const response = await fetch(`${API}/api/user/session`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          setItem(STORAGE_KEYS.USER_DATA, data.user);
          if (data.user.planId || data.user.plan) {
            setUserPlan(data.user.planId || data.user.plan || "basic");
          }
          logSecurityEvent(
            "session_validated",
            `Session validated for ${data.user.email}`
          );
          setIsLoading(false);
          return true;
        }
      }

      // If we get a 401/403, clear invalid session
      if (response.status === 401 || response.status === 403) {
        removeItem("auth_token");
        removeItem(STORAGE_KEYS.USER_DATA);
        setUser(null);
        setIsAuthenticated(false);
        logSecurityEvent("session_expired", "Session expired", "warning");
        setIsLoading(false);
        return false;
      }

      // Try to use stored user data as fallback
      const storedUser = getItem(STORAGE_KEYS.USER_DATA);
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        if (storedUser.planId || storedUser.plan) {
          setUserPlan(storedUser.planId || storedUser.plan || "basic");
        }
        logSecurityEvent(
          "session_restored_fallback",
          "Session restored from localStorage",
          "warning"
        );
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;

    } catch (error) {
      console.warn("Auth check error:", error.message);
      // Network error - try to use stored data
      const storedUser = getItem(STORAGE_KEYS.USER_DATA);
      if (storedUser && getItem("auth_token")) {
        setUser(storedUser);
        setIsAuthenticated(true);
        if (storedUser.planId || storedUser.plan) {
          setUserPlan(storedUser.planId || storedUser.plan || "basic");
        }
        logSecurityEvent(
          "session_restored_offline",
          "Session restored from localStorage (offline)",
          "warning"
        );
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    }
  }, [getItem, setItem, removeItem, logSecurityEvent]);

  // Initialize security context
  useEffect(() => {
    const initializeSecurity = async () => {
      setIsLoading(true);
      setError(null);

      // Restore persisted security logs
      try {
        const logs = getItem("security_logs");
        if (logs) {
          setSecurityLogs(logs);
        }
      } catch (e) {
        setSecurityLogs([]);
      }

      // Get 2FA status from localStorage
      try {
        const twoFactorStatus = getItem("two_factor_enabled");
        if (twoFactorStatus !== null) {
          setTwoFactorEnabled(twoFactorStatus);
        }
      } catch (e) {
        setTwoFactorEnabled(false);
      }

      // Get user plan from localStorage
      try {
        const plan = getItem("userPlanId");
        if (plan) {
          setUserPlan(plan);
        }
      } catch (e) {
        setUserPlan("basic");
      }

      // Check authentication
      await checkAuth();
      setIsLoading(false);
    };

    initializeSecurity();
  }, [getItem, checkAuth]);

  // Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        setUser(data.user);
        setIsAuthenticated(true);
        setItem(STORAGE_KEYS.USER_DATA, data.user);
        if (data.token) {
          setItem("auth_token", data.token);
        }
        if (data.user.planId || data.user.plan) {
          setUserPlan(data.user.planId || data.user.plan || "basic");
          setItem("userPlanId", data.user.planId || data.user.plan || "basic");
        }

        logSecurityEvent("user_login_success", "User logged in successfully");
        return { success: true, user: data.user };
      } else {
        const errorMsg = data.error || data.message || "Login failed";
        setError(errorMsg);
        logSecurityEvent(
          "user_login_failed",
          `Failed login attempt for ${email}`,
          "warning"
        );
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const errorMsg = "Network error. Please try again.";
      setError(errorMsg);
      logSecurityEvent(
        "user_login_error",
        `Login error: ${error.message}`,
        "error"
      );
      return { success: false, message: errorMsg };
    }
  }, [logSecurityEvent, setItem]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = getItem("auth_token");
      await fetch(`${API}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.warn("Logout network error:", error.message);
    }

    logSecurityEvent("user_logout", "User logged out");
    setUser(null);
    setIsAuthenticated(false);
    removeItem(STORAGE_KEYS.USER_DATA);
    removeItem("auth_token");
    removeItem("userPlanId");
    removeItem("two_factor_enabled");
    sessionStorage.clear();
  }, [logSecurityEvent, getItem, removeItem]);

  // Signup function
  const signup = useCallback(async (firstName, lastName, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API}/api/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 201) {
        logSecurityEvent(
          "user_signup_success",
          `User signed up: ${email}`
        );
        return { success: true, user: data.user };
      } else {
        const errorMsg = data.error || data.message || "Signup failed";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const errorMsg = "Network error. Please try again.";
      setError(errorMsg);
      logSecurityEvent(
        "user_signup_error",
        `Signup error: ${error.message}`,
        "error"
      );
      return { success: false, message: errorMsg };
    }
  }, [logSecurityEvent]);

  // Google Login
  const googleLogin = useCallback(async (googleUserInfo) => {
    setError(null);
    try {
      const response = await fetch(`${API}/api/auth/google/callback`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleUserInfo),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        setUser(data.user);
        setIsAuthenticated(true);
        setItem(STORAGE_KEYS.USER_DATA, data.user);
        if (data.token) {
          setItem("auth_token", data.token);
        }
        if (data.user.planId || data.user.plan) {
          setUserPlan(data.user.planId || data.user.plan || "basic");
          setItem("userPlanId", data.user.planId || data.user.plan || "basic");
        }

        logSecurityEvent("user_google_login_success", "Google login successful");
        return { success: true, user: data.user };
      } else {
        const errorMsg = data.error || data.message || "Google login failed";
        setError(errorMsg);
        logSecurityEvent(
          "user_google_login_failed",
          "Google login failed",
          "warning"
        );
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const errorMsg = "Network error. Please try again.";
      setError(errorMsg);
      logSecurityEvent(
        "user_google_login_error",
        `Google login error: ${error.message}`,
        "error"
      );
      return { success: false, message: errorMsg };
    }
  }, [logSecurityEvent, setItem]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null);
    try {
      const token = getItem("auth_token");
      if (!token) {
        const errorMsg = "Not authenticated";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const response = await fetch(`${API}/api/user/change-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        removeItem("auth_token");
        removeItem(STORAGE_KEYS.USER_DATA);
        setUser(null);
        setIsAuthenticated(false);
        const errorMsg = "Session expired. Please login again.";
        setError(errorMsg);
        logSecurityEvent(
          "password_change_session_expired",
          "Session expired during password change",
          "warning"
        );
        return { success: false, message: errorMsg };
      }

      if (!response.ok) {
        const errorMsg = data.error || "Failed to change password";
        setError(errorMsg);
        logSecurityEvent(
          "password_change_error",
          errorMsg,
          "error"
        );
        return { success: false, message: errorMsg };
      }

      logSecurityEvent("password_changed", "Password changed successfully");
      return { success: true, message: "Password changed successfully" };

    } catch (error) {
      const errorMsg = "Network error. Please try again.";
      setError(errorMsg);
      logSecurityEvent(
        "password_change_error",
        `Error: ${error.message}`,
        "error"
      );
      return { success: false, message: errorMsg };
    }
  }, [getItem, removeItem, logSecurityEvent]);

  // Toggle 2FA
  const toggleTwoFactor = useCallback(async () => {
    setError(null);
    try {
      const token = getItem("auth_token");
      if (!token) {
        const errorMsg = "Not authenticated";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const enable = !twoFactorEnabled;
      const endpoint = enable ? "/api/user/2fa/enable" : "/api/user/2fa/disable";
      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMsg = `Failed to ${enable ? 'enable' : 'disable'} 2FA`;
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      setTwoFactorEnabled(enable);
      setItem("two_factor_enabled", enable);
      logSecurityEvent(
        enable ? "2fa_enabled" : "2fa_disabled",
        `Two-factor authentication ${enable ? 'enabled' : 'disabled'}`
      );
      return { success: true, enabled: enable };

    } catch (error) {
      const errorMsg = "Network error. Please try again.";
      setError(errorMsg);
      logSecurityEvent(
        "2fa_toggle_error",
        `Error toggling 2FA: ${error.message}`,
        "error"
      );
      return { success: false, message: errorMsg };
    }
  }, [twoFactorEnabled, getItem, setItem, logSecurityEvent]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    userPlan,
    encryptionKey,
    twoFactorEnabled,
    securityLogs,
    error,
    
    // Actions
    login,
    logout,
    signup,
    googleLogin,
    changePassword,
    toggleTwoFactor,
    clearError,
    setEncryptionKey,
    setUserPlan,
    logSecurityEvent,
    checkAuth,
    
    // Constants
    API,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Hook to use security context
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};

export default SecurityProvider;