
import { Button } from "@/components/ui/button";
import { Crown, Sun, Moon, CloudRain, Coffee } from "lucide-react";

interface PremiumVariablesSectionProps {
  isPremium: boolean;
}

export function PremiumVariablesSection({ isPremium }: PremiumVariablesSectionProps) {
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
          <Button variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/30">
            Upgrade to Premium
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Premium variable inputs would go here */}
        </div>
      )}
    </section>
  );
}
