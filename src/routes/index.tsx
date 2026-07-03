import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Camera,
  BookOpen,
  Trophy,
  Zap,
  Layers,
  Palette,
  Users,
  ArrowRight,
  Check,
  Grid3x3,
} from "lucide-react";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { CompositionDemo } from "@/components/marketing/CompositionDemo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroBefore from "@/assets/hero-before.jpg";
import heroAfter from "@/assets/hero-after.jpg";
import logoAsset from "@/assets/logo.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  {
    icon: Sparkles,
    title: "AI Critique Engine",
    body: "Vision AI scores your shot across 8 professional axes: lighting, framing, composition, subject, color, perspective, background, storytelling.",
  },
  {
    icon: Grid3x3,
    title: "Interactive Blueprints",
    body: "Toggle Rule of Thirds, Golden Ratio, leading lines, symmetry and framing overlays on top of your photo — see the invisible structure.",
  },
  {
    icon: BookOpen,
    title: "Structured Lessons",
    body: "12 photography courses from Rule of Thirds to Street, Portrait, Food and Travel — with practice tasks and quizzes.",
  },
  {
    icon: Zap,
    title: "Personalized Roadmap",
    body: "We track your weakest skill after every critique and route you to the exact lesson that unblocks the next level.",
  },
  {
    icon: Trophy,
    title: "Streaks & Achievements",
    body: "Duolingo-style streaks, unlockable badges, and progress analytics keep you shooting daily.",
  },
  {
    icon: Palette,
    title: "Curated Gear",
    body: "Data-driven gear picks (tripods, filters, presets) tied to your critique history — no random affiliate spam.",
  },
];

const stats = [
  { value: "8", label: "Metrics per critique" },
  { value: "12", label: "Structured lessons" },
  { value: "< 6s", label: "Avg AI response" },
  { value: "100%", label: "Phone-first" },
];

const testimonials = [
  {
    quote:
      "Finally understood why my beach photos looked flat. The blueprint overlay is genius — it's like having Ansel Adams whisper over your shoulder.",
    name: "Priya S.",
    role: "Travel creator",
  },
  {
    quote:
      "I've taken 40,000 photos on my iPhone. Two weeks with Aesthetic Check taught me more than any YouTube channel ever did.",
    name: "Marcus R.",
    role: "Product designer",
  },
  {
    quote:
      "My food photos went from 'Instagram OK' to 'clients ask what camera I used'. It's my phone. Same phone.",
    name: "Elena K.",
    role: "Recipe developer",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    tag: "Try the mentor",
    features: [
      "10 AI critiques / month",
      "Interactive blueprint overlays",
      "3 starter lessons",
      "Basic dashboard",
    ],
    cta: "Get started",
    to: "/auth" as const,
    highlighted: false,
  },
  {
    name: "Pro Monthly",
    price: "$12",
    unit: "/mo",
    tag: "Most photographers",
    features: [
      "Unlimited AI critiques",
      "All 12 premium lessons",
      "Personalized roadmap",
      "Downloadable reports",
      "Exclusive presets",
    ],
    cta: "Start Pro",
    to: "/auth" as const,
    highlighted: true,
  },
  {
    name: "Pro Yearly",
    price: "$99",
    unit: "/yr",
    tag: "Save 30%",
    features: [
      "Everything in Pro Monthly",
      "Priority AI processing",
      "Early access to new lessons",
      "Bonus resource library",
    ],
    cta: "Go Yearly",
    to: "/auth" as const,
    highlighted: false,
  },
  {
    name: "Team",
    price: "$29",
    unit: "/mo per seat",
    tag: "Classrooms & studios",
    features: [
      "Shared classroom & progress",
      "Instructor analytics",
      "Central billing",
      "Priority support",
    ],
    cta: "Talk to us",
    to: "/auth" as const,
    highlighted: false,
  },
];

