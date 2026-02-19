import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TreatmentTimingSectionProps {
  value?: string;
  onChange?: (timing: string) => void;
}

export function TreatmentTimingSection({ value, onChange }: TreatmentTimingSectionProps) {
  const [timing, setTiming] = useState<string>(value || "");

  useEffect(() => {
    if (value !== undefined) setTiming(value);
  }, [value]);

  const handleChange = (val: string) => {
    setTiming(val);
    onChange?.(val);
  };

  const timingOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "10-20mins", label: "10-20 mins after onset" },
    { value: "30-40mins", label: "30-40 mins after onset" },
    { value: "unsure", label: "Not sure" }
  ];

  return (
    <div>
      <Label className="text-muted-foreground mb-2 block">When did you take treatment?</Label>
      <RadioGroup value={timing} onValueChange={handleChange}>
        <div className="space-y-3">
          {timingOptions.map(option => (
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
  );
}
