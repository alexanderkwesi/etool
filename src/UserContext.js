// context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on app start
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = localStorage.getItem("userData");
        const authToken = localStorage.getItem("auth_token");

        if (userData && authToken) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Optional: Validate token with backend
          // await validateToken(authToken);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("auth_token", token);
  };

  // Logout function
  const clearUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userData");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userPlanId");
    localStorage.removeItem("userEmail");
    // Clear other user-related storage
  };

  // Update user profile
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("userData", JSON.stringify(newUser));
      return newUser;
    });
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout: clearUser,
    updateUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
