import logoAsset from "@/assets/logo.asset.json";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  to?: string;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function Logo({
  className,
  showWordmark = true,
  size = "md",
  to = "/",
}: LogoProps) {
  const content = (
    <span className={cn("group inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative grid place-items-center rounded-xl overflow-hidden shrink-0",
          sizes[size],
        )}
      >
        <img
          src={logoAsset.url}
          alt="Aesthetic Check logo"
          className="h-full w-full object-cover scale-[1.6] translate-y-[-6%]"
          loading="eager"
          decoding="async"
        />
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary-glow/30 group-hover:ring-primary-glow/60 transition" />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="metallic-text text-base font-black tracking-[0.02em]">
            AESTHETIC CHECK
          </span>
          <span className="text-[10px] font-medium tracking-[0.35em] text-primary-glow/70 mt-1">
            PHOTOGRAPHY MENTOR
          </span>
        </span>
      )}
    </span>
  );

  return to ? (
    <Link to={to} className="inline-flex focus-visible:outline-none">
      {content}
    </Link>
  ) : (
    content
  );
}
