import { useState } from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface FirstHeadacheCheckProps {
  userAge: number | null;
  episodeId: string | null;
  onSubmit: (episodeId: string, isFirstEver: boolean) => Promise<void>;
}

export function FirstHeadacheCheck({ userAge, episodeId, onSubmit }: FirstHeadacheCheckProps) {
  const [answered, setAnswered] = useState(false);
  const [showAdvisory, setShowAdvisory] = useState(false);

  const handleAnswer = async (isFirstEver: boolean) => {
    if (!episodeId) return;
    await onSubmit(episodeId, isFirstEver);
    setAnswered(true);
    if (isFirstEver) {
      setShowAdvisory(true);
    }
  };

  if (answered && !showAdvisory) return null;

  return (
    <>
      {!answered && (
        <Card className="bg-amber-500/10 border-amber-500/30 backdrop-blur-sm mb-4">
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Important Clinical Question
                </h3>
                <p className="text-sm text-muted-foreground">
                  As you are {userAge} years old, we need to ask: is this the <strong>first headache you have ever experienced</strong> in your lifetime?
                </p>
                <p className="text-xs text-muted-foreground">
                  This helps identify potential red flags that may require medical attention (SNOOP criteria).
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-500/30 hover:bg-amber-500/20 text-foreground"
                    onClick={() => handleAnswer(true)}
                  >
                    Yes, this is my first ever
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:bg-muted text-foreground"
                    onClick={() => handleAnswer(false)}
                  >
                    No, I've had headaches before
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <AlertDialog open={showAdvisory} onOpenChange={setShowAdvisory}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Medical Advisory
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground space-y-2">
              <p>
                A first-time headache onset after the age of 50 is considered a clinical red flag under the SNOOP mnemonic used by healthcare professionals.
              </p>
              <p>
                We <strong className="text-foreground">strongly recommend</strong> you consult a healthcare professional for a thorough evaluation, as new-onset headaches at this age may warrant further investigation.
              </p>
              <p className="text-xs">
                This flag has been recorded in your data and will be included in any clinical exports you generate.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90">
              I understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
