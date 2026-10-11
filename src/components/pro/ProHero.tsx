import React from "react";
import { cn } from "@/lib/utils";

interface ProHeroProps {
  /** Lucide icon element rendered inside the frosted tile next to the title */
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Content placed under the subtitle (chips, buttons, search bars) */
  children?: React.ReactNode;
  /** Content placed on the right side of the hero (stat tiles, callouts, illustration) */
  aside?: React.ReactNode;
  className?: string;
}

/**
 * Shared red gradient hero for every Talento Pro page.
 * The `pro-hero` class forces white heading text, because the global
 * `h1..h6 { color: black }` base rule would otherwise make hero titles dark.
 */
export const ProHero: React.FC<ProHeroProps> = ({ icon, title, subtitle, children, aside, className }) => (
  <section
    className={cn(
      "pro-hero relative overflow-hidden rounded-2xl p-5 sm:p-7 shadow-lg shadow-primary/20 text-white !text-white",
      "bg-gradient-to-br from-[#ec2639] via-[#f03a4d] to-[#ff5566]",
      className
    )}
    style={{ color: "#ffffff" }}
  >
    <span aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/10" />
    <span aria-hidden className="pointer-events-none absolute right-24 -bottom-20 h-44 w-44 rounded-full bg-white/10" />
    <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between text-white !text-white">
      <div className="min-w-0 max-w-3xl space-y-3 text-white !text-white">
        <div className="flex items-center gap-3 text-white !text-white">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 text-white [&_svg]:h-5 [&_svg]:w-5">
              {icon}
            </span>
          )}
          <h1
            className="hero-title font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white !text-white"
            style={{ color: "#ffffff" }}
          >
            {title}
          </h1>
        </div>
        {subtitle && (
          <p
            className="hero-sub text-xs sm:text-sm leading-relaxed text-white/90 !text-white"
            style={{ color: "rgba(255, 255, 255, 0.95)" }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {aside && <div className="relative shrink-0">{aside}</div>}
    </div>
  </section>
);

export default ProHero;
