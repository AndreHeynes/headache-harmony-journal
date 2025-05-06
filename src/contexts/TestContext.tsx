
import React, { createContext, useContext, useState, ReactNode } from "react";

// Test Event Types
export type TestEventType = "error" | "warning" | "action" | "feature_usage" | "navigation";

export interface TestEvent {
  timestamp: number;
  type: TestEventType;
  details: string;
  component?: string;
  metadata?: any;
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
  updatePremiumFeature: () => {}
});

// Provider component
export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [isTestMode, setIsTestMode] = useState(false);
  const [isPremiumOverride, setIsPremiumOverride] = useState(false);
  const [testEvents, setTestEvents] = useState<TestEvent[]>([]);
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeatures>(defaultPremiumFeatures);

  const logTestEvent = (event: Omit<TestEvent, "timestamp">) => {
    const newEvent: TestEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    setTestEvents(prev => [newEvent, ...prev]);
    console.log("Test event logged:", newEvent);
  };

  const clearTestEvents = () => {
    setTestEvents([]);
  };

  const updatePremiumFeature = (feature: keyof PremiumFeatures, value: boolean) => {
    setPremiumFeatures(prev => ({
      ...prev,
      [feature]: value
    }));
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
      updatePremiumFeature
    }}>
      {children}
    </TestContext.Provider>
  );
};

// Custom hook to use the test context
export const useTestContext = () => useContext(TestContext);
