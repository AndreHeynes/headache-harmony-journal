import { describe, expect, it } from 'vitest';
import { buildAnalysisUnits, type AreaRow } from '../analysis';
import { createDemoDatabase } from '../demoData';
import { getDemoAnalysisDate } from '../demoScenarios';
import { calculateMedicationAnalysis } from '@/hooks/useMedicationAnalysis';
import type { HeadacheEpisode } from '@/types/episode';

describe('medication analysis reporting window', () => {
  it('counts exactly 8 Busy-month medicine uses on 8 days and keeps Rest separate', () => {
    const db = createDemoDatabase('busy');
    const episodes = db.headache_episodes.filter(episode => episode.status === 'completed') as HeadacheEpisode[];
    const units = buildAnalysisUnits(episodes, db.episode_locations as AreaRow[]);
    const result = calculateMedicationAnalysis(episodes, units, getDemoAnalysisDate('busy'));

    expect(result.totalMedicationDays).toBe(8);
    expect(result.medications).toHaveLength(1);
    expect(result.medications[0].medication).toBe('Pain medicine');
    expect(result.medications[0].usesLast30Days).toBe(8);
    expect(result.medications[0].daysLast30Days).toBe(8);
    expect(result.medications.some(item => item.medication.toLowerCase() === 'rest')).toBe(false);
    expect(result.otherTreatments.find(item => item.treatment === 'Rest')?.usesLast30Days).toBe(10);
  });

  it('does not infer an average relief time from episode duration', () => {
    const db = createDemoDatabase('busy');
    const episodes = db.headache_episodes.filter(episode => episode.status === 'completed') as HeadacheEpisode[];
    const units = buildAnalysisUnits(episodes, db.episode_locations as AreaRow[]);
    const result = calculateMedicationAnalysis(episodes, units, getDemoAnalysisDate('busy'));

    expect(result.medications[0].avgReliefTimeMinutes).toBeNull();
  });
});
