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
    iconBg: "bg-rose-50",
    iconColor: "text-primary",
    tag: "For Job Seekers",
    tagColor: "text-primary",
    title: "It's a Struggle to Get Noticed for the Right Reasons",
    points: [
      "Every job application feels like a gamble.",
      "Last CTC is asked every time — and it limits your worth.",
      "Your real skills get buried under irrelevant filters.",
      "Hard to stand out in a sea of unverified profiles.",
      "Rejections with no feedback. No clarity to improve.",
      "Stuck in the same role. No growth. No direction.",
    ],
  },
  {
    icon: GraduationCap,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    tag: "For Students / Freshers",
    tagColor: "text-orange-500",
    title: "No Platform. No Proof. No Opportunity.",
    points: [
      "No proven way to showcase what you truly know.",
      "Grades don't reflect real-world potential.",
      "Lack of industry recognition or validation.",
      'Miss out on opportunities because you\'re "not experienced".',
      "Low confidence. Don't know where you stand.",
      "Unclear path from learning to earning.",
    ],
  },
  {
    icon: Building2,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    tag: "For Employers / Recruiters",
    tagColor: "text-violet-500",
    title: "Hard to Find. Hard to Trust. Hard to Hire.",
    points: [
      "Tons of resumes. Very few relevant candidates.",
      "Unverified skills lead to bad hires.",
      "Manual screening wastes time and resources.",
      "High cost of mis-hire and team inefficiency.",
      "No standard way to objectively compare talent.",
      "Bias, inconsistency and guesswork in hiring.",
    ],
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

        {/* Three audience columns card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-14"
        >
          <div className="grid md:grid-cols-3 gap-12 md:gap-14">
            {audiences.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`h-14 w-14 rounded-full ${a.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-7 w-7 ${a.iconColor}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${a.tagColor} mb-1`}>{a.tag}</p>
                      <h3 className="text-base md:text-lg font-bold font-display text-slate-900 leading-snug">
                        {a.title}
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {a.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-3 text-[13px] text-slate-600 leading-relaxed">
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
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
          className="mt-6 rounded-2xl overflow-hidden relative"
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
