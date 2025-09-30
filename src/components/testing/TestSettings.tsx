
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useTestContext } from "@/contexts/TestContext";
import { toast } from "sonner";
import { PremiumFeatureToggles } from "./PremiumFeatureToggles";
import { getStorageStats, clearOldEvents, clearTestEvents as clearStoredEvents } from "@/utils/testEventStorage";
import { Database, Trash2, AlertTriangle } from "lucide-react";

export function TestSettings() {
  const { isTestMode, isPremiumOverride, testEvents, clearTestEvents } = useTestContext();
  const [enabledInProduction, setEnabledInProduction] = useState(false);
  const [testUserId, setTestUserId] = useState("");
  const [testDeviceType, setTestDeviceType] = useState("smartphone");
  
  // Storage stats
  const storageStats = getStorageStats(testEvents);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const storedEnabled = localStorage.getItem('enableTesting') === 'true';
    const storedUserId = localStorage.getItem('testUserId') || '';
    const storedDeviceType = localStorage.getItem('testDeviceType') || 'smartphone';
    
    setEnabledInProduction(storedEnabled);
    setTestUserId(storedUserId);
    setTestDeviceType(storedDeviceType);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('enableTesting', enabledInProduction.toString());
    localStorage.setItem('testUserId', testUserId);
    localStorage.setItem('testDeviceType', testDeviceType);
    
    toast.success("Testing settings saved", { 
      description: "Your test configuration has been updated"
    });
  };

  const clearTestingData = () => {
    if (!confirm('Are you sure you want to reset ALL test data? This cannot be undone.')) {
      return;
    }
    
    // Clear test events
    clearTestEvents();
    clearStoredEvents();
    
    // Clear all localStorage items related to testing
    localStorage.removeItem('testMode');
    localStorage.removeItem('premiumOverride');
    localStorage.removeItem('premiumFeatures');
    localStorage.removeItem('testUserId');
    localStorage.removeItem('testDeviceType');
    
    toast.success("All test data cleared");
    
    // Reload the page to reset the application state
    setTimeout(() => window.location.reload(), 1000);
  };

  const clearOldTestEvents = () => {
    if (!confirm('Clear all test events older than 30 days?')) {
      return;
    }
    
    const updatedEvents = clearOldEvents(testEvents, 30);
    const removedCount = testEvents.length - updatedEvents.length;
    
    if (removedCount > 0) {
      clearTestEvents();
      toast.success(`Removed ${removedCount} old events`, {
        description: `${updatedEvents.length} events remaining`
      });
    } else {
      toast.info("No old events to remove");
    }
  };

  const clearAllEvents = () => {
    if (!confirm('Clear ALL test events and feedback? This cannot be undone.')) {
      return;
    }
    
    clearTestEvents();
    clearStoredEvents();
    
    toast.success("All test events cleared");
  };

  return (
    <div className="space-y-6">
      {/* Premium Feature Controls */}
      <PremiumFeatureToggles />

      {/* Data Management */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">Data Management</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Manage stored test events and feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Storage Statistics */}
          <div className="bg-gray-900 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-white mb-3">Storage Statistics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Total Events</p>
                <p className="text-lg font-semibold text-white">{storageStats.totalEvents}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Storage Size</p>
                <p className="text-lg font-semibold text-white">{storageStats.storageSize}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Feedback Count</p>
                <p className="text-lg font-semibold text-purple-400">{storageStats.feedbackCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Error Count</p>
                <p className="text-lg font-semibold text-red-400">{storageStats.errorCount}</p>
              </div>
            </div>

            {storageStats.oldestEvent && (
              <div className="pt-2 border-t border-gray-800">
                <p className="text-xs text-gray-400">Oldest Event</p>
                <p className="text-sm text-gray-300">
                  {storageStats.oldestEvent.toLocaleDateString()} at {storageStats.oldestEvent.toLocaleTimeString()}
                </p>
              </div>
            )}

            {storageStats.newestEvent && (
              <div>
                <p className="text-xs text-gray-400">Newest Event</p>
                <p className="text-sm text-gray-300">
                  {storageStats.newestEvent.toLocaleDateString()} at {storageStats.newestEvent.toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* Storage Warning */}
          {storageStats.totalEvents > 800 && (
            <div className="flex items-start gap-2 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400">Storage Nearly Full</p>
                <p className="text-xs text-gray-400 mt-1">
                  You have {storageStats.totalEvents} events. Maximum is 1000. Consider clearing old events.
                </p>
              </div>
            </div>
          )}

          <Separator className="bg-gray-700" />

          {/* Data Retention Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Retention Controls</h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={clearOldTestEvents}
                className="w-full justify-start border-gray-600 hover:bg-gray-700 text-gray-300"
                disabled={storageStats.totalEvents === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Events Older Than 30 Days
              </Button>

              <Button 
                variant="outline" 
                onClick={clearAllEvents}
                className="w-full justify-start border-orange-600 hover:bg-orange-900/20 text-orange-400"
                disabled={storageStats.totalEvents === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Test Events
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Events are automatically deleted after 30 days. Maximum 1000 events are stored.
            </p>
          </div>
        </CardContent>
      </Card>
    
      {/* General Test Settings */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Test Mode Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Configure test settings and environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Enable in production</Label>
                <p className="text-xs text-gray-400">
                  Allow test features to be visible in production builds
                </p>
              </div>
              <Switch 
                checked={enabledInProduction}
                onCheckedChange={setEnabledInProduction}
              />
            </div>
            
            <Separator className="bg-gray-700" />

            <div className="space-y-3">
              <Label htmlFor="testUserId" className="text-white">Test User ID</Label>
              <Input
                id="testUserId"
                placeholder="Enter test user identifier"
                className="bg-gray-900 border-gray-700 text-white"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
              />
              <p className="text-xs text-gray-400">
                Identifier used to mark test data in analytics
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="deviceType" className="text-white">Test Device Type</Label>
              <Select value={testDeviceType} onValueChange={setTestDeviceType}>
                <SelectTrigger id="deviceType" className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="smartphone">Smartphone</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="text-md font-medium text-white mb-2">Status</h3>
            <div className="bg-gray-900 p-3 rounded-md text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Test Mode:</span>
                <span className={isTestMode ? "text-green-400" : "text-red-400"}>
                  {isTestMode ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Premium Features:</span>
                <span className={isPremiumOverride ? "text-green-400" : "text-red-400"}>
                  {isPremiumOverride ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Environment:</span>
                <span className="text-yellow-400">
                  {process.env.NODE_ENV === 'development' ? "Development" : "Production"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="destructive" 
            onClick={clearTestingData}
            className="bg-red-600 hover:bg-red-700"
          >
            Reset All Test Data
          </Button>
          <Button onClick={saveSettings} className="bg-purple-600 hover:bg-purple-700">
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
