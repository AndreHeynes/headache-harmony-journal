
import React, { useEffect } from "react";
import { useTestContext } from "@/contexts/TestContext";
import { createErrorEvent, ErrorSeverity } from "@/utils/errorReporting";
import ErrorBoundaryWithContext from "@/components/testing/ErrorBoundary";

// Higher-order component to wrap components with error tracking
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function WithErrorTracking(props: P) {
    const { logTestEvent } = useTestContext();

    // Set up global error handler for this component
    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        // Check if the error is from this component (approximate matching)
        const errorString = event.error?.toString() || event.message;
        if (errorString.includes(componentName)) {
          logTestEvent(
            createErrorEvent(
              event.error || event.message,
              componentName,
              ErrorSeverity.MEDIUM,
              "Runtime Error"
            )
          );
        }
      };

      window.addEventListener('error', handleError);
      
      return () => {
        window.removeEventListener('error', handleError);
      };
    }, [logTestEvent]);

    return (
      <ErrorBoundaryWithContext component={componentName}>
        <Component {...props} />
      </ErrorBoundaryWithContext>
    );
  };
}

// Hook for manual error tracking within components
export const useErrorTracking = (componentName: string) => {
  const { logTestEvent } = useTestContext();

  const trackError = (
    error: unknown, 
    action?: string, 
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ) => {
    logTestEvent(
      createErrorEvent(error, componentName, severity, action)
    );
  };

  return { trackError };
};
