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
  Layers,
  FileCheck2,
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
};

const items: CIRItem[] = [
  {
    icon: Brain,
    title: "AI-Powered Skill Assessment",
    shortTag: "360° Evaluation",
    description:
      "A complete evaluation of your technical, functional, and real-world problem-solving abilities.",
    bullets: [
      "Technical & tool proficiency evaluation",
      "Functional domain knowledge assessment",
      "Industry-specific competency mapping",
      "Scenario-based problem-solving score",
    ],
    highlight: "Benchmarked against real hiring rubrics from 500+ companies.",
    metricValue: "4 Rounds",
    metricLabel: "Core + Domain Depth",
  },
  {
    icon: Gauge,
    title: "Employability Score",
    shortTag: "Credit-Style Score",
    description:
      "A single, recruiter-trusted readiness score from 0–100 that tells employers exactly where you stand.",
    bullets: [
      "Your Employability Score: 84 / 100",
      "Industry Average Baseline: 62 / 100",
      "Top 10% Performer Benchmark: 89 / 100",
      "Auto-synced with your candidate profile",
    ],
    highlight: "“I know exactly where I stand before I even apply.”",
    metricValue: "84/100",
    metricLabel: " Strong Hire Band",
  },
  {
    icon: BarChart3,
    title: "Industry Benchmarking Report",
    shortTag: "Peer Percentile",
    description:
      "Compare your performance head-to-head against freshers, mid-level peers, and top 10% industry leaders.",
    bullets: [
      "Domain Execution: Top 12% Nationally",
      "Analytical & Data Skills: Top 18%",
      "Workplace Communication: Top 15%",
      "Role-by-role percentile matrix",
    ],
    highlight: "“I know my competition — and how to outperform them.”",
    metricValue: "Top 12%",
    metricLabel: "National Percentile",
  },
  {
    icon: Wallet,
    title: "Salary Potential Report",
    shortTag: "Market Valuation",
    description:
      "Know your true market compensation today — and the exact package unlocked after closing top skill gaps.",
    bullets: [
      "Current Verified Market Band: ₹8–10 LPA",
      "Post-Upskilling Target Band: ₹14–18 LPA",
      "High-paying roles matched to your score",
      "City & tier-adjusted compensation insights",
    ],
    highlight: "Candidates use this data to negotiate 35%–75% higher offers.",
    metricValue: "+65%",
    metricLabel: "Avg. Package Uplift",
  },
  {
    icon: Target,
    title: "Personalized Skill Gap Analysis",
    shortTag: "AI Gap Diagnostic",
    description:
      "Pinpoint the exact micro-skills holding you back from senior roles and get a prioritized fix list.",
    bullets: [
      "Critical vs. nice-to-have skill gaps",
      "Recommended courses & certifications",
      "Priority 30-day learning sprints",
      "Projected score boost per skill learned",
    ],
    highlight:
      "Improve GA4 Attribution & Marketing Automation to jump from 74% → 92% job-ready.",
    metricValue: "+18%",
    metricLabel: "Readiness Unlock",
  },
  {
    icon: Compass,
    title: "Career Path Recommendation",
    shortTag: "Next 3 Moves",
    description:
      "Your next three career moves mapped step-by-step to high-demand, future-proof roles.",
    bullets: [
      "Stage 1: Performance Marketing Specialist (94% Fit)",
      "Stage 2: Growth Marketing Lead (82% Fit)",
      "Stage 3: Head of Digital Growth (Roadmap Ready)",
      "Timeline & skill milestones for each leap",
    ],
    highlight: "Clear trajectory from your current role to leadership.",
    metricValue: "3 Roles",
    metricLabel: "Mapped Career Ladder",
  },
  {
    icon: Mic,
    title: "Interview Readiness Score",
    shortTag: "Round-by-Round Prep",
    description:
      "Walk into technical and HR interviews knowing where you'll shine and what questions to prepare for.",
    bullets: [
      "Verbal & written communication clarity",
      "Case-study & situational judgment score",
      "HR & culture-alignment breakdown",
      "Custom mock Q&A focus areas",
    ],
    highlight: "Eliminate last-minute interview anxiety with targeted prep.",
    metricValue: "88%",
    metricLabel: "Interview Confidence",
  },
  {
    icon: BadgeCheck,
    title: "Digital Skill Passport",
    shortTag: "Tamper-Proof Credential",
    description:
      "A shareable, QR-verified credential and badge that recruiters and hiring managers trust on sight.",
    bullets: [
      "AI-proctored, tamper-proof verification ID",
      "One-click share to LinkedIn & resume",
      "Live percentile & sub-skill breakdown link",
      "Direct fast-track visibility to employers",
    ],
    highlight: "Go beyond a static resume — share verified proof of work.",
    metricValue: "Verified",
    metricLabel: "QR-Backed Credential",
  },
];

