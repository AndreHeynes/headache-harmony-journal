import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicPageHeader } from '@/components/public/PublicPageHeader';
import { PublicPageFooter } from '@/components/public/PublicPageFooter';
import { downloadClinicSheet } from '@/lib/clinicianPdf';
import { toast } from 'sonner';

export default function Clinicians() {
  return <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
    <Helmet><title>Clinician reference | My Headache Experience Journal</title><meta name="description" content="Clinical reference for patient-maintained headache records, per-area treatment response and report limitations." /></Helmet>
    <PublicPageHeader />
    <p className="text-primary text-sm mb-2">Clinician reference</p><h1 className="text-3xl font-semibold">My Headache Experience Journal</h1>
    <p className="text-muted-foreground mt-4 max-w-2xl">Patient-maintained records for a conversation with a healthcare professional.</p>
    <div className="divide-y divide-border mt-8">{[
      ['Episode & area records', 'Dates, duration, intensity, symptoms, reported triggers, treatment use, relief timing and recorded outcomes. Front, back-of-head and neck mapping retains first-selection order and timestamps.'],
      ['Reports', 'Standard PDF and CSV include completed episodes, demographics, per-area details, frequency summaries, medication-use counters and SNOOP screening history. Premium AI reports discuss associations, not causation.'],
      ['Interpretation', 'Data are self-reported. Missing entries can underestimate headache frequency and medication use. Missing outcomes are excluded from effectiveness rates. Selection timestamps describe logging activity, not verified biological spread.'],
      ['Safety & privacy', 'Screening is not a diagnosis or an emergency assessment. Patients choose whether to share their downloaded report. The QR code opens this public reference page, never a patient record.'],
    ].map(([title, body]) => <section key={title} className="py-6"><h2 className="text-xl font-semibold mb-2">{title}</h2><p className="text-muted-foreground leading-relaxed">{body}</p></section>)}</div>
    <div className="flex flex-wrap gap-3"><Button onClick={() => downloadClinicSheet().catch(() => toast.error('Download failed. Please retry.'))}><Download />Clinic reference sheet</Button><Button asChild variant="outline"><Link to="/sample-report"><FileText />Fictional sample report</Link></Button><Button asChild variant="outline"><Link to="/try">Try the pain map</Link></Button></div>
  </div>;
}