
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Activity, ListFilter, Download, RotateCcw, FileText, AlertTriangle } from "lucide-react";
import { useTestContext, TestEvent } from "@/contexts/TestContext";
import { TestEventList } from "@/components/testing/TestEventList";
import { TestFeedbackForm } from "@/components/testing/TestFeedbackForm";
import { TestSettings } from "@/components/testing/TestSettings";
import { TestAnalytics } from "@/components/testing/TestAnalytics";
import { HeadacheDataExport } from "@/components/export/HeadacheDataExport";
import { ErrorReports } from "@/components/testing/ErrorReports";
import ErrorBoundaryWithContext from "@/components/testing/ErrorBoundary";
import { withErrorTracking, useErrorTracking } from "@/utils/withErrorTracking";
import { ErrorSeverity } from "@/utils/errorReporting";

function TestDashboard() {
  const navigate = useNavigate();
  const { 
    isTestMode, 
    testEvents, 
    clearTestEvents, 
    logTestEvent,
    trackError,
    sessionInfo
  } = useTestContext();
  
  const [activeTab, setActiveTab] = useState("events");
  const { trackError: logComponentError } = useErrorTracking("TestDashboard");
  
  // Count errors for the badge
  const errorCount = testEvents.filter(e => e.type === "error").length;
  
  useEffect(() => {
    // Log dashboard visit
    logTestEvent({
      type: "navigation",
      details: "Test Dashboard visited",
      component: "TestDashboard"
    });
  }, [logTestEvent]);

  const handleGoBack = () => {
    navigate(-1);
  };

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

  // Simulated error for testing
  const simulateError = () => {
    try {
      throw new Error("This is a simulated error for testing the error reporting system");
    } catch (error) {
      trackError(error, "TestDashboard", ErrorSeverity.MEDIUM, "Manual Test Error");
    }
  };
  
  if (!isTestMode) {
    return (
      <div className="bg-charcoal text-white p-4 min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Test Mode Disabled</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              Please enable test mode in your profile settings to access the test dashboard.
            </p>
            <Button onClick={() => navigate("/profile")}>
              Go to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundaryWithContext component="TestDashboard">
      <div className="bg-charcoal text-white p-4 min-h-screen pb-16">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleGoBack}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Activity className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-semibold">Test Dashboard</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-300 border-gray-700"
              onClick={downloadTestData}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-300 border-gray-700"
              onClick={clearTestEvents}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-300 border-red-700"
                onClick={simulateError}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Test Error
              </Button>
            )}
          </div>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-gray-800 border-gray-700 mb-6">
            <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
            <TabsTrigger value="errors" className="flex-1 relative">
              Errors
              {errorCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {errorCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1">Export</TabsTrigger>
            <TabsTrigger value="feedback" className="flex-1">Feedback</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="mt-0">
            <TestEventList events={testEvents} />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <TestAnalytics events={testEvents} />
          </TabsContent>
          
          <TabsContent value="errors" className="mt-0">
            <ErrorReports events={testEvents} />
          </TabsContent>
          
          <TabsContent value="export" className="mt-0">
            <div className="space-y-6">
              <HeadacheDataExport isPremium={true} />
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Export Test Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    As a pilot tester, your feedback on the export functionality is valuable. 
                    Please try exporting your headache data and share your experience.
                  </p>
                  <div className="flex space-x-3 mt-4">
                    <Button 
                      onClick={() => navigate("/data-export")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Open Full Export Page
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-0">
            <TestFeedbackForm />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <TestSettings />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
          <h3 className="text-sm font-medium text-white mb-2">Session Information</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-gray-900/50 p-2 rounded">
              <span className="text-gray-400">Session ID:</span>
              <div className="text-gray-300 truncate">{sessionInfo.sessionId}</div>
            </div>
            <div className="bg-gray-900/50 p-2 rounded">
              <span className="text-gray-400">Started:</span>
              <div className="text-gray-300">
                {new Date(sessionInfo.startTime).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-900/50 p-2 rounded">
              <span className="text-gray-400">Events:</span>
              <div className="text-gray-300">{sessionInfo.totalEvents}</div>
            </div>
            <div className="bg-gray-900/50 p-2 rounded">
              <span className="text-gray-400">Errors:</span>
              <div className="text-gray-300">{sessionInfo.errorCount}</div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundaryWithContext>
  );
}

// Wrap component with error tracking
export default withErrorTracking(TestDashboard, "TestDashboard");
