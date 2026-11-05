export const BETA_TOTAL_DAYS = 56;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface BetaStatus {
  expiresAt: Date | null;
  dayNumber: number;
  totalDays: number;
  expired: boolean;
}

/** Day X of 56, counted from signup (expiry minus 56 days). Day 1 = signup day. */
export function computeBetaStatus(expiresAt: string | Date | null | undefined, now: Date = new Date()): BetaStatus {
  if (!expiresAt) return { expiresAt: null, dayNumber: 0, totalDays: BETA_TOTAL_DAYS, expired: false };
  const end = new Date(expiresAt);
  const start = end.getTime() - BETA_TOTAL_DAYS * DAY_MS;
  const expired = now.getTime() >= end.getTime();
  const day = Math.floor((now.getTime() - start) / DAY_MS) + 1;
  return {
    expiresAt: end,
    dayNumber: Math.min(BETA_TOTAL_DAYS, Math.max(1, day)),
    totalDays: BETA_TOTAL_DAYS,
    expired,
  };
}
