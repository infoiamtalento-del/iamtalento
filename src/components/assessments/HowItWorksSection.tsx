import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  FileText,
  CreditCard,
  ShieldCheck,
  FileBarChart,
  Rocket,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingUp,
  Headphones,
  Check,
  Star,
  Calendar,
  Clock,
  Lock,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

type StepItem = {
  num: number;
  shortLabel: string;
  title: string;
  highlight: string;
  desc: string;
  why: string;
  ctaLabel: string;
  ctaHref: string;
  icon: typeof UserPlus;
};

const steps: StepItem[] = [
  {
    num: 1,
    shortLabel: "Build Your Profile",
    title: "Build Your Profile",
    highlight: "Included with your free candidate account",
    desc: "Create your profile and tell us about your skills, career goals, and work experience.",
    why: "A strong profile helps us personalize your assessment journey and benchmark you against your target role.",
    ctaLabel: "Complete Profile",
    ctaHref: "/profile",
    icon: UserPlus,
  },
  {
    num: 2,
    shortLabel: "Choose Assessment",
    title: "Choose Your Assessment",
    highlight: "4 Mandatory Core + 1 Sub-Domain Track",
    desc: "Pick the industry-vetted assessment that matches your specialization and experience level.",
    why: "The right test validates the exact functional skills top employers filter for.",
    ctaLabel: "Explore Assessments",
    ctaHref: "/assessments/digital-marketing-fundamentals",
    icon: FileText,
  },
  {
    num: 3,
    shortLabel: "Pay & Schedule",
    title: "Pay & Schedule",
    highlight: "Flexible slots • Instant confirmation",
    desc: "Complete a secure checkout and pick an assessment window that fits your schedule.",
    why: "Flexible scheduling and a hassle-free experience — take the test on your time, at your pace.",
    ctaLabel: "Book Your Slot",
    ctaHref: "/assessments/digital-marketing-fundamentals",
    icon: CreditCard,
  },
  {
    num: 4,
    shortLabel: "Take the Test",
    title: "Take the Test",
    highlight: "30-layer AI-proctored environment",
    desc: "Complete real-world case scenarios, practical tasks, and core rounds with confidence.",
    why: "Cheat-proof, market-leading AI proctoring ensures every score is trusted by hiring managers.",
    ctaLabel: "View Test Format",
    ctaHref: "/assessments/digital-marketing-fundamentals",
    icon: ShieldCheck,
  },
  {
    num: 5,
    shortLabel: "Get Your Report",
    title: "Get Your Report",
    highlight: "Verified CIR report within 24 hours",
    desc: "Receive your comprehensive Career Intelligence Report (CIR) and percentile breakdown.",
    why: "Know exactly where you stand across core competencies and domain mastery.",
    ctaLabel: "See Report Preview",
    ctaHref: "/assessments/digital-marketing-fundamentals",
    icon: FileBarChart,
  },
  {
    num: 6,
    shortLabel: "Unlock Opportunities",
    title: "Unlock Opportunities",
    highlight: "Direct visibility to 500+ hiring partners",
    desc: "Share your verified badge and get fast-tracked to interviews with top employers.",
    why: "Verified skills. Higher recruiter trust. Better role matches and faster career growth.",
    ctaLabel: "Explore Matched Roles",
    ctaHref: "/jobs",
    icon: Rocket,
  },
];

const ScoreRing = ({ score, color = "#10b981" }: { score: number; color?: string }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-xs font-extrabold text-slate-900">{score}</span>
    </div>
  );
};

