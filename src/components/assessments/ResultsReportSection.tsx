import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

/* ─── DATA ─── */
const panels = [
  {
    idx: 1,
    category: "INDUSTRY READINESS",
    title: "Industry Readiness Score",
    description:
      "How well your skills match current industry demand across all active job listings in your domain.",
    score: 86,
    status: "Above market" as const,
    statusColor: "#16A34A",
    statusBg: "#F0FDF4",
    insight:
      "You exceed the hiring threshold for 94% of mid-to-senior roles posted in your domain this month.",
    rank: 14,
    avgPercentile: 88,
  },
  {
    idx: 2,
    category: "MARKET POSITION",
    title: "Market Position",
    description:
      "Your competitiveness against other active candidates applying for similar roles in the same geography.",
    score: 79,
    status: "Market Ready" as const,
    statusColor: "#D97706",
    statusBg: "#FFFBEB",
    insight:
      "Upskilling in system design could push you into the top 10% within 60 days based on current demand trends.",
    rank: 21,
    avgPercentile: 79,
  },
  {
    idx: 3,
    category: "PEER BENCHMARK",
    title: "Peer Benchmark",
    description:
      "How you compare to professionals at the same experience level (3–5 years) across all assessed dimensions.",
    score: 92,
    status: "Above market" as const,
    statusColor: "#16A34A",
    statusBg: "#F0FDF4",
    insight:
      "Exceptional standing, you outperformed 92% of your peer cohort in both technical and behavioural assessments.",
    rank: 8,
    avgPercentile: 92,
  },
  {
    idx: 4,
    category: "STRENGTH AREAS",
    title: "Strength Areas",
    description:
      "Your top-performing skill clusters and how they map to the most in-demand senior roles in the market.",
    score: 88,
    status: "Above market" as const,
    statusColor: "#16A34A",
    statusBg: "#F0FDF4",
    insight:
      "React, API design and system thinking are your strongest clusters, they appear in 78% of senior roles you're eligible for.",
    rank: 12,
    avgPercentile: 88,
  },
  {
    idx: 5,
    category: "WEAK AREAS",
    title: "Weak Areas",
    description:
      "Skill gaps and underperforming areas that are holding you back from higher-tier roles and better matches.",
    score: 42,
    status: "Below market" as const,
    statusColor: "#DC2626",
    statusBg: "#FEF2F2",
    insight:
      "DevOps, cloud infrastructure and testing are your weakest areas, addressing these could unlock 35% more senior role matches.",
    rank: 58,
    avgPercentile: 42,
  },
];

/* ─── ANIMATED COUNTER (smoother with spring-like cubic) ─── */
const useCountUp = (target: number, trigger: boolean, duration = 1100) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!trigger) { setValue(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // smooth overshoot ease
      const ease = t < 1 ? 1 - Math.pow(1 - t, 4) : 1;
      setValue(Math.round(ease * target));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [trigger, target, duration]);

  return value;
};

/* ─── SHARED SCORE DISPLAY ─── */
const ScoreDisplay = ({
  score,
  label,
  color = "text-primary",
  subColor = "text-primary/30",
}: {
  score: number;
  label: string;
  color?: string;
  subColor?: string;
}) => (
  <div className="mb-6">
    <div className="flex items-baseline gap-0.5">
      <motion.span
        key={score}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`text-[72px] font-extrabold leading-none tracking-tight tabular-nums ${color}`}
        style={{ fontFeatureSettings: "'tnum'" }}
      >
        {score}
      </motion.span>
      <span className={`text-[24px] font-semibold ${subColor}`}>%</span>
    </div>
    <p className="text-[12px] text-muted-foreground mt-1">{label}</p>
  </div>
);

