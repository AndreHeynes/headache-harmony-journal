import { useState } from "react";
import { AlertTriangle, ShieldAlert, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  needsDateOfBirth?: boolean;
  onSubmit: (episodeId: string, isFirstEver: boolean) => Promise<void>;
  onSaveDateOfBirth?: (dob: string) => Promise<void>;
  onSkipDateOfBirth?: () => void;
}

export function FirstHeadacheCheck({
  userAge,
  episodeId,
  needsDateOfBirth = false,
  onSubmit,
  onSaveDateOfBirth,
  onSkipDateOfBirth,
}: FirstHeadacheCheckProps) {
  const [answered, setAnswered] = useState(false);
  const [showAdvisory, setShowAdvisory] = useState(false);
  const [dob, setDob] = useState("");

  const handleAnswer = async (isFirstEver: boolean) => {
    if (!episodeId) return;
    await onSubmit(episodeId, isFirstEver);
    setAnswered(true);
    if (isFirstEver) {
      setShowAdvisory(true);
    }
  };

  if (needsDateOfBirth) {
    return (
      <Card className="bg-amber-500/10 border-amber-500/30 backdrop-blur-sm mb-4">
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-3 flex-1">
              <h3 className="text-sm font-semibold text-foreground">Add your date of birth</h3>
              <p className="text-sm text-muted-foreground">
                Your age is used to check for age-related clinical warning signs (SNOOP criteria). We only need this once.
              </p>
              <div className="space-y-1">
                <Label htmlFor="dob-screening" className="text-xs text-muted-foreground">
                  Date of birth
                </Label>
                <Input
                  id="dob-screening"
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDob(e.target.value)}
                  className="max-w-[220px]"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  disabled={!dob}
                  onClick={() => onSaveDateOfBirth?.(dob)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onSkipDateOfBirth?.()}>
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

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
                  You are {userAge} years old, so we need to ask about your lifetime headache history:{" "}
                  <strong>is this the very first headache you have ever had in your life?</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  This is about your whole life, not just what you have logged in this app. Answer "No" if you
                  have had headaches before, even if this is your first entry here.
                </p>
                <p className="text-xs text-muted-foreground">
                  A first-ever headache after age 50 is a recognised red flag (SNOOP criteria).
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-500/30 hover:bg-amber-500/20 text-foreground"
                    onClick={() => handleAnswer(true)}
                  >
                    Yes — first ever in my life
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
