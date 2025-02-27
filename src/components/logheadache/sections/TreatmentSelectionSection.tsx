
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TreatmentType = "medication" | "meditation" | "massage" | "exercise" | "custom" | "";

interface TreatmentSelectionSectionProps {
  selectedTreatment: TreatmentType;
  onTreatmentChange: (value: TreatmentType) => void;
}

export function TreatmentSelectionSection({ 
  selectedTreatment, 
  onTreatmentChange 
}: TreatmentSelectionSectionProps) {
  return (
    <div>
      <Label className="text-white/60 mb-2 block">Treatment Type</Label>
      <Select 
        value={selectedTreatment} 
        onValueChange={(value) => onTreatmentChange(value as TreatmentType)}
      >
        <SelectTrigger className="bg-white/5 border-white/10 text-white">
          <SelectValue placeholder="Select Treatment Type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-white/10 text-white">
          <SelectItem value="medication">Medication</SelectItem>
          <SelectItem value="meditation">Meditation</SelectItem>
          <SelectItem value="massage">Massage</SelectItem>
          <SelectItem value="exercise">Exercise</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
