
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function MeditationDetailsSection() {
  const [meditationType, setMeditationType] = useState<string>("");

  return (
    <div>
      <Label className="text-white/60 mb-2 block">Meditation Details</Label>
      <RadioGroup value={meditationType} onValueChange={setMeditationType}>
        <div className="space-y-3">
          <Label 
            className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RadioGroupItem value="integrative-body-mind" className="text-primary" />
            <span className="ml-3 text-white">Integrative body-mind training</span>
          </Label>
          <Label 
            className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RadioGroupItem value="mindfulness-stress-reduction" className="text-primary" />
            <span className="ml-3 text-white">Mindfulness-based stress reduction</span>
          </Label>
          <Label 
            className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RadioGroupItem value="mindfulness-cognitive-therapy" className="text-primary" />
            <span className="ml-3 text-white">Mindfulness-based cognitive therapy</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
