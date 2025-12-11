import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import { subDays, differenceInDays, startOfDay, format } from 'date-fns';

interface MedicationUsage {
  medication: string;
  totalUses: number;
  usesLast30Days: number;
  usesLast7Days: number;
  avgEffectiveness: number;
  avgReliefTimeMinutes: number;
  overuseAlert: boolean;
  overuseMessage: string | null;
  sideEffects: SideEffectSummary[];
}

interface SideEffectSummary {
  effect: string;
  severity: 'mild' | 'moderate' | 'severe';
  occurrences: number;
  percentageOfUses: number;
}

interface MedicationAnalysisData {
  medications: MedicationUsage[];
  totalMedicationDays: number;
  medicationOveruseRisk: boolean;
  overuseAlertCount: number;
  mostEffectiveMedication: string | null;
  leastSideEffectsMedication: string | null;
}

// Common side effects to track
const COMMON_SIDE_EFFECTS = ['nausea', 'dizziness', 'fatigue', 'drowsiness', 'stomach upset', 'dry mouth'];

// Overuse thresholds (per month) - based on medical guidelines
const OVERUSE_THRESHOLDS: Record<string, number> = {
  'default': 15, // Generic threshold - 15 days/month
  'triptans': 10, // Triptans - 10 days/month
  'opioids': 10, // Opioids - 10 days/month
  'ibuprofen': 15,
  'acetaminophen': 15,
  'aspirin': 15,
  'naproxen': 15,
  'sumatriptan': 10,
  'rizatriptan': 10,
  'ergotamine': 10,
};

