import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface EpisodeLocation {
  id: string;
  episode_id: string;
  user_id: string;
  location_name: string;
  location_key: string | null;
  deselected_at: string | null;
  is_origin: boolean;
  selection_order: number | null;
  first_selected_at: string | null;
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
  syncLocationsForEpisode: (episodeId: string, areas: Array<{ key: string; name: string }>) => Promise<void>;
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
        .is('deselected_at', null)
        .order('selection_order', { ascending: true });

      if (error) throw error;
      setLocations((data as EpisodeLocation[]) || []);
      if (data && data.length > 0 && !activeLocationId) {
        setActiveLocationId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  }, [user, activeLocationId]);

  /**
   * Reconcile the selected skull areas with stored rows WITHOUT deleting anything:
   * - existing rows are matched by stable key (or by name for legacy rows) and kept with their data
   * - newly selected areas get a new row (or a previously unselected row is restored)
   * - unselected areas are marked deselected_at so their data comes back if reselected
   */
  const runSync = useCallback(async (episodeId: string, areas: Array<{ key: string; name: string }>) => {
    if (!user) return;

    try {
      const { data: existingData, error: loadError } = await supabase
        .from('episode_locations')
        .select('*')
        .eq('episode_id', episodeId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (loadError) throw loadError;

      const existing = (existingData as EpisodeLocation[]) || [];
      const matched = new Set<string>();
      const findRow = (area: { key: string; name: string }) =>
        existing.find(r => !matched.has(r.id) && r.location_key === area.key) ||
        existing.find(r => !matched.has(r.id) && !r.location_key && r.location_name === area.name);

      const now = new Date().toISOString();
      const selectedRowIds: string[] = [];

      for (const area of areas) {
        const row = findRow(area);
        if (row) {
          matched.add(row.id);
          selectedRowIds.push(row.id);
          if (row.deselected_at || row.location_key !== area.key || row.location_name !== area.name) {
            await supabase
              .from('episode_locations')
              .update({ deselected_at: null, location_key: area.key, location_name: area.name })
              .eq('id', row.id);
          }
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from('episode_locations')
            .insert({
              episode_id: episodeId,
              user_id: user.id,
              location_name: area.name,
              location_key: area.key,
              is_origin: false,
            })
            .select()
            .single();
          if (insertError) throw insertError;
          selectedRowIds.push(inserted.id);
        }
      }

      // Soft-unselect rows no longer chosen (data is kept)
      const toDeselect = existing.filter(r => !matched.has(r.id) && !r.deselected_at).map(r => r.id);
      if (toDeselect.length > 0) {
        await supabase
          .from('episode_locations')
          .update({ deselected_at: now })
          .in('id', toDeselect);
      }

      // Origin is derived from selection_order = 1 (assigned once by the database).
      // is_origin is still written only for older readers.
      await supabase.from('episode_locations').update({ is_origin: false }).eq('episode_id', episodeId).neq('selection_order', 1);
      await supabase.from('episode_locations').update({ is_origin: true }).eq('episode_id', episodeId).eq('selection_order', 1).is('deselected_at', null);

      const { data: fresh, error: freshError } = await supabase
        .from('episode_locations')
        .select('*')
        .eq('episode_id', episodeId)
        .eq('user_id', user.id)
        .is('deselected_at', null)
        .order('selection_order', { ascending: true });
      if (freshError) throw freshError;

      const newLocations = (fresh as EpisodeLocation[]) || [];
      setLocations(newLocations);
      setActiveLocationId(prev =>
        prev && newLocations.some(l => l.id === prev) ? prev : newLocations[0]?.id ?? null
      );
    } catch (error) {
      console.error('Error saving locations:', error);
      toast.error('Failed to save pain locations');
    }
  }, [user]);

  // Serialize saves so quick taps on the skull can't create duplicate rows
  const syncQueue = useRef<Promise<void>>(Promise.resolve());
  const syncLocationsForEpisode = useCallback((episodeId: string, areas: Array<{ key: string; name: string }>) => {
    syncQueue.current = syncQueue.current.then(() => runSync(episodeId, areas));
    return syncQueue.current;
  }, [runSync]);

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
        syncLocationsForEpisode,
        updateLocation,
        loadLocations,
        clearLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
