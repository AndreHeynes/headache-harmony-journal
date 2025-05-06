
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTestContext } from "@/contexts/TestContext";
import { toast } from "sonner";
import { PremiumFeatureToggles } from "./PremiumFeatureToggles";

export function TestSettings() {
  const { isTestMode, isPremiumOverride } = useTestContext();
  const [enabledInProduction, setEnabledInProduction] = useState(false);
  const [testUserId, setTestUserId] = useState("");
  const [testDeviceType, setTestDeviceType] = useState("smartphone");
  
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
    // Clear all localStorage items related to testing
    localStorage.removeItem('testMode');
    localStorage.removeItem('premiumOverride');
    localStorage.removeItem('premiumFeatures');
    localStorage.removeItem('testUserId');
    localStorage.removeItem('testDeviceType');
    
    // Reload the page to reset the application state
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Premium Feature Controls */}
      <PremiumFeatureToggles />
    
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
