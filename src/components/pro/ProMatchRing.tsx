import React from "react";
import { cn } from "@/lib/utils";

/** AI match tiers: 70+ strong, 40-69 fair, below 40 low (same thresholds as the reference portal). */
export const matchTier = (p: number) =>
  p >= 70
    ? { label: "Strong match", text: "text-emerald-600", stroke: "#16a34a" }
    : p >= 40
    ? { label: "Fair match", text: "text-amber-600", stroke: "#f59e0b" }
    : { label: "Low match", text: "text-primary", stroke: "#2563eb" };

interface MatchRingProps {
  percent: number;
  size?: number;
  className?: string;
}

/** Circular percentage ring; the arc and the number always reflect the exact skill-match percent. */
export const MatchRing: React.FC<MatchRingProps> = ({ percent, size = 50, className }) => {
  const p = Math.max(0, Math.min(100, Math.round(percent || 0)));
  const tier = matchTier(p);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={`${p}% skill match`}
    >
      <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-border" strokeWidth="3" />
      {p > 0 && (
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke={tier.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${p} 100`}
          transform="rotate(-90 18 18)"
        />
      )}
      <text x="18" y="21" textAnchor="middle" fontSize="9" fontWeight="700" className="fill-foreground">
        {p}%
      </text>
    </svg>
  );
};

export default MatchRing;
