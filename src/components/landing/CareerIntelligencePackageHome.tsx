import { useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  CheckCircle2,
  TrendingUp,
  Award,
  ShieldCheck,
  QrCode,
  Zap,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

type CIRItem = {
  icon: LucideIcon;
  title: string;
  shortTag: string;
  description: string;
  bullets: string[];
  highlight: string;
  metricValue: string;
  metricLabel: string;
  subStats: { label: string; value: string }[];
};

const items: CIRItem[] = [
  {
    icon: Brain,
    title: "AI-Powered Skill Assessment",
    shortTag: "360° Eval",
    description:
      "Evaluates technical, functional, and real-world problem-solving skills across 4 rounds.",
    bullets: [
      "Technical & tool proficiency score",
      "Functional domain depth check",
      "Scenario problem-solving rubric",
    ],
    highlight: "Benchmarked against real hiring rubrics from 500+ companies.",
    metricValue: "86/100",
    metricLabel: "Composite Skill Score",
    subStats: [
      { label: "Core Rounds", value: "4 Mandatory" },
      { label: "Domain Track", value: "1 Specialized" },
      { label: "Integrity", value: "30-Layer AI" },
    ],
  },
  {
    icon: Gauge,
    title: "Employability Score",
    shortTag: "Readiness Index",
    description:
      "A credit-score-style readiness number (0–100) that tells employers exactly where you stand.",
    bullets: [
      "Your Score: 84/100 vs. 62 Avg",
      "Top 10% Benchmark: 89/100",
      "Live badge synced to your profile",
    ],
    highlight: "“I know exactly where I stand before I even apply.”",
    metricValue: "3.2x",
    metricLabel: "Higher Shortlist Rate",
    subStats: [
      { label: "Your Score", value: "84 / 100" },
      { label: "Market Avg", value: "62 / 100" },
      { label: "Top 10% Bar", value: "89 / 100" },
    ],
  },
  {
    icon: BarChart3,
    title: "Industry Benchmarking Report",
    shortTag: "Peer Percentile",
    description:
      "Compare yourself head-to-head against freshers, mid-level peers, and top 10% leaders.",
    bullets: [
      "Domain Execution: Top 12%",
      "Analytical & Data: Top 18%",
      "Communication Clarity: Top 15%",
    ],
    highlight: "“I know my competition, and how to outperform them.”",
    metricValue: "Top 12%",
    metricLabel: "National Cohort Rank",
    subStats: [
      { label: "Cohort Size", value: "18,731+" },
      { label: "Ahead Of", value: "88% Peers" },
      { label: "Role Tier", value: "Mid-Senior" },
    ],
  },
  {
    icon: Wallet,
    title: "Salary Potential Report",
    shortTag: "Market Value",
    description:
      "Know your real market compensation today, and what you unlock after closing skill gaps.",
    bullets: [
      "Current Band: ₹8–10.5 LPA",
      "Upskilled Band: ₹14–18.5 LPA",
      "City & tier-adjusted benchmarks",
    ],
    highlight: "Candidates use this data to negotiate 35%–75% higher offers.",
    metricValue: "+68%",
    metricLabel: "Projected Package Hike",
    subStats: [
      { label: "Current Band", value: "₹8–10.5L" },
      { label: "Target Band", value: "₹14–18.5L" },
      { label: "Matched Jobs", value: "140+ Open" },
    ],
  },
  {
    icon: Target,
    title: "Personalized Skill Gap Analysis",
    shortTag: "Gap Diagnostic",
    description:
      "Pinpoint the exact micro-skills holding you back from senior roles with a 30-day fix plan.",
    bullets: [
      "Critical vs. secondary skill gaps",
      "Curated courses & certifications",
      "Point-by-point IRS score boost",
    ],
    highlight: "Close 3 priority gaps to jump from 70% → 91% job-ready.",
    metricValue: "+21 pts",
    metricLabel: "Unlockable Score Gain",
    subStats: [
      { label: "Critical Gaps", value: "3 Identified" },
      { label: "Est. Time", value: "3–4 Weeks" },
      { label: "Post-Fix Fit", value: "91% Ready" },
    ],
  },
  {
    icon: Compass,
    title: "Career Path Recommendation",
    shortTag: "Next 3 Moves",
    description:
      "Your next three career moves mapped step-by-step to high-demand, future-proof roles.",
    bullets: [
      "Now: Performance Marketer (94%)",
      "Next: Growth Marketing Lead (84%)",
      "Future: Head of Digital Growth",
    ],
    highlight: "Clear trajectory from your current role to leadership.",
    metricValue: "3 Steps",
    metricLabel: "Mapped Career Ladder",
    subStats: [
      { label: "Immediate Fit", value: "94% Match" },
      { label: "12-Mo Target", value: "₹18 LPA+" },
      { label: "24-Mo Target", value: "Leadership" },
    ],
  },
  {
    icon: Mic,
    title: "Interview Readiness Score",
    shortTag: "Round Prep",
    description:
      "Walk into technical and HR rounds knowing where you'll shine and what to practice.",
    bullets: [
      "Verbal & written clarity score",
      "Case-study judgment breakdown",
      "HR & culture-fit STAR evaluation",
    ],
    highlight: "Eliminate last-minute interview anxiety with targeted prep.",
    metricValue: "88/100",
    metricLabel: "Interview Confidence",
    subStats: [
      { label: "Domain Case", value: "91 / 100" },
      { label: "Communication", value: "89 / 100" },
      { label: "HR & Culture", value: "84 / 100" },
    ],
  },
  {
    icon: BadgeCheck,
    title: "Digital Skill Passport",
    shortTag: "QR Credential",
    description:
      "A shareable, tamper-proof credential and badge that recruiters verify in one click.",
    bullets: [
      "QR-verified authenticity ID",
      "One-click LinkedIn & CV embed",
      "Direct fast-track to employers",
    ],
    highlight: "Go beyond a static PDF, share verified proof of work.",
    metricValue: "Verified",
    metricLabel: "Tamper-Proof ID",
    subStats: [
      { label: "Verification", value: "QR + Link" },
      { label: "Validity", value: "24 Months" },
      { label: "Employers", value: "500+ Trust" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Full-Bleed Balanced Visual Stage for Each CIR Module              */
/* ------------------------------------------------------------------ */

const ModuleVisualPanel = ({ activeIdx }: { activeIdx: number }) => {
  // 01 — AI-Powered Skill Assessment (2x2 Competency Grid — No Bars)
  if (activeIdx === 0) {
    const competencies = [
      { name: "Domain Execution", round: "Round 01 · Functional", level: "92/100", tag: "Expert" },
      { name: "Analytical Reasoning", round: "Round 02 · Psychometric", level: "85/100", tag: "Advanced" },
      { name: "Case Problem Solving", round: "Round 03 · Practical", level: "88/100", tag: "Advanced" },
      { name: "Workplace Communication", round: "Round 04 · HR & Verbal", level: "79/100", tag: "Proficient" },
    ];
    return (
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="flex items-center justify-between rounded-2xl bg-[#002C66] px-4 py-3 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Brain className="h-4.5 w-4.5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold leading-tight">AI Skill Intelligence Engine</p>
              <p className="text-[11px] text-white/70">Multi-Round Proctored Evaluation</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold font-display text-amber-300 leading-none">86</span>
            <span className="text-xs text-white/70">/100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 my-auto">
          {competencies.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-slate-200/90 bg-[#FBF4EB]/45 p-3.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  {c.round}
                </span>
                <span className="rounded-full bg-[#002C66]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#002C66] shrink-0">
                  {c.tag}
                </span>
              </div>
              <div className="flex items-end justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 leading-snug">{c.name}</p>
                <span className="text-base font-extrabold font-display text-[#002C66] tabular-nums shrink-0">
                  {c.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#FBF4EB] border border-[#002C66]/15 px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#002C66]" />
            <span className="text-xs font-bold text-slate-800">
              Zero human bias · Auto-graded rubric
            </span>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            Verified Pass ✓
          </span>
        </div>
      </div>
    );
  }

  // 02 — Employability Score
  if (activeIdx === 1) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="grid grid-cols-2 gap-4 my-auto">
          {/* Industry Average */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Unverified Peer Avg
            </span>
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={40} fill="none" stroke="#e2e8f0" strokeWidth={8} />
                <motion.circle
                  cx={50}
                  cy={50}
                  r={40}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 * (1 - 0.62) }}
                  transition={{ duration: 0.8 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold font-display text-slate-600">62</span>
                <span className="text-[10px] font-semibold text-slate-400">/ 100</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500">Low Recruiter Visibility</p>
          </div>

          {/* Your CIR Score */}
          <div className="rounded-2xl border-2 border-[#002C66] bg-[#FBF4EB]/60 p-5 text-center flex flex-col items-center justify-center relative">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#002C66] mb-3">
              Your CIR Score
            </span>
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={40} fill="none" stroke="#e2e8f0" strokeWidth={8} />
                <motion.circle
                  cx={50}
                  cy={50}
                  r={40}
                  fill="none"
                  stroke="#002C66"
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 * (1 - 0.84) }}
                  transition={{ duration: 0.9, delay: 0.1 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold font-display text-[#002C66]">84</span>
                <span className="text-[10px] font-semibold text-slate-500">/ 100</span>
              </div>
            </div>
            <p className="text-xs font-extrabold text-emerald-700">Strong Match · 120+ Roles</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#002C66] text-white px-4 py-3 flex items-center justify-between text-xs">
          <span className="text-white/80 font-medium">Top 10% Benchmark Threshold</span>
          <span className="font-extrabold text-amber-300">89 / 100 (Just 5 pts away)</span>
        </div>
      </div>
    );
  }

  // 03 — Industry Benchmarking Report
  if (activeIdx === 2) {
    const rows = [
      { skill: "Performance Marketing", peer: "64%", you: "91%", rank: "Top 10%" },
      { skill: "Data & GA4 Attribution", peer: "58%", you: "86%", rank: "Top 15%" },
      { skill: "Communication & Pitch", peer: "66%", you: "88%", rank: "Top 12%" },
      { skill: "Strategic Problem Solving", peer: "61%", you: "84%", rank: "Top 18%" },
    ];
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white my-auto">
          <div className="grid grid-cols-12 px-4 py-3 bg-[#002C66] text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="col-span-6">Competency Track</span>
            <span className="col-span-2 text-center">Peer</span>
            <span className="col-span-2 text-center">You</span>
            <span className="col-span-2 text-right">Rank</span>
          </div>
          <div className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <motion.div
                key={r.skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="grid grid-cols-12 items-center px-4 py-3.5 text-xs"
              >
                <span className="col-span-6 font-bold text-slate-900 truncate pr-2">{r.skill}</span>
                <span className="col-span-2 text-center font-medium text-slate-400">{r.peer}</span>
                <span className="col-span-2 text-center font-extrabold text-[#002C66]">{r.you}</span>
                <div className="col-span-2 text-right">
                  <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                    {r.rank}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#FBF4EB] border border-slate-200 px-4 py-3 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">National Cohort: 18,731 Candidates</span>
          <span className="font-extrabold text-[#002C66]">Outperforming 88% of Peers</span>
        </div>
      </div>
    );
  }

  // 04 — Salary Potential Report
  if (activeIdx === 3) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-4 my-auto">
          <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Market Valuation
              </span>
              <span className="text-lg font-extrabold font-display text-slate-700">
                ₹8.0 – ₹10.5 LPA
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full w-[50%] rounded-full bg-slate-500" />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#002C66] p-5 bg-[#FBF4EB]/60 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#002C66] flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600" /> CIR Verified + Upskilled Band
              </span>
              <span className="text-2xl font-extrabold font-display text-[#002C66]">
                ₹14.0 – ₹18.5 LPA
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "86%" }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-emerald-600"
              />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-600">
              Unlocks <span className="font-bold text-slate-900">34 Product & Growth roles</span> matching your Top 12% domain score.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#002C66] text-white px-4 py-3 flex items-center justify-between text-xs">
          <span className="text-white/80 font-medium">Average Candidate Offer Uplift</span>
          <span className="font-extrabold text-amber-300">+42% to +68% Hike</span>
        </div>
      </div>
    );
  }

  // 05 — Personalized Skill Gap Analysis
  if (activeIdx === 4) {
    const gaps = [
      { skill: "GA4 Multi-Touch Attribution", current: 55, target: 85, impact: "+8 pts IRS" },
      { skill: "Lifecycle Marketing Automation", current: 62, target: 88, impact: "+7 pts IRS" },
      { skill: "SQL for Funnel Analytics", current: 48, target: 80, impact: "+6 pts IRS" },
    ];
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-3 my-auto">
          {gaps.map((g, i) => (
            <div key={g.skill} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{g.skill}</span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                  {g.impact}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Current Score: {g.current}%</span>
                <span className="font-bold text-[#002C66]">Role Benchmark: {g.target}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden relative">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${g.current}%` }} />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${g.target - g.current}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                  className="h-full bg-[#002C66] rounded-r-full absolute top-0"
                  style={{ left: `${g.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#FBF4EB] border border-[#002C66]/15 px-4 py-3 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Post-Upskilling Role Readiness</span>
          <span className="font-extrabold text-[#002C66]">70% → 91% Job-Ready</span>
        </div>
      </div>
    );
  }

  // 06 — Career Path Recommendation
  if (activeIdx === 5) {
    const steps = [
      {
        stage: "Step 01 · Immediate High-Fit Role",
        role: "Performance Marketing Specialist",
        fit: "94% Match",
        comp: "₹10–13 LPA",
        active: true,
      },
      {
        stage: "Step 02 · 6–12 Month Milestone",
        role: "Growth Marketing Manager",
        fit: "84% Match",
        comp: "₹15–20 LPA",
        active: false,
      },
      {
        stage: "Step 03 · 18–24 Month Horizon",
        role: "Head of Digital Growth",
        fit: "Roadmap Ready",
        comp: "₹24–32 LPA",
        active: false,
      },
    ];
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-3 my-auto">
          {steps.map((s, idx) => (
            <motion.div
              key={s.role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-2xl border p-4 flex items-center justify-between gap-3 ${
                s.active
                  ? "border-[#002C66] bg-[#002C66] text-white shadow-md"
                  : "border-slate-200 bg-[#FBF4EB]/60 text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    s.active ? "bg-white text-[#002C66]" : "bg-[#002C66]/10 text-[#002C66]"
                  }`}
                >
                  0{idx + 1}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      s.active ? "text-amber-300" : "text-slate-500"
                    }`}
                  >
                    {s.stage}
                  </p>
                  <p className="text-sm font-bold truncate mt-0.5">{s.role}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    s.active
                      ? "bg-emerald-500 text-white"
                      : "bg-white border border-slate-200 text-[#002C66]"
                  }`}
                >
                  {s.fit}
                </span>
                <p className={`text-xs font-extrabold mt-1 ${s.active ? "text-white" : "text-slate-700"}`}>
                  {s.comp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-3 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Personalized to your domain & experience</span>
          <span className="font-extrabold text-[#002C66]">Updated Quarterly</span>
        </div>
      </div>
    );
  }

  // 07 — Interview Readiness Score
  if (activeIdx === 6) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Domain Case", score: "91%", sub: "Technical Depth" },
            { label: "Communication", score: "89%", sub: "Clarity & Tone" },
            { label: "HR & Culture", score: "84%", sub: "STAR Alignment" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-[#FBF4EB]/60 p-4 text-center"
            >
              <p className="text-2xl font-extrabold font-display text-[#002C66]">{item.score}</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{item.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 my-auto">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#002C66]">
            AI Evaluator Feedback & Prep Notes
          </p>
          <div className="flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Key Strength:</span> Strong ROI quantification and structured hypothesis testing during campaign case rounds.
            </p>
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Before Your Interview:</span> Review 2-minute executive summary frameworks for VP-level stakeholder rounds.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#002C66] text-white px-4 py-3 flex items-center justify-between text-xs">
          <span className="text-white/80 font-medium">Overall Interview Readiness</span>
          <span className="font-extrabold text-amber-300">88 / 100 · Ready to Interview</span>
        </div>
      </div>
    );
  }

  // 08 — Digital Skill Passport
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative w-full rounded-2xl bg-white shadow-md overflow-hidden border-2 border-[#002C66]/20 my-auto">
        <div className="bg-[#002C66] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Award className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-[0.18em]">
                Official Digital Skill Passport
              </p>
              <h4 className="text-base font-bold font-display text-white">
                Verified Career Intelligence Credential
              </h4>
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0">
            <QrCode className="h-7 w-7 text-slate-900" />
          </div>
        </div>

        <div className="p-5 bg-[#FBF4EB]/50 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase">CIR Score</p>
              <p className="text-lg font-extrabold font-display text-[#002C66] mt-0.5">86 / 100</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase">National Rank</p>
              <p className="text-lg font-extrabold font-display text-emerald-700 mt-0.5">Top 12%</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Integrity</p>
              <p className="text-lg font-extrabold font-display text-slate-900 mt-0.5">Proctored</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="inline-flex items-center gap-1.5 bg-[#002C66]/10 border border-[#002C66]/20 rounded-full px-3.5 py-1">
              <ShieldCheck className="h-4 w-4 text-[#002C66]" />
              <span className="text-xs font-bold text-[#002C66]">Verified by I Am Talento</span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">ID: IAT-CIR-4821</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">One-Click Add to LinkedIn & Resume</span>
        <span className="font-extrabold text-emerald-700">Instant Employer Verification</span>
      </div>
    </div>
  );
};

const CareerIntelligencePackageHome = ({ beforeCta, heading, eyebrow, description }: { beforeCta?: ReactNode; heading?: { first: string; second: string }; eyebrow?: string; description?: ReactNode } = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx];
  const ActiveIcon = active.icon;

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-[#FBF4EB]" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionBadge label={eyebrow ?? "Career Intelligence Report"} icon={Sparkles} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-4 mb-3 text-slate-900"
          >
            {heading?.first ?? "What You Get Inside Your"}
            <br />
            <span className="text-[#002C66]">{heading?.second ?? "Career Intelligence Report (CIR)"}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto"
          >
            {description ?? (<>Discover your strengths, close critical skill gaps, and benchmark yourself against
              <br className="hidden md:block" />
              industry standards with an 8-in-1 verified career dossier.</>)}
          </motion.p>
        </div>

        {/* Balanced 12-Col Bento Grid — Locked 510px Desktop Height for Zero Dead Space */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:h-[510px] items-stretch">
          {/* ─── Left Column (4 cols): 8 Evenly Distributed Selector Pills ─── */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-2 h-full">
            {items.map((item, i) => {
              const Icon = item.icon;
              const isSelected = activeIdx === i;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`group flex-1 flex items-center gap-3 rounded-xl border px-3.5 py-2 text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-[#002C66] border-[#002C66] shadow-md"
                      : "bg-white border-slate-200/90 hover:border-[#002C66]/40"
                  }`}
                >
                  <span
                    className={`text-[11px] font-extrabold tabular-nums w-5 shrink-0 ${
                      isSelected ? "text-amber-300" : "text-[#002C66]/60"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-white/15 text-white"
                        : "bg-[#002C66]/8 text-[#002C66]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`flex-1 min-w-0 text-[13px] font-bold font-display truncate ${
                      isSelected ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`hidden sm:inline-block rounded-md px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                      isSelected
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.shortTag}
                  </span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                      isSelected
                        ? "text-white translate-x-0.5"
                        : "text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#002C66]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* ─── Center Column (5 cols): Full-Height Interactive Visual Stage ─── */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between h-full overflow-hidden">
            {/* Stage Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-[#002C66] text-[10px] font-extrabold uppercase tracking-wider text-white">
                  0{activeIdx + 1} / 08
                </span>
                <span className="text-xs font-bold text-slate-900 truncate">
                  {active.title}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Preview
              </span>
            </div>

            {/* Stage Body */}
            <div className="flex-1 py-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="h-full"
                >
                  <ModuleVisualPanel activeIdx={activeIdx} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stage 3-Stat Footer Bar */}
            <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-slate-100 shrink-0">
              {active.subStats.map((st) => (
                <div
                  key={st.label}
                  className="rounded-xl bg-[#FBF4EB]/70 border border-slate-200/70 px-3 py-2 text-center"
                >
                  <p className="text-xs font-extrabold text-[#002C66] truncate">{st.value}</p>
                  <p className="text-[10px] font-medium text-slate-500 truncate">{st.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Column (3 cols): Two High-Contrast Bento Cards ─── */}
          <div className="lg:col-span-3 flex flex-col gap-5 h-full">
            {/* Top Bento Card — Hero Metric + Key Takeaways */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 flex-[1.25] flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {active.metricLabel}
                    </p>
                    <p className="text-3xl font-extrabold font-display text-[#002C66] tracking-tight mt-0.5">
                      {active.metricValue}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#002C66]/10 text-[#002C66] flex items-center justify-center shrink-0">
                    <ActiveIcon className="h-5 w-5" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                  {active.description}
                </p>

                <ul className="space-y-2">
                  {active.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-medium italic text-slate-500 line-clamp-1">
                  {active.highlight}
                </p>
              </div>
            </div>

            {/* Bottom Bento Card — Primary Navy Action Card */}
            <div className="rounded-3xl bg-[#002C66] text-white p-6 flex-1 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    8-in-1 Career Dossier
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-bold font-display text-white leading-snug">
                  Unlock Your Verified CIR Report
                </h3>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Shortlisted 3x faster across 500+ hiring partners.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2.5 pt-3">
                <Link
                  to="/assessments/explore"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-[#002C66] shadow-xs hover:bg-slate-100 transition-colors"
                >
                  Get CIR Report <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/assessments/digital-marketing-fundamentals"
                  aria-label="Start Assessment"
                  className="h-10 w-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="h-4 w-4 text-white -rotate-45" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {beforeCta}
      </div>
    </section>
  );
};

export default CareerIntelligencePackageHome;
