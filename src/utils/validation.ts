
/**
 * Input validation utilities for form security
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * Requires at least 8 characters, one uppercase letter, one lowercase letter, one number
 */
export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Gets password strength feedback
 */
export const getPasswordStrength = (password: string): { score: number; feedback: string } => {
  if (!password) return { score: 0, feedback: "Password is required" };
  
  let score = 0;
  let feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters");
  } else {
    score += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push("Add an uppercase letter");
  } else {
    score += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push("Add a lowercase letter");
  } else {
    score += 1;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push("Add a number");
  } else {
    score += 1;
  }
  
  // Special character check
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push("Add a special character");
  } else {
    score += 1;
  }
  
  return {
    score,
    feedback: feedback.join(", ") || "Password strength is good"
  };
};

/**
 * Sanitizes input to prevent XSS attacks
 * Enhanced implementation with more security checks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove script tags and event handlers
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<iframe/gi, '')
    .replace(/<embed/gi, '')
    .replace(/<object/gi, '');
  
  // HTML entity encoding
  sanitized = sanitized
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
  
  return sanitized;
};

/**
 * Validates name input (alphanumeric with spaces and common special characters)
 */
export const isValidName = (name: string): boolean => {
  // Allow letters, numbers, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z0-9\s\-']+$/;
  return nameRegex.test(name);
};

/**
 * Validates age input (positive number between 1 and 120)
 */
export const isValidAge = (age: string | number): boolean => {
  const ageNum = parseInt(age.toString(), 10);
  return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
};

/**
 * Validates text input for notes or comments (basic sanitization)
 */
export const validateAndSanitizeText = (text: string): string => {
  if (!text) return '';
  
  // First sanitize
  let sanitized = sanitizeInput(text);
  
  // Trim and limit length
  sanitized = sanitized.trim().slice(0, 5000); // Reasonable limit for text inputs
  
  return sanitized;
};
