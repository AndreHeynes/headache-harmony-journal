
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Hourglass, BarChart2, AlertTriangle } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgClass: string;
  iconClass: string;
}

const StatItem = ({ icon, value, label, bgClass, iconClass }: StatItemProps) => (
  <Card className={`${bgClass} border-white/10`}>
    <CardContent className="p-4">
      <div className={`${iconClass} mb-1`}>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </CardContent>
  </Card>
);

interface OverviewStatsProps {
  episodes: number;
  avgDuration: string;
  dailyFrequency: number;
  topTriggers: number;
}

export function OverviewStats({ 
  episodes, 
  avgDuration, 
  dailyFrequency,
  topTriggers 
}: OverviewStatsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 mb-6">
      <StatItem
        icon={<Clock className="h-5 w-5" />}
        value={episodes}
        label="Episodes"
        bgClass="bg-indigo-900/20 border-indigo-800/30"
        iconClass="text-indigo-400"
      />
      <StatItem
        icon={<Hourglass className="h-5 w-5" />}
        value={avgDuration}
        label="Avg Duration"
        bgClass="bg-purple-900/20 border-purple-800/30"
        iconClass="text-purple-400"
      />
      <StatItem
        icon={<BarChart2 className="h-5 w-5" />}
        value={`${dailyFrequency}x`}
        label="Daily Freq."
        bgClass="bg-blue-900/20 border-blue-800/30"
        iconClass="text-blue-400"
      />
      <StatItem
        icon={<AlertTriangle className="h-5 w-5" />}
        value={topTriggers}
        label="Top Triggers"
        bgClass="bg-teal-900/20 border-teal-800/30"
        iconClass="text-teal-400"
      />
    </section>
  );
}
