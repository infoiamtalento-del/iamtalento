import { motion } from "framer-motion";
import {
  UserPlus, FileText, CreditCard, ShieldCheck, FileBarChart, Rocket,
  Star, ChevronRight, PlayCircle, CheckCircle2, Clock,
  ShieldCheck as ShieldIcon, Zap, BarChart3, Award, TrendingUp,
  ArrowRight, Sparkles, Users, Headphones, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionBadge from "@/components/ui/section-badge";

type Step = {
  num: number;
  title: string;
  desc: string;
  why: string;
  icon: typeof UserPlus;
  color: string; // tailwind bg
  ring: string; // tailwind ring/bg for why panel
  text: string; // text color for why heading
};

const steps: Step[] = [
  {
    num: 1,
    title: "Build Your Profile",
    desc: "Create your profile and tell us about your skills, goals, and experience.",
    why: "A strong profile helps us personalize your assessment experience.",
    icon: UserPlus,
    color: "bg-rose-500",
    ring: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    num: 2,
    title: "Choose Your Assessment",
    desc: "Pick the assessment that matches your role and career aspirations.",
    why: "The right test shows the right skills to the right opportunities.",
    icon: FileText,
    color: "bg-orange-500",
    ring: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    num: 3,
    title: "Pay & Schedule",
    desc: "Make a secure payment and choose a date & time that works for you.",
    why: "Flexible scheduling. Hassle-free experience. Your time, your pace.",
    icon: CreditCard,
    color: "bg-violet-500",
    ring: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    num: 4,
    title: "Take the Test",
    desc: "Complete the assessment in a proctored environment with confidence.",
    why: "Our assessments are fair, secure, and designed to reflect real skills.",
    icon: ShieldCheck,
    color: "bg-blue-500",
    ring: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    num: 5,
    title: "Get Your Report",
    desc: "Receive your detailed score report and skill breakdown within 24 hours.",
    why: "Know exactly where you stand and how you can improve.",
    icon: FileBarChart,
    color: "bg-emerald-500",
    ring: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    num: 6,
    title: "Unlock Opportunities",
    desc: "Get discovered by top employers and land opportunities that fit you.",
    why: "Verified skills. More visibility. Better matches. Faster growth.",
    icon: Rocket,
    color: "bg-rose-500",
    ring: "bg-rose-50",
    text: "text-rose-600",
  },
];

const trustItems = [
  { icon: ShieldIcon, label: "Secure & Proctored", desc: "Fair. Transparent. Trusted by 500+ companies.", color: "text-violet-500", bg: "bg-violet-50" },
  { icon: Clock, label: "Quick & Easy", desc: "Complete in less than 60 minutes.", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: BarChart3, label: "Skill-Focused", desc: "Real skills. Real score. Real opportunities.", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Award, label: "Verified & Valued", desc: "Stand out with a score employers trust.", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: TrendingUp, label: "Career Growth", desc: "Better matches. Better roles. Better future.", color: "text-emerald-500", bg: "bg-emerald-50" },
];

const StepCard = ({ step, align }: { step: Step; align: "left" | "right" }) => {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`flex items-stretch gap-3 md:gap-4 ${align === "right" ? "md:ml-auto" : ""}`}
      style={{ maxWidth: 520 }}
    >
      {/* Main card */}
      <div className="flex-1 bg-white border border-border rounded-2xl p-4 md:p-5 shadow-sm flex gap-4 items-start">
        <div className="relative shrink-0">
          <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center shadow-md`}>
            <Icon className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-md ${step.color} text-white text-xs font-bold flex items-center justify-center shadow`}>
            {step.num}
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="font-bold font-display text-base md:text-lg text-foreground mb-1">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
        </div>
      </div>

      {/* Why it matters */}
      <div className={`${step.ring} rounded-2xl p-3 md:p-4 w-[180px] md:w-[210px] shrink-0 flex flex-col justify-center relative`}>
        <div className={`flex items-center gap-1.5 ${step.text} text-xs font-semibold mb-1.5`}>
          <Star className="w-3.5 h-3.5 fill-current" />
          Why it matters?
        </div>
        <p className="text-xs text-foreground/70 leading-relaxed pr-4">{step.why}</p>
        <ChevronRight className={`w-4 h-4 ${step.text} absolute right-2 top-1/2 -translate-y-1/2`} />
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="bg-gradient-to-b from-rose-50/30 to-background py-16 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionBadge label="HOW IT WORKS" icon={PlayCircle} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mt-3 mb-3"
          >
            Your Journey to the Right Opportunity<br />
            <span className="text-primary">Starts Here.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-6"
          >
            Six simple steps to prove your skills, earn trust,
            <br className="hidden md:block" />
            and land your dream role.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link to="/assessments/explore">
              <Button className="rounded-xl px-8 gap-2 h-12 text-sm font-semibold bg-gradient-to-r from-rose-500 to-primary hover:opacity-95 text-white border-0 shadow-lg shadow-rose-500/20">
                Start Your Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Takes less than 60 minutes
            </p>
          </motion.div>
        </div>

        {/* Zigzag journey */}
        <div className="relative max-w-5xl mx-auto">
          {/* Dotted path - decorative, hidden on small screens */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" patternUnits="userSpaceOnUse" width="6" height="6">
                <circle cx="2" cy="2" r="1.2" fill="hsl(var(--primary) / 0.35)" />
              </pattern>
            </defs>
          </svg>

          <div className="flex flex-col gap-6 md:gap-8 relative">
            {steps.map((s, i) => (
              <StepCard key={s.num} step={s} align={i % 2 === 0 ? "left" : "right"} />
            ))}
          </div>
        </div>




        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-r from-rose-50 via-rose-50/70 to-pink-50 border border-rose-100 rounded-2xl p-6 md:p-8 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-rose-100 to-rose-200/60 flex items-center justify-center shrink-0 relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-primary flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <Sparkles className="absolute top-1 right-2 w-3 h-3 text-rose-400" />
              <Sparkles className="absolute bottom-2 left-1 w-3 h-3 text-rose-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold font-display">
                One Step Today.<br />
                <span className="text-primary">A Better Tomorrow.</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your dream role is closer than you think. Take the first step now!
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <Link to="/assessments/explore">
                <Button className="rounded-xl px-6 gap-2 h-11 text-sm font-semibold bg-gradient-to-r from-rose-500 to-primary hover:opacity-95 text-white border-0 shadow-lg shadow-rose-500/20">
                  Start Your Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br ${
                      i === 1 ? "from-rose-300 to-rose-400" : i === 2 ? "from-orange-300 to-orange-400" : "from-violet-300 to-violet-400"
                    }`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">18,731+ professionals</span> already took<br />
                  their first step. Will you be next?
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer strip */}
        <div className="mt-6 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground border-t border-border pt-5">
          <div className="flex items-center justify-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Trusted by 500+ Companies</div>
          <div className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 18,731+ Assessments Completed</div>
          <div className="flex items-center justify-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> High Success Rate</div>
          <div className="flex items-center justify-center gap-2"><Headphones className="w-4 h-4 text-primary" /> 24/7 Support</div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
