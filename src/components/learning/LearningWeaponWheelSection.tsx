import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

import usp01Affordable from "@/assets/usp-wheel/usp-01-affordable.jpg";
import usp02VerifiedMentors from "@/assets/usp-wheel/usp-02-verified-mentors.jpg";
import usp03AiCompanion from "@/assets/usp-wheel/usp-03-ai-companion.jpg";
import usp04LearnAnytime from "@/assets/usp-wheel/usp-04-learn-anytime.jpg";
import usp05ExpertSessions from "@/assets/usp-wheel/usp-05-expert-sessions.jpg";
import usp06RealWorld from "@/assets/usp-wheel/usp-06-real-world.jpg";
import usp07OnDemand from "@/assets/usp-wheel/usp-07-on-demand.jpg";
import usp08Personalised from "@/assets/usp-wheel/usp-08-personalised.jpg";

const C = 400;
const R_IN = 195;
const R_OUT = 312;
const R_OUT_ACTIVE = 326;
const R_L1 = 272;
const R_L2 = 240;
const R_SINGLE = 256;
const R_HAIR = 346;
const R_LABEL = 362;
const R_FACE = 182;
const CUT = 3.2;

interface WheelUSP {
  id: string;
  slot: string;
  lines: [string, string] | [string];
  headline: string;
  description: string;
  categoryTag: string;
  image: string;
}

const WHEEL_USPS: WheelUSP[] = [
  {
    id: "verified-mentors",
    slot: "01",
    lines: ["Verified", "Mentors"],
    headline: "Verified Mentors",
    description: "Learn from trusted industry professionals",
    categoryTag: "TRUSTED EXPERTS",
    image: usp02VerifiedMentors,
  },
  {
    id: "ai-learning-companion",
    slot: "02",
    lines: ["AI Learning", "Companion"],
    headline: "AI Learning Companion",
    description: "Your doubts answered while you learn",
    categoryTag: "AI ASSISTANCE",
    image: usp03AiCompanion,
  },
  {
    id: "expert-sessions",
    slot: "03",
    lines: ["1:1 Expert", "Sessions"],
    headline: "1:1 Expert Sessions",
    description: "Personalised guidance when you need it",
    categoryTag: "LIVE MENTORSHIP",
    image: usp05ExpertSessions,
  },
  {
    id: "real-world-knowledge",
    slot: "04",
    lines: ["Real-World", "Knowledge"],
    headline: "Real-World Knowledge",
    description: "Practical skills beyond theory",
    categoryTag: "APPLIED SKILLS",
    image: usp06RealWorld,
  },
  {
    id: "on-demand-courses",
    slot: "05",
    lines: ["On-Demand", "Courses"],
    headline: "On-Demand Courses",
    description: "Learn whenever and wherever you want",
    categoryTag: "ANYTIME ACCESS",
    image: usp07OnDemand,
  },
  {
    id: "learn-anytime",
    slot: "06",
    lines: ["Learn", "Anytime"],
    headline: "Learn Anytime",
    description: "Flexible learning on your schedule",
    categoryTag: "SELF-PACED",
    image: usp04LearnAnytime,
  },
  {
    id: "personalised-learning",
    slot: "07",
    lines: ["Personalised", "Learning"],
    headline: "Personalised Learning",
    description: "A learning experience built around you",
    categoryTag: "ADAPTIVE PATH",
    image: usp08Personalised,
  },
  {
    id: "affordable-learning",
    slot: "08",
    lines: ["Affordable", "Learning"],
    headline: "Affordable Learning",
    description: "Expert knowledge without the hefty price tag",
    categoryTag: "HIGH ROI VALUE",
    image: usp01Affordable,
  },
];

const OUTER_LABELS = [
  { id: "cat-top", text: "EXPERT-LED LEARNING", a1: -34, a2: 34, flipped: false },
  { id: "cat-br", text: "AI & MENTOR GUIDANCE", a1: 112, a2: 168, flipped: true },
  { id: "cat-bl", text: "FLEXIBLE & PERSONALISED", a1: 192, a2: 252, flipped: true },
];

const HAIRLINE_ARCS = [
  { a1: 58, a2: 102 },
  { a1: 172, a2: 188 },
  { a1: 258, a2: 302 },
];

const d2r = (d: number) => ((d - 90) * Math.PI) / 180;
const pt = (r: number, a: number) =>
  [C + r * Math.cos(d2r(a)), C + r * Math.sin(d2r(a))] as const;

