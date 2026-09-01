import { useScreening } from "@/contexts/RedFlagScreeningContext";
import { ScreeningQuestion } from "./ScreeningQuestion";

/** Onset screening questions — embedded in the Duration step */
export function OnsetScreening() {
  const { responses, updateResponse, isMissing } = useScreening();

  return (
    <div className="space-y-3">
      <ScreeningQuestion
        question="Did this headache reach peak intensity in under 1 minute?"
        helpText="Sudden-onset (thunderclap) headaches can indicate serious conditions requiring urgent assessment."
        answered={responses.onsetSudden}
        onAnswer={(v) => updateResponse('onsetSudden', v)}
        invalid={isMissing('onsetSudden')}
      />
      <ScreeningQuestion
        question='Would you describe this as the "worst headache of your life"?'
        helpText="This is a key clinical indicator used by healthcare professionals."
        answered={responses.worstHeadacheEver}
        onAnswer={(v) => updateResponse('worstHeadacheEver', v)}
        invalid={isMissing('worstHeadacheEver')}
        visible={responses.onsetSudden === true}
      />
    </div>
  );
}
