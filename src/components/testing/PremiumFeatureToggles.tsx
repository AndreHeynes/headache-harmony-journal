
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTestContext } from "@/contexts/TestContext";
import { Card } from "@/components/ui/card";

export function PremiumFeatureToggles() {
  const { premiumFeatures, updatePremiumFeature, isPremiumOverride } = useTestContext();

  const handleToggle = (feature: keyof typeof premiumFeatures) => {
    updatePremiumFeature(feature, !premiumFeatures[feature]);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Premium Feature Toggles</h3>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-md bg-gray-700/30 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-insights" className="text-gray-300">Insights</Label>
              <Switch
                id="toggle-insights"
                checked={premiumFeatures.insights}
                onCheckedChange={() => handleToggle('insights')}
                disabled={!isPremiumOverride}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-variables" className="text-gray-300">Custom Variables</Label>
              <Switch
                id="toggle-variables"
                checked={premiumFeatures.variables}
                onCheckedChange={() => handleToggle('variables')}
                disabled={!isPremiumOverride}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-neck" className="text-gray-300">Neck Pain Correlation</Label>
              <Switch
                id="toggle-neck"
                checked={premiumFeatures.neck_correlation}
                onCheckedChange={() => handleToggle('neck_correlation')}
                disabled={!isPremiumOverride}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-export" className="text-gray-300">Data Export</Label>
              <Switch
                id="toggle-export"
                checked={premiumFeatures.export}
                onCheckedChange={() => handleToggle('export')}
                disabled={!isPremiumOverride}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-menstrual" className="text-gray-300">Menstrual Cycle Tracking</Label>
              <Switch
                id="toggle-menstrual"
                checked={premiumFeatures.menstrual_tracking}
                onCheckedChange={() => handleToggle('menstrual_tracking')}
                disabled={!isPremiumOverride}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-weather" className="text-gray-300">Weather Tracking</Label>
              <Switch
                id="toggle-weather"
                checked={premiumFeatures.weather_tracking}
                onCheckedChange={() => handleToggle('weather_tracking')}
                disabled={!isPremiumOverride}
              />
            </div>
          </div>
        </div>
        
        {!isPremiumOverride && (
          <div className="text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded-md">
            Enable Test Mode and Premium Override in Profile to modify these settings.
          </div>
        )}
      </div>
    </Card>
  );
}
