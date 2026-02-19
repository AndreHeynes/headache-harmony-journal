import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface ScreeningResponses {
  // Onset
  onsetSudden?: boolean;
  worstHeadacheEver?: boolean;
  // Neurological
  hasNeurologicalSymptoms?: boolean;
  neuroOnsetSudden?: boolean;
  // Systemic
  hasSystemicSymptoms?: boolean;
  hasStiffNeckOrRash?: boolean;
  // Older age (from useRedFlagCheck)
  isFirstAfter50?: boolean;
  // Pattern change
  hasPatternChange?: boolean;
  isWorsening?: boolean;
  // Positional
  hasPositionalFactors?: boolean;
  hasPapilledema?: boolean;
}

export interface RedFlagResult {
  criterion: string;
  label: string;
  priority: PriorityLevel;
  detail: string;
}

interface UseRedFlagScreeningReturn {
  responses: ScreeningResponses;
  updateResponse: (key: keyof ScreeningResponses, value: boolean) => void;
  flags: RedFlagResult[];
  highestPriority: PriorityLevel;
  priorityMessage: { title: string; body: string; icon: 'high' | 'medium' | 'low' };
  saveScreeningResults: (episodeId: string) => Promise<void>;
  hasAnyFlags: boolean;
}

function evaluateFlags(r: ScreeningResponses): RedFlagResult[] {
  const flags: RedFlagResult[] = [];

  // O – Onset sudden
  if (r.onsetSudden) {
    flags.push({
      criterion: 'O_onset',
      label: 'Sudden Onset',
      priority: 'high',
      detail: r.worstHeadacheEver
        ? 'Sudden onset headache described as the worst headache ever — possible thunderclap headache.'
        : 'Headache reached peak intensity in under 1 minute.',
    });
  }

  // N – Neurological symptoms
  if (r.hasNeurologicalSymptoms) {
    flags.push({
      criterion: 'N_neuro',
      label: 'Neurological Symptoms',
      priority: 'high',
      detail: r.neuroOnsetSudden
        ? 'Neurological symptoms with sudden onset — urgent evaluation recommended.'
        : 'Neurological symptoms present (weakness, numbness, speech or vision changes).',
    });
  }

  // S – Systemic symptoms
  if (r.hasSystemicSymptoms) {
    if (r.hasStiffNeckOrRash) {
      flags.push({
        criterion: 'S_systemic',
        label: 'Systemic Symptoms with Stiff Neck/Rash',
        priority: 'high',
        detail: 'Systemic symptoms with stiff neck or rash — could indicate meningitis or serious infection.',
      });
    } else {
      flags.push({
        criterion: 'S_systemic',
        label: 'Systemic Symptoms',
        priority: 'medium',
        detail: 'Fever, chills, night sweats, or unexplained weight loss reported alongside headache.',
      });
    }
  }

  // O – Older age
  if (r.isFirstAfter50) {
    flags.push({
      criterion: 'O_age',
      label: 'First Headache After Age 50',
      priority: 'medium',
      detail: 'First-ever headache onset after age 50 — new-onset headaches at this age may warrant further investigation.',
    });
  }

  // P – Pattern change
  if (r.hasPatternChange) {
    if (r.isWorsening) {
      flags.push({
        criterion: 'P_pattern',
        label: 'Progressive Worsening',
        priority: 'medium',
        detail: 'Headache pattern has changed and is progressively worsening over days or weeks.',
      });
    } else {
      flags.push({
        criterion: 'P_pattern',
        label: 'Pattern Change',
        priority: 'low',
        detail: 'Headache pattern differs from usual but is not progressively worsening.',
      });
    }
  }

  // P – Positional / precipitating
  if (r.hasPositionalFactors) {
    if (r.hasPapilledema) {
      flags.push({
        criterion: 'P_positional',
        label: 'Positional with Papilledema',
        priority: 'high',
        detail: 'Positional headache with known papilledema — may indicate raised intracranial pressure.',
      });
    } else {
      flags.push({
        criterion: 'P_positional',
        label: 'Positional / Precipitating Factors',
        priority: 'medium',
        detail: 'Headache worsens with position changes, coughing, or exertion.',
      });
    }
  }

  return flags;
}

function getHighestPriority(flags: RedFlagResult[]): PriorityLevel {
  if (flags.some(f => f.priority === 'high')) return 'high';
  if (flags.some(f => f.priority === 'medium')) return 'medium';
  return 'low';
}

const PRIORITY_MESSAGES = {
  high: {
    title: 'Seek Medical Care Immediately',
    body: 'Your responses suggest a type of headache that can be linked to serious medical conditions. Please contact a healthcare provider today.\n\nThis is not a diagnosis and does not replace medical evaluation.',
    icon: 'high' as const,
  },
  medium: {
    title: 'Schedule an Appointment Soon',
    body: 'Your responses suggest changes in your headache pattern that should be evaluated by a doctor.\n\nThis is not a diagnosis and does not replace medical evaluation.',
    icon: 'medium' as const,
  },
  low: {
    title: 'No Urgent Warning Signs Detected',
    body: 'Continue tracking your symptoms. Seek medical advice if your symptoms change or worsen.',
    icon: 'low' as const,
  },
};

export const useRedFlagScreening = (): UseRedFlagScreeningReturn => {
  const { user } = useAuth();
  const [responses, setResponses] = useState<ScreeningResponses>({});

  const updateResponse = useCallback((key: keyof ScreeningResponses, value: boolean) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  }, []);

  const flags = useMemo(() => evaluateFlags(responses), [responses]);
  const highestPriority = useMemo(() => getHighestPriority(flags), [flags]);
  const priorityMessage = PRIORITY_MESSAGES[highestPriority];
  const hasAnyFlags = flags.some(f => f.priority !== 'low');

  const saveScreeningResults = useCallback(async (episodeId: string) => {
    if (!user) return;

    // Only save if there are actual flags detected
    if (flags.length === 0) return;

    try {
      await supabase.from('red_flags').insert({
        user_id: user.id,
        episode_id: episodeId,
        flag_type: 'snoop_screening',
        priority_level: highestPriority,
        flag_details: {
          flags: flags.map(f => ({ criterion: f.criterion, label: f.label, priority: f.priority, detail: f.detail })),
          detected_at: new Date().toISOString(),
        },
        screening_responses: responses as any,
      });
    } catch (err) {
      console.error('Error saving screening results:', err);
    }
  }, [user, flags, highestPriority, responses]);

  return {
    responses,
    updateResponse,
    flags,
    highestPriority,
    priorityMessage,
    saveScreeningResults,
    hasAnyFlags,
  };
};
