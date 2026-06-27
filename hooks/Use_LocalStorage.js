import { useState } from "react";

// Utility functions for direct localStorage access
export const localStorageUtils = {
  getItem: (key) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error getting item from localStorage:", error);
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting item in localStorage:", error);
    }
  },

  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from localStorage:", error);
    }
  },

  clear: () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// React hook for useState-like functionality
export const useLocalStorageNew = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorageUtils.getItem(key);
    return item !== null ? item : initialValue;
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorageUtils.setItem(key, valueToStore);
  };

  return [storedValue, setValue];
};

// React hook for localStorage with methods
export const useLocalStorage = () => {
  const getItem = (key) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error getting item from localStorage:", error);
      return null;
    }
  };

  const setItem = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting item in localStorage:", error);
    }
  };

  const removeItem = (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from localStorage:", error);
    }
  };

  const clear = () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return { getItem, setItem, removeItem, clear };
};

// For backward compatibility
export { localStorageUtils as originalUseLocalStorage } from "./Use_LocalStorage.js";
