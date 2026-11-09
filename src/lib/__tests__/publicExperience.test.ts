import { describe, it, expect, vi, afterEach } from 'vitest';
import { newTrialDraft, selectTrialAreas, selectedTrialAreas, readTrialDraft } from '../publicExperience';
import { canExport } from '../exportFormat';
import { SAMPLE_REPORT } from '../sampleReport';

afterEach(() => vi.unstubAllGlobals());
describe('public trial selection history', () => {
  it('keeps per-area details and original order on reselection', () => {
    let draft = selectTrialAreas(newTrialDraft(), ['l-temple', 'neck'], '2026-11-09T10:00:00Z');
    draft.areas[0].intensity = 8;
    draft.areas[0].treatment = 'Rest';
    draft = selectTrialAreas(draft, ['neck']);
    expect(selectedTrialAreas(draft).map(a => a.order)).toEqual([2]);
    draft = selectTrialAreas(draft, ['neck', 'l-temple']);
    expect(draft.areas[0]).toMatchObject({ order: 1, intensity: 8, treatment: 'Rest', firstSelectedAt: '2026-11-09T10:00:00Z' });
    expect(draft.areas).toHaveLength(2);
  });
  it('starts selection order independently for every draft', () => {
    expect(selectTrialAreas(newTrialDraft(), ['neck']).areas[0].order).toBe(1);
    expect(selectTrialAreas(newTrialDraft(), ['r-temple']).areas[0].order).toBe(1);
  });
  it('does not turn trial or sample records into export eligibility', () => {
    expect(SAMPLE_REPORT.episodes).toBe(6);
    expect(canExport(0)).toBe(false);
    expect(canExport(1)).toBe(true);
  });
  it('rejects invalid stored area IDs', () => {
    const draft = selectTrialAreas(newTrialDraft(), ['neck']);
    draft.areas[0].id = 'not-a-region';
    vi.stubGlobal('sessionStorage', { getItem: () => JSON.stringify(draft) });
    expect(readTrialDraft()).toBeNull();
  });
});