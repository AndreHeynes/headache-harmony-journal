
import { useState } from "react";
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

export default function LogTreatment() {
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("");

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-medium text-white">Treatment Log</h2>
          
          {/* Treatment Selection */}
          <TreatmentSelectionSection 
            selectedTreatment={treatmentType}
            onTreatmentChange={setTreatmentType}
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
          
          <SaveTreatmentButton />
        </div>
      </Card>
    </div>
  );
}
