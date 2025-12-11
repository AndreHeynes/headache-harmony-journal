import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import { subDays, differenceInDays } from 'date-fns';

interface AnalysisStats {
  totalEpisodes: number;
  avgDuration: string;
  dailyFrequency: number;
  topTriggersCount: number;
  avgPainIntensity: number;
  headacheDays: number;
  trackingPeriodDays: number;
}

export const useAnalysisStats = (daysRange: number = 30) => {
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
        const startDate = subDays(new Date(), daysRange);

        const { data, error } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', startDate.toISOString())
          .order('start_time', { ascending: false });

        if (error) throw error;
        setEpisodes(data as HeadacheEpisode[]);
      } catch (err) {
        console.error('Error fetching analysis stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [user, daysRange]);

  const stats = useMemo<AnalysisStats>(() => {
    if (episodes.length === 0) {
      return {
        totalEpisodes: 0,
        avgDuration: '0h',
        dailyFrequency: 0,
        topTriggersCount: 0,
        avgPainIntensity: 0,
        headacheDays: 0,
        trackingPeriodDays: daysRange,
      };
    }

    // Total episodes
    const totalEpisodes = episodes.length;

    // Average duration
    const episodesWithDuration = episodes.filter(ep => ep.duration_minutes !== null);
    const avgDurationMinutes = episodesWithDuration.length > 0
      ? episodesWithDuration.reduce((sum, ep) => sum + (ep.duration_minutes || 0), 0) / episodesWithDuration.length
      : 0;
    
    const avgDuration = avgDurationMinutes >= 60 
      ? `${(avgDurationMinutes / 60).toFixed(1)}h`
      : `${Math.round(avgDurationMinutes)}m`;

    // Daily frequency (episodes per day)
    const dailyFrequency = Math.round((totalEpisodes / daysRange) * 10) / 10;

    // Unique triggers count
    const allTriggers = episodes.flatMap(ep => ep.triggers || []);
    const uniqueTriggers = new Set(allTriggers);
    const topTriggersCount = uniqueTriggers.size;

    // Average pain intensity
    const episodesWithPain = episodes.filter(ep => ep.pain_intensity !== null);
    const avgPainIntensity = episodesWithPain.length > 0
      ? Math.round((episodesWithPain.reduce((sum, ep) => sum + (ep.pain_intensity || 0), 0) / episodesWithPain.length) * 10) / 10
      : 0;

    // Unique headache days
    const headacheDays = new Set(
      episodes.map(ep => new Date(ep.start_time).toDateString())
    ).size;

    return {
      totalEpisodes,
      avgDuration,
      dailyFrequency,
      topTriggersCount,
      avgPainIntensity,
      headacheDays,
      trackingPeriodDays: daysRange,
    };
  }, [episodes, daysRange]);

  return { stats, loading, hasData: episodes.length > 0 };
};
