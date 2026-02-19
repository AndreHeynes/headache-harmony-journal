import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';

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
  effectivenessRate: number;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      try {
        let query = supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: true });

        if (dateRange?.from) {
          query = query.gte('start_time', dateRange.from.toISOString());
        }
        if (dateRange?.to) {
          query = query.lte('start_time', dateRange.to.toISOString());
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setEpisodes(data as HeadacheEpisode[]);
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

    const avgPain = episodes.reduce((sum, ep) => sum + (ep.pain_intensity || 0), 0) / totalEpisodes;

    // --- Trigger Correlations (with temporal parsing) ---
    const triggerMap = new Map<string, { 
      count: number; 
      totalPain: number; 
      totalDuration: number;
      hoursBeforeValues: number[];
    }>();

    episodes.forEach(ep => {
      (ep.triggers || []).forEach(rawTrigger => {
        const parsed = parseTriggerString(rawTrigger);
        const existing = triggerMap.get(parsed.name) || { 
          count: 0, totalPain: 0, totalDuration: 0, hoursBeforeValues: []
        };
        existing.count++;
        existing.totalPain += ep.pain_intensity || 0;
        existing.totalDuration += ep.duration_minutes || 0;
        if (parsed.hoursBefore !== null) {
          existing.hoursBeforeValues.push(parsed.hoursBefore);
        }
        triggerMap.set(parsed.name, existing);
      });
    });

    const triggerCorrelations: TriggerCorrelation[] = Array.from(triggerMap.entries())
      .map(([trigger, data]): TriggerCorrelation => {
        const avgPainIntensity = data.count > 0 ? data.totalPain / data.count : 0;
        const avgDuration = data.count > 0 ? data.totalDuration / data.count : 0;
        const avgHoursBeforeOnset = data.hoursBeforeValues.length > 0
          ? data.hoursBeforeValues.reduce((s, v) => s + v, 0) / data.hoursBeforeValues.length
          : null;
        const correlationScore = avgPain > 0 ? (avgPainIntensity / avgPain) : 1;
        const riskLevel: 'low' | 'medium' | 'high' = correlationScore >= 1.3 ? 'high' : correlationScore >= 1.1 ? 'medium' : 'low';
        
        return {
          trigger,
          occurrences: data.count,
          avgPainIntensity: Math.round(avgPainIntensity * 10) / 10,
          avgDuration: Math.round(avgDuration),
          avgHoursBeforeOnset,
          correlationScore: Math.round(correlationScore * 100) / 100,
          riskLevel,
        };
      })
      .sort((a, b) => b.correlationScore - a.correlationScore);

    // --- Treatment Effectiveness (using treatment_outcome) ---
    const treatmentMap = new Map<string, {
      count: number;
      totalDuration: number;
      outcomes: { effective: number; partial: number; notEffective: number };
    }>();

    episodes.forEach(ep => {
      const treatment = ep.treatment as any;
      if (!treatment) return;

      const treatments = Array.isArray(treatment) ? treatment : 
        treatment.medications ? treatment.medications : 
        treatment.type ? [treatment.type] : [];
      
      // Use structured outcome field if available
      const outcome = ep.treatment_outcome || treatment?.treatment_outcome;
      
      treatments.forEach((t: string) => {
        const existing = treatmentMap.get(t) || { 
          count: 0, totalDuration: 0, 
          outcomes: { effective: 0, partial: 0, notEffective: 0 }
        };
        existing.count++;
        existing.totalDuration += ep.duration_minutes || 0;
        
        if (outcome === 'effective') existing.outcomes.effective++;
        else if (outcome === 'partially_effective') existing.outcomes.partial++;
        else if (outcome === 'not_effective' || outcome === 'worsened') existing.outcomes.notEffective++;
        // If no outcome recorded, use duration heuristic as fallback
        else if ((ep.duration_minutes || 0) < 120) existing.outcomes.effective++;
        
        treatmentMap.set(t, existing);
      });
    });

    const treatmentEffectiveness: TreatmentEffectiveness[] = Array.from(treatmentMap.entries())
      .map(([treatment, data]) => ({
        treatment,
        usageCount: data.count,
        avgReliefTime: data.count > 0 ? Math.round(data.totalDuration / data.count) : 0,
        effectivenessRate: data.count > 0 
          ? Math.round(((data.outcomes.effective + data.outcomes.partial * 0.5) / data.count) * 100) 
          : 0,
        avgPainReduction: 0,
        outcomeBreakdown: data.outcomes,
      }))
      .sort((a, b) => b.effectivenessRate - a.effectivenessRate);

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
      z: Math.round(te.effectivenessRate / 10),
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
  }, [episodes]);

  return { 
    ...correlationData, 
    loading, 
    error,
    hasData: episodes.length > 0 
  };
};
