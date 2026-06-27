import { useState, useEffect } from "react";

//const useLoginWindowLocalStorage = (key, initialValue) => {
  // Get stored value from localStorage or use initial value


const useLoginWindowLocalStorage = (key, initialValue) => {
  // Get stored value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when storedValue changes
  useEffect(() => {
    try {
      if (storedValue !== undefined && storedValue !== null) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Return wrapped setter function
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error setting value for key "${key}":`, error);
    }
  };

  // Return both the value and setter function
  return [storedValue, setValue];
};

export default useLoginWindowLocalStorage;