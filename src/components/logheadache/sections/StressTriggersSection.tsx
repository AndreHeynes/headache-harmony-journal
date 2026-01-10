import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface StressTriggersSectionProps {
  onStressChange?: (stressTriggers: string[]) => void;
  initialStress?: string[];
}

export function StressTriggersSection({ onStressChange, initialStress = [] }: StressTriggersSectionProps) {
  const stressTypes = ["Physical", "Emotional", "Psychological", "Family", "Financial", "Social"];
  
  // Parse initial stress triggers to get selected types
  const parseInitialStress = () => {
    return stressTypes.filter(type => 
      initialStress.some(s => s.includes(`Stress: ${type}`))
    );
  };
  
  const [selectedStress, setSelectedStress] = useState<string[]>(parseInitialStress);

  // Update selected stress when initial data changes
  useEffect(() => {
    setSelectedStress(parseInitialStress());
  }, [initialStress]);

  const handleStressToggle = (stressType: string, checked: boolean) => {
    const updated = checked
      ? [...selectedStress, stressType]
      : selectedStress.filter(s => s !== stressType);
    
    setSelectedStress(updated);
    
    // Notify parent with formatted stress triggers
    if (onStressChange) {
      const stressTriggers = updated.map(s => `Stress: ${s}`);
      onStressChange(stressTriggers);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-medium text-white">Stress Triggers</h2>
        <div className="grid grid-cols-2 gap-3">
          {stressTypes.map((type) => (
            <Label 
              key={type} 
              className="flex items-center space-x-3 bg-gray-700/40 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-700/60 transition-colors"
            >
              <Checkbox 
                className="border-gray-600 data-[state=checked]:bg-primary"
                checked={selectedStress.includes(type)}
                onCheckedChange={(checked) => handleStressToggle(type, checked as boolean)}
              />
              <span className="text-white">{type}</span>
            </Label>
          ))}
        </div>
      </div>
    </Card>
  );
}