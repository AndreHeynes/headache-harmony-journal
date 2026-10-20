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
