import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BeakerIcon, Crown } from "lucide-react";

interface TestModeToggleProps {
  isTestMode: boolean;
  onToggleTestMode: (enabled: boolean) => void;
}

export function TestModeToggle({ isTestMode, onToggleTestMode }: TestModeToggleProps) {
  // Initialize from localStorage on component mount
  useEffect(() => {
    const storedTestMode = localStorage.getItem('testMode') === 'true';
    if (storedTestMode !== isTestMode) {
      onToggleTestMode(storedTestMode);
    }
  }, []);

  const handleToggleChange = (checked: boolean) => {
    // Store in localStorage for persistence
    localStorage.setItem('testMode', checked.toString());
    onToggleTestMode(checked);
    
    if (checked) {
      toast.success("Test mode enabled", {
        description: "All premium features are now accessible for testing purposes"
      });
    } else {
      toast.info("Test mode disabled", {
        description: "Premium features access has been reset"
      });
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <BeakerIcon className="h-5 w-5 text-purple-400" />
          <h3 className="font-medium text-white">Test Mode</h3>
        </div>
        {isTestMode && (
          <div className="bg-purple-500/20 px-2 py-0.5 rounded text-xs text-purple-300 flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            Testing
          </div>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Enable test mode to access all premium features for testing purposes. This is only for development and quality assurance.
      </p>
      <div className="flex items-center space-x-2">
        <Switch 
          id="test-mode" 
          checked={isTestMode}
          onCheckedChange={handleToggleChange}
        />
        <Label htmlFor="test-mode" className="text-gray-300">
          {isTestMode ? "Test mode active" : "Enable test mode"}
        </Label>
      </div>
    </Card>
  );
}
