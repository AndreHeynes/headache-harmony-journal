import { supabase } from '@/integrations/supabase/client';
import type { HeadacheEpisode } from '@/types/episode';

/**
 * One rule for every statistics screen (Dashboard stats, Analysis, Export, AI report):
 * only episodes the user has finished logging (status = 'completed') are counted.
 * Active (in-progress) episodes are shown as "in progress" but never counted.
 */
export const ANALYSIS_EPISODE_STATUS = 'completed' as const;
export const EPISODE_RULE_TEXT =
  'Statistics include completed episodes only. An episode you are still logging (in progress) is not counted until you finish the last step of the log.';

export interface AreaRow {
  id: string;
  episode_id: string;
  location_name: string;
  location_key: string | null;
  deselected_at: string | null;
  is_origin: boolean;
  pain_intensity: number | null;
  symptoms: string[] | null;
  triggers: string[] | null;
  treatment: any;
  treatment_timing: string | null;
  relief_timing: string | null;
  treatment_outcome: string | null;
}

/** One analysable unit: a single area of an episode, or the whole episode when it has one area. */
export interface AnalysisUnit {
  episodeId: string;
  start_time: string;
  duration_minutes: number | null;
  pain_intensity: number | null;
  triggers: string[];
  symptoms: string[];
  treatment: any;
  treatment_outcome: string | null;
  treatment_timing: string | null;
  relief_timing: string | null;
  location_name: string | null;
  location_key: string | null;
}

const nonEmpty = <T,>(a: T[] | null | undefined): a is T[] => Array.isArray(a) && a.length > 0;
const hasTreatment = (t: any) => t && (typeof t !== 'object' || Object.keys(t).length > 0);

/**
 * Expand episodes into per-area units. Multi-area episodes produce one unit per selected area,
 * using the area's own triggers/intensity/treatment and falling back to the episode value when
 * the area field is blank. Single-area (or legacy, no-area) episodes produce one unit from the
 * episode, falling back to the area row for any blank field.
 */
export function buildAnalysisUnits(episodes: HeadacheEpisode[], areas: AreaRow[]): AnalysisUnit[] {
  const byEpisode = new Map<string, AreaRow[]>();
  areas.forEach(a => {
    if (a.deselected_at) return;
    const list = byEpisode.get(a.episode_id) || [];
    list.push(a);
    byEpisode.set(a.episode_id, list);
  });

  const units: AnalysisUnit[] = [];
  episodes.forEach(ep => {
    const locs = byEpisode.get(ep.id) || [];
    const base = { episodeId: ep.id, start_time: ep.start_time, duration_minutes: ep.duration_minutes ?? null };

    if (locs.length <= 1) {
      const l = locs[0];
      units.push({
        ...base,
        pain_intensity: ep.pain_intensity ?? l?.pain_intensity ?? null,
        triggers: nonEmpty(ep.triggers) ? ep.triggers : l?.triggers ?? [],
        symptoms: nonEmpty(ep.symptoms) ? ep.symptoms : l?.symptoms ?? [],
        treatment: hasTreatment(ep.treatment) ? ep.treatment : l?.treatment ?? null,
        treatment_outcome: ep.treatment_outcome || l?.treatment_outcome || ep.treatment?.treatment_outcome || null,
        treatment_timing: ep.treatment_timing || l?.treatment_timing || null,
        relief_timing: ep.relief_timing || l?.relief_timing || null,
        location_name: l?.location_name ?? null,
        location_key: l?.location_key ?? null,
      });
      return;
    }

    locs.forEach(l => {
      units.push({
        ...base,
        pain_intensity: l.pain_intensity ?? ep.pain_intensity ?? null,
        triggers: nonEmpty(l.triggers) ? l.triggers : ep.triggers ?? [],
        symptoms: nonEmpty(l.symptoms) ? l.symptoms : ep.symptoms ?? [],
        treatment: hasTreatment(l.treatment) ? l.treatment : ep.treatment ?? null,
        treatment_outcome: l.treatment_outcome || l.treatment?.treatment_outcome || ep.treatment_outcome || null,
        treatment_timing: l.treatment_timing || ep.treatment_timing || null,
        relief_timing: l.relief_timing || ep.relief_timing || null,
        location_name: l.location_name,
        location_key: l.location_key,
      });
    });
  });
  return units;
}

/** Medication / treatment names from any stored treatment shape. */
export function extractTreatmentNames(t: any): string[] {
  if (!t) return [];
  const names: string[] = [];
  if (Array.isArray(t)) names.push(...t.filter((x: any) => typeof x === 'string'));
  else if (typeof t === 'object') {
    if (t.medications) {
      const meds = Array.isArray(t.medications) ? t.medications : [t.medications];
      meds.forEach((m: any) => {
        const n = typeof m === 'string' ? m : m?.name;
        if (n) names.push(n);
      });
    }
    if (Array.isArray(t.otherTreatments)) names.push(...t.otherTreatments.filter((x: any) => typeof x === 'string'));
    if (names.length === 0 && typeof t.type === 'string' && t.type) names.push(t.type);
  }
  return Array.from(new Set(names.map(n => n.trim()).filter(Boolean)));
}

export interface OutcomeCounts { effective: number; partial: number; notEffective: number }

export function addOutcome(c: OutcomeCounts, outcome: string | null | undefined) {
  if (outcome === 'effective') c.effective++;
  else if (outcome === 'partially_effective') c.partial++;
  else if (outcome === 'not_effective' || outcome === 'worsened') c.notEffective++;
  // blank / unknown outcomes are not counted
}

/** (effective + 0.5 × partial) ÷ rated uses × 100. Blank outcomes are excluded; null when nothing rated. */
export function effectivenessRate(c: OutcomeCounts): number | null {
  const rated = c.effective + c.partial + c.notEffective;
  if (rated === 0) return null;
  return Math.round(((c.effective + 0.5 * c.partial) / rated) * 100);
}

/** Fetch completed episodes in range plus their selected areas, expanded into analysis units. */
export async function fetchAnalysisData(userId: string, range?: { from?: Date; to?: Date }) {
  let q = supabase
    .from('headache_episodes')
    .select('*')
    .eq('user_id', userId)
    .eq('status', ANALYSIS_EPISODE_STATUS)
    .order('start_time', { ascending: true });
  if (range?.from) q = q.gte('start_time', range.from.toISOString());
  if (range?.to) q = q.lte('start_time', range.to.toISOString());
  const { data, error } = await q;
  if (error) throw error;
  const episodes = (data as HeadacheEpisode[]) || [];

  let areas: AreaRow[] = [];
  if (episodes.length > 0) {
    const { data: locData, error: locError } = await supabase
      .from('episode_locations')
      .select('*')
      .eq('user_id', userId)
      .is('deselected_at', null)
      .in('episode_id', episodes.map(e => e.id));
    if (locError) throw locError;
    areas = (locData as AreaRow[]) || [];
  }
  return { episodes, areas, units: buildAnalysisUnits(episodes, areas) };
}
