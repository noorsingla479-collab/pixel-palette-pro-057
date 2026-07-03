import { cn } from "@/lib/utils";

export type OverlayKind =
  | "none"
  | "thirds"
  | "golden"
  | "leading"
  | "symmetry"
  | "framing"
  | "horizon";

const PHI = 1.618;

export function BlueprintOverlay({ kind }: { kind: OverlayKind }) {
  if (kind === "none") return null;
  const stroke = "url(#glowStroke)";
  const soft = "oklch(0.86 0.11 232 / 55%)";
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        "drop-shadow-[0_0_12px_oklch(0.86_0.11_232/0.35)]",
      )}
    >
      <defs>
        <linearGradient id="glowStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.11 232)" />
          <stop offset="100%" stopColor="oklch(0.63 0.19 253)" />
        </linearGradient>
      </defs>

      {kind === "thirds" && (
        <g stroke={stroke} strokeWidth="0.4" fill="none" opacity="0.95">
          <line x1="33.33" y1="0" x2="33.33" y2="100" />
          <line x1="66.66" y1="0" x2="66.66" y2="100" />
          <line x1="0" y1="33.33" x2="100" y2="33.33" />
          <line x1="0" y1="66.66" x2="100" y2="66.66" />
          {[
            [33.33, 33.33],
            [66.66, 33.33],
            [33.33, 66.66],
            [66.66, 66.66],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill={soft} />
          ))}
        </g>
      )}

      {kind === "golden" && (
        <g stroke={stroke} strokeWidth="0.4" fill="none">
          {(() => {
            const w = 100;
            const h = w / PHI;
            const boxes = [
              { x: 0, y: 0, w, h },
              { x: w - w / PHI, y: 0, w: w / PHI, h },
            ];
            return boxes.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} />
            ));
          })()}
          <path
            d="M 0 0 Q 62 0, 62 38 T 100 62"
            stroke={stroke}
            strokeWidth="0.5"
            fill="none"
          />
        </g>
      )}

      {kind === "leading" && (
        <g stroke={stroke} strokeWidth="0.5" fill="none">
          <line x1="0" y1="100" x2="50" y2="45" />
          <line x1="100" y1="100" x2="50" y2="45" />
          <circle cx="50" cy="45" r="1.6" fill={soft} />
        </g>
      )}

      {kind === "symmetry" && (
        <g stroke={stroke} strokeWidth="0.4" fill="none">
          <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="1.5 1.5" />
          <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="1.5 1.5" />
        </g>
      )}

      {kind === "framing" && (
        <g stroke={stroke} strokeWidth="0.6" fill="none">
          <rect x="8" y="8" width="84" height="84" rx="2" />
          <rect x="14" y="14" width="72" height="72" rx="1" opacity="0.5" />
        </g>
      )}

      {kind === "horizon" && (
        <g stroke={stroke} strokeWidth="0.5" fill="none">
          <line x1="0" y1="50" x2="100" y2="50" />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            strokeDasharray="0.5 2"
            opacity="0.5"
          />
        </g>
      )}
    </svg>
  );
}

export const OVERLAY_OPTIONS: { value: OverlayKind; label: string }[] = [
  { value: "none", label: "None" },
  { value: "thirds", label: "Rule of Thirds" },
  { value: "golden", label: "Golden Ratio" },
  { value: "leading", label: "Leading Lines" },
  { value: "symmetry", label: "Symmetry" },
  { value: "framing", label: "Framing" },
  { value: "horizon", label: "Horizon" },
];
