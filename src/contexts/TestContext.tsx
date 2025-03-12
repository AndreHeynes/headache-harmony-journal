
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

export interface TestEvent {
  type: "navigation" | "feature_usage" | "error" | "feedback" | "action";
  details: string;
  component?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [isPremiumOverride, setIsPremiumOverride] = useState<boolean>(false);
  const [testEvents, setTestEvents] = useState<TestEvent[]>([]);
  const [showTestGuide, setShowTestGuide] = useState<boolean>(false);

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
      setShowTestGuide
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
