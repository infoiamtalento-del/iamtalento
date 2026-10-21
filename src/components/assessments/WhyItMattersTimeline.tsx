import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Target, BarChart3, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

/* ─────────── Tab 1 Mockup: Live Assessment ─────────── */
const TestMockup = () => (
  <div className="space-y-3">
    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded border border-primary/20 text-primary bg-primary/5">
      Scenario · Performance
    </span>
    <p className="text-sm font-semibold leading-snug">
      A component re-renders on every keystroke even with no prop changes. What's the most targeted fix?
    </p>
    <div className="space-y-2">
      {[
        { text: "Wrap in React.memo()", correct: true },
        { text: "Move state up to parent", correct: false },
        { text: "Replace useState with useRef", correct: false },
        { text: "Add key prop to the component", correct: false },
      ].map((o) => (
        <div
          key={o.text}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs"
          style={{
            borderColor: o.correct ? "hsl(var(--success))" : "hsl(var(--border))",
            background: o.correct ? "hsl(var(--success) / 0.08)" : "transparent",
          }}
        >
          <div
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: o.correct ? "hsl(var(--success))" : "hsl(var(--muted-foreground) / 0.22)" }}
          />
          {o.text}
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-border">
      <span className="text-[10px] text-muted-foreground">AI proctoring active</span>
      <span className="text-xs font-mono font-bold text-primary">02:31</span>
    </div>
  </div>
);

/* ─────────── Tab 2 Mockup: Instant Score ─────────── */
const ScoreMockup = () => {
  const skills = [
    { name: "React hooks", pct: 94, color: "hsl(var(--primary))" },
    { name: "Performance", pct: 88, color: "hsl(var(--primary))" },
    { name: "State mgmt", pct: 71, color: "#FF8C01" },
    { name: "Architecture", pct: 65, color: "#FF8C01" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative h-[60px] w-[60px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15.9155" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: "86, 100" }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </svg>
        </div>
        <div>
          <span className="text-3xl font-extrabold tabular-nums">86</span>
          <p className="text-[10px] text-muted-foreground">/100 · Top 8% nationally</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {skills.map((s, i) => (
          <div key={s.name}>
            <div className="flex justify-between text-[10px] mb-1">
              <span>{s.name}</span>
              <span className="font-bold">{s.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────── Tab 3 Mockup: Recruiter Notifications ───── */
const OutcomeMockup = () => {
  const rows = [
    { letter: "A", bg: "#3B82F6", name: "Priya · Atlassian", msg: "Shortlisted for Senior Frontend (React)", time: "2m" },
    { letter: "R", bg: "#8B5CF6", name: "Karan · Razorpay", msg: "Viewed your score, Top 8% React", time: "11m" },
    { letter: "M", bg: "#22C55E", name: "Meera · Zepto", msg: "Sent interview slot, skip to round 2", time: "34m" },
  ];
  return (
    <div className="space-y-0">
      {rows.map((r) => (
        <div key={r.letter} className="flex items-start gap-3 p-4 border-b border-border/50 last:border-0">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: r.bg }}>
            {r.letter}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{r.name}</p>
            <p className="text-[10px] text-muted-foreground">{r.msg}</p>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">{r.time}</span>
        </div>
      ))}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <span className="text-[11px] text-muted-foreground">Companies viewing now</span>
        <span className="text-xs font-bold text-primary">12 active</span>
      </div>
    </div>
  );
};

/* ─────────── Features Data ─────────── */
const features = [
  {
    id: "test",
    icon: Target,
    tag: "The Test",
    headline: "Scenario-Based. Not Memorisation.",
    description: "Every question mirrors a real work situation, timed, AI-proctored, and tamper-proof. You're tested on what you can actually do under conditions.",
    details: [
      { icon: CheckCircle2, text: "Real-world problem scenario questions" },
      { icon: CheckCircle2, text: "AI face + tab proctoring active" },
      { icon: CheckCircle2, text: "Timed under real job conditions" },
    ],
    cta: "Start Assessment",
    href: "/skill-assessment",
    mockup: "test",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    id: "score",
    icon: BarChart3,
    tag: "Your Score",
    headline: "Your Score. Your Gaps. Your Plan.",
    description: "The moment you finish, a full report is generated, percentile rank, skill-by-skill breakdown, and exactly where to improve for the roles you want.",
    details: [
      { icon: CheckCircle2, text: "Instant percentile rank & score" },
      { icon: CheckCircle2, text: "Skill-by-skill strength breakdown" },
      { icon: CheckCircle2, text: "30/60/90-day improvement roadmap" },
    ],
    cta: "See Sample Report",
    href: "/skill-assessment",
    mockup: "score",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  {
    id: "outcome",
    icon: Award,
    tag: "The Outcome",
    headline: "Badge Live. Recruiters Come to You.",
    description: "Your verified score surfaces your profile to 200+ hiring companies. No cold applications. No ATS filters. They find you by skill level.",
    details: [
      { icon: CheckCircle2, text: "Verified badge on your profile instantly" },
      { icon: CheckCircle2, text: "Skip screening, direct to shortlist" },
      { icon: CheckCircle2, text: "3x more interview callbacks on average" },
    ],
    cta: "Get Verified",
    href: "/skill-assessment",
    mockup: "outcome",
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
  },
];

const mockupMap: Record<string, React.ReactNode> = {
  test: <TestMockup />,
  score: <ScoreMockup />,
  outcome: <OutcomeMockup />,
};

/* ─────────── Main Component ─────────── */
const WhyItMattersTimeline = () => {
  const [activeTab, setActiveTab] = useState(0);
  const feature = features[activeTab];
  const Icon = feature.icon;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <SectionBadge label="Why It Matters" icon={Target} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Not a quiz. A real-world <span className="text-primary">skill proof.</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Click each step to see how every assessment works.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {features.map((f, i) => {
            const FIcon = f.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: isActive ? "hsl(var(--primary))" : "hsl(var(--card))",
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  border: isActive ? "none" : "1px solid hsl(var(--border))",
                  boxShadow: isActive ? "0 4px 20px rgba(226,44,56,0.3)" : "none",
                }}
              >
                <FIcon className="h-4 w-4" />
                {f.id === "test" ? "The Test" : f.id === "score" ? "Your Score" : "The Outcome"}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-border/50 shadow-xl overflow-hidden"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6 border border-primary/10 self-start">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {feature.tag}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-display mb-4 leading-tight">
                  {feature.headline}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                <div className="space-y-2 mb-6">
                  {feature.details.map(({ icon: DIcon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <DIcon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </div>
                  ))}
                </div>
                <Link to={feature.href} className="self-start">
                  <Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2 h-11 px-7">
                    {feature.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Right: mockup */}
              <div className={`bg-gradient-to-br ${feature.gradient} border-l border-border/30 p-6 lg:p-8 hidden lg:flex items-center justify-center`}>
                <div className="w-full rounded-xl border border-border/50 shadow-lg overflow-hidden" style={{ background: "hsl(var(--card))" }}>
                  <div className="h-8 bg-secondary/50 border-b border-border/30 flex items-center px-3 gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-destructive/40" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <div className="h-2 w-2 rounded-full bg-primary/30" />
                    <div className="flex-1 h-4 rounded bg-secondary mx-8" />
                  </div>
                  <div className="p-5">{mockupMap[feature.mockup]}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WhyItMattersTimeline;
