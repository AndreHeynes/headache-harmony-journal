import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HeadacheEpisode } from '@/types/episode';
import {
  fetchAnalysisData,
  AnalysisUnit,
  extractMedicationNames,
  extractOtherTreatmentNames,
} from '@/lib/analysis';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { getDemoScenario, isDemoMode } from '@/lib/demoMode';
import { getDemoAnalysisDate } from '@/lib/demoScenarios';

interface MedicationUsage {
  medication: string;
  totalUses: number;
  usesLast30Days: number;
  usesLast7Days: number;
  daysLast30Days: number;
  avgEffectiveness: number;
  avgReliefTimeMinutes: number | null;
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

interface OtherTreatmentUsage {
  treatment: string;
  usesLast30Days: number;
}

interface MedicationAnalysisData {
  medications: MedicationUsage[];
  otherTreatments: OtherTreatmentUsage[];
  totalMedicationDays: number;
  medicationOveruseRisk: boolean;
  overuseAlertCount: number;
  mostEffectiveMedication: string | null;
  leastSideEffectsMedication: string | null;
}

const COMMON_SIDE_EFFECTS = ['nausea', 'dizziness', 'fatigue', 'drowsiness', 'stomach upset', 'dry mouth'];

const OVERUSE_THRESHOLDS: Record<string, number> = {
  default: 15,
  triptans: 10,
  opioids: 10,
  ibuprofen: 15,
  acetaminophen: 15,
  aspirin: 15,
  naproxen: 15,
  sumatriptan: 10,
  rizatriptan: 10,
  ergotamine: 10,
};

type TreatmentUse = {
  date: Date;
  day: string;
  effectiveness?: number;
  reliefMinutes?: number;
  sideEffects?: string[];
};

const emptyAnalysis = (): MedicationAnalysisData => ({
  medications: [],
  otherTreatments: [],
  totalMedicationDays: 0,
  medicationOveruseRisk: false,
  overuseAlertCount: 0,
  mostEffectiveMedication: null,
  leastSideEffectsMedication: null,
});

/** Pure 30-day calculation. Demo callers pass the fixed scenario end date instead of the live clock. */
export function calculateMedicationAnalysis(
  episodes: HeadacheEpisode[],
  units: AnalysisUnit[],
  referenceDate: Date,
): MedicationAnalysisData {
  if (episodes.length === 0) return emptyAnalysis();

  const periodEnd = endOfDay(referenceDate);
  const thirtyDaysStart = startOfDay(subDays(referenceDate, 29));
  const sevenDaysStart = startOfDay(subDays(referenceDate, 6));
  const inLast30Days = (date: Date) => date >= thirtyDaysStart && date <= periodEnd;
  const medicationDays = new Set<string>();
  const medicationMap = new Map<string, { uses: TreatmentUse[] }>();
  const otherMap = new Map<string, { uses: TreatmentUse[] }>();
  const seenMedications = new Set<string>();
  const seenOther = new Set<string>();

  units.forEach(unit => {
    const treatment = unit.treatment as any;
    if (!treatment) return;
    const date = new Date(unit.start_time);
    const day = format(date, 'yyyy-MM-dd');
    const effectiveness = Number(treatment.effectiveness) > 0 ? Number(treatment.effectiveness) : undefined;
    const recordedRelief = Number(treatment.relief_time_minutes ?? treatment.reliefMinutes);
    const reliefMinutes = Number.isFinite(recordedRelief) && recordedRelief >= 0 ? recordedRelief : undefined;
    const sideEffects: string[] = treatment.sideEffects
      ? (Array.isArray(treatment.sideEffects) ? treatment.sideEffects : [treatment.sideEffects])
      : [];
    const use = { date, day, effectiveness, reliefMinutes, sideEffects };

    const medicationNames = extractMedicationNames(treatment);
    medicationNames.forEach(name => {
      const key = name.toLowerCase().trim();
      const dedupe = `${unit.episodeId}|${key}`;
      if (!key || seenMedications.has(dedupe)) return;
      seenMedications.add(dedupe);
      const existing = medicationMap.get(key) || { uses: [] };
      existing.uses.push(use);
      medicationMap.set(key, existing);
      if (inLast30Days(date)) medicationDays.add(day);
    });

    extractOtherTreatmentNames(treatment).forEach(name => {
      const key = name.toLowerCase().trim();
      const dedupe = `${unit.episodeId}|${key}`;
      if (!key || seenOther.has(dedupe)) return;
      seenOther.add(dedupe);
      const existing = otherMap.get(key) || { uses: [] };
      existing.uses.push(use);
      otherMap.set(key, existing);
    });
  });

  const medications: MedicationUsage[] = Array.from(medicationMap.entries()).map(([medication, data]) => {
    const usesLast30 = data.uses.filter(use => inLast30Days(use.date));
    const usesLast30Days = usesLast30.length;
    const usesLast7Days = usesLast30.filter(use => use.date >= sevenDaysStart).length;
    const daysLast30Days = new Set(usesLast30.map(use => use.day)).size;
    const usesWithEffectiveness = data.uses.filter(use => use.effectiveness !== undefined);
    const avgEffectiveness = usesWithEffectiveness.length > 0
      ? Math.round((usesWithEffectiveness.reduce((sum, use) => sum + (use.effectiveness || 0), 0) / usesWithEffectiveness.length) * 10) / 10
      : 0;
    const usesWithRelief = data.uses.filter(use => use.reliefMinutes !== undefined);
    const avgReliefTimeMinutes = usesWithRelief.length > 0
      ? Math.round(usesWithRelief.reduce((sum, use) => sum + (use.reliefMinutes || 0), 0) / usesWithRelief.length)
      : null;
    const threshold = OVERUSE_THRESHOLDS[medication] || OVERUSE_THRESHOLDS.default;
    const overuseAlert = daysLast30Days >= threshold;
    const overuseMessage = overuseAlert
      ? `Used on ${daysLast30Days} days in the last 30 days (counter threshold: ${threshold} days). Discuss this with a healthcare provider.`
      : null;

    const sideEffectCounts = new Map<string, { count: number; severities: string[] }>();
    data.uses.forEach(use => {
      (use.sideEffects || []).forEach(effect => {
        const effectLower = effect.toLowerCase();
        const existing = sideEffectCounts.get(effectLower) || { count: 0, severities: [] };
        existing.count++;
        if (COMMON_SIDE_EFFECTS.some(common => effectLower.includes(common))) {
          if (effectLower.includes('severe')) existing.severities.push('severe');
          else if (effectLower.includes('moderate')) existing.severities.push('moderate');
          else existing.severities.push('mild');
        } else {
          existing.severities.push('mild');
        }
        sideEffectCounts.set(effectLower, existing);
      });
    });

    const sideEffects = Array.from(sideEffectCounts.entries()).map(([effect, details]) => {
      const severityCounts = details.severities.reduce((counts, severity) => {
        counts[severity] = (counts[severity] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
      const mostCommonSeverity = Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as SideEffectSummary['severity'] || 'mild';
      return {
        effect: effect.replace(/mild|moderate|severe/gi, '').trim() || effect,
        severity: mostCommonSeverity,
        occurrences: details.count,
        percentageOfUses: Math.round((details.count / data.uses.length) * 100),
      };
    }).sort((a, b) => b.occurrences - a.occurrences);

    return {
      medication: medication.charAt(0).toUpperCase() + medication.slice(1),
      totalUses: data.uses.length,
      usesLast30Days,
      usesLast7Days,
      daysLast30Days,
      avgEffectiveness,
      avgReliefTimeMinutes,
      overuseAlert,
      overuseMessage,
      sideEffects,
    };
  }).sort((a, b) => b.usesLast30Days - a.usesLast30Days);

  const otherTreatments = Array.from(otherMap.entries()).map(([treatment, data]) => ({
    treatment: treatment.charAt(0).toUpperCase() + treatment.slice(1),
    usesLast30Days: data.uses.filter(use => inLast30Days(use.date)).length,
  })).filter(item => item.usesLast30Days > 0).sort((a, b) => b.usesLast30Days - a.usesLast30Days);

  const overuseAlertCount = medications.filter(medication => medication.overuseAlert).length;
  const effectiveMeds = medications.filter(medication => medication.avgEffectiveness > 0);

  return {
    medications,
    otherTreatments,
    totalMedicationDays: medicationDays.size,
    medicationOveruseRisk: overuseAlertCount > 0 || medicationDays.size >= 15,
    overuseAlertCount,
    mostEffectiveMedication: effectiveMeds.length > 0
      ? [...effectiveMeds].sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)[0].medication
      : null,
    leastSideEffectsMedication: medications.length > 0
      ? [...medications].sort((a, b) => a.sideEffects.length - b.sideEffects.length)[0].medication
      : null,
  };
}

export const useMedicationAnalysis = () => {
  const { user } = useAuth();
  const [episodes, setEpisodes] = useState<HeadacheEpisode[]>([]);
  const [units, setUnits] = useState<AnalysisUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const referenceTime = useMemo(
    () => (isDemoMode() ? getDemoAnalysisDate(getDemoScenario()) : new Date()).getTime(),
    [user?.id],
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchEpisodes = async () => {
      try {
        const result = await fetchAnalysisData(user.id, { from: subDays(new Date(referenceTime), 90) });
        setEpisodes(result.episodes);
        setUnits(result.units);
      } catch (err) {
        console.error('Error fetching medication data:', err);
        setError('Failed to load medication data');
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [user, referenceTime]);

  const analysisData = useMemo(
    () => calculateMedicationAnalysis(episodes, units, new Date(referenceTime)),
    [episodes, units, referenceTime],
  );

  return { ...analysisData, loading, error, hasData: episodes.length > 0 };
};
