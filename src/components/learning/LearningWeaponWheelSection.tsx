import { useState } from "react";
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
  Handshake,
  ChevronRight,
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
  badgeText: string;
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
    badgeText: "Smart-Pass Pricing",
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
    badgeText: "Industry Vetted",
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
    badgeText: "AI + Human Synergy",
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
    badgeText: "24/7 Self-Paced",
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
    badgeText: "1:1 Live Guidance",
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
    badgeText: "Hands-On Execution",
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
    badgeText: "Any Device Sync",
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
    badgeText: "Tailored Skill Path",
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

  const activeUSP = WHEEL_USPS[activeIndex];
  const ActiveIcon = activeUSP.icon;

  // Enlarged SVG Wheel geometry
  const cx = 290;
  const cy = 290;
  const activeAngle = activeIndex * 45 - 90;

  return (
    <section className="py-16 md:py-24 bg-[#FBF4EB] relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header — matches standard site heading & subtitle colors */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
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

        {/* Main Split Layout: Left = Larger Game Weapon Wheel, Right = Dynamic Image + Content Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-7xl mx-auto">
          {/* ─── LEFT: Enlarged Interactive 8-Slice Game Weapon Wheel (7 cols) ─── */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[640px] lg:max-w-[670px] aspect-square flex items-center justify-center select-none">
              <svg
                viewBox="0 0 580 580"
                className="w-full h-full overflow-visible drop-shadow-[0_12px_32px_rgba(0,44,102,0.12)]"
                role="group"
                aria-label="Learning USP Radial Selection Wheel"
              >
                <defs>
                  <filter id="wedgeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#002C66" floodOpacity="0.32" />
                  </filter>
                  <clipPath id="centerHubClip">
                    <circle cx={cx} cy={cy} r="96" />
                  </clipPath>
                </defs>

                {/* Outer tactical radar circles in brand navy */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="282"
                  fill="none"
                  stroke="rgba(0, 44, 102, 0.18)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="268"
                  fill="none"
                  stroke="rgba(0, 44, 102, 0.14)"
                  strokeWidth="1.2"
                />

                {/* 8 Enlarged Weapon Wheel Wedges */}
                {WHEEL_USPS.map((usp, index) => {
                  const isSelected = activeIndex === index;
                  const centerAngle = index * 45 - 90;
                  const startAngle = centerAngle - 20.5;
                  const endAngle = centerAngle + 20.5;

                  const rInner = isSelected ? 106 : 114;
                  const rOuter = isSelected ? 258 : 238;

                  const wedgePath = createWedgePath(cx, cy, rInner, rOuter, startAngle, endAngle);
                  const outerArc = createArcPath(cx, cy, 268, startAngle + 2, endAngle - 2);
                  const labelPos = polarToCartesian(cx, cy, isSelected ? 186 : 178, centerAngle);
                  const slotPos = polarToCartesian(cx, cy, isSelected ? 124 : 130, centerAngle);
                  const IconComponent = usp.icon;

                  return (
                    <g
                      key={usp.id}
                      className="cursor-pointer transition-transform duration-200 focus:outline-none"
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveIndex(index);
                        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                          e.preventDefault();
                          setActiveIndex((index + 1) % WHEEL_USPS.length);
                        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                          e.preventDefault();
                          setActiveIndex((index - 1 + WHEEL_USPS.length) % WHEEL_USPS.length);
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
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Inner Slot Number Tag */}
                      <text
                        x={slotPos.x}
                        y={slotPos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[11px] font-mono font-bold tracking-widest pointer-events-none ${
                          isSelected ? "fill-white/80" : "fill-slate-400"
                        }`}
                      >
                        {usp.slot}
                      </text>

                      {/* ForeignObject for Crisp Icon + Headline inside each Wedge */}
                      <foreignObject
                        x={labelPos.x - 62}
                        y={labelPos.y - 40}
                        width="124"
                        height="80"
                        className="pointer-events-none overflow-visible"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center text-center px-1">
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center mb-1.5 transition-all duration-200 ${
                              isSelected
                                ? "bg-white text-[#002C66] shadow-md scale-110"
                                : "bg-[#002C66]/10 text-[#002C66] border border-[#002C66]/20"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-xs font-display font-bold leading-[1.15] line-clamp-2 ${
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

                {/* Center Hub Portal with Dynamic Selected Image & Brand Navy Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="102"
                  fill="#002C66"
                  stroke="#002C66"
                  strokeWidth="3"
                />

                {/* Center Clipped Dynamic USP Image */}
                <g clipPath="url(#centerHubClip)">
                  <image
                    href={activeUSP.image}
                    x={cx - 96}
                    y={cy - 96}
                    width="192"
                    height="192"
                    preserveAspectRatio="xMidYMid slice"
                    opacity="0.82"
                  />
                  <circle cx={cx} cy={cy} r="96" fill="rgba(0, 44, 102, 0.48)" />
                </g>

                {/* Rotating Weapon Wheel Reticle Pointer in Brand Navy */}
                <g
                  transform={`rotate(${activeAngle + 90}, ${cx}, ${cy})`}
                  className="transition-transform duration-300 ease-out pointer-events-none"
                >
                  <polygon
                    points={`${cx},${cy - 109} ${cx - 9},${cy - 93} ${cx + 9},${cy - 93}`}
                    fill="#002C66"
                  />
                </g>

                {/* Center Hub Active Text Overlay */}
                <foreignObject
                  x={cx - 82}
                  y={cy - 60}
                  width="164"
                  height="120"
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/90 font-bold drop-shadow">
                      SLOT {activeUSP.slot} ACTIVE
                    </span>
                    <p className="text-sm font-extrabold font-display text-white leading-tight mt-1 drop-shadow">
                      {activeUSP.headline}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#002C66] border border-white/40 text-[10px] font-semibold text-white">
                      {activeUSP.statLabel}
                    </span>
                  </div>
                </foreignObject>
              </svg>
            </div>
          </div>

          {/* ─── RIGHT: Dynamic Selected USP Image + Content Readout (5 cols) ─── */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-900/80 bg-white overflow-hidden shadow-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeUSP.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24 }}
                >
                  {/* Dynamic Selected USP Image Showcase */}
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#002C66]">
                    <img
                      src={activeUSP.image}
                      alt={`${activeUSP.headline} - ${activeUSP.description}`}
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    />

                    {/* Top Left Dynamic Perk Pill */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#002C66] border border-white/25 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
                      <Handshake className="h-3.5 w-3.5 text-white" />
                      {activeUSP.badgeText}
                    </div>

                    {/* Active Slot Badge */}
                    <div className="absolute top-4 right-4 rounded-lg bg-[#002C66] border border-white/25 px-2.5 py-1 text-xs font-mono font-bold text-white shadow-sm">
                      SLOT {activeUSP.slot} / 08
                    </div>
                  </div>

                  {/* Active USP Details Panel */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-[#002C66] flex items-center justify-center text-white shrink-0">
                        <ActiveIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#002C66] font-bold block">
                          {activeUSP.categoryTag}
                        </span>
                        <h3 className="text-2xl sm:text-[26px] font-extrabold font-display text-slate-950 leading-tight">
                          {activeUSP.headline}
                        </h3>
                      </div>
                    </div>

                    {/* Short Description Box */}
                    <div className="mt-4 rounded-xl bg-[#002C66]/[0.06] border border-[#002C66]/20 p-4">
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#002C66] font-bold mb-1.5">
                        <span>Equipped Learning Perk</span>
                        <span>{activeUSP.statLabel}</span>
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                        {activeUSP.description}
                      </p>
                    </div>

                    {/* Next Perk Switcher */}
                    <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                      <span>Hover or click wheel segments to switch</span>
                      <button
                        type="button"
                        onClick={() => setActiveIndex((activeIndex + 1) % WHEEL_USPS.length)}
                        className="inline-flex items-center gap-1 font-bold text-[#002C66] hover:text-[#00204d] cursor-pointer"
                      >
                        Next Perk <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningWeaponWheelSection;
