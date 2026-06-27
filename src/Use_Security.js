import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";

import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Security,
  Lock,
  LockOpen,
  VpnKey,
  AdminPanelSettings,
  History,
  Error,
  CheckCircle,
  Person,
  Email,
  Badge,
  Shield,
  Verified,
  Cancel,
} from "@mui/icons-material";
import { useLocalStorage, localStorageUtils } from "./hooks/Use_LocalStorage";
import { STORAGE_KEYS } from "./hooks/Use_Storekey";

// API base URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Security Context for global access
const SecurityContext = createContext();

// ============================================================
// EXPORT: useSecurity Hook - MUST be used inside SecurityProvider
// ============================================================
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};

// ============================================================
// EXPORT: SecurityProvider Component
// ============================================================
export const SecurityProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlan, setUserPlan] = useState("basic");
  const [securityLogs, setSecurityLogs] = useState([]);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Use the localStorage utilities
  const { getItem, setItem, removeItem } = useLocalStorage();

  // Clear user data function
  const clearUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    // Remove all user-related data from localStorage
    removeItem(STORAGE_KEYS.USER_DATA);
    removeItem("userData");
    removeItem("userEmail");
    removeItem("userId");
    removeItem("userFirstName");
    removeItem("userLastName");
    removeItem("auth_token");
    removeItem("userPlanId");
    removeItem("two_factor_enabled");
    removeItem("userPlan");
    removeItem("userStatus");
    // Clear session storage
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn("Failed to clear session storage:", e);
    }
  }, [removeItem]);

  // Log security events
  const logSecurityEvent = useCallback(
    (eventType, description, severity = "info") => {
      const currentUser = user;
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        eventType,
        description,
        severity,
        userId: currentUser?.id || "unknown",
        userAgent: navigator.userAgent,
      };

      setSecurityLogs((prevLogs) => {
        const updatedLogs = [newLog, ...prevLogs.slice(0, 49)];
        try {
          setItem("security_logs", updatedLogs);
        } catch (e) {
          console.warn("Failed to save security logs:", e);
        }
        return updatedLogs;
      });
    },
    [user, setItem],
  );

  // Get user data from localStorage
  const getUserFromStorage = useCallback(() => {
    try {
      // Try to get user data from multiple possible storage keys
      const userData = getItem(STORAGE_KEYS.USER_DATA);
      const userDataAlt = getItem("userData");
      const userEmail = getItem("userEmail");
      const userPlanId = getItem("userPlanId");
      const authToken = getItem("auth_token");
      const userId = getItem("userId");
      const userFirstName = getItem("userFirstName") || "";
      const userLastName = getItem("userLastName") || "";
      const userStatus = getItem("userStatus");
      const userPlan = getItem("userPlan");

      // Check if we have user data from STORAGE_KEYS
      if (userData && typeof userData === "object") {
        return {
          user: userData,
          plan: userData.planId || userData.subscriptionPlanId || userPlanId || userPlan || "basic",
          token: authToken,
          email: userData.email || userEmail,
          id: userData.id || userId,
          firstName: userData.first_name || userData.firstName || userFirstName,
          lastName: userData.last_name || userData.lastName || userLastName,
          status: userData.status || userData.is_verified || userStatus || "active",
          isVerified: userData.is_verified || userData.isVerified || false,
        };
      }

      // Try alternative storage format (userDataAlt)
      if (userDataAlt && typeof userDataAlt === "object") {
        return {
          user: userDataAlt,
          plan: userDataAlt.planId || userDataAlt.subscriptionPlanId || userPlanId || userPlan || "basic",
          token: authToken,
          email: userDataAlt.email || userEmail,
          id: userDataAlt.id || userId,
          firstName: userDataAlt.firstName || userFirstName,
          lastName: userDataAlt.lastName || userLastName,
          status: userDataAlt.status || userDataAlt.isVerified ? "verified" : userStatus || "active",
          isVerified: userDataAlt.isVerified || false,
        };
      }

      // Try to build user from individual storage items
      if (userEmail && authToken) {
        return {
          user: {
            id: userId || "unknown",
            email: userEmail,
            first_name: userFirstName,
            last_name: userLastName,
            name: `${userFirstName} ${userLastName}`.trim() || userEmail,
            status: userStatus || "active",
          },
          plan: userPlanId || userPlan || "basic",
          token: authToken,
          email: userEmail,
          id: userId || "unknown",
          firstName: userFirstName,
          lastName: userLastName,
          status: userStatus || "active",
          isVerified: userStatus === "verified" || false,
        };
      }

      return null;
    } catch (error) {
      console.warn("Error getting user from storage:", error);
      return null;
    }
  }, [getItem]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setAuthError(null);

    // First, try to get user from localStorage
    const storedData = getUserFromStorage();

    if (storedData && storedData.token) {
      // We have a token, try to validate it
      try {
        const response = await fetch(`${API}/api/user/session`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedData.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            // Update stored user data with fresh data
            setItem(STORAGE_KEYS.USER_DATA, data.user);
            setItem("userData", data.user);
            setItem("userEmail", data.user.email);
            setItem("userId", data.user.id);
            setItem("userFirstName", data.user.first_name || "");
            setItem("userLastName", data.user.last_name || "");
            setItem("userStatus", "verified");
            if (data.user.planId || data.user.plan) {
              const plan = data.user.planId || data.user.plan || "basic";
              setUserPlan(plan);
              setItem("userPlanId", plan);
              setItem("userPlan", plan);
            }
            logSecurityEvent(
              "session_validated",
              `Session validated for ${data.user.email}`,
            );
            setLoading(false);
            return true;
          }
        }

        // If we get a 401/403, clear invalid session
        if (response.status === 401 || response.status === 403) {
          clearUser();
          logSecurityEvent("session_expired", "Session expired", "warning");
          setLoading(false);
          return false;
        }
      } catch (error) {
        console.warn("Auth check network error:", error.message);
        // Network error - use stored data if available
        if (storedData.user) {
          setUser(storedData.user);
          setIsAuthenticated(true);
          setUserPlan(storedData.plan || "basic");
          setItem("userStatus", "offline");
          logSecurityEvent(
            "session_restored_offline",
            "Session restored from localStorage (offline)",
            "warning",
          );
          setLoading(false);
          return true;
        }
        setAuthError("Network error during authentication check");
      }
    }

    // If no token or validation failed, check for stored user data without token
    if (storedData && storedData.user) {
      setUser(storedData.user);
      setIsAuthenticated(true);
      setUserPlan(storedData.plan || "basic");
      setItem("userStatus", "fallback");
      logSecurityEvent(
        "session_restored_fallback",
        "Session restored from localStorage",
        "warning",
      );
      setLoading(false);
      return true;
    }

    // No valid session
    setUser(null);
    setIsAuthenticated(false);
    setItem("userStatus", "unauthenticated");
    setLoading(false);
    return false;
  }, [getUserFromStorage, setItem, clearUser, logSecurityEvent]);

  // Initialize security context
  useEffect(() => {
    const initializeSecurity = async () => {
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

      // Check authentication
      await checkAuth();
      setIsInitialized(true);
    };

    initializeSecurity();
  }, [getItem, checkAuth]);

  // Authentication functions
  const login = useCallback(
    async (email, password) => {
      setAuthError(null);
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
          // Store user data in multiple locations for compatibility
          setItem(STORAGE_KEYS.USER_DATA, data.user);
          setItem("userData", data.user);
          setItem("userEmail", data.user.email);
          setItem("userId", data.user.id);
          setItem("userFirstName", data.user.first_name || "");
          setItem("userLastName", data.user.last_name || "");
          setItem("userStatus", "authenticated");

          if (data.token) {
            setItem("auth_token", data.token);
          }

          const plan = data.user.planId || data.user.subscription_plan_id || data.user.plan || "basic";
          setUserPlan(plan);
          setItem("userPlanId", plan);
          setItem("userPlan", plan);

          logSecurityEvent("user_login_success", "User logged in successfully");
          return { success: true, user: data.user };
        } else {
          logSecurityEvent(
            "user_login_failed",
            `Failed login attempt for ${email}`,
            "warning",
          );
          return {
            success: false,
            message: data.error || data.message || "Login failed",
          };
        }
      } catch (error) {
        logSecurityEvent(
          "user_login_error",
          `Login error: ${error.message}`,
          "error",
        );
        setAuthError(error.message);
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [logSecurityEvent, setItem],
  );

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to invalidate session
      const token = getItem("auth_token");
      if (token) {
        await fetch(`${API}/api/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Ignore network errors during logout
      console.warn("Logout network error:", error.message);
    }

    logSecurityEvent("user_logout", "User logged out");
    clearUser();
    
    // Redirect to login page after logout
    window.location.href = "/login";
  }, [logSecurityEvent, clearUser, getItem]);

  // Encryption functions
  const encryptData = (data, key = encryptionKey) => {
    if (!key) {
      throw new Error("Encryption key required");
    }
    try {
      const stringData = typeof data === "string" ? data : JSON.stringify(data);
      const encodedData = btoa(unescape(encodeURIComponent(stringData)));
      const encrypted = xorEncrypt(encodedData, key);
      return encrypted;
    } catch (error) {
      logSecurityEvent(
        "encryption_error",
        `Failed to encrypt data: ${error.message}`,
        "error",
      );
      throw error;
    }
  };

  const decryptData = (encryptedData, key = encryptionKey) => {
    if (!key) {
      throw new Error("Decryption key required");
    }
    try {
      const decrypted = xorDecrypt(encryptedData, key);
      const decodedData = decodeURIComponent(escape(atob(decrypted)));
      return decodedData;
    } catch (error) {
      logSecurityEvent(
        "decryption_error",
        `Failed to decrypt data: ${error.message}`,
        "error",
      );
      throw error;
    }
  };

  const xorEncrypt = (data, key) => {
    let result = "";
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length),
      );
    }
    return btoa(result);
  };

  const xorDecrypt = (encryptedData, key) => {
    const data = atob(encryptedData);
    let result = "";
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length),
      );
    }
    return result;
  };

  const secureSaveFile = (fileData, key) => {
    try {
      const activeKey = key || encryptionKey;
      if (!activeKey) {
        throw new Error("Encryption key required to save file");
      }
      const encryptedData = encryptData(fileData.content, activeKey);
      const files = getItem("user_files") || [];
      files.push({
        ...fileData,
        content: encryptedData,
        encrypted: true,
        encryptedAt: new Date().toISOString(),
      });
      setItem("user_files", files);
      logSecurityEvent(
        "file_encrypted_saved",
        `File ${fileData.name} encrypted and saved`,
      );
      return true;
    } catch (error) {
      logSecurityEvent(
        "file_save_error",
        `Failed to save file: ${error.message}`,
        "error",
      );
      return false;
    }
  };

  const secureLoadFile = (fileId, key) => {
    try {
      const files = getItem("user_files") || [];
      const file = files.find((f) => f.id === fileId);
      if (!file) {
        throw new Error("File not found");
      }
      if (file.encrypted) {
        const activeKey = key || encryptionKey;
        if (!activeKey) throw new Error("Decryption key required");
        const decryptedContent = decryptData(file.content, activeKey);
        return {
          ...file,
          content: decryptedContent,
          encrypted: false,
        };
      }
      return file;
    } catch (error) {
      logSecurityEvent(
        "file_load_error",
        `Failed to load file: ${error.message}`,
        "error",
      );
      throw error;
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    const planPermissions = {
      basic: [
        "file_conversion",
        "file_viewing",
        "file_comparison",
        "basic_download",
      ],
      standard: [
        "file_conversion",
        "file_viewing",
        "file_comparison",
        "full_download",
        "team_access",
      ],
      premium: [
        "file_conversion",
        "file_viewing",
        "file_comparison",
        "full_download",
        "team_access",
        "admin_features",
      ],
    };
    return planPermissions[userPlan]?.includes(permission) || false;
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    userPlan,
    encryptionKey,
    twoFactorEnabled,
    securityLogs,
    isInitialized,
    loading,
    authError,
    login,
    logout,
    clearUser,
    setEncryptionKey,
    setTwoFactorEnabled,
    encryptData,
    decryptData,
    secureSaveFile,
    secureLoadFile,
    hasPermission,
    logSecurityEvent,
    checkAuth,
    getUserFromStorage,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// ============================================================
// EXPORT: LogoutDialog Component
// ============================================================
export const LogoutDialog = ({ open, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Use the security context
  const { logout } = useSecurity();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call the logout function from context
      await logout();
      // Call the onConfirm callback if provided
      if (onConfirm) {
        onConfirm();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <LockOpen sx={{ mr: 1, color: "error.main" }} />
          <Typography variant="h6">Confirm Logout</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to log out?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You will need to log in again to access your account.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <LockOpen />}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ============================================================
// EXPORT: SecurityDashboard Component (default export)
// ============================================================
const SecurityDashboard = () => {
  const {
    user,
    isAuthenticated,
    userPlan,
    securityLogs,
    twoFactorEnabled,
    setTwoFactorEnabled,
    logSecurityEvent,
    isInitialized,
    loading,
    logout,
    getUserFromStorage,
    authError,
  } = useSecurity();

  const [showSecurityLogs, setShowSecurityLogs] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeStatus, setPasswordChangeStatus] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Profile state
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [localStorageData, setLocalStorageData] = useState({
    email: "",
    userId: "",
    firstName: "",
    lastName: "",
    planId: "",
    status: "",
    hasToken: false,
  });

  // Use localStorage utilities
  const { getItem, setItem, removeItem } = useLocalStorage();

  // Show snackbar message
  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Get all data from localStorage
  const loadLocalStorageData = useCallback(() => {
    const data = {
      email: getItem("userEmail") || "",
      userId: getItem("userId") || "",
      firstName: getItem("userFirstName") || "",
      lastName: getItem("userLastName") || "",
      planId: getItem("userPlanId") || getItem("userPlan") || "",
      status: getItem("userStatus") || "",
      hasToken: !!getItem("auth_token"),
      userData: getItem("userData") || null,
      userDataStorage: getItem(STORAGE_KEYS.USER_DATA) || null,
    };
    setLocalStorageData(data);
    console.log("LocalStorage Data Loaded:", data);
    return data;
  }, [getItem]);

  // Fetch current user profile
  const fetchProfile = useCallback(async () => {
    const authToken = getItem("auth_token");
    if (!authToken) {
      setProfileLoading(false);
      setProfileError("Not authenticated");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);

      const res = await fetch(`${API}/api/user/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 200 && data.user) {
          setProfile(data.user);
          // Update the user data in localStorage
          setItem(STORAGE_KEYS.USER_DATA, data.user);
          setItem("userData", data.user);
          setItem("userEmail", data.user.email);
          setItem("userId", data.user.id);
          setItem("userFirstName", data.user.first_name || "");
          setItem("userLastName", data.user.last_name || "");
          setItem("userStatus", "verified");
          if (data.user.planId || data.user.plan) {
            setItem("userPlanId", data.user.planId || data.user.plan || "basic");
            setItem("userPlan", data.user.planId || data.user.plan || "basic");
          }
          // Reload localStorage data after update
          loadLocalStorageData();
          logSecurityEvent(
            "profile_loaded",
            `Profile loaded for ${data.user.email}`,
          );
          return;
        }
      }

      if (res.status === 401) {
        setProfileError("Session expired. Please log in again.");
        logSecurityEvent(
          "profile_load_unauthorized",
          "Profile fetch returned 401",
          "warning",
        );
        // Clear invalid session data
        await logout();
        return;
      }

      const data = await res.json().catch(() => ({}));
      const msg = data.error || "Failed to load profile.";
      setProfileError(msg);
      logSecurityEvent(
        "profile_load_error",
        `Profile fetch failed: ${msg}`,
        "error",
      );
    } catch (err) {
      setProfileError("Network error. Could not reach the server.");
      logSecurityEvent(
        "profile_load_network_error",
        `Profile fetch network error: ${err.message}`,
        "error",
      );
    } finally {
      setProfileLoading(false);
    }
  }, [logSecurityEvent, getItem, setItem, logout, loadLocalStorageData]);

  // Load localStorage data on mount
  useEffect(() => {
    loadLocalStorageData();
  }, [loadLocalStorageData]);

  useEffect(() => {
    if (isInitialized && !loading) {
      fetchProfile();
    }
  }, [fetchProfile, isInitialized, loading]);

  // Show auth error if any
  useEffect(() => {
    if (authError) {
      showSnackbar(authError, "error");
    }
  }, [authError, showSnackbar]);

  const planDetails = {
    basic: {
      name: "Begin Plan",
      color: "#757575",
      securityFeatures: ["Custom key encryption", "Basic file protection"],
    },
    standard: {
      name: "Standard Plan",
      color: "#2196f3",
      securityFeatures: [
        "Custom key encryption",
        "Enhanced file protection",
        "Basic activity logging",
      ],
    },
    premium: {
      name: "Premium Plan",
      color: "#ff6f00",
      securityFeatures: [
        "Custom key encryption",
        "Advanced file protection",
        "Detailed activity logging",
        "Two-factor authentication",
      ],
    },
  };

  const currentPlan = planDetails[userPlan] || planDetails.basic;

  // Get user display name from all available sources
  const getUserDisplayName = () => {
    if (profile) {
      return profile.name || profile.username || profile.first_name || "User";
    }
    if (user) {
      return user.name || user.username || user.first_name || "User";
    }
    if (localStorageData.firstName || localStorageData.lastName) {
      return `${localStorageData.firstName} ${localStorageData.lastName}`.trim() || "User";
    }
    return "User";
  };

  const getUserEmail = () => {
    if (profile) {
      return profile.email;
    }
    if (user) {
      return user.email;
    }
    return localStorageData.email || "";
  };

  const getUserStatus = () => {
    if (profile?.is_verified) return "Verified";
    if (user?.is_verified) return "Verified";
    if (localStorageData.status === "verified") return "Verified";
    if (isAuthenticated) return "Authenticated";
    return localStorageData.status || "Not Authenticated";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name === "User") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword) {
      setPasswordChangeStatus("missing_current");
      showSnackbar("Please enter your current password", "warning");
      return;
    }

    if (!newPassword) {
      setPasswordChangeStatus("missing_new");
      showSnackbar("Please enter a new password", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus("passwords_dont_match");
      showSnackbar("New passwords do not match", "warning");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordChangeStatus("password_too_short");
      showSnackbar("New password must be at least 8 characters", "warning");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordChangeStatus("same_as_current");
      showSnackbar("New password must be different from your current password", "warning");
      return;
    }

    const authToken = getItem("auth_token");
    if (!authToken) {
      setPasswordChangeStatus("not_authenticated");
      showSnackbar("You are not authenticated. Please log in again.", "error");
      return;
    }

    try {
      setPasswordChangeStatus("changing");

      const res = await fetch(`${API}/api/user/change-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setPasswordChangeStatus("wrong_current");
        showSnackbar("Current password is incorrect. Please try again.", "error");
        logSecurityEvent(
          "password_change_failed",
          "Incorrect current password entered",
          "warning"
        );
        return;
      }

      if (res.status === 400) {
        if (data.error && data.error.includes("same as the old password")) {
          setPasswordChangeStatus("same_as_current");
          showSnackbar("New password cannot be the same as your current password", "warning");
        } else {
          setPasswordChangeStatus("error");
          showSnackbar(data.error || "Invalid password change request", "error");
        }
        logSecurityEvent(
          "password_change_error",
          `Failed to change password: ${data.error || res.statusText}`,
          "error"
        );
        return;
      }

      if (res.status === 403) {
        setPasswordChangeStatus("not_authenticated");
        showSnackbar("Session expired. Please log in again.", "error");
        await logout();
        return;
      }

      if (!res.ok) {
        setPasswordChangeStatus("error");
        showSnackbar(data.error || "Failed to change password. Please try again.", "error");
        logSecurityEvent(
          "password_change_error",
          `Failed to change password: ${data.error || res.statusText}`,
          "error"
        );
        return;
      }

      // Success
      setPasswordChangeStatus("success");
      showSnackbar("Password changed successfully!", "success");
      logSecurityEvent(
        "password_changed",
        "User password changed successfully",
      );

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (data.user) {
        setItem(STORAGE_KEYS.USER_DATA, data.user);
        setItem("userData", data.user);
        if (data.token) {
          setItem("auth_token", data.token);
        }
        // Update profile with new user data
        setProfile(data.user);
        // Reload localStorage data
        loadLocalStorageData();
      }

      setTimeout(() => {
        setPasswordChangeStatus("");
      }, 5000);

    } catch (error) {
      console.error("Password change error:", error);
      setPasswordChangeStatus("error");
      showSnackbar("Network error. Please try again.", "error");
      logSecurityEvent(
        "password_change_error",
        `Failed to change password: ${error.message}`,
        "error"
      );
    }
  };

  const handleTwoFactorToggle = async () => {
    const authToken = getItem("auth_token");
    if (!authToken) {
      logSecurityEvent(
        "2fa_toggle_error",
        "Not authenticated - cannot toggle 2FA",
        "error",
      );
      showSnackbar("Please log in to manage 2FA", "error");
      return;
    }

    try {
      const endpoint = twoFactorEnabled
        ? "/api/user/2fa/disable"
        : "/api/user/2fa/enable";
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to ${twoFactorEnabled ? "disable" : "enable"} 2FA`,
        );
      }

      const newTwoFactorState = !twoFactorEnabled;
      setTwoFactorEnabled(newTwoFactorState);
      setItem("two_factor_enabled", newTwoFactorState);

      logSecurityEvent(
        twoFactorEnabled ? "2fa_disabled" : "2fa_enabled",
        `Two-factor authentication ${twoFactorEnabled ? "disabled" : "enabled"}`,
      );
      showSnackbar(
        `Two-factor authentication ${twoFactorEnabled ? "disabled" : "enabled"} successfully`,
        "success"
      );
    } catch (error) {
      logSecurityEvent(
        "2fa_toggle_error",
        `Failed to toggle 2FA: ${error.message}`,
        "error",
      );
      showSnackbar(`Failed to toggle 2FA: ${error.message}`, "error");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
  };

  // If loading, show loading
  if (loading || !isInitialized) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography align="center" sx={{ mt: 2 }}>
          Loading security settings...
        </Typography>
      </Container>
    );
  }

  return (
    <div className="dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor:
              userPlan === "basic"
                ? "rgba(117, 117, 117, 0.1)"
                : userPlan === "standard"
                  ? "rgba(33, 150, 243, 0.1)"
                  : "rgba(255, 111, 0, 0.1)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: currentPlan.color,
                  fontSize: 28,
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Security Center
                </Typography>
                {profileLoading ? (
                  <LinearProgress sx={{ width: 200, mt: 1 }} />
                ) : profileError ? (
                  <Typography variant="body2" color="error">
                    {profileError}
                  </Typography>
                ) : (
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body1" color="text.secondary">
                        {getUserDisplayName()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {getUserEmail()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                      {isAuthenticated ? (
                        <>
                          <Verified fontSize="small" color="success" />
                          <Typography variant="body2" color="success.main">
                            Status: {getUserStatus()}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Cancel fontSize="small" color="error" />
                          <Typography variant="body2" color="error.main">
                            Status: Not Authenticated
                          </Typography>
                        </>
                      )}
                      <Chip
                        label={currentPlan.name}
                        size="small"
                        sx={{
                          backgroundColor: currentPlan.color,
                          color: "white",
                          ml: 1,
                        }}
                      />
                      {twoFactorEnabled && (
                        <Chip
                          label="2FA Enabled"
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                      <Badge sx={{ fontSize: 12 }} />
                      <Typography variant="caption" color="text.secondary">
                        User ID: {profile?.id || localStorageData.userId || user?.id || "N/A"}
                      </Typography>
                    </Stack>
                    {localStorageData.hasToken && (
                      <Typography variant="caption" color="success.main" sx={{ mt: 0.5 }}>
                        ✅ Token Present in localStorage
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
            <Box>
              {isAuthenticated && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleLogoutClick}
                  startIcon={<LockOpen />}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Security Status */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: currentPlan.color }}
              >
                Security Status
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {isAuthenticated ? (
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                  ) : (
                    <Error color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">
                    {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  {twoFactorEnabled ? (
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                  ) : (
                    <Error color="warning" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">
                    Two-Factor Authentication:{" "}
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Encryption: {currentPlan.securityFeatures[0]}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowSecurityLogs(true)}
                startIcon={<History />}
              >
                View Security Logs ({securityLogs.length})
              </Button>
            </Card>
          </Grid>

          {/* Two-Factor Authentication */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: currentPlan.color }}
              >
                Two-Factor Authentication
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Add an extra layer of security to your account by enabling
                two-factor authentication.
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={handleTwoFactorToggle}
                    disabled={userPlan !== "premium" || !isAuthenticated}
                  />
                }
                label="Enable Two-Factor Authentication"
              />

              {userPlan !== "premium" && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Two-factor authentication is available only for Premium plans.
                </Alert>
              )}
            </Card>
          </Grid>

          {/* Password Management */}
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: currentPlan.color }}
              >
                Change Password
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Enter your current password and choose a new password. 
                  New password must be at least 8 characters long.
                </Typography>
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Current Password</InputLabel>
                    <OutlinedInput
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            edge="end"
                          >
                            {showCurrentPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Current Password"
                      placeholder="Enter your current password"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>New Password</InputLabel>
                    <OutlinedInput
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New Password"
                      placeholder="Enter your new password"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Confirm New Password</InputLabel>
                    <OutlinedInput
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={
                        newPassword !== confirmPassword &&
                        confirmPassword !== ""
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm New Password"
                      placeholder="Confirm your new password"
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handlePasswordChange}
                  disabled={
                    !isAuthenticated ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    passwordChangeStatus === "changing"
                  }
                  sx={{ backgroundColor: currentPlan.color }}
                >
                  {passwordChangeStatus === "changing"
                    ? "Changing..."
                    : "Change Password"}
                </Button>

                {passwordChangeStatus === "success" && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Password changed successfully!
                  </Alert>
                )}

                {passwordChangeStatus === "error" && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to change password. Please try again.
                  </Alert>
                )}

                {passwordChangeStatus === "wrong_current" && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Current password is incorrect. Please try again.
                  </Alert>
                )}

                {passwordChangeStatus === "missing_current" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Please enter your current password.
                  </Alert>
                )}

                {passwordChangeStatus === "same_as_current" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    New password must be different from your current password.
                  </Alert>
                )}

                {passwordChangeStatus === "passwords_dont_match" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    New passwords do not match.
                  </Alert>
                )}

                {passwordChangeStatus === "password_too_short" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    New password must be at least 8 characters.
                  </Alert>
                )}

                {passwordChangeStatus === "not_authenticated" && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    You are not authenticated. Please log in again.
                  </Alert>
                )}

                {passwordChangeStatus === "changing" && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Changing password...
                  </Alert>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Security Features by Plan */}
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: currentPlan.color }}
              >
                Security Features by Plan
              </Typography>

              <Grid container spacing={2}>
                {Object.entries(planDetails).map(([planId, plan]) => (
                  <Grid item xs={12} md={4} key={planId}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        border:
                          userPlan === planId
                            ? `2px solid ${plan.color}`
                            : "1px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="h6" sx={{ color: plan.color }}>
                        {plan.name}
                      </Typography>

                      <List dense>
                        {plan.securityFeatures.map((feature, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                      </List>

                      {userPlan !== planId && userPlan !== "premium" && (
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            mt: 1,
                            borderColor: plan.color,
                            color: plan.color,
                          }}
                          onClick={() => (window.location.href = "/features")}
                        >
                          Upgrade
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* Security Logs Dialog */}
        <Dialog
          open={showSecurityLogs}
          onClose={() => setShowSecurityLogs(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <History sx={{ mr: 1, color: currentPlan.color }} />
              Security Logs ({securityLogs.length})
            </Box>
          </DialogTitle>
          <DialogContent>
            {securityLogs.length === 0 ? (
              <Typography align="center" sx={{ py: 4 }} color="text.secondary">
                No security events logged yet.
              </Typography>
            ) : (
              <List>
                {securityLogs.map((log) => (
                  <ListItem key={log.id} divider>
                    <ListItemText
                      primary={log.description}
                      secondary={
                        <>
                          <Typography variant="caption" display="block">
                            {new Date(log.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Event: {log.eventType}
                          </Typography>
                          <Typography variant="caption" display="block">
                            User ID: {log.userId}
                          </Typography>
                        </>
                      }
                    />
                    <Chip
                      label={log.severity}
                      size="small"
                      color={
                        log.severity === "error"
                          ? "error"
                          : log.severity === "warning"
                            ? "warning"
                            : "default"
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSecurityLogs(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Logout Dialog */}
        <LogoutDialog
          open={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          onConfirm={handleLogoutConfirm}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default SecurityDashboard;