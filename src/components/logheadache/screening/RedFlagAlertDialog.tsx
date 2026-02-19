import { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { RedFlagResult, PriorityLevel } from "@/hooks/useRedFlagScreening";

interface RedFlagAlertDialogProps {
  open: boolean;
  onClose: () => void;
  priority: PriorityLevel;
  message: { title: string; body: string };
  flags: RedFlagResult[];
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    iconClass: "text-destructive",
    badgeVariant: "destructive" as const,
    badgeLabel: "High Priority",
  },
  medium: {
    icon: AlertCircle,
    iconClass: "text-amber-400",
    badgeVariant: "secondary" as const,
    badgeLabel: "Medium Priority",
  },
  low: {
    icon: CheckCircle,
    iconClass: "text-green-400",
    badgeVariant: "outline" as const,
    badgeLabel: "Low Priority",
  },
};

export function RedFlagAlertDialog({ open, onClose, priority, message, flags }: RedFlagAlertDialogProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (!open || priority === 'low' || flags.length === 0) {
      setAiExplanation("");
      return;
    }

    const fetchExplanation = async () => {
      setLoadingAi(true);
      try {
        const { data, error } = await supabase.functions.invoke('red-flag-explanation', {
          body: { flags: flags.filter(f => f.priority !== 'low') },
        });
        if (!error && data?.explanation) {
          setAiExplanation(data.explanation);
        }
      } catch {
        // Silently fail — AI explanation is optional
      } finally {
        setLoadingAi(false);
      }
    };

    fetchExplanation();
  }, [open, priority, flags]);

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-card border-border max-h-[85vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <Icon className={`h-5 w-5 ${config.iconClass}`} />
            {message.title}
            <Badge variant={config.badgeVariant} className="ml-auto text-xs">
              {config.badgeLabel}
            </Badge>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-muted-foreground space-y-4">
              <p className="whitespace-pre-line">{message.body}</p>

              {flags.length > 0 && priority !== 'low' && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-medium text-foreground">Detected indicators:</p>
                  {flags.filter(f => f.priority !== 'low').map((flag) => (
                    <div
                      key={flag.criterion}
                      className="text-xs p-2 rounded-md bg-muted/50 border border-border"
                    >
                      <span className="font-medium text-foreground">{flag.label}</span>
                      <span className="block mt-0.5 text-muted-foreground">{flag.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {loadingAi && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating personalised guidance...
                </div>
              )}

              {aiExplanation && (
                <div className="text-sm p-3 rounded-md bg-primary/5 border border-primary/20 text-foreground">
                  {aiExplanation}
                </div>
              )}

              <p className="text-xs italic pt-1">
                This information is not a diagnosis and does not replace a medical evaluation.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90">
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
