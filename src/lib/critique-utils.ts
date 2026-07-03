export const METRIC_LABELS = {
  lighting: "Lighting",
  framing: "Framing",
  composition: "Composition",
  subject: "Subject",
  color: "Color",
  perspective: "Perspective",
  background: "Background",
  storytelling: "Storytelling",
} as const;

export type MetricKey = keyof typeof METRIC_LABELS;

export function letterGrade(score: number): string {
  if (score >= 93) return "A+";
  if (score >= 87) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  if (score >= 45) return "D";
  return "F";
}

export function scoreTone(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary-glow";
  if (score >= 45) return "text-warning";
  return "text-destructive";
}

export function suggestedLesson(weakest: MetricKey): {
  title: string;
  body: string;
} {
  const map: Record<MetricKey, { title: string; body: string }> = {
    lighting: {
      title: "Master Natural Light",
      body: "Shoot in the golden hour, use windows as soft boxes, avoid harsh midday sun.",
    },
    framing: {
      title: "Framing Fundamentals",
      body: "Use archways, doorways and foliage to build depth inside the frame.",
    },
    composition: {
      title: "Rule of Thirds & Golden Ratio",
      body: "Place subjects at intersection points; balance negative space intentionally.",
    },
    subject: {
      title: "Subject Placement",
      body: "Isolate one hero. Move closer. Remove competing elements.",
    },
    color: {
      title: "Color Theory for Photographers",
      body: "Work with complementary palettes and control white balance.",
    },
    perspective: {
      title: "Change Your Angle",
      body: "Try low, high, dutch and eye-level to find the most cinematic view.",
    },
    background: {
      title: "Clean Backgrounds",
      body: "Watch for clutter and mergers. Blur, reframe or step aside.",
    },
    storytelling: {
      title: "Photos That Tell Stories",
      body: "Look for gesture, moment and context. Ask 'why this frame?'.",
    },
  };
  return map[weakest];
}
