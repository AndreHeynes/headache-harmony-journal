import { describe, expect, it } from 'vitest';
import { createDemoAiReport, createDemoDatabase } from '../demoData';
import { DEMO_SCENARIOS } from '../demoScenarios';
import { SAMPLE_REPORT } from '../sampleReport';

const serialized = (value: unknown) => JSON.stringify(value).toLowerCase();

describe('real-screen fictional demo fixtures', () => {
  it('uses only fictional generic treatment wording and no real identity', () => {
    for (const id of Object.keys(DEMO_SCENARIOS) as Array<keyof typeof DEMO_SCENARIOS>) {
      const db = createDemoDatabase(id);
      const text = serialized(db);
      expect(text).toContain('sample@example.invalid');
      expect(text).not.toMatch(/ibuprofen|acetaminophen|paracetamol|sumatriptan|rizatriptan|aspirin|naproxen/);
      expect(serialized(SAMPLE_REPORT)).not.toMatch(/ibuprofen|acetaminophen|paracetamol|sumatriptan|rizatriptan|aspirin|naproxen/);
      expect(db.headache_episodes.every(e => e.notes?.includes('Fictional'))).toBe(true);
    }
  });

  it('keeps small samples explicitly insufficient in the AI report', () => {
    expect(createDemoAiReport('light').narrative.correlation_findings[0].strength).toBe('Insufficient data');
    expect(createDemoAiReport('party').narrative.correlation_findings[0].strength).toBe('Insufficient data');
    expect(createDemoAiReport('busy').narrative.correlation_findings[0].sample_size).toBe(10);
  });

  it('seeds completed episodes separately from the active log example', () => {
    const db = createDemoDatabase('busy');
    expect(db.headache_episodes.filter(e => e.status === 'completed')).toHaveLength(10);
    expect(db.headache_episodes.filter(e => e.status === 'active')).toHaveLength(1);
    expect(db.episode_locations.filter(l => l.episode_id === db.headache_episodes.find(e => e.status === 'active')?.id)).toHaveLength(3);
  });
});
