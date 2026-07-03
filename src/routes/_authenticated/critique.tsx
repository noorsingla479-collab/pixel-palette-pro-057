import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Loader2, Sparkles, Check, Lightbulb, X } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BlueprintOverlay,
  OVERLAY_OPTIONS,
  type OverlayKind,
} from "@/components/critique/BlueprintOverlay";
import {
  METRIC_LABELS,
  letterGrade,
  scoreTone,
  type MetricKey,
} from "@/lib/critique-utils";
import { cn } from "@/lib/utils";
import { runCritique, type CritiqueResult } from "@/lib/critique.functions";

export const Route = createFileRoute("/_authenticated/critique")({
  component: CritiquePage,
});

function CritiquePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<OverlayKind>("thirds");
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const critiqueFn = useServerFn(runCritique);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      toast.error("Please upload an image under 15 MB");
      return;
    }
    setResult(null);
    setFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");

      // 1) upload to storage
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      // 2) insert row
      const { data: photoRow, error: rowErr } = await supabase
        .from("uploaded_photos")
        .insert({
          user_id: userId,
          storage_path: path,
        })
        .select()
        .single();
      if (rowErr) throw rowErr;

      // 3) call AI critique server fn
      const response = await critiqueFn({ data: { photoId: photoRow.id } });
      setResult(response.result);
      toast.success("Critique ready", {
        description: `Overall score: ${response.result.overall_score} · ${letterGrade(response.result.overall_score)}`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setPreviewUrl(null);
  };

  return (
    <AppShell
      title="AI Critique"
      subtitle="Upload a photo. Get a professional-grade critique in seconds."
      actions={
        file && (
          <Button variant="outline" size="sm" onClick={reset}>
            <X /> New photo
          </Button>
        )
      }
    >
      {!file && (
        <label
          htmlFor="photo-input"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="glass-card grid min-h-[60vh] cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-primary/40 transition-colors hover:border-primary-glow"
        >
          <div className="text-center p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant animate-glow-pulse">
              <Upload className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Drop a photo to critique</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              JPEG, PNG or WebP · up to 15 MB · your photos are private to you.
            </p>
            <Button variant="hero" size="lg" className="mt-6" type="button" onClick={() => inputRef.current?.click()}>
              <Camera /> Choose from device
            </Button>
            <input
              id="photo-input"
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </label>
      )}

      {file && previewUrl && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Photo + blueprint */}
          <div className="glass-card overflow-hidden rounded-3xl p-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
              <img
                src={previewUrl}
                alt="Your uploaded photo"
                className="absolute inset-0 h-full w-full object-contain"
              />
              <BlueprintOverlay kind={overlay} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {OVERLAY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOverlay(opt.value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    overlay === opt.value
                      ? "border-primary-glow bg-primary/20 text-foreground ring-glow"
                      : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results / action */}
          <div className="space-y-6">
            {!result && (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-bold">Ready when you are</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our vision AI will score 8 professional axes and return concrete
                  next-shot tips.
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  className="mt-5 w-full"
                  onClick={analyze}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" /> Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles /> Run AI critique
                    </>
                  )}
                </Button>
                <p className="mt-3 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
                  Avg response ~6s
                </p>
              </div>
            )}

            {result && <ResultPanel result={result} />}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function ResultPanel({ result }: { result: CritiqueResult }) {
  const metrics: [MetricKey, number][] = [
    ["lighting", result.lighting_score],
    ["framing", result.framing_score],
    ["composition", result.composition_score],
    ["subject", result.subject_score],
    ["color", result.color_score],
    ["perspective", result.perspective_score],
    ["background", result.background_score],
    ["storytelling", result.storytelling_score],
  ];

  return (
    <>
      <div className="glass-card rounded-3xl p-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-glow">
              Overall score
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className={cn("text-6xl font-black tabular-nums", scoreTone(result.overall_score))}>
                {result.overall_score}
              </span>
              <span className="text-3xl font-bold text-muted-foreground">
                {letterGrade(result.overall_score)}
              </span>
            </div>
          </div>
          <div className="max-w-[55%] rounded-xl border border-primary/30 bg-primary/5 p-3 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-glow">
              Rule applied
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {result.rule_applied}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {metrics.map(([key, val]) => (
            <div key={key} className="rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {METRIC_LABELS[key]}
                </span>
                <span className={cn("text-sm font-mono font-bold tabular-nums", scoreTone(val))}>
                  {val}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/60">
                <div
                  className="h-full rounded-full gradient-primary"
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FeedbackList
          title="Strengths"
          items={result.strengths}
          tone="success"
          icon={Check}
        />
        <FeedbackList
          title="Watch out for"
          items={result.weaknesses}
          tone="warning"
          icon={X}
        />
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <Lightbulb className="h-4 w-4 text-primary-glow" />
          Next-shot tips
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          {result.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary-glow">
                {i + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card rounded-2xl p-5 border-primary/50 ring-glow">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-glow">
          Practice task · next 24 hrs
        </p>
        <p className="mt-2 text-sm font-medium text-foreground leading-relaxed">
          {result.practice_task}
        </p>
      </div>
    </>
  );
}

function FeedbackList({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning";
  icon: typeof Check;
}) {
  const chipCls =
    tone === "success"
      ? "bg-success/15 text-success"
      : "bg-warning/15 text-warning";
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-muted-foreground">
            <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full", chipCls)}>
              <Icon className="h-3 w-3" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
