import { useScreening } from "@/contexts/RedFlagScreeningContext";
import { ScreeningQuestion } from "./ScreeningQuestion";

/** Neurological + Systemic screening — embedded in the Symptoms step */
export function NeurologicalScreening() {
  const { responses, updateResponse } = useScreening();

  return (
    <div className="space-y-3">
      <ScreeningQuestion
        question="Are you experiencing weakness, numbness, trouble speaking, confusion, or sudden vision changes?"
        helpText="These neurological symptoms alongside a headache may indicate a serious condition."
        answered={responses.hasNeurologicalSymptoms}
        onAnswer={(v) => updateResponse('hasNeurologicalSymptoms', v)}
      />
      <ScreeningQuestion
        question="Did these neurological symptoms start suddenly?"
        helpText="Sudden onset of neurological symptoms is an urgent warning sign."
        answered={responses.neuroOnsetSudden}
        onAnswer={(v) => updateResponse('neuroOnsetSudden', v)}
        visible={responses.hasNeurologicalSymptoms === true}
      />
      <ScreeningQuestion
        question="Do you have fever, chills, night sweats, or unexplained weight loss?"
        helpText="Systemic symptoms alongside a headache may warrant medical investigation."
        answered={responses.hasSystemicSymptoms}
        onAnswer={(v) => updateResponse('hasSystemicSymptoms', v)}
      />
      <ScreeningQuestion
        question="Do you have a stiff neck or any new rash?"
        helpText="Stiff neck with headache and fever can be a sign of meningitis — seek urgent care."
        answered={responses.hasStiffNeckOrRash}
        onAnswer={(v) => updateResponse('hasStiffNeckOrRash', v)}
        visible={responses.hasSystemicSymptoms === true}
      />
    </div>
  );
}
