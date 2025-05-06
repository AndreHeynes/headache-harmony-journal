
import React, { Component, ErrorInfo, ReactNode } from "react";
import { useTestContext } from "@/contexts/TestContext";
import { createErrorEvent, ErrorSeverity } from "@/utils/errorReporting";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  component?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Context consumer component to access test context inside class component
const ErrorBoundaryWithContext = (props: Props) => {
  const { logTestEvent } = useTestContext();
  
  return <ErrorBoundaryInternal {...props} logTestEvent={logTestEvent} />;
};

// Main error boundary component
class ErrorBoundaryInternal extends Component<
  Props & { logTestEvent: (event: any) => void },
  State
> {
  constructor(props: Props & { logTestEvent: (event: any) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the test context
    this.props.logTestEvent(
      createErrorEvent(
        error, 
        this.props.component || "Unknown", 
        ErrorSeverity.HIGH, 
        "Component Render"
      )
    );
    
    // Pass the error to the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    console.error("Component error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise show default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Alert className="bg-red-900/20 border-red-800 mb-4">
          <AlertTitle className="text-white">Something went wrong</AlertTitle>
          <AlertDescription className="text-gray-300">
            <p className="mb-2">An error occurred in this component.</p>
            {this.state.error && (
              <p className="text-xs text-red-300 mb-4">
                {this.state.error.message}
              </p>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleReset}
              className="text-white border-white/30 hover:bg-red-800/30"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithContext;
