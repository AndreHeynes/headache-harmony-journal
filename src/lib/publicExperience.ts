import { REGION_LABELS } from './regionMapping';

export const JOURNAL_URL = 'https://journal.headacherecovery.org';
export const GUEST_DRAFT_KEY = 'journal-trial-draft-v1';
export interface TrialArea {
  id: string;
  order: number;
  firstSelectedAt: string;
  selected: boolean;
  intensity: number | null;
  symptoms: string[];
  triggers: string[];
  treatment: string;
  treatmentTiming: string;
  reliefTiming: string;
  outcome: string;
  notes: string;
}
export interface TrialDraft {
  version: 1;
  id: string;
  startedAt: string;
  duration: number | null;
  areas: TrialArea[];
}
export const newTrialDraft = (): TrialDraft => ({ version: 1, id: crypto.randomUUID(), startedAt: new Date().toISOString(), duration: null, areas: [] });
export function selectTrialAreas(draft: TrialDraft, selected: string[], now = new Date().toISOString()): TrialDraft {
  const known = draft.areas.map(a => ({ ...a, selected: selected.includes(a.id) }));
  let order = Math.max(0, ...known.map(a => a.order));
  for (const id of selected) {
    if (!REGION_LABELS[id] || known.some(a => a.id === id)) continue;
    known.push({ id, order: ++order, firstSelectedAt: now, selected: true, intensity: null, symptoms: [], triggers: [], treatment: '', treatmentTiming: '', reliefTiming: '', outcome: '', notes: '' });
  }
  return { ...draft, areas: known };
}
export function readTrialDraft(): TrialDraft | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(GUEST_DRAFT_KEY) || 'null');
    if (!value || value.version !== 1 || typeof value.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(value.id) || !Array.isArray(value.areas)) return null;
    if (!Number.isFinite(Date.parse(value.startedAt))) return null;
    if (value.duration !== null && (!Number.isFinite(value.duration) || value.duration < 0)) return null;
    if (new Set(value.areas.map((a: TrialArea) => a.id)).size !== value.areas.length) return null;
    if (value.areas.some((a: TrialArea) => !a || !REGION_LABELS[a.id] || !Number.isInteger(a.order) || a.order < 1 || !Number.isFinite(Date.parse(a.firstSelectedAt)) || typeof a.selected !== 'boolean' || (a.intensity !== null && (!Number.isInteger(a.intensity) || a.intensity < 1 || a.intensity > 10)) || !Array.isArray(a.symptoms) || !a.symptoms.every(s => typeof s === 'string') || !Array.isArray(a.triggers) || !a.triggers.every(s => typeof s === 'string') || [a.treatment, a.treatmentTiming, a.reliefTiming, a.outcome, a.notes].some(s => typeof s !== 'string'))) return null;
    return value as TrialDraft;
  } catch { return null; }
}
export const selectedTrialAreas = (draft: TrialDraft) => draft.areas.filter(a => a.selected).sort((a, b) => a.order - b.order);
export const TRIAL_OUTCOMES = { effective: 'Effective', partially_effective: 'Partially effective', not_effective: 'Not effective', worsened: 'Worsened' };