/* ─── COMPARISON BAR ROW ─── */
const BarRow = ({
  label,
  value,
  color,
  dashed = false,
  visible,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  dashed?: boolean;
  visible: boolean;
  delay?: number;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-[12px] text-muted-foreground w-[84px] shrink-0 truncate">
      {label}
    </span>
    <div className="flex-1 h-[6px] rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={
          dashed
            ? {
                backgroundImage: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`,
              }
            : { background: color }
        }
        initial={{ width: 0 }}
        animate={visible ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
    <motion.span
      className="text-[12px] font-semibold text-foreground w-[38px] text-right tabular-nums"
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4, delay: delay + 0.4 }}
    >
      {value}%
    </motion.span>
  </div>
);

/* ─── CHART PANELS ─── */

const Panel1Chart = ({ visible }: { visible: boolean }) => {
  const score = useCountUp(86, visible);

  return (
    <div className="flex flex-col justify-center h-full px-10">
      <ScoreDisplay score={score} label="Industry readiness · out of 100" />

      {/* Main bar */}
      <div className="h-[8px] rounded-full bg-muted mb-2">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={visible ? { width: "86%" } : { width: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mb-7">
        <span>0</span>
        <span className="opacity-60">Benchmark: 65%</span>
        <span>100</span>
      </div>

      <div className="space-y-3">
        <BarRow label="Your score" value={86} color="hsl(var(--primary))" visible={visible} delay={0.2} />
        <BarRow label="Avg. peer" value={61} color="#CBD5E1" visible={visible} delay={0.35} />
        <BarRow label="Top 10%" value={90} color="#94A3B8" dashed visible={visible} delay={0.5} />
      </div>
    </div>
  );
};

const Panel2Chart = ({ visible }: { visible: boolean }) => {
  const score = useCountUp(79, visible);
  const r = 70;
  const circ = Math.PI * r;
  const offset = circ - (79 / 100) * circ;

  return (
    <div className="flex flex-col items-start justify-center h-full px-10">
      {/* Gauge */}
      <svg width={200} height={110} viewBox="0 0 200 110" className="mb-2">
        <path
          d="M 15 100 A 75 75 0 0 1 185 100"
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <motion.path
          d="M 15 100 A 75 75 0 0 1 185 100"
          fill="none"
          stroke="#D97706"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={visible ? { strokeDashoffset: offset } : { strokeDashoffset: circ }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="flex items-baseline gap-0.5 -mt-1 mb-1">
        <motion.span
          key={score}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[52px] font-extrabold leading-none tracking-tight tabular-nums"
          style={{ color: "#D97706", fontFeatureSettings: "'tnum'" }}
        >
          {score}
        </motion.span>
        <span className="text-[20px] font-semibold" style={{ color: "rgba(217,119,6,0.35)" }}>
          %
        </span>
      </div>
      <p className="text-[12px] text-muted-foreground mb-7">Market position · out of 100</p>

      <div className="w-full space-y-3">
        <BarRow label="Your score" value={79} color="#D97706" visible={visible} delay={0.25} />
        <BarRow label="Market avg" value={58} color="#CBD5E1" visible={visible} delay={0.4} />
      </div>
    </div>
  );
};

const Panel3Chart = ({ visible }: { visible: boolean }) => {
  const score = useCountUp(92, visible);
  const yourPos = 7;
  const aboveAvgCount = 30;

  return (
    <div className="flex flex-col items-start justify-center h-full px-10">
      <ScoreDisplay score={score} label="Peer benchmark · out of 100" />

      {/* Dot grid */}
      <div className="grid grid-cols-10 gap-2.5 mb-5 w-full max-w-md">
        {Array.from({ length: 100 }).map((_, i) => {
          const isYou = i === yourPos;
          const isAbove = i < aboveAvgCount && !isYou;

          return (
            <motion.div
              key={i}
              className="rounded-full aspect-square w-full max-w-[14px]"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                visible
                  ? {
                      scale: 1,
                      opacity: 1,
                      backgroundColor: isYou
                        ? "hsl(var(--primary))"
                        : isAbove
                        ? "#FECACA"
                        : "#E2E8F0",
                    }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                duration: 0.2,
                delay: visible ? i * 0.008 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={isYou ? { boxShadow: "0 0 0 3px hsl(var(--primary) / 0.3)" } : {}}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 self-start">
        {[
          { label: "You (top 8%)", color: "hsl(var(--primary))" },
          { label: "Above avg", color: "#FECACA" },
          { label: "Below avg", color: "#E2E8F0" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-[7px] h-[7px] rounded-full" style={{ background: l.color }} />
            <span className="text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Panel4Chart = ({ visible }: { visible: boolean }) => {
  const score = useCountUp(88, visible);
  const skills = [
    { name: "React & Frontend", value: 94, color: "hsl(var(--primary))" },
    { name: "API Design", value: 88, color: "hsl(var(--primary))" },
    { name: "System Thinking", value: 85, color: "hsl(var(--primary))" },
    { name: "SQL & Data", value: 72, color: "#D97706" },
    { name: "DevOps", value: 58, color: "#CBD5E1" },
  ];

  return (
    <div className="flex flex-col justify-center h-full px-10">
      <ScoreDisplay score={score} label="Strength areas · out of 100" />

      <div className="space-y-3.5">
        {skills.map((skill, i) => (
          <BarRow
            key={skill.name}
            label={skill.name}
            value={skill.value}
            color={skill.color}
            visible={visible}
            delay={i * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

const Panel5Chart = ({ visible }: { visible: boolean }) => {
  const score = useCountUp(42, visible);
  const weakSkills = [
    { name: "DevOps & CI/CD", value: 38, color: "#DC2626" },
    { name: "Cloud Infrastructure", value: 42, color: "#DC2626" },
    { name: "Testing & QA", value: 45, color: "#D97706" },
    { name: "Security Practices", value: 51, color: "#D97706" },
    { name: "Performance Tuning", value: 55, color: "#D97706" },
  ];

  return (
    <div className="flex flex-col justify-center h-full px-10">
      <div className="mb-6">
        <div className="flex items-baseline gap-0.5">
          <motion.span
            key={score}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[72px] font-extrabold leading-none tracking-tight tabular-nums"
            style={{ color: "#DC2626", fontFeatureSettings: "'tnum'" }}
          >
            {score}
          </motion.span>
          <span className="text-[24px] font-semibold" style={{ color: "rgba(220,38,38,0.3)" }}>%</span>
        </div>
        <p className="text-[12px] text-muted-foreground mt-1">Weak areas · out of 100</p>
      </div>

      <div className="space-y-3.5">
        {weakSkills.map((skill, i) => (
          <BarRow
            key={skill.name}
            label={skill.name}
            value={skill.value}
            color={skill.color}
            visible={visible}
            delay={i * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

const chartComponents = [Panel1Chart, Panel2Chart, Panel3Chart, Panel4Chart, Panel5Chart];

/* ─── MAIN SECTION ─── */
const ResultsReportSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [triggered, setTriggered] = useState<boolean[]>([true, false, false, false, false]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const panelHeight = 420;
        const idx = Math.min(panels.length - 1, Math.round(scrollTop / panelHeight));
        setActiveIdx(idx);
        setTriggered((prev) => {
          if (prev[idx]) return prev;
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        ticking = false;
      });
    };

    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  const current = panels[activeIdx];
  const progressPct = ((activeIdx + 1) / panels.length) * 100;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        {/* Section intro */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-3 rounded-full"
            style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}
          >
            CAREER INTELLIGENCE
          </span>
          <h2 className="text-[24px] md:text-[32px] font-bold font-display text-foreground mb-2">
            More Than a Score. A Complete{" "}
            <span className="text-primary">Career Report.</span>
          </h2>
          <p className="text-[14px] text-muted-foreground max-w-md mx-auto">
            Delivered within 24 hours, score breakdown, peer benchmarks, and a
            30/60/90-day improvement plan.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: 16 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-4 border-b border-border bg-card">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">
                CAREER INTELLIGENCE REPORT
              </div>
              <div className="text-[18px] font-semibold text-foreground font-display">
                Score Breakdown
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`pct-${activeIdx}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: "hsl(var(--primary) / 0.05)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  Avg. percentile, {current.avgPercentile}%
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`rank-${activeIdx}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(34,197,94,0.06)", color: "#16A34A" }}
                >
                  Top {current.rank}%
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="score-scroll overflow-y-auto"
            style={{ height: 420, scrollSnapType: "y mandatory" }}
          >
            <style>{`
              .score-scroll::-webkit-scrollbar { display: none; }
              .score-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>
            {panels.map((panel, i) => {
              const Chart = chartComponents[i];
              return (
                <div
                  key={panel.idx}
                  className="grid grid-cols-2"
                  style={{ height: 420, scrollSnapAlign: "start" }}
                >
                  {/* Left — text */}
                  <div className="flex flex-col justify-center px-8 py-6 border-r border-border">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={triggered[i] ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                        Metric {String(panel.idx).padStart(2, "0")} of 05
                      </div>
                      <h3 className="text-[22px] font-semibold text-foreground mb-2.5 font-display">
                        {panel.title}
                      </h3>
                      <p className="text-[13px] text-muted-foreground leading-[1.65] mb-6">
                        {panel.description}
                      </p>

                      <div className="mb-5">
                        <span
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full"
                          style={{ background: panel.statusBg, color: panel.statusColor }}
                        >
                          <Check className="h-3 w-3" /> {panel.status}
                        </span>
                      </div>

                      <div
                        className="p-4 rounded-lg"
                        style={{
                          background: "#F8FAFC",
                          borderLeft: "3px solid hsl(var(--primary) / 0.6)",
                        }}
                      >
                        <p className="text-[12px] text-muted-foreground leading-[1.65]">
                          {panel.insight}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right — chart */}
                  <Chart visible={triggered[i]} />
                </div>
              );
            })}
          </div>

          {/* Bottom progress track */}
          <div className="px-7 pt-3 pb-4 border-t border-border">
            <div className="h-[3px] rounded-full bg-muted mb-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="grid grid-cols-5">
              {panels.map((p, i) => (
                <button
                  key={p.idx}
                  onClick={() => {
                    scrollRef.current?.scrollTo({ top: i * 420, behavior: "smooth" });
                  }}
                  className="text-[10px] uppercase tracking-wider transition-all duration-200"
                  style={{
                    color: i === activeIdx ? "hsl(var(--primary))" : "#94A3B8",
                    fontWeight: i === activeIdx ? 700 : 400,
                  }}
                >
                  {p.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsReportSection;
