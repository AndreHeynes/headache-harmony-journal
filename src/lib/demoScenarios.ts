// Fictional demo scenarios for screenshots. In-memory only: never read from or written to the database.
// Triggers use the formats the real logging step saves (Stress:, Food:, Beverage:, Activity:, Weather:).
export type DemoArea = { region: string; order: number; minutesAfterStart: number };
export type DemoEpisode = {
  date: string; hour: number; minutes: number; intensity: number;
  areas: DemoArea[]; triggers: string[]; painMedicine: boolean;
  outcome: 'effective' | 'partially_effective' | 'not_effective' | null; sleepHours: number;
};
export type DemoScenarioId = 'light' | 'busy' | 'party';

const ep = (date: string, hour: number, minutes: number, intensity: number, regions: string[], triggers: string[], painMedicine: boolean, outcome: DemoEpisode['outcome'], sleepHours: number): DemoEpisode =>
  ({ date, hour, minutes, intensity, triggers, painMedicine, outcome, sleepHours, areas: regions.map((region, i) => ({ region, order: i + 1, minutesAfterStart: i * 25 })) });

export const DEMO_SCENARIOS: Record<DemoScenarioId, { label: string; period: string; days: number; episodes: DemoEpisode[] }> = {
  light: { label: 'Light month', period: '1–30 November 2026', days: 30, episodes: [
    ep('2026-11-02', 16, 90, 4, ['l-temple'], ['Stress: Emotional (3h before)'], false, null, 7),
    ep('2026-11-05', 15, 120, 5, ['l-temple', 'l-eye'], ['Food: Skipped lunch (5h before)'], true, 'effective', 6),
    ep('2026-11-08', 18, 60, 3, ['forehead'], ['Activity: Screen work (2h before) [180 min]'], false, null, 7.5),
  ] },
  busy: { label: 'Busy month', period: '14 October–12 November 2026', days: 30, episodes: [
    ep('2026-10-14', 8, 240, 7, ['l-occiput', 'neck', 'l-temple'], ['Stress: Physical (6h before)'], true, 'partially_effective', 5.5),
    ep('2026-10-17', 17, 180, 6, ['l-temple', 'l-eye'], ['Stress: Financial (4h before)'], true, 'effective', 6),
    ep('2026-10-20', 9, 300, 8, ['neck', 'l-occiput', 'vertex'], ['Activity: Desk work (3h before) [240 min]'], true, 'not_effective', 5),
    ep('2026-10-23', 16, 120, 5, ['forehead'], ['Food: Skipped breakfast (6h before)'], false, null, 6.5),
    ep('2026-10-26', 7, 360, 8, ['l-occiput', 'neck', 'l-temple', 'l-eye'], ['Stress: Family (12h before)'], true, 'partially_effective', 4.5),
    ep('2026-10-29', 18, 150, 6, ['r-temple'], ['Weather: Pressure drop'], true, 'effective', 6),
    ep('2026-11-01', 8, 240, 7, ['neck', 'l-occiput'], ['Stress: Emotional (8h before)'], true, 'partially_effective', 5),
    ep('2026-11-04', 15, 90, 4, ['l-temple'], ['Beverage: Coffee (2h before)'], false, null, 7),
    ep('2026-11-08', 9, 270, 7, ['l-occiput', 'neck', 'vertex'], ['Stress: Physical (5h before)'], true, 'effective', 5.5),
    ep('2026-11-12', 17, 180, 6, ['l-temple', 'l-eye'], ['Food: Late dinner (10h before)'], true, 'not_effective', 6),
  ] },
  party: { label: 'Party-season week', period: '2–8 November 2026', days: 7, episodes: [
    ep('2026-11-02', 10, 180, 6, ['forehead', 'l-temple'], ['Activity: Late night out (12h before) [300 min]', 'Beverage: Wine (14h before)'], true, 'partially_effective', 4.5),
    ep('2026-11-04', 15, 120, 5, ['l-temple'], ['Food: Skipped lunch (5h before)', 'Stress: Family (6h before)'], true, 'effective', 6),
    ep('2026-11-06', 9, 240, 7, ['forehead', 'l-temple', 'l-eye'], ['Beverage: Wine (12h before)', 'Activity: Travel (8h before) [240 min]'], true, 'not_effective', 5),
    ep('2026-11-07', 11, 150, 6, ['neck', 'l-occiput'], ['Stress: Social (10h before)'], false, null, 5.5),
  ] },
};

const NECK = new Set(['neck', 'l-occiput', 'r-occiput', 'occiput']);
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Summary for the demo dashboard/analysis. Effectiveness excludes unrecorded outcomes (same rule as the app). */
export function summarizeDemo(id: DemoScenarioId) {
  const s = DEMO_SCENARIOS[id]; const e = s.episodes; const n = e.length;
  const headacheDays = new Set(e.map(x => x.date)).size;
  const medDays = new Set(e.filter(x => x.painMedicine).map(x => x.date)).size;
  const recorded = e.filter(x => x.painMedicine && x.outcome);
  const peak = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  e.forEach(x => { peak[x.hour < 5 ? 'Night' : x.hour < 12 ? 'Morning' : x.hour < 17 ? 'Afternoon' : x.hour < 22 ? 'Evening' : 'Night']++; });
  const multi = e.filter(x => x.areas.length > 1);
  const origins = new Map<string, number>(); e.forEach(x => origins.set(x.areas[0].region, (origins.get(x.areas[0].region) || 0) + 1));
  return {
    episodes: n, headacheDays, hours: round1(e.reduce((a, x) => a + x.minutes, 0) / 60),
    meanIntensity: n ? round1(e.reduce((a, x) => a + x.intensity, 0) / n) : 0,
    medDays, medThreshold: 15, medPerMonthPace: round1(medDays * (30 / s.days)),
    effectiveRatePct: recorded.length ? Math.round(100 * recorded.filter(x => x.outcome === 'effective').length / recorded.length) : null,
    recordedOutcomes: recorded.length,
    peak,
    spread: { multiArea: multi.length, avgMinutesToSecond: multi.length ? Math.round(multi.reduce((a, x) => a + x.areas[1].minutesAfterStart, 0) / multi.length) : null },
    origins: [...origins.entries()].sort((a, b) => b[1] - a[1]),
    neckEpisodes: e.filter(x => x.areas.some(a => NECK.has(a.region))).length,
    avgSleep: n ? round1(e.reduce((a, x) => a + x.sleepHours, 0) / n) : 0,
  };
}
