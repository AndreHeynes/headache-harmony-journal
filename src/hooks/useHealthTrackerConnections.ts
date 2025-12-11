import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TrackerProvider = 'fitbit' | 'oura' | 'garmin' | 'withings' | 'apple_health' | 'google_fit';

export interface TrackerConnection {
  id: string;
  provider: TrackerProvider;
  is_connected: boolean;
  last_sync_at: string | null;
  sync_enabled: boolean;
}

export interface TrackerInfo {
  provider: TrackerProvider;
  name: string;
  description: string;
  icon: string;
  dataTypes: string[];
  available: boolean;
  requiresNativeApp: boolean;
}

export const TRACKER_INFO: TrackerInfo[] = [
  {
    provider: 'fitbit',
    name: 'Fitbit',
    description: 'Sleep tracking, heart rate, and activity data',
    icon: '⌚',
    dataTypes: ['sleep', 'menstrual'],
    available: true,
    requiresNativeApp: false,
  },
  {
    provider: 'oura',
    name: 'Oura Ring',
    description: 'Advanced sleep stages and readiness scores',
    icon: '💍',
    dataTypes: ['sleep', 'menstrual'],
    available: true,
    requiresNativeApp: false,
  },
  {
    provider: 'garmin',
    name: 'Garmin',
    description: 'Sleep and stress tracking from Garmin devices',
    icon: '🏃',
    dataTypes: ['sleep'],
    available: true,
    requiresNativeApp: false,
  },
  {
    provider: 'withings',
    name: 'Withings',
    description: 'Sleep mat and health device data',
    icon: '🛏️',
    dataTypes: ['sleep'],
    available: true,
    requiresNativeApp: false,
  },
  {
    provider: 'apple_health',
    name: 'Apple Health',
    description: 'Sleep and cycle data from iPhone/Watch',
    icon: '🍎',
    dataTypes: ['sleep', 'menstrual'],
    available: false,
    requiresNativeApp: true,
  },
  {
    provider: 'google_fit',
    name: 'Google Fit',
    description: 'Sleep data from Android devices',
    icon: '🤖',
    dataTypes: ['sleep'],
    available: false,
    requiresNativeApp: true,
  },
];

export function useHealthTrackerConnections() {
  const [connections, setConnections] = useState<TrackerConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('health_tracker_connections')
        .select('id, provider, is_connected, last_sync_at, sync_enabled')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Cast provider to TrackerProvider type
      setConnections((data || []).map(conn => ({
        ...conn,
        provider: conn.provider as TrackerProvider
      })));
    } catch (error) {
      console.error('Error fetching tracker connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateConnection = async (provider: TrackerProvider) => {
    const trackerInfo = TRACKER_INFO.find(t => t.provider === provider);
    
    if (trackerInfo?.requiresNativeApp) {
      toast.info(`${trackerInfo.name} requires the native mobile app (coming soon)`);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to connect trackers');
        return;
      }

      // Handle Fitbit OAuth
      if (provider === 'fitbit') {
        toast.info('Connecting to Fitbit...');
        
        // Get auth URL from edge function
        const { data, error } = await supabase.functions.invoke('fitbit-auth-url', {
          body: { user_id: user.id }
        });

        if (error || !data?.auth_url) {
          console.error('Error getting Fitbit auth URL:', error);
          toast.error('Failed to initiate Fitbit connection');
          return;
        }

        // Open in a popup
        const width = 500;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        window.open(
          data.auth_url,
          'fitbit-oauth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
        
        toast.info('Complete the authorization in the popup window');
        return;
      }

      // Handle Oura OAuth
      if (provider === 'oura') {
        toast.info('Connecting to Oura Ring...');
        
        const { data, error } = await supabase.functions.invoke('oura-auth-url', {
          body: { user_id: user.id }
        });

        if (error || !data?.url) {
          console.error('Error getting Oura auth URL:', error);
          toast.error('Failed to initiate Oura connection');
          return;
        }

        const width = 500;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        window.open(
          data.url,
          'oura-oauth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
        
        toast.info('Complete the authorization in the popup window');
        return;
      }

      // For other providers, show coming soon message
      toast.info(`${trackerInfo?.name} connection coming soon! OAuth integration in progress.`);
      
      // Create a placeholder connection record
      const { error } = await supabase
        .from('health_tracker_connections')
        .upsert({
          user_id: user.id,
          provider,
          is_connected: false,
          sync_enabled: true,
        }, {
          onConflict: 'user_id,provider'
        });

      if (error) throw error;
      
      await fetchConnections();
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error('Failed to initiate connection');
    }
  };

  const disconnectTracker = async (provider: TrackerProvider) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('health_tracker_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', provider);

      if (error) throw error;
      
      toast.success('Tracker disconnected');
      await fetchConnections();
    } catch (error) {
      console.error('Error disconnecting tracker:', error);
      toast.error('Failed to disconnect tracker');
    }
  };

  const toggleSync = async (provider: TrackerProvider, enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('health_tracker_connections')
        .update({ sync_enabled: enabled })
        .eq('user_id', user.id)
        .eq('provider', provider);

      if (error) throw error;
      
      toast.success(`Sync ${enabled ? 'enabled' : 'disabled'}`);
      await fetchConnections();
    } catch (error) {
      console.error('Error toggling sync:', error);
      toast.error('Failed to update sync setting');
    }
  };

  const getConnectionStatus = (provider: TrackerProvider) => {
    return connections.find(c => c.provider === provider);
  };

  const syncTracker = async (provider: TrackerProvider, days: number = 7) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to sync data');
        return false;
      }

      if (provider === 'fitbit') {
        toast.info('Syncing Fitbit sleep data...');
        
        const { data, error } = await supabase.functions.invoke('fitbit-sync-sleep', {
          body: { user_id: user.id, days }
        });

        if (error) {
          console.error('Error syncing Fitbit:', error);
          toast.error('Failed to sync Fitbit data');
          return false;
        }

        if (data?.synced_dates?.length > 0) {
          toast.success(`Synced ${data.synced_dates.length} days of sleep data`);
        } else {
          toast.info('No new sleep data to sync');
        }
        
        await fetchConnections();
        return true;
      }

      if (provider === 'oura') {
        toast.info('Syncing Oura sleep data...');
        
        const { data, error } = await supabase.functions.invoke('oura-sync-sleep', {
          body: { user_id: user.id, days }
        });

        if (error) {
          console.error('Error syncing Oura:', error);
          toast.error('Failed to sync Oura data');
          return false;
        }

        if (data?.synced_dates?.length > 0) {
          toast.success(`Synced ${data.synced_dates.length} days of sleep data`);
        } else {
          toast.info('No new sleep data to sync');
        }
        
        await fetchConnections();
        return true;
      }

      toast.info(`${provider} sync not yet implemented`);
      return false;
    } catch (error) {
      console.error('Error syncing tracker:', error);
      toast.error('Failed to sync tracker data');
      return false;
    }
  };

  return {
    connections,
    loading,
    initiateConnection,
    disconnectTracker,
    toggleSync,
    syncTracker,
    getConnectionStatus,
    refetch: fetchConnections,
  };
}
