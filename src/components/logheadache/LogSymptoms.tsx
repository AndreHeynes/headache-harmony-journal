
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function LogSymptoms() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Associated Symptoms</h2>
          <div className="space-y-3">
            {[
              "Nausea",
              "Vomiting",
              "Sensitivity to Light",
              "Sensitivity to Sound",
              "Visual Disturbances",
              "Dizziness",
              "Fatigue",
              "Neck Pain"
            ].map((symptom) => (
              <Label key={symptom} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                <Checkbox className="border-primary data-[state=checked]:bg-primary" />
                <span className="ml-3 text-white">{symptom}</span>
              </Label>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
