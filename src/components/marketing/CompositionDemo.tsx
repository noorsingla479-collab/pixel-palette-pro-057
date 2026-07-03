import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  METRIC_LABELS,
  type MetricKey,
  letterGrade,
  scoreTone,
  suggestedLesson,
} from "@/lib/critique-utils";
import { cn } from "@/lib/utils";

const initial: Record<MetricKey, number> = {
  lighting: 72,
  framing: 65,
  composition: 78,
  subject: 82,
  color: 60,
  perspective: 55,
  background: 68,
  storytelling: 74,
};

export function CompositionDemo() {
  const [scores, setScores] = useState(initial);

  const overall = useMemo(() => {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scores]);

  const weakest = useMemo(() => {
    return (Object.entries(scores) as [MetricKey, number][]).reduce(
      (min, cur) => (cur[1] < min[1] ? cur : min),
    )[0];
  }, [scores]);

  const lesson = suggestedLesson(weakest);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-glow">
            Live Composition Score
          </p>
          <div className="mt-2 flex items-baseline gap-4">
            <span className={cn("text-6xl font-black tabular-nums", scoreTone(overall))}>
              {overall}
            </span>
            <span className="text-3xl font-bold text-muted-foreground">
              {letterGrade(overall)}
            </span>
          </div>
        </div>
        <div className="max-w-xs rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-glow">
            Weakest → Suggested lesson
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{lesson.title}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {lesson.body}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {(Object.keys(METRIC_LABELS) as MetricKey[]).map((key) => (
          <div key={key}>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{METRIC_LABELS[key]}</span>
              <span className={cn("font-mono tabular-nums", scoreTone(scores[key]))}>
                {scores[key]}
              </span>
            </div>
            <Slider
              value={[scores[key]]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => setScores((s) => ({ ...s, [key]: v[0] }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
