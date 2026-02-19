import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LocationRecord {
  location_name: string;
  pain_intensity: number | null;
  symptoms: string[] | null;
  triggers: string[] | null;
  treatment: any | null;
  notes: string | null;
}

interface HeadacheRecord {
  id: string;
  date: string;
  intensity: number;
  location: string;
  duration: number;
  symptoms?: string[];
  triggers?: string[];
  treatments?: string[];
  notes?: string;
  locations?: LocationRecord[];
}

export function useExportData() {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [locationsByEpisode, setLocationsByEpisode] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) { setLoading(false); return; }

      try {
        const { data: episodeData, error: epError } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('start_time', { ascending: false });

        if (epError) { console.error('Error fetching episodes:', epError); }
        const eps = episodeData || [];
        setEpisodes(eps);

        // Fetch locations for all episodes
        if (eps.length > 0) {
          const episodeIds = eps.map((e: any) => e.id);
          const { data: locData, error: locError } = await supabase
            .from('episode_locations')
            .select('*')
            .in('episode_id', episodeIds);

          if (!locError && locData) {
            const grouped: Record<string, any[]> = {};
            locData.forEach((loc: any) => {
              if (!grouped[loc.episode_id]) grouped[loc.episode_id] = [];
              grouped[loc.episode_id].push(loc);
            });
            setLocationsByEpisode(grouped);
          }
        }
      } catch (error) {
        console.error('Error fetching export data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const data = useMemo<HeadacheRecord[]>(() => {
    return episodes.map((episode) => {
      const treatmentNames: string[] = [];
      if (episode.treatment) {
        const treatment = episode.treatment;
        if (treatment.medications?.length > 0) {
          treatmentNames.push(...treatment.medications.map((m: any) => m.name || m));
        }
        if (treatment.otherTreatments?.length > 0) {
          treatmentNames.push(...treatment.otherTreatments);
        }
      }

      const locs = locationsByEpisode[episode.id] || [];
      const locationRecords: LocationRecord[] = locs.map((loc: any) => ({
        location_name: loc.location_name,
        pain_intensity: loc.pain_intensity,
        symptoms: loc.symptoms,
        triggers: loc.triggers,
        treatment: loc.treatment,
        notes: loc.notes,
      }));

      return {
        id: episode.id,
        date: episode.start_time,
        intensity: episode.pain_intensity || 0,
        location: episode.pain_location || 'Not specified',
        duration: episode.duration_minutes || 0,
        symptoms: episode.symptoms || [],
        triggers: episode.triggers || [],
        treatments: treatmentNames.length > 0 ? treatmentNames : undefined,
        notes: episode.notes || undefined,
        locations: locationRecords.length > 0 ? locationRecords : undefined,
      };
    });
  }, [episodes, locationsByEpisode]);

  return { data, loading, hasData: episodes.length > 0 };
}
