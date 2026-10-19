import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { Link } from "react-router-dom";

import eventNetworking from "@/assets/event-networking.jpg";
import eventHackathon from "@/assets/event-hackathon.jpg";
import eventWebinar from "@/assets/event-webinar.jpg";
import eventPodcasts from "@/assets/event-podcasts.jpg";
import stepReportImg from "@/assets/step-report.jpg";
import mockInterviewImg from "@/assets/mock-interview-1.jpg";
import candidatePortrait from "@/assets/learner-ananya.jpg";
import expertPortrait from "@/assets/experts/male-1.jpg";

type ReportModule = {
  id: string;
  num: string;
  shortTitle: string;
  title: string;
  tag: string;
  metricBadge: string;
  summary: string;
  highlightStat: string;
  highlightLabel: string;
  bullets: string[];
};

const REPORT_MODULES: ReportModule[] = [
  {
    id: "ai-assessment",
    num: "01",
    shortTitle: "AI Skill Evaluation",
    title: "AI-Powered Skill Assessment Breakdown",
    tag: "5-Dimension Analysis",
    metricBadge: "92 / 100",
    summary:
      "Granular scoring across functional domain mastery, real-world case solving, communication clarity, and workplace ethics.",
    highlightStat: "Top 6%",
    highlightLabel: "National Cohort Standing",
    bullets: [
      "Sub-skill accuracy across 4 mandatory + 1 domain track",
      "Question-by-question difficulty & speed calibration",
      "30-layer AI proctoring integrity seal attached",
    ],
  },
  {
    id: "employability",
    num: "02",
    shortTitle: "Employability Score",
    title: "Verified Industry Readiness Score (IRS)",
    tag: "Recruiter Benchmark",
    metricBadge: "88 IRS",
    summary:
      "A single, standardized readiness index trusted by 500+ hiring partners to shortlist candidates without resume bias.",
    highlightStat: "3.4×",
    highlightLabel: "Higher Interview Shortlist Rate",
    bullets: [
      "Weighted composite of practical + behavioural rounds",
      "Direct eligibility for priority employer pipelines",
      "Dynamic score updates as you complete new capstones",
    ],
  },
  {
    id: "benchmarking",
    num: "03",
    shortTitle: "Industry Benchmarking",
    title: "Peer & Industry Benchmarking Report",
    tag: "Cohort Percentile",
    metricBadge: "91st %ile",
    summary:
      "See exactly how your functional capabilities compare against entry, mid-level, and senior professionals in your target city and sector.",
    highlightStat: "+29 pts",
    highlightLabel: "Above Industry Median Score",
    bullets: [
      "Head-to-head comparison with top 10% hired candidates",
      "Role-wise & experience-band percentile curves",
      "Verified strengths highlighted for hiring managers",
    ],
  },
  {
    id: "salary",
    num: "04",
    shortTitle: "Salary Potential",
    title: "Data-Backed Salary Potential Report",
    tag: "Compensation Intelligence",
    metricBadge: "₹14L–₹21L",
    summary:
      "Walk into salary negotiations armed with real compensation bands matched to your verified percentile and domain scarcity.",
    highlightStat: "+28%",
    highlightLabel: "Verified Talent Pay Premium",
    bullets: [
      "City-adjusted CTC bands across Tier-1 & remote roles",
      "Skill-premium calculation based on live job openings",
      "Negotiation leverage points backed by your CIR score",
    ],
  },
  {
    id: "skill-gap",
    num: "05",
    shortTitle: "Skill Gap Analysis",
    title: "Personalized Skill Gap & Action Roadmap",
    tag: "Targeted Growth",
    metricBadge: "2 Micro-Gaps",
    summary:
      "Pinpoints the exact sub-skills holding back your score and pairs them with bite-sized project modules to close the gap fast.",
    highlightStat: "+11 pts",
    highlightLabel: "Projected Score Lift in 14 Days",
    bullets: [
      "Side-by-side view of production-ready vs. developing skills",
      "Curated learning sprints mapped to each weak area",
      "Instant re-assessment unlock after module completion",
    ],
  },
  {
    id: "career-path",
    num: "06",
    shortTitle: "Career Path Map",
    title: "AI Career Path & Role-Fit Recommendation",
    tag: "Trajectory Engine",
    metricBadge: "95% Role Fit",
    summary:
      "Maps your psychometric, vocational, and technical strengths to the high-growth roles where you have the highest probability of thriving.",
    highlightStat: "12 Roles",
    highlightLabel: "High-Match Career Tracks Unlocked",
    bullets: [
      "Immediate best-fit roles + 18-month promotion horizon",
      "Psychometric & workplace culture compatibility score",
      "1-click apply to matched openings on I Am Talento",
    ],
  },
  {
    id: "interview",
    num: "07",
    shortTitle: "Interview Readiness",
    title: "HR & Technical Interview Readiness Score",
    tag: "Behavioural Rubric",
    metricBadge: "90% Ready",
    summary:
      "Evaluates your communication tone, situational judgment, and structured problem-solving so you ace live hiring manager rounds.",
    highlightStat: "4.8 / 5",
    highlightLabel: "Executive Communication Rating",
    bullets: [
      "STAR-framework & behavioural situational judgment grade",
      "Voice clarity, confidence, and structured reasoning metrics",
      "Custom mock-interview prompts tailored to your target role",
    ],
  },
  {
    id: "passport",
    num: "08",
    shortTitle: "Digital Skill Passport",
    title: "Shareable Digital Skill Passport & Badge",
    tag: "Tamper-Proof ID",
    metricBadge: "Verified ID",
    summary:
      "Your portable, cryptographically verifiable credential card that embeds directly on LinkedIn, resumes, and employer applications.",
    highlightStat: "100%",
    highlightLabel: "Instant Recruiter One-Click Verification",
    bullets: [
      "Unique verification URL & QR code for resumes",
      "Gold-standard Verified Badge on your Talento profile",
      "Lifetime access with downloadable PDF executive dossier",
    ],
  },
];

