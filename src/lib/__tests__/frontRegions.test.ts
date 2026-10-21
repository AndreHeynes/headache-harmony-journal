import { describe, it, expect } from 'vitest';
import { FRONT_REGIONS } from '@/components/skull-map/frontRegions';
import { BACK_REGIONS } from '@/components/skull-map/backRegions';
import { REGION_LABELS, LEGACY_TO_REGION } from '../regionMapping';

const firstX = (d: string) => Number(d.match(/M(\d+)/)![1]);

describe('front view', () => {
  it('has the 6 broad and 16 detailed regions', () => {
    expect(FRONT_REGIONS.filter((r) => !r.parent)).toHaveLength(6);
    expect(FRONT_REGIONS.filter((r) => r.parent)).toHaveLength(16);
  });
  it('every region has a label', () => {
    for (const r of FRONT_REGIONS) expect(REGION_LABELS[r.id]).toBeDefined();
  });
  it('detailed regions paint on top of their broad parent', () => {
    const ids = FRONT_REGIONS.map((r) => r.id);
    for (const r of FRONT_REGIONS.filter((x) => x.parent)) expect(ids.indexOf(r.id)).toBeGreaterThan(ids.indexOf(r.parent!));
  });
  it('facing the patient, their right is on the viewer left', () => {
    const at = (id: string) => firstX(FRONT_REGIONS.find((r) => r.id === id)!.d);
    for (const b of ['temple', 'eye', 'jaw', 'brow']) expect(at(`r-${b}`)).toBeLessThan(at(`l-${b}`));
  });
  it('every mapped old area can be picked on front or back', () => {
    const ids = new Set([...FRONT_REGIONS, ...BACK_REGIONS].map((r) => r.id));
    for (const id of Object.values(LEGACY_TO_REGION)) expect(ids.has(id)).toBe(true);
  });
});
