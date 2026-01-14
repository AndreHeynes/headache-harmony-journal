import React, { createContext, useState, ReactNode, useEffect } from "react";
import { 
  TestContextType, 
  TestEvent, 
  PremiumFeatures,
  defaultPremiumFeatures, 
  SessionInfo 
} from "./types";
import { generateSessionId, createErrorEvent } from "./utils";
import { 
  saveTestEvents, 
  loadTestEvents, 
  clearTestEvents as clearStoredEvents 
} from "@/utils/testEventStorage";
import { APP_CONFIG } from "@/config/appConfig";

// All premium features enabled for beta mode
const allPremiumEnabled: PremiumFeatures = {
  insights: true,
  variables: true,
  neck_correlation: true,
  export: true,
  menstrual_tracking: true,
  weather_tracking: true
};

// Create the context
export const TestContext = createContext<TestContextType>({
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
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeatures>(
    APP_CONFIG.BETA_MODE ? allPremiumEnabled : defaultPremiumFeatures
  );
  const [showTestGuide, setShowTestGuide] = useState(false);
  
  // Initialize session info
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    sessionId: generateSessionId(),
    startTime: Date.now(),
    totalEvents: 0,
    errorCount: 0
  });

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = loadTestEvents();
    if (storedEvents.length > 0) {
      setTestEvents(storedEvents);
      console.log(`Loaded ${storedEvents.length} events from localStorage`);
    }
  }, []);

  // Save events to localStorage whenever they change (with debouncing)
  useEffect(() => {
    if (testEvents.length > 0) {
      const timeoutId = setTimeout(() => {
        saveTestEvents(testEvents);
      }, 500); // Debounce by 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [testEvents]);

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
    // Clear from localStorage as well
    clearStoredEvents();
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
    logTestEvent(createErrorEvent(error, component, severity, action));
  };

  // This effect runs when isPremiumOverride changes
  // Beta mode always has all premium features enabled
  React.useEffect(() => {
    if (APP_CONFIG.BETA_MODE || isPremiumOverride) {
      // When in beta mode or premium override is enabled, enable all premium features
      setPremiumFeatures(allPremiumEnabled);
    } else {
      // When premium override is disabled (and not in beta mode), disable all premium features
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
