
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PainPatternSelectorProps {
  painPattern: string;
  setPainPattern: (pattern: string) => void;
}

export function PainPatternSelector({ painPattern, setPainPattern }: PainPatternSelectorProps) {
  return (
    <RadioGroup value={painPattern} onValueChange={setPainPattern}>
      <div className="space-y-3">
        <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
          <RadioGroupItem value="medial" className="text-primary" />
          <span className="ml-3 text-white">Medial (inner)</span>
        </Label>
        <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
          <RadioGroupItem value="lateral" className="text-primary" />
          <span className="ml-3 text-white">Lateral (outer)</span>
        </Label>
        <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
          <RadioGroupItem value="both" className="text-primary" />
          <span className="ml-3 text-white">Both (broad)</span>
        </Label>
      </div>
    </RadioGroup>
  );
}
