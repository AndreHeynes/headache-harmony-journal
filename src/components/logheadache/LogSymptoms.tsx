
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LogSymptoms() {
  const [neckPainChecked, setNeckPainChecked] = useState(false);
  const [neckPainTiming, setNeckPainTiming] = useState<string>("");

  const commonSymptoms = [
    "Nausea",
    "Vomiting",
    "Sensitivity to Light",
    "Sensitivity to Sound",
    "Visual Disturbances",
    "Dizziness",
    "Fatigue"
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Associated Symptoms</h2>
          <div className="space-y-3">
            {commonSymptoms.map((symptom) => (
              <Label key={symptom} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                <Checkbox className="border-primary data-[state=checked]:bg-primary" />
                <span className="ml-3 text-white">{symptom}</span>
              </Label>
            ))}

            {/* Neck Pain Section */}
            <div className="space-y-3">
              <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                <Checkbox 
                  className="border-primary data-[state=checked]:bg-primary"
                  checked={neckPainChecked}
                  onCheckedChange={(checked: boolean) => setNeckPainChecked(checked)}
                />
                <span className="ml-3 text-white">Neck Pain</span>
              </Label>

              {neckPainChecked && (
                <div className="ml-6 p-3 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-sm text-white/60 mb-3">When did the neck pain start?</p>
                  <RadioGroup value={neckPainTiming} onValueChange={setNeckPainTiming}>
                    <div className="space-y-2">
                      <Label className="flex items-center p-2 rounded-lg hover:bg-white/5">
                        <RadioGroupItem value="before" className="text-primary" />
                        <span className="ml-3 text-white">Before headache started</span>
                      </Label>
                      <Label className="flex items-center p-2 rounded-lg hover:bg-white/5">
                        <RadioGroupItem value="during" className="text-primary" />
                        <span className="ml-3 text-white">During headache</span>
                      </Label>
                      <Label className="flex items-center p-2 rounded-lg hover:bg-white/5">
                        <RadioGroupItem value="after" className="text-primary" />
                        <span className="ml-3 text-white">After headache started</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
