
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

export function EffectivenessSection() {
  const [reliefTiming, setReliefTiming] = useState<string>("");
  const [effectiveness, setEffectiveness] = useState<string>("");

  const reliefOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "10-20mins", label: "10-20 mins after treatment" },
    { value: "30-60mins", label: "30-60 mins after treatment" },
    { value: "1-2hours", label: "1-2 hours after treatment" },
    { value: "2-4hours", label: "2-4 hours after treatment" },
    { value: "none", label: "No relief" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-white/60 mb-2 block">Treatment Effectiveness</Label>
        <Select value={effectiveness} onValueChange={setEffectiveness}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="How effective was this treatment?" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-white/10 text-white">
            <SelectItem value="very-effective">Very effective</SelectItem>
            <SelectItem value="somewhat-effective">Somewhat effective</SelectItem>
            <SelectItem value="slightly-effective">Slightly effective</SelectItem>
            <SelectItem value="not-effective">Not effective</SelectItem>
            <SelectItem value="too-soon">Too soon to tell</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white/60 mb-2 block">Time to Relief</Label>
        <RadioGroup value={reliefTiming} onValueChange={setReliefTiming}>
          <div className="space-y-3">
            {reliefOptions.map(option => (
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
    </div>
  );
}
