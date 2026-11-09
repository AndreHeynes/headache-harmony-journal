import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { JOURNAL_URL } from './publicExperience';

/** Public reference link only: never encode patient data or a hosted patient report. */
export async function addClinicianFooter(doc: jsPDF) {
  const url = `${JOURNAL_URL}/clinicians`;
  const qr = await QRCode.toDataURL(url, { width: 160, margin: 1, errorCorrectionLevel: 'M' });
  const pt = doc.internal.pageSize.getWidth() > 400;
  const unit = pt ? 72 / 25.4 : 1;
  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page);
    const height = doc.internal.pageSize.getHeight();
    const width = doc.internal.pageSize.getWidth();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Documented via My Headache Experience Journal', 20 * unit, height - 10 * unit);
    doc.textWithLink('journal.headacherecovery.org/clinicians', 20 * unit, height - 6 * unit, { url });
    doc.text(`${page} / ${doc.getNumberOfPages()}`, width / 2, height - 6 * unit);
    doc.addImage(qr, 'PNG', width - 29 * unit, height - 16 * unit, 12 * unit, 12 * unit);
  }
}

export async function downloadClinicSheet() {
  const doc = new jsPDF();
  let y = 24;
  const write = (text: string, size = 11) => {
    doc.setFontSize(size);
    for (const line of doc.splitTextToSize(text, 165)) { doc.text(line, 22, y); y += size === 20 ? 9 : 6; }
    y += 5;
  };
  write('My Headache Experience Journal', 20);
  write('Clinician reference', 14);
  write('A patient-maintained headache diary for conversations with a healthcare professional.');
  write('Recorded information', 14);
  write('Episode dates, duration, pain intensity, symptoms, reported triggers, and treatment use. Front, back-of-head and neck mapping retains the order and time areas were first selected.');
  write('Per-area treatment response', 14);
  write('Treatment timing, relief timing and recorded outcomes: effective, partially effective, not effective or worsened. Blank outcomes are excluded from effectiveness rates.');
  write('Reports', 14);
  write('Standard PDF and CSV use completed episodes only, with demographics, area details, frequency summaries, medication-use counters and SNOOP screening history. Premium AI reports discuss associations, not causation.');
  write('Clinical limitations', 14);
  write('Entries are self-reported. First-selection times describe logging activity, not verified biological spread. Missing entries can underestimate frequency and medication use. Screening is not a diagnosis or an emergency assessment.');
  write('Try the map or view a fictional sample report', 14);
  doc.textWithLink(`${JOURNAL_URL}/try`, 22, y, { url: `${JOURNAL_URL}/try` });
  y += 8;
  doc.textWithLink(`${JOURNAL_URL}/sample-report`, 22, y, { url: `${JOURNAL_URL}/sample-report` });
  await addClinicianFooter(doc);
  doc.save('headache-journal-clinician-reference.pdf');
}