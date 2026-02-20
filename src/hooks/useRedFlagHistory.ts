import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RedFlagRecord {
  id: string;
  episodeId: string | null;
  date: string;
  priorityLevel: string;
  flagType: string;
  flags: Array<{
    criterion: string;
    label: string;
    priority: string;
    detail: string;
  }>;
  acknowledged: boolean;
}

export function useRedFlagHistory() {
  const { user } = useAuth();
  const [rawFlags, setRawFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('red_flags')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) setRawFlags(data);
      } catch (e) {
        console.error('Error fetching red flags:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const records = useMemo<RedFlagRecord[]>(() => {
    return rawFlags.map((rf) => {
      const details = rf.flag_details as any;
      return {
        id: rf.id,
        episodeId: rf.episode_id,
        date: rf.created_at,
        priorityLevel: rf.priority_level || 'low',
        flagType: rf.flag_type,
        flags: details?.flags || [],
        acknowledged: rf.acknowledged,
      };
    });
  }, [rawFlags]);

  const highCount = records.filter(r => r.priorityLevel === 'high').length;
  const mediumCount = records.filter(r => r.priorityLevel === 'medium').length;

  return { records, loading, hasFlags: records.length > 0, highCount, mediumCount };
}
