import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';

interface TriggerCorrelation {
  trigger: string;
  occurrences: number;
  avgPainIntensity: number;
  avgDuration: number;
  correlationScore: number; // Simplified odds ratio representation
  riskLevel: 'low' | 'medium' | 'high';
}

interface TreatmentEffectiveness {
  treatment: string;
  usageCount: number;
  avgReliefTime: number; // minutes
  effectivenessRate: number; // percentage
  avgPainReduction: number;
}

interface SymptomPattern {
  symptom: string;
  frequency: number;
  percentageOfEpisodes: number;
  avgAssociatedPain: number;
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

    // Calculate average pain for baseline comparison
    const avgPain = episodes.reduce((sum, ep) => sum + (ep.pain_intensity || 0), 0) / totalEpisodes;

    // --- Trigger Correlations ---
    const triggerMap = new Map<string, { 
      count: number; 
      totalPain: number; 
      totalDuration: number;
      painValues: number[];
    }>();

    episodes.forEach(ep => {
      (ep.triggers || []).forEach(trigger => {
        const existing = triggerMap.get(trigger) || { 
          count: 0, 
          totalPain: 0, 
          totalDuration: 0,
          painValues: []
        };
        existing.count++;
        existing.totalPain += ep.pain_intensity || 0;
        existing.totalDuration += ep.duration_minutes || 0;
        existing.painValues.push(ep.pain_intensity || 0);
        triggerMap.set(trigger, existing);
      });
    });

    const triggerCorrelations: TriggerCorrelation[] = Array.from(triggerMap.entries())
      .map(([trigger, data]): TriggerCorrelation => {
        const avgPainIntensity = data.count > 0 ? data.totalPain / data.count : 0;
        const avgDuration = data.count > 0 ? data.totalDuration / data.count : 0;
        
        // Simplified correlation score: how much above average pain is when this trigger is present
        const correlationScore = avgPain > 0 ? (avgPainIntensity / avgPain) : 1;
        const riskLevel: 'low' | 'medium' | 'high' = correlationScore >= 1.3 ? 'high' : correlationScore >= 1.1 ? 'medium' : 'low';
        
        return {
          trigger,
          occurrences: data.count,
          avgPainIntensity: Math.round(avgPainIntensity * 10) / 10,
          avgDuration: Math.round(avgDuration),
          correlationScore: Math.round(correlationScore * 100) / 100,
          riskLevel,
        };
      })
      .sort((a, b) => b.correlationScore - a.correlationScore);

    // --- Treatment Effectiveness ---
    const treatmentMap = new Map<string, {
      count: number;
      totalDuration: number;
      successfulTreatments: number;
    }>();

    episodes.forEach(ep => {
      const treatment = ep.treatment as any;
      if (treatment) {
        // Handle treatment as array or object
        const treatments = Array.isArray(treatment) ? treatment : 
          treatment.medications ? treatment.medications : 
          treatment.type ? [treatment.type] : [];
        
        treatments.forEach((t: string) => {
          const existing = treatmentMap.get(t) || { count: 0, totalDuration: 0, successfulTreatments: 0 };
          existing.count++;
          existing.totalDuration += ep.duration_minutes || 0;
          // Consider treatment successful if duration is under 120 minutes
          if ((ep.duration_minutes || 0) < 120) {
            existing.successfulTreatments++;
          }
          treatmentMap.set(t, existing);
        });
      }
    });

    const treatmentEffectiveness: TreatmentEffectiveness[] = Array.from(treatmentMap.entries())
      .map(([treatment, data]) => ({
        treatment,
        usageCount: data.count,
        avgReliefTime: data.count > 0 ? Math.round(data.totalDuration / data.count) : 0,
        effectivenessRate: data.count > 0 ? Math.round((data.successfulTreatments / data.count) * 100) : 0,
        avgPainReduction: 0, // Would need before/after pain data
      }))
      .sort((a, b) => b.effectivenessRate - a.effectivenessRate);

    // --- Symptom Patterns ---
    const symptomMap = new Map<string, { count: number; totalPain: number }>();

    episodes.forEach(ep => {
      (ep.symptoms || []).forEach(symptom => {
        const existing = symptomMap.get(symptom) || { count: 0, totalPain: 0 };
        existing.count++;
        existing.totalPain += ep.pain_intensity || 0;
        symptomMap.set(symptom, existing);
      });
    });

    const symptomPatterns: SymptomPattern[] = Array.from(symptomMap.entries())
      .map(([symptom, data]) => ({
        symptom,
        frequency: data.count,
        percentageOfEpisodes: Math.round((data.count / totalEpisodes) * 100),
        avgAssociatedPain: data.count > 0 ? Math.round((data.totalPain / data.count) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // --- Heatmap Data (Pain vs Triggers) ---
    const painTriggerHeatmap = triggerCorrelations.slice(0, 8).map((tc, index) => ({
      x: Math.floor(index / 2) + 1,
      y: (index % 2) + 1,
      z: Math.round(tc.correlationScore * 10),
      name: tc.trigger,
    }));

    // --- Heatmap Data (Duration vs Treatment) ---
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
