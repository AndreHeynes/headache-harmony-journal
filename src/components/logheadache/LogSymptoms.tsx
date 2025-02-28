
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LogSymptoms() {
  const [selectedSide, setSelectedSide] = useState<string>("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [hasNeckPain, setHasNeckPain] = useState(false);
  const [neckPainTiming, setNeckPainTiming] = useState("");

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Common Symptoms</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Nausea', 'Vomiting', 'Dizziness', 'Pins & Needles'].map((symptom) => (
              <Label key={symptom} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
                <Checkbox className="border-gray-600" />
                <span className="text-white">{symptom}</span>
              </Label>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Neck Pain</h2>
          <div className="space-y-4">
            <Label className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
              <Checkbox 
                checked={hasNeckPain}
                onCheckedChange={(checked) => setHasNeckPain(checked as boolean)}
                className="border-gray-600" 
              />
              <span className="text-white">Experiencing Neck Pain</span>
            </Label>

            {hasNeckPain && (
              <div className="space-y-3 ml-4">
                <div className="text-sm text-gray-400 mb-2">When did the neck pain start?</div>
                <RadioGroup 
                  value={neckPainTiming} 
                  onValueChange={setNeckPainTiming} 
                  className="space-y-3"
                >
                  {['Before headache started', 'During headache', 'After headache started'].map((timing) => (
                    <Label key={timing} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
                      <RadioGroupItem value={timing} className="text-primary" />
                      <span className="text-white ml-3">{timing}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Functional Difficulties</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Speech Difficulty', 'Swallowing Difficulty'].map((difficulty) => (
              <Label key={difficulty} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
                <Checkbox className="border-gray-600" />
                <span className="text-white">{difficulty}</span>
              </Label>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Visual Disturbances</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Seeing Stars', 'Dark Spots', 'Line Patterns'].map((disturbance) => (
              <Label key={disturbance} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
                <Checkbox className="border-gray-600" />
                <span className="text-white">{disturbance}</span>
              </Label>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Sensory Sensitivity</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Sound Sensitivity', 'Light Sensitivity'].map((sensitivity) => (
              <Label key={sensitivity} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
                <Checkbox className="border-gray-600" />
                <span className="text-white">{sensitivity}</span>
              </Label>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Body Weakness</h2>
          <RadioGroup value={selectedSide} onValueChange={setSelectedSide} className="space-y-3">
            {['Right Side', 'Left Side', 'Both Sides'].map((side) => (
              <Label key={side} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
                <RadioGroupItem value={side} className="text-primary" />
                <span className="text-white ml-3">{side}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Custom Symptom</h2>
          <div className="relative">
            <Input 
              type="text" 
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              maxLength={50} 
              placeholder="Enter custom symptom" 
              className="w-full bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Button 
              variant="ghost" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-transparent"
            >
              Add
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
