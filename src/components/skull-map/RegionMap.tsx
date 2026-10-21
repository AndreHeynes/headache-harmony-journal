import { useRef } from 'react';
import { REGION_LABELS } from '@/lib/regionMapping';
import type { MapRegion } from './backRegions';

interface RegionMapProps {
  viewBox: string;
  outline: string;
  regions: MapRegion[];
  label: string;
  leftText: string;
  rightText: string;
  caption: string;
  selected: string[];
  onChange: (next: string[]) => void;
}

/** SVG region map. Tap to toggle; press and drag to brush. Later regions paint on top. */
export default function RegionMap({ viewBox, outline, regions, label, leftText, rightText, caption, selected, onChange }: RegionMapProps) {
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
  const end = () => (brush.current = null);

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <svg
        viewBox={viewBox}
        className="w-full h-auto touch-none select-none"
        role="group"
        aria-label={label}
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
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
      >
        <path d={outline} className="fill-muted stroke-border" strokeWidth={2} />
        {regions.map((r) => {
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
                on ? (r.parent ? 'fill-primary' : 'fill-primary/60') : r.parent ? 'fill-accent hover:fill-primary/40' : 'fill-secondary hover:fill-primary/25'
              }`}
              strokeWidth={1.5}
            >
              <title>{REGION_LABELS[r.id]}</title>
            </path>
          );
        })}
        <text x={14} y={256} className="fill-muted-foreground text-[9px]">{leftText}</text>
        <text x={186} y={256} textAnchor="end" className="fill-muted-foreground text-[9px]">{rightText}</text>
      </svg>
      <p className="mt-2 text-center text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
