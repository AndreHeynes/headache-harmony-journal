import { Info } from "lucide-react";
import { EPISODE_RULE_TEXT } from "@/lib/analysis";

export function EpisodeRuleNote({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-xs text-muted-foreground ${className}`}>
      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" aria-hidden />
      <span>{EPISODE_RULE_TEXT}</span>
    </p>
  );
}
