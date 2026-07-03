import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, Sparkles, TrendingUp, Flame, ArrowRight, Trophy } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { METRIC_LABELS, scoreTone, letterGrade, type MetricKey } from "@/lib/critique-utils";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      return data;
    },
  });

  const { data: critiques } = useQuery({
    queryKey: ["critiques", "recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photo_critiques")
        .select("*, uploaded_photos(storage_path)")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const totalCritiques = critiques?.length ?? 0;
  const avgScore =
    critiques && critiques.length > 0
      ? Math.round(
          critiques.reduce((s, c) => s + c.overall_score, 0) / critiques.length,
        )
      : null;
  const bestScore = critiques && critiques.length > 0
    ? Math.max(...critiques.map((c) => c.overall_score))
    : null;

  return (
    <AppShell
      title={`Welcome back${profile?.display_name ? `, ${profile.display_name}` : ""}`}
      subtitle="Your photography studio at a glance."
      actions={
        <Button asChild variant="hero" size="sm">
          <Link to="/critique">
            <Camera /> New critique
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Sparkles}
          label="Total critiques"
          value={String(totalCritiques)}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg score"
          value={avgScore !== null ? String(avgScore) : "—"}
          hint={avgScore !== null ? letterGrade(avgScore) : undefined}
        />
        <StatCard
          icon={Trophy}
          label="Best shot"
          value={bestScore !== null ? String(bestScore) : "—"}
          hint={bestScore !== null ? letterGrade(bestScore) : undefined}
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${profile?.streak_days ?? 0}d`}
          hint="Daily practice"
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Recent critiques</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/critique">
              View all <ArrowRight />
            </Link>
          </Button>
        </div>

        {!critiques || critiques.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {critiques.map((c) => (
              <CritiqueCard
                key={c.id}
                score={c.overall_score}
                weakest={findWeakest(c) as MetricKey}
                rule={c.rule_applied ?? "—"}
                createdAt={c.created_at}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Camera;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black metallic-text tabular-nums">{value}</span>
        {hint && <span className="text-sm text-primary-glow font-semibold">{hint}</span>}
      </div>
    </div>
  );
}

function CritiqueCard({
  score,
  weakest,
  rule,
  createdAt,
}: {
  score: number;
  weakest: MetricKey;
  rule: string;
  createdAt: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary-glow">
            {rule}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="text-right">
          <div className={cn("text-3xl font-black tabular-nums", scoreTone(score))}>
            {score}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            {letterGrade(score)}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-xs">
        <span className="text-muted-foreground">Focus next: </span>
        <span className="font-semibold text-foreground">{METRIC_LABELS[weakest]}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card rounded-3xl p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
        <Camera className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-bold">Your first critique awaits</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Upload any smartphone photo. In seconds you'll get a score across 8
        professional axes plus concrete next-shot tips.
      </p>
      <div className="mt-6">
        <Button asChild variant="hero" size="lg">
          <Link to="/critique">
            <Camera /> Upload a photo
          </Link>
        </Button>
      </div>
    </div>
  );
}

function findWeakest(c: {
  lighting_score: number;
  framing_score: number;
  composition_score: number;
  subject_score: number;
  color_score: number;
  perspective_score: number;
  background_score: number;
  storytelling_score: number;
}) {
  const entries: [MetricKey, number][] = [
    ["lighting", c.lighting_score],
    ["framing", c.framing_score],
    ["composition", c.composition_score],
    ["subject", c.subject_score],
    ["color", c.color_score],
    ["perspective", c.perspective_score],
    ["background", c.background_score],
    ["storytelling", c.storytelling_score],
  ];
  return entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min))[0];
}

