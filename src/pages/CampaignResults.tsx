import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { summarizeCampaigns, type CampaignRow } from '@/lib/campaignTracking';

export default function CampaignResults() {
  const { user } = useAuth();
  const [rows, setRows] = useState<CampaignRow[] | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      setAllowed(!!isAdmin);
      if (!isAdmin) return;
      const { data } = await supabase.from('campaign_events').select('event_type, utm_source, utm_campaign').limit(10000);
      setRows(summarizeCampaigns(data ?? []));
    })();
  }, [user]);

  if (allowed === false) return <div className="container mx-auto p-6">This page is only available to the Journal owner.</div>;
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-2">Post results</h1>
      <p className="text-muted-foreground mb-6">Counts visitors who arrived through a tagged post link. Each step counts once per browser tab. No names, emails or health details are stored.</p>
      {!rows ? <p>Loading…</p> : rows.length === 0 ? <p>No tagged visits yet.</p> : (
        <div className="overflow-x-auto glass rounded-lg">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b border-border">{['Platform', 'Campaign', 'Visits', 'Maps painted', 'Samples downloaded', 'Accounts created'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
            <tbody>{rows.map(r => (
              <tr key={r.source + r.campaign} className="border-b border-border/50">
                <td className="p-3">{r.source}</td><td className="p-3">{r.campaign}</td><td className="p-3">{r.visit}</td>
                <td className="p-3">{r.map_painted}</td><td className="p-3">{r.sample_downloaded}</td><td className="p-3 text-primary font-medium">{r.signup}</td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
