import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RedFlagCheckResult {
  shouldAskFirstHeadache: boolean;
  /** True when we still need a date of birth before we can decide */
  needsDateOfBirth: boolean;
  userAge: number | null;
  loading: boolean;
  submitFirstHeadacheFlag: (episodeId: string, isFirstEver: boolean) => Promise<void>;
  saveDateOfBirth: (dob: string) => Promise<void>;
  skipDateOfBirth: () => void;
}

const calcAge = (dob: string) =>
  Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

export const useRedFlagCheck = (): RedFlagCheckResult => {
  const { user } = useAuth();
  const [shouldAskFirstHeadache, setShouldAskFirstHeadache] = useState(false);
  const [needsDateOfBirth, setNeedsDateOfBirth] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkRedFlagEligibility = async () => {
      try {
        // Has this user already answered the first-headache question?
        const { data: existingFlag } = await supabase
          .from('red_flags')
          .select('id')
          .eq('user_id', user.id)
          .eq('flag_type', 'first_headache_over_50')
          .maybeSingle();

        if (existingFlag) {
          setLoading(false);
          return;
        }

        // Age is derived from the profile date of birth
        const { data: profile } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile?.date_of_birth) {
          // We can't determine age — ask for the date of birth inline
          setNeedsDateOfBirth(true);
          setLoading(false);
          return;
        }

        const age = calcAge(profile.date_of_birth);
        setUserAge(age);
        setShouldAskFirstHeadache(age >= 50);
      } catch (err) {
        console.error('Error checking red flag eligibility:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRedFlagEligibility();
  }, [user]);

  const saveDateOfBirth = useCallback(async (dob: string) => {
    if (!user || !dob) return;
    try {
      await supabase.from('profiles').update({ date_of_birth: dob }).eq('id', user.id);
      const age = calcAge(dob);
      setUserAge(age);
      setNeedsDateOfBirth(false);
      setShouldAskFirstHeadache(age >= 50);
    } catch (err) {
      console.error('Error saving date of birth:', err);
    }
  }, [user]);

  const skipDateOfBirth = useCallback(() => {
    setNeedsDateOfBirth(false);
    setShouldAskFirstHeadache(false);
  }, []);

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

  return {
    shouldAskFirstHeadache,
    needsDateOfBirth,
    userAge,
    loading,
    submitFirstHeadacheFlag,
    saveDateOfBirth,
    skipDateOfBirth,
  };
};
