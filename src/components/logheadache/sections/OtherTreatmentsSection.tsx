
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function OtherTreatmentsSection() {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  const handleTreatmentChange = (treatment: string) => {
    setSelectedTreatments(prev => 
      prev.includes(treatment)
        ? prev.filter(t => t !== treatment)
        : [...prev, treatment]
    );
  };

  const treatments = [
    "Rest in dark room",
    "Cold compress",
    "Hot compress",
    "Hydration",
    "Caffeine",
    "Massage",
    "Meditation/Relaxation",
    "Acupressure"
  ];

  return (
    <div>
      <Label className="text-white/60">Other Treatments</Label>
      <div className="mt-2 space-y-3">
        {treatments.map((treatment) => (
          <Label key={treatment} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <Checkbox 
              checked={selectedTreatments.includes(treatment)}
              onCheckedChange={() => handleTreatmentChange(treatment)}
              className="border-primary data-[state=checked]:bg-primary" 
            />
            <span className="ml-3 text-white">{treatment}</span>
          </Label>
        ))}
      </div>
    </div>
  );
}
