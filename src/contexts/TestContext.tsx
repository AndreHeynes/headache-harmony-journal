import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ErrorSeverity, getBrowserInfo } from "@/utils/errorReporting";

interface TestContextType {
  isTestMode: boolean;
  setIsTestMode: (value: boolean) => void;
  isPremiumOverride: boolean;
  setIsPremiumOverride: (value: boolean) => void;
  premiumFeatures: PremiumFeatureState;
  togglePremiumFeature: (feature: PremiumFeature, enabled: boolean) => void;
  testEvents: TestEvent[];
  logTestEvent: (event: Omit<TestEvent, "timestamp">) => void;
  clearTestEvents: () => void;
  showTestGuide: boolean;
  setShowTestGuide: (value: boolean) => void;
  trackError: (error: unknown, component?: string, severity?: ErrorSeverity, userAction?: string) => void;
  sessionInfo: SessionInfo;
}

export type PremiumFeature = 
  | "insights" 
  | "variables" 
  | "export" 
  | "patterns" 
  | "custom_reports"
  | "neck_correlation";

export interface PremiumFeatureState {
  insights: boolean;
  variables: boolean;
  export: boolean;
  patterns: boolean;
  custom_reports: boolean;
  neck_correlation: boolean;
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

// Default premium features configuration (all disabled)
const DEFAULT_PREMIUM_FEATURES: PremiumFeatureState = {
  insights: false,
  variables: false,
  export: false,
  patterns: false,
  custom_reports: false,
  neck_correlation: false
};

export function TestProvider({ children }: { children: ReactNode }) {
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [isPremiumOverride, setIsPremiumOverride] = useState<boolean>(false);
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeatureState>(DEFAULT_PREMIUM_FEATURES);
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
    
    // Load individual premium feature settings
    const storedPremiumFeatures = localStorage.getItem('premiumFeatures');
    const parsedFeatures = storedPremiumFeatures ? 
      JSON.parse(storedPremiumFeatures) : DEFAULT_PREMIUM_FEATURES;
    
    setIsTestMode(storedTestMode);
    setIsPremiumOverride(storedPremiumOverride);
    setPremiumFeatures(parsedFeatures);
  }, []);

  // Save test mode settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('testMode', isTestMode.toString());
    localStorage.setItem('premiumOverride', isPremiumOverride.toString());
    
    // When premium override is toggled, update all features accordingly
    if (isPremiumOverride) {
      const allEnabled = Object.keys(premiumFeatures).reduce((acc, key) => {
        return { ...acc, [key]: true };
      }, {} as PremiumFeatureState);
      setPremiumFeatures(allEnabled);
      localStorage.setItem('premiumFeatures', JSON.stringify(allEnabled));
    } else {
      // When premium is disabled, turn off all features
      setPremiumFeatures(DEFAULT_PREMIUM_FEATURES);
      localStorage.setItem('premiumFeatures', JSON.stringify(DEFAULT_PREMIUM_FEATURES));
    }
    
    // Check if this is the first time enabling test mode
    if (isTestMode && localStorage.getItem('testGuideShown') !== 'true') {
      setShowTestGuide(true);
      localStorage.setItem('testGuideShown', 'true');
    }
  }, [isTestMode, isPremiumOverride]);

  // Save individual premium features when they change
  useEffect(() => {
    localStorage.setItem('premiumFeatures', JSON.stringify(premiumFeatures));
  }, [premiumFeatures]);

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

  const togglePremiumFeature = (feature: PremiumFeature, enabled: boolean) => {
    setPremiumFeatures(prev => {
      const updatedFeatures = { ...prev, [feature]: enabled };
      localStorage.setItem('premiumFeatures', JSON.stringify(updatedFeatures));
      
      // Log this premium feature toggle for testing data
      if (isTestMode) {
        logTestEvent({
          type: "action",
          details: `Premium feature '${feature}' ${enabled ? "enabled" : "disabled"}`,
          component: "PremiumFeatureToggle",
          metadata: { feature, enabled }
        });
      }
      
      return updatedFeatures;
    });
  };

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
      premiumFeatures,
      togglePremiumFeature,
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
