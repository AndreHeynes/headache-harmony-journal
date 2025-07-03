
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestEvent } from "@/contexts/TestContext";
import { TestEventList } from "@/components/testing/TestEventList";
import { TestFeedbackForm } from "@/components/testing/TestFeedbackForm";
import { TestSettings } from "@/components/testing/TestSettings";
import { TestAnalytics } from "@/components/testing/TestAnalytics";
import { HeadacheDataExport } from "@/components/export/HeadacheDataExport";
import { ErrorReports } from "@/components/testing/ErrorReports";
import { TestDataSeeding } from "@/components/testing/TestDataSeeding";
import { PerformanceMonitoring } from "@/components/testing/PerformanceMonitoring";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardTabsProps {
  testEvents: TestEvent[];
}

export function DashboardTabs({ testEvents }: DashboardTabsProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  
  // Count errors for the badge
  const errorCount = testEvents.filter(e => e.type === "error").length;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full bg-gray-800 border-gray-700 mb-6 grid grid-cols-8">
        <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
        <TabsTrigger value="seeding" className="text-xs">Test Data</TabsTrigger>
        <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
        <TabsTrigger value="errors" className="text-xs relative">
          Errors
          {errorCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {errorCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
        <TabsTrigger value="feedback" className="text-xs">Feedback</TabsTrigger>
        <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="events" className="mt-0">
        <TestEventList events={testEvents} />
      </TabsContent>
      
      <TabsContent value="seeding" className="mt-0">
        <TestDataSeeding />
      </TabsContent>
      
      <TabsContent value="performance" className="mt-0">
        <PerformanceMonitoring />
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
  );
}
