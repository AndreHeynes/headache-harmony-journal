import { useRef } from 'react';
import { REGION_LABELS } from '@/lib/regionMapping';
import { BACK_OUTLINE, BACK_REGIONS, BACK_VIEWBOX } from './backRegions';

interface BackHeadMapProps {
  /** Selected region IDs (e.g. "l-occiput", "neck"). */
  selected: string[];
  onChange: (next: string[]) => void;
}

/** Back-of-head and neck map. Tap to toggle; press and drag to brush across regions. */
export default function BackHeadMap({ selected, onChange }: BackHeadMapProps) {
  const brush = useRef<{ add: boolean; touched: Set<string> } | null>(null);
  const current = useRef(selected);
  current.current = selected;

  const apply = (id: string) => {
    const b = brush.current;
    if (!b || b.touched.has(id)) return;
    b.touched.add(id);
    const has = current.current.includes(id);
    if (b.add && !has) onChange((current.current = [...current.current, id]));
    if (!b.add && has) onChange((current.current = current.current.filter((x) => x !== id)));
  };

  const regionAt = (x: number, y: number) =>
    (document.elementFromPoint(x, y) as Element | null)?.getAttribute('data-region') ?? null;

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <svg
        viewBox={BACK_VIEWBOX}
        className="w-full h-auto touch-none select-none"
        role="group"
        aria-label="Back of head and neck"
        onPointerDown={(e) => {
          const id = regionAt(e.clientX, e.clientY);
          if (!id) return;
          brush.current = { add: !current.current.includes(id), touched: new Set() };
          apply(id);
        }}
        onPointerMove={(e) => {
          if (!brush.current) return;
          const id = regionAt(e.clientX, e.clientY);
          if (id) apply(id);
        }}
        onPointerUp={() => (brush.current = null)}
        onPointerLeave={() => (brush.current = null)}
        onPointerCancel={() => (brush.current = null)}
      >
        <path d={BACK_OUTLINE} className="fill-muted stroke-border" strokeWidth={2} />
        {BACK_REGIONS.map((r) => {
          const on = selected.includes(r.id);
          return (
            <path
              key={r.id}
              d={r.d}
              data-region={r.id}
              role="checkbox"
              aria-checked={on}
              aria-label={REGION_LABELS[r.id]}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(on ? selected.filter((x) => x !== r.id) : [...selected, r.id]);
                }
              }}
              className={`cursor-pointer stroke-background transition-colors outline-none focus-visible:stroke-ring ${
                on ? 'fill-primary/80' : 'fill-secondary hover:fill-primary/30'
              }`}
              strokeWidth={1.5}
            >
              <title>{REGION_LABELS[r.id]}</title>
            </path>
          );
        })}
        <text x={14} y={250} className="fill-muted-foreground text-[9px]">Left</text>
        <text x={186} y={250} textAnchor="end" className="fill-muted-foreground text-[9px]">Right</text>
      </svg>
      <p className="mt-2 text-center text-xs text-muted-foreground">Seen from behind — your left is on the left.</p>
    </div>
  );
}
