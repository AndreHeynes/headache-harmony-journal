
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTestContext, PremiumFeature } from "@/contexts/TestContext";
import { 
  LineChart, Gauge, Clock, FlaskConical, 
  FileSpreadsheet, Brain, Download, Crown 
} from "lucide-react";

export function PremiumFeatureToggles() {
  const { premiumFeatures, togglePremiumFeature, isPremiumOverride } = useTestContext();

  const features = [
    { 
      id: "insights" as PremiumFeature, 
      name: "Detailed Insights",
      description: "Access to detailed headache analytics insights",
      icon: <LineChart className="h-4 w-4 text-purple-400" />
    },
    { 
      id: "variables" as PremiumFeature, 
      name: "Premium Variables",
      description: "Track additional headache variables and factors",
      icon: <Gauge className="h-4 w-4 text-blue-400" />
    },
    { 
      id: "export" as PremiumFeature, 
      name: "Data Export",
      description: "Export headache data in various formats",
      icon: <Download className="h-4 w-4 text-teal-400" />
    },
    { 
      id: "patterns" as PremiumFeature, 
      name: "Pattern Recognition",
      description: "Advanced headache pattern detection",
      icon: <FlaskConical className="h-4 w-4 text-orange-400" />
    },
    { 
      id: "custom_reports" as PremiumFeature, 
      name: "Custom Reports",
      description: "Create and save customized headache reports",
      icon: <FileSpreadsheet className="h-4 w-4 text-pink-400" />
    },
    { 
      id: "neck_correlation" as PremiumFeature, 
      name: "Neck Correlation",
      description: "Analyze correlation between neck pain and headaches",
      icon: <Brain className="h-4 w-4 text-indigo-400" />
    }
  ];

  const handleToggleAll = (enabled: boolean) => {
    features.forEach(feature => {
      togglePremiumFeature(feature.id, enabled);
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <Crown className="h-5 w-5 text-yellow-500 mr-2" />
          Premium Feature Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-900/80 p-4 rounded-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium text-white">Toggle All Features</div>
            <p className="text-xs text-gray-400">Enable or disable all premium features at once</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isPremiumOverride} 
              onCheckedChange={handleToggleAll}
            />
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <div className="space-y-3 pt-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-900 rounded-md p-2">
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <Label htmlFor={feature.id} className="text-white">
                    {feature.name}
                  </Label>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              </div>
              <Switch 
                id={feature.id} 
                checked={premiumFeatures[feature.id]} 
                onCheckedChange={(checked) => togglePremiumFeature(feature.id, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
