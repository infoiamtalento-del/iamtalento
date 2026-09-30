import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Gauge,
  BarChart3,
  Wallet,
  Target,
  Compass,
  Mic,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Play,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

type Item = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  example?: string;
  value?: string;
};

const items: Item[] = [
  {
    icon: Brain,
    title: "AI-Powered Skill Assessment",
    description: "A complete evaluation of your technical, functional, and problem-solving abilities.",
    bullets: [
      "Technical skills evaluation",
      "Functional knowledge assessment",
      "Industry-specific competency mapping",
      "Problem-solving evaluation",
    ],
    value: "Value Perceived: ₹999",
  },
  {
    icon: Gauge,
    title: "Employability Score",
    description: "A credit-score-style number that tells you exactly where you stand.",
    bullets: [
      "Employability Score: 78/100",
      "Industry Average: 62/100",
      "Top 10% Benchmark: 89/100",
    ],
    value: "“I know where I stand.”",
  },
  {
    icon: BarChart3,
    title: "Industry Benchmarking Report",
    description: "Compare yourself against freshers, peers, and top performers.",
    bullets: [
      "Digital Marketing Skills: Top 25%",
      "Data Analytics Skills: Top 40%",
      "Leadership Skills: Top 60%",
    ],
    value: "“I know my competition.”",
  },
  {
    icon: Wallet,
    title: "Salary Potential Report",
    description: "Know your real market value today — and what you can earn after upskilling.",
    bullets: [
      "Current Market Value: ₹8–10 LPA",
      "Potential after Upskilling: ₹12–15 LPA",
      "Roles available at current competency",
    ],
    value: "This alone can justify ₹1,999.",
  },
  {
    icon: Target,
    title: "Personalized Skill Gap Analysis",
    description: "Pinpoint the exact skills holding you back from your next role.",
    bullets: [
      "Critical skill gaps",
      "Recommended certifications",
      "Priority learning areas",
    ],
    example:
      "You are 70% ready for a Performance Marketing Manager role. Improve GA4, Marketing Automation, and Data Visualization to become 90% job-ready.",
  },
  {
    icon: Compass,
    title: "Career Path Recommendation",
    description: "Your next three career moves, mapped to future-proof roles.",
    bullets: [
      "SEO Specialist",
      "Growth Marketer",
      "Digital Marketing Manager",
    ],
    example: "Current Role → SEO Executive · Recommended Growth Path below.",
  },
  {
    icon: Mic,
    title: "Interview Readiness Score",
    description: "Walk into interviews knowing exactly where you'll shine — and stumble.",
    bullets: [
      "Communication",
      "Domain knowledge",
      "Problem-solving",
      "Readiness score + recommendations",
    ],
  },
  {
    icon: BadgeCheck,
    title: "Digital Skill Passport",
    description: "A shareable, verified credential recruiters can trust at a glance.",
    bullets: [
      "Employability Score",
      "Skill Ratings",
      "Industry Benchmark",
      "Verification Date",
    ],
    value: "Strong USP — shareable with recruiters and employers.",
  },
];

const fixedVideoImage =
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80";

