import { describe, it, expect } from "vitest";
import { computeBetaStatus } from "../betaStatus";

const DAY = 86400000;
const signup = new Date("2026-11-01T10:00:00Z");
const expires = new Date(signup.getTime() + 56 * DAY);

describe("beta premium window", () => {
  it("signup day is Day 1 of 56", () => {
    expect(computeBetaStatus(expires, signup).dayNumber).toBe(1);
  });
  it("last day before expiry is Day 56 and still active", () => {
    const s = computeBetaStatus(expires, new Date(expires.getTime() - 1000));
    expect(s.dayNumber).toBe(56);
    expect(s.expired).toBe(false);
  });
  it("expires exactly 56 days after signup", () => {
    expect(computeBetaStatus(expires, expires).expired).toBe(true);
  });
});
