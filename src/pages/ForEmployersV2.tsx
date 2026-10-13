import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  Video,
  Cable,
  PaintBucket,
  FileUp,
  Wand2,
  Crosshair,
  Library,
  Bot,
  ClipboardList,
  Target,
  TrendingUp,
  Zap,
  Building2,
  Award,
  UserCheck,
  Send,
  Filter,
  FileText,
  AlertTriangle,
  ChevronDown,
  BrainCircuit,
  Gauge,
  ListChecks,
  Check,
  Code2,
  Heart,
  GraduationCap,
  Headphones,
  FileBarChart,
  Download,
  Layers,
  Brain,
  MessageSquare,
  Briefcase,
  PieChart,
  LayoutDashboard,
  Shield,
  Lock,
  Eye,
  FileCheck,
  ScanEye,
  CircleSlash,
  ClipboardPaste,
  MonitorOff,
  Webcam,
  Fingerprint,
  SearchCode,
  ScanFace,
  Keyboard,
  Smartphone,
  MonitorCheck,
  Volume2,
  Activity,
  ScreenShare,
  Globe,
  Cpu,
  BotOff,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import ReviewsMarquee from "@/components/landing/ReviewsMarquee";
import SkillCategoriesSection from "@/components/landing/SkillCategoriesSection";

