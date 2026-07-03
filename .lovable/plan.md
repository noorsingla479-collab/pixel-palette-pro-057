# Aesthetic Check — Photography Mentor

## Stack reconciliation (important)

Your spec lists Express + Prisma + Cloudinary + Razorpay + Vercel/Railway. This project runs on **TanStack Start (React 19 + Vite) on Cloudflare Workers** with **Lovable Cloud (Supabase)** as the managed backend. Substitutions I'll use — same capabilities, native to the runtime:

| You asked for | I'll use | Why |
|---|---|---|
| Express + Prisma REST API | TanStack `createServerFn` + server routes (TypeScript, Zod-validated) | Native server layer; no separate backend to deploy |
| PostgreSQL via Prisma | Supabase Postgres + RLS (via Lovable Cloud) | Managed, auth-integrated, row-level security |
| Cloudinary | Supabase Storage (with image transforms) | Native, signed URLs, RLS-scoped |
| JWT/cookies/bcrypt | Supabase Auth (email + Google OAuth, sessions, reset) | Handles everything you listed |
| OpenAI/Gemini/Anthropic Vision | **Lovable AI Gateway** → `google/gemini-3-flash-preview` (vision) | Zero-key setup, real AI from day one (no mocks) |
| Razorpay | **Stripe** (via Lovable payments) | Razorpay isn't supported on this platform. Stripe is the built-in option and supports subs, trials, coupons, webhooks, invoices |
| Zustand / Axios / React Router | TanStack Router + TanStack Query + React hooks | Already wired; adding Zustand/Axios would be redundant |
| Vercel + Railway + Render | Lovable publish (Cloudflare Workers edge) | One-click deploy |

If Razorpay is a hard requirement (India/INR), tell me — otherwise I'll proceed with Stripe.

## Phased delivery

A full production SaaS with admin panel, subscriptions, lessons, achievements, affiliate engine, and AI is **weeks of work across many turns**. I'll ship it in phases so each phase is polished, not half-built.

### Phase 1 — Foundation (this build)
1. **Design system** derived from your logo: `#071A2D` bg, `#0D243A` surfaces, `#142C46` cards, `#3B82F6` primary, `#8FD8FF` glow, metallic `#C8D2DD` accents. Inter typography, 16px radius, glass cards with blue borders, soft glow shadows — all tokenized in `src/styles.css` (oklch). Framer Motion for fade/scale/slide (150–300ms).
2. **Landing page** (`/`) — full-screen animated hero with logo, before/after photo comparison slider, features grid, live composition-score demo, stats, testimonials, pricing preview (Free / Pro Monthly / Pro Yearly / Team), FAQ, footer. SEO metadata + og:image.
3. **Auth** — Enable Lovable Cloud. Supabase email/password + Google OAuth. `/auth` page with sign-in / sign-up. `/reset-password`. Auto-created `profiles` table via trigger. `user_roles` table with `has_role()` security-definer (admin/user), per platform rules.
4. **Protected dashboard shell** (`/_authenticated/dashboard`) — sidebar nav (Overview, Critique, Lessons, Progress, Gear, Billing, Settings) + top bar with avatar/streak/plan badge. Empty-state cards ready for real data.
5. **AI Critique MVP** (`/_authenticated/critique`) — upload photo → Supabase Storage → server function calls Lovable AI Gateway (Gemini vision) with a structured Zod schema → returns Overall Score, per-metric scores (Lighting, Framing, Composition, Subject, Color, Perspective, Background, Storytelling), rule applied, strengths, weaknesses, practice suggestion. Interactive **Blueprint Overlay** on the photo (Rule of Thirds / Leading Lines / Golden Ratio / Symmetry toggles rendered as SVG). Results persisted to `photo_critiques` table.
6. **Interactive Composition Dashboard** — sliders that recompute score + letter grade + weakest metric + suggested lesson in real time (client-only, matches your spec).
7. **DB schema** for phase 1: `profiles`, `user_roles`, `uploaded_photos`, `photo_critiques` (with RLS + GRANTs per platform rules). Storage bucket `photos` (private, signed URLs).
8. **SEO/infra**: `sitemap.xml` route, `robots.txt`, per-route head metadata, favicon.

### Phase 2 — Learning + Progress
- `lessons`, `lesson_progress`, `achievements`, `recommendations` tables + seed data (12 lessons you listed)
- `/lessons` catalog + lesson detail with explanation/example/quiz/completion
- Achievement unlocks, learning streak, progress analytics
- Recommendation engine (weakest metric → lesson)

### Phase 3 — Monetization
- Stripe integration (Lovable payments): Free / Pro Monthly / Pro Yearly / Team, trials, coupons, webhooks
- Entitlement gating (upload caps, downloads, premium lessons)
- Billing history + invoices in dashboard

### Phase 4 — Affiliate + Admin
- `affiliate_products` + rules engine (critique metric → product suggestions)
- Admin panel with role gate: users, photos, critiques, revenue, subscriptions, coupons, affiliate links, analytics

## Technical notes for phase 1

- All AI is real (Lovable AI Gateway, no mocks) — vision-capable Gemini analyzes the uploaded photo.
- Every DB table gets explicit GRANTs + RLS policies scoped to `auth.uid()`.
- Server functions use `requireSupabaseAuth` middleware; bearer attacher registered in `src/start.ts`.
- Protected routes live under `src/routes/_authenticated/` (integration-managed gate).
- Google OAuth uses the Lovable broker (`lovable.auth.signInWithOAuth`).
- Zod validation on every server-fn input; structured output on AI calls.
- No Zustand — TanStack Query owns server state, React state owns UI state.

## What I need from you before I start
1. **Razorpay vs Stripe** — Stripe unless you say otherwise (Razorpay isn't available on this platform).
2. **Phase 1 scope OK?** — Landing + auth + dashboard + real AI critique + composition dashboard in this build. Phases 2–4 in follow-up turns. If you want a different slice (e.g. lessons before AI), say so.
3. **Logo file** — I'll use the uploaded PNG as-is in the header/hero via Lovable Assets (no re-generation).