
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { TreatmentSelectionSection, TreatmentType } from "./sections/TreatmentSelectionSection";
import { MedicationDetailsSection } from "./sections/MedicationDetailsSection";
import { MeditationDetailsSection } from "./sections/MeditationDetailsSection";
import { MassageDetailsSection } from "./sections/MassageDetailsSection";
import { ExerciseDetailsSection } from "./sections/ExerciseDetailsSection";
import { TreatmentTimingSection } from "./sections/TreatmentTimingSection";
import { EffectivenessSection } from "./sections/EffectivenessSection";
import { ClassificationSection } from "./sections/ClassificationSection";
import { NotesSection } from "./sections/NotesSection";
import { Textarea } from "@/components/ui/textarea";

export default function LogTreatment() {
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("");

  const handleSave = () => {
    // Here you would save the treatment log data
    toast.success("Treatment log saved successfully");
  };

  // Render the appropriate details section based on treatment type
  const renderDetailsSection = () => {
    if (!treatmentType) return null;

    switch (treatmentType) {
      case "medication":
        return <MedicationDetailsSection />;
      case "meditation":
        return <MeditationDetailsSection />;
      case "massage":
        return <MassageDetailsSection />;
      case "exercise":
        return <ExerciseDetailsSection />;
      case "custom":
        // For custom, you might want to provide a text input
        return (
          <div className="pt-2">
            <Textarea 
              className="w-full bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500 rounded-lg p-3" 
              placeholder="Describe your custom treatment..."
              rows={3}
            />
          </div>
        );
      default:
        return null;
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
            onTreatmentChange={setTreatmentType}
          />
          
          {/* Treatment Details - conditional rendering based on treatment type */}
          {treatmentType && (
            <>
              <Separator className="my-6 bg-gray-700" />
              <div>
                <h3 className="text-md font-medium text-white mb-4">Treatment Details</h3>
                {renderDetailsSection()}
              </div>
            </>
          )}
          
          <Separator className="my-6 bg-gray-700" />
          
          {/* Treatment Timing */}
          <div>
            <h3 className="text-md font-medium text-white mb-4">Treatment Timing</h3>
            <TreatmentTimingSection />
          </div>
          
          <Separator className="my-6 bg-gray-700" />
          
          {/* Effectiveness */}
          <div>
            <h3 className="text-md font-medium text-white mb-4">Effectiveness</h3>
            <EffectivenessSection />
          </div>
          
          <Separator className="my-6 bg-gray-700" />
          
          {/* Classification */}
          <div>
            <h3 className="text-md font-medium text-white mb-4">Treatment Classification</h3>
            <ClassificationSection />
          </div>
          
          <Separator className="my-6 bg-gray-700" />
          
          {/* Notes */}
          <div>
            <h3 className="text-md font-medium text-white mb-4">Additional Notes</h3>
            <NotesSection />
          </div>
          
          <Button 
            className="w-full mt-6 bg-primary hover:bg-primary-dark text-charcoal font-medium"
            onClick={handleSave}
          >
            Save Treatment Log
          </Button>
        </div>
      </Card>
    </div>
  );
}
