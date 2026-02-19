import { useScreening } from "@/contexts/RedFlagScreeningContext";
import { ScreeningQuestion } from "./ScreeningQuestion";

/** Positional / precipitating screening — embedded in the Treatment step */
export function PositionalScreening() {
  const { responses, updateResponse } = useScreening();

  return (
    <div className="space-y-3">
      <ScreeningQuestion
        question="Does this headache worsen with lying down, standing up, coughing, or physical exertion?"
        helpText="Positional headaches can indicate changes in intracranial pressure."
        answered={responses.hasPositionalFactors}
        onAnswer={(v) => updateResponse('hasPositionalFactors', v)}
      />
      <ScreeningQuestion
        question="Have you been told you have papilledema (swelling behind the eye)?"
        helpText="Known papilledema with headache is an urgent finding requiring immediate evaluation."
        answered={responses.hasPapilledema}
        onAnswer={(v) => updateResponse('hasPapilledema', v)}
        visible={responses.hasPositionalFactors === true}
      />
    </div>
  );
}
