import { jsPDF } from 'jspdf';
import { addClinicianFooter } from './clinicianPdf';
import type { ExportArea } from './exportFormat';

/** Fictional, fixed marketing fixture; never passed to Standard Export. */
export const SAMPLE_REPORT = {
  patient: 'Fictional patient A', period: '1–30 October 2026',
  episodes: 6, headacheDays: 5, hours: 18, intensity: 6.2,
  medicationDays: 3,
  areas: [
    { selection_order: 1, location_name: 'Left temple', location_key: 'region:l-temple', first_selected_at: '2026-10-24T09:00:00Z', pain_intensity: 7, triggers: ['Missed meal'], symptoms: ['Light sensitivity'], treatment: { medications: ['Pain medicine'] }, treatment_timing: '30 minutes after onset', relief_timing: '60 minutes after treatment', treatment_outcome: 'partially_effective', notes: null, deselected_at: null },
    { selection_order: 2, location_name: 'Left back of head', location_key: 'region:l-occiput', first_selected_at: '2026-10-24T09:20:00Z', pain_intensity: 5, triggers: ['Reported neck tension'], symptoms: [], treatment: { type: 'rest' }, treatment_timing: '45 minutes after onset', relief_timing: null, treatment_outcome: null, notes: null, deselected_at: null },
  ] satisfies ExportArea[],
};

export async function downloadSampleReport() {
  const doc = new jsPDF();
  const write = (text: string, y: number, size = 11) => { doc.setFontSize(size); doc.text(doc.splitTextToSize(text, 165), 22, y); };
  write('SAMPLE ONLY — FICTIONAL DATA', 20, 13);
  write('Headache Journal: Patient Report', 32, 19);
  write('Demographics: Fictional patient A. No real personal information.', 46);
  write('Reporting period: 1–30 October 2026. Completed episodes only.', 56);
  write('Frequency: 6 completed episodes on 5 days; 18 hours total; average intensity 6.2/10.', 70);
  write('Medication intake: pain medicine on 3 recorded days. Below the 15 days/month counter threshold; not a diagnosis.', 86);
  write('Example episode: 24 October 2026; intensity 7/10; duration 180 minutes; left temple and left back of head.', 105);
  write('Symptoms: light sensitivity. Reported trigger: missed meal. Treatment: ibuprofen and rest. Notes: fictional example.', 122);
  SAMPLE_REPORT.areas.forEach((area, i) => {
    const y = 146 + i * 48;
    write(`${area.selection_order} - ${area.location_name}${i === 0 ? ' (Origin)' : ''}`, y, 13);
    write(`First selected: ${i === 0 ? '09:00' : '09:20'} UTC; intensity ${area.pain_intensity}/10. Triggers: ${(area.triggers || []).join(', ')}.`, y + 8, 10);
    write(i === 0 ? 'Pain medicine at 30 minutes; relief at 60 minutes; outcome: partially effective.' : 'Rest at 45 minutes; relief and outcome not recorded.', y + 20, 10);
  });
  doc.addPage();
  write('SAMPLE ONLY — FICTIONAL DATA', 20, 13);
  write('Screening and interpretation', 34, 18);
  write('SNOOP example: systemic symptoms, neurological symptoms, sudden onset, first-ever headache after 50, pattern change and positional features: no positive responses in this fictional example.', 50);
  write('This illustrative sample is not a complete screening audit or a real patient report. Real reports include the full recorded screening history.', 78);
  write('Treatment response: one partial outcome shown; one missing outcome excluded. No effectiveness percentage or statistical association is inferred from this example.', 101);
  write('First-selection timestamps reflect when areas were logged; they are not proof of the biological spread of pain.', 126);
  write('Informational only. Not medical advice or a diagnosis. Seek urgent medical attention for new severe or concerning symptoms.', 148);
  await addClinicianFooter(doc);
  doc.save('headache-journal-SAMPLE-fictional-report.pdf');
}