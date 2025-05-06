
import { TestEvent } from "./types";

// Generate a unique session ID
export const generateSessionId = (): string => {
  return `test-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

// Helper function for tracking errors
export const createErrorEvent = (
  error: unknown, 
  component?: string, 
  severity?: string, 
  action?: string
): Omit<TestEvent, "timestamp"> => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  return {
    type: "error",
    details: errorMessage,
    component,
    severity,
    metadata: {
      stack: errorStack,
      action,
      timestamp: new Date().toISOString()
    }
  };
};
