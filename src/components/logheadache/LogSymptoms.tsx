import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useLocations } from "@/contexts/LocationContext";
import { LocationTabs } from "./LocationTabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NeurologicalScreening } from "./screening/NeurologicalScreening";

interface LogSymptomsProps {
  episodeId?: string | null;
}

type SymptomTiming = 'Before headache' | 'During headache' | 'After headache started';

const TIMING_OPTIONS: SymptomTiming[] = ['Before headache', 'During headache', 'After headache started'];

const parseSymptom = (symptomStr: string): { name: string; timing?: SymptomTiming } => {
  const match = symptomStr.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (match) return { name: match[1], timing: match[2] as SymptomTiming };
  return { name: symptomStr };
};

export default function LogSymptoms({ episodeId }: LogSymptomsProps) {
  const [selectedSide, setSelectedSide] = useState<string>("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [symptomsWithTiming, setSymptomsWithTiming] = useState<Map<string, SymptomTiming | undefined>>(new Map());
  const [expandedSymptoms, setExpandedSymptoms] = useState<Set<string>>(new Set());
  const { updateEpisode, activeEpisode } = useEpisode();
  const { locations, activeLocationId, activeLocation, updateLocation } = useLocations();

  const hasMultipleLocations = locations.length > 1;

  const commonSymptoms = ['Nausea', 'Vomiting', 'Dizziness', 'Pins & Needles'];
  const functionalDifficulties = ['Speech Difficulty', 'Swallowing Difficulty'];
  const visualDisturbances = ['Seeing Stars', 'Dark Spots', 'Line Patterns'];
  const sensorySymptoms = ['Sound Sensitivity', 'Light Sensitivity'];

  // Load existing symptoms from location or episode
  useEffect(() => {
    const sourceSymptoms = hasMultipleLocations && activeLocation
      ? activeLocation.symptoms
      : activeEpisode?.symptoms;

    if (sourceSymptoms) {
      const timingMap = new Map<string, SymptomTiming | undefined>();
      sourceSymptoms.forEach((symptomStr: string) => {
        const parsed = parseSymptom(symptomStr);
        if (parsed.name.startsWith('Neck Pain')) {
          timingMap.set('Neck Pain', parsed.timing);
        } else if (parsed.name.startsWith('Body Weakness')) {
          const sideMatch = parsed.name.match(/Body Weakness - (.+)/);
          if (sideMatch) setSelectedSide(sideMatch[1]);
        } else if (!parsed.name.startsWith('Pain:')) {
          timingMap.set(parsed.name, parsed.timing);
        }
      });
      setSymptomsWithTiming(timingMap);
    } else {
      setSymptomsWithTiming(new Map());
      setSelectedSide("");
    }
  }, [activeEpisode, activeLocation, activeLocationId, hasMultipleLocations]);

  const getFormattedSymptoms = (timingMap: Map<string, SymptomTiming | undefined>): string[] => {
    const symptoms: string[] = [];
    timingMap.forEach((timing, name) => {
      symptoms.push(timing ? `${name} (${timing})` : name);
    });
    if (selectedSide) {
      symptoms.push(`Body Weakness - ${selectedSide}`);
    }
    // Preserve Pain: characteristics
    const source = hasMultipleLocations && activeLocation
      ? activeLocation.symptoms
      : activeEpisode?.symptoms;
    const painChars = (source || []).filter((s: string) => s.startsWith('Pain:'));
    return [...painChars, ...symptoms];
  };

  const saveSymptoms = async (formatted: string[]) => {
    if (hasMultipleLocations && activeLocationId) {
      await updateLocation(activeLocationId, { symptoms: formatted });
    } else if (episodeId) {
      await updateEpisode(episodeId, { symptoms: formatted });
    }
  };

  const handleSymptomToggle = async (symptom: string, checked: boolean) => {
    const newMap = new Map(symptomsWithTiming);
    if (checked) {
      newMap.set(symptom, undefined);
      setExpandedSymptoms(prev => new Set([...prev, symptom]));
    } else {
      newMap.delete(symptom);
      setExpandedSymptoms(prev => { const next = new Set(prev); next.delete(symptom); return next; });
    }
    setSymptomsWithTiming(newMap);
    await saveSymptoms(getFormattedSymptoms(newMap));
  };

  const handleTimingChange = async (symptom: string, timing: SymptomTiming) => {
    const newMap = new Map(symptomsWithTiming);
    newMap.set(symptom, timing);
    setSymptomsWithTiming(newMap);
    await saveSymptoms(getFormattedSymptoms(newMap));
  };

  const toggleExpanded = (symptom: string) => {
    setExpandedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(symptom)) next.delete(symptom); else next.add(symptom);
      return next;
    });
  };

  const handleSideChange = async (side: string) => {
    setSelectedSide(side);
    const symptoms = getFormattedSymptoms(symptomsWithTiming);
    const filtered = symptoms.filter(s => !s.startsWith('Body Weakness'));
    filtered.push(`Body Weakness - ${side}`);
    await saveSymptoms(filtered);
  };

  const handleAddCustomSymptom = async () => {
    if (customSymptom.trim() && !symptomsWithTiming.has(customSymptom.trim())) {
      const newMap = new Map(symptomsWithTiming);
      newMap.set(customSymptom.trim(), undefined);
      setSymptomsWithTiming(newMap);
      setExpandedSymptoms(prev => new Set([...prev, customSymptom.trim()]));
      setCustomSymptom("");
      await saveSymptoms(getFormattedSymptoms(newMap));
    }
  };

  const isSymptomSelected = (symptom: string) => symptomsWithTiming.has(symptom);
  const getSymptomTiming = (symptom: string) => symptomsWithTiming.get(symptom);

  const renderSymptomWithTiming = (symptom: string) => {
    const isSelected = isSymptomSelected(symptom);
    const isExpanded = expandedSymptoms.has(symptom);
    const currentTiming = getSymptomTiming(symptom);

    return (
      <div key={symptom} className="space-y-2">
        <Label className="flex items-center justify-between p-3 rounded-lg bg-gray-700/40 border border-gray-700 cursor-pointer">
          <div className="flex items-center space-x-3">
            <Checkbox className="border-gray-600" checked={isSelected}
              onCheckedChange={(checked) => handleSymptomToggle(symptom, checked as boolean)} />
            <span className="text-white">{symptom}</span>
            {currentTiming && (
              <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">{currentTiming}</span>
            )}
          </div>
          {isSelected && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={(e) => { e.preventDefault(); toggleExpanded(symptom); }}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </Label>
        {isSelected && isExpanded && (
          <div className="ml-8 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="text-sm text-gray-400 mb-2">When did this symptom occur?</div>
            <RadioGroup value={currentTiming || ''} onValueChange={(value) => handleTimingChange(symptom, value as SymptomTiming)} className="space-y-2">
              {TIMING_OPTIONS.map((timing) => (
                <Label key={timing} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700/30 border border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <RadioGroupItem value={timing} className="text-primary" />
                  <span className="text-white text-sm">{timing}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    );
  };

  const predefinedSymptoms = [...commonSymptoms, ...functionalDifficulties, ...visualDisturbances, ...sensorySymptoms, 'Neck Pain'];
  const customSymptoms = Array.from(symptomsWithTiming.keys()).filter(
    s => !predefinedSymptoms.includes(s) && !s.startsWith('Body Weakness')
  );

  return (
    <div className="space-y-6">
      <LocationTabs />

      <NeurologicalScreening />

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">
            Common Symptoms
            {hasMultipleLocations && activeLocation && (
              <span className="text-sm font-normal text-primary ml-2">— {activeLocation.location_name}</span>
            )}
          </h2>
          <p className="text-sm text-gray-400">Select symptoms and specify when they occurred</p>
          <div className="space-y-3">
            {commonSymptoms.map(symptom => renderSymptomWithTiming(symptom))}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Neck Pain</h2>
          {renderSymptomWithTiming('Neck Pain')}
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Functional Difficulties</h2>
          <div className="space-y-3">{functionalDifficulties.map(symptom => renderSymptomWithTiming(symptom))}</div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Visual Disturbances</h2>
          <div className="space-y-3">{visualDisturbances.map(symptom => renderSymptomWithTiming(symptom))}</div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Sensory Sensitivity</h2>
          <div className="space-y-3">{sensorySymptoms.map(symptom => renderSymptomWithTiming(symptom))}</div>
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
            <Input type="text" value={customSymptom} onChange={(e) => setCustomSymptom(e.target.value)}
              maxLength={50} placeholder="Enter custom symptom" 
              className="w-full bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()} />
            <Button variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-transparent"
              onClick={handleAddCustomSymptom}>Add</Button>
          </div>
          {customSymptoms.length > 0 && (
            <div className="space-y-3 mt-4">
              {customSymptoms.map(symptom => renderSymptomWithTiming(symptom))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
