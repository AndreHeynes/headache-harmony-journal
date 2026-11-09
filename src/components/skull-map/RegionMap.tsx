import { useId, useRef, type ReactNode } from 'react';
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
  /** Shading drawn under the regions (receives the outline clip id). */
  underlay?: (clipId: string) => ReactNode;
  /** Line art drawn over the regions (never intercepts taps). */
  overlay?: ReactNode;
}

/** SVG region map on a bone-shaded head. Tap to toggle; press and drag to brush. Later regions paint on top. */
export default function RegionMap({ viewBox, outline, regions, label, leftText, rightText, caption, selected, onChange, underlay, overlay }: RegionMapProps) {
  const brush = useRef<{ add: boolean; touched: Set<string> } | null>(null);
  const current = useRef(selected);
  current.current = selected;
  const uid = useId().replace(/:/g, '');
  const clipId = `clip-${uid}`;
  const boneId = `bone-${uid}`;
  const glowId = `glow-${uid}`;
  const [, , w, h] = viewBox.split(' ').map(Number);

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
        <defs>
          <clipPath id={clipId}><path d={outline} /></clipPath>
          <radialGradient id={boneId} cx="50%" cy="36%" r="68%">
            <stop offset="0%" stopColor="hsl(var(--bone))" />
            <stop offset="75%" stopColor="hsl(var(--bone))" />
            <stop offset="100%" stopColor="hsl(var(--bone-shade))" />
          </radialGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={w / 130} /></filter>
        </defs>

        <path d={outline} fill={`url(#${boneId})`} stroke="hsl(var(--bone-ink))" strokeWidth={w / 220} />
        {underlay?.(clipId)}

        {/* soft glow under selected areas */}
        <g clipPath={`url(#${clipId})`} filter={`url(#${glowId})`} pointerEvents="none">
          {regions.filter((r) => selected.includes(r.id)).map((r) => (
            <path key={r.id} d={r.d} className="fill-primary" opacity={r.parent ? 0.75 : 0.45} />
          ))}
        </g>

        <g clipPath={`url(#${clipId})`}>
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
                fill="transparent"
                className={`cursor-pointer outline-none transition-colors focus-visible:stroke-ring ${
                  on ? 'stroke-primary' : r.parent ? 'stroke-secondary/40 hover:fill-primary/20 hover:stroke-primary' : 'stroke-transparent hover:fill-primary/10'
                }`}
                strokeWidth={on ? w / 160 : w / 320}
                strokeDasharray={on ? undefined : `${w / 100} ${w / 100}`}
              >
                <title>{REGION_LABELS[r.id]}</title>
              </path>
            );
          })}
        </g>

        {overlay}

        <text x={w * 0.03} y={h * 0.98} className="fill-muted-foreground" fontSize={w / 30}>{leftText}</text>
        <text x={w * 0.97} y={h * 0.98} textAnchor="end" className="fill-muted-foreground" fontSize={w / 30}>{rightText}</text>
      </svg>
      <p className="mt-2 text-center text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
