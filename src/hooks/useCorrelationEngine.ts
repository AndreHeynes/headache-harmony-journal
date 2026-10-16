import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import { fetchAnalysisData, AnalysisUnit, extractTreatmentNames, addOutcome, effectivenessRate } from '@/lib/analysis';

interface TriggerCorrelation {
  trigger: string;
  occurrences: number;
  avgPainIntensity: number;
  avgDuration: number;
  avgHoursBeforeOnset: number | null;
  correlationScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface TreatmentEffectiveness {
  treatment: string;
  usageCount: number;
  avgReliefTime: number;
  /** null when no use has a recorded outcome */
  effectivenessRate: number | null;
  avgPainReduction: number;
  outcomeBreakdown: { effective: number; partial: number; notEffective: number };
}

interface SymptomPattern {
  symptom: string;
  frequency: number;
  percentageOfEpisodes: number;
  avgAssociatedPain: number;
  timingBreakdown: { before: number; during: number; after: number; unspecified: number };
}

interface CorrelationData {
  triggerCorrelations: TriggerCorrelation[];
  treatmentEffectiveness: TreatmentEffectiveness[];
  symptomPatterns: SymptomPattern[];
  painTriggerHeatmap: Array<{ x: number; y: number; z: number; name: string }>;
  durationTreatmentHeatmap: Array<{ x: number; y: number; z: number; name: string }>;
  totalEpisodes: number;
  dataStartDate: string | null;
  dataEndDate: string | null;
}

// Parse symptom string like "Nausea (During headache)" into name and timing
function parseSymptomString(raw: string): { name: string; timing: string | null } {
  const match = raw.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (match) {
    const timing = match[2].trim();
    // Only extract timing if it's one of the known timing values
    if (['Before headache', 'During headache', 'After headache started'].includes(timing)) {
      return { name: match[1].trim(), timing };
    }
  }
  return { name: raw, timing: null };
}

// Parse trigger string like "Food: Cheese (3h before)" into name and hours
function parseTriggerString(raw: string): { name: string; category: string | null; hoursBefore: number | null } {
  // Match patterns like "Food: Cheese (3h before)" or "Activity: Running (2h before) [30 min]"
  const categoryMatch = raw.match(/^(Food|Beverage|Activity|Stress|Weather|Cycle Phase):\s*(.+)$/);
  
  let category: string | null = null;
  let rest = raw;
  
  if (categoryMatch) {
    category = categoryMatch[1];
    rest = categoryMatch[2];
  }
  
  // Extract hours before
  const hoursMatch = rest.match(/\((\d+(?:\.\d+)?)h?\s*before\)/i);
  const hoursBefore = hoursMatch ? parseFloat(hoursMatch[1]) : null;
  
  // Clean the name by removing the timing and duration annotations
  let name = rest
    .replace(/\s*\(\d+(?:\.\d+)?h?\s*before\)/i, '')
    .replace(/\s*\[\d+\s*min\]/i, '')
    .trim();
  
  // Prepend category back for display
  if (category) {
    name = `${category}: ${name}`;
  }
  
  return { name, category, hoursBefore };
}

export const useCorrelationEngine = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<HeadacheEpisode[]>([]);
  const [units, setUnits] = useState<AnalysisUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      try {
        const { episodes: eps, units: u } = await fetchAnalysisData(user.id, dateRange);
        setEpisodes(eps);
        setUnits(u);
      } catch (err) {
        console.error('Error fetching episodes for correlation:', err);
        setError('Failed to load correlation data');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [user, dateRange?.from, dateRange?.to]);

