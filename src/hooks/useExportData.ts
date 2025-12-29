import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
}

export function useExportData() {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('start_time', { ascending: false });

        if (error) {
          console.error('Error fetching episodes for export:', error);
        } else {
          setEpisodes(data || []);
        }
      } catch (error) {
        console.error('Error fetching episodes for export:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [user]);

  const data = useMemo<HeadacheRecord[]>(() => {
    return episodes.map((episode) => {
      // Extract treatment names from treatment JSONB
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

      return {
        id: episode.id,
        date: episode.start_time,
        intensity: episode.pain_intensity || 0,
        location: episode.pain_location || 'Not specified',
        duration: episode.duration_minutes || 0,
        symptoms: episode.symptoms || [],
        triggers: episode.triggers || [],
        treatments: treatmentNames.length > 0 ? treatmentNames : undefined,
        notes: episode.notes || undefined
      };
    });
  }, [episodes]);

  return {
    data,
    loading,
    hasData: episodes.length > 0
  };
}
