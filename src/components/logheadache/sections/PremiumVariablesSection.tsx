
import { Button } from "@/components/ui/button";
import { Crown, Sun, Moon, CloudRain, Coffee, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PremiumVariablesSectionProps {
  isPremium: boolean;
}

export function PremiumVariablesSection({ isPremium }: PremiumVariablesSectionProps) {
  const handleUpgradeClick = () => {
    toast.info("Secure payment processing", {
      description: "You'll be redirected to our secure payment processor"
    });
    // In a real app, this would redirect to a payment page
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
            <p className="mt-1">Secure payment processing • Cancel anytime</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Premium variable inputs would go here */}
        </div>
      )}
    </section>
  );
}
