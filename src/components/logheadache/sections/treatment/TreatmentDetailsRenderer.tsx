
import { TreatmentType } from "../../sections/TreatmentSelectionSection";
import { MedicationDetailsSection } from "../../sections/MedicationDetailsSection";
import { MeditationDetailsSection } from "../../sections/MeditationDetailsSection";
import { MassageDetailsSection } from "../../sections/MassageDetailsSection";
import { ExerciseDetailsSection } from "../../sections/ExerciseDetailsSection";
import { Textarea } from "@/components/ui/textarea";

interface TreatmentDetailsRendererProps {
  treatmentType: TreatmentType;
}

export function TreatmentDetailsRenderer({ treatmentType }: TreatmentDetailsRendererProps) {
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
}
