// Decorative anatomical line art for the front map (viewBox 0 0 400 500). Not interactive.
const SOCKET_R = 'M108 222 C114 206 168 202 184 218 C192 238 184 268 160 274 C134 278 108 262 106 244Z';
const SOCKET_L = 'M292 222 C286 206 232 202 216 218 C208 238 216 268 240 274 C266 278 292 262 294 244Z';
const NOSE = 'M200 266 C190 282 182 306 186 324 Q193 332 200 325 Q207 332 214 324 C218 306 210 282 200 266Z';
const UPPER = [158, 171, 185, 200, 215, 229, 242];
const LOWER = [164, 177, 190, 200, 210, 223, 236];
const tooth = (x: number, y: number, w: number, h: number, up: boolean) =>
  up
    ? `M${x - w / 2} ${y} L${x - w / 2} ${y + h - 3} Q${x} ${y + h + 2} ${x + w / 2} ${y + h - 3} L${x + w / 2} ${y}`
    : `M${x - w / 2} ${y} L${x - w / 2} ${y - h + 3} Q${x} ${y - h - 2} ${x + w / 2} ${y - h + 3} L${x + w / 2} ${y}`;

export function SkullShading({ clipId }: { clipId: string }) {
  return (
    <>
      <defs>
        <radialGradient id="skull-hollow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--bone-hollow))" stopOpacity={0.55} />
          <stop offset="100%" stopColor="hsl(var(--bone-hollow))" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="skull-jaw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--bone-hollow))" stopOpacity={0} />
          <stop offset="100%" stopColor="hsl(var(--bone-hollow))" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`} pointerEvents="none">
        <ellipse cx={76} cy={226} rx={26} ry={44} fill="url(#skull-hollow)" />
        <ellipse cx={324} cy={226} rx={26} ry={44} fill="url(#skull-hollow)" />
        <ellipse cx={128} cy={326} rx={34} ry={16} fill="url(#skull-hollow)" />
        <ellipse cx={272} cy={326} rx={34} ry={16} fill="url(#skull-hollow)" />
        <path d="M110 382 C120 422 146 458 178 470 C190 474 210 474 222 470 C254 458 280 422 290 382 L290 480 L110 480Z" fill="url(#skull-jaw)" />
      </g>
    </>
  );
}

export function SkullLines() {
  const ink = 'hsl(var(--bone-ink))';
  return (
    <g fill="none" stroke={ink} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
      <defs>
        <radialGradient id="skull-socket" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={ink} stopOpacity={0.7} />
          <stop offset="100%" stopColor={ink} stopOpacity={0.2} />
        </radialGradient>
      </defs>
      <path d={SOCKET_R} fill="url(#skull-socket)" />
      <path d={SOCKET_L} fill="url(#skull-socket)" />
      <path d="M98 206 Q140 184 192 200 M302 206 Q260 184 208 200" strokeWidth={2.2} />
      <path d={NOSE} fill="url(#skull-socket)" />
      <path d="M70 268 Q100 300 150 304 M330 268 Q300 300 250 304" opacity={0.55} />
      <g strokeWidth={1}>
        <path d="M150 346 Q200 336 250 346" opacity={0.6} />
        {UPPER.map((x) => <path key={`u${x}`} d={tooth(x, 346 - (Math.abs(x - 200) < 8 ? 2 : 0), x === 200 ? 14 : 12, 22 - Math.abs(x - 200) / 12, true)} />)}
        {LOWER.map((x) => <path key={`l${x}`} d={tooth(x, 400, x === 200 ? 9 : 11, 18 - Math.abs(x - 200) / 14, false)} />)}
        <path d="M156 400 Q200 410 244 400" opacity={0.6} />
      </g>
      <path d="M120 380 Q150 430 200 440 Q250 430 280 380" strokeWidth={1} opacity={0.45} />
      <path d="M186 452 Q200 458 214 452" strokeWidth={1} opacity={0.7} />
    </g>
  );
}
