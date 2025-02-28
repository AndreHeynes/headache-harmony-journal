
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ExerciseDetailsSection() {
  const [exerciseType, setExerciseType] = useState<string>("");
  const [exerciseStructure, setExerciseStructure] = useState<string>("");
  const [exerciseLocation, setExerciseLocation] = useState<string>("");

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-gray-400 mb-2 block">Exercise Type</Label>
        <RadioGroup value={exerciseType} onValueChange={setExerciseType}>
          <div className="space-y-3">
            <Label 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="stretching" className="text-primary" />
              <span className="ml-3 text-white">Stretching</span>
            </Label>
            <Label 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="strengthening" className="text-primary" />
              <span className="ml-3 text-white">Strengthening/Resistance</span>
            </Label>
            <Label 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="mobility" className="text-primary" />
              <span className="ml-3 text-white">Mobility</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-gray-400 mb-2 block">Exercise Structure</Label>
        <RadioGroup value={exerciseStructure} onValueChange={setExerciseStructure}>
          <div className="space-y-3">
            <Label 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="structured" className="text-primary" />
              <span className="ml-3 text-white">Structured</span>
            </Label>
            <Label 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="unstructured" className="text-primary" />
              <span className="ml-3 text-white">Unstructured</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-gray-400 mb-2 block">Exercise Location</Label>
        <RadioGroup value={exerciseLocation} onValueChange={setExerciseLocation}>
          <div className="space-y-3">
            <Label 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="home" className="text-primary" />
              <span className="ml-3 text-white">Home/Private</span>
            </Label>
            <Label 
              className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40 hover:bg-gray-700/60 transition-colors cursor-pointer"
            >
              <RadioGroupItem value="professional" className="text-primary" />
              <span className="ml-3 text-white">Professional</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
