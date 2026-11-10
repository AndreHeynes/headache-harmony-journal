import { trackCampaignStep } from '@/lib/campaignTracking';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicPageHeader } from '@/components/public/PublicPageHeader';
import { PublicPageFooter } from '@/components/public/PublicPageFooter';
import { SAMPLE_REPORT, downloadSampleReport } from '@/lib/sampleReport';
import { toast } from 'sonner';

export default function SampleReport() {
  const s = SAMPLE_REPORT;
  return <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
    <Helmet><title>Sample doctor report | My Headache Experience Journal</title><meta name="description" content="View a clearly labelled fictional headache report showing pain area order, recorded treatment response and screening information." /></Helmet>
    <PublicPageHeader />
    <div className="flex flex-wrap justify-between items-start gap-4 mb-8"><div><p className="text-primary text-sm mb-2">Sample only · fictional data</p><h1 className="text-3xl font-semibold">Doctor-ready report sample</h1></div><Button variant="outline" onClick={() => { void trackCampaignStep('sample_downloaded'); return downloadSampleReport().catch(() => toast.error('Sample download failed. Please retry.')); }}><Download />Download sample PDF</Button></div>
    <article aria-label="Fictional sample report" className="border border-border bg-card p-5 sm:p-8 space-y-7">
      <header className="border-b border-border pb-5"><p className="text-accent font-semibold">SAMPLE ONLY — NOT A PATIENT RECORD</p><h2 className="text-2xl font-semibold mt-3">My Headache Experience Journal</h2><p className="text-muted-foreground mt-2">Patient report · {s.period}</p></header>
      <section><h3 className="text-lg font-semibold mb-2">Demographics & identification</h3><p>{s.patient} · No real personal information</p></section>
      <section><h3 className="text-lg font-semibold mb-3">Frequency & medication intake</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[[s.episodes, 'Completed episodes'], [s.headacheDays, 'Headache days'], [s.hours, 'Hours total'], [s.intensity, 'Mean intensity /10']].map(([v, l]) => <div key={l}><p className="text-2xl text-accent font-semibold">{v}</p><p className="text-sm text-muted-foreground">{l}</p></div>)}</div><p className="mt-4 text-sm">Simple painkillers: {s.medicationDays} recorded days. Below the 15 days/month counter threshold.</p><p className="text-xs text-muted-foreground mt-1">Self-reported use; this counter is not a diagnosis of medication overuse headache.</p></section>
      <section className="space-y-3"><h3 className="text-lg font-semibold">Example episode · 24 October 2026</h3><p className="text-sm">Intensity 7/10 · 180 minutes · Left temple and left back of head</p><p className="text-sm">Light sensitivity · Missed meal · Ibuprofen, rest · Fictional example</p><ol className="divide-y divide-border border-y border-border">{s.areas.map(a => <li key={a.location_key} className="py-4 space-y-2"><h4 className="font-semibold">{a.selection_order} · {a.location_name}{a.selection_order === 1 ? ' · Origin' : ''}</h4><p className="text-sm text-muted-foreground">First selected {a.selection_order === 1 ? '09:00' : '09:20'} UTC · Intensity {a.pain_intensity}/10</p><p className="text-sm">Reported triggers: {a.triggers?.join(', ')}</p><p className="text-sm">{a.selection_order === 1 ? 'Ibuprofen at 30 minutes · Relief after 60 minutes · Partially effective' : 'Rest at 45 minutes · Relief and outcome not recorded'}</p></li>)}</ol><p className="text-xs text-muted-foreground">Selection order is retained per episode. These times reflect when areas were logged, not verified biological spread.</p></section>
      <section><h3 className="text-lg font-semibold mb-2">SNOOP screening example</h3><p className="text-sm">Systemic symptoms, neurological symptoms, sudden onset, first-ever headache after 50, pattern change and positional features: no positive responses in this fictional example.</p><p className="text-xs text-muted-foreground mt-2">Illustrative summary, not a complete screening audit. Your real report includes recorded screening history.</p></section>
      <section><h3 className="text-lg font-semibold mb-2">Treatment response & interpretation</h3><p className="text-sm">One partial outcome; one missing outcome excluded. No effectiveness percentage or trigger association can be inferred from this sample.</p><p className="text-sm text-muted-foreground mt-3">Informational only; not medical advice or a diagnosis. Seek urgent medical attention for new severe or concerning symptoms.</p></section>
    </article>
    <div className="flex flex-wrap gap-3 mt-6"><Button asChild><Link to="/try"><ArrowRight />Map my pain</Link></Button><Button asChild variant="outline"><Link to="/signup">Start my own journal</Link></Button></div>
    <PublicPageFooter />
  </div>;
}