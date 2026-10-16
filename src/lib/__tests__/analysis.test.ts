import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: {} }));
import { buildAnalysisUnits, effectivenessRate, addOutcome, ANALYSIS_EPISODE_STATUS } from '../analysis';
import { resolveAreaKey, getAreaLabel, SKULL_HOTSPOTS } from '@/components/skull-viewer/skull-hotspots';

const ep = (o: any = {}) => ({ id: 'e1', user_id: 'u', status: 'completed', start_time: '2026-01-01T00:00:00Z', created_at: '', updated_at: '', duration_minutes: 60, pain_intensity: 5, triggers: ['Stress'], treatment: { medications: ['Ibuprofen'] }, treatment_outcome: 'effective', ...o });
const area = (o: any = {}) => ({ id: 'a', episode_id: 'e1', location_name: 'Left Temple', location_key: 'temple_left', deselected_at: null, is_origin: false, pain_intensity: null, symptoms: null, triggers: null, treatment: null, treatment_timing: null, relief_timing: null, treatment_outcome: null, ...o });

describe('effectiveness rate', () => {
  it('excludes blank outcomes instead of counting short episodes as effective', () => {
    const c = { effective: 0, partial: 0, notEffective: 0 };
    addOutcome(c, null); addOutcome(c, undefined); addOutcome(c, '');
    expect(effectivenessRate(c)).toBeNull();
  });
  it('is (effective + 0.5 x partial) / rated uses', () => {
    const c = { effective: 0, partial: 0, notEffective: 0 };
    ['effective', 'partially_effective', 'not_effective', null].forEach(o => addOutcome(c, o));
    expect(effectivenessRate(c)).toBe(50);
  });
});

describe('per-area analysis units', () => {
  it('uses each area\'s own triggers, intensity and treatment for multi-area episodes', () => {
    const units = buildAnalysisUnits([ep()] as any, [
      area({ id: 'a1', pain_intensity: 8, triggers: ['Cheese'], treatment: { medications: ['Sumatriptan'] }, treatment_outcome: 'not_effective' }),
      area({ id: 'a2', location_key: 'eye_right', location_name: 'Right Eye' }),
    ]);
    expect(units).toHaveLength(2);
    expect(units[0]).toMatchObject({ pain_intensity: 8, triggers: ['Cheese'], treatment_outcome: 'not_effective' });
    // blank area fields fall back to the episode
    expect(units[1]).toMatchObject({ pain_intensity: 5, triggers: ['Stress'], treatment_outcome: 'effective' });
  });
  it('uses episode fields for single-area episodes', () => {
    const units = buildAnalysisUnits([ep()] as any, [area({ pain_intensity: 9 })]);
    expect(units).toHaveLength(1);
    expect(units[0].pain_intensity).toBe(5);
  });
  it('ignores unselected areas', () => {
    const units = buildAnalysisUnits([ep()] as any, [area({ id: 'x', deselected_at: '2026-01-01' }), area({ id: 'y', deselected_at: '2026-01-01' })]);
    expect(units).toHaveLength(1);
  });
  it('only completed episodes are counted', () => {
    expect(ANALYSIS_EPISODE_STATUS).toBe('completed');
  });
});

describe('stable skull area keys', () => {
  it('keeps left and right separate on the side view', () => {
    const temple = SKULL_HOTSPOTS.find(h => h.id === 'side-temple')!;
    expect(resolveAreaKey(temple, 'left')).toBe('temple_left');
    expect(resolveAreaKey(temple, 'right')).toBe('temple_right');
    expect(getAreaLabel('temple_right')).toBe('Right Temple');
  });
  it('every front/back area key is unique except the shared pressure band', () => {
    const keys = SKULL_HOTSPOTS.filter(h => !h.sided && h.areaKey !== 'pressure_band').map(h => h.areaKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
