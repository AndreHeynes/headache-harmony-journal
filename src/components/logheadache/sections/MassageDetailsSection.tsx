
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MassageDetailsSection() {
  const [massageType, setMassageType] = useState<string>("");

  return (
    <div>
      <Label className="text-white/60 mb-2 block">Massage Details</Label>
      <Select value={massageType} onValueChange={setMassageType}>
        <SelectTrigger className="bg-white/5 border-white/10 text-white">
          <SelectValue placeholder="Select massage provider" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-white/10 text-white">
          <SelectItem value="self">Self</SelectItem>
          <SelectItem value="partner">Partner/Other</SelectItem>
          <SelectItem value="professional">Professional</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
