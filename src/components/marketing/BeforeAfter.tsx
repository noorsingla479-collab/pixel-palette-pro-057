import { useRef, useState } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = "Snapshot",
  afterLabel = "Composed",
}: Props) {
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={trackRef}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl select-none glass-card cursor-ew-resize"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && move(e.clientX)}
    >
      <img
        src={afterSrc}
        alt="After: composed"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={beforeSrc}
          alt="Before: snapshot"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* labels */}
      <span className="absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-glow backdrop-blur">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-glow backdrop-blur">
        {afterLabel}
      </span>

      {/* handle */}
      <div
        className="pointer-events-none absolute inset-y-0 flex w-0.5 flex-col items-center bg-primary-glow"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="pointer-events-auto absolute top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant ring-2 ring-primary-glow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6-6 6 6 6" />
            <path d="m15 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
