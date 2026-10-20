import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ListOrdered } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAreaOrderData, firstAreaCounts, orderRankStats, spreadTiming } from '@/lib/analysis';

type Data = {
  first: ReturnType<typeof firstAreaCounts>;
  ranks: ReturnType<typeof orderRankStats>;
  spread: ReturnType<typeof spreadTiming>;
};

export function AreaOrderAnalysis() {
  const { user } = useAuth();
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchAreaOrderData(user.id)
      .then(({ episodes, areas }) =>
        setData({ first: firstAreaCounts(episodes, areas), ranks: orderRankStats(episodes, areas), spread: spreadTiming(episodes, areas) })
      )
      .catch((e) => console.error('Area order analysis failed', e));
  }, [user]);

  if (!data) return null;
  const { first, ranks, spread } = data;

  return (
    <Card className="bg-card border-border p-4 mb-6 space-y-5">
      <div className="flex items-center gap-2">
        <ListOrdered className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium text-foreground">Area order</h2>
      </div>

      <section>
        <h3 className="text-sm font-medium text-foreground mb-2">First area</h3>
        {first.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No completed episodes with areas yet.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {first.rows.map((r) => (
              <li key={r.key} className="flex justify-between text-muted-foreground">
                <span className="text-foreground">{r.name}</span>
                <span>
                  {r.count} episode{r.count === 1 ? '' : 's'}
                  {first.showPercent && ` (${Math.round((r.count / first.total) * 100)}%)`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-foreground mb-2">By order</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {ranks.map((r) => (
            <div key={r.rank} className="rounded-md border border-border p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">{r.rank === 'later' ? '3rd and later' : `${r.rank} area`}</span>
                <span className="text-muted-foreground">{r.count}</span>
              </div>
              {r.count === 0 ? (
                <p className="text-muted-foreground">No data</p>
              ) : (
                <>
                  {r.smallSample && <p className="text-xs text-primary">Small sample</p>}
                  <p className="text-muted-foreground">Typical pain: {r.medianIntensity ?? '—'}</p>
                  <p className="text-muted-foreground">
                    Triggers: {r.topTriggers.length ? r.topTriggers.map((t) => `${t.name} (${t.count})`).join(', ') : '—'}
                  </p>
                  <p className="text-muted-foreground">
                    Outcome: {r.outcomes.effective} effective, {r.outcomes.partial} partial, {r.outcomes.notEffective} not effective
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-foreground mb-2">Spread timing (1st to 2nd area)</h3>
        {spread.episodes === 0 ? (
          <p className="text-sm text-muted-foreground">No episodes with a second area yet.</p>
        ) : spread.smallSample ? (
          <p className="text-sm text-muted-foreground">
            {spread.episodes} episode{spread.episodes === 1 ? '' : 's'} (small sample): {spread.gaps.map((g) => `${g} min`).join(', ')}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Typical gap {spread.medianMinutes} min (range {spread.minMinutes}–{spread.maxMinutes} min) across {spread.episodes} episodes
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">Based on when each area was logged, not when the pain started.</p>
      </section>
    </Card>
  );
}
