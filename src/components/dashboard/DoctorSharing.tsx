import { Link } from 'react-router-dom';
import { FileText, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadClinicSheet } from '@/lib/clinicianPdf';
import { JOURNAL_URL, readTrialDraft } from '@/lib/publicExperience';
import { toast } from 'sonner';

export function DoctorSharing() {
  return <section className="border-y border-border py-5 space-y-3" aria-label="Doctor sharing">
    {readTrialDraft() && <div className="flex flex-wrap items-center justify-between gap-3 pb-4"><p>Your trial entry is ready to review.</p><Button asChild variant="outline"><Link to="/try">Review & save draft</Link></Button></div>}
    <h2 className="text-lg font-semibold">Share with your doctor</h2>
    <div className="flex flex-wrap gap-2"><Button asChild><Link to="/data-export"><FileText />My doctor report</Link></Button><Button variant="outline" onClick={() => downloadClinicSheet().catch(() => toast.error('Download failed. Please retry.'))}><Download />Clinic reference sheet</Button><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(`${JOURNAL_URL}/clinicians`); toast.success('Public clinician link copied. No health data included.'); } catch { toast.error('Could not copy the link. Open For clinicians instead.'); } }}><Copy />Copy clinician link</Button></div>
  </section>;
}