import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const CritiqueInput = z.object({
  photoId: z.string().uuid(),
});

const scoreField = z
  .number()
  .int()
  .min(0)
  .max(100)
  .describe("Score from 0-100");

const CritiqueSchema = z.object({
  overall_score: scoreField,
  lighting_score: scoreField,
  framing_score: scoreField,
  composition_score: scoreField,
  subject_score: scoreField,
  color_score: scoreField,
  perspective_score: scoreField,
  background_score: scoreField,
  storytelling_score: scoreField,
  rule_applied: z.string(),
  strengths: z.array(z.string()).max(5),
  weaknesses: z.array(z.string()).max(5),
  tips: z.array(z.string()).max(5),
  practice_task: z.string(),
});

export type CritiqueResult = z.infer<typeof CritiqueSchema>;

const SYSTEM_PROMPT = `You are a senior photography mentor with deep knowledge of composition, lighting, color theory, and visual storytelling. You critique smartphone photos honestly and constructively.

Rules:
- Score every metric 0-100 based on professional photography standards.
- overall_score should reflect the average holistic quality, not just the mean.
- rule_applied: name the primary composition rule you'd apply to improve this shot (Rule of Thirds, Leading Lines, Golden Ratio, Symmetry, Framing, Negative Space, etc.)
- strengths: 2-4 specific things the photographer did well (not generic).
- weaknesses: 2-4 specific things to fix (not vague).
- tips: 2-4 concrete, actionable next-shot instructions.
- practice_task: one focused practice exercise for the next 24 hours.
- Never say "nice photo" or "great shot". Be a mentor, not a cheerleader.`;

export const runCritique = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CritiqueInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1. Load the photo record (RLS ensures ownership)
    const { data: photo, error: photoErr } = await supabase
      .from("uploaded_photos")
      .select("id, storage_path")
      .eq("id", data.photoId)
      .single();
    if (photoErr || !photo) {
      throw new Error("Photo not found");
    }

    // 2. Sign the storage URL so the AI can fetch it
    const { data: signed, error: signErr } = await supabase.storage
      .from("photos")
      .createSignedUrl(photo.storage_path, 300);
    if (signErr || !signed?.signedUrl) {
      throw new Error("Could not access photo");
    }

    // 3. Call Lovable AI Gateway (Gemini vision) — direct chat/completions
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const model = "google/gemini-3-flash-preview";

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Critique this photograph. Score every metric 0-100 and return only the JSON object called `submit_critique`. Do not add commentary.",
                },
                {
                  type: "image_url",
                  image_url: { url: signed.signedUrl },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_critique",
                description:
                  "Submit a structured critique for the photograph, including scores and feedback.",
                parameters: {
                  type: "object",
                  properties: {
                    overall_score: { type: "integer", minimum: 0, maximum: 100 },
                    lighting_score: { type: "integer", minimum: 0, maximum: 100 },
                    framing_score: { type: "integer", minimum: 0, maximum: 100 },
                    composition_score: { type: "integer", minimum: 0, maximum: 100 },
                    subject_score: { type: "integer", minimum: 0, maximum: 100 },
                    color_score: { type: "integer", minimum: 0, maximum: 100 },
                    perspective_score: { type: "integer", minimum: 0, maximum: 100 },
                    background_score: { type: "integer", minimum: 0, maximum: 100 },
                    storytelling_score: { type: "integer", minimum: 0, maximum: 100 },
                    rule_applied: { type: "string" },
                    strengths: { type: "array", items: { type: "string" }, maxItems: 5 },
                    weaknesses: { type: "array", items: { type: "string" }, maxItems: 5 },
                    tips: { type: "array", items: { type: "string" }, maxItems: 5 },
                    practice_task: { type: "string" },
                  },
                  required: [
                    "overall_score",
                    "lighting_score",
                    "framing_score",
                    "composition_score",
                    "subject_score",
                    "color_score",
                    "perspective_score",
                    "background_score",
                    "storytelling_score",
                    "rule_applied",
                    "strengths",
                    "weaknesses",
                    "tips",
                    "practice_task",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "submit_critique" },
          },
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429) {
        throw new Error(
          "AI is rate limiting requests right now. Try again in a moment.",
        );
      }
      if (response.status === 402) {
        throw new Error(
          "AI credits exhausted. Please add credits to your Lovable workspace.",
        );
      }
      console.error("AI gateway error", response.status, text);
      throw new Error("AI critique failed. Please try again.");
    }

    const json = (await response.json()) as {
      choices?: Array<{
        message?: {
          tool_calls?: Array<{
            function?: { arguments?: string };
          }>;
        };
      }>;
    };

    const argsStr =
      json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!argsStr) {
      throw new Error("AI did not return a structured critique.");
    }

    let parsed: CritiqueResult;
    try {
      parsed = CritiqueSchema.parse(JSON.parse(argsStr));
    } catch (e) {
      console.error("Failed to parse AI critique", argsStr, e);
      throw new Error("AI returned an invalid critique. Please try again.");
    }

    // 4. Persist
    const { data: saved, error: insertErr } = await supabase
      .from("photo_critiques")
      .insert({
        photo_id: photo.id,
        user_id: userId,
        model,
        overall_score: parsed.overall_score,
        lighting_score: parsed.lighting_score,
        framing_score: parsed.framing_score,
        composition_score: parsed.composition_score,
        subject_score: parsed.subject_score,
        color_score: parsed.color_score,
        perspective_score: parsed.perspective_score,
        background_score: parsed.background_score,
        storytelling_score: parsed.storytelling_score,
        rule_applied: parsed.rule_applied,
        strengths: parsed.strengths,
        weaknesses: parsed.weaknesses,
        tips: parsed.tips,
        practice_task: parsed.practice_task,
      })
      .select()
      .single();

    if (insertErr) {
      console.error(insertErr);
      throw new Error("Could not save critique.");
    }

    return { critique: saved, result: parsed };
  });
