import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { TreatmentSelectionSection, TreatmentType } from "./sections/TreatmentSelectionSection";
import { TreatmentTimingSection } from "./sections/TreatmentTimingSection";
import { EffectivenessSection } from "./sections/EffectivenessSection";
import { ClassificationSection } from "./sections/ClassificationSection";
import { NotesSection } from "./sections/NotesSection";
import { TreatmentDetailsRenderer } from "./sections/treatment/TreatmentDetailsRenderer";
import { TreatmentSection } from "./sections/treatment/TreatmentSection";
import { SaveTreatmentButton } from "./sections/treatment/SaveTreatmentButton";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useLocations } from "@/contexts/LocationContext";
import { LocationTabs } from "./LocationTabs";
import { PositionalScreening } from "./screening/PositionalScreening";

interface LogTreatmentProps {
  episodeId?: string | null;
}

export default function LogTreatment({ episodeId }: LogTreatmentProps) {
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("");
  const [effectiveness, setEffectiveness] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [treatmentData, setTreatmentData] = useState<any>({});
  const [treatmentTiming, setTreatmentTiming] = useState<string>("");
  const [reliefTiming, setReliefTiming] = useState<string>("");
  const [treatmentOutcome, setTreatmentOutcome] = useState<string>("");
  const { updateEpisode, activeEpisode } = useEpisode();
  const { locations, activeLocationId, activeLocation, updateLocation } = useLocations();

  const hasMultipleLocations = locations.length > 1;

  // Load existing treatment data from location or episode
  useEffect(() => {
    const source = hasMultipleLocations && activeLocation
      ? activeLocation
      : activeEpisode;

    if (source) {
      const treatment = (hasMultipleLocations && activeLocation 
        ? activeLocation.treatment 
        : activeEpisode?.treatment) as any;
      
      if (treatment) {
        if (treatment.type) setTreatmentType(treatment.type);
        if (treatment.effectiveness) setEffectiveness(treatment.effectiveness);
        if (treatment.notes) setNotes(treatment.notes);
        setTreatmentData(treatment);
      } else {
        setTreatmentType("");
        setEffectiveness(0);
        setNotes("");
        setTreatmentData({});
      }

      // Load structured timing fields
      const src = source as any;
      setTreatmentTiming(src?.treatment_timing || treatment?.treatment_timing || "");
      setReliefTiming(src?.relief_timing || treatment?.relief_timing || "");
      setTreatmentOutcome(src?.treatment_outcome || treatment?.treatment_outcome || "");
    }
  }, [activeEpisode, activeLocation, activeLocationId, hasMultipleLocations]);

  const persistUpdate = async (updates: Record<string, any>) => {
    if (hasMultipleLocations && activeLocationId) {
      await updateLocation(activeLocationId, updates);
    } else if (episodeId) {
      await updateEpisode(episodeId, updates);
    }
  };

  const handleTreatmentTypeChange = async (type: TreatmentType) => {
    setTreatmentType(type);
    const updatedTreatment = { ...treatmentData, type };
    setTreatmentData(updatedTreatment);
    await persistUpdate({ treatment: updatedTreatment });
  };

  const handleTreatmentTimingChange = async (timing: string) => {
    setTreatmentTiming(timing);
    const updatedTreatment = { ...treatmentData, treatment_timing: timing };
    setTreatmentData(updatedTreatment);
    await persistUpdate({ treatment: updatedTreatment, treatment_timing: timing });
  };

  const handleReliefTimingChange = async (timing: string) => {
    setReliefTiming(timing);
    const updatedTreatment = { ...treatmentData, relief_timing: timing };
    setTreatmentData(updatedTreatment);
    await persistUpdate({ treatment: updatedTreatment, relief_timing: timing });
  };

  const handleTreatmentOutcomeChange = async (outcome: string) => {
    setTreatmentOutcome(outcome);
    const updatedTreatment = { ...treatmentData, treatment_outcome: outcome };
    setTreatmentData(updatedTreatment);
    await persistUpdate({ treatment: updatedTreatment, treatment_outcome: outcome });
  };

  const handleSaveTreatment = async () => {
    const fullTreatment = {
      ...treatmentData,
      type: treatmentType,
      effectiveness,
      notes,
      treatment_timing: treatmentTiming,
      relief_timing: reliefTiming,
      treatment_outcome: treatmentOutcome,
      savedAt: new Date().toISOString(),
    };

    await persistUpdate({ 
      treatment: fullTreatment,
      treatment_timing: treatmentTiming,
      relief_timing: reliefTiming,
      treatment_outcome: treatmentOutcome,
      notes: notes || (hasMultipleLocations ? activeLocation?.notes : activeEpisode?.notes),
    });
  };

  return (
    <div className="space-y-6">
      <LocationTabs />

      <PositionalScreening />

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-medium text-white">
            Treatment Log
            {hasMultipleLocations && activeLocation && (
              <span className="text-sm font-normal text-primary ml-2">— {activeLocation.location_name}</span>
            )}
          </h2>
          
          <TreatmentSelectionSection 
            selectedTreatment={treatmentType}
            onTreatmentChange={handleTreatmentTypeChange}
          />
          
          {treatmentType && (
            <>
              <Separator className="my-6 bg-gray-700" />
              <TreatmentSection title="Treatment Details">
                <TreatmentDetailsRenderer treatmentType={treatmentType} />
              </TreatmentSection>
            </>
          )}
          
          <TreatmentSection title="Treatment Timing">
            <TreatmentTimingSection 
              value={treatmentTiming}
              onChange={handleTreatmentTimingChange}
            />
          </TreatmentSection>
          
          <TreatmentSection title="Effectiveness & Outcome">
            <EffectivenessSection 
              reliefTimingValue={reliefTiming}
              onReliefTimingChange={handleReliefTimingChange}
              outcomeValue={treatmentOutcome}
              onOutcomeChange={handleTreatmentOutcomeChange}
            />
          </TreatmentSection>
          
          <TreatmentSection title="Treatment Classification">
            <ClassificationSection />
          </TreatmentSection>
          
          <TreatmentSection title="Additional Notes" isLast={true}>
            <NotesSection />
          </TreatmentSection>
          
          <SaveTreatmentButton onSave={handleSaveTreatment} />
        </div>
      </Card>
    </div>
  );
}
