
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function EffectivenessSection() {
  const [reliefTiming, setReliefTiming] = useState<string>("");

  const reliefOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "10-20mins", label: "10-20 mins after treatment" },
    { value: "30-40mins", label: "30-40 mins after treatment" },
    { value: "60-plus", label: "60+ mins" }
  ];

  return (
    <div>
      <Label className="text-gray-400 mb-2 block">Relief Timing</Label>
      <RadioGroup value={reliefTiming} onValueChange={setReliefTiming}>
        <div className="space-y-3">
          {reliefOptions.map(option => (
            <Label 
              key={option.value} 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={option.value} className="text-primary" />
              <span className="ml-3 text-white">{option.label}</span>
            </Label>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
