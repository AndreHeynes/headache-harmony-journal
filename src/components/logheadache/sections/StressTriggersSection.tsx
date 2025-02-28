
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function StressTriggersSection() {
  const stressTypes = ["Physical", "Emotional", "Psychological", "Family", "Financial", "Social"];

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-medium text-white">Stress Triggers</h2>
        <div className="grid grid-cols-2 gap-3">
          {stressTypes.map((type) => (
            <Label key={type} className="flex items-center space-x-3 bg-gray-700/40 border border-gray-700 rounded-lg p-3">
              <Checkbox className="border-gray-600 data-[state=checked]:bg-primary" />
              <span className="text-white">{type}</span>
            </Label>
          ))}
        </div>
      </div>
    </Card>
  );
}
