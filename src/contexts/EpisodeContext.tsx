import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { HeadacheEpisode, EpisodeContextType } from '@/types/episode';
import { toast } from 'sonner';

const EpisodeContext = createContext<EpisodeContextType | undefined>(undefined);

export const useEpisode = () => {
  const context = useContext(EpisodeContext);
  if (!context) {
    throw new Error('useEpisode must be used within EpisodeProvider');
  }
  return context;
};

export const EpisodeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [activeEpisode, setActiveEpisode] = useState<HeadacheEpisode | null>(null);
  const [loadingEpisode, setLoadingEpisode] = useState(false);

  const checkForActiveEpisode = useCallback(async () => {
    if (!user) return;

    setLoadingEpisode(true);
    try {
      const { data, error } = await supabase
        .from('headache_episodes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setActiveEpisode(data as HeadacheEpisode | null);
    } catch (error) {
      console.error('Error checking for active episode:', error);
      toast.error('Failed to check for active episodes');
    } finally {
      setLoadingEpisode(false);
    }
  }, [user]);

  const startNewEpisode = useCallback(async (): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('headache_episodes')
        .insert({
          user_id: user.id,
          status: 'active' as const,
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      setActiveEpisode(data as HeadacheEpisode);
      toast.success('New headache episode started');
      return data.id;
    } catch (error) {
      console.error('Error starting new episode:', error);
      toast.error('Failed to start new episode');
      return null;
    }
  }, [user]);

  const continueActiveEpisode = useCallback(() => {
    if (activeEpisode) {
      toast.info('Continuing active episode');
    }
  }, [activeEpisode]);

  const completeEpisode = useCallback(async (episodeId: string) => {
    try {
      const { error } = await supabase
        .from('headache_episodes')
        .update({
          status: 'completed' as const,
          end_time: new Date().toISOString()
        })
        .eq('id', episodeId);

      if (error) throw error;
      
      setActiveEpisode(null);
      toast.success('Episode completed');
    } catch (error) {
      console.error('Error completing episode:', error);
      toast.error('Failed to complete episode');
    }
  }, []);

  const updateEpisode = useCallback(async (episodeId: string, updates: Partial<HeadacheEpisode>) => {
    try {
      const { data, error } = await supabase
        .from('headache_episodes')
        .update(updates as any)
        .eq('id', episodeId)
        .select()
        .single();

      if (error) throw error;
      
      setActiveEpisode(data as HeadacheEpisode);
    } catch (error) {
      console.error('Error updating episode:', error);
      toast.error('Failed to update episode');
    }
  }, []);

  return (
    <EpisodeContext.Provider
      value={{
        activeEpisode,
        loadingEpisode,
        checkForActiveEpisode,
        startNewEpisode,
        continueActiveEpisode,
        completeEpisode,
        updateEpisode
      }}
    >
      {children}
    </EpisodeContext.Provider>
  );
};
