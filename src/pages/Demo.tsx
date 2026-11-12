import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, FileSpreadsheet, Download, Trash2, Moon, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PublicPageHeader } from '@/components/public/PublicPageHeader';
import { REGION_LABELS } from '@/lib/regionMapping';
import { DEMO_SCENARIOS, summarizeDemo, type DemoScenarioId } from '@/lib/demoScenarios';

const SampleTag = () => <p className="text-primary text-sm font-semibold">Sample only: fictional data</p>;
const Stat = ({ v, l }: { v: string | number; l: string }) => <div><p className="text-2xl text-primary font-semibold">{v}</p><p className="text-sm text-muted-foreground">{l}</p></div>;

/** Read-only demo of signed-in screens. Uses in-memory fictional fixtures; never touches the database. */
export default function Demo() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get('scenario') as DemoScenarioId) || 'busy';
  const [id, setId] = useState<DemoScenarioId>(DEMO_SCENARIOS[initial] ? initial : 'busy');
  const sc = DEMO_SCENARIOS[id]; const s = summarizeDemo(id);
  const pick = (k: DemoScenarioId) => { setId(k); params.set('scenario', k); setParams(params, { replace: true }); };
  const maxPeak = Math.max(1, ...Object.values(s.peak));
  return <div className="max-w-5xl mx-auto px-4 py-6 pb-24 space-y-6">
    <Helmet><title>Demo | My Headache Experience Journal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
    <PublicPageHeader />
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><SampleTag /><h1 className="text-3xl font-semibold">Journal demo · {sc.label}</h1><p className="text-muted-foreground">{sc.period} · Completed episodes only</p></div>
      <div className="inline-flex rounded-md bg-muted p-1" role="group" aria-label="Scenario">{(Object.keys(DEMO_SCENARIOS) as DemoScenarioId[]).map(k => <Button key={k} size="sm" variant={k === id ? 'default' : 'ghost'} onClick={() => pick(k)}>{DEMO_SCENARIOS[k].label}</Button>)}</div>
    </div>

    <Card id="demo-dashboard"><CardHeader><SampleTag /><CardTitle>Dashboard · last {sc.days} days</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4"><Stat v={s.episodes} l="Completed episodes" /><Stat v={s.headacheDays} l="Headache days" /><Stat v={s.hours} l="Hours total" /><Stat v={s.meanIntensity} l="Mean intensity /10" /></CardContent></Card>

    <Card id="demo-sleep"><CardHeader><SampleTag /><CardTitle className="flex items-center gap-2"><Moon className="h-5 w-5 text-primary" />Daily Sleep & Wearable Check-in</CardTitle><CardDescription>Entered by hand. No device sync.</CardDescription></CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4"><Stat v={s.avgSleep} l="Avg sleep hours" /><Stat v="3/5" l="Sleep quality" /><Stat v="62" l="Resting HR (bpm)" /><Stat v="48" l="HRV (ms)" /></CardContent></Card>

    <div className="grid md:grid-cols-2 gap-6">
      <Card id="demo-trends"><CardHeader><SampleTag /><CardTitle>Episode trend</CardTitle></CardHeader><CardContent>
        <ol className="space-y-1 text-sm">{sc.episodes.map(e => <li key={e.date} className="flex items-center gap-2"><span className="w-24 text-muted-foreground">{e.date.slice(5)}</span><span className="h-2 bg-primary rounded" style={{ width: `${e.intensity * 10}%` }} /><span>{e.intensity}/10</span></li>)}</ol></CardContent></Card>
      <Card id="demo-peak"><CardHeader><SampleTag /><CardTitle>Peak times</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
        {Object.entries(s.peak).map(([k, v]) => <div key={k} className="flex items-center gap-2"><span className="w-24">{k}</span><span className="h-3 bg-primary rounded" style={{ width: `${(v / maxPeak) * 60}%` }} /><span>{v}</span></div>)}</CardContent></Card>
      <Card id="demo-spread"><CardHeader><SampleTag /><CardTitle>Area order & spread timing</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
        <p>{s.spread.multiArea} of {s.episodes} episodes had more than one area.</p>
        {s.spread.avgMinutesToSecond != null && <p>Second area logged on average {s.spread.avgMinutesToSecond} minutes after the first.</p>}
        <p className="font-medium pt-2">First area (Origin)</p><ul>{s.origins.map(([r, c]) => <li key={r}>1 · {REGION_LABELS[r] || r} — {c}</li>)}</ul>
        <p className="text-xs text-muted-foreground">Times reflect when areas were logged, not verified biological spread.</p></CardContent></Card>
      <Card id="demo-neck"><CardHeader><SampleTag /><CardTitle>Neck involvement</CardTitle></CardHeader><CardContent className="text-sm space-y-2">
        <Stat v={`${s.neckEpisodes} / ${s.episodes}`} l="Episodes including neck or back of head" /></CardContent></Card>
      <Card id="demo-meds" className="md:col-span-2"><CardHeader><SampleTag /><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Medicine-use counter</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
        <p>Pain medicine: {s.medDays} recorded days {sc.days === 7 ? `this week (about ${s.medPerMonthPace} per month at this pace)` : 'this month'}. Counter threshold: {s.medThreshold} days/month.</p>
        <div className="h-3 bg-muted rounded"><div className="h-3 bg-primary rounded" style={{ width: `${Math.min(100, (s.medPerMonthPace / s.medThreshold) * 100)}%` }} /></div>
        <p>Recorded outcomes: {s.recordedOutcomes}{s.effectiveRatePct != null ? ` · ${s.effectiveRatePct}% effective` : ''} (uses with no recorded outcome are left out)</p>
        <p className="text-xs text-muted-foreground">Self-reported use; this counter is not a diagnosis.</p></CardContent></Card>
    </div>

    <Card id="demo-triggers"><CardHeader><SampleTag /><CardTitle>Reported triggers</CardTitle></CardHeader><CardContent><ul className="text-sm space-y-1">{[...new Set(sc.episodes.flatMap(e => e.triggers))].map(t => <li key={t}>{t}</li>)}</ul></CardContent></Card>

    <Card id="demo-export"><CardHeader><SampleTag /><CardTitle>Standard Export</CardTitle><CardDescription>Doctor-ready report of completed episodes.</CardDescription></CardHeader>
      <CardContent className="flex flex-wrap gap-3"><Button disabled><FileText />Download PDF</Button><Button disabled variant="outline"><FileSpreadsheet />Download CSV</Button><p className="w-full text-xs text-muted-foreground">Buttons are disabled in the demo. Real exports contain only your own data.</p></CardContent></Card>

    <Card id="demo-profile"><CardHeader><SampleTag /><CardTitle>Data Management</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-3"><Button disabled variant="outline"><Download />Export my data</Button><Button disabled variant="destructive"><Trash2 />Delete All My Data</Button></CardContent></Card>

    <div className="flex flex-wrap gap-3"><Button asChild><Link to="/try">Map my pain</Link></Button><Button asChild variant="outline"><Link to="/signup">Start my own journal</Link></Button></div>
  </div>;
}
