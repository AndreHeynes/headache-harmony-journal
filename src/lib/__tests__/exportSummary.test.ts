import { describe, it, expect } from "vitest";
import { frequencySummary, mohCounter } from "../exportFormat";

const now = new Date("2026-11-30T12:00:00Z");
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

describe("30/60-day frequency summary", () => {
  const recs = [
    { date: d(5), intensity: 6, duration: 120 },
    { date: d(20), intensity: 8, duration: 60 },
    { date: d(45), intensity: 4, duration: 30 },
  ];
  it("30 days counts only the last 30 days", () => {
    expect(frequencySummary(recs, 30, now)).toEqual({ days: 30, episodes: 2, totalHours: 3, avgIntensity: 7 });
  });
  it("60 days includes older episodes", () => {
    expect(frequencySummary(recs, 60, now).episodes).toBe(3);
  });
});

describe("medication overuse counter", () => {
  it("triptans flagged at 10 days a month", () => {
    const recs = Array.from({ length: 10 }, (_, i) => ({ date: d(i + 1), intensity: 5, duration: 60, treatments: ["Sumatriptan 50mg"] }));
    const t = mohCounter(recs, now).find((m) => m.cls === "triptan")!;
    expect(t.days).toBe(10);
    expect(t.atOrOver).toBe(true);
  });
  it("NSAIDs not flagged below 15 days, same day counted once", () => {
    const recs = [
      ...Array.from({ length: 14 }, (_, i) => ({ date: d(i + 1), intensity: 5, duration: 60, treatments: ["Ibuprofen"] })),
      { date: d(1), intensity: 5, duration: 60, treatments: ["Naproxen"] },
    ];
    const s = mohCounter(recs, now).find((m) => m.cls === "simple")!;
    expect(s.days).toBe(14);
    expect(s.atOrOver).toBe(false);
  });
});
