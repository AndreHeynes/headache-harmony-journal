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
  locationBreakdown: Array<{ location: string; count: number; avgIntensity: number }>;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetchDashboardData = async () => {
      try {
        const thirtyDaysAgo = subDays(new Date(), 30);
        const sevenDaysAgo = subDays(new Date(), 7);

        const { data: episodes, error } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', thirtyDaysAgo.toISOString())
          .order('start_time', { ascending: false });

        if (error) throw error;
        const episodesData = episodes as HeadacheEpisode[];

        // Fetch per-location data
        const episodeIds = episodesData.map(e => e.id);
        let locationBreakdown: Array<{ location: string; count: number; avgIntensity: number }> = [];
        
        if (episodeIds.length > 0) {
          const { data: locData } = await supabase
            .from('episode_locations')
            .select('*')
            .in('episode_id', episodeIds);

          if (locData && locData.length > 0) {
            const locationMap = new Map<string, { count: number; totalIntensity: number; intensityCount: number }>();
            locData.forEach((loc: any) => {
              const existing = locationMap.get(loc.location_name) || { count: 0, totalIntensity: 0, intensityCount: 0 };
              existing.count++;
              if (loc.pain_intensity != null) {
                existing.totalIntensity += loc.pain_intensity;
                existing.intensityCount++;
              }
              locationMap.set(loc.location_name, existing);
            });

            locationBreakdown = Array.from(locationMap.entries())
              .map(([location, stats]) => ({
                location,
                count: stats.count,
                avgIntensity: stats.intensityCount > 0 ? Math.round((stats.totalIntensity / stats.intensityCount) * 10) / 10 : 0,
              }))
              .sort((a, b) => b.count - a.count);
          }
        }

        // Calculate stats (same as before)
        const lastEpisode = episodesData[0] || null;
        const weeklyEpisodes = episodesData.filter(ep => new Date(ep.start_time) >= sevenDaysAgo);
        const weeklyCount = weeklyEpisodes.length;

        const episodesWithPain = episodesData.filter(ep => ep.pain_intensity !== null);
        const avgPainIntensity = episodesWithPain.length > 0
          ? episodesWithPain.reduce((sum, ep) => sum + (ep.pain_intensity || 0), 0) / episodesWithPain.length : 0;

        const episodesWithDuration = episodesData.filter(ep => ep.duration_minutes !== null);
        const avgDuration = episodesWithDuration.length > 0
          ? episodesWithDuration.reduce((sum, ep) => sum + (ep.duration_minutes || 0), 0) / episodesWithDuration.length : 0;

        // Aggregate triggers from both episode-level and location-level
        const allTriggers = episodesData.flatMap(ep => ep.triggers || []);
        const triggerCounts = allTriggers.reduce((acc, trigger) => {
          acc[trigger] = (acc[trigger] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const mostCommonTrigger = Object.keys(triggerCounts).length > 0
          ? Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0][0] : null;

        const last7Days = eachDayOfInterval({ start: sevenDaysAgo, end: new Date() });
        const weeklyChartData = last7Days.map(day => {
          const dayStart = startOfDay(day);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);
          const count = episodesData.filter(ep => {
            const epDate = new Date(ep.start_time);
            return epDate >= dayStart && epDate <= dayEnd;
          }).length;
          return { date: format(day, 'EEE'), count };
        });

        setData({
          lastEpisode,
          weeklyCount,
          avgPainIntensity: Math.round(avgPainIntensity * 10) / 10,
          avgDuration: Math.round(avgDuration),
          mostCommonTrigger,
          weeklyChartData,
          recentEpisodes: episodesData.slice(0, 5),
          locationBreakdown,
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