/* ------------------------------------------------------------------ */
/*  Learning-Page-Style Interactive Visual Panels for Each CIR Module */
/* ------------------------------------------------------------------ */

const ModuleVisualPanel = ({ activeIdx }: { activeIdx: number }) => {
  // 01 — AI-Powered Skill Assessment (inspired by Learning AIPanelVisual)
  if (activeIdx === 0) {
    const competencies = [
      { name: "Domain Execution", level: 92, tag: "Expert" },
      { name: "Analytical Thinking", level: 85, tag: "Advanced" },
      { name: "Practical Case Solving", level: 88, tag: "Advanced" },
      { name: "Workplace Communication", level: 79, tag: "Proficient" },
    ];
    return (
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#002C66] text-white">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold">AI Skill Intelligence Engine</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold">
              <Zap className="h-3 w-3 text-amber-300" /> 30-Layer Proctored
            </span>
          </div>

          <div className="p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Multi-Round Competency Map
              </span>
              <span className="text-xs font-extrabold text-[#002C66]">Overall: 86/100</span>
            </div>

            <div className="space-y-2.5">
              {competencies.map((c, i) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#002C66]/8 px-2 py-0.5 text-[10px] font-bold text-[#002C66]">
                        {c.tag}
                      </span>
                      <span className="font-extrabold tabular-nums text-slate-900">{c.level}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.level}%` }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        c.level >= 88 ? "bg-emerald-600" : "bg-[#002C66]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-[#FBF4EB] border border-[#002C66]/15 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#002C66] text-white flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">4 Core + 1 Sub-Domain Verified</p>
                  <p className="text-[11px] text-slate-500">Zero human bias · Auto-graded rubric</p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Passed ✓
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 02 — Employability Score (inspired by Learning ResumeStrengthSection dual rings)
  if (activeIdx === 1) {
    return (
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="text-xs font-bold text-slate-900">Employability Readiness Index</p>
              <p className="text-[11px] text-slate-500">Before vs. After CIR Verification</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              +32% Shortlist Boost
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Unverified */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <p className="text-[11px] font-semibold text-slate-500 mb-2.5">Industry Average</p>
              <div className="relative w-20 h-20 mx-auto mb-2.5">
                <svg width={80} height={80} className="-rotate-90" viewBox="0 0 80 80">
                  <circle cx={40} cy={40} r={32} fill="none" stroke="#e2e8f0" strokeWidth={6} />
                  <motion.circle
                    cx={40}
                    cy={40}
                    r={32}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeDasharray={201}
                    initial={{ strokeDashoffset: 201 }}
                    animate={{ strokeDashoffset: 201 - 201 * 0.62 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold font-display text-slate-700">62</span>
                  <span className="text-[9px] text-slate-400">/100</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Standard Unverified Resume</p>
            </div>

            {/* CIR Verified */}
            <div className="rounded-xl border-2 border-[#002C66]/30 bg-[#FBF4EB]/60 p-4 text-center relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[9px] bg-[#002C66] text-white px-2 py-0.5 rounded-full font-bold">
                Your Score
              </span>
              <p className="text-[11px] font-bold text-[#002C66] mb-2.5">CIR Verified</p>
              <div className="relative w-20 h-20 mx-auto mb-2.5">
                <svg width={80} height={80} className="-rotate-90" viewBox="0 0 80 80">
                  <circle cx={40} cy={40} r={32} fill="none" stroke="#e2e8f0" strokeWidth={6} />
                  <motion.circle
                    cx={40}
                    cy={40}
                    r={32}
                    fill="none"
                    stroke="#002C66"
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeDasharray={201}
                    initial={{ strokeDashoffset: 201 }}
                    animate={{ strokeDashoffset: 201 - 201 * 0.84 }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold font-display text-[#002C66]">84</span>
                  <span className="text-[9px] text-slate-500">/100</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-emerald-700">Strong Match · 120+ Roles</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 text-white p-3 flex items-center justify-between text-xs">
            <span className="text-white/80">Top 10% Benchmark Threshold</span>
            <span className="font-extrabold text-amber-400">89 / 100 (5 pts away)</span>
          </div>
        </div>
      </div>
    );
  }

  // 03 — Industry Benchmarking Report (inspired by Learning BlueprintPanelVisual)
  if (activeIdx === 2) {
    const rows = [
      { skill: "Performance Marketing", peer: "64%", you: "91%", rank: "Top 10%" },
      { skill: "Data & GA4 Attribution", peer: "58%", you: "86%", rank: "Top 15%" },
      { skill: "Communication & Pitch", peer: "66%", you: "88%", rank: "Top 12%" },
      { skill: "Strategic Problem Solving", peer: "61%", you: "84%", rank: "Top 18%" },
    ];
    return (
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-[#002C66]" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-700 ml-1.5">
              National Cohort Benchmark Matrix
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-4 px-4 py-2.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="col-span-2">Competency</span>
              <span className="text-center">Peer Avg</span>
              <span className="text-right">Your Rank</span>
            </div>
            {rows.map((r, i) => (
              <motion.div
                key={r.skill}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="grid grid-cols-4 items-center px-4 py-3 text-xs"
              >
                <div className="col-span-2 pr-2">
                  <p className="font-bold text-slate-900 truncate">{r.skill}</p>
                  <p className="text-[10px] text-slate-500">Your Score: {r.you}</p>
                </div>
                <span className="text-center font-semibold text-slate-500">{r.peer}</span>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                    {r.rank}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#FBF4EB] px-4 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Cohort Size: 18,731 Professionals</span>
            <span className="font-extrabold text-[#002C66]">Outperforming 88%</span>
          </div>
        </div>
      </div>
    );
  }

  // 04 — Salary Potential Report
  if (activeIdx === 3) {
    return (
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Market Compensation Projection</p>
              <p className="text-[11px] text-slate-500">Based on verified skill percentile & city tier</p>
            </div>
            <span className="rounded-full bg-[#002C66]/10 px-2.5 py-1 text-[10px] font-extrabold text-[#002C66]">
              2026 Market Data
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/70">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-500">Current Market Band</span>
                <span className="text-sm font-extrabold text-slate-800">₹8.0 – ₹10.5 LPA</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full w-[52%] rounded-full bg-slate-500" />
              </div>
            </div>

            <div className="rounded-xl border-2 border-emerald-500/40 p-3.5 bg-emerald-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Verified + Upskilled Band
                </span>
                <span className="text-base font-extrabold text-emerald-700">₹14.0 – ₹18.5 LPA</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-emerald-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "86%" }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-emerald-600"
                />
              </div>
              <p className="mt-2 text-[11px] font-medium text-emerald-800">
                Unlocks 34 high-paying roles across Product & Growth companies
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            {[
              { label: "Min Hike", val: "+42%" },
              { label: "Target Hike", val: "+68%" },
              { label: "Open Roles", val: "140+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-[#FBF4EB] p-2.5 border border-slate-200/80">
                <p className="text-sm font-extrabold text-[#002C66]">{stat.val}</p>
                <p className="text-[10px] font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 05 — Personalized Skill Gap Analysis
  if (activeIdx === 4) {
    const gaps = [
      { skill: "GA4 Multi-Touch Attribution", current: 55, target: 85, impact: "+8 pts IRS" },
      { skill: "Lifecycle Marketing Automation", current: 62, target: 88, impact: "+6 pts IRS" },
      { skill: "SQL for Funnel Analytics", current: 48, target: 80, impact: "+7 pts IRS" },
    ];
    return (
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#002C66]" />
              <span className="text-xs font-bold text-slate-900">Priority Skill Gap Diagnostic</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              3 High-ROI Gaps
            </span>
          </div>

          <div className="space-y-3">
            {gaps.map((g, i) => (
              <div key={g.skill} className="rounded-xl border border-slate-200/90 p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{g.skill}</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {g.impact}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Current: {g.current}%</span>
                  <span>→</span>
                  <span className="font-bold text-[#002C66]">Target: {g.target}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden relative">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${g.current}%` }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.target - g.current}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                    className="h-full bg-[#002C66] rounded-r-full absolute top-0"
                    style={{ left: `${g.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#002C66]/6 border border-[#002C66]/15 p-3 text-xs text-slate-700">
            <span className="font-bold text-[#002C66]">AI Action Plan:</span> Closing these 3 gaps boosts your readiness for Senior Growth roles from{" "}
            <span className="font-bold text-slate-900">70% → 91%</span>.
          </div>
        </div>
      </div>
    );
  }

  // 06 — Career Path Recommendation
  if (activeIdx === 5) {
    const steps = [
      {
        stage: "Current Ready Role",
        role: "Performance Marketing Specialist",
        fit: "94% Match",
        comp: "₹10–13 LPA",
        active: true,
      },
      {
        stage: "Next 6–12 Months",
        role: "Growth Marketing Manager",
        fit: "84% Match",
        comp: "₹15–20 LPA",
        active: false,
      },
      {
        stage: "18–24 Month Horizon",
        role: "AVP / Head of Digital Growth",
        fit: "Roadmap Ready",
        comp: "₹24–32 LPA",
        active: false,
      },
    ];
    return (
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#002C66]" />
              <span className="text-xs font-bold text-slate-900">AI Career Progression Ladder</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#002C66]">
              3-Step Trajectory
            </span>
          </div>

          <div className="space-y-2.5">
            {steps.map((s, idx) => (
              <motion.div
                key={s.role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-xl border p-3.5 flex items-center justify-between gap-3 ${
                  s.active
                    ? "border-[#002C66] bg-[#002C66] text-white shadow-sm"
                    : "border-slate-200 bg-[#FBF4EB]/50 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      s.active ? "bg-white text-[#002C66]" : "bg-[#002C66]/10 text-[#002C66]"
                    }`}
                  >
                    0{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        s.active ? "text-white/75" : "text-slate-500"
                      }`}
                    >
                      {s.stage}
                    </p>
                    <p className="text-xs font-bold truncate">{s.role}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      s.active ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {s.fit}
                  </span>
                  <p className={`text-[10px] font-bold mt-1 ${s.active ? "text-amber-300" : "text-slate-600"}`}>
                    {s.comp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 07 — Interview Readiness Score (inspired by Learning QAPanelVisual & MockVideoPanelVisual)
  if (activeIdx === 6) {
    return (
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-[#002C66]" />
              <span className="text-xs font-bold text-slate-900">Interview Readiness Breakdown</span>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
              88 / 100 Ready
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            {[
              { label: "Communication", score: "89%", sub: "Clarity & Tone" },
              { label: "Domain Case", score: "91%", sub: "Technical Depth" },
              { label: "HR & Culture", score: "84%", sub: "STAR Alignment" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <p className="text-base font-extrabold text-[#002C66]">{item.score}</p>
                <p className="text-[11px] font-bold text-slate-800 mt-0.5">{item.label}</p>
                <p className="text-[9px] text-slate-500">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              AI Interviewer Notes & Focus Areas
            </p>
            <div className="rounded-xl bg-[#FBF4EB] border border-slate-200/80 p-3 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-slate-700">
                  <span className="font-bold text-slate-900">Strength:</span> Structured ROI quantification during budget allocation scenarios.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#002C66] shrink-0 mt-0.5" />
                <p className="text-slate-700">
                  <span className="font-bold text-slate-900">Prep Tip:</span> Practice 2-minute executive summaries for cross-functional stakeholder rounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 08 — Digital Skill Passport (inspired by Learning CertificatesSection framed certificate mockup)
  return (
    <div className="relative h-full flex flex-col justify-center p-5 md:p-6">
      <div className="relative w-full rounded-2xl bg-white shadow-xl overflow-hidden border border-slate-200">
        {/* Corner ribbon accents from Learning CertificatesSection */}
        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="absolute -top-2 -left-2 w-24 h-6 bg-[#002C66] rotate-[-45deg] origin-center translate-y-4" />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="absolute -top-2 -right-2 w-24 h-6 bg-[#002C66] rotate-[45deg] origin-center translate-y-4" />
        </div>

        <div className="m-3.5 rounded-xl border border-[#002C66]/20 p-5 bg-[#FBF4EB]/45 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#002C66] flex items-center justify-center shadow-md shrink-0">
                <Award className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-[10px] text-[#002C66] font-extrabold uppercase tracking-[0.18em]">
                  Digital Skill Passport
                </p>
                <h4 className="text-base font-bold font-display text-slate-900">
                  Career Intelligence Credential
                </h4>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 shrink-0">
              <QrCode className="h-6 w-6 text-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center bg-white rounded-xl p-3 border border-slate-200/80">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">IRS Score</p>
              <p className="text-sm font-extrabold text-[#002C66]">86 / 100</p>
            </div>
            <div className="border-x border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Percentile</p>
              <p className="text-sm font-extrabold text-emerald-700">Top 12%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Status</p>
              <p className="text-sm font-extrabold text-slate-900">Proctored</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="inline-flex items-center gap-1.5 bg-[#002C66]/10 border border-[#002C66]/20 rounded-full px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#002C66]" />
              <span className="text-[11px] font-bold text-[#002C66]">Verified by I Am Talento</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">ID: IAT-CIR-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CareerIntelligencePackageHome = ({ beforeCta }: { beforeCta?: ReactNode } = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx];
  const ActiveIcon = active.icon;

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-[#FBF4EB]" ref={ref}>
      <div className="container">
        {/* Section Header — matches Learning page CoursePerksSection & WhyChooseLearningSection */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionBadge label="Career Intelligence Report" icon={Sparkles} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-4 mb-3 text-slate-900"
          >
            What You Get Inside Your
            <br />
            <span className="text-[#002C66]">Career Intelligence Report (CIR)</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            Discover your strengths, close critical skill gaps, and benchmark yourself against
            <br className="hidden md:block" />
            industry standards with an 8-in-1 verified career dossier.
          </motion.p>
        </div>

        {/* Learning-Page-Style 12-Column Interactive Bento Grid (matches full .container width) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* ─── Left Column (4 cols): Numbered Interactive Pills (like Learning CoursePerksSection) ─── */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-2">
            {items.map((item, i) => {
              const Icon = item.icon;
              const isSelected = activeIdx === i;
              return (
                <motion.button
                  key={item.title}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
                  onClick={() => setActiveIdx(i)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-[#002C66] border-[#002C66] shadow-md"
                      : "bg-white border-border hover:border-[#002C66]/40"
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold tabular-nums transition-colors duration-300 ${
                      isSelected ? "text-amber-300" : "text-[#002C66]"
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
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold font-display truncate transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </p>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                      isSelected
                        ? "text-white translate-x-1"
                        : "text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#002C66]"
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* ─── Center Column (5 cols): Dynamic Interactive Visual Stage + Module Breakdown ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 rounded-2xl bg-white/80 border border-border shadow-xs flex flex-col justify-between overflow-hidden min-h-[460px]"
          >
            {/* Top Bar inside Stage */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#002C66]">
                  <Layers className="h-3 w-3" /> Module 0{activeIdx + 1} / 08
                </span>
                <span className="text-xs font-semibold text-slate-500">{active.shortTag}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Included in CIR
              </span>
            </div>

            {/* Animated Visual Mockup */}
            <div className="relative flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <ModuleVisualPanel activeIdx={activeIdx} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Highlight Strip inside Center Stage */}
            <div className="px-5 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-600 italic line-clamp-1">{active.highlight}</p>
              <span className="shrink-0 rounded-lg bg-[#002C66]/8 px-2.5 py-1 text-[11px] font-extrabold text-[#002C66]">
                {active.metricValue}
              </span>
            </div>
          </motion.div>

          {/* ─── Right Column (3 cols): Two Stacked Bento Cards (like Learning CoursePerksSection & WhyChooseLearningSection) ─── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Top Bento Card — Active Module Key Deliverables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="rounded-2xl border border-border bg-white p-5 flex-1 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-[#002C66]/10 text-[#002C66] flex items-center justify-center shrink-0">
                    <ActiveIcon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    What's Measured
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold font-display text-slate-900 leading-snug mb-1.5">
                  {active.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                  {active.description}
                </p>

                <ul className="space-y-2">
                  {active.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-xs font-medium text-slate-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#002C66] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-lg font-extrabold font-display text-[#002C66] leading-none">
                    {active.metricValue}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{active.metricLabel}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <FileCheck2 className="h-3 w-3" /> Recruiter Ready
                </span>
              </div>
            </motion.div>

            {/* Bottom Bento Card — Primary Navy CTA Card (matches Learning CoursePerksSection & WhyChooseLearningSection) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="rounded-2xl bg-[#002C66] text-white p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-white/75">
                    Ready to prove your skills?
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3 w-3 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold font-display text-white leading-snug mb-1.5">
                  Unlock Your Complete
                  <br />
                  8-in-1 CIR Report
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Join 18,731+ verified professionals getting shortlisted 3x faster by top employers.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Link
                  to="/assessments/explore"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-[#002C66] shadow-sm hover:bg-slate-100 transition-colors"
                >
                  Explore Assessments <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/assessments/digital-marketing-fundamentals"
                  aria-label="Start Assessment"
                  className="h-10 w-10 rounded-full border-2 border-white/35 bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="h-4 w-4 text-white -rotate-45" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {beforeCta}
      </div>
    </section>
  );
};

export default CareerIntelligencePackageHome;
