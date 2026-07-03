import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              An AI-powered photography mentor that teaches you the craft behind
              every great shot — right from your phone.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-glow">
              Product
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-glow">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Aesthetic Check. All rights reserved.</p>
          <p className="tracking-widest uppercase">Crafted for photographers.</p>
        </div>
      </div>
    </footer>
  );
}
