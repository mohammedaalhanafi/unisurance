// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get stored value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Function to update both state and localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('local-storage-update', { 
        detail: { key, value: valueToStore } 
      }));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  // Listen for changes to this localStorage key from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.detail && e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('local-storage-update', handleStorageChange);
    
    return () => {
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;