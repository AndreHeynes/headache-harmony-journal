
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function MedicationDetailsSection() {
  const [medicationType, setMedicationType] = useState<string>("");

  return (
    <div>
      <Label className="text-white/60 mb-2 block">Medication Details</Label>
      <RadioGroup value={medicationType} onValueChange={setMedicationType}>
        <div className="space-y-3">
          <Label 
            className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RadioGroupItem value="prescription" className="text-primary" />
            <span className="ml-3 text-white">Prescription</span>
          </Label>
          <Label 
            className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RadioGroupItem value="over-the-counter" className="text-primary" />
            <span className="ml-3 text-white">Over-the-Counter</span>
          </Label>
          <Label 
            className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RadioGroupItem value="organic-natural" className="text-primary" />
            <span className="ml-3 text-white">Organic/Natural</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