type Benefit = {
  num: string;
  tag: string;
  stat: string;
  title: string;
  description: string;
  image: string;
  link: string;
};

const BENEFITS: Benefit[] = [
  {
    num: "01",
    tag: "In-Person Access",
    stat: "12+ Cities",
    title: "Networking Events",
    description: "Connect directly with hiring managers, founders, and verified peers at curated city chapters.",
    image: eventNetworking,
    link: "/meetups",
  },
  {
    num: "02",
    tag: "Fast-Track Hiring",
    stat: "₹10L+ Prizes",
    title: "Hackathons",
    description: "Build real products, compete in company challenges, and win direct interview fast-tracks.",
    image: eventHackathon,
    link: "/hackathons",
  },
  {
    num: "03",
    tag: "Live Masterclasses",
    stat: "Weekly Live",
    title: "Online Webinars",
    description: "Interactive deep-dives and portfolio clinics hosted by engineering, product, and growth leaders.",
    image: eventWebinar,
    link: "/webinars",
  },
  {
    num: "04",
    tag: "Creator Studio",
    stat: "50+ Episodes",
    title: "Career Podcasts",
    description: "Unfiltered playbooks and hiring insights from top recruiters and industry trailblazers.",
    image: eventPodcasts,
    link: "/podcasts",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Rich Custom Visual Canvas for each of the 8 Report Modules (No tiny line icons!)
   ────────────────────────────────────────────────────────────────────────── */
const ModuleVisualCanvas = ({ activeIdx }: { activeIdx: number }) => {
  if (activeIdx === 0) {
    // 01: AI-Powered Skill Assessment — Multi-axis bars + real candidate report card photo
    return (
      <div className="grid sm:grid-cols-[1.15fr_0.85fr] gap-3.5 items-stretch">
        <div className="rounded-2xl bg-white p-4 border border-[#002C66]/12 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66]">
                5-Axis Competency Radar
              </p>
              <p className="text-sm font-bold text-slate-900">Functional & Core Breakdown</p>
            </div>
            <span className="rounded-lg bg-[#002C66] px-2.5 py-1 text-xs font-extrabold text-white">
              92 / 100
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Domain Specialization", score: 94, band: "Top 4%" },
              { label: "Practical Case Execution", score: 91, band: "Top 7%" },
              { label: "Communication & Clarity", score: 89, band: "Top 10%" },
              { label: "Psychometric & Role Fit", score: 93, band: "Top 5%" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{row.label}</span>
                  <span className="font-extrabold text-[#002C66]">
                    {row.score}% <span className="text-[10px] font-semibold text-slate-400">({row.band})</span>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#FBF4EB] overflow-hidden border border-[#002C66]/10">
                  <div
                    className="h-full rounded-full bg-[#002C66] transition-all duration-500"
                    style={{ width: `${row.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#00204d] min-h-[190px] flex flex-col justify-end p-4">
          <img
            src={stepReportImg}
            alt="AI Skill Assessment Report"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          />
          <div className="relative z-10 rounded-xl bg-[#002C66]/95 p-3 text-white border border-white/15 shadow-lg">
            <div className="flex items-center gap-2.5">
              <img
                src={candidatePortrait}
                alt="Candidate"
                className="h-9 w-9 rounded-full object-cover object-top border-2 border-white shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-extrabold truncate">Ananya Verma • CIR #8841</p>
                <p className="text-[10px] text-white/80">30-Layer Proctored • Zero Flags</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeIdx === 1) {
    // 02: Employability Score — Sculpted SVG Radial Gauge + Recruiter Trust Card
    const circumference = 2 * Math.PI * 46;
    const offset = circumference * (1 - 0.88);
    return (
      <div className="grid sm:grid-cols-[0.95fr_1.05fr] gap-3.5 items-stretch">
        <div className="rounded-2xl bg-white p-4 border border-[#002C66]/12 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center mb-2">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="46" fill="none" stroke="#FBF4EB" strokeWidth="10" />
              <circle
                cx="55"
                cy="55"
                r="46"
                fill="none"
                stroke="#002C66"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-display text-[#002C66] leading-none">
                88
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                IRS Score
              </span>
            </div>
          </div>
          <span className="inline-block rounded-full bg-[#FBF4EB] border border-[#002C66]/15 px-3 py-1 text-[11px] font-extrabold text-[#002C66]">
            Band A+ • Ready to Hire
          </span>
        </div>

        <div className="rounded-2xl bg-[#FBF4EB] p-4 border border-[#002C66]/12 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66] mb-1">
              Employer Shortlist Impact
            </p>
            <p className="text-sm font-bold text-slate-900 mb-3">
              How recruiters filter with your IRS score
            </p>
            <div className="space-y-2">
              {[
                { tier: "85+ IRS (Your Tier)", status: "Instant Interview Fast-Track", active: true },
                { tier: "70–84 IRS", status: "Standard Shortlist Queue", active: false },
                { tier: "Unverified Resume", status: "Manual Screening Pool", active: false },
              ].map((t) => (
                <div
                  key={t.tier}
                  className={`rounded-xl px-3 py-2 text-xs flex items-center justify-between border ${
                    t.active
                      ? "bg-[#002C66] text-white border-[#002C66] font-bold"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  <span>{t.tier}</span>
                  <span className="text-[10px] opacity-90">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeIdx === 2) {
    // 03: Industry Benchmarking — Visual Cohort Distribution Chart
    const bars = [
      { pct: "20%", h: 24, label: "P25", active: false },
      { pct: "40%", h: 42, label: "P50 (Median)", active: false },
      { pct: "65%", h: 64, label: "P75", active: false },
      { pct: "88%", h: 88, label: "You (91st %ile)", active: true },
      { pct: "96%", h: 52, label: "Top 1%", active: false },
    ];
    return (
      <div className="rounded-2xl bg-white p-4 sm:p-5 border border-[#002C66]/12">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66]">
              National Cohort Distribution (18,730+ Candidates)
            </p>
            <p className="text-sm font-bold text-slate-900">
              You outperform 91% of tested peers in your experience band
            </p>
          </div>
          <span className="rounded-full bg-[#FBF4EB] border border-[#002C66]/20 px-3 py-1 text-xs font-extrabold text-[#002C66]">
            91st Percentile
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2.5 items-end h-32 pt-4 px-2 rounded-xl bg-[#FBF4EB] border border-[#002C66]/10 p-3">
          {bars.map((b) => (
            <div key={b.label} className="flex flex-col items-center justify-end h-full">
              <span
                className={`text-[10px] font-extrabold mb-1 ${
                  b.active ? "text-[#002C66]" : "text-slate-400"
                }`}
              >
                {b.pct}
              </span>
              <div
                className={`w-full rounded-t-lg transition-all ${
                  b.active ? "bg-[#002C66]" : "bg-[#002C66]/20"
                }`}
                style={{ height: `${b.h}%` }}
              />
              <span
                className={`mt-1.5 text-[10px] font-bold text-center leading-tight ${
                  b.active ? "text-[#002C66]" : "text-slate-500"
                }`}
              >
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeIdx === 3) {
    // 04: Salary Potential — Visual Compensation Range & Tier Comparison
    return (
      <div className="rounded-2xl bg-white p-4 sm:p-5 border border-[#002C66]/12 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66]">
              Verified Compensation Band • Mid-Senior Track
            </p>
            <p className="text-lg font-extrabold font-display text-slate-900">
              ₹14.5 LPA — ₹21.0 LPA
            </p>
          </div>
          <span className="rounded-xl bg-[#002C66] text-white px-3 py-1.5 text-xs font-extrabold">
            +28% Verified Premium
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-2.5">
          {[
            {
              role: "Unverified Market Avg",
              ctc: "₹9.5L – ₹12.0L",
              note: "Standard resume pool",
              highlighted: false,
            },
            {
              role: "Your CIR Verified Band",
              ctc: "₹14.5L – ₹21.0L",
              note: "91st percentile benchmark",
              highlighted: true,
            },
            {
              role: "Top 1% Product Firms",
              ctc: "₹22.0L – ₹28.5L",
              note: "With 1 capstone upgrade",
              highlighted: false,
            },
          ].map((band) => (
            <div
              key={band.role}
              className={`rounded-xl p-3 border ${
                band.highlighted
                  ? "bg-[#002C66] text-white border-[#002C66] shadow-sm"
                  : "bg-[#FBF4EB] text-slate-900 border-[#002C66]/12"
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  band.highlighted ? "text-white/80" : "text-slate-500"
                }`}
              >
                {band.role}
              </p>
              <p className="text-base font-extrabold font-display mt-1">{band.ctc}</p>
              <p
                className={`text-[11px] mt-1 ${
                  band.highlighted ? "text-white/85" : "text-slate-600"
                }`}
              >
                {band.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeIdx === 4) {
    // 05: Personalized Skill Gap Analysis — Delta Matrix
    return (
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div className="rounded-2xl bg-white p-4 border border-[#002C66]/12">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66]">
              Verified Strengths
            </span>
            <span className="rounded-full bg-[#002C66] text-white px-2 py-0.5 text-[10px] font-bold">
              Ready for Production
            </span>
          </div>
          <div className="space-y-2">
            {[
              { skill: "Performance Attribution & ROAS", score: "95%" },
              { skill: "Full-Funnel Growth Strategy", score: "92%" },
              { skill: "Stakeholder Communication", score: "89%" },
            ].map((s) => (
              <div
                key={s.skill}
                className="flex items-center justify-between rounded-xl bg-[#FBF4EB] px-3 py-2 text-xs font-bold text-slate-900"
              >
                <span>{s.skill}</span>
                <span className="text-[#002C66]">{s.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#FBF4EB] p-4 border border-[#002C66]/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66]">
                2 Micro-Gaps to Close
              </span>
              <span className="rounded-full bg-white border border-[#002C66]/20 text-[#002C66] px-2 py-0.5 text-[10px] font-extrabold">
                +11 IRS Potential
              </span>
            </div>
            <div className="space-y-2">
              {[
                {
                  gap: "SQL Cohort Retention Queries",
                  fix: "2-Hr Interactive Lab Unlocked",
                },
                {
                  gap: "Automated Looker Studio Pipelines",
                  fix: "Guided Capstone Project",
                },
              ].map((g) => (
                <div
                  key={g.gap}
                  className="rounded-xl bg-white p-2.5 border border-[#002C66]/10"
                >
                  <p className="text-xs font-bold text-slate-900">{g.gap}</p>
                  <p className="text-[11px] font-semibold text-[#002C66] mt-0.5">
                    → {g.fix}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeIdx === 5) {
    // 06: Career Path Recommendation — Trajectory Cards
    return (
      <div className="rounded-2xl bg-white p-4 sm:p-5 border border-[#002C66]/12">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66] mb-1">
          AI Role-Fit & Career Trajectory Engine
        </p>
        <p className="text-sm font-bold text-slate-900 mb-3.5">
          Matched to your psychometric, vocational & functional profile
        </p>

        <div className="grid sm:grid-cols-3 gap-2.5">
          {[
            {
              stage: "Immediate Best Fit",
              role: "Senior Growth Specialist",
              fit: "95% Match",
              openings: "42 Active Roles",
              active: true,
            },
            {
              stage: "Adjacent High-Fit",
              role: "Product Marketing Manager",
              fit: "91% Match",
              openings: "28 Active Roles",
              active: false,
            },
            {
              stage: "18-Month Horizon",
              role: "Head of Growth & Revenue",
              fit: "87% Trajectory",
              openings: "Leadership Track",
              active: false,
            },
          ].map((step) => (
            <div
              key={step.role}
              className={`rounded-xl p-3 border flex flex-col justify-between ${
                step.active
                  ? "bg-[#002C66] text-white border-[#002C66]"
                  : "bg-[#FBF4EB] text-slate-900 border-[#002C66]/12"
              }`}
            >
              <div>
                <span
                  className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                    step.active
                      ? "bg-white text-[#002C66]"
                      : "bg-white text-[#002C66] border border-[#002C66]/15"
                  }`}
                >
                  {step.fit}
                </span>
                <p
                  className={`text-[10px] font-semibold ${
                    step.active ? "text-white/75" : "text-slate-500"
                  }`}
                >
                  {step.stage}
                </p>
                <p className="text-sm font-extrabold font-display leading-snug mt-0.5">
                  {step.role}
                </p>
              </div>
              <p
                className={`text-[11px] font-bold mt-3 pt-2 border-t ${
                  step.active
                    ? "border-white/15 text-white/90"
                    : "border-[#002C66]/10 text-[#002C66]"
                }`}
              >
                {step.openings}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeIdx === 6) {
    // 07: Interview Readiness Score — Video Studio Frame + Rubric
    return (
      <div className="grid sm:grid-cols-[0.9fr_1.1fr] gap-3.5 items-stretch">
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#00204d] min-h-[185px] flex flex-col justify-between p-3.5">
          <img
            src={mockInterviewImg}
            alt="Interview Readiness Evaluation"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full bg-[#002C66] text-white px-2.5 py-1 text-[10px] font-extrabold">
              ● AI Behavioural Review
            </span>
            <span className="rounded-full bg-white text-[#002C66] px-2.5 py-1 text-[10px] font-extrabold">
              90 / 100
            </span>
          </div>
          <div className="relative z-10 rounded-xl bg-[#002C66]/95 p-2.5 text-white border border-white/15">
            <p className="text-[11px] font-bold leading-snug">
              "Clear STAR structuring and confident executive presence under pressure."
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-[#002C66]/12 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#002C66] mb-1">
              HR & Situational Judgment Rubric
            </p>
            <p className="text-sm font-bold text-slate-900 mb-3">
              Verified across 4 workplace dimensions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Structured Thinking", val: "94%" },
                { label: "Verbal Clarity", val: "91%" },
                { label: "Culture & Ethics", val: "89%" },
                { label: "Conflict Resolution", val: "88%" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-[#FBF4EB] p-2.5 border border-[#002C66]/10"
                >
                  <p className="text-base font-extrabold font-display text-[#002C66]">
                    {m.val}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700 leading-tight">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 08: Digital Skill Passport — Royal Navy & Cream Verified Credential Card
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 border border-[#002C66]/12">
      <div className="grid sm:grid-cols-[1.2fr_0.8fr] gap-4 items-center">
        <div className="rounded-2xl bg-[#002C66] p-4 text-white border border-[#002C66] shadow-md">
          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src={expertPortrait}
                alt="Verified Candidate"
                className="h-11 w-11 rounded-xl object-cover object-top border-2 border-white"
              />
              <div>
                <span className="inline-block rounded-full bg-white text-[#002C66] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                  CIR Verified Passport
                </span>
                <p className="text-sm font-extrabold font-display mt-0.5">
                  Rohan Deshmukh
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold font-display leading-none">88</p>
              <p className="text-[9px] uppercase tracking-widest text-white/75">IRS Score</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center bg-white/10 rounded-xl p-2">
            <div>
              <p className="text-[9px] uppercase text-white/70">Percentile</p>
              <p className="text-xs font-extrabold">Top 6%</p>
            </div>
            <div className="border-x border-white/15">
              <p className="text-[9px] uppercase text-white/70">Proctored</p>
              <p className="text-xs font-extrabold">30-Layer</p>
            </div>
            <div>
              <p className="text-[9px] uppercase text-white/70">Credential ID</p>
              <p className="text-xs font-extrabold">#IAT-8841</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#FBF4EB] p-4 border border-[#002C66]/15 flex flex-col items-center text-center justify-center">
          {/* Custom SVG QR-style Verification Matrix */}
          <div className="h-16 w-16 rounded-xl bg-white p-2 border border-[#002C66]/20 grid grid-cols-4 grid-rows-4 gap-1 mb-2.5">
            {[1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1].map((cell, i) => (
              <span
                key={i}
                className={`rounded-[2px] ${cell ? "bg-[#002C66]" : "bg-[#FBF4EB]"}`}
              />
            ))}
          </div>
          <p className="text-xs font-extrabold text-slate-900">1-Click Recruiter Scan</p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Embeds on LinkedIn, PDF Resume & Talento Profile
          </p>
        </div>
      </div>
    </div>
  );
};

const CareerIntelligencePackageSection = ({
  beforeCta,
}: { beforeCta?: ReactNode } = {}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [activeBenefitIdx, setActiveBenefitIdx] = useState<number>(0);
  const activeModule = REPORT_MODULES[activeIdx];

  return (
    <section
      id="cir-report"
      className="py-12 md:py-16 bg-[#FBF4EB] scroll-mt-20 border-y border-[#002C66]/10"
    >
      <div className="container px-4 md:px-6">
        {/* Compact Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <SectionBadge label="Skill Assessment Report" icon={Sparkles} />
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold font-display leading-[1.12] text-slate-950"
            >
              Get Your Career Intelligence{" "}
              <span className="text-[#002C66]">Report Today.</span>
            </motion.h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base max-w-md leading-relaxed">
            Hover over any of the 8 intelligence modules below to preview what happens inside your verified CIR dossier.
          </p>
        </div>

        {/* ── TIER 1: Interactive Bento Report Explorer (Hover to Switch) ── */}
        <div className="rounded-3xl bg-white border border-[#002C66]/15 p-4 sm:p-6 shadow-[0_20px_50px_-20px_rgba(0,44,102,0.12)]">
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            {/* Left 5 Columns: 2x4 Interactive Bento Selector Tiles (No Tiny Line Icons!) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#002C66]">
                  8 Core Report Modules
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Hover or tap to inspect
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 flex-1">
                {REPORT_MODULES.map((mod, idx) => {
                  const isSelected = activeIdx === idx;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onMouseEnter={() => setActiveIdx(idx)}
                      onFocus={() => setActiveIdx(idx)}
                      onClick={() => setActiveIdx(idx)}
                      className={`group text-left rounded-2xl p-3 transition-all duration-300 border flex flex-col justify-between outline-none ${
                        isSelected
                          ? "bg-[#002C66] text-white border-[#002C66] shadow-[0_12px_28px_-10px_rgba(0,44,102,0.45)] -translate-y-0.5"
                          : "bg-[#FBF4EB]/75 hover:bg-[#FBF4EB] text-slate-900 border-[#002C66]/12 hover:border-[#002C66]/35"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full mb-2">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-display text-xs font-extrabold tracking-tight ${
                            isSelected
                              ? "bg-white text-[#002C66]"
                              : "bg-[#002C66] text-white"
                          }`}
                        >
                          {mod.num}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white/15 text-white"
                              : "bg-white text-[#002C66] border border-[#002C66]/15"
                          }`}
                        >
                          {mod.metricBadge}
                        </span>
                      </div>

                      <div>
                        <p
                          className={`font-display text-xs sm:text-[13px] font-extrabold leading-snug ${
                            isSelected ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {mod.shortTitle}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 truncate ${
                            isSelected ? "text-white/75" : "text-slate-500"
                          }`}
                        >
                          {mod.tag}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 7 Columns: Live Interactive Visual Showcase Stage */}
            <div className="lg:col-span-7 rounded-2xl bg-[#002C66] p-4 sm:p-6 text-white flex flex-col justify-between border border-[#002C66]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col justify-between h-full gap-4"
                >
                  {/* Top Stage Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/15 pb-3.5">
                    <div>
                      <div className="inline-flex items-center gap-2 mb-1.5">
                        <span className="rounded-md bg-white text-[#002C66] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                          Module {activeModule.num} of 08
                        </span>
                        <span className="text-xs font-semibold text-white/80">
                          {activeModule.tag}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold font-display leading-tight text-white">
                        {activeModule.title}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-white/10 border border-white/15 px-3.5 py-2 text-right shrink-0">
                      <p className="text-xl font-extrabold font-display text-white leading-none">
                        {activeModule.highlightStat}
                      </p>
                      <p className="text-[10px] font-medium text-white/80 mt-0.5">
                        {activeModule.highlightLabel}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Graphic / Visual Mockup Canvas */}
                  <ModuleVisualCanvas activeIdx={activeIdx} />

                  {/* Bottom Summary & 3 Key Takeaways */}
                  <div className="rounded-xl bg-white/10 border border-white/15 p-3.5">
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-2.5">
                      {activeModule.summary}
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                      {activeModule.bullets.map((b) => (
                        <div key={b} className="flex items-start gap-1.5 text-[11px] text-white/90">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[#002C66]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          <span className="leading-snug font-medium">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── TIER 2: Hover-Expanding Photo Bento Strip (Ecosystem Perks Unlocked) ── */}
          <div className="mt-6 pt-6 border-t border-[#002C66]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold font-display text-slate-950">
                  Plus, 4 Career Ecosystem Perks Unlocked With Your Report
                </h3>
                <p className="text-xs text-slate-500">
                  Hover over any card to expand — your CIR report includes priority access across all four platforms.
                </p>
              </div>
              <span className="inline-flex items-center self-start sm:self-auto rounded-full bg-[#FBF4EB] border border-[#002C66]/15 px-3 py-1 text-[11px] font-extrabold text-[#002C66]">
                Included Free with CIR
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:h-[195px]">
              {BENEFITS.map((b, idx) => {
                const isExpanded = activeBenefitIdx === idx;
                return (
                  <Link
                    key={b.title}
                    to={b.link}
                    onMouseEnter={() => setActiveBenefitIdx(idx)}
                    onFocus={() => setActiveBenefitIdx(idx)}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between p-4 min-h-[165px] lg:min-h-0 ${
                      isExpanded
                        ? "lg:flex-[2.1] border-[#002C66] shadow-[0_14px_34px_-12px_rgba(0,44,102,0.28)]"
                        : "lg:flex-1 border-[#002C66]/15 opacity-95 hover:opacity-100"
                    }`}
                  >
                    {/* Background Photo */}
                    <img
                      src={b.image}
                      alt={b.title}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Solid Translucent Overlay (compatible with global CSS rule) */}
                    <div
                      className={`absolute inset-0 transition-colors duration-300 ${
                        isExpanded ? "bg-[#002C66]/80" : "bg-[#002C66]/70"
                      }`}
                    />

                    {/* Top Row: Bold Number Badge & Metric Pill */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#002C66] font-display text-xs font-extrabold shadow-xs">
                        {b.num}
                      </span>
                      <span className="rounded-full bg-[#FBF4EB] text-[#002C66] px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide">
                        {b.stat}
                      </span>
                    </div>

                    {/* Bottom Row: Title + Expandable Description */}
                    <div className="relative z-10 mt-auto pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">
                        {b.tag}
                      </p>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h4 className="font-display text-base sm:text-lg font-extrabold text-white leading-snug">
                            {b.title}
                          </h4>
                          {isExpanded && (
                            <p className="text-xs text-white/90 mt-1 max-w-md leading-relaxed line-clamp-2">
                              {b.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold shrink-0 transition-all ${
                            isExpanded
                              ? "bg-white text-[#002C66]"
                              : "bg-white/15 text-white"
                          }`}
                        >
                          Explore <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {beforeCta}

        {/* Compact, High-Contrast CTA Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#002C66] px-6 py-5 text-white shadow-[0_16px_40px_-15px_rgba(0,44,102,0.3)]">
          <div className="text-center sm:text-left">
            <p className="text-base sm:text-lg font-extrabold font-display">
              Ready to unlock your complete 8-module Career Intelligence Report?
            </p>
            <p className="text-xs sm:text-sm text-white/80 mt-0.5">
              One-time payment · Instant 24-hr report delivery · Verified by I Am Talento
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#002C66] hover:bg-[#FBF4EB] gap-2 font-extrabold h-12 px-7 rounded-xl text-sm sm:text-base shrink-0 shadow-sm"
          >
            <Link to="/assessments/digital-marketing-fundamentals">
              Get My Career Report — ₹1,999 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareerIntelligencePackageSection;