const CareerIntelligencePackageSection = ({ beforeCta }: { beforeCta?: ReactNode } = {}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx];
  const ActiveIcon = active.icon;
  const isYellow = activeIdx % 2 === 1;
  const accentBg = isYellow ? "bg-yellow-400" : "bg-red-500";
  const accentText = isYellow ? "text-red-900" : "text-white";
  const accentBar = isYellow ? "bg-yellow-400" : "bg-red-500";

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <SectionBadge label="Skill Assessment Report" icon={Sparkles} />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display leading-tight"
          >
            Get Your Career Intelligence{" "}
            <span className="text-red-500">Report Today</span>
          </motion.h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base">
            Discover your strengths, identify skill gaps, benchmark against industry standards, and unlock opportunities with confidence.
          </p>

          <div className="mt-6 inline-flex items-baseline gap-3 px-6 py-3 rounded-2xl bg-red-500 text-white shadow-lg">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
              All-in Price
            </span>
            <span className="text-2xl md:text-3xl font-bold font-display">
              ₹1,999
            </span>
            <span className="text-xs line-through opacity-70">₹9,999+</span>
          </div>
        </div>

        {/* Master-detail landscape layout */}
        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-6 max-w-[1400px] mx-auto items-start bg-card rounded-3xl border border-border p-4 md:p-6 shadow-sm">
          {/* Left: titles list */}
          <div className="lg:border-r lg:border-border lg:pr-4">
            <h3 className="text-lg font-bold font-display text-foreground mb-1 px-2">
              What's inside
            </h3>
            <p className="text-xs text-muted-foreground mb-3 px-2">
              Click any insight to expand it on the right.
            </p>
            <ul className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const Icon = item.icon;
                const isActive = idx === activeIdx;
                const itemYellow = idx % 2 === 1;
                const itemAccentBg = itemYellow ? "bg-yellow-400" : "bg-red-500";
                const itemAccentText = itemYellow ? "text-red-900" : "text-white";

                return (
                  <li key={item.title}>
                    <button
                      onClick={() => setActiveIdx(idx)}
                      className={`w-full flex items-center gap-3 text-left p-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-muted/70 ring-1 ring-border"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-lg ${itemAccentBg} ${itemAccentText} flex items-center justify-center shadow-sm shrink-0`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-muted-foreground/70 font-display tracking-wide">
                          {String(idx + 1).padStart(2, "0")} /{" "}
                          {String(items.length).padStart(2, "0")}
                        </div>
                        <div className="text-sm font-bold font-display text-foreground leading-tight truncate">
                          {item.title}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isActive
                            ? "text-foreground translate-x-0.5"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: expanded content + fixed video */}
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 items-stretch">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-muted/40 via-background to-muted/20 border border-border/60 flex flex-col h-full overflow-hidden min-h-[480px]"
              >
                <div className={`absolute -top-16 -right-16 h-48 w-48 rounded-full ${accentBg} opacity-10 blur-3xl pointer-events-none`} />

                <div className="flex items-center justify-between mb-4 relative">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-xl ${accentBg} ${accentText} flex items-center justify-center shadow-md`}>
                      <ActiveIcon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground/70 font-display">
                      {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/70 px-2.5 py-1 rounded-full">
                    Included
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold font-display text-foreground leading-tight mb-2">
                  {active.title}
                </h3>
                <div className={`h-1 w-10 ${accentBar} rounded-full mb-3`} />
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
                  {active.description}
                </p>

                <div className="grid grid-cols-1 gap-2 mb-5">
                  {active.bullets.map((b) => (
                    <div
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-foreground/90 bg-background/70 border border-border/50 rounded-lg px-3 py-2"
                    >
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${accentBar}`} />
                      <span className="leading-snug">{b}</span>
                    </div>
                  ))}
                </div>

                {(active.example || active.value) && (
                  <div className={`mt-auto rounded-xl p-4 border ${isYellow ? "bg-yellow-400/10 border-yellow-400/40" : "bg-red-500/10 border-red-500/30"}`}>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
                      {active.value ? "Why it matters" : "Example"}
                    </p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {active.example || active.value}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Fixed video */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group h-full min-h-[480px]">
              <img
                src={fixedVideoImage}
                alt="Career Intelligence demo"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <button
                className="absolute inset-0 flex items-center justify-center"
                aria-label="Play video"
              >
                <span className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="h-7 w-7 fill-current ml-0.5" />
                </span>
              </button>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur">Watch demo</span>
                <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur">02:14</span>
              </div>
              <div className="absolute top-3 left-3 right-3 text-white">
                <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">
                  Demo Walkthrough
                </p>
                <p className="text-base md:text-lg font-bold font-display leading-tight mt-0.5">
                  See your Career Intelligence Report in action
                </p>
              </div>
            </div>
          </div>
        </div>

        {beforeCta}

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold h-12 px-8 shadow-xl rounded-xl text-base"
          >
            Get My Career Report — ₹1,999 <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            One-time payment · Instant access · Verified by I Am Talento
          </p>
        </div>
      </div>
    </section>
  );
};

export default CareerIntelligencePackageSection;
