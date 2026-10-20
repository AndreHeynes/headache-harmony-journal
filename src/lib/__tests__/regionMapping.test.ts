import { describe, it, expect } from 'vitest';
import { resolveRegion, LEGACY_TO_REGION, REGION_LABELS } from '../regionMapping';

const r = (location_key: string | null, location_name = 'x') => resolveRegion({ location_key, location_name });

describe('region mapping', () => {
  it('every mapped key points to a real region', () => {
    for (const id of Object.values(LEGACY_TO_REGION)) expect(REGION_LABELS[id]).toBeDefined();
  });
  it('keeps the side', () => {
    expect(r('temple_left').id).toBe('l-temple');
    expect(r('occipital_right').id).toBe('r-occiput');
  });
  it('side forehead maps to the matching brow', () => {
    expect(r('forehead_left').id).toBe('l-brow');
    expect(r('forehead_right').id).toBe('r-brow');
  });
  it('pressure band stays a legacy area with its original name', () => {
    expect(r('pressure_band', 'Pressure Band')).toEqual({ id: 'legacy:pressure_band', label: 'Pressure Band', legacy: true });
  });
  it('new rows read their region key directly', () => {
    expect(r('region:teeth').id).toBe('teeth');
  });
  it('stored region_id wins', () => {
    expect(resolveRegion({ region_id: 'neck', location_key: 'skull_base', location_name: 'Base of Head' }).id).toBe('neck');
  });
});
