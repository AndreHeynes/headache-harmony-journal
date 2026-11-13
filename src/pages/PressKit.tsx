import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicPageHeader } from '@/components/public/PublicPageHeader';
import pressKitArchive from '@/assets/press-kit/headache-journal-press-kit.zip.asset.json';

type Asset = { file: string; screen: string; device: string; size: string; scenario: string; text: string };

export default function PressKit() {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  useEffect(() => { fetch('/press-kit/manifest.json').then(r => r.json()).then(m => setAssets(m.assets || [])).catch(() => setAssets([])); }, []);
  return <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
    <Helmet><title>Press kit | My Headache Experience Journal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
    <PublicPageHeader />
    <h1 className="text-3xl font-semibold mb-2">Press kit</h1>
    <p className="text-muted-foreground mb-6">Screens use fictional sample data only. <a className="text-primary underline" href="/press-kit/manifest.json" download>Download manifest.json</a></p>
    <div className="mb-8 flex flex-col items-start gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-medium">Complete press kit</h2>
        <p className="text-sm text-muted-foreground">All 93 assets — 89 images, 2 PDFs and 2 video clips — plus the manifest.</p>
      </div>
      <Button asChild className="shrink-0">
        <a href={pressKitArchive.url} download="headache-journal-press-kit.zip"><Download />Download all as ZIP</a>
      </Button>
    </div>
    {assets === null ? <p>Loading…</p> : assets.length === 0 ? <p>No assets yet.</p> :
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{assets.map(a => <figure key={a.file} className="border border-border bg-card p-3 space-y-2">
        {a.file.endsWith('.webm') ? <video src={`/press-kit/${a.file}`} controls className="w-full" /> : a.file.endsWith('.pdf') ? <div className="aspect-video grid place-items-center text-muted-foreground">PDF</div> : <img src={`/press-kit/${a.file}`} alt={a.screen} loading="lazy" className="w-full h-48 object-contain bg-background" />}
        <figcaption className="text-sm"><p className="font-medium">{a.screen}</p><p className="text-muted-foreground">{a.device} · {a.size} · {a.scenario}</p></figcaption>
        <Button asChild size="sm" variant="outline"><a href={`/press-kit/${a.file}`} download><Download />Download</a></Button>
      </figure>)}</div>}
  </div>;
}
