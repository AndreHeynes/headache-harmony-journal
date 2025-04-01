
/**
 * Secure Storage Utility
 * 
 * This utility provides basic encryption for sensitive data stored in localStorage.
 * Note: Client-side encryption has limitations and should not be solely relied upon for highly sensitive data.
 * Once Supabase is integrated, sensitive data should be moved to the backend.
 */

// Simple encryption key derived from app name - will be replaced with proper auth when Supabase is integrated
const ENCRYPTION_KEY = window.btoa('headache-journal-secure-storage');

/**
 * Basic encryption of data for localStorage
 * This provides a minimal level of obfuscation, not true security
 */
export const encryptData = (data: any): string => {
  try {
    const jsonData = JSON.stringify(data);
    const encodedData = window.btoa(jsonData);
    // Simple XOR operation with the key for basic obfuscation
    return Array.from(encodedData)
      .map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
      )
      .join('');
  } catch (error) {
    console.error('Error encrypting data:', error);
    return '';
  }
};

/**
 * Decrypt data from localStorage
 */
export const decryptData = (encryptedData: string): any => {
  if (!encryptedData) return null;
  
  try {
    // Reverse the XOR operation
    const decodedData = Array.from(encryptedData)
      .map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
      )
      .join('');
    
    const jsonData = window.atob(decodedData);
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

/**
 * Securely set item in localStorage with encryption
 */
export const secureSetItem = (key: string, value: any): void => {
  try {
    const encryptedValue = encryptData(value);
    localStorage.setItem(key, encryptedValue);
  } catch (error) {
    console.error(`Error storing ${key} securely:`, error);
  }
};

/**
 * Securely get item from localStorage with decryption
 */
export const secureGetItem = <T>(key: string, defaultValue: T = null as unknown as T): T => {
  try {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return defaultValue;
    
    const decryptedValue = decryptData(encryptedValue);
    return decryptedValue ?? defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} securely:`, error);
    return defaultValue;
  }
};

/**
 * Securely remove item from localStorage
 */
export const secureRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

/**
 * Clear all secure storage
 */
export const secureClearAll = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing secure storage:', error);
  }
};
