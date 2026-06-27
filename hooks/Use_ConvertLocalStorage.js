import { useState, useEffect } from "react";
// FIX: Import localStorageUtils instead of useLocalStorage
import { localStorageUtils } from "./Use_LocalStorage";

export function useConvertLocalStorage(key, initialValue = []) {
  // Initialize state from localStorage
  const [conversions, setConversionsState] = useState(() => {
    // FIX: Use localStorageUtils.getItem
    const stored = localStorageUtils.getItem(key);
    return stored || initialValue;
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    // FIX: Use localStorageUtils.setItem
    localStorageUtils.setItem(key, conversions);
  }, [key, conversions]);

  const setConversions = (value) => {
    const valueToStore = value instanceof Function ? value(conversions) : value;
    setConversionsState(valueToStore);
  };

  // Add conversion with timestamp and metadata
  const addConversion = (file, result, type) => {
    const newConversion = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      originalFile: file.name || file.originalName || "unknown",
      originalName: file.originalName || file.name || "unknown",
      convertedName: file.convertedName || "",
      originalFormat: file.originalFormat || "",
      conversionType: type || "converted",
      fileSize: file.size || 0,
      result: result,
      status: "completed",
    };

    setConversions((prev) => {
      const filtered = prev.filter((item) => item.id !== newConversion.id);
      return [newConversion, ...filtered].slice(0, 50); // Keep last 50
    });

    return newConversion;
  };

  // Filter conversions by type
  const getConversionsByType = (type) => {
    return conversions.filter((conv) => conv.conversionType === type);
  };

  // Get recent conversions (last 24 hours)
  const getRecentConversions = () => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return conversions.filter(
      (conv) => new Date(conv.timestamp) > twentyFourHoursAgo
    );
  };

  // Update conversion status
  const updateConversionStatus = (id, status, error = null) => {
    setConversions((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, status, error: error || conv.error } : conv
      )
    );
  };

  return {
    conversions,
    addConversion,
    removeConversion: (id) =>
      setConversions((prev) => prev.filter((conv) => conv.id !== id)),
    clearConversions: () => setConversions([]),
    getConversionsByType,
    getRecentConversions,
    updateConversionStatus,
    totalConversions: conversions.length,
  };
}