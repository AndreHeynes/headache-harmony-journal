import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PatientProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  firstDataDate: string | null;
  totalEpisodes: number;
  trackingPeriodDays: number;
}

export const usePatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        // Fetch first episode date and count
        const { data: episodeData } = await supabase
          .from('headache_episodes')
          .select('start_time')
          .eq('user_id', user.id)
          .order('start_time', { ascending: true });

        const firstDataDate = episodeData && episodeData.length > 0 
          ? episodeData[0].start_time 
          : null;

        const trackingPeriodDays = firstDataDate 
          ? Math.ceil((Date.now() - new Date(firstDataDate).getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        setProfile({
          id: user.id,
          email: profileData?.email || user.email || null,
          fullName: profileData?.full_name || null,
          firstDataDate,
          totalEpisodes: episodeData?.length || 0,
          trackingPeriodDays,
        });
      } catch (err) {
        console.error('Error fetching patient profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
};
