
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ClassificationSection() {
  const [classifications, setClassifications] = useState<string[]>([]);

  return (
    <div>
      <Label className="text-gray-400 mb-2 block">Treatment Classification</Label>
      <ToggleGroup 
        type="multiple" 
        value={classifications}
        onValueChange={setClassifications}
        className="grid grid-cols-2 gap-3"
      >
        <ToggleGroupItem 
          value="prevention-plan" 
          className="h-auto py-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 data-[state=on]:bg-primary/20 data-[state=on]:border-primary/30"
        >
          Prevention Plan
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="treatment-plan" 
          className="h-auto py-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 data-[state=on]:bg-primary/20 data-[state=on]:border-primary/30"
        >
          Treatment Plan
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="non-structured" 
          className="h-auto py-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 data-[state=on]:bg-primary/20 data-[state=on]:border-primary/30"
        >
          Non-structured plan
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="side-effects" 
          className="h-auto py-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 data-[state=on]:bg-primary/20 data-[state=on]:border-primary/30"
        >
          Side-Effects Noticed
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
