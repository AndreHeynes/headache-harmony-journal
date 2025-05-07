
import { useState, useEffect } from "react";
import { useTestContext } from "@/contexts/TestContext";
import { ErrorSeverity } from "@/utils/errorReporting";
import ErrorBoundaryWithContext from "@/components/testing/ErrorBoundary";
import { withErrorTracking, useErrorTracking } from "@/utils/withErrorTracking";
import { TestDashboardHeader } from "@/components/testing/dashboard/TestDashboardHeader";
import { DashboardTabs } from "@/components/testing/dashboard/DashboardTabs";
import { SessionInfoPanel } from "@/components/testing/dashboard/SessionInfoPanel";
import { TestModeBanner } from "@/components/testing/dashboard/TestModeBanner";

function TestDashboard() {
  const { 
    isTestMode, 
    testEvents, 
    clearTestEvents, 
    logTestEvent,
    trackError,
    sessionInfo
  } = useTestContext();
  
  const { trackError: logComponentError } = useErrorTracking("TestDashboard");
  
  useEffect(() => {
    // Log dashboard visit
    logTestEvent({
      type: "navigation",
      details: "Test Dashboard visited",
      component: "TestDashboard"
    });
  }, [logTestEvent]);

  const downloadTestData = () => {
    try {
      const dataStr = JSON.stringify(testEvents, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `headache-tracker-test-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      logTestEvent({
        type: "action",
        details: "Test data downloaded",
        component: "TestDashboard"
      });
    } catch (error) {
      // Log error using our error tracking
      trackError(error, "TestDashboard", ErrorSeverity.MEDIUM, "Downloading test data");
    }
  };

  if (!isTestMode) {
    return <TestModeBanner />;
  }

  return (
    <ErrorBoundaryWithContext component="TestDashboard">
      <div className="bg-charcoal text-white p-4 min-h-screen pb-16">
        <TestDashboardHeader 
          downloadTestData={downloadTestData} 
          clearTestEvents={clearTestEvents} 
        />
        
        <DashboardTabs testEvents={testEvents} />
        
        <SessionInfoPanel sessionInfo={sessionInfo} />
      </div>
    </ErrorBoundaryWithContext>
  );
}

// Wrap component with error tracking
export default withErrorTracking(TestDashboard, "TestDashboard");
