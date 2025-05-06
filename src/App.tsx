
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
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

// Initialize React Query with enhanced error logging
const queryClient = new QueryClient({
  // Adding security-focused default options
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      meta: {
        onError: (error: unknown) => {
          // Global error handler for query errors
          console.error("Query error:", error);
          // The TestContext will pick this up in the global error handler
        }
      }
    },
    mutations: {
      retry: 1,
      meta: {
        onError: (error: unknown) => {
          console.error("Mutation error:", error);
          // The TestContext will pick this up in the global error handler
        }
      }
    },
  },
});

const App = () => {
  // Check if the privacy policy has been updated and show a notification if needed
  const [showPolicyUpdate, setShowPolicyUpdate] = useState(false);

  useEffect(() => {
    // Check if the privacy policy version viewed is the latest
    const lastPolicyVersion = localStorage.getItem('last-policy-version');
    const currentPolicyVersion = "2023-06-01"; // This should be updated whenever the policy changes
    
    if (lastPolicyVersion !== currentPolicyVersion) {
      setShowPolicyUpdate(true);
    }
  }, []);

  const handlePolicyUpdateAcknowledge = () => {
    setShowPolicyUpdate(false);
    localStorage.setItem('last-policy-version', "2023-06-01");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TestProvider>
        <SecurityHeaders />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <TestGuideModal />
          <CookieConsentBanner />
          {showPolicyUpdate && (
            <div className="fixed top-0 left-0 right-0 bg-indigo-900/90 text-white p-3 z-50 backdrop-blur-sm">
              <div className="container mx-auto flex items-center justify-between">
                <p className="text-sm">Our Privacy Policy has been updated. Please review the <a href="/policy" className="underline">updated policy</a>.</p>
                <button 
                  onClick={handlePolicyUpdateAcknowledge} 
                  className="bg-white text-indigo-900 text-xs px-3 py-1 rounded hover:bg-gray-100"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          )}
          <ErrorBoundaryWithContext component="RootApp" fallback={
            <div className="min-h-screen bg-charcoal text-white p-6 flex flex-col items-center justify-center">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md w-full">
                <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
                <p className="mb-6">The application encountered an error and could not continue. Please try refreshing the page.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-white text-red-900 py-2 rounded hover:bg-gray-100"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          }>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/log" element={<LogHeadache />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/support" element={<SupportServices />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/test-dashboard" element={<TestDashboard />} />
                <Route path="/pilot-testing-prep" element={<PilotTestingPrep />} />
                <Route path="/data-export" element={<DataExport />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundaryWithContext>
        </TooltipProvider>
      </TestProvider>
    </QueryClientProvider>
  );
};

export default App;
