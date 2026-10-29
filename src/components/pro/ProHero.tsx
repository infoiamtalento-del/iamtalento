import React from "react";
import { cn } from "@/lib/utils";

interface ProHeroProps {
  /** Optional eyebrow pill/label rendered above the title */
  eyebrow?: React.ReactNode;
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
export const ProHero: React.FC<ProHeroProps> = ({ eyebrow, icon, title, subtitle, children, aside, className }) => (
  <section
    className={cn(
      "pro-hero relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[#002C66]/30 shadow-md",
      "bg-[#002C66] text-white",
      className
    )}
  >
    <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 max-w-3xl space-y-3">
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-100 border border-white/20">
            {eyebrow}
          </div>
        )}
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white border border-white/20 [&_svg]:h-5 [&_svg]:w-5 shadow-2xs backdrop-blur-xs">
              {icon}
            </span>
          )}
          <h1 className="hero-title font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="hero-sub text-xs sm:text-sm leading-relaxed text-blue-100">
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
