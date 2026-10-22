import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  BadgeCheck,
  Bot,
  Clock,
  Users,
  Briefcase,
  PlayCircle,
  Sparkles,
  Crosshair,
  type LucideIcon,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

import usp01Affordable from "@/assets/usp-wheel/usp-01-affordable.jpg";
import usp02VerifiedMentors from "@/assets/usp-wheel/usp-02-verified-mentors.jpg";
import usp03AiCompanion from "@/assets/usp-wheel/usp-03-ai-companion.jpg";
import usp04LearnAnytime from "@/assets/usp-wheel/usp-04-learn-anytime.jpg";
import usp05ExpertSessions from "@/assets/usp-wheel/usp-05-expert-sessions.jpg";
import usp06RealWorld from "@/assets/usp-wheel/usp-06-real-world.jpg";
import usp07OnDemand from "@/assets/usp-wheel/usp-07-on-demand.jpg";
import usp08Personalised from "@/assets/usp-wheel/usp-08-personalised.jpg";

interface WheelUSP {
  id: string;
  slot: string;
  headline: string;
  description: string;
  icon: LucideIcon;
  statLabel: string;
  categoryTag: string;
  image: string;
}

const WHEEL_USPS: WheelUSP[] = [
  {
    id: "affordable-learning",
    slot: "01",
    headline: "Affordable Learning",
    description: "Expert knowledge without the hefty price tag",
    icon: Wallet,
    statLabel: "High ROI Access",
    categoryTag: "VALUE PERK",
    image: usp01Affordable,
  },
  {
    id: "verified-mentors",
    slot: "02",
    headline: "Verified Mentors",
    description: "Learn from trusted industry professionals",
    icon: BadgeCheck,
    statLabel: "100% Vetted",
    categoryTag: "TRUST PERK",
    image: usp02VerifiedMentors,
  },
  {
    id: "ai-learning-companion",
    slot: "03",
    headline: "AI Learning Companion",
    description: "Your doubts answered while you learn",
    icon: Bot,
    statLabel: "24/7 Instant Help",
    categoryTag: "AI CORE PERK",
    image: usp03AiCompanion,
  },
  {
    id: "learn-anytime",
    slot: "04",
    headline: "Learn Anytime",
    description: "Flexible learning on your schedule",
    icon: Clock,
    statLabel: "Zero Deadlines",
    categoryTag: "PACE PERK",
    image: usp04LearnAnytime,
  },
  {
    id: "expert-sessions",
    slot: "05",
    headline: "1:1 Expert Sessions",
    description: "Personalised guidance when you need it",
    icon: Users,
    statLabel: "Live Mentorship",
    categoryTag: "MENTOR PERK",
    image: usp05ExpertSessions,
  },
  {
    id: "real-world-knowledge",
    slot: "06",
    headline: "Real-World Knowledge",
    description: "Practical skills beyond theory",
    icon: Briefcase,
    statLabel: "Job-Ready Workflows",
    categoryTag: "IMPACT PERK",
    image: usp06RealWorld,
  },
  {
    id: "on-demand-courses",
    slot: "07",
    headline: "On-Demand Courses",
    description: "Learn whenever and wherever you want",
    icon: PlayCircle,
    statLabel: "Multi-Device",
    categoryTag: "ACCESS PERK",
    image: usp07OnDemand,
  },
  {
    id: "personalised-learning",
    slot: "08",
    headline: "Personalised Learning",
    description: "A learning experience built around you",
    icon: Sparkles,
    statLabel: "Adaptive Path",
    categoryTag: "CUSTOM PERK",
    image: usp08Personalised,
  },
];

// Helper to convert polar to cartesian coordinates
function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

// Helper to create SVG annular sector (weapon wheel wedge) path
function createWedgePath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, endAngle);
  const endInner = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    startOuter.x,
    startOuter.y,
    "A",
    rOuter,
    rOuter,
    0,
    largeArcFlag,
    0,
    endOuter.x,
    endOuter.y,
    "L",
    endInner.x,
    endInner.y,
    "A",
    rInner,
    rInner,
    0,
    largeArcFlag,
    1,
    startInner.x,
    startInner.y,
    "Z",
  ].join(" ");
}

// Helper for outer accent arc
function createArcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

