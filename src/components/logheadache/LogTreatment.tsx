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

interface LogTreatmentProps {
  episodeId?: string | null;
}

export default function LogTreatment({ episodeId }: LogTreatmentProps) {
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("");
  const [effectiveness, setEffectiveness] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [treatmentData, setTreatmentData] = useState<any>({});
  const { updateEpisode, activeEpisode } = useEpisode();
  const { locations, activeLocationId, activeLocation, updateLocation } = useLocations();

  const hasMultipleLocations = locations.length > 1;

  // Load existing treatment data from location or episode
  useEffect(() => {
    const source = hasMultipleLocations && activeLocation
      ? activeLocation.treatment
      : activeEpisode?.treatment;

    if (source) {
      const treatment = source as any;
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
  }, [activeEpisode, activeLocation, activeLocationId, hasMultipleLocations]);

  const handleTreatmentTypeChange = async (type: TreatmentType) => {
    setTreatmentType(type);
    const updatedTreatment = { ...treatmentData, type };
    setTreatmentData(updatedTreatment);
    
    if (hasMultipleLocations && activeLocationId) {
      await updateLocation(activeLocationId, { treatment: updatedTreatment });
    } else if (episodeId) {
      await updateEpisode(episodeId, { treatment: updatedTreatment });
    }
  };

  const handleSaveTreatment = async () => {
    const fullTreatment = {
      ...treatmentData,
      type: treatmentType,
      effectiveness,
      notes,
      savedAt: new Date().toISOString(),
    };

    if (hasMultipleLocations && activeLocationId) {
      await updateLocation(activeLocationId, { 
        treatment: fullTreatment,
        notes: notes || activeLocation?.notes 
      });
    } else if (episodeId) {
      await updateEpisode(episodeId, { 
        treatment: fullTreatment,
        notes: notes || activeEpisode?.notes 
      });
    }
  };

  return (
    <div className="space-y-6">
      <LocationTabs />

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
            <TreatmentTimingSection />
          </TreatmentSection>
          
          <TreatmentSection title="Effectiveness">
            <EffectivenessSection />
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
