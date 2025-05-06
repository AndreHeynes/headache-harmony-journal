
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ErrorSeverity, getBrowserInfo } from "@/utils/errorReporting";

interface TestContextType {
  isTestMode: boolean;
  setIsTestMode: (value: boolean) => void;
  isPremiumOverride: boolean;
  setIsPremiumOverride: (value: boolean) => void;
  testEvents: TestEvent[];
  logTestEvent: (event: Omit<TestEvent, "timestamp">) => void;
  clearTestEvents: () => void;
  showTestGuide: boolean;
  setShowTestGuide: (value: boolean) => void;
  trackError: (error: unknown, component?: string, severity?: ErrorSeverity, userAction?: string) => void;
  sessionInfo: SessionInfo;
}

export interface SessionInfo {
  sessionId: string;
  startTime: number;
  deviceInfo: Record<string, any>;
  totalEvents: number;
  errorCount: number;
  lastActive: number;
}

export interface TestEvent {
  type: "navigation" | "feature_usage" | "error" | "feedback" | "action";
  details: string;
  component?: string;
  timestamp: number;
  metadata?: Record<string, any>;
  severity?: ErrorSeverity;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [isPremiumOverride, setIsPremiumOverride] = useState<boolean>(false);
  const [testEvents, setTestEvents] = useState<TestEvent[]>([]);
  const [showTestGuide, setShowTestGuide] = useState<boolean>(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    sessionId: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    startTime: Date.now(),
    deviceInfo: getBrowserInfo(),
    totalEvents: 0,
    errorCount: 0,
    lastActive: Date.now()
  });

  // Load test mode settings from localStorage on mount
  useEffect(() => {
    const storedTestMode = localStorage.getItem('testMode') === 'true';
    const storedPremiumOverride = localStorage.getItem('premiumOverride') === 'true';
    
    setIsTestMode(storedTestMode);
    setIsPremiumOverride(storedPremiumOverride);
  }, []);

  // Save test mode settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('testMode', isTestMode.toString());
    localStorage.setItem('premiumOverride', isPremiumOverride.toString());
    
    // Check if this is the first time enabling test mode
    if (isTestMode && localStorage.getItem('testGuideShown') !== 'true') {
      setShowTestGuide(true);
      localStorage.setItem('testGuideShown', 'true');
    }
  }, [isTestMode, isPremiumOverride]);

  // Update session info when events are added
  useEffect(() => {
    if (testEvents.length > 0) {
      setSessionInfo(prev => ({
        ...prev,
        totalEvents: testEvents.length,
        errorCount: testEvents.filter(e => e.type === 'error').length,
        lastActive: Date.now()
      }));
    }
  }, [testEvents]);

  // Set up unhandled error listeners
  useEffect(() => {
    if (!isTestMode) return;

    const handleGlobalError = (event: ErrorEvent) => {
      logTestEvent({
        type: "error",
        details: event.message || "Unhandled error",
        component: "GlobalErrorHandler",
        metadata: {
          stack: event.error?.stack,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString()
        },
        severity: ErrorSeverity.HIGH
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      logTestEvent({
        type: "error",
        details: event.reason?.message || "Unhandled promise rejection",
        component: "PromiseRejectionHandler",
        metadata: {
          stack: event.reason?.stack,
          reason: event.reason,
          timestamp: new Date().toISOString()
        },
        severity: ErrorSeverity.MEDIUM
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [isTestMode]);

  const logTestEvent = (event: Omit<TestEvent, "timestamp">) => {
    if (!isTestMode) return;
    
    const newEvent: TestEvent = {
      ...event,
      timestamp: Date.now(),
    };

    setTestEvents(prev => [newEvent, ...prev]);
    console.log("Test event:", newEvent);
    
    // In a real app, you might send this to a server or analytics service
  };

  const trackError = (
    error: unknown, 
    component?: string, 
    severity: ErrorSeverity = ErrorSeverity.MEDIUM, 
    userAction?: string
  ) => {
    if (!isTestMode) return;
    
    let errorMessage = "Unknown error";
    let errorStack = undefined;
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack;
      errorDetails = { name: error.name };
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    logTestEvent({
      type: "error",
      details: errorMessage,
      component: component || "Unknown",
      severity,
      metadata: {
        stack: errorStack,
        userAction,
        browserInfo: getBrowserInfo(),
        sessionId: sessionInfo.sessionId,
        ...errorDetails,
        timestamp: new Date().toISOString()
      }
    });
  };

  const clearTestEvents = () => {
    setTestEvents([]);
  };

  return (
    <TestContext.Provider value={{
      isTestMode,
      setIsTestMode,
      isPremiumOverride,
      setIsPremiumOverride,
      testEvents,
      logTestEvent,
      clearTestEvents,
      showTestGuide,
      setShowTestGuide,
      trackError,
      sessionInfo
    }}>
      {children}
    </TestContext.Provider>
  );
}

export const useTestContext = (): TestContextType => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTestContext must be used within a TestProvider");
  }
  return context;
};
