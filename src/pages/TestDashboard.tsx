
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Activity, ListFilter, Download, RotateCcw } from "lucide-react";
import { useTestContext, TestEvent } from "@/contexts/TestContext";
import { TestEventList } from "@/components/testing/TestEventList";
import { TestFeedbackForm } from "@/components/testing/TestFeedbackForm";
import { TestSettings } from "@/components/testing/TestSettings";
import { TestAnalytics } from "@/components/testing/TestAnalytics";

export default function TestDashboard() {
  const navigate = useNavigate();
  const { 
    isTestMode, 
    testEvents, 
    clearTestEvents, 
    logTestEvent 
  } = useTestContext();
  
  const [activeTab, setActiveTab] = useState("events");
  
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
        </div>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-gray-800 border-gray-700 mb-6">
          <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1">Feedback</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="mt-0">
          <TestEventList events={testEvents} />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0">
          <TestAnalytics events={testEvents} />
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-0">
          <TestFeedbackForm />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <TestSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
