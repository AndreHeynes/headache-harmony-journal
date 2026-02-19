import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EffectivenessSectionProps {
  reliefTimingValue?: string;
  onReliefTimingChange?: (timing: string) => void;
  outcomeValue?: string;
  onOutcomeChange?: (outcome: string) => void;
}

export function EffectivenessSection({ 
  reliefTimingValue, 
  onReliefTimingChange,
  outcomeValue,
  onOutcomeChange
}: EffectivenessSectionProps) {
  const [reliefTiming, setReliefTiming] = useState<string>(reliefTimingValue || "");
  const [outcome, setOutcome] = useState<string>(outcomeValue || "");

  useEffect(() => {
    if (reliefTimingValue !== undefined) setReliefTiming(reliefTimingValue);
  }, [reliefTimingValue]);

  useEffect(() => {
    if (outcomeValue !== undefined) setOutcome(outcomeValue);
  }, [outcomeValue]);

  const handleReliefChange = (val: string) => {
    setReliefTiming(val);
    onReliefTimingChange?.(val);
  };

  const handleOutcomeChange = (val: string) => {
    setOutcome(val);
    onOutcomeChange?.(val);
  };

  const reliefOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "10-20mins", label: "10-20 mins after treatment" },
    { value: "30-40mins", label: "30-40 mins after treatment" },
    { value: "60-plus", label: "60+ mins" }
  ];

  const outcomeOptions = [
    { value: "effective", label: "Effective — pain fully resolved" },
    { value: "partially_effective", label: "Partially effective — pain reduced" },
    { value: "not_effective", label: "Not effective — no change" },
    { value: "worsened", label: "Pain worsened after treatment" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-muted-foreground mb-2 block">Relief Timing</Label>
        <RadioGroup value={reliefTiming} onValueChange={handleReliefChange}>
          <div className="space-y-3">
            {reliefOptions.map(option => (
              <Label 
                key={option.value} 
                className="flex items-center p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={option.value} className="text-primary" />
                <span className="ml-3 text-foreground">{option.label}</span>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-muted-foreground mb-2 block">Treatment Outcome</Label>
        <RadioGroup value={outcome} onValueChange={handleOutcomeChange}>
          <div className="space-y-3">
            {outcomeOptions.map(option => (
              <Label 
                key={option.value} 
                className="flex items-center p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={option.value} className="text-primary" />
                <span className="ml-3 text-foreground">{option.label}</span>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
