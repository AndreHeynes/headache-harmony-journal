import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScreeningQuestionProps {
  question: string;
  helpText?: string;
  answered: boolean | undefined;
  onAnswer: (value: boolean) => void;
  /** Only show this question when condition is true (default: true) */
  visible?: boolean;
}

export function ScreeningQuestion({ question, helpText, answered, onAnswer, visible = true }: ScreeningQuestionProps) {
  if (!visible) return null;

  return (
    <Card className="bg-amber-500/10 border-amber-500/30 backdrop-blur-sm">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-foreground">{question}</p>
            {helpText && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant={answered === true ? "default" : "outline"}
                className={answered === true 
                  ? "bg-amber-500 hover:bg-amber-600 text-white" 
                  : "border-amber-500/30 hover:bg-amber-500/20 text-foreground"}
                onClick={() => onAnswer(true)}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant={answered === false ? "default" : "outline"}
                className={answered === false 
                  ? "bg-muted text-foreground" 
                  : "border-border hover:bg-muted text-foreground"}
                onClick={() => onAnswer(false)}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
