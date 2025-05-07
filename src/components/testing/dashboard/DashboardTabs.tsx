
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestEvent } from "@/contexts/TestContext";
import { TestEventList } from "@/components/testing/TestEventList";
import { TestFeedbackForm } from "@/components/testing/TestFeedbackForm";
import { TestSettings } from "@/components/testing/TestSettings";
import { TestAnalytics } from "@/components/testing/TestAnalytics";
import { HeadacheDataExport } from "@/components/export/HeadacheDataExport";
import { ErrorReports } from "@/components/testing/ErrorReports";
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
  );
}
