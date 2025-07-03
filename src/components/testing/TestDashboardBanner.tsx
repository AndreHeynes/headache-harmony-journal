
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTestContext } from "@/contexts/TestContext";
import { Activity, X, Beaker } from "lucide-react";

export function TestDashboardBanner() {
  const { isTestMode } = useTestContext();
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('testDashboardBannerDismissed') === 'true';
    setIsDismissed(dismissed);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('testDashboardBannerDismissed', 'true');
  };

  const handleOpenDashboard = () => {
    navigate('/test-dashboard');
  };

  if (!isTestMode || isDismissed) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30 mb-4">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Beaker className="h-5 w-5 text-purple-400" />
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Test Dashboard Available</h3>
            <p className="text-gray-300 text-sm">
              Monitor performance, generate test data, and track testing events
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleOpenDashboard}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            Open Dashboard
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
