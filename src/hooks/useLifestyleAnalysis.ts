import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import { subDays, format } from 'date-fns';

interface SleepCorrelation {
  sleepQuality: string;
  episodeCount: number;
  avgPainIntensity: number;
  percentageOfEpisodes: number;
  correlationStrength: 'strong' | 'moderate' | 'weak' | 'none';
}

interface MenstrualCorrelation {
  phase: string;
  episodeCount: number;
  avgPainIntensity: number;
  percentageOfEpisodes: number;
  riskLevel: 'high' | 'medium' | 'low';
}

interface LifestyleAnalysisData {
  sleepCorrelations: SleepCorrelation[];
  menstrualCorrelations: MenstrualCorrelation[];
  sleepQualityImpact: string | null;
  highRiskMenstrualPhase: string | null;
  hasSleepData: boolean;
  hasMenstrualData: boolean;
  recommendations: string[];
}

export const useLifestyleAnalysis = () => {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<HeadacheEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      try {
        const startDate = subDays(new Date(), 90);

        const { data, error } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', startDate.toISOString())
          .order('start_time', { ascending: false });

        if (error) throw error;
        setEpisodes(data as HeadacheEpisode[]);
      } catch (err) {
        console.error('Error fetching lifestyle data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [user]);

  const analysisData = useMemo<LifestyleAnalysisData>(() => {
    const emptyResult: LifestyleAnalysisData = {
      sleepCorrelations: [],
      menstrualCorrelations: [],
      sleepQualityImpact: null,
      highRiskMenstrualPhase: null,
      hasSleepData: false,
      hasMenstrualData: false,
      recommendations: [],
    };

    if (episodes.length === 0) return emptyResult;

    const totalEpisodes = episodes.length;

    // --- Sleep Analysis ---
    const sleepMap = new Map<string, { count: number; totalPain: number }>();
    const sleepKeywords = ['sleep', 'tired', 'fatigue', 'insomnia', 'rest'];
    const sleepQualityLabels = ['excellent', 'good', 'fair', 'poor'];

    episodes.forEach(ep => {
      const triggers = (ep.triggers || []).map(t => t.toLowerCase());
      
      // Check for sleep-related triggers
      let sleepQuality: string | null = null;
      
      for (const trigger of triggers) {
        for (const quality of sleepQualityLabels) {
          if (trigger.includes(quality) && sleepKeywords.some(k => trigger.includes(k))) {
            sleepQuality = quality;
            break;
          }
        }
        if (sleepQuality) break;
        
        // Check for general sleep mentions
        if (sleepKeywords.some(k => trigger.includes(k))) {
          if (trigger.includes('lack') || trigger.includes('poor') || trigger.includes('bad')) {
            sleepQuality = 'poor';
          } else if (trigger.includes('good') || trigger.includes('well')) {
            sleepQuality = 'good';
          }
        }
      }

      if (sleepQuality) {
        const existing = sleepMap.get(sleepQuality) || { count: 0, totalPain: 0 };
        existing.count++;
        existing.totalPain += ep.pain_intensity || 0;
        sleepMap.set(sleepQuality, existing);
      }
    });

    const sleepCorrelations: SleepCorrelation[] = Array.from(sleepMap.entries())
      .map(([quality, data]) => {
        const avgPain = data.count > 0 ? data.totalPain / data.count : 0;
        const percentage = Math.round((data.count / totalEpisodes) * 100);
        
        // Determine correlation strength based on pain impact
        let correlationStrength: 'strong' | 'moderate' | 'weak' | 'none' = 'none';
        if (quality === 'poor' && avgPain >= 7) correlationStrength = 'strong';
        else if (quality === 'poor' && avgPain >= 5) correlationStrength = 'moderate';
        else if (quality === 'fair' && avgPain >= 6) correlationStrength = 'moderate';
        else if (data.count >= 3) correlationStrength = 'weak';

        return {
          sleepQuality: quality.charAt(0).toUpperCase() + quality.slice(1),
          episodeCount: data.count,
          avgPainIntensity: Math.round(avgPain * 10) / 10,
          percentageOfEpisodes: percentage,
          correlationStrength,
        };
      })
      .sort((a, b) => b.episodeCount - a.episodeCount);

    // --- Menstrual Cycle Analysis ---
    const menstrualMap = new Map<string, { count: number; totalPain: number }>();
    const menstrualPhases = ['menstrual', 'follicular', 'ovulation', 'luteal'];

    episodes.forEach(ep => {
      const triggers = (ep.triggers || []).map(t => t.toLowerCase());
      
      for (const trigger of triggers) {
        for (const phase of menstrualPhases) {
          if (trigger.includes(phase) || trigger.includes('period') || trigger.includes('cycle')) {
            const detectedPhase = menstrualPhases.find(p => trigger.includes(p)) || 
              (trigger.includes('period') ? 'menstrual' : null);
            
            if (detectedPhase) {
              const existing = menstrualMap.get(detectedPhase) || { count: 0, totalPain: 0 };
              existing.count++;
              existing.totalPain += ep.pain_intensity || 0;
              menstrualMap.set(detectedPhase, existing);
            }
            break;
          }
        }
      }
    });

    const menstrualCorrelations: MenstrualCorrelation[] = Array.from(menstrualMap.entries())
      .map(([phase, data]) => {
        const avgPain = data.count > 0 ? data.totalPain / data.count : 0;
        const percentage = Math.round((data.count / totalEpisodes) * 100);
        
        // Determine risk level
        let riskLevel: 'high' | 'medium' | 'low' = 'low';
        if (data.count >= 5 && avgPain >= 6) riskLevel = 'high';
        else if (data.count >= 3 || avgPain >= 5) riskLevel = 'medium';

        return {
          phase: phase.charAt(0).toUpperCase() + phase.slice(1),
          episodeCount: data.count,
          avgPainIntensity: Math.round(avgPain * 10) / 10,
          percentageOfEpisodes: percentage,
          riskLevel,
        };
      })
      .sort((a, b) => b.episodeCount - a.episodeCount);

    // Generate insights
    const hasSleepData = sleepCorrelations.length > 0;
    const hasMenstrualData = menstrualCorrelations.length > 0;

    const poorSleep = sleepCorrelations.find(s => s.sleepQuality.toLowerCase() === 'poor');
    const sleepQualityImpact = poorSleep && poorSleep.correlationStrength !== 'none'
      ? `Poor sleep is associated with ${poorSleep.avgPainIntensity}/10 average pain intensity`
      : null;

    const highRiskPhase = menstrualCorrelations.find(m => m.riskLevel === 'high');
    const highRiskMenstrualPhase = highRiskPhase?.phase || null;

    // Generate recommendations
    const recommendations: string[] = [];
    if (poorSleep && poorSleep.episodeCount >= 3) {
      recommendations.push('Consider improving sleep hygiene - poor sleep appears to be a significant trigger');
    }
    if (highRiskPhase) {
      recommendations.push(`Track ${highRiskPhase.phase.toLowerCase()} phase closely - higher headache risk detected`);
    }

    return {
      sleepCorrelations,
      menstrualCorrelations,
      sleepQualityImpact,
      highRiskMenstrualPhase,
      hasSleepData,
      hasMenstrualData,
      recommendations,
    };
  }, [episodes]);

  return {
    ...analysisData,
    loading,
    hasData: episodes.length > 0,
  };
};
