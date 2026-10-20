import { describe, it, expect } from 'vitest';
import { BACK_REGIONS } from '@/components/skull-map/backRegions';
import { REGION_LABELS, resolveRegion } from '../regionMapping';

const firstX = (d: string) => Number(d.match(/M(\d+)/)![1]);

describe('back-of-head view', () => {
  it('offers left, right and center back of head, plus neck', () => {
    expect(BACK_REGIONS.map((r) => r.id).sort()).toEqual(['crown', 'l-occiput', 'neck', 'occiput', 'r-occiput']);
  });
  it('every region has a label', () => {
    for (const r of BACK_REGIONS) expect(REGION_LABELS[r.id]).toBeDefined();
  });
  it('patient left is drawn on the viewer left when seen from behind', () => {
    const l = BACK_REGIONS.find((r) => r.id === 'l-occiput')!;
    const rr = BACK_REGIONS.find((r) => r.id === 'r-occiput')!;
    expect(firstX(l.d)).toBeLessThan(firstX(rr.d));
  });
  it('center back of head is painted on top of the sides', () => {
    const ids = BACK_REGIONS.map((r) => r.id);
    expect(ids.indexOf('occiput')).toBeGreaterThan(ids.indexOf('l-occiput'));
    expect(ids.indexOf('occiput')).toBeGreaterThan(ids.indexOf('r-occiput'));
  });
  it('old back-view areas open on this view', () => {
    const ids = new Set(BACK_REGIONS.map((r) => r.id));
    for (const key of ['occipital_left', 'occipital_right', 'occipital_center', 'skull_base', 'crown'])
      expect(ids.has(resolveRegion({ location_key: key, location_name: 'x' }).id)).toBe(true);
  });
});
