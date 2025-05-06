
// Test Event Types
export type TestEventType = "error" | "warning" | "action" | "feature_usage" | "navigation" | "feedback";

// Test Event interface
export interface TestEvent {
  timestamp: number;
  type: TestEventType;
  details: string;
  component?: string;
  metadata?: any;
  severity?: string;
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
export interface TestContextType {
  isTestMode: boolean;
  setIsTestMode: (mode: boolean) => void;
  isPremiumOverride: boolean;
  setIsPremiumOverride: (isPremium: boolean) => void;
  testEvents: TestEvent[];
  logTestEvent: (event: Omit<TestEvent, "timestamp">) => void;
  clearTestEvents: () => void;
  premiumFeatures: PremiumFeatures;
  updatePremiumFeature: (feature: keyof PremiumFeatures, value: boolean) => void;
  trackError: (error: unknown, component?: string, severity?: string, action?: string) => void;
  sessionInfo: SessionInfo;
  showTestGuide: boolean;
  setShowTestGuide: (show: boolean) => void;
}

// Default values for premium features
export const defaultPremiumFeatures: PremiumFeatures = {
  insights: false,
  variables: false,
  neck_correlation: false,
  export: false,
  menstrual_tracking: false,
  weather_tracking: false
};
