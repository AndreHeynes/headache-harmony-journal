
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function MedicationsSection() {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  const handleMedicationChange = (medication: string) => {
    setSelectedMedications(prev => 
      prev.includes(medication)
        ? prev.filter(m => m !== medication)
        : [...prev, medication]
    );
  };

  const medications = [
    "Over-the-counter pain reliever",
    "Prescription medication",
    "Anti-nausea medication",
    "Triptan medication",
    "Anti-inflammatory"
  ];

  return (
    <div>
      <Label className="text-white/60">Medications Taken</Label>
      <div className="mt-2 space-y-3">
        {medications.map((medication) => (
          <Label key={medication} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <Checkbox 
              checked={selectedMedications.includes(medication)}
              onCheckedChange={() => handleMedicationChange(medication)}
              className="border-primary data-[state=checked]:bg-primary" 
            />
            <span className="ml-3 text-white">{medication}</span>
          </Label>
        ))}
      </div>
    </div>
  );
}
