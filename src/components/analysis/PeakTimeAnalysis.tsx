import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ANALYSIS_EPISODE_STATUS } from '@/lib/analysis';

const PERIODS = ['Morning', 'Afternoon', 'Evening', 'Night'] as const;
type Period = typeof PERIODS[number];

export function periodForStart(value: string): Period {
  const hour = new Date(value).getHours();
  return hour >= 5 && hour < 12 ? 'Morning' : hour >= 12 && hour < 17 ? 'Afternoon' : hour >= 17 && hour < 22 ? 'Evening' : 'Night';
}

/** Start-time distribution for completed episodes; descriptive only. */
export function PeakTimeAnalysis() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<Period, number> | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('headache_episodes').select('start_time').eq('user_id', user.id).eq('status', ANALYSIS_EPISODE_STATUS)
      .then(({ data, error }) => {
        if (error) return;
        const next: Record<Period, number> = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        (data || []).forEach(row => { next[periodForStart(row.start_time)] += 1; });
        setCounts(next);
      });
  }, [user]);

  if (!counts) return null;
  const total = PERIODS.reduce((sum, period) => sum + counts[period], 0);
  const peak = Math.max(...PERIODS.map(period => counts[period]));
  return (
    <section id="peak-time-analysis" className="mb-6">
      <div className="flex items-center gap-2 mb-4"><Clock className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Peak headache times</h2></div>
      <Card className="bg-card/50 border-border"><CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{PERIODS.map(period => <div key={period} className={counts[period] === peak && peak > 0 ? 'rounded bg-primary/10 border border-primary/30 p-3' : 'rounded bg-muted/30 p-3'}><p className="text-sm text-muted-foreground">{period}</p><p className="text-xl font-semibold text-foreground">{counts[period]}</p><p className="text-xs text-muted-foreground">{total ? Math.round(counts[period] / total * 100) : 0}%</p></div>)}</div>
        <p className="text-xs text-muted-foreground mt-3">Recorded start times for {total} completed episodes. Descriptive only; not a causal finding.</p>
      </CardContent></Card>
    </section>
  );
}
