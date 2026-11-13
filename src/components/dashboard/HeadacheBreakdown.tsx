import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAreaOrderData } from '@/lib/analysis';

type AreaCount = { key: string; name: string; count: number };

/** Counts selected areas in completed episodes; legacy areas remain visible. */
export function HeadacheBreakdown() {
  const { user } = useAuth();
  const [areas, setAreas] = useState<AreaCount[]>([]);
  useEffect(() => {
    if (!user) return;
    fetchAreaOrderData(user.id).then(({ areas }) => {
      const counts = new Map<string, AreaCount>();
      areas.filter(area => !area.deselected_at).forEach(area => {
        const key = area.location_key || area.location_name;
        const current = counts.get(key) || { key, name: area.location_name, count: 0 };
        current.count += 1;
        counts.set(key, current);
      });
      setAreas([...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 6));
    }).catch(() => setAreas([]));
  }, [user]);

  return (
    <Card id="headache-breakdown" className="bg-card border-border shadow-lg">
      <CardHeader><CardTitle className="text-foreground flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Headache breakdown</CardTitle></CardHeader>
      <CardContent>
        {areas.length ? <ul className="space-y-2">{areas.map(area => <li key={area.key} className="flex justify-between gap-4 text-sm"><span className="text-foreground">{area.name}</span><span className="text-muted-foreground whitespace-nowrap">{area.count} episode{area.count === 1 ? '' : 's'}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No selected areas in completed episodes yet.</p>}
        <p className="text-xs text-muted-foreground mt-4">Completed episodes only. Multi-area episodes contribute once to each selected area.</p>
      </CardContent>
    </Card>
  );
}
