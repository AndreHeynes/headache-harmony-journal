import { useScreening } from "@/contexts/RedFlagScreeningContext";
import { ScreeningQuestion } from "./ScreeningQuestion";

/** Pattern change screening — embedded in the Triggers step */
export function PatternScreening() {
  const { responses, updateResponse } = useScreening();

  return (
    <div className="space-y-3">
      <ScreeningQuestion
        question="Is this headache different from your usual headaches in location, severity, or type of pain?"
        helpText="Changes in your typical headache pattern can be clinically significant."
        answered={responses.hasPatternChange}
        onAnswer={(v) => updateResponse('hasPatternChange', v)}
      />
      <ScreeningQuestion
        question="Has this new pattern been progressively worsening over days or weeks?"
        helpText="Progressive worsening suggests a pattern that should be evaluated by a healthcare provider."
        answered={responses.isWorsening}
        onAnswer={(v) => updateResponse('isWorsening', v)}
        visible={responses.hasPatternChange === true}
      />
    </div>
  );
}
