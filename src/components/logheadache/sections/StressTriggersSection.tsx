import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StressTrigger {
  type: string;
  hoursBefore: string;
}

interface StressTriggersSectionProps {
  onStressChange?: (stressTriggers: string[]) => void;
  initialStress?: string[];
}

export function StressTriggersSection({ onStressChange, initialStress = [] }: StressTriggersSectionProps) {
  const stressTypes = ["Physical", "Emotional", "Psychological", "Family", "Financial", "Social"];
  
  // Parse initial stress triggers to get selected types with their timing
  const parseInitialStress = (): StressTrigger[] => {
    return initialStress
      .map(s => {
        // Parse format: "Stress: Type (Xh before)" or "Stress: Type"
        const match = s.match(/Stress: (\w+)(?:\s*\((\d+)h before\))?/);
        if (match) {
          return { type: match[1], hoursBefore: match[2] || "" };
        }
        return null;
      })
      .filter((item): item is StressTrigger => item !== null);
  };
  
  const [selectedStress, setSelectedStress] = useState<StressTrigger[]>(parseInitialStress);

  // Update selected stress when initial data changes
  useEffect(() => {
    setSelectedStress(parseInitialStress());
  }, [initialStress]);

  const handleStressToggle = (stressType: string, checked: boolean) => {
    let updated: StressTrigger[];
    
    if (checked) {
      updated = [...selectedStress, { type: stressType, hoursBefore: "" }];
    } else {
      updated = selectedStress.filter(s => s.type !== stressType);
    }
    
    setSelectedStress(updated);
    notifyParent(updated);
  };

  const handleHoursChange = (stressType: string, hours: string) => {
    const updated = selectedStress.map(s => 
      s.type === stressType ? { ...s, hoursBefore: hours } : s
    );
    setSelectedStress(updated);
    notifyParent(updated);
  };

  const notifyParent = (triggers: StressTrigger[]) => {
    if (onStressChange) {
      const stressTriggers = triggers.map(s => 
        s.hoursBefore 
          ? `Stress: ${s.type} (${s.hoursBefore}h before)` 
          : `Stress: ${s.type}`
      );
      onStressChange(stressTriggers);
    }
  };

  const isSelected = (type: string) => selectedStress.some(s => s.type === type);
  const getHours = (type: string) => selectedStress.find(s => s.type === type)?.hoursBefore || "";

  return (
    <Card className="bg-card border-border">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-medium text-foreground">Stress Triggers</h2>
        <div className="space-y-3">
          {stressTypes.map((type) => (
            <div key={type} className="space-y-2">
              <Label 
                className="flex items-center space-x-3 bg-muted/50 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/70 transition-colors"
              >
                <Checkbox 
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  checked={isSelected(type)}
                  onCheckedChange={(checked) => handleStressToggle(type, checked as boolean)}
                />
                <span className="text-foreground">{type}</span>
              </Label>
              
              {isSelected(type) && (
                <div className="ml-8 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Hours"
                    min="0"
                    max="72"
                    className="w-24 bg-background border-border text-foreground placeholder:text-muted-foreground"
                    value={getHours(type)}
                    onChange={(e) => handleHoursChange(type, e.target.value)}
                  />
                  <span className="text-sm text-muted-foreground">hours before headache</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