const arc = (r: number, a1: number, a2: number, sweep: 0 | 1) => {
  const [x1, y1] = pt(r, a1);
  const [x2, y2] = pt(r, a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
};

const inset = (r: number) => (CUT / r) * (180 / Math.PI);

const segPath = (a1: number, a2: number, rOut: number) => {
  const o1 = a1 + inset(rOut);
  const o2 = a2 - inset(rOut);
  const i1 = a1 + inset(R_IN);
  const i2 = a2 - inset(R_IN);
  const [ox1, oy1] = pt(rOut, o1);
  const [ox2, oy2] = pt(rOut, o2);
  const [ix2, iy2] = pt(R_IN, i2);
  const [ix1, iy1] = pt(R_IN, i1);
  return `M ${ox1} ${oy1} A ${rOut} ${rOut} 0 0 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${R_IN} ${R_IN} 0 0 0 ${ix1} ${iy1} Z`;
};

const isFlipped = (mid: number) => mid > 90 && mid < 270;

const radiiFor = (count: number, flipped: boolean) =>
  count === 1 ? [R_SINGLE] : flipped ? [R_L2, R_L1] : [R_L1, R_L2];

const lineArc = (rc: number, a1: number, a2: number, flipped: boolean) => {
  const g = inset(rc);
  const base = flipped ? rc + 5 : rc - 5;
  return flipped
    ? arc(base, a2 - g, a1 + g, 0)
    : arc(base, a1 + g, a2 - g, 1);
};

const catArc = (a1: number, a2: number, flipped: boolean) =>
  flipped ? arc(R_LABEL + 6, a2, a1, 0) : arc(R_LABEL - 4, a1, a2, 1);

const LearningWeaponWheelSection = () => {
  const [activeIndex, setActiveIndex] = useState<number>(1); // Default to AI Learning Companion
  const [tooltipDismissed, setTooltipDismissed] = useState<boolean>(false);
  const baseId = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTooltipDismissed(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    setTooltipDismissed(false);
  };

  const activeUSP = WHEEL_USPS[activeIndex];
  const activeMidAngle = activeIndex * 45 + 22.5;
  const [tx, ty] = pt(342, activeMidAngle);
  const tooltipLeftPct = (tx / 800) * 100;
  const tooltipTopPct = (ty / 800) * 100;

  return (
    <section className="py-16 md:py-24 bg-[#FBF4EB] relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <SectionBadge label="Interactive Learning Ecosystem" icon={Crosshair} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3 text-slate-950"
          >
            Built Around{" "}
            <span className="text-primary">How You Learn.</span>
          </motion.h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Hover or click any segment on the wheel to explore how expert-led courses, AI support, and 1:1 mentorship come together.
          </p>
        </div>

        {/* ─── CORPORATE SKILLS-STYLE WHEEL (Matching Reference Design) ─── */}
        <div className="relative w-full max-w-[680px] md:max-w-[740px] mx-auto">
          <svg
            viewBox="0 0 800 800"
            role="group"
            aria-label="Learning USP Wheel"
            className="w-full h-auto block overflow-visible select-none"
          >
            <defs>
              <clipPath id={`${baseId}-wheel-face`}>
                <circle cx={C} cy={C} r={R_FACE} />
              </clipPath>

              {/* Curved Text Paths for Each of the 8 Segments */}
              {WHEEL_USPS.map((seg, si) => {
                const a1 = si * 45;
                const a2 = a1 + 45;
                const flipped = isFlipped(a1 + 22.5);
                const radii = radiiFor(seg.lines.length, flipped);
                return radii.map((rc, li) => (
                  <path
                    key={`line-${si}-${li}`}
                    id={`${baseId}-line-${si}-${li}`}
                    d={lineArc(rc, a1, a2, flipped)}
                  />
                ));
              })}

              {/* Curved Paths for Outer Category Labels */}
              {OUTER_LABELS.map((cat) => (
                <path
                  key={cat.id}
                  id={`${baseId}-${cat.id}`}
                  d={catArc(cat.a1, cat.a2, cat.flipped)}
                />
              ))}
            </defs>

            {/* Outer Hairline Decorative Arcs */}
            {HAIRLINE_ARCS.map((h, i) => (
              <path
                key={i}
                d={arc(R_HAIR, h.a1, h.a2, 1)}
                fill="none"
                stroke="#002C66"
                strokeOpacity={0.45}
                strokeWidth={1.2}
              />
            ))}

            {/* Outer Curved Category Labels */}
            {OUTER_LABELS.map((cat) => (
              <text
                key={cat.id}
                fill="#002C66"
                fontSize={13.5}
                fontWeight={600}
                letterSpacing={3.6}
                className="font-sans uppercase select-none"
              >
                <textPath
                  href={`#${baseId}-${cat.id}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {cat.text}
                </textPath>
              </text>
            ))}

            {/* 8 Corporate Navy Annular Segments */}
            {WHEEL_USPS.map((seg, si) => {
              const isSelected = activeIndex === si;
              const a1 = si * 45;
              const a2 = a1 + 45;
              const flipped = isFlipped(a1 + 22.5);
              const radii = radiiFor(seg.lines.length, flipped);
              const tooltipId = `${baseId}-tooltip-${seg.id}`;

              return (
                <g
                  key={seg.id}
                  className="cursor-pointer focus:outline-none"
                  onMouseEnter={() => handleSelect(si)}
                  onFocus={() => handleSelect(si)}
                  onClick={() => handleSelect(si)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-describedby={isSelected && !tooltipDismissed ? tooltipId : undefined}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(si);
                    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      handleSelect((si + 1) % WHEEL_USPS.length);
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      handleSelect((si - 1 + WHEEL_USPS.length) % WHEEL_USPS.length);
                    }
                  }}
                >
                  <path
                    d={segPath(a1, a2, isSelected ? R_OUT_ACTIVE : R_OUT)}
                    fill={isSelected ? "#001E47" : "#002C66"}
                    stroke={isSelected ? "#002C66" : "none"}
                    strokeWidth={isSelected ? 2 : 0}
                    className="transition-all duration-300 ease-out"
                  />

                  {/* Curved White Segment Labels */}
                  {seg.lines.map((text, li) => {
                    const rc = radii[li];
                    const sweep = 45 - 2 * inset(rc);
                    const arcLen = 2 * Math.PI * rc * (sweep / 360) - 16;
                    const natural = text.length * 9.5;
                    const textLength = natural > arcLen ? arcLen : undefined;

                    return (
                      <text
                        key={`${si}-${li}`}
                        fill="#FFFFFF"
                        fontSize={isSelected ? 17.5 : 16.5}
                        fontWeight={isSelected ? 700 : 600}
                        className="font-sans select-none pointer-events-none transition-all duration-200"
                      >
                        <textPath
                          href={`#${baseId}-line-${si}-${li}`}
                          startOffset="50%"
                          textAnchor="middle"
                          textLength={textLength}
                          lengthAdjust={textLength ? "spacingAndGlyphs" : undefined}
                        >
                          {text}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
              );
            })}

            {/* Inner Soft Light Circle Background */}
            <circle cx={C} cy={C} r={R_FACE} fill="#F4F3EF" />

            {/* Center Clipped Dynamic Image */}
            <image
              href={activeUSP.image}
              x={C - R_FACE}
              y={C - R_FACE}
              width={R_FACE * 2}
              height={R_FACE * 2}
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${baseId}-wheel-face)`}
            />

            {/* Bottom White Readiness-Style Pill Card (Exact Match to Reference Bottom Pill) */}
            <foreignObject
              x={C - 155}
              y={C + 88}
              width={310}
              height={86}
              className="overflow-visible pointer-events-none"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full rounded-full bg-white border border-slate-200/90 shadow-[0_8px_24px_rgba(0,44,102,0.14)] px-4 py-2.5 flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-full bg-[#002C66] text-white font-display font-extrabold text-base flex items-center justify-center shrink-0">
                    {activeUSP.slot}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="block text-[10px] font-bold tracking-[0.16em] uppercase text-slate-400 truncate">
                      {activeUSP.categoryTag}
                    </span>
                    <span className="block text-[15px] font-extrabold font-display text-slate-900 leading-tight truncate mt-0.5">
                      {activeUSP.headline}
                    </span>
                  </div>
                </div>
              </div>
            </foreignObject>
          </svg>

          {/* ─── NEAT CORPORATE HOVER TOOLTIP ─── */}
          <AnimatePresence mode="wait">
            {!tooltipDismissed && (
              <motion.div
                key={activeUSP.id}
                id={`${baseId}-tooltip-${activeUSP.id}`}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.94, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 4 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => setTooltipDismissed(false)}
                style={{
                  left: `${Math.min(Math.max(tooltipLeftPct, 18), 82)}%`,
                  top: `${Math.min(Math.max(tooltipTopPct, 12), 88)}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 w-64 sm:w-72 rounded-xl bg-white border border-[#002C66]/25 shadow-[0_12px_32px_rgba(0,44,102,0.18)] p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#002C66]">
                    {activeUSP.categoryTag}
                  </span>
                  <span className="h-5 px-2 rounded-full bg-[#002C66] text-white text-[10px] font-bold inline-flex items-center">
                    {activeUSP.slot} / 08
                  </span>
                </div>
                <h4 className="text-sm font-extrabold font-display text-slate-950 leading-snug">
                  {activeUSP.headline}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {activeUSP.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LearningWeaponWheelSection;
