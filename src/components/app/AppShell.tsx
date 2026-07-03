import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Camera,
  BookOpen,
  Trophy,
  Sparkles,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/critique", label: "AI Critique", icon: Camera },
  { to: "/lessons", label: "Lessons", icon: BookOpen, soon: true },
  { to: "/progress", label: "Progress", icon: Trophy, soon: true },
  { to: "/gear", label: "Gear", icon: Sparkles, soon: true },
  { to: "/billing", label: "Billing", icon: CreditCard, soon: true },
  { to: "/settings", label: "Settings", icon: Settings, soon: true },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setDisplayName(
        (data.user?.user_metadata?.display_name as string | undefined) ??
          data.user?.email?.split("@")[0] ??
          "Photographer",
      );
    });
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border/50 bg-sidebar/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-5">
          <Logo size="sm" />
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3">
          <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Studio
          </p>
          <ul className="mt-1 space-y-0.5">
            {nav.map((item) => {
              const active = location.pathname === item.to || (item.to === "/dashboard" && location.pathname === "/dashboard");
              const disabled = item.soon;
              const inner = (
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                    disabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.soon && (
                    <span className="rounded-full border border-border/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-glow/80">
                      Soon
                    </span>
                  )}
                </span>
              );
              return (
                <li key={item.to}>
                  {disabled ? (
                    <div>{inner}</div>
                  ) : (
                    <Link to={item.to as any}>{inner}</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-border/50 bg-card/60 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
              {displayName.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <button
              onClick={signOut}
              className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 flex-1 sm:flex sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-10">{children}</main>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
