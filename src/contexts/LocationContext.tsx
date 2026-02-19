import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface EpisodeLocation {
  id: string;
  episode_id: string;
  user_id: string;
  location_name: string;
  is_origin: boolean;
  pain_intensity: number | null;
  symptoms: string[] | null;
  triggers: string[] | null;
  variables: any | null;
  treatment: any | null;
  treatment_timing: string | null;
  relief_timing: string | null;
  treatment_outcome: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LocationContextType {
  locations: EpisodeLocation[];
  activeLocationId: string | null;
  activeLocation: EpisodeLocation | null;
  setActiveLocationId: (id: string | null) => void;
  createLocationsForEpisode: (episodeId: string, locationNames: string[]) => Promise<void>;
  updateLocation: (locationId: string, updates: Partial<EpisodeLocation>) => Promise<void>;
  loadLocations: (episodeId: string) => Promise<void>;
  clearLocations: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocations must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<EpisodeLocation[]>([]);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  const activeLocation = locations.find(l => l.id === activeLocationId) || null;

  const loadLocations = useCallback(async (episodeId: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('episode_locations')
        .select('*')
        .eq('episode_id', episodeId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLocations((data as EpisodeLocation[]) || []);
      if (data && data.length > 0 && !activeLocationId) {
        setActiveLocationId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  }, [user, activeLocationId]);

  const createLocationsForEpisode = useCallback(async (episodeId: string, locationNames: string[]) => {
    if (!user || locationNames.length === 0) return;

    try {
      // Remove existing locations for this episode first
      await supabase
        .from('episode_locations')
        .delete()
        .eq('episode_id', episodeId)
        .eq('user_id', user.id);

      const rows = locationNames.map((name, index) => ({
        episode_id: episodeId,
        user_id: user.id,
        location_name: name,
        is_origin: index === 0, // First selected location is origin
      }));

      const { data, error } = await supabase
        .from('episode_locations')
        .insert(rows)
        .select();

      if (error) throw error;

      const newLocations = (data as EpisodeLocation[]) || [];
      setLocations(newLocations);
      if (newLocations.length > 0) {
        setActiveLocationId(newLocations[0].id);
      }
    } catch (error) {
      console.error('Error creating locations:', error);
      toast.error('Failed to save pain locations');
    }
  }, [user]);

  const updateLocation = useCallback(async (locationId: string, updates: Partial<EpisodeLocation>) => {
    try {
      const { data, error } = await supabase
        .from('episode_locations')
        .update(updates as any)
        .eq('id', locationId)
        .select()
        .single();

      if (error) throw error;

      setLocations(prev => prev.map(l => l.id === locationId ? (data as EpisodeLocation) : l));
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location data');
    }
  }, []);

  const clearLocations = useCallback(() => {
    setLocations([]);
    setActiveLocationId(null);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        locations,
        activeLocationId,
        activeLocation,
        setActiveLocationId,
        createLocationsForEpisode,
        updateLocation,
        loadLocations,
        clearLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
