import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, CheckCircle, ShieldAlert, Loader2 } from "lucide-react";
import { useRedFlagHistory } from "@/hooks/useRedFlagHistory";
import { format } from "date-fns";

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    label: 'High',
    badgeClass: 'bg-destructive/15 text-destructive border-destructive/30',
    iconClass: 'text-destructive',
  },
  medium: {
    icon: AlertCircle,
    label: 'Medium',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    iconClass: 'text-amber-400',
  },
  low: {
    icon: CheckCircle,
    label: 'Low',
    badgeClass: 'bg-green-500/15 text-green-400 border-green-500/30',
    iconClass: 'text-green-400',
  },
};

export function RedFlagHistory() {
  const { records, loading, hasFlags, highCount, mediumCount } = useRedFlagHistory();

  if (loading) {
    return (
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!hasFlags) return null;

  return (
    <section className="mb-6">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center gap-2 text-base">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Red Flag Screening History
            {highCount > 0 && (
              <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30 ml-auto">
                {highCount} High
              </Badge>
            )}
            {mediumCount > 0 && (
              <Badge variant="outline" className="bg-amber-500/15 text-amber-400 border-amber-500/30 ml-auto">
                {mediumCount} Medium
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {records.slice(0, 10).map((record) => {
            const config = priorityConfig[record.priorityLevel as keyof typeof priorityConfig] || priorityConfig.low;
            const Icon = config.icon;

            return (
              <div
                key={record.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.iconClass}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {format(new Date(record.date), 'PPP')}
                    </span>
                    <Badge variant="outline" className={`text-xs ${config.badgeClass}`}>
                      {config.label} Priority
                    </Badge>
                  </div>
                  <ul className="space-y-0.5">
                    {record.flags.map((flag, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        • {flag.label}: {flag.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          {records.length > 10 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              Showing 10 of {records.length} flagged entries
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
