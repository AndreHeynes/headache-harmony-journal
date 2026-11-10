import { supabase } from '@/integrations/supabase/client';

export type CampaignStep = 'visit' | 'map_painted' | 'sample_downloaded' | 'signup';
export interface Campaign { source: string; medium: string | null; campaign: string | null; page: string; session: string }

const KEY = 'journal-campaign-v1';
const clean = (v: string | null, max = 60) => {
  const s = (v ?? '').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, max);
  return s || null;
};

/** Reads campaign tags from a URL. Returns null when there is no utm_source. Only tag values are kept. */
export function parseCampaign(search: string, path: string, session: string): Campaign | null {
  const q = new URLSearchParams(search);
  const source = clean(q.get('utm_source'));
  if (!source) return null;
  return { source, medium: clean(q.get('utm_medium')), campaign: clean(q.get('utm_campaign')), page: path.slice(0, 100), session };
}

export function readCampaign(): Campaign | null {
  try { const raw = sessionStorage.getItem(KEY); return raw ? JSON.parse(raw) as Campaign : null; } catch { return null; }
}

/** Call on app load. Stores tags for this tab only and records one visit. */
export function captureCampaign() {
  try {
    const found = parseCampaign(window.location.search, window.location.pathname, crypto.randomUUID());
    if (!found || readCampaign()) return;
    sessionStorage.setItem(KEY, JSON.stringify(found));
    void trackCampaignStep('visit');
  } catch { /* tracking must never break the app */ }
}

/** Records a step once per tab, only for visitors who arrived via a tagged link. No user or health data. */
export async function trackCampaignStep(step: CampaignStep) {
  const c = readCampaign();
  if (!c) return;
  try {
    await supabase.from('campaign_events').insert({
      event_type: step, utm_source: c.source, utm_medium: c.medium, utm_campaign: c.campaign, page: c.page, session_id: c.session,
    });
  } catch { /* ignore */ }
}

export interface CampaignRow { source: string; campaign: string; visit: number; map_painted: number; sample_downloaded: number; signup: number }

export function summarizeCampaigns(events: { event_type: string; utm_source: string; utm_campaign: string | null }[]): CampaignRow[] {
  const rows = new Map<string, CampaignRow>();
  for (const e of events) {
    const k = `${e.utm_source}|${e.utm_campaign ?? '—'}`;
    const r = rows.get(k) ?? { source: e.utm_source, campaign: e.utm_campaign ?? '—', visit: 0, map_painted: 0, sample_downloaded: 0, signup: 0 };
    if (e.event_type in r) (r as unknown as Record<string, number>)[e.event_type]++;
    rows.set(k, r);
  }
  return [...rows.values()].sort((a, b) => b.visit - a.visit);
}
