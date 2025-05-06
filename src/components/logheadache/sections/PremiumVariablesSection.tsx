
import { Button } from "@/components/ui/button";
import { Crown, Sun, Moon, CloudRain, Coffee, CreditCard, Shield } from "lucide-react";
import { toast } from "sonner";
import { useTestContext } from "@/contexts/TestContext";

export function PremiumVariablesSection() {
  const { premiumFeatures } = useTestContext();
  
  // Check if premium variables are enabled
  const isPremium = premiumFeatures.variables;

  const handleUpgradeClick = () => {
    toast.info("Secure payment processing", {
      description: "You'll be redirected to our secure payment processor"
    });
    // In a real app, this would redirect to a payment page through a secure third-party processor
  };

  return (
    <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Additional Variables</h2>
        <Crown className="h-5 w-5 text-yellow-500" />
      </div>
      
      {!isPremium ? (
        <div className="text-center py-6">
          <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Unlock premium variables to track:</p>
          <ul className="text-sm text-gray-400 space-y-2 mb-6">
            <li className="flex items-center justify-center gap-2">
              <Moon className="h-4 w-4" /> Sleep Patterns
            </li>
            <li className="flex items-center justify-center gap-2">
              <Sun className="h-4 w-4" /> Environmental Conditions
            </li>
            <li className="flex items-center justify-center gap-2">
              <CloudRain className="h-4 w-4" /> Weather Changes
            </li>
            <li className="flex items-center justify-center gap-2">
              <Coffee className="h-4 w-4" /> Caffeine Intake
            </li>
          </ul>
          <Button 
            variant="outline" 
            className="bg-yellow-500/20 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/30"
            onClick={handleUpgradeClick}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>$4.99/month or $49.99/year</p>
            <div className="mt-1 flex justify-center items-center">
              <Shield className="h-3 w-3 mr-1 text-teal-500" />
              <p>Secure third-party payment processing • Cancel anytime</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Premium variable inputs would go here */}
          <p className="text-gray-400 text-sm">You have access to all premium variables. Track additional factors that may influence your headaches.</p>
          
          {/* Example premium variable inputs */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start border-gray-700 hover:bg-gray-700/50">
              <Moon className="h-4 w-4 mr-2 text-blue-400" /> Sleep Quality
            </Button>
            <Button variant="outline" className="justify-start border-gray-700 hover:bg-gray-700/50">
              <Sun className="h-4 w-4 mr-2 text-yellow-400" /> Weather
            </Button>
            <Button variant="outline" className="justify-start border-gray-700 hover:bg-gray-700/50">
              <CloudRain className="h-4 w-4 mr-2 text-cyan-400" /> Humidity
            </Button>
            <Button variant="outline" className="justify-start border-gray-700 hover:bg-gray-700/50">
              <Coffee className="h-4 w-4 mr-2 text-amber-400" /> Caffeine
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
