import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import { subMonths, startOfMonth, endOfMonth, format, eachMonthOfInterval, subDays } from 'date-fns';

interface MonthlyStats {
  month: string;
  monthLabel: string;
  episodeCount: number;
  headacheDays: number;
  avgPainIntensity: number;
  avgDuration: number;
  topTrigger: string | null;
  topSymptom: string | null;
}

interface TrendChange {
  metric: string;
  currentValue: number;
  previousValue: number;
  percentChange: number;
  trend: 'improving' | 'worsening' | 'stable';
  unit: string;
}

interface TrendComparisonData {
  monthlyStats: MonthlyStats[];
  trendChanges: TrendChange[];
  frequencyTrend: Array<{ month: string; count: number }>;
  intensityTrend: Array<{ month: string; avg: number }>;
  durationTrend: Array<{ month: string; avg: number }>;
  overallTrend: 'improving' | 'worsening' | 'stable';
  dataStartDate: string | null;
  monthsOfData: number;
}

export const useTrendComparison = (monthsToAnalyze: number = 6) => {
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
        const startDate = startOfMonth(subMonths(new Date(), monthsToAnalyze));

        const { data, error: fetchError } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', startDate.toISOString())
          .order('start_time', { ascending: true });

        if (fetchError) throw fetchError;
        setEpisodes(data as HeadacheEpisode[]);
      } catch (err) {
        console.error('Error fetching episodes for trends:', err);
        setError('Failed to load trend data');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [user, monthsToAnalyze]);

  const trendData = useMemo<TrendComparisonData>(() => {
    const emptyResult: TrendComparisonData = {
      monthlyStats: [],
      trendChanges: [],
      frequencyTrend: [],
      intensityTrend: [],
      durationTrend: [],
      overallTrend: 'stable',
      dataStartDate: null,
      monthsOfData: 0,
    };

    if (episodes.length === 0) return emptyResult;

    const dataStartDate = episodes[0]?.start_time || null;

    // Generate months to analyze
    const months = eachMonthOfInterval({
      start: startOfMonth(subMonths(new Date(), monthsToAnalyze - 1)),
      end: endOfMonth(new Date()),
    });

    // Calculate monthly stats
    const monthlyStats: MonthlyStats[] = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthEpisodes = episodes.filter(ep => {
        const epDate = new Date(ep.start_time);
        return epDate >= monthStart && epDate <= monthEnd;
      });

      const episodeCount = monthEpisodes.length;
      
      // Count unique headache days
      const headacheDays = new Set(
        monthEpisodes.map(ep => format(new Date(ep.start_time), 'yyyy-MM-dd'))
      ).size;

      // Average pain intensity
      const avgPainIntensity = episodeCount > 0
        ? monthEpisodes.reduce((sum, ep) => sum + (ep.pain_intensity || 0), 0) / episodeCount
        : 0;

      // Average duration
      const avgDuration = episodeCount > 0
        ? monthEpisodes.reduce((sum, ep) => sum + (ep.duration_minutes || 0), 0) / episodeCount
        : 0;

      // Top trigger
      const triggers = monthEpisodes.flatMap(ep => ep.triggers || []);
      const triggerCounts = triggers.reduce((acc, t) => {
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      // Top symptom
      const symptoms = monthEpisodes.flatMap(ep => ep.symptoms || []);
      const symptomCounts = symptoms.reduce((acc, s) => {
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      return {
        month: format(month, 'yyyy-MM'),
        monthLabel: format(month, 'MMM yyyy'),
        episodeCount,
        headacheDays,
        avgPainIntensity: Math.round(avgPainIntensity * 10) / 10,
        avgDuration: Math.round(avgDuration),
        topTrigger,
        topSymptom,
      };
    });

    // Calculate trend changes (compare last month to previous month)
    const trendChanges: TrendChange[] = [];
    if (monthlyStats.length >= 2) {
      const current = monthlyStats[monthlyStats.length - 1];
      const previous = monthlyStats[monthlyStats.length - 2];

      // Episode frequency change
      const freqChange = previous.episodeCount > 0 
        ? ((current.episodeCount - previous.episodeCount) / previous.episodeCount) * 100 
        : 0;
      trendChanges.push({
        metric: 'Episode Frequency',
        currentValue: current.episodeCount,
        previousValue: previous.episodeCount,
        percentChange: Math.round(freqChange),
        trend: freqChange < -10 ? 'improving' : freqChange > 10 ? 'worsening' : 'stable',
        unit: 'episodes',
      });

      // Pain intensity change
      const painChange = previous.avgPainIntensity > 0 
        ? ((current.avgPainIntensity - previous.avgPainIntensity) / previous.avgPainIntensity) * 100 
        : 0;
      trendChanges.push({
        metric: 'Pain Intensity',
        currentValue: current.avgPainIntensity,
        previousValue: previous.avgPainIntensity,
        percentChange: Math.round(painChange),
        trend: painChange < -10 ? 'improving' : painChange > 10 ? 'worsening' : 'stable',
        unit: '/10',
      });

      // Duration change
      const durationChange = previous.avgDuration > 0 
        ? ((current.avgDuration - previous.avgDuration) / previous.avgDuration) * 100 
        : 0;
      trendChanges.push({
        metric: 'Average Duration',
        currentValue: current.avgDuration,
        previousValue: previous.avgDuration,
        percentChange: Math.round(durationChange),
        trend: durationChange < -10 ? 'improving' : durationChange > 10 ? 'worsening' : 'stable',
        unit: 'min',
      });

      // Headache days change
      const daysChange = previous.headacheDays > 0 
        ? ((current.headacheDays - previous.headacheDays) / previous.headacheDays) * 100 
        : 0;
      trendChanges.push({
        metric: 'Headache Days',
        currentValue: current.headacheDays,
        previousValue: previous.headacheDays,
        percentChange: Math.round(daysChange),
        trend: daysChange < -10 ? 'improving' : daysChange > 10 ? 'worsening' : 'stable',
        unit: 'days',
      });
    }

    // Chart data
    const frequencyTrend = monthlyStats.map(m => ({ month: m.monthLabel, count: m.episodeCount }));
    const intensityTrend = monthlyStats.map(m => ({ month: m.monthLabel, avg: m.avgPainIntensity }));
    const durationTrend = monthlyStats.map(m => ({ month: m.monthLabel, avg: m.avgDuration }));

    // Overall trend (based on majority of trend changes)
    const improvingCount = trendChanges.filter(t => t.trend === 'improving').length;
    const worseningCount = trendChanges.filter(t => t.trend === 'worsening').length;
    const overallTrend = improvingCount > worseningCount ? 'improving' 
      : worseningCount > improvingCount ? 'worsening' 
      : 'stable';

    return {
      monthlyStats,
      trendChanges,
      frequencyTrend,
      intensityTrend,
      durationTrend,
      overallTrend,
      dataStartDate,
      monthsOfData: monthlyStats.filter(m => m.episodeCount > 0).length,
    };
  }, [episodes, monthsToAnalyze]);

  return {
    ...trendData,
    loading,
    error,
    hasData: episodes.length > 0,
  };
};
