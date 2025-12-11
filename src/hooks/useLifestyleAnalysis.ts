import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import { subDays, format, parseISO, isSameDay } from 'date-fns';

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

interface UnifiedHealthData {
  id: string;
  user_id: string;
  date: string;
  data_type: string;
  source: string;
  menstrual_phase: string | null;
  period_flow: string | null;
  cycle_day: number | null;
  sleep_duration_minutes: number | null;
  sleep_quality_score: number | null;
}

interface LifestyleAnalysisData {
  sleepCorrelations: SleepCorrelation[];
  menstrualCorrelations: MenstrualCorrelation[];
  sleepQualityImpact: string | null;
  highRiskMenstrualPhase: string | null;
  hasSleepData: boolean;
  hasMenstrualData: boolean;
  recommendations: string[];
  dataSource: 'unified' | 'triggers' | 'mixed' | null;
}

export const useLifestyleAnalysis = () => {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<HeadacheEpisode[]>([]);
  const [unifiedHealthData, setUnifiedHealthData] = useState<UnifiedHealthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const startDate = subDays(new Date(), 90);

        // Fetch episodes and unified health data in parallel
        const [episodesResult, healthDataResult] = await Promise.all([
          supabase
            .from('headache_episodes')
            .select('*')
            .eq('user_id', user.id)
            .gte('start_time', startDate.toISOString())
            .order('start_time', { ascending: false }),
          supabase
            .from('unified_health_data')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate.toISOString().split('T')[0])
            .order('date', { ascending: false }),
        ]);

        if (episodesResult.error) throw episodesResult.error;
        if (healthDataResult.error) throw healthDataResult.error;

        setEpisodes(episodesResult.data as HeadacheEpisode[]);
        setUnifiedHealthData(healthDataResult.data as UnifiedHealthData[]);
      } catch (err) {
        console.error('Error fetching lifestyle data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      dataSource: null,
    };

    if (episodes.length === 0) return emptyResult;

    const totalEpisodes = episodes.length;

    // Check for unified health data
    const unifiedMenstrualData = unifiedHealthData.filter(d => d.data_type === 'menstrual');
    const unifiedSleepData = unifiedHealthData.filter(d => d.data_type === 'sleep');
    const hasUnifiedMenstrualData = unifiedMenstrualData.length > 0;
    const hasUnifiedSleepData = unifiedSleepData.length > 0;

    // --- Sleep Analysis ---
    const sleepMap = new Map<string, { count: number; totalPain: number }>();
    const sleepKeywords = ['sleep', 'tired', 'fatigue', 'insomnia', 'rest'];
    const sleepQualityLabels = ['excellent', 'good', 'fair', 'poor'];

    // First try unified sleep data
    if (hasUnifiedSleepData) {
      episodes.forEach(ep => {
        const episodeDate = parseISO(ep.start_time);
        const matchingSleepData = unifiedSleepData.find(d => 
          isSameDay(parseISO(d.date), episodeDate)
        );
        
        if (matchingSleepData && matchingSleepData.sleep_quality_score !== null) {
          let sleepQuality: string;
          const score = matchingSleepData.sleep_quality_score;
          
          if (score >= 80) sleepQuality = 'excellent';
          else if (score >= 60) sleepQuality = 'good';
          else if (score >= 40) sleepQuality = 'fair';
          else sleepQuality = 'poor';
          
          const existing = sleepMap.get(sleepQuality) || { count: 0, totalPain: 0 };
          existing.count++;
          existing.totalPain += ep.pain_intensity || 0;
          sleepMap.set(sleepQuality, existing);
        }
      });
    }
    
    // Fallback to trigger-based analysis
    if (sleepMap.size === 0) {
      episodes.forEach(ep => {
        const triggers = (ep.triggers || []).map(t => t.toLowerCase());
        
        let sleepQuality: string | null = null;
        
        for (const trigger of triggers) {
          for (const quality of sleepQualityLabels) {
            if (trigger.includes(quality) && sleepKeywords.some(k => trigger.includes(k))) {
              sleepQuality = quality;
              break;
            }
          }
          if (sleepQuality) break;
          
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
    }

    const sleepCorrelations: SleepCorrelation[] = Array.from(sleepMap.entries())
      .map(([quality, data]) => {
        const avgPain = data.count > 0 ? data.totalPain / data.count : 0;
        const percentage = Math.round((data.count / totalEpisodes) * 100);
        
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

    // First try unified menstrual data
    if (hasUnifiedMenstrualData) {
      episodes.forEach(ep => {
        const episodeDate = parseISO(ep.start_time);
        const matchingCycleData = unifiedMenstrualData.find(d => 
          isSameDay(parseISO(d.date), episodeDate)
        );
        
        if (matchingCycleData && matchingCycleData.menstrual_phase) {
          const phase = matchingCycleData.menstrual_phase.toLowerCase();
          const existing = menstrualMap.get(phase) || { count: 0, totalPain: 0 };
          existing.count++;
          existing.totalPain += ep.pain_intensity || 0;
          menstrualMap.set(phase, existing);
        }
      });
    }
    
    // Fallback to trigger-based analysis
    if (menstrualMap.size === 0) {
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
    }

    const menstrualCorrelations: MenstrualCorrelation[] = Array.from(menstrualMap.entries())
      .map(([phase, data]) => {
        const avgPain = data.count > 0 ? data.totalPain / data.count : 0;
        const percentage = Math.round((data.count / totalEpisodes) * 100);
        
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

    // Determine data source
    let dataSource: 'unified' | 'triggers' | 'mixed' | null = null;
    if (hasUnifiedMenstrualData || hasUnifiedSleepData) {
      if (!hasSleepData && !hasMenstrualData) {
        dataSource = null;
      } else if ((hasUnifiedMenstrualData && hasMenstrualData) || (hasUnifiedSleepData && hasSleepData)) {
        dataSource = 'unified';
      } else {
        dataSource = 'mixed';
      }
    } else if (hasSleepData || hasMenstrualData) {
      dataSource = 'triggers';
    }

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
    if (!hasUnifiedMenstrualData && hasMenstrualData) {
      recommendations.push('Import cycle data from Clue or Flo for more accurate phase tracking');
    }

    return {
      sleepCorrelations,
      menstrualCorrelations,
      sleepQualityImpact,
      highRiskMenstrualPhase,
      hasSleepData,
      hasMenstrualData,
      recommendations,
      dataSource,
    };
  }, [episodes, unifiedHealthData]);

  return {
    ...analysisData,
    loading,
    hasData: episodes.length > 0,
  };
};
