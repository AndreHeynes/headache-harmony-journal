import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import RegionMap from './RegionMap';
import BackHeadMap from './BackHeadMap';
import { FRONT_OUTLINE, FRONT_REGIONS, FRONT_VIEWBOX } from './frontRegions';

interface Props {
  /** Selected area IDs in selection order (region IDs, or "legacy:..." for old areas). */
  selected: string[];
  labelFor: (id: string) => string;
  onChange: (next: string[]) => void;
}

/** Front and back head maps with layered brushing, plus the selected-area list. */
export default function HeadMapPicker({ selected, labelFor, onChange }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-md bg-muted p-1">
          {(['front', 'back'] as const).map((v) => (
            <Button key={v} size="sm" variant={view === v ? 'default' : 'ghost'} onClick={() => setView(v)}>
              {v === 'front' ? 'Front' : 'Back & neck'}
            </Button>
          ))}
        </div>
        {selected.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => onChange([])}>Clear all</Button>
        )}
      </div>

      {view === 'front' ? (
        <RegionMap viewBox={FRONT_VIEWBOX} outline={FRONT_OUTLINE} regions={FRONT_REGIONS} label="Front of head and face"
          leftText="Right" rightText="Left" caption="Facing you — your right is on the left. Small areas paint on top of large ones."
          selected={selected} onChange={onChange} />
      ) : (
        <BackHeadMap selected={selected} onChange={onChange} />
      )}

      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected areas">
          {selected.map((id) => (
            <li key={id} className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs text-foreground">
              {labelFor(id)}
              <button type="button" aria-label={`Remove ${labelFor(id)}`} onClick={() => onChange(selected.filter((x) => x !== id))}>
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
