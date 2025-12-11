import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Hourglass, BarChart2, AlertTriangle, Loader2 } from "lucide-react";
import { useAnalysisStats } from "@/hooks/useAnalysisStats";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgClass: string;
  iconClass: string;
}

const StatItem = ({ icon, value, label, bgClass, iconClass }: StatItemProps) => (
  <Card className={`${bgClass} border-border/30`}>
    <CardContent className="p-4">
      <div className={`${iconClass} mb-1`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

interface OverviewStatsProps {
  daysRange?: number;
}

export function OverviewStats({ daysRange = 30 }: OverviewStatsProps) {
  const { stats, loading, hasData } = useAnalysisStats(daysRange);

  if (loading) {
    return (
      <section className="grid grid-cols-2 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-muted/20 border-border/30">
            <CardContent className="p-4 flex items-center justify-center h-24">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  return (
    <section className="mb-6">
      {!hasData && (
        <p className="text-sm text-muted-foreground mb-3">
          No data in the last {daysRange} days. Stats will appear as you log episodes.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon={<Clock className="h-5 w-5" />}
          value={stats.totalEpisodes}
          label={`Episodes (${daysRange}d)`}
          bgClass="bg-primary/10"
          iconClass="text-primary"
        />
        <StatItem
          icon={<Hourglass className="h-5 w-5" />}
          value={stats.avgDuration}
          label="Avg Duration"
          bgClass="bg-purple-500/10"
          iconClass="text-purple-400"
        />
        <StatItem
          icon={<BarChart2 className="h-5 w-5" />}
          value={`${stats.dailyFrequency}x`}
          label="Daily Freq."
          bgClass="bg-blue-500/10"
          iconClass="text-blue-400"
        />
        <StatItem
          icon={<AlertTriangle className="h-5 w-5" />}
          value={stats.topTriggersCount}
          label="Unique Triggers"
          bgClass="bg-teal-500/10"
          iconClass="text-teal-400"
        />
      </div>
    </section>
  );
}
