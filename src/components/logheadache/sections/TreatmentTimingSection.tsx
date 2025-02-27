
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function TreatmentTimingSection() {
  const [timing, setTiming] = useState<string>("");

  const timingOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "10-20mins", label: "10-20 mins after onset" },
    { value: "30-60mins", label: "30-60 mins after onset" },
    { value: "hours", label: "Hours after onset" },
    { value: "unsure", label: "Not sure" }
  ];

  return (
    <div>
      <Label className="text-white/60 mb-2 block">When did you take treatment?</Label>
      <RadioGroup value={timing} onValueChange={setTiming}>
        <div className="space-y-3">
          {timingOptions.map(option => (
            <Label 
              key={option.value} 
              className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
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
