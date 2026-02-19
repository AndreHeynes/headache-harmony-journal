import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RedFlagCheckResult {
  shouldAskFirstHeadache: boolean;
  userAge: number | null;
  loading: boolean;
  submitFirstHeadacheFlag: (episodeId: string, isFirstEver: boolean) => Promise<void>;
}

export const useRedFlagCheck = (): RedFlagCheckResult => {
  const { user } = useAuth();
  const [shouldAskFirstHeadache, setShouldAskFirstHeadache] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkRedFlagEligibility = async () => {
      try {
        // Get user DOB
        const { data: profile } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('id', user.id)
          .single();

        if (!profile?.date_of_birth) {
          setLoading(false);
          return;
        }

        const dob = new Date(profile.date_of_birth);
        const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        setUserAge(age);

        if (age < 50) {
          setLoading(false);
          return;
        }

        // Check if user has any completed episodes already
        const { count: episodeCount } = await supabase
          .from('headache_episodes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed');

        // Check if we've already asked / flagged this
        const { data: existingFlag } = await supabase
          .from('red_flags')
          .select('id')
          .eq('user_id', user.id)
          .eq('flag_type', 'first_headache_over_50')
          .maybeSingle();

        // Ask only on first episode and if never flagged before
        setShouldAskFirstHeadache((episodeCount ?? 0) === 0 && !existingFlag);
      } catch (err) {
        console.error('Error checking red flag eligibility:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRedFlagEligibility();
  }, [user]);

  const submitFirstHeadacheFlag = useCallback(async (episodeId: string, isFirstEver: boolean) => {
    if (!user) return;

    try {
      await supabase.from('red_flags').insert({
        user_id: user.id,
        episode_id: episodeId,
        flag_type: 'first_headache_over_50',
        flag_details: {
          is_first_ever: isFirstEver,
          user_age: userAge,
          detected_at: new Date().toISOString(),
        },
      });

      // Once submitted, don't ask again
      setShouldAskFirstHeadache(false);
    } catch (err) {
      console.error('Error submitting red flag:', err);
    }
  }, [user, userAge]);

  return { shouldAskFirstHeadache, userAge, loading, submitFirstHeadacheFlag };
};
