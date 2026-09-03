import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PatientProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  age: number | null;
  firstDataDate: string | null;
  lastDataDate: string | null;
  totalEpisodes: number;
  trackingPeriodDays: number;
  episodesPerMonth: number | null;
}

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
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
          .select('full_name, email, date_of_birth')
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

        const lastDataDate = episodeData && episodeData.length > 0
          ? episodeData[episodeData.length - 1].start_time
          : null;

        const trackingPeriodDays = firstDataDate 
          ? Math.ceil((Date.now() - new Date(firstDataDate).getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        setProfile({
          id: user.id,
          email: profileData?.email || user.email || null,
          fullName: profileData?.full_name || null,
          dateOfBirth: profileData?.date_of_birth || null,
          age: profileData?.date_of_birth ? calculateAge(profileData.date_of_birth) : null,
          firstDataDate,
          lastDataDate,
          totalEpisodes: episodeData?.length || 0,
          trackingPeriodDays,
          episodesPerMonth: trackingPeriodDays > 0 && episodeData?.length
            ? Number(((episodeData.length / trackingPeriodDays) * 30).toFixed(1))
            : null,
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
