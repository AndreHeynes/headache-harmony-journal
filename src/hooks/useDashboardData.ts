import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HeadacheEpisode } from '@/types/episode';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';

interface DashboardStats {
  lastEpisode: HeadacheEpisode | null;
  weeklyCount: number;
  avgPainIntensity: number;
  avgDuration: number;
  mostCommonTrigger: string | null;
  weeklyChartData: Array<{ date: string; count: number }>;
  recentEpisodes: HeadacheEpisode[];
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const thirtyDaysAgo = subDays(new Date(), 30);
        const sevenDaysAgo = subDays(new Date(), 7);

        // Fetch all episodes from last 30 days
        const { data: episodes, error } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', thirtyDaysAgo.toISOString())
          .order('start_time', { ascending: false });

        if (error) throw error;

        const episodesData = episodes as HeadacheEpisode[];

        // Calculate stats
        const lastEpisode = episodesData[0] || null;
        const weeklyEpisodes = episodesData.filter(
          ep => new Date(ep.start_time) >= sevenDaysAgo
        );
        const weeklyCount = weeklyEpisodes.length;

        // Average pain intensity
        const episodesWithPain = episodesData.filter(ep => ep.pain_intensity !== null);
        const avgPainIntensity = episodesWithPain.length > 0
          ? episodesWithPain.reduce((sum, ep) => sum + (ep.pain_intensity || 0), 0) / episodesWithPain.length
          : 0;

        // Average duration
        const episodesWithDuration = episodesData.filter(ep => ep.duration_minutes !== null);
        const avgDuration = episodesWithDuration.length > 0
          ? episodesWithDuration.reduce((sum, ep) => sum + (ep.duration_minutes || 0), 0) / episodesWithDuration.length
          : 0;

        // Most common trigger
        const allTriggers = episodesData.flatMap(ep => ep.triggers || []);
        const triggerCounts = allTriggers.reduce((acc, trigger) => {
          acc[trigger] = (acc[trigger] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const mostCommonTrigger = Object.keys(triggerCounts).length > 0
          ? Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0][0]
          : null;

        // Weekly chart data
        const last7Days = eachDayOfInterval({ start: sevenDaysAgo, end: new Date() });
        const weeklyChartData = last7Days.map(day => {
          const dayStart = startOfDay(day);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);
          
          const count = episodesData.filter(ep => {
            const epDate = new Date(ep.start_time);
            return epDate >= dayStart && epDate <= dayEnd;
          }).length;

          return {
            date: format(day, 'EEE'),
            count
          };
        });

        setData({
          lastEpisode,
          weeklyCount,
          avgPainIntensity: Math.round(avgPainIntensity * 10) / 10,
          avgDuration: Math.round(avgDuration),
          mostCommonTrigger,
          weeklyChartData,
          recentEpisodes: episodesData.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return { data, loading };
};