const StepVisualPreview = ({ stepNum }: { stepNum: number }) => {
  if (stepNum === 1) {
    // Matches Screenshot 2 style: Role bar + 3 scored profile match cards with circular gauges
    return (
      <div className="flex h-full flex-col justify-between gap-2.5">
        <div className="flex items-center justify-between rounded-xl bg-slate-100/90 px-4 py-2.5">
          <span className="text-xs font-bold text-slate-900">Digital Marketing Specialist</span>
          <span className="text-[11px] font-semibold text-slate-500">Profile Readiness</span>
        </div>

        {[
          {
            name: "Aarav Sharma",
            starred: true,
            sub: "4 yrs Performance & Growth • Meta, Google Ads, GA4",
            note: "Profile closely matches Senior Growth track",
            score: 95,
            color: "#059669",
            avatarBg: "bg-amber-100 text-amber-800",
            initials: "AS",
          },
          {
            name: "Core Skill Calibration",
            starred: false,
            sub: "Communication, Analytical & Leadership baseline",
            note: "Auto-mapped from work history & portfolio",
            score: 86,
            color: "#059669",
            avatarBg: "bg-[#002C66]/10 text-[#002C66]",
            initials: "CS",
          },
          {
            name: "Role Benchmark Target",
            starred: false,
            sub: "Mid-Senior Marketing • Top 15% target band",
            note: "Ready for proctored verification",
            score: 78,
            color: "#d97706",
            avatarBg: "bg-emerald-100 text-emerald-800",
            initials: "RB",
          },
        ].map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${row.avatarBg}`}
              >
                {row.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-bold text-slate-900">{row.name}</p>
                  {row.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                </div>
                <p className="truncate text-[11px] text-slate-500">{row.sub}</p>
                <p className="truncate text-[10px] text-slate-400">{row.note}</p>
              </div>
            </div>
            <ScoreRing score={row.score} color={row.color} />
          </div>
        ))}
      </div>
    );
  }

  if (stepNum === 2) {
    // Matches Screenshot 1 style: Header + 3 pill counters + 3 vertical cards (1 highlighted emerald)
    return (
      <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <p className="text-sm font-bold text-slate-900">Digital Marketing Fundamentals</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Marketing & Growth • 3 Rounds • 6 Tests
          </p>
        </div>

        <div className="my-2.5 grid grid-cols-3 gap-2">
          <div className="flex items-center justify-between rounded-lg bg-[#002C66]/8 px-2.5 py-1.5">
            <span className="text-[10px] font-bold text-slate-700">Core Tests</span>
            <span className="rounded-full bg-[#002C66] px-1.5 py-0.5 text-[10px] font-bold text-white">4</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#002C66]/8 px-2.5 py-1.5">
            <span className="text-[10px] font-bold text-slate-700">Sub-Domain</span>
            <span className="rounded-full bg-[#002C66] px-1.5 py-0.5 text-[10px] font-bold text-white">1</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#002C66]/8 px-2.5 py-1.5">
            <span className="text-[10px] font-bold text-slate-700">Rounds</span>
            <span className="rounded-full bg-[#002C66] px-1.5 py-0.5 text-[10px] font-bold text-white">3</span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-2.5">
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-2.5">
            <div>
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[10px] font-extrabold text-emerald-800">
                SEO
              </div>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">SEO & Content</p>
            </div>
            <div className="mt-2 border-t border-slate-100 pt-2">
              <p className="text-[9px] uppercase tracking-wider text-slate-400">Format</p>
              <p className="text-[10px] font-bold text-slate-800">60 mins</p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">Curator</p>
              <p className="truncate text-[10px] font-semibold text-slate-700">Ex-Google</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-2.5">
            <div>
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-[10px] font-extrabold text-sky-800">
                BR
              </div>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">Social & Brand</p>
            </div>
            <div className="mt-2 border-t border-slate-100 pt-2">
              <p className="text-[9px] uppercase tracking-wider text-slate-400">Format</p>
              <p className="text-[10px] font-bold text-slate-800">60 mins</p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">Curator</p>
              <p className="truncate text-[10px] font-semibold text-slate-700">Ogilvy Lead</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-emerald-600 p-2.5 text-white shadow-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200 text-[10px] font-extrabold text-slate-900">
                  PM
                </div>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-600">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              </div>
              <p className="text-[11px] font-bold leading-tight">Performance Mktg</p>
            </div>
            <div className="mt-2 border-t border-white/20 pt-2">
              <p className="text-[9px] uppercase tracking-wider text-emerald-100">Bundle</p>
              <p className="text-[10px] font-bold text-white">₹2,999</p>
              <div className="mt-2 rounded-md bg-emerald-700/80 py-1 text-center text-[9px] font-bold">
                Track Selected
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepNum === 3) {
    // Schedule & Instant Checkout card
    return (
      <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <p className="text-xs font-bold text-slate-900">Assessment Slot & Pass</p>
            <p className="text-[11px] text-slate-500">Choose your preferred proctored window</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            <Lock className="h-3 w-3" /> 256-bit Secure
          </span>
        </div>

        <div className="my-3 space-y-2">
          {[
            { day: "Sat, Oct 18", time: "11:00 AM – 12:00 PM IST", status: "Selected Slot", active: true },
            { day: "Sun, Oct 19", time: "04:00 PM – 05:00 PM IST", status: "Available", active: false },
            { day: "Tue, Oct 21", time: "07:00 PM – 08:00 PM IST", status: "Available", active: false },
          ].map((slot) => (
            <div
              key={slot.day}
              className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs ${
                slot.active
                  ? "border-emerald-500 bg-emerald-50/70 text-slate-900"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className={`h-4 w-4 ${slot.active ? "text-emerald-600" : "text-slate-400"}`} />
                <div>
                  <p className="font-bold text-slate-900">{slot.day}</p>
                  <p className="text-[10px] text-slate-500">{slot.time}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  slot.active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {slot.status}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#002C66]/5 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-[#002C66]" /> Instant Reschedule Allowed
          </div>
          <span className="text-xs font-extrabold text-[#002C66]">Confirmed ✓</span>
        </div>
      </div>
    );
  }

  if (stepNum === 4) {
    // Matches Screenshot 3 style: Scenario MCQ card + overlapping practical evaluation box
    return (
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-1">
        <div className="w-[82%] rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
          <p className="mb-2.5 text-xs font-bold leading-snug text-slate-900">
            An upset enterprise client emails about a campaign delay. Your first move?
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50/80 px-3 py-2 text-[11px] font-bold text-slate-900">
              <span>Acknowledge & share revised timeline</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            </div>
            <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-500">
              Explain internal bottleneck first
            </div>
            <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-500">
              Offer an immediate billing discount
            </div>
          </div>
        </div>

        {/* Overlapping practical evaluation window */}
        <div className="ml-auto -mt-6 w-[78%] rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="ml-auto text-[10px] font-semibold text-emerald-700">● AI Proctor Active</span>
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5 font-mono text-[11px] leading-relaxed text-slate-800">
            <p>
              <span className="font-bold text-[#002C66]">calc_roas</span>(revenue, spend):
            </p>
            <p className="pl-3 text-slate-600">cpa = spend / conversions</p>
            <p className="pl-3 text-slate-600">
              roas = <span className="text-emerald-700 font-semibold">round</span>(revenue / spend, 2)
            </p>
            <p className="font-bold text-[#002C66]">return roas, cpa</p>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400">Auto-graded • 30-Layer Integrity</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white">
              <Play className="h-2.5 w-2.5 fill-current" /> Run
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (stepNum === 5) {
    // Matches Screenshot 4 style: Top verification dual-panel + bottom AI Evaluation with 84 ring & bars
    return (
      <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div>
          <p className="mb-2.5 text-xs font-bold text-slate-900">Verified Career Intelligence Report (CIR)</p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center">
              <div className="mx-auto mb-1.5 flex h-12 w-12 items-center justify-center rounded-full bg-[#002C66] text-xs font-extrabold text-white">
                TOP 8%
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Candidate Rank</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-center">
              <div className="mx-auto mb-1.5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-800">CIR Verified Badge</p>
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle
                  cx="30"
                  cy="30"
                  r="24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - 0.88)}
                />
              </svg>
              <div className="absolute text-center">
                <span className="block text-sm font-extrabold text-slate-900 leading-none">88</span>
                <span className="text-[8px] font-semibold text-slate-400">Overall</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-xs font-bold text-slate-900">AI Skill Evaluation</p>
              <div>
                <div className="mb-1 flex justify-between text-[10px] font-semibold text-slate-600">
                  <span>Domain Mastery</span>
                  <span className="font-bold text-slate-900">91</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 w-[91%] rounded-full bg-emerald-600" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[10px] font-semibold text-slate-600">
                  <span>Communication & HR</span>
                  <span className="font-bold text-slate-900">84</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 w-[84%] rounded-full bg-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Employer Pipeline / Fast-Track Offers (Matches Screenshot 1)
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="border-b border-slate-100 pb-3">
        <p className="text-sm font-bold text-slate-900">Senior Growth Marketer</p>
        <p className="mt-0.5 text-[11px] text-slate-500">Bengaluru, IN • ₹18L – ₹26L • Full-time</p>
      </div>

      <div className="my-2.5 grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between rounded-lg bg-slate-100 px-2.5 py-1.5">
          <span className="text-[10px] font-bold text-slate-700">Matched</span>
          <span className="rounded-full bg-[#002C66] px-1.5 py-0.5 text-[10px] font-bold text-white">24</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-100 px-2.5 py-1.5">
          <span className="text-[10px] font-bold text-slate-700">Interviews</span>
          <span className="rounded-full bg-[#002C66] px-1.5 py-0.5 text-[10px] font-bold text-white">6</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-100 px-2.5 py-1.5">
          <span className="text-[10px] font-bold text-slate-700">Offers</span>
          <span className="rounded-full bg-[#002C66] px-1.5 py-0.5 text-[10px] font-bold text-white">2</span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2.5">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-2.5">
          <div>
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[10px] font-extrabold text-emerald-800">
              RZ
            </div>
            <p className="text-[11px] font-bold text-slate-900 leading-tight">Razorpay</p>
          </div>
          <div className="mt-2 border-t border-slate-100 pt-2">
            <p className="text-[9px] uppercase tracking-wider text-slate-400">CIR Match</p>
            <p className="text-[10px] font-bold text-slate-800">94% Fit</p>
            <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">Stage</p>
            <p className="truncate text-[10px] font-semibold text-slate-700">Shortlisted</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-2.5">
          <div>
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-[10px] font-extrabold text-amber-800">
              SW
            </div>
            <p className="text-[11px] font-bold text-slate-900 leading-tight">Swiggy</p>
          </div>
          <div className="mt-2 border-t border-slate-100 pt-2">
            <p className="text-[9px] uppercase tracking-wider text-slate-400">CIR Match</p>
            <p className="text-[10px] font-bold text-slate-800">91% Fit</p>
            <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">Stage</p>
            <p className="truncate text-[10px] font-semibold text-slate-700">Final Round</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl bg-emerald-600 p-2.5 text-white shadow-sm">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200 text-[10px] font-extrabold text-slate-900">
                CR
              </div>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-600">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            </div>
            <p className="text-[11px] font-bold leading-tight">CRED</p>
          </div>
          <div className="mt-2 border-t border-white/20 pt-2">
            <p className="text-[9px] uppercase tracking-wider text-emerald-100">CIR Match</p>
            <p className="text-[10px] font-bold text-white">96% Fit</p>
            <div className="mt-2 rounded-md bg-emerald-700/80 py-1 text-center text-[9px] font-bold">
              Offer accepted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="bg-[#FBF4EB] py-12 md:py-16 overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionBadge label="HOW IT WORKS" icon={PlayCircle} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl lg:text-[42px] font-bold font-display leading-[1.12] mt-3 mb-3 text-slate-900"
          >
            Your Journey to the Right Opportunity.{" "}
            <span className="text-[#002C66]">From Profile to Offer, for Any Role.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-slate-600 text-base md:text-lg"
          >
            Six simple steps to prove your skills, earn recruiter trust, and land your dream role — hover over any step to explore.
          </motion.p>
        </div>

        {/* Horizontal Hover-Expand Accordion */}
        <div
          className="flex flex-col lg:flex-row items-stretch gap-3 lg:h-[430px]"
          role="region"
          aria-label="How Skill Assessments Work"
        >
          {steps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={step.num}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                className={`group relative overflow-hidden rounded-[28px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus-visible:ring-2 focus-visible:ring-[#002C66] ${
                  isActive
                    ? "lg:flex-1 bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,44,102,0.12)] cursor-default"
                    : "lg:w-[76px] xl:w-[84px] shrink-0 bg-[#002C66] hover:bg-[#00204d] text-white cursor-pointer"
                }`}
              >
                {/* Collapsed Pillar View */}
                {!isActive && (
                  <div className="flex h-14 lg:h-full w-full items-center justify-between lg:justify-center px-5 lg:px-0">
                    <span className="lg:hidden text-sm font-bold text-white flex items-center gap-2.5">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-extrabold">
                        0{step.num}
                      </span>
                      {step.title}
                    </span>
                    <span className="lg:hidden text-xs font-semibold text-white/75">Tap to expand</span>

                    <div className="hidden lg:flex h-full w-full flex-col items-center justify-center select-none">
                      <span className="-rotate-90 whitespace-nowrap font-display text-base font-bold tracking-tight text-white">
                        {step.shortLabel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Expanded Panel View */}
                {isActive && (
                  <div className="grid h-full grid-cols-1 md:grid-cols-[1.12fr_1fr] gap-5 md:gap-7 p-4 sm:p-6 md:p-7 items-stretch">
                    {/* Left Preview Mockup Container */}
                    <div className="rounded-2xl border border-slate-200/80 bg-[#FBF4EB]/55 p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden min-h-[290px]">
                      <StepVisualPreview stepNum={step.num} />
                    </div>

                    {/* Right Editorial Copy & CTA */}
                    <div className="flex flex-col justify-between py-1 md:py-2 pr-1">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#002C66]/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#002C66] mb-3">
                          Step 0{step.num} of 06
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                          {step.title}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#F26B5B]">
                          {step.highlight}
                        </p>

                        <p className="mt-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                          {step.desc}
                        </p>

                        <div className="mt-3.5 rounded-xl border border-[#002C66]/12 bg-[#FBF4EB]/70 px-3.5 py-2.5">
                          <p className="text-xs font-bold text-[#002C66] flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 shrink-0" /> Why it matters
                          </p>
                          <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                            {step.why}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-2">
                        <Link
                          to={step.ctaHref}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-2xs transition-all hover:border-[#002C66] hover:bg-[#002C66] hover:text-white"
                        >
                          {step.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer trust strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-medium text-slate-600 border-t border-slate-200/80 pt-5">
          <div className="flex items-center justify-center gap-2">
            <Building2 className="w-4 h-4 text-[#002C66]" /> Trusted by 500+ Companies
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#002C66]" /> 18,731+ Assessments Completed
          </div>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#002C66]" /> High Employer Shortlist Rate
          </div>
          <div className="flex items-center justify-center gap-2">
            <Headphones className="w-4 h-4 text-[#002C66]" /> 24/7 Candidate Support
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