const faqs = [
  {
    q: "How is this different from Lightroom or VSCO?",
    a: "Lightroom edits, VSCO filters. Aesthetic Check teaches. It explains WHY a photo works and what to do differently next time — grounded in composition theory, not presets.",
  },
  {
    q: "Do I need a fancy camera?",
    a: "No. Aesthetic Check is built for smartphone photographers. Every lesson, critique and blueprint assumes you're shooting with a phone.",
  },
  {
    q: "How does the AI actually work?",
    a: "Every upload goes through a vision-capable AI model that scores 8 photographic axes and returns concrete tips grounded in composition rules — not vague 'nice shot' feedback.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your dashboard, keep access until the end of your billing period. No lock-in.",
  },
  {
    q: "Do you store my photos?",
    a: "Your photos are private to you, encrypted at rest, and never shared. Delete them anytime from your dashboard.",
  },
];

function Index() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 grid-blueprint opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-40 blur-3xl -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />

        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-8">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary-glow backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered photography mentor
            </div>
            <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="metallic-text">Shoot better</span>
              <br />
              <span className="gradient-text">by learning why.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Instagram shows you finished photos. We show you the invisible
              structure behind them — then teach you how to build your own.
              Upload a shot, get an AI critique across 8 axes, and follow a
              roadmap tailored to your weakest skill.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get your free critique
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="#how">See how it works</a>
              </Button>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black metallic-text">{s.value}</div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-3xl opacity-70 blur-2xl"
              style={{ background: "var(--gradient-glow)" }}
            />
            <BeforeAfter beforeSrc={heroBefore} afterSrc={heroAfter} />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Drag the handle. Same subject, different composition — see how much
              structure changes.
            </p>
          </div>
        </div>
      </section>

      {/* LOGO STRIP / TRUST */}
      <section className="border-y border-border/40 bg-surface/40 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground lg:px-8">
          <span>Rule of Thirds</span>
          <span>Golden Ratio</span>
          <span>Leading Lines</span>
          <span>Negative Space</span>
          <span>Symmetry</span>
          <span>Framing</span>
          <span>Horizon</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-glow">
              What's inside
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              A studio-grade critic{" "}
              <span className="gradient-text">in your pocket.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every part of the app is engineered to accelerate one thing:
              your photographic taste.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-glow/50"
              >
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: "var(--gradient-glow)" }}
                />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — live composition demo */}
      <section id="how" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-glow">
                Interactive
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Move the sliders.{" "}
                <span className="gradient-text">Watch the score think.</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                This is a live preview of the composition dashboard you get
                after every AI critique. Adjust any metric — overall score,
                letter grade, weakest skill and next lesson update instantly.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Real-time overall score & letter grade",
                  "Auto-detects your weakest metric",
                  "Suggests the exact lesson that helps",
                  "Same UI as the post-critique screen",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild variant="hero" size="lg">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Upload your first photo <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
            <CompositionDemo />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-surface/30 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-glow">
              Loved by phone photographers
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              People are shipping better shots{" "}
              <span className="gradient-text">every week.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="glass-card flex flex-col rounded-2xl p-6"
              >
                <blockquote className="text-sm leading-relaxed text-foreground">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-glow">
              Pricing
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Start free. <span className="gradient-text">Grow when ready.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every plan includes the AI critique engine. Upgrade to unlock
              unlimited uploads, premium lessons, and priority processing.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((p) => (
              <div
                key={p.name}
                className={
                  p.highlighted
                    ? "glass-card ring-glow relative rounded-2xl p-6 border-primary/60"
                    : "glass-card rounded-2xl p-6"
                }
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-elegant">
                    Most popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-glow">
                    {p.tag}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black metallic-text">
                    {p.price}
                  </span>
                  {p.unit && (
                    <span className="text-sm text-muted-foreground">{p.unit}</span>
                  )}
                </div>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={p.highlighted ? "hero" : "outline"}
                  className="mt-6 w-full"
                >
                  <Link to={p.to}>{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-glow">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Questions, <span className="gradient-text">answered.</span>
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="glass-card rounded-2xl border-none px-5"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="glass-card ring-glow relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-60"
              style={{ background: "var(--gradient-hero)" }}
            />
            <img
              src={logoAsset.url}
              alt=""
              aria-hidden
              className="mx-auto h-16 w-16 rounded-2xl object-cover scale-[1.4] -mb-2"
            />
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              <span className="metallic-text">Your next great photo</span>
              <br />
              <span className="gradient-text">is one critique away.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Free forever plan. No credit card. Upload a photo, get real feedback
              in seconds.
            </p>
            <div className="mt-8">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start your free critique <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
