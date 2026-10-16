import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import { fetchAnalysisData, AnalysisUnit, extractTreatmentNames, addOutcome, effectivenessRate, OutcomeCounts } from '@/lib/analysis';
import { format, parseISO, getMonth } from 'date-fns';

interface PainAreaEntry { name: string; value: number }
interface IntensityMonthEntry { date: string; mild: number; moderate: number; severe: number }
interface DurationMonthEntry { date: string; average: number; longest: number }
interface SymptomEntry { name: string; count: number }
interface TriggerEntry { name: string; count: number; correlationScore: number }
interface TreatmentEntry { name: string; effective: number; ineffective: number }
interface NeckPainWeek { date: string; avgIntensity: number; episodeCount: number }

export interface DetailedInsightsData {
  painAreaData: PainAreaEntry[];
  intensityData: IntensityMonthEntry[];
  durationData: DurationMonthEntry[];
  symptomData: SymptomEntry[];
  triggerData: TriggerEntry[];
  treatmentData: TreatmentEntry[];
  neckPainData: NeckPainWeek[];
  neckAssociatedPercent: number;
  neckWithTreatmentRate: number;
  neckWithoutTreatmentRate: number;
  topTriggerName: string | null;
  topTriggerScore: number;
  avgTriggerOnsetHours: number | null;
  avgReliefMinutes: number;
  bestTreatmentName: string | null;
  bestTreatmentRate: number;
  loading: boolean;
  hasData: boolean;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseTimingHours(raw: string): number | null {
  const m = raw.match(/\((\d+(?:\.\d+)?)h?\s*before\)/i);
  return m ? parseFloat(m[1]) : null;
}

export const useDetailedInsights = (dateRange?: { from: Date; to: Date }): DetailedInsightsData => {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<HeadacheEpisode[]>([]);
  const [units, setUnits] = useState<AnalysisUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      try {
        const r = await fetchAnalysisData(user.id, dateRange);
        setEpisodes(r.episodes);
        setUnits(r.units);
      } catch (e) {
        console.error('Error loading insights:', e);
      } finally { setLoading(false); }
    };
    fetch();
  }, [user, dateRange?.from, dateRange?.to]);

  return useMemo(() => {
    const empty: DetailedInsightsData = {
      painAreaData: [], intensityData: [], durationData: [], symptomData: [],
      triggerData: [], treatmentData: [], neckPainData: [],
      neckAssociatedPercent: 0, neckWithTreatmentRate: 0, neckWithoutTreatmentRate: 0,
      topTriggerName: null, topTriggerScore: 0, avgTriggerOnsetHours: null,
      avgReliefMinutes: 0, bestTreatmentName: null, bestTreatmentRate: 0,
      loading, hasData: false,
    };
    if (episodes.length === 0) return { ...empty, loading };

    const total = episodes.length;

    // --- Pain Area Distribution ---
    const locMap = new Map<string, number>();
    // Per-area rows when present; legacy episodes fall back to the pain_location text
    units.forEach(u => { if (u.location_name) locMap.set(u.location_name, (locMap.get(u.location_name) || 0) + 1); });
    const episodesWithAreas = new Set(units.filter(u => u.location_name).map(u => u.episodeId));
    episodes.forEach(ep => {
      if (episodesWithAreas.has(ep.id)) return;
      const loc = ep.pain_location;
      if (!loc) return;
      // Strip spread annotation e.g. "(remain)" 
      const clean = loc.replace(/\s*\([^)]*\)\s*$/, '');
      clean.split(',').map(s => s.trim()).filter(Boolean).forEach(name => {
        locMap.set(name, (locMap.get(name) || 0) + 1);
      });
    });
    const painAreaData = Array.from(locMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // --- Intensity by Month (mild 1-3, moderate 4-6, severe 7-10) ---
    const monthIntensity = new Map<string, { mild: number; moderate: number; severe: number }>();
    episodes.forEach(ep => {
      const month = MONTH_NAMES[getMonth(parseISO(ep.start_time))];
      const entry = monthIntensity.get(month) || { mild: 0, moderate: 0, severe: 0 };
      const p = ep.pain_intensity || 0;
      if (p <= 3) entry.mild++;
      else if (p <= 6) entry.moderate++;
      else entry.severe++;
      monthIntensity.set(month, entry);
    });
    const intensityData = Array.from(monthIntensity.entries()).map(([date, d]) => ({ date, ...d }));

    // --- Duration by Month ---
    const monthDuration = new Map<string, number[]>();
    episodes.forEach(ep => {
      if (!ep.duration_minutes) return;
      const month = MONTH_NAMES[getMonth(parseISO(ep.start_time))];
      const arr = monthDuration.get(month) || [];
      arr.push(ep.duration_minutes / 60); // hours
      monthDuration.set(month, arr);
    });
    const durationData = Array.from(monthDuration.entries()).map(([date, durations]) => ({
      date,
      average: Math.round((durations.reduce((s, v) => s + v, 0) / durations.length) * 10) / 10,
      longest: Math.round(Math.max(...durations) * 10) / 10,
    }));

    // --- Symptoms ---
    const symMap = new Map<string, number>();
    episodes.forEach(ep => {
      (ep.symptoms || []).forEach(raw => {
        const name = raw.replace(/\s*\([^)]*\)\s*$/, '').trim();
        if (name.startsWith('Pain:')) return;
        symMap.set(name, (symMap.get(name) || 0) + 1);
      });
    });
    const symptomData = Array.from(symMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // --- Triggers ---
    const trigMap = new Map<string, { eps: Set<string>; pains: number[]; hoursVals: number[] }>();
    const painUnits = units.filter(u => u.pain_intensity != null);
    const avgPain = painUnits.length ? painUnits.reduce((s, u) => s + (u.pain_intensity || 0), 0) / painUnits.length : 0;
    units.forEach(ep => {
      (ep.triggers || []).forEach(raw => {
        const name = raw.replace(/\s*\(\d+(?:\.\d+)?h?\s*before\)/i, '').replace(/\s*\[\d+\s*min\]/i, '').trim();
        const hours = parseTimingHours(raw);
        const e = trigMap.get(name) || { eps: new Set<string>(), pains: [], hoursVals: [] };
        e.eps.add(ep.episodeId);
        if (ep.pain_intensity != null) e.pains.push(ep.pain_intensity);
        if (hours !== null) e.hoursVals.push(hours);
        trigMap.set(name, e);
      });
    });
    const triggerData = Array.from(trigMap.entries())
      .map(([name, d]) => {
        const avgP = d.pains.length > 0 ? d.pains.reduce((a, b) => a + b, 0) / d.pains.length : 0;
        return { name, count: d.eps.size, correlationScore: avgPain > 0 ? Math.round((avgP / avgPain) * 100) / 100 : 1 };
      })
      .sort((a, b) => b.correlationScore - a.correlationScore)
      .slice(0, 8);

    // Avg hours before onset
    const allHours: number[] = [];
    trigMap.forEach(d => allHours.push(...d.hoursVals));
    const avgTriggerOnsetHours = allHours.length > 0
      ? Math.round((allHours.reduce((s, v) => s + v, 0) / allHours.length) * 10) / 10
      : null;

    // Top trigger
    const topTriggerName = triggerData.length > 0 ? triggerData[0].name : null;
    const topTriggerScore = triggerData.length > 0 ? triggerData[0].correlationScore : 0;

    // --- Treatment ---
    // Per-area treatment ratings; uses with no recorded outcome are excluded from the rate
    const txMap = new Map<string, OutcomeCounts>();
    units.forEach(u => {
      extractTreatmentNames(u.treatment).forEach(name => {
        const c = txMap.get(name) || { effective: 0, partial: 0, notEffective: 0 };
        addOutcome(c, u.treatment_outcome);
        txMap.set(name, c);
      });
    });
    const treatmentData = Array.from(txMap.entries())
      .map(([name, c]) => ({ name, rate: effectivenessRate(c) }))
      .filter((x): x is { name: string; rate: number } => x.rate !== null)
      .map(({ name, rate }) => ({ name, effective: rate, ineffective: 100 - rate }))
      .sort((a, b) => b.effective - a.effective)
      .slice(0, 6);

    const avgReliefMinutes = episodes.filter(e => e.duration_minutes).length > 0
      ? Math.round(episodes.filter(e => e.duration_minutes).reduce((s, e) => s + (e.duration_minutes || 0), 0) / episodes.filter(e => e.duration_minutes).length)
      : 0;

    const bestTreatmentName = treatmentData.length > 0 ? treatmentData[0].name : null;
    const bestTreatmentRate = treatmentData.length > 0 ? treatmentData[0].effective : 0;

    // --- Neck Pain ---
    const neckKeywords = ['neck', 'cervical', 'occipital', 'back of head'];
    const isNeck = (loc: string) => neckKeywords.some(k => loc.toLowerCase().includes(k));
    const neckEpisodes = episodes.filter(ep => ep.pain_location && isNeck(ep.pain_location));
    const nonNeckEpisodes = episodes.filter(ep => !ep.pain_location || !isNeck(ep.pain_location));
    const neckAssociatedPercent = total > 0 ? Math.round((neckEpisodes.length / total) * 100) : 0;

    // Neck vs non-neck treatment effectiveness
    const neckIds = new Set(neckEpisodes.map(e => e.id));
    const calcRate = (us: AnalysisUnit[]) => {
      const c: OutcomeCounts = { effective: 0, partial: 0, notEffective: 0 };
      us.forEach(u => addOutcome(c, u.treatment_outcome));
      return effectivenessRate(c) ?? 0;
    };
    const neckWithTreatmentRate = calcRate(units.filter(u => neckIds.has(u.episodeId)));
    const neckWithoutTreatmentRate = calcRate(units.filter(u => !neckIds.has(u.episodeId)));

    // Neck pain over time (weekly bins)
    const neckByWeek = new Map<string, { totalIntensity: number; count: number }>();
    neckEpisodes.forEach(ep => {
      const weekLabel = `Week of ${format(parseISO(ep.start_time), 'MMM d')}`;
      const entry = neckByWeek.get(weekLabel) || { totalIntensity: 0, count: 0 };
      entry.totalIntensity += ep.pain_intensity || 0;
      entry.count++;
      neckByWeek.set(weekLabel, entry);
    });
    const neckPainData = Array.from(neckByWeek.entries()).map(([date, d]) => ({
      date,
      avgIntensity: Math.round((d.totalIntensity / d.count) * 10) / 10,
      episodeCount: d.count,
    }));

    return {
      painAreaData, intensityData, durationData, symptomData, triggerData, treatmentData,
      neckPainData, neckAssociatedPercent, neckWithTreatmentRate, neckWithoutTreatmentRate,
      topTriggerName, topTriggerScore, avgTriggerOnsetHours,
      avgReliefMinutes, bestTreatmentName, bestTreatmentRate,
      loading, hasData: true,
    };
  }, [episodes, units, loading]);
};
