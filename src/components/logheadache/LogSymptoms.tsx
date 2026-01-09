import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEpisode } from "@/contexts/EpisodeContext";

interface LogSymptomsProps {
  episodeId?: string | null;
}

export default function LogSymptoms({ episodeId }: LogSymptomsProps) {
  const [selectedSide, setSelectedSide] = useState<string>("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [hasNeckPain, setHasNeckPain] = useState(false);
  const [neckPainTiming, setNeckPainTiming] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const { updateEpisode, activeEpisode } = useEpisode();

  // Load existing symptoms
  useEffect(() => {
    if (activeEpisode?.symptoms) {
      setSelectedSymptoms(activeEpisode.symptoms);
      // Check for neck pain in symptoms
      if (activeEpisode.symptoms.some(s => s.toLowerCase().includes('neck'))) {
        setHasNeckPain(true);
      }
    }
  }, [activeEpisode]);

  const handleSymptomToggle = async (symptom: string, checked: boolean) => {
    let updatedSymptoms: string[];
    if (checked) {
      updatedSymptoms = [...selectedSymptoms, symptom];
    } else {
      updatedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    }
    setSelectedSymptoms(updatedSymptoms);
    
    if (episodeId) {
      await updateEpisode(episodeId, { symptoms: updatedSymptoms });
    }
  };

  const handleNeckPainChange = async (checked: boolean) => {
    setHasNeckPain(checked);
    const symptom = 'Neck Pain';
    
    if (checked && !selectedSymptoms.includes(symptom)) {
      const updatedSymptoms = [...selectedSymptoms, symptom];
      setSelectedSymptoms(updatedSymptoms);
      if (episodeId) {
        await updateEpisode(episodeId, { symptoms: updatedSymptoms });
      }
    } else if (!checked) {
      const updatedSymptoms = selectedSymptoms.filter(s => s !== symptom);
      setSelectedSymptoms(updatedSymptoms);
      setNeckPainTiming("");
      if (episodeId) {
        await updateEpisode(episodeId, { symptoms: updatedSymptoms });
      }
    }
  };

  const handleNeckPainTimingChange = async (timing: string) => {
    setNeckPainTiming(timing);
    // Update symptoms to include timing info
    const neckSymptom = `Neck Pain (${timing})`;
    const updatedSymptoms = selectedSymptoms
      .filter(s => !s.startsWith('Neck Pain'))
      .concat([neckSymptom]);
    setSelectedSymptoms(updatedSymptoms);
    
    if (episodeId) {
      await updateEpisode(episodeId, { symptoms: updatedSymptoms });
    }
  };

  const handleSideChange = async (side: string) => {
    setSelectedSide(side);
    const weaknessSymptom = `Body Weakness - ${side}`;
    const updatedSymptoms = selectedSymptoms
      .filter(s => !s.startsWith('Body Weakness'))
      .concat([weaknessSymptom]);
    setSelectedSymptoms(updatedSymptoms);
    
    if (episodeId) {
      await updateEpisode(episodeId, { symptoms: updatedSymptoms });
    }
  };

  const handleAddCustomSymptom = async () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      const updatedSymptoms = [...selectedSymptoms, customSymptom.trim()];
      setSelectedSymptoms(updatedSymptoms);
      setCustomSymptom("");
      
      if (episodeId) {
        await updateEpisode(episodeId, { symptoms: updatedSymptoms });
      }
    }
  };

  const isSymptomSelected = (symptom: string) => selectedSymptoms.includes(symptom);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Common Symptoms</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Nausea', 'Vomiting', 'Dizziness', 'Pins & Needles'].map((symptom) => (
              <Label key={symptom} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/40 border border-gray-700">
                <Checkbox 
                  className="border-gray-600" 
                  checked={isSymptomSelected(symptom)}
                  onCheckedChange={(checked) => handleSymptomToggle(symptom, checked as boolean)}
                />
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
                onCheckedChange={(checked) => handleNeckPainChange(checked as boolean)}
                className="border-gray-600" 
              />
              <span className="text-white">Experiencing Neck Pain</span>
            </Label>

            {hasNeckPain && (
              <div className="space-y-3 ml-4">
                <div className="text-sm text-gray-400 mb-2">When did the neck pain start?</div>
                <RadioGroup 
                  value={neckPainTiming} 
                  onValueChange={handleNeckPainTimingChange} 
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
                <Checkbox 
                  className="border-gray-600"
                  checked={isSymptomSelected(difficulty)}
                  onCheckedChange={(checked) => handleSymptomToggle(difficulty, checked as boolean)}
                />
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
                <Checkbox 
                  className="border-gray-600"
                  checked={isSymptomSelected(disturbance)}
                  onCheckedChange={(checked) => handleSymptomToggle(disturbance, checked as boolean)}
                />
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
                <Checkbox 
                  className="border-gray-600"
                  checked={isSymptomSelected(sensitivity)}
                  onCheckedChange={(checked) => handleSymptomToggle(sensitivity, checked as boolean)}
                />
                <span className="text-white">{sensitivity}</span>
              </Label>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Body Weakness</h2>
          <RadioGroup value={selectedSide} onValueChange={handleSideChange} className="space-y-3">
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
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
            />
            <Button 
              variant="ghost" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-transparent"
              onClick={handleAddCustomSymptom}
            >
              Add
            </Button>
          </div>
          {/* Display custom symptoms */}
          {selectedSymptoms.filter(s => 
            !['Nausea', 'Vomiting', 'Dizziness', 'Pins & Needles', 'Speech Difficulty', 
              'Swallowing Difficulty', 'Seeing Stars', 'Dark Spots', 'Line Patterns',
              'Sound Sensitivity', 'Light Sensitivity'].includes(s) && 
            !s.startsWith('Neck Pain') && !s.startsWith('Body Weakness')
          ).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSymptoms.filter(s => 
                !['Nausea', 'Vomiting', 'Dizziness', 'Pins & Needles', 'Speech Difficulty', 
                  'Swallowing Difficulty', 'Seeing Stars', 'Dark Spots', 'Line Patterns',
                  'Sound Sensitivity', 'Light Sensitivity'].includes(s) && 
                !s.startsWith('Neck Pain') && !s.startsWith('Body Weakness')
              ).map(symptom => (
                <span 
                  key={symptom} 
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
