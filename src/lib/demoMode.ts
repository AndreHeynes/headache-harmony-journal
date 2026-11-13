import type { DemoScenarioId } from './demoScenarios';

const DEMO_KEY = 'journal-real-screen-demo-v1';
const SCENARIO_KEY = 'journal-real-screen-scenario-v1';

export const DEMO_USER_ID = '00000000-0000-4000-8000-000000000001';
export const DEMO_LOG_EPISODE_ID = '00000000-0000-4000-8000-000000000002';

/** Tab-scoped, in-memory demo mode for real screens. It never creates an account or session. */
export function isDemoMode(search = typeof window !== 'undefined' ? window.location.search : ''): boolean {
  const value = new URLSearchParams(search).get('demo');
  try {
    if (value === '1') sessionStorage.setItem(DEMO_KEY, '1');
    if (value === '0') sessionStorage.removeItem(DEMO_KEY);
    return sessionStorage.getItem(DEMO_KEY) === '1';
  } catch {
    return value === '1';
  }
}

export function disableDemoMode() {
  try {
    sessionStorage.removeItem(DEMO_KEY);
    sessionStorage.removeItem(SCENARIO_KEY);
  } catch { /* storage may be unavailable */ }
}

export function getDemoScenario(search = typeof window !== 'undefined' ? window.location.search : ''): DemoScenarioId {
  const requested = new URLSearchParams(search).get('scenario');
  try {
    if (requested === 'light' || requested === 'busy' || requested === 'party') {
      sessionStorage.setItem(SCENARIO_KEY, requested);
      return requested;
    }
    const stored = sessionStorage.getItem(SCENARIO_KEY);
    return stored === 'light' || stored === 'party' ? stored : 'busy';
  } catch {
    return requested === 'light' || requested === 'party' ? requested : 'busy';
  }
}
