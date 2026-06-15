import { motion } from "framer-motion";
import {
  AlertTriangle,
  XCircle,
  UserX,
  GraduationCap,
  Building2,
  Sparkles,
  Target,
  TrendingUp,
  ShieldCheck,
  Users,
  Rocket,
  BadgeCheck,
  Award,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const audiences = [
  {
    icon: UserX,
    accent: "text-primary",
    accentBg: "bg-rose-50",
    accentRing: "ring-rose-100",
    accentLine: "bg-primary",
    tag: "Job Seekers",
    title: "Unseen by the system.",
    line: "Real skills buried under filters. Rejections without feedback. Last CTC defining your worth.",
  },
  {
    icon: GraduationCap,
    accent: "text-orange-500",
    accentBg: "bg-orange-50",
    accentRing: "ring-orange-100",
    accentLine: "bg-orange-500",
    tag: "Students & Freshers",
    title: "No proof. No platform.",
    line: "Grades don't show potential. No way to validate what you know — or where to start.",
  },
  {
    icon: Building2,
    accent: "text-violet-500",
    accentBg: "bg-violet-50",
    accentRing: "ring-violet-100",
    accentLine: "bg-violet-500",
    tag: "Employers",
    title: "Hard to find. Hard to trust.",
    line: "Endless resumes, unverified skills, costly mis-hires. No objective way to compare talent.",
  },
];


const outcomes = [
  { icon: Target, color: "text-primary", bg: "bg-rose-50", stat: "3X", label: "Better Matches" },
  { icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50", stat: "80%", label: "Faster Hiring" },
  { icon: ShieldCheck, color: "text-violet-500", bg: "bg-violet-50", stat: "0", label: "Last CTC Bias" },
  { icon: Users, color: "text-primary", bg: "bg-rose-50", stat: "Higher Quality", label: "Interviews" },
  { icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-50", stat: "Faster Growth", label: "For Everyone" },
];

const ctaFeatures = [
  { icon: Award, label: "Prove your skills.", sub: "Not just your claims." },
  { icon: Users, label: "Stand out to top", sub: "companies." },
  { icon: Zap, label: "Unlock better", sub: "opportunities, faster." },
];

const ProblemSolutionAccordion = () => {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full"
            style={{ color: "#E22C2C", background: "hsl(355 84% 54% / 0.08)" }}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            You're More Than a Resume.
            <br />
            <span className="text-primary">But the System Doesn't See That.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Outdated hiring methods, biased screenings and irrelevant filters are holding back real talent and creating missed opportunities.
          </p>
        </motion.div>

        {/* Three audience columns — minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 border-y border-slate-200/80"
        >
          {audiences.map((a, i) => {
            const Icon = a.icon;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative px-6 md:px-10 py-12 md:py-14"
              >
                {/* number watermark */}
                <span className="absolute top-6 right-6 md:top-8 md:right-8 text-[11px] font-mono tracking-widest text-slate-300">
                  {num} / 03
                </span>

                {/* icon */}
                <div className={`h-12 w-12 rounded-full ${a.accentBg} ring-1 ${a.accentRing} flex items-center justify-center mb-8`}>
                  <Icon className={`h-5 w-5 ${a.accent}`} />
                </div>

                {/* tag */}
                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${a.accent} mb-3`}>
                  {a.tag}
                </p>

                {/* headline */}
                <h3 className="text-[22px] md:text-[26px] font-bold font-display text-slate-900 leading-[1.15] mb-5 max-w-[280px]">
                  {a.title}
                </h3>

                {/* accent line */}
                <span className={`block h-px w-10 ${a.accentLine} mb-5 transition-all duration-500 group-hover:w-20`} />

                {/* single condensed line */}
                <p className="text-[14px] text-slate-500 leading-relaxed max-w-[300px]">
                  {a.line}
                </p>
              </motion.div>
            );
          })}
        </motion.div>


        {/* Outcome — minimal stat row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-8 bg-slate-200" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              The Outcome You Deserve
            </p>
            <span className="h-px w-8 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5">
            {outcomes.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`text-center px-4 py-6 ${i < outcomes.length - 1 ? "md:border-r border-slate-100" : ""}`}
              >
                <p className={`text-3xl md:text-4xl font-bold font-display ${o.color} leading-none`}>
                  {o.stat}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 mt-3">
                  {o.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA — light, minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl bg-rose-50/40 border border-rose-100/80 px-8 md:px-14 py-10 md:py-12"
        >
          <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-10">
            <div className="flex items-center gap-5 flex-1 text-center md:text-left">
              <div className="hidden md:flex h-14 w-14 rounded-full bg-white ring-1 ring-rose-100 items-center justify-center shrink-0">
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                  Verified Badge
                </p>
                <h3 className="text-2xl md:text-[28px] font-bold font-display text-slate-900 leading-tight">
                  Open doors your <span className="text-primary">skills deserve.</span>
                </h3>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <Link to="/assessments">
                <Button className="bg-primary text-white hover:bg-primary/90 font-semibold h-12 px-7 gap-2 rounded-full">
                  Get My Verified Badge <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
                Trusted by 18,731+ professionals
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ProblemSolutionAccordion;
