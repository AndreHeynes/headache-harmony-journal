import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeadMapPicker from '@/components/skull-map/HeadMapPicker';
import { PublicPageHeader } from '@/components/public/PublicPageHeader';
import { REGION_LABELS } from '@/lib/regionMapping';
import { GUEST_DRAFT_KEY, newTrialDraft, readTrialDraft, selectedTrialAreas, selectTrialAreas, TRIAL_OUTCOMES, type TrialArea } from '@/lib/publicExperience';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function TryJournal() {
  const [draft, setDraft] = useState(() => readTrialDraft() || newTrialDraft());
  const [activeId, setActiveId] = useState(() => selectedTrialAreas(draft)[0]?.id || '');
  const [saving, setSaving] = useState(false);
  const [consent, setConsent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const areas = selectedTrialAreas(draft);
  const area = areas.find(a => a.id === activeId) || areas[0];
  const commit = (next: typeof draft) => { setDraft(next); try { sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(next)); } catch { toast.error('This browser cannot keep your trial draft.'); } };
  const update = (patch: Partial<TrialArea>) => { if (area) commit({ ...draft, areas: draft.areas.map(a => a.id === area.id ? { ...a, ...patch } : a) }); };
  const toggle = (field: 'symptoms' | 'triggers', name: string) => { if (area) update({ [field]: area[field].includes(name) ? area[field].filter(n => n !== name) : [...area[field], name] }); };

  const save = async () => {
    if (!user) { navigate('/signup?intent=save_entry'); return; }
    if (!areas.length || !consent) return;
    setSaving(true);
    try {
      // Stable draft UUID makes retries idempotent. Never overwrite another episode.
      const existing = await supabase.from('headache_episodes').select('id').eq('id', draft.id).eq('user_id', user.id).maybeSingle();
      if (existing.error) throw existing.error;
      if (!existing.data) {
        const first = areas[0];
        const result = await supabase.from('headache_episodes').insert({ id: draft.id, user_id: user.id, status: 'active', start_time: draft.startedAt, duration_minutes: draft.duration, pain_location: areas.map(a => REGION_LABELS[a.id]).join(', '), pain_intensity: first.intensity, symptoms: first.symptoms, triggers: first.triggers, treatment: first.treatment ? { medications: [first.treatment] } : null, treatment_timing: first.treatmentTiming || null, relief_timing: first.reliefTiming || null, treatment_outcome: first.outcome || null, notes: first.notes || null });
        if (result.error) throw result.error;
      }
      // Insert every first-selection row, including deselected history, in order.
      const rows = await supabase.from('episode_locations').select('region_id').eq('episode_id', draft.id).eq('user_id', user.id);
      if (rows.error) throw rows.error;
      const known = new Set((rows.data || []).map(r => r.region_id));
      for (const a of [...draft.areas].sort((a, b) => a.order - b.order)) {
        if (known.has(a.id)) continue;
        const result = await supabase.from('episode_locations').insert({ episode_id: draft.id, user_id: user.id, region_id: a.id, location_key: `region:${a.id}`, location_name: REGION_LABELS[a.id], first_selected_at: a.firstSelectedAt, deselected_at: a.selected ? null : new Date().toISOString(), pain_intensity: a.intensity, symptoms: a.symptoms, triggers: a.triggers, treatment: a.treatment ? { medications: [a.treatment] } : null, treatment_timing: a.treatmentTiming || null, relief_timing: a.reliefTiming || null, treatment_outcome: a.outcome || null, notes: a.notes || null });
        if (result.error) throw result.error;
      }
      const verified = await supabase.from('episode_locations').select('region_id, selection_order, pain_intensity').eq('episode_id', draft.id).eq('user_id', user.id);
      if (verified.error || draft.areas.some(a => !verified.data?.some(row => row.region_id === a.id && row.selection_order === a.order && row.pain_intensity === a.intensity))) throw new Error('Draft read-back mismatch');
      sessionStorage.removeItem(GUEST_DRAFT_KEY);
      toast.success('Draft saved. Complete the safety questions before it counts in reports.');
      navigate('/dashboard');
    } catch { toast.error('Could not finish saving. Your trial draft is still here; please retry.'); }
    finally { setSaving(false); }
  };

  return <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
    <Helmet><title>Try the pain map | My Headache Experience Journal</title><meta name="description" content="Try the interactive head and neck pain map before creating a headache journal account." /></Helmet>
    <PublicPageHeader />
    <div className="mb-6"><p className="text-primary text-sm mb-2">No account needed</p><h1 className="text-3xl font-semibold">My Headache Experience Journal</h1><p className="text-muted-foreground mt-2">Your pain map</p></div>
    <div className="grid md:grid-cols-2 gap-8">
      <section aria-label="Trial pain map"><HeadMapPicker selected={areas.map(a => a.id)} labelFor={id => { const a = draft.areas.find(x => x.id === id); return `${a?.order} · ${REGION_LABELS[id]}${a?.order === 1 ? ' (Origin)' : ''}`; }} onChange={next => commit(selectTrialAreas(draft, next))} /></section>
      <section className="space-y-5 min-w-0" aria-label="Trial area details">
        {area ? <>
          <Tabs value={area.id} onValueChange={setActiveId}><TabsList className="h-auto flex flex-wrap justify-start gap-1 bg-transparent">{areas.map(a => <TabsTrigger key={a.id} value={a.id} className="whitespace-normal text-left">{a.order} · {REGION_LABELS[a.id]}{a.order === 1 ? ' · Origin' : ''}</TabsTrigger>)}</TabsList></Tabs>
          <h2 className="text-xl font-semibold">{REGION_LABELS[area.id]}</h2>
          <Label htmlFor="trial-intensity">Pain intensity {area.intensity == null ? '— not recorded' : `${area.intensity}/10`}</Label>
          <Input id="trial-intensity" className="accent-primary" type="range" min="1" max="10" value={area.intensity ?? 5} onChange={e => update({ intensity: Number(e.target.value) })} />
          {(['symptoms', 'triggers'] as const).map(field => <fieldset key={field} className="space-y-3"><legend className="font-medium mb-2">{field === 'symptoms' ? 'Symptoms' : 'Reported triggers'}</legend><div className="flex flex-wrap gap-4">{(field === 'symptoms' ? ['Nausea', 'Light sensitivity', 'Sound sensitivity'] : ['Stress', 'Missed meal', 'Poor sleep', 'Neck tension']).map(name => <label key={name} className="flex items-center gap-2 text-sm"><Checkbox checked={area[field].includes(name)} onCheckedChange={() => toggle(field, name)} />{name}</label>)}</div></fieldset>)}
          <div className="grid sm:grid-cols-2 gap-4">{([
            ['treatment', 'Treatment / management'], ['treatmentTiming', 'Treatment timing'], ['reliefTiming', 'Relief timing'],
          ] as const).map(([field, label]) => <div key={field} className="space-y-2"><Label htmlFor={`trial-${field}`}>{label}</Label><Input id={`trial-${field}`} value={area[field]} onChange={e => update({ [field]: e.target.value })} /></div>)}
          <div className="space-y-2"><Label htmlFor="trial-duration">Episode duration (minutes, if known)</Label><Input id="trial-duration" type="number" min="0" value={draft.duration ?? ''} onChange={e => commit({ ...draft, duration: e.target.value ? Math.max(0, Number(e.target.value)) : null })} /></div></div>
          <fieldset><legend className="font-medium mb-2">Recorded outcome</legend><div className="flex flex-wrap gap-2"><Button size="sm" variant={!area.outcome ? 'default' : 'outline'} onClick={() => update({ outcome: '' })}>Not recorded</Button>{Object.entries(TRIAL_OUTCOMES).map(([value, label]) => <Button key={value} size="sm" variant={area.outcome === value ? 'default' : 'outline'} onClick={() => update({ outcome: value })}>{label}</Button>)}</div></fieldset>
          <div className="space-y-2"><Label htmlFor="trial-notes">Notes</Label><Textarea id="trial-notes" value={area.notes} onChange={e => update({ notes: e.target.value })} /></div>
        </> : <p className="text-muted-foreground pt-8">No areas selected.</p>}
        <div className="border-t border-border pt-5 space-y-3"><h2 className="text-lg font-semibold">Your entry preview</h2><p>{areas.length} selected area{areas.length === 1 ? '' : 's'}{areas.find(a => a.order === 1) ? ` · Origin: ${REGION_LABELS[areas.find(a => a.order === 1)?.id || '']}` : ''}</p><p className="text-sm text-muted-foreground">This trial does not assess red flags, diagnose a headache, or infer trigger associations. First-selected times describe logging activity.</p><p className="text-xs text-muted-foreground">Draft stored in this tab only. Use the same tab after signing in. Closing it clears the draft.</p>
          {user && <label className="flex gap-2 items-start text-sm"><Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} />Save this trial entry to my account as an incomplete episode.</label>}
          <div className="flex flex-wrap gap-2"><Button disabled={!areas.length || saving || (!!user && !consent)} onClick={save}>{user ? <Save /> : <ArrowRight />}{saving ? 'Saving…' : user ? 'Save entry draft' : 'Create account to save'}</Button><Button asChild variant="outline"><Link to="/sample-report">Sample doctor report</Link></Button><Button variant="ghost" size="icon" aria-label="Discard trial draft" disabled={saving} onClick={() => { sessionStorage.removeItem(GUEST_DRAFT_KEY); setDraft(newTrialDraft()); setActiveId(''); }}><Trash2 /></Button></div>
          {!user && <Button asChild variant="link" className="px-0"><Link to="/auth?mode=signin">Already have an account? Sign in</Link></Button>}
        </div>
      </section>
    </div>
  </div>;
}