  const correlationData = useMemo<CorrelationData>(() => {
    if (episodes.length === 0) {
      return {
        triggerCorrelations: [],
        treatmentEffectiveness: [],
        symptomPatterns: [],
        painTriggerHeatmap: [],
        durationTreatmentHeatmap: [],
        totalEpisodes: 0,
        dataStartDate: null,
        dataEndDate: null,
      };
    }

    const totalEpisodes = episodes.length;
    const dataStartDate = episodes[0]?.start_time || null;
    const dataEndDate = episodes[episodes.length - 1]?.start_time || null;

    const painUnits = units.filter(u => u.pain_intensity != null);
    const avgPain = painUnits.length > 0 ? painUnits.reduce((sum, u) => sum + (u.pain_intensity || 0), 0) / painUnits.length : 0;

    // --- Trigger Correlations (with temporal parsing) ---
    // Occurrences = distinct episodes; pain is taken from each area that reported the trigger.
    const triggerMap = new Map<string, { 
      episodes: Set<string>;
      pains: number[];
      durations: Map<string, number>;
      hoursBeforeValues: number[];
    }>();

    units.forEach(ep => {
      (ep.triggers || []).forEach(rawTrigger => {
        const parsed = parseTriggerString(rawTrigger);
        const existing = triggerMap.get(parsed.name) || { 
          episodes: new Set<string>(), pains: [], durations: new Map<string, number>(), hoursBeforeValues: []
        };
        existing.episodes.add(ep.episodeId);
        if (ep.pain_intensity != null) existing.pains.push(ep.pain_intensity);
        if (ep.duration_minutes != null) existing.durations.set(ep.episodeId, ep.duration_minutes);
        if (parsed.hoursBefore !== null) {
          existing.hoursBeforeValues.push(parsed.hoursBefore);
        }
        triggerMap.set(parsed.name, existing);
      });
    });

    const triggerCorrelations: TriggerCorrelation[] = Array.from(triggerMap.entries())
      .map(([trigger, data]): TriggerCorrelation => {
        const avgPainIntensity = data.pains.length > 0 ? data.pains.reduce((a, b) => a + b, 0) / data.pains.length : 0;
        const durs = Array.from(data.durations.values());
        const avgDuration = durs.length > 0 ? durs.reduce((a, b) => a + b, 0) / durs.length : 0;
        const avgHoursBeforeOnset = data.hoursBeforeValues.length > 0
          ? data.hoursBeforeValues.reduce((s, v) => s + v, 0) / data.hoursBeforeValues.length
          : null;
        const correlationScore = avgPain > 0 ? (avgPainIntensity / avgPain) : 1;
        const riskLevel: 'low' | 'medium' | 'high' = correlationScore >= 1.3 ? 'high' : correlationScore >= 1.1 ? 'medium' : 'low';
        
        return {
          trigger,
          occurrences: data.episodes.size,
          avgPainIntensity: Math.round(avgPainIntensity * 10) / 10,
          avgDuration: Math.round(avgDuration),
          avgHoursBeforeOnset,
          correlationScore: Math.round(correlationScore * 100) / 100,
          riskLevel,
        };
      })
      .sort((a, b) => b.correlationScore - a.correlationScore);

    // --- Treatment Effectiveness (using treatment_outcome) ---
    // Each area's treatment use is rated on its own; blank outcomes are excluded from the rate.
    const treatmentMap = new Map<string, {
      count: number;
      durations: number[];
      outcomes: { effective: number; partial: number; notEffective: number };
    }>();

    units.forEach(u => {
      const names = extractTreatmentNames(u.treatment);
      names.forEach((t: string) => {
        const existing = treatmentMap.get(t) || { 
          count: 0, durations: [], 
          outcomes: { effective: 0, partial: 0, notEffective: 0 }
        };
        existing.count++;
        if (u.duration_minutes != null) existing.durations.push(u.duration_minutes);
        addOutcome(existing.outcomes, u.treatment_outcome);
        treatmentMap.set(t, existing);
      });
    });

    const treatmentEffectiveness: TreatmentEffectiveness[] = Array.from(treatmentMap.entries())
      .map(([treatment, data]) => ({
        treatment,
        usageCount: data.count,
        avgReliefTime: data.durations.length > 0 ? Math.round(data.durations.reduce((a, b) => a + b, 0) / data.durations.length) : 0,
        effectivenessRate: effectivenessRate(data.outcomes),
        avgPainReduction: 0,
        outcomeBreakdown: data.outcomes,
      }))
      .sort((a, b) => (b.effectivenessRate ?? -1) - (a.effectivenessRate ?? -1));

    // --- Symptom Patterns (with timing parsing) ---
    const symptomMap = new Map<string, { 
      count: number; totalPain: number; 
      timings: { before: number; during: number; after: number; unspecified: number }
    }>();

    episodes.forEach(ep => {
      (ep.symptoms || []).forEach(rawSymptom => {
        const parsed = parseSymptomString(rawSymptom);
        // Skip pain characteristics stored in symptoms
        if (parsed.name.startsWith('Pain:')) return;
        
        const existing = symptomMap.get(parsed.name) || { 
          count: 0, totalPain: 0, 
          timings: { before: 0, during: 0, after: 0, unspecified: 0 }
        };
        existing.count++;
        existing.totalPain += ep.pain_intensity || 0;
        
        if (parsed.timing === 'Before headache') existing.timings.before++;
        else if (parsed.timing === 'During headache') existing.timings.during++;
        else if (parsed.timing === 'After headache started') existing.timings.after++;
        else existing.timings.unspecified++;
        
        symptomMap.set(parsed.name, existing);
      });
    });

    const symptomPatterns: SymptomPattern[] = Array.from(symptomMap.entries())
      .map(([symptom, data]) => ({
        symptom,
        frequency: data.count,
        percentageOfEpisodes: Math.round((data.count / totalEpisodes) * 100),
        avgAssociatedPain: data.count > 0 ? Math.round((data.totalPain / data.count) * 10) / 10 : 0,
        timingBreakdown: data.timings,
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // --- Heatmap Data ---
    const painTriggerHeatmap = triggerCorrelations.slice(0, 8).map((tc, index) => ({
      x: Math.floor(index / 2) + 1,
      y: (index % 2) + 1,
      z: Math.round(tc.correlationScore * 10),
      name: tc.trigger,
    }));

    const durationTreatmentHeatmap = treatmentEffectiveness.slice(0, 8).map((te, index) => ({
      x: Math.floor(index / 2) + 1,
      y: (index % 2) + 1,
      z: Math.round((te.effectivenessRate ?? 0) / 10),
      name: te.treatment,
    }));

    return {
      triggerCorrelations,
      treatmentEffectiveness,
      symptomPatterns,
      painTriggerHeatmap,
      durationTreatmentHeatmap,
      totalEpisodes,
      dataStartDate,
      dataEndDate,
    };
  }, [episodes, units]);

  return { 
    ...correlationData, 
    loading, 
    error,
    hasData: episodes.length > 0 
  };
};
