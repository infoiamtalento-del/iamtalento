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


        {/* Outcome bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl bg-rose-50/60 border border-rose-100 p-10 md:p-12"
        >
          <div className="flex items-center justify-center gap-2 mb-10">
            <h3 className="text-lg md:text-xl font-bold font-display text-slate-900">The Outcome You Deserve</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
            {outcomes.map((o, i) => {
              const Icon = o.icon;
              return (
                <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
                  <div className={`h-12 w-12 rounded-full ${o.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-6 w-6 ${o.color}`} />
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${o.color} font-display leading-tight`}>{o.stat}</p>
                    <p className="text-xs text-slate-600 leading-tight">{o.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, hsl(355 84% 54%) 0%, hsl(355 84% 48%) 100%)" }}
        >
          <div className="px-6 md:px-10 py-7 md:py-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Badge icon + heading */}
            <div className="flex items-center gap-4 lg:flex-1">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0 border border-white/20">
                <BadgeCheck className="h-9 w-9 md:h-11 md:w-11 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-display text-white leading-tight">
                  Get Your Verified Badge.
                </h3>
                <p className="text-base md:text-lg font-bold font-display text-white/95 leading-tight">
                  Open Doors That Skills Deserve.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="flex items-center gap-5 md:gap-6">
              {ctaFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center mb-1.5">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-[11px] text-white font-medium leading-tight">{f.label}</p>
                    <p className="text-[11px] text-white/85 leading-tight">{f.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center lg:items-end gap-2">
              <Link to="/assessments">
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold h-11 px-6 gap-2 shadow-md">
                  Get My Verified Badge <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                <ShieldCheck className="h-3.5 w-3.5" />
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