const LearningWeaponWheelSection = () => {
  const [activeIndex, setActiveIndex] = useState<number>(2); // Default to AI Learning Companion
  const [tooltipDismissed, setTooltipDismissed] = useState<boolean>(false);
  const baseId = useId();

  // WCAG 1.4.13: Allow Escape key to dismiss the active hover tooltip without moving focus/hover
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTooltipDismissed(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectSlot = (index: number) => {
    setActiveIndex(index);
    setTooltipDismissed(false);
  };

  const activeUSP = WHEEL_USPS[activeIndex];
  const ActiveIcon = activeUSP.icon;

  // Enlarged Center-Aligned SVG Wheel geometry
  const cx = 340;
  const cy = 340;
  const activeAngle = activeIndex * 45 - 90;

  // Position for floating tooltip callout anchored near the active wedge's outer edge
  const tooltipPos = polarToCartesian(cx, cy, 295, activeAngle);
  const tooltipLeftPct = (tooltipPos.x / 680) * 100;
  const tooltipTopPct = (tooltipPos.y / 680) * 100;

  return (
    <section className="py-16 md:py-24 bg-[#FBF4EB] relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <SectionBadge label="Interactive Learning Arsenal" icon={Crosshair} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 text-slate-950"
          >
            Select Your Power-Up.<br />
            <span className="text-primary">Built Around How You Learn.</span>
          </motion.h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Hover or tap any segment on the radial wheel to inspect your learning perks and see how human expertise and AI assistance work hand in hand.
          </p>
        </div>

        {/* ─── CENTER-ALIGNED ENLARGED GAME WEAPON WHEEL + HIGHLIGHTED TOOLTIP ─── */}
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="relative w-full max-w-[680px] md:max-w-[740px] aspect-square flex items-center justify-center select-none">
            <svg
              viewBox="0 0 680 680"
              className="w-full h-full overflow-visible drop-shadow-[0_14px_38px_rgba(0,44,102,0.14)]"
              role="group"
              aria-label="Learning USP Radial Selection Wheel"
            >
              <defs>
                <filter id="wedgeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#002C66" floodOpacity="0.32" />
                </filter>
                <clipPath id="centerHubClip">
                  <circle cx={cx} cy={cy} r="126" />
                </clipPath>
              </defs>

              {/* Outer tactical radar circles in brand navy */}
              <circle
                cx={cx}
                cy={cy}
                r="332"
                fill="none"
                stroke="rgba(0, 44, 102, 0.18)"
                strokeWidth="1.25"
                strokeDasharray="4 6"
              />
              <circle
                cx={cx}
                cy={cy}
                r="316"
                fill="none"
                stroke="rgba(0, 44, 102, 0.14)"
                strokeWidth="1.25"
              />

              {/* 8 Enlarged Weapon Wheel Wedges */}
              {WHEEL_USPS.map((usp, index) => {
                const isSelected = activeIndex === index;
                const centerAngle = index * 45 - 90;
                const startAngle = centerAngle - 20.5;
                const endAngle = centerAngle + 20.5;

                const rInner = isSelected ? 136 : 144;
                const rOuter = isSelected ? 304 : 282;

                const wedgePath = createWedgePath(cx, cy, rInner, rOuter, startAngle, endAngle);
                const outerArc = createArcPath(cx, cy, 316, startAngle + 2, endAngle - 2);
                const labelPos = polarToCartesian(cx, cy, isSelected ? 222 : 214, centerAngle);
                const slotPos = polarToCartesian(cx, cy, isSelected ? 156 : 162, centerAngle);
                const IconComponent = usp.icon;
                const tooltipId = `${baseId}-usp-tooltip-${usp.id}`;

                return (
                  <g
                    key={usp.id}
                    className="cursor-pointer transition-transform duration-200 focus:outline-none"
                    onMouseEnter={() => handleSelectSlot(index)}
                    onFocus={() => handleSelectSlot(index)}
                    onClick={() => handleSelectSlot(index)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    aria-describedby={isSelected && !tooltipDismissed ? tooltipId : undefined}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectSlot(index);
                      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                        e.preventDefault();
                        handleSelectSlot((index + 1) % WHEEL_USPS.length);
                      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                        e.preventDefault();
                        handleSelectSlot((index - 1 + WHEEL_USPS.length) % WHEEL_USPS.length);
                      }
                    }}
                  >
                    {/* Wedge Sector: Solid #002C66 when active, crisp white card when idle */}
                    <path
                      d={wedgePath}
                      fill={isSelected ? "#002C66" : "#FFFFFF"}
                      stroke={isSelected ? "#002C66" : "rgba(15, 23, 42, 0.22)"}
                      strokeWidth={isSelected ? "2.5" : "1.25"}
                      filter={isSelected ? "url(#wedgeGlow)" : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Active Outer Tactical Highlight Rim in Brand Navy */}
                    {isSelected && (
                      <path
                        d={outerArc}
                        fill="none"
                        stroke="#002C66"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Inner Slot Number Tag */}
                    <text
                      x={slotPos.x}
                      y={slotPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-xs font-mono font-bold tracking-widest pointer-events-none ${
                        isSelected ? "fill-white/80" : "fill-slate-400"
                      }`}
                    >
                      {usp.slot}
                    </text>

                    {/* ForeignObject for Crisp Icon + Headline inside each Wedge */}
                    <foreignObject
                      x={labelPos.x - 70}
                      y={labelPos.y - 44}
                      width="140"
                      height="88"
                      className="pointer-events-none overflow-visible"
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center text-center px-1">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center mb-1.5 transition-all duration-200 ${
                            isSelected
                              ? "bg-white text-[#002C66] shadow-md scale-110"
                              : "bg-[#002C66]/10 text-[#002C66] border border-[#002C66]/20"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-[13px] font-display font-bold leading-[1.15] line-clamp-2 ${
                            isSelected ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {usp.headline}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Enlarged Center Hub Portal with Dynamic Selected Image & Brand Navy Ring */}
              <circle
                cx={cx}
                cy={cy}
                r="132"
                fill="#002C66"
                stroke="#002C66"
                strokeWidth="3.5"
              />

              {/* Center Clipped Dynamic USP Image */}
              <g clipPath="url(#centerHubClip)">
                <image
                  href={activeUSP.image}
                  x={cx - 126}
                  y={cy - 126}
                  width="252"
                  height="252"
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx={cx} cy={cy} r="126" fill="rgba(0, 44, 102, 0.38)" />
              </g>

              {/* Rotating Weapon Wheel Reticle Pointer in Brand Navy */}
              <g
                transform={`rotate(${activeAngle + 90}, ${cx}, ${cy})`}
                className="transition-transform duration-300 ease-out pointer-events-none"
              >
                <polygon
                  points={`${cx},${cy - 140} ${cx - 10},${cy - 122} ${cx + 10},${cy - 122}`}
                  fill="#002C66"
                />
              </g>

              {/* Center Hub Active Text Overlay */}
              <foreignObject
                x={cx - 105}
                y={cy - 75}
                width="210"
                height="150"
                className="pointer-events-none"
              >
                <div className="w-full h-full flex flex-col items-center justify-end pb-3 text-center px-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white font-bold drop-shadow">
                    SLOT {activeUSP.slot} ACTIVE
                  </span>
                  <p className="text-base font-extrabold font-display text-white leading-tight mt-0.5 drop-shadow">
                    {activeUSP.headline}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#002C66] border border-white/40 text-[10px] font-semibold text-white shadow-sm">
                    {activeUSP.statLabel}
                  </span>
                </div>
              </foreignObject>
            </svg>

            {/* ─── HIGHLIGHTED FLOATING WEAPON-WHEEL TOOLTIP CALLOUT (Hoverable + Dismissible) ─── */}
            <AnimatePresence mode="wait">
              {!tooltipDismissed && (
                <motion.div
                  key={activeUSP.id}
                  id={`${baseId}-usp-tooltip-${activeUSP.id}`}
                  role="tooltip"
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 4 }}
                  transition={{ duration: 0.18 }}
                  onMouseEnter={() => setTooltipDismissed(false)}
                  style={{
                    left: `${Math.min(Math.max(tooltipLeftPct, 16), 84)}%`,
                    top: `${Math.min(Math.max(tooltipTopPct, 10), 90)}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 w-64 sm:w-72 rounded-xl bg-white border-2 border-[#002C66] p-4 shadow-[0_14px_38px_rgba(0,44,102,0.28)]"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#002C66]">
                      <span className="h-2 w-2 rounded-full bg-[#002C66]" />
                      {activeUSP.categoryTag} · #{activeUSP.slot}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#002C66] text-white text-[9px] font-mono font-bold">
                      EQUIPPED
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-7 w-7 rounded-md bg-[#002C66] text-white flex items-center justify-center shrink-0">
                      <ActiveIcon className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="text-base font-extrabold font-display text-slate-950 leading-snug">
                      {activeUSP.headline}
                    </h4>
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed mt-2">
                    {activeUSP.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningWeaponWheelSection;
