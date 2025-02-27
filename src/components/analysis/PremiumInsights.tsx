
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { InsightCard } from "./InsightCard";
import { 
  Brain, Gauge, Clock, Stethoscope, Zap, Pill, Sliders, Skull 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PremiumInsightsProps {
  isPremium: boolean;
  onCardClick: (cardType: string) => void;
}

export function PremiumInsights({ isPremium, onCardClick }: PremiumInsightsProps) {
  const insights = [
    { 
      type: 'pain-area', 
      title: 'Pain Area', 
      icon: <Brain className="h-7 w-7" />, 
      color: 'text-indigo-400' 
    },
    { 
      type: 'intensity', 
      title: 'Intensity', 
      icon: <Gauge className="h-7 w-7" />, 
      color: 'text-purple-400' 
    },
    { 
      type: 'duration', 
      title: 'Duration', 
      icon: <Clock className="h-7 w-7" />, 
      color: 'text-blue-400' 
    },
    { 
      type: 'symptoms', 
      title: 'Symptoms', 
      icon: <Stethoscope className="h-7 w-7" />, 
      color: 'text-red-400' 
    },
    { 
      type: 'triggers', 
      title: 'Triggers', 
      icon: <Zap className="h-7 w-7" />, 
      color: 'text-yellow-400' 
    },
    { 
      type: 'treatment', 
      title: 'Treatment', 
      icon: <Pill className="h-7 w-7" />, 
      color: 'text-teal-400'
    },
    { 
      type: 'custom', 
      title: 'Custom', 
      icon: <Sliders className="h-7 w-7" />, 
      color: 'text-pink-400' 
    },
    { 
      type: 'neck-pain', 
      title: 'Neck Pain', 
      icon: <Skull className="h-7 w-7" />, 
      color: 'text-orange-400' 
    }
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Monthly Insights</h2>
        <Badge variant="outline" className="bg-indigo-500/20 text-indigo-400 border-0">
          Premium
        </Badge>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-3 pb-1">
          {insights.map((insight) => (
            <div
              key={insight.type}
              onClick={() => isPremium && onCardClick(insight.type)}
              className={`${isPremium ? 'cursor-pointer hover:opacity-80' : 'opacity-50'} transition-opacity`}
            >
              <InsightCard
                title={insight.title}
                icon={insight.icon}
                iconColor={insight.color}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {!isPremium && (
        <div className="mt-3 bg-gray-800/80 border border-gray-700 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-300">
            Unlock detailed insights with Premium
          </p>
        </div>
      )}
    </section>
  );
}
