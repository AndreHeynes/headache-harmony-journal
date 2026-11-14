import { describe, it, expect } from 'vitest';
import { DEMO_SCENARIOS, summarizeDemo } from '../demoScenarios';

describe('demo scenarios', () => {
  it('contain no drug or brand names, only "Pain medicine" as a flag', () => {
    const text = JSON.stringify(DEMO_SCENARIOS).toLowerCase();
    for (const w of ['ibuprofen', 'paracetamol', 'aspirin', 'triptan', 'sumatriptan', 'naproxen']) expect(text).not.toContain(w);
  });
  it('effectiveness excludes uses with no recorded outcome', () => {
    const s = summarizeDemo('light');
    expect(s.recordedOutcomes).toBe(1);
    expect(s.effectiveRatePct).toBe(100);
  });
  it('busy month counts 8 pain-medicine days against the 15-day counter', () => {
    const s = summarizeDemo('busy');
    expect(s.episodes).toBe(10);
    expect(s.medDays).toBe(8);
  });
  it('party season has five episodes and uses coffee rather than wine', () => {
    const s = summarizeDemo('party');
    expect(s.episodes).toBe(5);
    expect(JSON.stringify(DEMO_SCENARIOS.party)).toContain('Beverage: Coffee');
    expect(JSON.stringify(DEMO_SCENARIOS.party)).not.toContain('Beverage: Wine');
  });
});