/* ═══════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════ */
const EmployerHero = () => (
  <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-background">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[80px]" />
    </div>
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6 border border-primary/10"
          >
            <Building2 className="h-3.5 w-3.5" />
            For Employers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display leading-[1.08] mb-6 tracking-tight"
          >
            Stop Guessing.{" "}
            <br />
            Start Hiring on{" "}
            <span className="text-primary">Proof.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
          >
            AI-powered Industry Readiness and skills-validation platform with pre-verified candidates,
            30-layer proctored assessments, and objective AI reports — so you
            hire job-ready talent 3× faster, with 99% proctoring accuracy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <Link to="/contact">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2 h-12 px-7"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-7 gap-2 border-border"
              >
                Talk to Sales
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-6 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" /> 500+ Companies
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> 10,000+
              Candidates Assessed
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> SOC 2 · ISO 27001 · GDPR · EEOC
            </span>
          </motion.div>
        </div>

        {/* Right — Dashboard Preview Mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative hidden md:block"
        >
          <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="bg-secondary/50 px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/30" />
                <div className="w-3 h-3 rounded-full bg-primary-glow/30" />
                <div className="w-3 h-3 rounded-full bg-muted" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-medium">
                AI-Ranked Candidates Ready
              </span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: "Priya Menon", score: 94, role: "Full Stack Engineer", status: "Excellent" },
                { name: "Arjun Das", score: 87, role: "Backend Developer", status: "Strong" },
                { name: "Sara Khan", score: 82, role: "Data Analyst", status: "Good" },
                { name: "Rahul Verma", score: 76, role: "DevOps Engineer", status: "Average" },
              ].map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/40 border border-border/50"
                >
                  <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-primary font-display">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold font-display truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold font-display text-primary">{c.score}</p>
                    <p className={cn("text-[10px] font-medium", c.score >= 90 ? "text-success" : c.score >= 80 ? "text-primary-glow" : "text-muted-foreground")}>
                      {c.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   2A. EMPLOYER SOCIAL PROOF BAR (B2B)
   ═══════════════════════════════════════════ */
const companyLogos = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png" },
  { name: "TCS", logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1720244494" },
  { name: "Capgemini", logo: "https://companieslogo.com/img/orig/CAP.PA-9b4110b0.png?t=1720244491" },
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png" },
];
const marqueeLogos = [...companyLogos, ...companyLogos];

const EmployerSocialProofBar = () => (
  <section className="pt-8 md:pt-12 pb-16 md:pb-20 border-b border-border/50 bg-card/30 relative overflow-hidden">
    <div className="container px-4 md:px-6 mb-10">
      <motion.h3
        className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-display tracking-tight mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Trusted by Hiring Leaders Worldwide
      </motion.h3>
      <motion.p
        className="text-center text-xs sm:text-sm md:text-base text-muted-foreground mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Leading employers rely on IAmTalento for skills-first, proctored hiring at scale.
      </motion.p>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 md:gap-14 mb-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-primary" />
            <p className="text-xl md:text-3xl font-bold font-display">500+</p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Companies Hiring</p>
        </div>

        <div className="h-10 w-px bg-border hidden sm:block" />

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-xl md:text-3xl font-bold font-display">10,000+</p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Candidates Screened</p>
        </div>

        <div className="h-10 w-px bg-border hidden sm:block" />

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="text-xl md:text-3xl font-bold font-display">99%</p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Proctoring Accuracy</p>
        </div>
      </div>
    </div>

    {/* Logo Marquee */}
    <div className="overflow-hidden relative mt-8 md:mt-16">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex w-max gap-10 md:gap-16 px-8 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {marqueeLogos.map((company, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-10 md:h-14 w-28 md:w-40 shrink-0 opacity-70 hover:opacity-100 transition-all duration-500"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="max-h-7 md:max-h-10 max-w-full object-contain dark:brightness-0 dark:invert"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   2B. WHO IT'S FOR — ICP Persona Cards
   ═══════════════════════════════════════════ */
const personas = [
  {
    icon: Users,
    title: "CHRO / Head of Talent",
    desc: "Standardize skills-first hiring across business units. Replace subjective interviews with objective, benchmarked assessments.",
  },
  {
    icon: Code2,
    title: "Startup Founder / CTO",
    desc: "Hire engineers and builders using real work simulations. Stop guessing from résumés — see candidates solve real problems.",
  },
  {
    icon: GraduationCap,
    title: "Campus / Fresher Programs",
    desc: "Run cheat-proof assessments across thousands of candidates fast. Screen an entire campus in 48 hours with zero cheating.",
  },
  {
    icon: Headphones,
    title: "Operations / BPO Leaders",
    desc: "Verify communication, compliance, and trainability at scale. Reduce early attrition with pre-validated hires.",
  },
];

const WhoItsForSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Ideal Customer Profiles
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Built for Hiring Leaders<br />
              <span className="text-primary">Another Bad Hire</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="block">Support teams making critical hiring decisions.</span>
            <span className="block">Replace promises with proof.</span>
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {personas.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold font-display mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   3. PROBLEM VS SOLUTION — Two-Column Accordion
   ═══════════════════════════════════════════ */
const employerProblems = [
  {
    icon: FileText,
    title: "Résumés Exaggerate, Interviews Miss the Mark",
    bullets: [
      "70% of candidates embellish their CVs — you can't tell until onboarding.",
      "Structured interviews catch only surface-level competence.",
      "Hiring decisions rely on impressions, not evidence.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Remote Assessments Are Easy to Cheat",
    bullets: [
      "Screen-sharing, second devices, and AI-generated answers are rampant.",
      "Basic proctoring catches less than 30% of cheating attempts.",
      "Your team can't trust the scores they're reviewing.",
    ],
  },
  {
    icon: Clock,
    title: "Recruiters Waste Hours Screening, Not Closing",
    bullets: [
      "Manual resume screening takes 23+ hours per role.",
      "80% of applications are irrelevant or under-qualified.",
      "Your recruiters spend time filtering, not selling your company.",
    ],
  },
  {
    icon: TrendingUp,
    title: "Bad Hires Cost 8–10× Their Salary",
    bullets: [
      "Average cost-per-bad-hire exceeds ₹8.4 Lakhs in India.",
      "Failed onboarding, ramp-up delays, and team disruption compound losses.",
      "67% of employers have made a bad hire due to poor screening.",
    ],
  },
  {
    icon: BarChart3,
    title: "No Objective Benchmarking Across Candidates",
    bullets: [
      "No standardized skill scoring across roles or locations.",
      "No cross-candidate comparability for hiring managers.",
      "No measurable readiness index to predict on-the-job success.",
    ],
  },
];

const employerSolutions = [
  {
    icon: UserCheck,
    title: "Pre-Verified, Skill-Tested Candidates",
    bullets: [
      "Every candidate simulation-tested before you see them.",
      "Role-specific competency scores ranked by Industry Readiness.",
      "No more guesswork — only evidence-backed shortlists.",
    ],
  },
  {
    icon: Target,
    title: "Real-World Task Assessments, Not Trivia",
    bullets: [
      "Practical, job-based challenges that mirror real work.",
      "Scenario-driven evaluations across tech, ops, and business roles.",
      "Standardized scoring models for fair, repeatable results.",
    ],
  },
  {
    icon: Gauge,
    title: "Objective Skill Benchmarking & AI Reports",
    bullets: [
      "Industry Readiness Scores benchmarked against thousands of professionals.",
      "Skill-to-role match percentage with strengths and risk indicators.",
      "Exportable PDF reports for every candidate.",
    ],
  },
  {
    icon: Zap,
    title: "75% Faster Screening, Zero Manual Grunt Work",
    bullets: [
      "AI auto-scores and ranks candidates instantly.",
      "Smart shortlists filter by score, role-fit, and integrity.",
      "Your recruiters focus on closing, not filtering.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "30-Layer Proctoring — Every Score Is Earned",
    bullets: [
      "AI identity verification, browser lockdown, and behavioral monitoring.",
      "Integrity score alongside every skill score.",
      "Zero tolerance for cheating — your hiring team sees only real results.",
    ],
  },
];

const ProblemVsSolutionSection = () => {
  const [openProblem, setOpenProblem] = useState<number | null>(null);
  const [openSolution, setOpenSolution] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background relative">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className={cn(
          "grid md:grid-cols-2 gap-8 md:gap-10 mb-16 transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0 translate-y-6"
        )}>
          {/* THE PROBLEM */}
          <div className="space-y-3">
            <div className="text-center md:text-left mb-6">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-destructive bg-destructive/10 px-3 py-1.5 rounded-full border border-destructive/20 mb-4">
                The Problem
              </p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15]">
                Hiring Feels Slow<br />
                  <span className="text-primary">And Uncertain</span>
              </h2>
            </div>
            {employerProblems.map(({ icon: Icon, title, bullets }, i) => {
              const isOpen = openProblem === i;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={cn(
                    "rounded-xl bg-card border transition-all duration-300",
                    isOpen ? "border-destructive/30 shadow-md" : "border-border/50"
                  )}
                >
                  <button
                    onClick={() => setOpenProblem(isOpen ? null : i)}
                    className="flex items-center gap-3 p-4 w-full text-left"
                  >
                    <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="flex-1 text-sm font-bold text-foreground">{title}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className={cn("h-4 w-4 transition-colors", isOpen ? "text-destructive" : "text-muted-foreground/40")} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <ul className="px-4 pb-4 space-y-1.5">
                          {bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                              <span className="text-destructive mt-0.5">•</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* THE SOLUTION */}
          <div className="space-y-3">
            <div className="text-center md:text-left mb-6">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 mb-4">
                The Solution
              </p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15]">
                Build Structured Hiring<br />
                  <span className="text-primary">Based on Performance</span>
              </h2>
            </div>
            {employerSolutions.map(({ icon: Icon, title, bullets }, i) => {
              const isOpen = openSolution === i;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={cn(
                    "rounded-xl border cursor-pointer transition-all duration-300",
                    isOpen
                      ? "bg-primary/5 border-primary/30 shadow-md"
                      : "bg-card border-border/50"
                  )}
                  onClick={() => setOpenSolution(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300", isOpen ? "bg-primary" : "bg-primary/10")}>
                      <Icon className={cn("h-4 w-4 transition-colors", isOpen ? "text-primary-foreground" : "text-primary")} />
                    </div>
                    <span className={cn("flex-1 text-sm font-bold transition-colors", isOpen ? "text-primary" : "text-foreground")}>
                      {title}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className={cn("h-4 w-4 transition-colors", isOpen ? "text-primary" : "text-muted-foreground/40")} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <ul className="px-4 pb-4 space-y-1.5">
                          {bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                              <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center max-w-3xl mx-auto"
        >
          <p className="text-sm sm:text-base md:text-lg font-semibold font-display text-foreground italic leading-relaxed">
            "You're asked to hire faster and cheaper — IAmTalento gives you the proof to do both."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   5. HOW IT WORKS — 4 Steps
   ═══════════════════════════════════════════ */
const howItWorksSteps = [
  {
    icon: FileText,
    title: "Set Up in Minutes",
    desc: "Create your account, pick a role, or paste your job description. AI builds the right assessment.",
  },
  {
    icon: Send,
    title: "Assess with 30-Layer Proctoring",
    desc: "Invite candidates. They take secure assessments with AI identity, device, and environment checks.",
  },
  {
    icon: BarChart3,
    title: "Rank & Compare Instantly",
    desc: "AI scores and benchmarks candidates. You see top performers at a glance.",
  },
  {
    icon: Award,
    title: "Interview & Hire with Confidence",
    desc: "Run structured, insight-led interviews and make data-backed offers.",
  },
];

const HowItWorksSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            How It Works
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Move From Role to Offer<br />
              <span className="text-primary">In Four Clear Steps</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="block">Remove delays and uncertainty from hiring.</span>
            <span className="block">Make every decision clearer.</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {howItWorksSteps.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center group"
            >
              <p className="text-base font-bold text-primary mb-4">
                Step {i + 1}
              </p>
              <div className="relative mx-auto mb-6">
                <div
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: "hsl(33 100% 95%)",
                    border: "1px solid hsl(33 100% 80%)",
                  }}
                >
                  <Icon className="h-9 w-9 sm:h-11 sm:w-11 text-primary" />
                </div>
              </div>
              <p className="text-base sm:text-lg font-semibold font-display mb-2">
                {title}
              </p>
              <p className="text-sm text-muted-foreground leading-snug">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/contact">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              Start Screening Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   6A. EMPLOYER INTEGRITY SECTION (B2B Proctoring)
   ═══════════════════════════════════════════ */
const integrityPhases = [
  {
    title: "Identity Verification",
    subtitle: "Before Assessment",
    icon: UserCheck,
    items: [
      { icon: ScanFace, title: "Biometric Face Matching" },
      { icon: Fingerprint, title: "Government ID Verification (Aadhaar & PAN)" },
      { icon: Shield, title: "Multi-Factor Authentication (Email & Phone OTP)" },
      { icon: Webcam, title: "Live Photo Capture at Session Start" },
    ],
  },
  {
    title: "Behavioral Monitoring",
    subtitle: "During Assessment",
    icon: MonitorCheck,
    items: [
      { icon: Eye, title: "Webcam Eye Tracking & Gaze Detection" },
      { icon: ScanEye, title: "Multiple Face Detection" },
      { icon: Volume2, title: "Audio Monitoring & Voice Detection" },
      { icon: AlertTriangle, title: "Suspicious Movement Alerts" },
      { icon: Activity, title: "Session Interruption Detection" },
      { icon: Brain, title: "Unusual Behavior Pattern Analysis" },
    ],
  },
  {
    title: "Environment Security",
    subtitle: "During Assessment",
    icon: ScreenShare,
    items: [
      { icon: CircleSlash, title: "Tab Switch Detection" },
      { icon: ClipboardPaste, title: "Copy-Paste Detection" },
      { icon: MonitorOff, title: "Screenshot & Screen Recording Block" },
      { icon: Cpu, title: "Virtual Machine & Emulator Detection" },
      { icon: Globe, title: "IP Address Tracking & Geolocation" },
      { icon: Smartphone, title: "Device Fingerprinting" },
    ],
  },
  {
    title: "AI & Integrity Analysis",
    subtitle: "Post Assessment",
    icon: LayoutDashboard,
    items: [
      { icon: BotOff, title: "AI & ChatGPT Detection" },
      { icon: SearchCode, title: "Plagiarism Detection" },
      { icon: FileCheck, title: "Google Search & External Tool Monitoring" },
      { icon: Keyboard, title: "Code Playback & Keystroke Logging" },
    ],
  },
];

const EmployerIntegritySection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section ref={ref} className="py-28 bg-background relative overflow-hidden">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-20 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4 border border-primary/10">
            <Shield className="h-3.5 w-3.5" /> 30-Layer Hiring Integrity Stack
          </div>
          <motion.h2
            className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            30 Layers of Integrity. Zero Tolerance for Cheating.
          </motion.h2>
          <p className="text-sm sm:text-base text-muted-foreground lg:text-lg">Beyond basic webcam checks — a full integrity stack that protects every assessment your candidates take.</p>
        </div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border">
            <motion.div
              className="w-full gradient-primary origin-top"
              style={{ scaleY: scrollYProgress, height: "100%" }}
            />
          </div>

          {integrityPhases.map((phase, pi) => {
            const PhaseIcon = phase.icon;
            return (
              <div key={phase.title} className="relative mb-20 last:mb-0 pl-16 md:pl-20">
                <motion.div
                  className="absolute left-3 md:left-5 top-0 z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: pi * 0.15 }}
                >
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                    <PhaseIcon className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: pi * 0.1 }}
                  className="mb-6"
                >
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">{phase.subtitle}</span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display mt-1 mb-2">{phase.title}</h3>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {phase.items.map(({ icon: Icon, title }, i) => (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -2 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:gradient-primary transition-all duration-300">
                        <Icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm sm:text-base font-semibold font-display mt-16"
        >
          So every score your hiring team sees is actually earned, not engineered.
        </motion.p>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   6B. EMPLOYER COMPLIANCE SECTION (B2B)
   ═══════════════════════════════════════════ */
const employerCompliancePoints = [
  { icon: Shield, title: "GDPR-Ready Framework", desc: "Full compliance with data protection standards for candidate PII and assessment records.", badge: "GDPR" },
  { icon: Lock, title: "Data Privacy Compliance", desc: "End-to-end encryption for all candidate data, scores, and hiring reports.", badge: "SOC 2" },
  { icon: FileCheck, title: "Secure Assessment Storage", desc: "All assessment sessions, proctoring footage, and results encrypted at rest and in transit.", badge: "ISO" },
  { icon: Brain, title: "Ethical AI Usage", desc: "Transparent, bias-audited AI scoring models that meet EEOC and equal opportunity standards.", badge: "AI" },
  { icon: Eye, title: "Transparent Recording Policy", desc: "Clear candidate disclosure of all monitoring, recording, and data retention practices.", badge: "Policy" },
];

const EmployerComplianceSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-24 bg-card/30">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-12 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4 border border-primary/10">
            <Shield className="h-3.5 w-3.5" /> Employer Data Protection
          </div>
          <motion.h2
            className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Candidate Data. Our Responsibility.
          </motion.h2>
          <p className="text-sm sm:text-base text-muted-foreground lg:text-lg">Enterprise-grade protection for every assessment, candidate record, and hiring decision — because your compliance is non-negotiable.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {employerCompliancePoints.map(({ icon: Icon, title, desc, badge }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-center group relative"
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full gradient-primary text-[8px] font-bold text-primary-foreground">
                {badge}
              </div>
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3 group-hover:gradient-primary transition-all duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold font-display mb-1.5">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <CheckCircle className="h-3 w-3 text-primary" />
                <span className="text-[9px] text-primary font-medium">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   7. TALENT INTELLIGENCE & SCORING
   ═══════════════════════════════════════════ */
const scoreBullets = [
  "Scores benchmark candidates against role-specific standards and previous hires.",
  "Heatmaps show strengths, risks, and trainability.",
  "Team dashboards help CHROs spot patterns across roles, locations, and cohorts.",
  "Exportable PDF reports for every candidate.",
];

const ScoreTrustSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-14 items-center transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              Talent Intelligence
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-6">
              Use Industry Readiness Scores<br />
                <span className="text-primary">To Predict Performance</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
            <span className="block">Turn test results into hiring decisions.</span>
            <span className="block">Predict job-ready performance.</span>
          </p>
            <div className="space-y-3 mb-8">
              {scoreBullets.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{b}</span>
                </div>
              ))}
            </div>
            <Link to="/assessments">
              <Button className="w-full sm:w-auto bg-primary-glow text-white hover:bg-primary-glow/90 gap-2">
                Explore Assessments <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Score Orb */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(13,92,178,0.08) 0%, transparent 70%)",
                    transform: "scale(1.3)",
                  }}
                />
                <div
                  className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(32px) saturate(200%)",
                    border: "1px solid rgba(255,255,255,1)",
                    boxShadow:
                      "0 30px 80px rgba(13,92,178,0.12), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <defs>
                      <linearGradient
                        id="employerArcGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#0d5cb2" />
                        <stop offset="100%" stopColor="#FF8C01" />
                      </linearGradient>
                      <filter id="employerArcGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#93c5fd"
                      strokeWidth="0.8"
                      strokeOpacity="0.4"
                      strokeDasharray="4 3"
                      animate={{ rotate: -360 }}
                      style={{ transformOrigin: "50px 50px" }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(13,92,178,0.1)"
                      strokeWidth="3.5"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#employerArcGrad)"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45 * 0.94} ${2 * Math.PI * 45}`}
                      initial={{
                        strokeDasharray: `0 ${2 * Math.PI * 45}`,
                      }}
                      whileInView={{
                        strokeDasharray: `${2 * Math.PI * 45 * 0.94} ${2 * Math.PI * 45}`,
                      }}
                      transition={{
                        duration: 2.5,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                      viewport={{ once: true }}
                      filter="url(#employerArcGlow)"
                    />
                  </svg>
                  <div className="relative text-center z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.9,
                        type: "spring",
                        stiffness: 220,
                      }}
                      className="flex items-end justify-center leading-none"
                    >
                      <span
                        className="text-5xl sm:text-6xl md:text-[80px] font-bold tracking-tight leading-none"
                        style={{
                          color: "#0f0f1a",
                          fontFamily: "'Space Grotesk',sans-serif",
                        }}
                      >
                        94
                      </span>
                      <span
                        className="text-lg sm:text-xl md:text-2xl font-light mb-2 md:mb-3 ml-1"
                        style={{ color: "#9ca3af" }}
                      >
                        /100
                      </span>
                    </motion.div>
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] font-semibold"
                      style={{ color: "#0d5cb2" }}
                    >
                      Candidate Score
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Candidate card below orb */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 1.0,
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                }}
                className="w-full mt-5 rounded-2xl overflow-hidden max-w-xs"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(13,92,178,0.12)",
                  boxShadow:
                    "0 12px 40px rgba(13,92,178,0.08), 0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-lg font-bold text-primary font-display">
                    P
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p
                        className="text-sm font-bold"
                        style={{ color: "#0f0f1a" }}
                      >
                        Priya Menon
                      </p>
                      <span
                        className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(5,150,105,0.1)",
                          color: "#059669",
                        }}
                      >
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full Stack Engineer · 5 yrs
                    </p>
                  </div>
                </div>
                <div
                  className="grid grid-cols-3 divide-x divide-border"
                  style={{
                    borderTop: "1px solid rgba(13,92,178,0.08)",
                  }}
                >
                  {[
                    { label: "Rank", value: "Top 6%" },
                    { label: "Integrity", value: "98%" },
                    { label: "Hire Signal", value: "Strong" },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-3 py-2.5 text-center">
                      <p
                        className="text-xs font-bold"
                        style={{ color: "#0f0f1a" }}
                      >
                        {value}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Score breakdown pills */}
              <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-xs">
                {[
                  { label: "React & TS", score: 96, color: "#0d5cb2" },
                  { label: "System Design", score: 91, color: "#FF8C01" },
                  { label: "Problem Solving", score: 93, color: "#0d5cb2" },
                  { label: "Communication", score: 88, color: "#FF8C01" },
                ].map(({ label, score, color }) => (
                  <div
                    key={label}
                    className="px-3 py-2 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid #f0dada",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-medium text-muted-foreground">
                        {label}
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color }}
                      >
                        {score}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${score}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   8. PLATFORM CAPABILITIES
   ═══════════════════════════════════════════ */
const featureGroups = [
  {
    tab: "Design & Deliver",
    features: [
      { icon: Wand2, title: "AI Assessment Builder", desc: "Paste a JD and AI generates a role-specific assessment in seconds." },
      { icon: Library, title: "Pre-built Assessment Library", desc: "200+ ready-made assessments across tech, finance, marketing, and more." },
      { icon: ClipboardList, title: "Custom Questions", desc: "Add your own questions, scenarios, and scoring rubrics." },
      { icon: PaintBucket, title: "Custom Branding", desc: "White-label the entire experience with your logo, colors, and domain." },
    ],
    mockup: "assessment-builder",
  },
  {
    tab: "Screen & Select",
    features: [
      { icon: ShieldCheck, title: "Proctored Assessments", desc: "30-layer proctoring ensures every test is genuine and cheat-proof." },
      { icon: Video, title: "Video Interviews", desc: "Live and async video interviews with AI sentiment scoring." },
      { icon: Cable, title: "ATS Integrations", desc: "Plug into Greenhouse, Lever, Workday, BambooHR, and 40+ others." },
      { icon: Filter, title: "Smart Shortlists", desc: "Auto-rank and filter candidates by score, role-fit, and integrity." },
    ],
    mockup: "library",
  },
  {
    tab: "Decide & Report",
    features: [
      { icon: FileBarChart, title: "AI Reports", desc: "Granular breakdowns of skills, behavior, integrity, and recommendations." },
      { icon: Target, title: "Benchmarks & Job-Fit Scores", desc: "Compare candidates against role-specific standards and previous hires." },
      { icon: Download, title: "Exportable PDFs", desc: "Download detailed candidate reports for stakeholders and records." },
      { icon: FileText, title: "Audit Trails", desc: "Complete, tamper-proof logs for compliance and governance." },
    ],
    mockup: "reports",
  },
];

const AssessmentBuilderMockup = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-3 mb-2">
      <motion.div
        className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"
        animate={{ rotate: [0, -10, 10, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      >
        <Wand2 className="h-5 w-5 text-primary" />
      </motion.div>
      <div className="flex-1">
        <p className="text-xs font-semibold">Generating Assessment...</p>
        <motion.div className="h-1.5 rounded-full bg-secondary mt-1 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>
      </div>
    </div>
    {["System Design", "API Architecture", "Data Modeling"].map((q, i) => (
      <motion.div
        key={q}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + i * 0.3, duration: 0.4 }}
        className="p-2.5 rounded-lg bg-secondary/40 border border-border/30 flex items-center gap-2"
      >
        <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-3 w-3 text-primary" />
        </div>
        <span className="text-[11px]">{q}</span>
        <span className="ml-auto text-[9px] text-muted-foreground">
          {["Hard", "Medium", "Hard"][i]}
        </span>
      </motion.div>
    ))}
  </div>
);

const LibraryMockup = () => (
  <div className="grid grid-cols-2 gap-2">
    {["React", "Python", "SQL", "DevOps", "Finance", "Marketing"].map(
      (cat, i) => (
        <motion.div
          key={cat}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-2 rounded-lg bg-secondary/40 border border-border/30 text-center"
        >
          <p className="text-[10px] font-semibold">{cat}</p>
          <p className="text-[9px] text-muted-foreground">
            {[24, 18, 15, 12, 20, 16][i]} tests
          </p>
        </motion.div>
      )
    )}
  </div>
);

const ReportsMockup = () => (
  <div className="space-y-2">
    {[
      { label: "Technical", score: 92 },
      { label: "Communication", score: 85 },
      { label: "Problem Solving", score: 88 },
    ].map((s, i) => (
      <div key={s.label}>
        <div className="flex justify-between text-[10px] mb-0.5">
          <span>{s.label}</span>
          <span className="font-bold text-primary">{s.score}</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${s.score}%` }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}
          />
        </div>
      </div>
    ))}
  </div>
);

const mockupMap: Record<string, React.ReactNode> = {
  "assessment-builder": <AssessmentBuilderMockup />,
  library: <LibraryMockup />,
  reports: <ReportsMockup />,
};

const PlatformCapabilitiesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const group = featureGroups[activeTab];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Platform Capabilities
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Everything for Skills-First<br />
              <span className="text-primary">Hiring in One Place</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            <span className="block">Bring every hiring tool into one place.</span>
            <span className="block">Build skills-first teams.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            So your team can design, deliver, screen, and decide — without the manual grunt work.
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mb-10 flex-wrap">
          {featureGroups.map(({ tab }, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border",
                activeTab === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {group.features.map(({ icon: FIcon, title, desc }) => (
                <div
                  key={title}
                  className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-display mb-1">
                        {title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-border/50 shadow-xl overflow-hidden bg-card"
            >
              <div className="h-10 bg-secondary/50 border-b border-border/30 flex items-center px-4 gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary/30" />
                <div className="flex-1 h-4 rounded bg-secondary mx-8" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display">
                      {group.tab}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Live preview
                    </p>
                  </div>
                </div>
                <div className="min-h-[200px]">
                  {mockupMap[group.mockup]}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   9. ASSESSMENT COVERAGE
   ═══════════════════════════════════════════ */
const assessmentCategories = [
  { icon: Code2, title: "Technical Skills", desc: "Coding, system design, architecture, and debugging." },
  { icon: Layers, title: "Hard Skills", desc: "Domain-specific knowledge, tools, and frameworks." },
  { icon: MessageSquare, title: "Soft Skills", desc: "Communication, leadership, collaboration, and adaptability." },
  { icon: Bot, title: "AI Proficiency", desc: "Prompt engineering, AI tools, and automation fluency." },
  { icon: BrainCircuit, title: "Cognitive Ability", desc: "Logical reasoning, problem-solving, and critical thinking." },
  { icon: Briefcase, title: "Role-Specific", desc: "Custom scenarios mirroring real on-the-job challenges." },
];

const AssessmentCoverageSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Assessment Coverage
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Test Skills That Matter<br />
              <span className="text-primary">Most for the Job</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="block">Test the skills each role truly requires.</span>
            <span className="block">Focus on job-ready ability.</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {assessmentCategories.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-default"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-colors duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold font-display mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   10. EMPLOYER DASHBOARD
   ═══════════════════════════════════════════ */
const dashboardBullets = [
  { icon: PieChart, text: "See live pipelines, scores, and statuses across all roles at a glance." },
  { icon: BarChart3, text: "Compare candidates by Industry Readiness Score, skills, and integrity in seconds." },
  { icon: TrendingUp, text: "Track time-to-shortlist, pass rates, and skill gaps by cohort." },
];

const EmployerDashboardSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-14 items-center transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              Employer Dashboard
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-6">
              Manage Hiring Signals<br />
                <span className="text-primary">In One Dashboard</span>
            </h2>
            <div className="space-y-4 mb-8">
              {dashboardBullets.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1.5">{text}</p>
                </div>
              ))}
            </div>
            <Link to="/contact">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                See the Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="bg-secondary/50 px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/30" />
                <div className="w-3 h-3 rounded-full bg-primary-glow/30" />
                <div className="w-3 h-3 rounded-full bg-muted" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-medium">
                Employer Dashboard
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Active Roles", value: "12" },
                  { label: "Candidates", value: "847" },
                  { label: "Shortlisted", value: "64" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-lg bg-secondary/40 border border-border/30 text-center">
                    <p className="text-lg font-bold font-display text-primary">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { label: "Frontend Engineers", pct: 85, count: "34/40" },
                  { label: "Data Analysts", pct: 62, count: "18/29" },
                  { label: "Product Managers", pct: 45, count: "9/20" },
                ].map(({ label, pct, count }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   11. PRICING & PLANS (prices hidden)
   ═══════════════════════════════════════════ */
const plans = [
  {
    name: "Profiles",
    desc: "Pre-verified talent access for lean teams.",
    bestFor: "Best for startups",
    roi: "Start screening within 24 hours.",
    features: [
      "Browse verified candidate profiles",
      "Industry Readiness Scores & rankings",
      "Skill-level filtering & search",
      "Download candidate reports",
      "Shortlist & compare candidates",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "AI Skill Assessments",
    desc: "Standardized testing across roles.",
    bestFor: "Best for growing teams",
    roi: "Reduce screening time by 75% from day one.",
    features: [
      "Everything in Profiles",
      "Unlimited AI-proctored assessments",
      "200+ pre-built test library",
      "AI auto-scoring & ranking",
      "30-layer anti-cheating proctoring",
      "Video interview recording",
      "40+ ATS integrations",
      "Custom branding",
      "Detailed AI candidate reports",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Custom Tests & Enterprise",
    desc: "Custom frameworks, SSO, SLAs, dedicated success.",
    bestFor: "Best for enterprise HR",
    roi: "Save ₹5L+ per bad hire avoided.",
    features: [
      "Everything in AI Skill Assessments",
      "AI Assessment Builder from JD",
      "Import your own questions & tests",
      "Custom scoring rubrics",
      "Role-specific simulation tasks",
      "Voice originality testing",
      "Dedicated account manager",
      "SSO & SCIM",
      "SLA guarantee",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Pricing
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Choose Plans That Scale With<br />
              <span className="text-primary">Your Hiring Ambitions</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            <span className="block">Review every hiring signal in one view.</span>
            <span className="block">Keep decisions clear and fast.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              className={cn(
                "p-6 rounded-2xl bg-card border transition-all duration-300",
                plan.popular
                  ? "border-primary shadow-xl scale-[1.02] relative"
                  : "border-border/50 hover:border-primary/30 hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold font-display text-lg mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">{plan.desc}</p>
              <p className="text-[10px] text-primary font-semibold mb-4">
                {plan.bestFor}
              </p>
              <div className="mb-4">
                <span className="text-xl font-bold font-display text-foreground">
                  Contact us for pricing
                </span>
              </div>
              <p className="text-xs text-primary-glow font-medium mb-4 italic">
                {plan.roi}
              </p>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button
                  className={cn(
                    "w-full gap-2",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  {plan.popular ? "Request Pricing" : "Talk to Sales"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   12. SOCIAL PROOF & CASE SNAPSHOTS
   ═══════════════════════════════════════════ */
const caseSnapshots = [
  {
    metric: "60%",
    desc: "Reduced time-to-shortlist for a 2,000+ employee IT firm.",
    icon: Clock,
  },
  {
    metric: "40%",
    desc: "Improved quality-of-hire scores for a fast-growing SaaS startup.",
    icon: TrendingUp,
  },
  {
    metric: "5,000",
    desc: "Campus candidates screened in 48 hours with zero cheating incidents.",
    icon: GraduationCap,
  },
];

const SocialProofSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mb-12">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Success Stories
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Move Beyond Hope-Based Hiring<br />
              <span className="text-primary">Build Skills-First Teams</span>
          </h2>
          <p className="text-muted-foreground">
            <span className="block">Replace guesswork with verified evidence.</span>
            <span className="block">Build stronger teams.</span>
          </p>
        </div>
      </div>

      <div className="container mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {caseSnapshots.map(({ metric, desc, icon: Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-card border border-border/50 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold font-display text-primary mb-1">
                {metric}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <ReviewsMarquee />
    </section>
  );
};

/* ═══════════════════════════════════════════
   13. FAQ
   ═══════════════════════════════════════════ */
const faqs = [
  {
    q: "How quickly can I set up my first assessment?",
    a: "Under 15 minutes. Paste your job description and our AI builds a role-specific, proctored assessment instantly. Or choose from 200+ pre-built tests and invite candidates the same day.",
  },
  {
    q: "What ATS platforms do you integrate with?",
    a: "We integrate with 40+ ATS platforms including Greenhouse, Lever, Workday, BambooHR, and more. IAmTalento adds proctored assessments and AI scoring on top of your existing stack — no rip and replace.",
  },
  {
    q: "How does AI proctoring work?",
    a: "Our 30-layer proctoring combines AI identity verification, browser lockdown, audio monitoring, behavioral pattern analysis, and continuous face matching. Every session produces an integrity score alongside the skill score — so you can trust what you see.",
  },
  {
    q: "Can I customize assessments for my specific roles?",
    a: "Absolutely. Use our AI builder to generate assessments from any job description, add your own questions and scoring rubrics, or combine pre-built tests with custom scenarios. Full white-label branding is included.",
  },
  {
    q: "What kind of reports do I get?",
    a: "Detailed AI-generated reports for every candidate covering skill scores, integrity rating, peer benchmarks, strengths, risks, and hire recommendations. Reports are exportable as PDFs and shareable with stakeholders.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Start a free trial and begin screening candidates within 24 hours. No credit card required. You'll have access to pre-built assessments, AI scoring, and candidate reports from day one.",
  },
];

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="pt-12 md:pt-16 pb-20 bg-background border-t border-border/30">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            FAQ
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Questions Hiring Leaders Ask<br />
              <span className="text-primary">Before They Switch</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border/50 rounded-xl overflow-hidden bg-card"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="text-sm font-semibold font-display pr-4">
                  {q}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   14. FINAL CTA
   ═══════════════════════════════════════════ */
const FinalCTA = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-20 md:py-28 bg-card/50">
      <div className="container px-4 md:px-6">
        <div className={cn(
          "relative rounded-3xl bg-primary p-8 md:p-12 lg:p-20 text-center overflow-hidden transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold font-display text-primary-foreground mb-3 leading-tight">
              Turn Every Hire Into a<br /><span className="text-primary-foreground/75">Data-Backed Decision</span>
            </h2>
            <p className="text-primary-foreground/75 text-base md:text-lg max-w-2xl mx-auto mb-2">
            <span className="block">Find answers to common hiring questions.</span>
            <span className="block">Switch with confidence.</span>
          </p>
            <p className="text-primary-foreground/60 max-w-xl mx-auto mb-8 text-xs sm:text-sm md:text-base leading-relaxed">
              Join 500+ companies using IAmTalento to turn every hire into a data-backed decision, not a guess.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Link to="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] gap-2 h-12 md:h-13 px-6 md:px-8 text-sm md:text-base shadow-xl">
                  <Award className="h-5 w-5" /> Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-white/20 text-white hover:bg-white/30 gap-2 h-12 md:h-13 px-6 md:px-8 text-sm md:text-base border border-white/30">
                  Talk to Sales
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-primary-foreground/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> SOC 2 · ISO 27001
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> 500+ Companies
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> 10,000+ Assessed
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> GDPR · EEOC Compliant
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════ */
const ForEmployersV2 = () => (
  <>
    <Helmet>
      <title>For Employers — AI-Powered Hiring & Screening | IAmTalento</title>
      <meta
        name="description"
        content="Stop guessing. Start hiring on proof. AI-powered Industry Readiness platform with pre-verified candidates, 30-layer proctored assessments, and objective skill scores."
      />
      <meta
        property="og:title"
        content="IAmTalento for Employers — Hire Job-Ready Talent 3× Faster"
      />
      <meta
        property="og:description"
        content="AI-powered Industry Readiness platform with 30-layer proctored assessments, auto-scoring, and detailed candidate reports for skills-first hiring."
      />
    </Helmet>
    <Layout>
      <EmployerHero />
      <EmployerSocialProofBar />
      <WhoItsForSection />
      <ProblemVsSolutionSection />
      <HowItWorksSection />
      <SkillCategoriesSection />
      <EmployerIntegritySection />
      <EmployerComplianceSection />
      <ScoreTrustSection />
      <PlatformCapabilitiesSection />
      <AssessmentCoverageSection />
      <EmployerDashboardSection />
      <PricingSection />
      <SocialProofSection />
      <FAQSection />
      <FinalCTA />
    </Layout>
  </>
);

export default ForEmployersV2;
