
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Test Event Types
export type TestEventType = "error" | "warning" | "action" | "feature_usage" | "navigation" | "feedback";

export interface TestEvent {
  timestamp: number;
  type: TestEventType;
  details: string;
  component?: string;
  metadata?: any;
  severity?: string; // Add severity property for error events
}

// Premium Features Interface
export interface PremiumFeatures {
  insights: boolean;
  variables: boolean;
  neck_correlation: boolean;
  export: boolean;
  menstrual_tracking: boolean;
  weather_tracking: boolean;
}

// Session information interface
export interface SessionInfo {
  sessionId: string;
  startTime: number;
  totalEvents: number;
  errorCount: number;
}

// Test Context Type
interface TestContextType {
  isTestMode: boolean;
  setIsTestMode: (mode: boolean) => void;
  isPremiumOverride: boolean;
  setIsPremiumOverride: (isPremium: boolean) => void;
  testEvents: TestEvent[];
  logTestEvent: (event: Omit<TestEvent, "timestamp">) => void;
  clearTestEvents: () => void;
  premiumFeatures: PremiumFeatures;
  updatePremiumFeature: (feature: keyof PremiumFeatures, value: boolean) => void;
  // Add missing properties
  trackError: (error: unknown, component?: string, severity?: string, action?: string) => void;
  sessionInfo: SessionInfo;
  showTestGuide: boolean;
  setShowTestGuide: (show: boolean) => void;
}

// Default values for premium features
const defaultPremiumFeatures: PremiumFeatures = {
  insights: false,
  variables: false,
  neck_correlation: false,
  export: false,
  menstrual_tracking: false,
  weather_tracking: false
};

// Generate a unique session ID
const generateSessionId = (): string => {
  return `test-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

// Create the context
const TestContext = createContext<TestContextType>({
  isTestMode: false,
  setIsTestMode: () => {},
  isPremiumOverride: false,
  setIsPremiumOverride: () => {},
  testEvents: [],
  logTestEvent: () => {},
  clearTestEvents: () => {},
  premiumFeatures: defaultPremiumFeatures,
  updatePremiumFeature: () => {},
  trackError: () => {},
  sessionInfo: {
    sessionId: generateSessionId(),
    startTime: Date.now(),
    totalEvents: 0,
    errorCount: 0
  },
  showTestGuide: false,
  setShowTestGuide: () => {}
});

// Provider component
export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [isTestMode, setIsTestMode] = useState(false);
  const [isPremiumOverride, setIsPremiumOverride] = useState(false);
  const [testEvents, setTestEvents] = useState<TestEvent[]>([]);
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeatures>(defaultPremiumFeatures);
  const [showTestGuide, setShowTestGuide] = useState(false);
  
  // Initialize session info
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    sessionId: generateSessionId(),
    startTime: Date.now(),
    totalEvents: 0,
    errorCount: 0
  });

  const logTestEvent = (event: Omit<TestEvent, "timestamp">) => {
    const newEvent: TestEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    setTestEvents(prev => [newEvent, ...prev]);
    
    // Update session info
    setSessionInfo(prev => ({
      ...prev,
      totalEvents: prev.totalEvents + 1,
      errorCount: event.type === "error" ? prev.errorCount + 1 : prev.errorCount
    }));
    
    console.log("Test event logged:", newEvent);
  };

  const clearTestEvents = () => {
    setTestEvents([]);
    // Reset error count but maintain session info
    setSessionInfo(prev => ({
      ...prev,
      errorCount: 0,
      totalEvents: 0
    }));
  };

  const updatePremiumFeature = (feature: keyof PremiumFeatures, value: boolean) => {
    setPremiumFeatures(prev => ({
      ...prev,
      [feature]: value
    }));
  };
  
  // Helper function for tracking errors
  const trackError = (error: unknown, component?: string, severity?: string, action?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logTestEvent({
      type: "error",
      details: errorMessage,
      component,
      severity,
      metadata: {
        stack: errorStack,
        action,
        timestamp: new Date().toISOString()
      }
    });
  };

  // This effect runs when isPremiumOverride changes
  React.useEffect(() => {
    if (isPremiumOverride) {
      // When premium override is enabled, enable all premium features
      setPremiumFeatures({
        insights: true,
        variables: true,
        neck_correlation: true,
        export: true,
        menstrual_tracking: true,
        weather_tracking: true
      });
    } else {
      // When premium override is disabled, disable all premium features
      setPremiumFeatures(defaultPremiumFeatures);
    }
  }, [isPremiumOverride]);

  return (
    <TestContext.Provider value={{
      isTestMode,
      setIsTestMode,
      isPremiumOverride,
      setIsPremiumOverride,
      testEvents,
      logTestEvent,
      clearTestEvents,
      premiumFeatures,
      updatePremiumFeature,
      trackError,
      sessionInfo,
      showTestGuide,
      setShowTestGuide
    }}>
      {children}
    </TestContext.Provider>
  );
};

// Custom hook to use the test context
export const useTestContext = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTestContext must be used within a TestProvider");
  }
  return context;
};
