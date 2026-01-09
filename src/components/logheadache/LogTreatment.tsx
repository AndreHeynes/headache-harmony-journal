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

interface LogTreatmentProps {
  episodeId?: string | null;
}

export default function LogTreatment({ episodeId }: LogTreatmentProps) {
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("");
  const [effectiveness, setEffectiveness] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [treatmentData, setTreatmentData] = useState<any>({});
  const { updateEpisode, activeEpisode } = useEpisode();

  // Load existing treatment data
  useEffect(() => {
    if (activeEpisode?.treatment) {
      const treatment = activeEpisode.treatment as any;
      if (treatment.type) setTreatmentType(treatment.type);
      if (treatment.effectiveness) setEffectiveness(treatment.effectiveness);
      if (treatment.notes) setNotes(treatment.notes);
      setTreatmentData(treatment);
    }
  }, [activeEpisode]);

  const handleTreatmentTypeChange = async (type: TreatmentType) => {
    setTreatmentType(type);
    const updatedTreatment = { ...treatmentData, type };
    setTreatmentData(updatedTreatment);
    
    if (episodeId) {
      await updateEpisode(episodeId, { treatment: updatedTreatment });
    }
  };

  const handleSaveTreatment = async () => {
    if (episodeId) {
      const fullTreatment = {
        ...treatmentData,
        type: treatmentType,
        effectiveness,
        notes,
        savedAt: new Date().toISOString(),
      };
      await updateEpisode(episodeId, { 
        treatment: fullTreatment,
        notes: notes || activeEpisode?.notes 
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-medium text-white">Treatment Log</h2>
          
          {/* Treatment Selection */}
          <TreatmentSelectionSection 
            selectedTreatment={treatmentType}
            onTreatmentChange={handleTreatmentTypeChange}
          />
          
          {/* Treatment Details - conditional rendering based on treatment type */}
          {treatmentType && (
            <>
              <Separator className="my-6 bg-gray-700" />
              <TreatmentSection title="Treatment Details">
                <TreatmentDetailsRenderer treatmentType={treatmentType} />
              </TreatmentSection>
            </>
          )}
          
          {/* Treatment Timing */}
          <TreatmentSection title="Treatment Timing">
            <TreatmentTimingSection />
          </TreatmentSection>
          
          {/* Effectiveness */}
          <TreatmentSection title="Effectiveness">
            <EffectivenessSection />
          </TreatmentSection>
          
          {/* Classification */}
          <TreatmentSection title="Treatment Classification">
            <ClassificationSection />
          </TreatmentSection>
          
          {/* Notes */}
          <TreatmentSection title="Additional Notes" isLast={true}>
            <NotesSection />
          </TreatmentSection>
          
          <SaveTreatmentButton onSave={handleSaveTreatment} />
        </div>
      </Card>
    </div>
  );
}
