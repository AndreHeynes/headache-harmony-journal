import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: {} }));
import { canExport, sortAreas, areaIsOrigin, csvAreaRows, CSV_AREA_HEADER, csvCell } from '../exportFormat';

const a = (o: any = {}) => ({ selection_order: 1, location_name: 'Left Temple', location_key: 'temple_left', deselected_at: null, first_selected_at: '2026-10-12T08:14:00Z', pain_intensity: 7, symptoms: null, triggers: ['Stress'], treatment: { medications: ['Ibuprofen'] }, treatment_timing: null, relief_timing: null, treatment_outcome: null, notes: null, ...o });

describe('export rules', () => {
  it('blocks export at 0 completed episodes and while loading, allows at 1', () => {
    expect(canExport(0)).toBe(false);
    expect(canExport(1, true)).toBe(false);
    expect(canExport(1)).toBe(true);
  });
  it('sorts areas by order and keeps gaps', () => {
    expect(sortAreas([a({ selection_order: 3 }), a({ selection_order: 1 })]).map(x => x.selection_order)).toEqual([1, 3]);
  });
  it('origin only on selected area 1', () => {
    expect(areaIsOrigin(a())).toBe(true);
    expect(areaIsOrigin(a({ deselected_at: '2026-10-12' }))).toBe(false);
    expect(areaIsOrigin(a({ selection_order: 2 }))).toBe(false);
  });
  it('CSV area rows have one value per column and escape quotes', () => {
    const rows = csvAreaRows([{ id: 'e1', date: '2026-10-12T08:00:00Z', areas: [a({ selection_order: 2, notes: 'said "ouch", left' }), a()] }]);
    expect(rows).toHaveLength(2);
    expect(rows[0].startsWith('"e1","2026-10-12T08:00:00Z",1,')).toBe(true);
    expect(rows[1]).toContain('"said ""ouch"", left"');
    expect(CSV_AREA_HEADER.split(',')).toHaveLength(16);
    expect(csvCell('a"b')).toBe('"a""b"');
  });
});
