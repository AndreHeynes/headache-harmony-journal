
import { TestEvent } from "@/contexts/TestContext";

// Error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

// Extended error information
export interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  severity: ErrorSeverity;
  userAction?: string;
  metadata?: Record<string, any>;
}

// Convert standard error to detailed format
export const normalizeError = (error: unknown): ErrorDetails => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      severity: ErrorSeverity.MEDIUM,
      metadata: {}
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      severity: ErrorSeverity.MEDIUM,
      metadata: {}
    };
  }
  
  return {
    message: 'Unknown error',
    severity: ErrorSeverity.MEDIUM,
    metadata: { rawError: error }
  };
};

// Create a test event from error details
export const createErrorEvent = (
  error: unknown, 
  component?: string, 
  severity?: ErrorSeverity, 
  userAction?: string
): Omit<TestEvent, "timestamp"> => {
  const normalizedError = normalizeError(error);
  
  if (severity) {
    normalizedError.severity = severity;
  }
  
  if (userAction) {
    normalizedError.userAction = userAction;
  }

  return {
    type: "error",
    details: normalizedError.message,
    component,
    metadata: {
      ...normalizedError,
      timestamp: new Date().toISOString()
    }
  };
};

// Utility to create a unique error ID for reference
export const generateErrorId = (): string => {
  return `err-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

// Helper to extract useful information from browser
export const getBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  };
};

