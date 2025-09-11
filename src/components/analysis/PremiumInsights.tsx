
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { InsightCard } from "./InsightCard";
import { 
  Brain, Gauge, Clock, Stethoscope, Zap, Pill, Sliders, Skull, Crown, CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTestContext } from "@/contexts/TestContext";
import { DisclaimerGate, InlineDisclaimer } from "@/components/disclaimer";

interface PremiumInsightsProps {
  onCardClick: (cardType: string) => void;
}

export function PremiumInsights({ onCardClick }: PremiumInsightsProps) {
  const { premiumFeatures } = useTestContext();
  
  const isPremium = premiumFeatures.insights;
  
  const handleUpgradeClick = () => {
    toast.info("Secure payment processing", {
      description: "You'll be redirected to our secure payment processor"
    });
    // In a real app, this would redirect to a payment page
  };

  const insights = [
    { 
      type: 'pain-area', 
      title: 'Pain Area', 
      icon: <Brain className="h-7 w-7" />, 
      color: 'text-indigo-400',
      description: 'Analyze pain location patterns'
    },
    { 
      type: 'intensity', 
      title: 'Intensity', 
      icon: <Gauge className="h-7 w-7" />, 
      color: 'text-purple-400',
      description: 'Track severity trends over time'
    },
    { 
      type: 'duration', 
      title: 'Duration', 
      icon: <Clock className="h-7 w-7" />, 
      color: 'text-blue-400',
      description: 'Monitor episode length patterns'
    },
    { 
      type: 'symptoms', 
      title: 'Symptoms', 
      icon: <Stethoscope className="h-7 w-7" />, 
      color: 'text-red-400',
      description: 'Identify common symptom clusters'
    },
    { 
      type: 'triggers', 
      title: 'Triggers', 
      icon: <Zap className="h-7 w-7" />, 
      color: 'text-yellow-400',
      description: 'Discover headache trigger patterns'
    },
    { 
      type: 'treatment', 
      title: 'Treatment', 
      icon: <Pill className="h-7 w-7" />, 
      color: 'text-teal-400',
      description: 'Compare treatment effectiveness'
    },
    { 
      type: 'custom', 
      title: 'Custom', 
      icon: <Sliders className="h-7 w-7" />, 
      color: 'text-pink-400',
      description: 'Analyze your custom variables'
    },
    { 
      type: 'neck-pain', 
      title: 'Neck Pain', 
      icon: <Skull className="h-7 w-7" />, 
      color: 'text-orange-400',
      description: 'Track neck pain correlations',
      premium: premiumFeatures.neck_correlation
    }
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Detailed Insights
          {!isPremium && (
            <Badge variant="outline" className="ml-2 bg-yellow-500/20 text-yellow-500 border-0">
              <Crown className="h-3 w-3 mr-1" /> Premium
            </Badge>
          )}
        </h2>
      </div>
      
      {isPremium ? (
        <DisclaimerGate disclaimerId="ai-premium-report">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 pb-1">
              {insights.map((insight) => {
                // Check if this specific insight is premium and enabled
                const isEnabled = insight.premium !== undefined 
                  ? insight.premium 
                  : isPremium;
                  
                return (
                  <div
                    key={insight.type}
                    onClick={() => isEnabled && onCardClick(insight.type)}
                    className={`${isEnabled ? 'cursor-pointer hover:opacity-80' : 'opacity-70'} transition-opacity`}
                  >
                    <InsightCard
                      title={insight.title}
                      icon={insight.icon}
                      iconColor={insight.color}
                    >
                      <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                      {!isEnabled && (
                        <div className="absolute top-2 right-2">
                          <Crown className="h-3 w-3 text-yellow-500" />
                        </div>
                      )}
                    </InsightCard>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="mt-3">
            <InlineDisclaimer 
              disclaimerId="ai-premium-report"
              variant="info"
              size="sm"
              condensed={true}
              showTitle={false}
            />
          </div>
        </DisclaimerGate>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-1">
            {insights.map((insight) => {
              // Check if this specific insight is premium and enabled
              const isEnabled = insight.premium !== undefined 
                ? insight.premium 
                : isPremium;
                
              return (
                <div
                  key={insight.type}
                  onClick={() => isEnabled && onCardClick(insight.type)}
                  className={`${isEnabled ? 'cursor-pointer hover:opacity-80' : 'opacity-70'} transition-opacity`}
                >
                  <InsightCard
                    title={insight.title}
                    icon={insight.icon}
                    iconColor={insight.color}
                  >
                    <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                    {!isEnabled && (
                      <div className="absolute top-2 right-2">
                        <Crown className="h-3 w-3 text-yellow-500" />
                      </div>
                    )}
                  </InsightCard>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      
      {!isPremium && (
        <div className="mt-3 bg-gray-800/80 border border-gray-700 rounded-lg p-3">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex flex-col sm:items-start">
              <div className="flex items-center mb-1">
                <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-sm text-gray-300">
                  Unlock detailed insights with Premium
                </p>
              </div>
              <p className="text-xs text-gray-400 ml-7 sm:ml-7">$4.99/month or $49.99/year • Secure payment • Cancel anytime</p>
            </div>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium mt-3 sm:mt-0"
              onClick={handleUpgradeClick}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
