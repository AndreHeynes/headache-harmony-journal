import { extractTreatmentNames } from './analysis';

/** Area of an episode as shown in exports (unselected areas included, in selection order). */
export interface ExportArea {
  selection_order: number | null;
  location_name: string;
  location_key: string | null;
  deselected_at: string | null;
  first_selected_at: string | null;
  pain_intensity: number | null;
  symptoms: string[] | null;
  triggers: string[] | null;
  treatment: any;
  treatment_timing: string | null;
  relief_timing: string | null;
  treatment_outcome: string | null;
  notes: string | null;
}

/** Export is only allowed once the user has at least one completed episode; sample data is never exported. */
export const canExport = (completedEpisodes: number, loading = false) => !loading && completedEpisodes >= 1;

export const sortAreas = <T extends { selection_order: number | null }>(areas: T[]) =>
  [...areas].sort((a, b) => (a.selection_order ?? Infinity) - (b.selection_order ?? Infinity));

export const areaIsOrigin = (a: Pick<ExportArea, 'selection_order' | 'deselected_at'>) =>
  a.selection_order === 1 && !a.deselected_at;

const OUTCOME_LABEL: Record<string, string> = {
  effective: 'Effective',
  partially_effective: 'Partially effective',
  not_effective: 'Not effective',
  worsened: 'Worsened',
};
const dash = (v: any) => (v == null || v === '' || (Array.isArray(v) && v.length === 0) ? '—' : Array.isArray(v) ? v.join(', ') : String(v));
export const outcomeLabel = (o: string | null | undefined) => (o ? OUTCOME_LABEL[o] ?? o : 'Not recorded');
const areaOutcome = (a: ExportArea) => a.treatment_outcome || a.treatment?.treatment_outcome || null;

/** Text lines for one area in the PDF. */
export function areaPdfLines(a: ExportArea, formatTime: (iso: string) => string) {
  const tags = [areaIsOrigin(a) ? '(Origin)' : '', a.deselected_at ? '(unselected)' : ''].filter(Boolean).join(' ');
  const head = `${a.selection_order ?? '?'} · ${a.location_name}${tags ? '  ' + tags : ''}` +
    (a.first_selected_at ? `   first selected ${formatTime(a.first_selected_at)}` : '');
  const intensity = a.pain_intensity != null ? `${a.pain_intensity}/10` : '—';
  return {
    head,
    details: [
      `Intensity ${intensity} · Triggers: ${dash(a.triggers)}`,
      `Treatment: ${dash(extractTreatmentNames(a.treatment))} · Taken: ${dash(a.treatment_timing)} · Relief: ${dash(a.relief_timing)} · Outcome: ${outcomeLabel(areaOutcome(a))}`,
    ],
  };
}

export const csvCell = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export const CSV_AREA_HEADER =
  'EpisodeId,EpisodeDate,SelectionOrder,AreaName,AreaKey,IsOrigin,Status,FirstSelectedAt,Intensity,Symptoms,Triggers,Treatment,TreatmentTiming,ReliefTiming,Outcome,Notes';

export function csvAreaRows(episodes: Array<{ id: string; date: string; areas?: ExportArea[] }>) {
  const sorted = [...episodes].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  return sorted.flatMap(ep =>
    sortAreas(ep.areas || []).map(a =>
      [
        csvCell(ep.id),
        csvCell(ep.date),
        a.selection_order ?? '',
        csvCell(a.location_name),
        csvCell(a.location_key),
        areaIsOrigin(a) ? 'yes' : 'no',
        a.deselected_at ? 'unselected' : 'selected',
        csvCell(a.first_selected_at),
        a.pain_intensity ?? '',
        csvCell((a.symptoms || []).join('; ')),
        csvCell((a.triggers || []).join('; ')),
        csvCell(extractTreatmentNames(a.treatment).join('; ')),
        csvCell(a.treatment_timing),
        csvCell(a.relief_timing),
        csvCell(areaOutcome(a) ? outcomeLabel(areaOutcome(a)) : ''),
        csvCell(a.notes),
      ].join(',')
    )
  );
}

// ---- Frequency summary & medication-overuse counter (Standard Doctor PDF) ----

export interface SummaryRecord {
  date: string; // ISO start time
  intensity: number | null | undefined;
  duration: number | null | undefined; // minutes
  treatments?: string[];
}

export interface FrequencySummary {
  days: number;
  episodes: number;
  totalHours: number;
  avgIntensity: number | null;
}

/** Episodes, total hours and average intensity in the last `days` days. */
export function frequencySummary(records: SummaryRecord[], days: number, now: Date = new Date()): FrequencySummary {
  const from = now.getTime() - days * 86400000;
  const inRange = records.filter((r) => {
    const t = new Date(r.date).getTime();
    return t >= from && t <= now.getTime();
  });
  const mins = inRange.reduce((s, r) => s + (r.duration && r.duration > 0 ? r.duration : 0), 0);
  const rated = inRange.filter((r) => typeof r.intensity === "number" && r.intensity > 0);
  return {
    days,
    episodes: inRange.length,
    totalHours: Math.round((mins / 60) * 10) / 10,
    avgIntensity: rated.length ? Math.round((rated.reduce((s, r) => s + (r.intensity as number), 0) / rated.length) * 10) / 10 : null,
  };
}

export type MedClass = "triptan" | "simple";
export const MOH_THRESHOLDS: Record<MedClass, number> = { triptan: 10, simple: 15 };
const TRIPTAN_RE = /triptan/i;
const SIMPLE_RE = /ibuprofen|naproxen|diclofenac|aspirin|nsaid|acetaminophen|paracetamol|advil|motrin|aleve|tylenol|panadol|excedrin/i;

export function classifyMedication(name: string): MedClass | null {
  if (TRIPTAN_RE.test(name)) return "triptan";
  if (SIMPLE_RE.test(name)) return "simple";
  return null;
}

export interface MohCount {
  cls: MedClass;
  label: string;
  days: number;
  threshold: number;
  atOrOver: boolean;
}

/** Distinct days with each medication class in the last 30 days, vs MOH thresholds. */
export function mohCounter(records: SummaryRecord[], now: Date = new Date()): MohCount[] {
  const from = now.getTime() - 30 * 86400000;
  const days: Record<MedClass, Set<string>> = { triptan: new Set(), simple: new Set() };
  for (const r of records) {
    const t = new Date(r.date);
    if (t.getTime() < from || t.getTime() > now.getTime()) continue;
    const day = t.toISOString().slice(0, 10);
    for (const m of r.treatments ?? []) {
      const c = classifyMedication(m);
      if (c) days[c].add(day);
    }
  }
  const labels: Record<MedClass, string> = { triptan: "Triptans", simple: "NSAIDs / simple painkillers" };
  return (Object.keys(days) as MedClass[]).map((cls) => ({
    cls,
    label: labels[cls],
    days: days[cls].size,
    threshold: MOH_THRESHOLDS[cls],
    atOrOver: days[cls].size >= MOH_THRESHOLDS[cls],
  }));
}
