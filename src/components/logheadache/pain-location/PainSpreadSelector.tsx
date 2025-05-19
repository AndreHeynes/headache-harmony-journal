
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PainSpreadSelectorProps {
  painSpreads: boolean;
  setPainSpreads: (spreads: boolean) => void;
  spreadPattern: string;
  setSpreadPattern: (pattern: string) => void;
}

export function PainSpreadSelector({ 
  painSpreads, 
  setPainSpreads, 
  spreadPattern, 
  setSpreadPattern 
}: PainSpreadSelectorProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Does Pain spread?</h2>
        <Switch checked={painSpreads} onCheckedChange={setPainSpreads} />
      </div>

      {painSpreads && (
        <RadioGroup value={spreadPattern} onValueChange={setSpreadPattern}>
          <div className="space-y-3">
            <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
              <RadioGroupItem value="remain" className="text-primary" />
              <span className="ml-3 text-white">Remain on starting side</span>
            </Label>
            <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
              <RadioGroupItem value="change" className="text-primary" />
              <span className="ml-3 text-white">Changes to opposite side</span>
            </Label>
            <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
              <RadioGroupItem value="return" className="text-primary" />
              <span className="ml-3 text-white">Changes side and returns</span>
            </Label>
          </div>
        </RadioGroup>
      )}
    </>
  );
}
