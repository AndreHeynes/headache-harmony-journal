
import { Button } from "@/components/ui/button";
import { Activity, ChevronLeft, Download, RotateCcw, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTestContext } from "@/contexts/TestContext";
import { ErrorSeverity } from "@/utils/errorReporting";

interface TestDashboardHeaderProps {
  downloadTestData: () => void;
  clearTestEvents: () => void;
}

export function TestDashboardHeader({ downloadTestData, clearTestEvents }: TestDashboardHeaderProps) {
  const navigate = useNavigate();
  const { trackError } = useTestContext();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Simulated error for testing - only available in development
  const simulateError = () => {
    try {
      throw new Error("This is a simulated error for testing the error reporting system");
    } catch (error) {
      trackError(error, "TestDashboard", ErrorSeverity.MEDIUM, "Manual Test Error");
    }
  };

  return (
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
  );
}