export const useMedicationAnalysis = () => {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<HeadacheEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      try {
        // Fetch last 90 days for comprehensive analysis
        const startDate = subDays(new Date(), 90);

        const { data, error: fetchError } = await supabase
          .from('headache_episodes')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', startDate.toISOString())
          .order('start_time', { ascending: false });

        if (fetchError) throw fetchError;
        setEpisodes(data as HeadacheEpisode[]);
      } catch (err) {
        console.error('Error fetching medication data:', err);
        setError('Failed to load medication data');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [user]);

  const analysisData = useMemo<MedicationAnalysisData>(() => {
    const emptyResult: MedicationAnalysisData = {
      medications: [],
      totalMedicationDays: 0,
      medicationOveruseRisk: false,
      overuseAlertCount: 0,
      mostEffectiveMedication: null,
      leastSideEffectsMedication: null,
    };

    if (episodes.length === 0) return emptyResult;

    const thirtyDaysAgo = subDays(new Date(), 30);
    const sevenDaysAgo = subDays(new Date(), 7);

    // Extract medications from treatment data
    const medicationMap = new Map<string, {
      uses: Array<{ date: Date; duration: number; effectiveness?: number; sideEffects?: string[] }>;
    }>();

    episodes.forEach(ep => {
      const treatment = ep.treatment as any;
      if (!treatment) return;

      const epDate = new Date(ep.start_time);
      const duration = ep.duration_minutes || 0;

      // Handle various treatment data structures
      let medications: string[] = [];
      let effectiveness: number | undefined;
      let sideEffects: string[] = [];

      if (Array.isArray(treatment)) {
        medications = treatment.filter(t => typeof t === 'string');
      } else if (typeof treatment === 'object') {
        if (treatment.medications) {
          medications = Array.isArray(treatment.medications) ? treatment.medications : [treatment.medications];
        }
        if (treatment.type) {
          medications.push(treatment.type);
        }
        if (treatment.effectiveness !== undefined) {
          effectiveness = Number(treatment.effectiveness);
        }
        if (treatment.sideEffects) {
          sideEffects = Array.isArray(treatment.sideEffects) ? treatment.sideEffects : [treatment.sideEffects];
        }
      }

      medications.forEach(med => {
        const medLower = med.toLowerCase().trim();
        if (!medLower) return;

        const existing = medicationMap.get(medLower) || { uses: [] };
        existing.uses.push({ date: epDate, duration, effectiveness, sideEffects });
        medicationMap.set(medLower, existing);
      });
    });

    // Calculate medication statistics
    const medications: MedicationUsage[] = Array.from(medicationMap.entries()).map(([medication, data]) => {
      const totalUses = data.uses.length;
      const usesLast30Days = data.uses.filter(u => u.date >= thirtyDaysAgo).length;
      const usesLast7Days = data.uses.filter(u => u.date >= sevenDaysAgo).length;

      // Average effectiveness (assuming shorter duration = more effective)
      const usesWithEffectiveness = data.uses.filter(u => u.effectiveness !== undefined);
      const avgEffectiveness = usesWithEffectiveness.length > 0
        ? Math.round((usesWithEffectiveness.reduce((sum, u) => sum + (u.effectiveness || 0), 0) / usesWithEffectiveness.length) * 10) / 10
        : 0;

      // Average relief time
      const avgReliefTimeMinutes = totalUses > 0
        ? Math.round(data.uses.reduce((sum, u) => sum + u.duration, 0) / totalUses)
        : 0;

      // Check for overuse
      const threshold = OVERUSE_THRESHOLDS[medication] || OVERUSE_THRESHOLDS['default'];
      const overuseAlert = usesLast30Days >= threshold;
      const overuseMessage = overuseAlert
        ? `Used ${usesLast30Days} days in last 30 days (threshold: ${threshold} days). Risk of medication overuse headache.`
        : null;

      // Side effects analysis
      const sideEffectCounts = new Map<string, { count: number; severities: string[] }>();
      data.uses.forEach(use => {
        (use.sideEffects || []).forEach(effect => {
          const effectLower = effect.toLowerCase();
          const existing = sideEffectCounts.get(effectLower) || { count: 0, severities: [] };
          existing.count++;
          // Try to extract severity from effect string (e.g., "mild nausea")
          if (effectLower.includes('severe')) existing.severities.push('severe');
          else if (effectLower.includes('moderate')) existing.severities.push('moderate');
          else existing.severities.push('mild');
          sideEffectCounts.set(effectLower, existing);
        });
      });

      const sideEffects: SideEffectSummary[] = Array.from(sideEffectCounts.entries()).map(([effect, data]) => {
        // Determine most common severity
        const severityCounts = data.severities.reduce((acc, s) => {
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const mostCommonSeverity = Object.entries(severityCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] as 'mild' | 'moderate' | 'severe' || 'mild';

        return {
          effect: effect.replace(/mild|moderate|severe/gi, '').trim() || effect,
          severity: mostCommonSeverity,
          occurrences: data.count,
          percentageOfUses: Math.round((data.count / totalUses) * 100),
        };
      }).sort((a, b) => b.occurrences - a.occurrences);

      return {
        medication: medication.charAt(0).toUpperCase() + medication.slice(1),
        totalUses,
        usesLast30Days,
        usesLast7Days,
        avgEffectiveness,
        avgReliefTimeMinutes,
        overuseAlert,
        overuseMessage,
        sideEffects,
      };
    }).sort((a, b) => b.usesLast30Days - a.usesLast30Days);

    // Calculate overall statistics
    const uniqueMedicationDays = new Set(
      episodes
        .filter(ep => ep.treatment)
        .map(ep => format(new Date(ep.start_time), 'yyyy-MM-dd'))
    ).size;

    const overuseAlertCount = medications.filter(m => m.overuseAlert).length;
    const medicationOveruseRisk = overuseAlertCount > 0 || uniqueMedicationDays >= 15;

    // Find most effective medication
    const effectiveMeds = medications.filter(m => m.avgEffectiveness > 0);
    const mostEffectiveMedication = effectiveMeds.length > 0
      ? effectiveMeds.sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)[0].medication
      : null;

    // Find medication with least side effects
    const leastSideEffectsMedication = medications.length > 0
      ? medications.sort((a, b) => a.sideEffects.length - b.sideEffects.length)[0].medication
      : null;

    return {
      medications,
      totalMedicationDays: uniqueMedicationDays,
      medicationOveruseRisk,
      overuseAlertCount,
      mostEffectiveMedication,
      leastSideEffectsMedication,
    };
  }, [episodes]);

  return {
    ...analysisData,
    loading,
    error,
    hasData: episodes.length > 0,
  };
};
