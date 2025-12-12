import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import LogHeadache from "./pages/LogHeadache";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Analysis from "./pages/Analysis";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SupportServices from "./pages/SupportServices";
import Policy from "./pages/Policy";
import { TestProvider } from "./contexts/TestContext";
import TestDashboard from "./pages/TestDashboard";
import PilotTestingPrep from "./pages/PilotTestingPrep";
import { TestGuideModal } from "./components/testing/TestGuideModal";
import { CookieConsentBanner } from "./components/privacy/CookieConsentBanner";
import { SecurityHeaders } from "./components/security/SecurityHeaders";
import DataExport from "./pages/DataExport";
import ErrorBoundaryWithContext from "./components/testing/ErrorBoundary";
import LogPainLocationPage from "./pages/LogPainLocation";
import { DisclaimerProvider } from "./components/disclaimer";
import { BetaAccessGate } from "./components/BetaAccessGate";
import { SharedHeader } from "./components/SharedHeader";
import { BetaFeedbackForm } from "./components/BetaFeedbackForm";
import { BetaModeRedirect } from "./components/auth/BetaModeRedirect";

// Initialize React Query with enhanced error logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      meta: {
        onError: (error: unknown) => {
          console.error("Query error:", error);
        }
      }
    },
    mutations: {
      retry: 1,
      meta: {
        onError: (error: unknown) => {
          console.error("Mutation error:", error);
        }
      }
    },
  },
});

const App = () => {
  const [showPolicyUpdate, setShowPolicyUpdate] = useState(false);

  useEffect(() => {
    const lastPolicyVersion = localStorage.getItem('last-policy-version');
    const currentPolicyVersion = "2023-06-01";
    
    if (lastPolicyVersion !== currentPolicyVersion) {
      setShowPolicyUpdate(true);
    }
  }, []);

  const handlePolicyUpdateAcknowledge = () => {
    setShowPolicyUpdate(false);
    localStorage.setItem('last-policy-version', "2023-06-01");
  };

  return (
    <BetaAccessGate>
      <QueryClientProvider client={queryClient}>
        <TestProvider>
          <DisclaimerProvider>
            <div className="min-h-screen flex flex-col">
              <SharedHeader />
              <div className="fixed bottom-4 right-4 z-50">
                <BetaFeedbackForm />
              </div>
              <SecurityHeaders />
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <TestGuideModal />
                <CookieConsentBanner />
                {showPolicyUpdate && (
                  <div className="fixed top-16 left-0 right-0 bg-primary/90 text-primary-foreground p-3 z-40 backdrop-blur-sm">
                    <div className="container mx-auto flex items-center justify-between">
                      <p className="text-sm">Our Privacy Policy has been updated. Please review the <a href="/policy" className="underline">updated policy</a>.</p>
                      <button 
                        onClick={handlePolicyUpdateAcknowledge} 
                        className="bg-background text-foreground text-xs px-3 py-1 rounded hover:bg-muted"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                )}
                <ErrorBoundaryWithContext component="RootApp" fallback={
                  <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center justify-center">
                    <div className="bg-destructive/20 border border-destructive rounded-lg p-6 max-w-md w-full">
                      <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
                      <p className="mb-6">The application encountered an error and could not continue. Please try refreshing the page.</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                }>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/signin" element={<BetaModeRedirect><SignIn /></BetaModeRedirect>} />
                      <Route path="/signup" element={<BetaModeRedirect><SignUp /></BetaModeRedirect>} />
                      <Route path="/support" element={<SupportServices />} />
                      <Route path="/policy" element={<Policy />} />
                      
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/log" element={<ProtectedRoute><LogHeadache /></ProtectedRoute>} />
                      <Route path="/pain-location" element={<ProtectedRoute><LogPainLocationPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
                      <Route path="/test-dashboard" element={<ProtectedRoute><TestDashboard /></ProtectedRoute>} />
                      <Route path="/pilot-testing-prep" element={<ProtectedRoute><PilotTestingPrep /></ProtectedRoute>} />
                      <Route path="/data-export" element={<ProtectedRoute><DataExport /></ProtectedRoute>} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </ErrorBoundaryWithContext>
              </TooltipProvider>
            </div>
          </DisclaimerProvider>
        </TestProvider>
      </QueryClientProvider>
    </BetaAccessGate>
  );
};

export default App;