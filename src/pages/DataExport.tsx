
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeadacheDataExport } from "@/components/export/HeadacheDataExport";
import { useTestContext } from "@/contexts/TestContext";
import BottomNavWithTest from "@/components/layout/BottomNavWithTest";

export default function DataExport() {
  const navigate = useNavigate();
  const { isTestMode, isPremiumOverride, logTestEvent } = useTestContext();
  
  React.useEffect(() => {
    // Log page visit for testing analytics
    if (isTestMode) {
      logTestEvent({
        type: "navigation",
        details: "Data Export page visited",
        component: "DataExportPage"
      });
    }
  }, [isTestMode, logTestEvent]);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-charcoal text-white p-4 min-h-screen pb-20">
      <div className="flex items-center space-x-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Export Headache Data</h1>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-300">
          Generate a report of your headache data to share with your healthcare provider. 
          This helps them better understand your headache patterns and make more informed treatment decisions.
        </p>
        
        <HeadacheDataExport isPremium={isPremiumOverride} />
        
        <div className="bg-gray-800/50 border-gray-700 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-2">Sharing Tips</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
            <li>Export your data before medical appointments</li>
            <li>Include at least 2-4 weeks of entries for meaningful patterns</li>
            <li>Highlight any significant triggers or treatments you've identified</li>
            <li>Consider sharing both summary and detailed reports for complete context</li>
          </ul>
        </div>
      </div>
      
      <BottomNavWithTest />
    </div>
  );
}
