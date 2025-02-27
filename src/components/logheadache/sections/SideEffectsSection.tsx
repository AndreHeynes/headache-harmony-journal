
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function SideEffectsSection() {
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [customEffect, setCustomEffect] = useState<string>("");
  const [customEffects, setCustomEffects] = useState<string[]>([]);

  const handleEffectChange = (effect: string) => {
    setSelectedEffects(prev => 
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  const handleCustomEffectChange = (effect: string) => {
    setCustomEffects(prev => 
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  const handleAddCustomEffect = () => {
    if (customEffect.trim() !== "" && !customEffects.includes(customEffect)) {
      setCustomEffects([...customEffects, customEffect]);
      setCustomEffect("");
    }
  };

  const commonSideEffects = [
    "Drowsiness",
    "Nausea",
    "Dizziness",
    "Dry mouth",
    "Fatigue",
    "Heartburn/Indigestion"
  ];

  return (
    <div className="space-y-4">
      <Label className="text-white/60">Side Effects (if any)</Label>
      <div className="space-y-3">
        {commonSideEffects.map((effect) => (
          <Label key={effect} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <Checkbox 
              checked={selectedEffects.includes(effect)}
              onCheckedChange={() => handleEffectChange(effect)}
              className="border-primary data-[state=checked]:bg-primary" 
            />
            <span className="ml-3 text-white">{effect}</span>
          </Label>
        ))}

        {customEffects.map((effect) => (
          <Label key={effect} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <Checkbox 
              checked={true}
              onCheckedChange={() => handleCustomEffectChange(effect)}
              className="border-primary data-[state=checked]:bg-primary" 
            />
            <span className="ml-3 text-white">{effect}</span>
          </Label>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Input
          value={customEffect}
          onChange={(e) => setCustomEffect(e.target.value)}
          placeholder="Add other side effect"
          className="bg-white/5 border-white/10 text-white"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={handleAddCustomEffect}
          disabled={customEffect.trim() === ""}
          className="border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
