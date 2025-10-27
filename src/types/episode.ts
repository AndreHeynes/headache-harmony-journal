export interface TreatmentLog {
  medications?: Array<{
    name: string;
    dosage: string;
    timing: string;
    effectiveness?: number;
  }>;
  otherTreatments?: string[];
  effectiveness?: number;
  sideEffects?: string[];
  notes?: string;
  [key: string]: any; // Allow additional properties for JSON compatibility
}

export interface HeadacheEpisode {
  id: string;
  user_id: string;
  status: 'active' | 'completed';
  start_time: string;
  end_time?: string | null;
  pain_location?: string | null;
  pain_intensity?: number | null;
  duration_minutes?: number | null;
  symptoms?: string[] | null;
  triggers?: string[] | null;
  treatment?: any; // Use any for JSON compatibility
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EpisodeContextType {
  activeEpisode: HeadacheEpisode | null;
  loadingEpisode: boolean;
  checkForActiveEpisode: () => Promise<void>;
  startNewEpisode: () => Promise<string | null>;
  continueActiveEpisode: () => void;
  completeEpisode: (episodeId: string) => Promise<void>;
  updateEpisode: (episodeId: string, updates: Partial<HeadacheEpisode>) => Promise<void>;
}
