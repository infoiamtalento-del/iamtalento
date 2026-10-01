import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Earth,
  Bot,
  Mic2,
  ClipboardList,
  Target,
  TrendingUp,
  Zap,
  Building2,
  Award,
  BadgeCheck,
  UserCheck,
  Search,
  Send,
  Filter,
  FileText,
  Eye,
  Lock,
  Fingerprint,
  Camera,
  Wifi,
  AlertTriangle,
  ChevronDown,
  Monitor,
  BrainCircuit,
  MessagesSquare,
  Gauge,
  ListChecks,
  Star,
  Check,
  Code2,
  Heart,
  Cpu,
  Landmark,
  GraduationCap,
  Palette,
  ShoppingCart,
  Home,
  Truck,
  Megaphone,
  ScanFace,
  Shield,
  Volume2,
  Activity,
  ClipboardPaste,
  ScreenShare,
  Globe,
  Smartphone,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import SocialProofBar from "@/components/landing/SocialProofBar";
import ReviewsMarquee from "@/components/landing/ReviewsMarquee";
import SectionBadge from "@/components/ui/section-badge";

/* ═══════════════════════════════════════════
   1. HERO — "Stop Hiring on Hope. Start Hiring on Proof."
   ═══════════════════════════════════════════ */
const EmployerHero = () => (
  <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-background">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[80px]" />
    </div>
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        {/* Left copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <SectionBadge label="For Employers" icon={Building2} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display leading-[1.08] mb-6 tracking-tight"
          >
            Stop Hiring on{" "}
            <span className="text-primary">Hope.</span>
            <br />
            Start Hiring on{" "}
            <span className="text-primary">Proof.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
          >
            AI-powered assessments, proctored interviews, and verified Industry
            Readiness Scores — so you hire candidates who are actually
            job-ready. Not just resume-ready.
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2 h-12 px-7"
              >
                Start Screening Talent <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 gap-2 border-border"
              >
                View Pricing
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> SOC 2
              Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" /> AI-Verified Scores
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> 10,000+
              Candidates Screened
            </span>
          </motion.div>
        </div>

        {/* Right — Dashboard Preview Mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="bg-secondary/50 px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/30" />
                <div className="w-3 h-3 rounded-full bg-primary/20" />
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
                    <p className={cn("text-[10px] font-medium", c.score >= 90 ? "text-success" : c.score >= 80 ? "text-primary" : "text-muted-foreground")}>
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
   2. STATS BAR
   ═══════════════════════════════════════════ */
const statsBarItems = [
  { value: "10,000+", label: "Candidates Assessed" },
  { value: "500+", label: "Companies Trust Us" },
  { value: "99%", label: "Proctoring Accuracy" },
  { value: "<24hr", label: "Average Time to Screen" },
];

const StatsBar = () => (
  <section
    className="py-8 bg-primary"
  >
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statsBarItems.map(({ value, label }) => (
          <div key={label} className="text-center text-white">
            <p className="text-2xl md:text-3xl font-bold font-display">{value}</p>
            <p className="text-xs md:text-sm opacity-90 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   2.5 EMPLOYER GAP SECTION — Problem / Solution / How It Works (Accordion)
   ═══════════════════════════════════════════ */
const employerProblems = [
  {
    icon: FileText,
    title: "Resume Overload",
    bullets: [
      "Hundreds of applications per role",
      "Majority are irrelevant or inflated",
      "Hours lost in manual screening",
    ],
  },
  {
    icon: Search,
    title: "Interviews Lack Skill Proof",
    bullets: [
      "Strong talkers pass early rounds",
      "Real capability stays untested",
      "Decisions rely on impressions",
    ],
  },
  {
    icon: TrendingUp,
    title: "Recruitment Is Expensive",
    bullets: [
      "Agency fees up to 25% of CTC",
      "Recruiter and leadership bandwidth",
      "High cost of wrong hires",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Skill Gaps Surface Late",
    bullets: [
      "Performance issues post-joining",
      "Extended ramp-up time",
      "Missed deadlines and rework",
    ],
  },
  {
    icon: BarChart3,
    title: "No Objective Benchmarking",
    bullets: [
      "No standardized skill scoring",
      "No cross-candidate comparability",
      "No measurable readiness index",
    ],
  },
];

const employerSolutions = [
  {
    icon: BadgeCheck,
    title: "Pre-Verified Candidates",
    bullets: [
      "Simulation-tested professionals",
      "Role-specific competency scores",
      "Industry readiness ratings",
    ],
  },
  {
    icon: Target,
    title: "Real-World Task Assessments",
    bullets: [
      "Practical job-based challenges",
      "Scenario-driven evaluations",
      "Standardized scoring models",
    ],
  },
  {
    icon: Gauge,
    title: "Objective Skill Benchmarking",
    bullets: [
      "Job readiness score",
      "Skill-to-role match percentage",
      "Strength and risk indicators",
    ],
  },
  {
    icon: Zap,
    title: "Faster Screening Process",
    bullets: [
      "70–80% reduction in resume filtering",
      "Curated, high-fit shortlist",
      "Focused final interviews",
    ],
  },
  {
    icon: Clock,
    title: "Cost-Efficient Hiring Model",
    bullets: [
      "No inflated agency commissions",
      "Predictable, transparent pricing",
      "Higher confidence per hire",
    ],
  },
];

const howItWorksSteps = [
  "Share role expectations",
  "Candidates complete simulations",
  "Receive performance reports",
  "Interview and hire confidently",
];

const EmployerGapSection = () => {
  const [openProblem, setOpenProblem] = useState<number | null>(null);
  const [openSolution, setOpenSolution] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-background relative">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <SectionBadge label="Problem vs Solution" icon={Target} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Stop Guessing.
            <br />
            <span className="text-primary">Start Hiring Right.</span>
          </motion.h2>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Most hiring teams don't lack candidates — they lack a reliable way to separate real talent from polished résumés.
          </p>
        </div>

        {/* Two-column: Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">

          {/* THE PROBLEM */}
          <div className="space-y-3">
            <div className="text-center md:text-left mb-6">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-destructive bg-destructive/10 px-3 py-1.5 rounded-full border border-destructive/20 mb-4">
                The Problem
              </p>
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
                      : "bg-card border-border/50 opacity-60"
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
                              <span className="text-primary mt-0.5">•</span>
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
      </div>
    </section>
  );
};



/* ═══════════════════════════════════════════
   3. COST SECTION — "Your Current Hiring Process Is Costing You More Than You Think"
   ═══════════════════════════════════════════ */
const costBullets = [
  "Average cost-per-hire in India exceeds ₹8.4 Lakhs when factoring in recruiter time, bad hires, and attrition.",
  "67% of employers say they've made a bad hire due to poor screening processes.",
  "Manual resume screening takes 23+ hours per role — time your team doesn't have.",
];

const CostSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-14 items-center transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <SectionBadge label="The Real Cost" icon={Clock} />
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 leading-tight">
              Your Current Hiring Process Costs<br />
              <span className="text-primary">More Than You Think</span>
            </h2>
            <div className="space-y-4 mb-8">
              {costBullets.map((b, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              With IAmTalento, you automate 85% of the screening process — reducing cost-per-hire by 60% and time-to-hire by 75%.
            </p>
            <Link to="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                See How Much You Can Save <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Cost visual */}
          <div className="flex justify-center">
            <div className="rounded-2xl border border-border bg-card shadow-lg p-8 max-w-sm w-full text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
                Average Cost Per Bad Hire
              </p>
              <p className="text-5xl md:text-6xl font-bold font-display text-primary mb-3">
                ₹8.4L
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Including recruiter time, onboarding, and replacement costs
              </p>
              <div className="space-y-2 text-left">
                {[
                  { label: "Recruiter Hours Wasted", val: "₹2.1L" },
                  { label: "Failed Onboarding", val: "₹3.5L" },
                  { label: "Replacement Search", val: "₹2.8L" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-semibold font-display text-primary">{r.val}</span>
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
   4. STEPS — "From Signup to Hired — In 7 Steps"
   ═══════════════════════════════════════════ */
const journeySteps = [
  { icon: UserCheck, title: "Sign Up", desc: "Create your employer account in 2 minutes" },
  { icon: FileText, title: "Create Assessment", desc: "Use AI or pick from 200+ ready-made tests" },
  { icon: Send, title: "Invite Candidates", desc: "Bulk invite via email, link, or ATS" },
  { icon: Eye, title: "AI Proctoring", desc: "Candidates take secure, proctored assessments" },
  { icon: BarChart3, title: "Auto-Score", desc: "AI scores and ranks every candidate instantly" },
  { icon: Filter, title: "Review & Shortlist", desc: "Compare detailed reports and video playback" },
  { icon: MessagesSquare, title: "Interview Top Picks", desc: "Conduct structured interviews with AI insights" },
  { icon: Award, title: "Hire the Best", desc: "Make data-driven offers with confidence" },
];

const employerPillars = [
  {
    id: "ai-search",
    icon: Search,
    tabLabel: "AI Profile Search",
    tag: "🔍 AI-Powered Search",
    headline: "AI-Powered Profile Search",
    description: "Instantly matches candidates to your job requirements using intelligent filtering.",
    details: [
      { icon: Search, text: "Instantly matches candidates to your job requirements" },
      { icon: Filter, text: "Reduces manual screening with intelligent filtering" },
      { icon: Target, text: "Highlights the most relevant skills and experience" },
      { icon: TrendingUp, text: "Continuously improves match accuracy" },
      { icon: Zap, text: "Speeds up shortlisting with precision" },
    ],
    cta: "Start Searching",
    href: "/contact",
    mockup: "ai-search",
  },
  {
    id: "verified",
    icon: ShieldCheck,
    tabLabel: "Verified Profiles",
    tag: "✅ Verified Profiles",
    headline: "Access to Verified Profiles",
    description: "30-level skill-based proctoring ensures every candidate is thoroughly validated.",
    details: [
      { icon: ShieldCheck, text: "30-level skill-based proctoring completed" },
      { icon: BarChart3, text: "Detailed scorecards for transparent evaluation" },
      { icon: Video, text: "Access to recorded interview videos" },
      { icon: BadgeCheck, text: "Verified credentials and performance insights" },
      { icon: UserCheck, text: "Enables confident, data-driven hiring" },
    ],
    cta: "View Profiles",
    href: "/contact",
    mockup: "verified",
  },
  {
    id: "free-jobs",
    icon: Send,
    tabLabel: "Free Job Posting",
    tag: "🆓 Free Posting",
    headline: "Free Job Posting",
    description: "Post jobs at zero cost and access a pool of pre-screened, qualified talent.",
    details: [
      { icon: Send, text: "Post jobs at zero cost" },
      { icon: Users, text: "Access a pool of pre-screened talent" },
      { icon: Eye, text: "Increase visibility to qualified candidates" },
      { icon: TrendingUp, text: "Lower recruitment expenses" },
      { icon: Zap, text: "Start hiring instantly" },
    ],
    cta: "Post a Job Free",
    href: "/contact",
    mockup: "free-jobs",
  },
  {
    id: "custom-tests",
    icon: ClipboardList,
    tabLabel: "Custom Tests",
    tag: "🧪 Custom Tests",
    headline: "Create Your Own Custom Tests",
    description: "Build role-specific assessments to evaluate technical and practical skills.",
    details: [
      { icon: ClipboardList, text: "Build role-specific assessments" },
      { icon: Target, text: "Evaluate technical and practical skills" },
      { icon: FileText, text: "Add customized question formats" },
      { icon: Gauge, text: "Control test structure and difficulty" },
      { icon: CheckCircle2, text: "Ensure candidates meet your standards" },
    ],
    cta: "Create a Test",
    href: "/contact",
    mockup: "custom-tests",
  },
];

const AISearchMockup = () => (
  <div className="space-y-3">
    {[
      { name: "Arjun Mehta", role: "Sr. Backend Engineer", match: 96, score: 88 },
      { name: "Priya Sharma", role: "Full Stack Developer", match: 91, score: 84 },
      { name: "Rahul Verma", role: "Platform Engineer", match: 87, score: 79 },
    ].map(c => (
      <div key={c.name} className="p-3 rounded-xl border border-border/50 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{c.name}</p>
          <p className="text-[10px] text-muted-foreground">{c.role} · IRS {c.score}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary">{c.match}%</p>
          <p className="text-[9px] text-muted-foreground">Match</p>
        </div>
      </div>
    ))}
  </div>
);

const VerifiedMockup = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="relative h-16 w-16 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
          <motion.path d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
            initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: "88, 100" }} transition={{ delay: 0.3, duration: 1.2 }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">88</span>
      </div>
      <div>
        <p className="text-sm font-bold">Arjun Mehta</p>
        <p className="text-[10px] text-muted-foreground">30/30 Checks Passed</p>
        <p className="text-[10px] font-medium text-primary">✓ Verified</p>
      </div>
    </div>
    {["Identity", "Skills", "Proctoring", "Interview"].map((s, i) => (
      <div key={s} className="flex items-center justify-between text-xs">
        <span>{s} Verification</span>
        <span className="text-primary font-semibold">✓ Passed</span>
      </div>
    ))}
  </div>
);

const FreeJobsMockup = () => (
  <div className="space-y-3">
    <div className="p-3 rounded-xl border border-primary/20 bg-primary/5">
      <p className="text-xs font-bold text-primary mb-1">₹0 — Free Forever</p>
      <p className="text-[10px] text-muted-foreground">No hidden charges. No credit card.</p>
    </div>
    {[
      { title: "Sr. Software Engineer", apps: 142 },
      { title: "Data Analyst", apps: 89 },
      { title: "Product Manager", apps: 67 },
    ].map(j => (
      <div key={j.title} className="p-3 rounded-xl border border-border/50 flex items-center justify-between">
        <p className="text-sm font-medium">{j.title}</p>
        <p className="text-[10px] text-muted-foreground">{j.apps} applicants</p>
      </div>
    ))}
  </div>
);

const CustomTestsMockup = () => (
  <div className="space-y-3">
    {[
      { label: "MCQ Round", count: "20 questions", diff: "Medium" },
      { label: "Coding Challenge", count: "3 problems", diff: "Hard" },
      { label: "Case Study", count: "1 scenario", diff: "Advanced" },
    ].map(t => (
      <div key={t.label} className="p-3 rounded-xl border border-border/50">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-semibold">{t.label}</p>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{t.diff}</span>
        </div>
        <p className="text-[10px] text-muted-foreground">{t.count}</p>
      </div>
    ))}
  </div>
);

const pillarMockupMap: Record<string, React.ReactNode> = {
  "ai-search": <AISearchMockup />,
  "verified": <VerifiedMockup />,
  "free-jobs": <FreeJobsMockup />,
  "custom-tests": <CustomTestsMockup />,
};

const StepsSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const pillar = employerPillars[activeTab];
  const PIcon = pillar.icon;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <SectionBadge label="Platform" icon={Zap} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hire Top Talent. Faster.<br />
            <span className="text-primary">Smarter. Better.</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Discover AI-matched candidates, access 30-level verified profiles, post jobs for free, and create custom tests—all in one powerful platform.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {employerPillars.map((p, i) => {
            const FIcon = p.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: isActive ? "hsl(var(--primary))" : "hsl(var(--card))",
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  border: isActive ? "none" : "1px solid hsl(var(--border))",
                }}
              >
                <FIcon className="h-4 w-4" />
                {p.tabLabel}
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
            className="rounded-2xl border border-border/50 shadow-xl overflow-hidden bg-card"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6 border border-primary/10 self-start">
                  <PIcon className="h-3.5 w-3.5 text-primary" />
                  {pillar.tag}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-display mb-4 leading-tight">
                  {pillar.headline}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{pillar.description}</p>
                <div className="space-y-2 mb-6">
                  {pillar.details.map(({ icon: DIcon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <DIcon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </div>
                  ))}
                </div>
                <Link to={pillar.href} className="self-start">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-11 px-7">
                    {pillar.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Right mockup */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-l border-border/30 p-6 lg:p-8 hidden lg:flex items-center justify-center">
                <div className="w-full rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
                  <div className="h-8 bg-secondary/50 border-b border-border/30 flex items-center px-3 gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-destructive/40" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <div className="h-2 w-2 rounded-full bg-primary/30" />
                    <div className="flex-1 h-4 rounded bg-secondary mx-8" />
                  </div>
                  <div className="p-5">{pillarMockupMap[pillar.mockup]}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   5. FEATURES — "Hire Smarter. Not Harder."
   ═══════════════════════════════════════════ */
const employerFeatures = [
  {
    icon: Wand2,
    title: "AI Assessment Builder",
    desc: "Paste a job description and our AI generates a role-specific assessment in seconds.",
    mockup: "assessment-builder",
  },
  {
    icon: Library,
    title: "Pre-built Assessment Library",
    desc: "200+ ready-made assessments across tech, finance, marketing, healthcare, and more.",
    mockup: "library",
  },
  {
    icon: PaintBucket,
    title: "Custom Branding",
    desc: "White-label the entire assessment experience with your logo, colors, and domain.",
    mockup: "branding",
  },
  {
    icon: Cable,
    title: "40+ ATS Integrations",
    desc: "Seamless plug-and-play with Greenhouse, Lever, Workday, BambooHR, and more.",
    mockup: "integrations",
  },
  {
    icon: Video,
    title: "Video Interviews",
    desc: "Live and async video interviews with AI analysis, sentiment scoring, and recording.",
    mockup: "video",
  },
  {
    icon: ClipboardList,
    title: "Detailed AI Reports",
    desc: "Granular breakdowns of every candidate — skills, behavior, integrity, and recommendations.",
    mockup: "reports",
  },
];

/* Animated mockups for each feature */
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
        <span className="ml-auto text-[9px] text-muted-foreground">{["Hard", "Medium", "Hard"][i]}</span>
      </motion.div>
    ))}
  </div>
);

const LibraryMockup = () => (
  <div className="grid grid-cols-2 gap-2">
    {["React", "Python", "SQL", "DevOps", "Finance", "Marketing"].map((cat, i) => (
      <motion.div
        key={cat}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="p-2 rounded-lg bg-secondary/40 border border-border/30 text-center"
      >
        <p className="text-[10px] font-semibold">{cat}</p>
        <p className="text-[9px] text-muted-foreground">{[24, 18, 15, 12, 20, 16][i]} tests</p>
      </motion.div>
    ))}
  </div>
);

const BrandingMockup = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/30">
      <motion.div
        className="h-8 w-8 rounded-lg bg-primary"
        animate={{ backgroundColor: ["hsl(355,84%,44%)", "hsl(220,90%,50%)", "hsl(150,70%,40%)", "hsl(355,84%,44%)"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="flex-1">
        <div className="h-2 w-16 rounded bg-foreground/20" />
        <div className="h-1.5 w-10 rounded bg-muted-foreground/20 mt-1" />
      </div>
    </div>
    <div className="h-16 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
      <PaintBucket className="h-4 w-4 text-muted-foreground/40" />
    </div>
  </div>
);

const IntegrationsMockup = () => (
  <div className="space-y-2">
    {["Greenhouse", "Lever", "Workday"].map((ats, i) => (
      <motion.div
        key={ats}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: i * 0.2 }}
        className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/30"
      >
        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
          <Cable className="h-3 w-3 text-primary" />
        </div>
        <span className="text-[11px] font-medium flex-1">{ats}</span>
        <span className="text-[9px] text-success font-medium">Connected</span>
      </motion.div>
    ))}
  </div>
);

const VideoMockup = () => (
  <div className="relative">
    <div className="aspect-video rounded-lg bg-secondary/60 border border-border/30 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center"
      >
        <Video className="h-5 w-5 text-primary" />
      </motion.div>
    </div>
    <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1 p-1 rounded bg-card/80 backdrop-blur-sm border border-border/30">
      <div className="h-1 flex-1 rounded-full bg-primary/30 overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "65%" }} transition={{ duration: 2 }} />
      </div>
      <span className="text-[8px] text-muted-foreground">2:34</span>
    </div>
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

const featureMockups: Record<string, React.ReactNode> = {
  "assessment-builder": <AssessmentBuilderMockup />,
  library: <LibraryMockup />,
  branding: <BrandingMockup />,
  integrations: <IntegrationsMockup />,
  video: <VideoMockup />,
  reports: <ReportsMockup />,
};

const FeaturesGrid = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const feature = employerFeatures[activeFeature];
  const Icon = feature.icon;

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionBadge label="Platform Features" icon={Zap} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Hire Smarter.<br />
            <span className="text-primary">Not Harder.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Everything you need to screen, evaluate, and hire — without the manual grunt work.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 max-w-6xl mx-auto">
          {/* Left: Feature cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            {employerFeatures.map(({ icon: FIcon, title }, i) => {
              const isActive = activeFeature === i;
              return (
                <motion.button
                  key={title}
                  onClick={() => setActiveFeature(i)}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "p-4 rounded-xl text-left transition-all duration-300 border",
                    isActive
                      ? "bg-primary/5 border-primary/30 shadow-md"
                      : "bg-card border-border/50 hover:border-primary/20"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300",
                    isActive ? "bg-primary" : "bg-accent"
                  )}>
                    <FIcon className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      isActive ? "text-primary-foreground" : "text-primary"
                    )} />
                  </div>
                  <p className={cn(
                    "text-sm font-semibold font-display transition-colors",
                    isActive ? "text-primary" : "text-foreground"
                  )}>{title}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Big animated mockup */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
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
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
                <div className="min-h-[200px]">
                  {featureMockups[feature.mockup]}
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
   6. SCORE TRUST — "If the Score Says They're Good — They're Actually Good."
   ═══════════════════════════════════════════ */
const scoreBullets = [
  "Domain-expert curated question banks across 50+ industries",
  "AI + human hybrid scoring for maximum accuracy",
  "Industry Readiness Score benchmarked against real professionals",
  "Verified certifications that employers trust",
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
            <SectionBadge label="Verified Quality" icon={BadgeCheck} />
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 leading-tight">
              If the Score Says They're Good —<br />
              <span className="text-primary">They're Actually Good.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our assessments are curated by domain experts, validated by AI,
              and benchmarked against thousands of real-world professionals.
              Every score reflects true, job-relevant competency.
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
              <Button className="bg-primary text-white hover:bg-primary/90 gap-2">
                Explore Assessments <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Score Orb — Employer view */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              {/* Orb */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(198,44,44,0.08) 0%, transparent 70%)", transform: "scale(1.3)" }}
                />
                <div
                  className="relative w-52 h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(32px) saturate(200%)",
                    border: "1px solid rgba(255,255,255,1)",
                    boxShadow: "0 30px 80px rgba(198,44,44,0.12), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="employerArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C62C2C" />
                        <stop offset="100%" stopColor="#FF8C01" />
                      </linearGradient>
                      <filter id="employerArcGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="#e8a0a0"
                      strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 3"
                      animate={{ rotate: -360 }}
                      style={{ transformOrigin: "50px 50px" }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(198,44,44,0.1)" strokeWidth="3.5" />
                    <motion.circle
                      cx="50" cy="50" r="45" fill="none" stroke="url(#employerArcGrad)"
                      strokeWidth="3.8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45 * 0.94} ${2 * Math.PI * 45}`}
                      initial={{ strokeDasharray: `0 ${2 * Math.PI * 45}` }}
                      whileInView={{ strokeDasharray: `${2 * Math.PI * 45 * 0.94} ${2 * Math.PI * 45}` }}
                      transition={{ duration: 2.5, ease: "easeOut", delay: 0.4 }}
                      viewport={{ once: true }}
                      filter="url(#employerArcGlow)"
                    />
                  </svg>
                  <div className="relative text-center z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9, type: "spring", stiffness: 220 }}
                      className="flex items-end justify-center leading-none"
                    >
                      <span className="text-6xl md:text-[80px] font-bold tracking-tight leading-none" style={{ color: "#0f0f1a", fontFamily: "'Space Grotesk',sans-serif" }}>94</span>
                      <span className="text-xl md:text-2xl font-light mb-2 md:mb-3 ml-1" style={{ color: "#9ca3af" }}>/100</span>
                    </motion.div>
                    <p className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#C62C2C" }}>Candidate Score</p>
                  </div>
                </div>
              </motion.div>

              {/* Candidate card below orb */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0, type: "spring", stiffness: 180, damping: 22 }}
                className="w-full mt-5 rounded-2xl overflow-hidden max-w-xs"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(198,44,44,0.12)",
                  boxShadow: "0 12px 40px rgba(198,44,44,0.08), 0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-lg font-bold text-primary font-display">P</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold" style={{ color: "#0f0f1a" }}>Priya Menon</p>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>✓ Verified</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Full Stack Engineer · 5 yrs</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border" style={{ borderTop: "1px solid rgba(198,44,44,0.08)" }}>
                  {[
                    { label: "Rank", value: "Top 6%" },
                    { label: "Integrity", value: "98%" },
                    { label: "Hire Signal", value: "Strong" },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-3 py-2.5 text-center">
                      <p className="text-xs font-bold" style={{ color: "#0f0f1a" }}>{value}</p>
                      <p className="text-[9px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Score breakdown pills */}
              <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-xs">
                {[
                  { label: "React & TS", score: 96, color: "#C62C2C" },
                  { label: "System Design", score: 91, color: "#FF8C01" },
                  { label: "Problem Solving", score: 93, color: "#C62C2C" },
                  { label: "Communication", score: 88, color: "#FF8C01" },
                ].map(({ label, score, color }) => (
                  <div
                    key={label}
                    className="px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.85)", border: "1px solid #f0dada" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
                      <span className="text-[10px] font-bold" style={{ color }}>{score}</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "rgba(198,44,44,0.1)" }}>
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
   PLATFORM CAPABILITIES — "Everything You Need for Skills-First Hiring"
   ═══════════════════════════════════════════ */
const platformTabs = [
  {
    label: "Design & Deliver",
    features: [
      { icon: Wand2, title: "AI Assessment Builder", desc: "Paste a JD and AI generates a role-specific assessment in seconds." },
      { icon: Library, title: "Pre-built Assessment Library", desc: "200+ ready-made assessments across tech, finance, marketing, and more." },
      { icon: ClipboardList, title: "Custom Questions", desc: "Add your own questions, scenarios, and scoring rubrics." },
      { icon: PaintBucket, title: "Custom Branding", desc: "White-label the entire experience with your logo, colors, and domain." },
    ],
    mockup: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Wand2 className="h-4 w-4 text-primary" /></div>
          <span className="text-sm font-medium text-muted-foreground">Generating Assessment...</span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden"><motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "85%" }} transition={{ duration: 1.5, ease: "easeOut" }} /></div>
        {[{ q: "System Design", d: "Hard" }, { q: "API Architecture", d: "Medium" }, { q: "Data Modeling", d: "Hard" }].map(({ q, d }) => (
          <div key={q} className="flex items-center justify-between p-3 rounded-lg bg-secondary/60 border border-border/50">
            <div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full border-2 border-primary/30" /><span className="text-sm">{q}</span></div>
            <span className="text-xs text-muted-foreground font-medium">{d}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Screen & Select",
    features: [
      { icon: ShieldCheck, title: "Proctored Assessments", desc: "30-layer proctoring ensures every test is genuine and cheat-proof." },
      { icon: Video, title: "Video Interviews", desc: "Live and async video interviews with AI sentiment scoring." },
      { icon: Cable, title: "ATS Integrations", desc: "Plug into Greenhouse, Lever, Workday, BambooHR, and 40+ others." },
      { icon: Filter, title: "Smart Shortlists", desc: "Auto-rank and filter candidates by score, role-fit, and integrity." },
    ],
    mockup: (
      <div className="grid grid-cols-2 gap-3">
        {[{ name: "React", tests: "24 tests" }, { name: "Python", tests: "18 tests" }, { name: "SQL", tests: "15 tests" }, { name: "DevOps", tests: "12 tests" }, { name: "Finance", tests: "20 tests" }, { name: "Marketing", tests: "16 tests" }].map(({ name, tests }) => (
          <div key={name} className="p-3 rounded-lg bg-secondary/60 border border-border/50 text-center">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{tests}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Decide & Report",
    features: [
      { icon: FileText, title: "AI Reports", desc: "Granular breakdowns of skills, behavior, integrity, and recommendations." },
      { icon: Target, title: "Benchmarks & Job-Fit Scores", desc: "Compare candidates against role-specific standards and previous hires." },
      { icon: FileUp, title: "Exportable PDFs", desc: "Download detailed candidate reports for stakeholders and records." },
      { icon: ListChecks, title: "Audit Trails", desc: "Complete, tamper-proof logs for compliance and governance." },
    ],
    mockup: (
      <div className="space-y-4">
        {[{ label: "Technical", score: 92 }, { label: "Communication", score: 85 }, { label: "Problem Solving", score: 88 }].map(({ label, score }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{label}</span>
              <span className="text-sm font-bold text-primary">{score}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} whileInView={{ width: `${score}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const PlatformCapabilitiesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState(0);
  const tab = platformTabs[activeTab];

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className={cn("text-center max-w-3xl mx-auto mb-12 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Platform Capabilities" icon={Zap} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Everything You Need for<br />
            Skills-First Hiring <span className="text-primary">in One Place.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Replace 3 tools — resume screening, skill tests, and interviews — with one integrated Industry Readiness platform.
          </p>
          <p className="text-sm text-muted-foreground">
            So your team can design, deliver, screen, and decide — without the manual grunt work.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {platformTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
                activeTab === i
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-foreground border-border hover:border-primary/30"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start"
          >
            {/* Left — Feature list */}
            <div className="space-y-3">
              {tab.features.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold font-display mb-0.5">{title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right — Mockup */}
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                </div>
                <div className="flex-1 h-5 rounded bg-secondary/50 mx-8" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-display">{tab.label}</p>
                    <p className="text-xs text-muted-foreground">Live preview</p>
                  </div>
                </div>
                {tab.mockup}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   EMPLOYER COMPLIANCE — "Your Candidate Data. Our Responsibility."
   ═══════════════════════════════════════════ */
const employerCompliancePoints = [
  { icon: Shield, title: "GDPR-Ready Framework", desc: "Full compliance with data protection standards for candidate PII and assessment records.", badge: "GDPR" },
  { icon: Lock, title: "Data Privacy Compliance", desc: "End-to-end encryption for all candidate data, scores, and hiring reports.", badge: "SOC 2" },
  { icon: FileText, title: "Secure Assessment Storage", desc: "All assessment sessions, proctoring footage, and results encrypted at rest and in transit.", badge: "ISO" },
  { icon: BrainCircuit, title: "Ethical AI Usage", desc: "Transparent, bias-audited AI scoring models that meet EEOC and equal opportunity standards.", badge: "AI" },
  { icon: Eye, title: "Transparent Recording Policy", desc: "Clear candidate disclosure of all monitoring, recording, and data retention practices.", badge: "Policy" },
];

const EmployerComplianceSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-24 bg-card/30">
      <div className="container">
        <div className={cn("text-center max-w-2xl mx-auto mb-12 transition-all duration-700", isVisible ? "opacity-100" : "opacity-0 translate-y-8")}>
          <SectionBadge label="Employer Data Protection" icon={Shield} />
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Candidate Data.<br />Our Responsibility.
          </motion.h2>
          <p className="text-muted-foreground text-lg">Enterprise-grade protection for every assessment, candidate record, and hiring decision — because your compliance is non-negotiable.</p>
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
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                {badge}
              </div>
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3 group-hover:bg-primary transition-all duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold font-display mb-1.5">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <CheckCircle2 className="h-3 w-3 text-primary" />
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
   8. ANTI-FRAUD — "30 Layers of Integrity. Zero Tolerance."
   ═══════════════════════════════════════════ */
const proctorPhases = [
  {
    phase: "Before Assessment",
    items: [
      { icon: ScanFace, label: "Biometric Face Match", desc: "AI verifies candidate identity via facial biometrics" },
      { icon: Fingerprint, label: "ID Verification", desc: "Government ID checked against live photo" },
      { icon: Shield, label: "Multi-Factor Auth", desc: "Email + phone OTP before test access" },
      { icon: Camera, label: "Live Photo Capture", desc: "Snapshot taken at session start for audit" },
      { icon: Search, label: "Environment Scan", desc: "360° room check for unauthorized materials" },
      { icon: UserCheck, label: "Identity Confirmation", desc: "Final identity match before test begins" },
    ],
  },
  {
    phase: "During Assessment",
    items: [
      { icon: Eye, label: "Gaze & Eye Tracking", desc: "Monitors where the candidate is looking" },
      { icon: Activity, label: "Behavior Monitoring", desc: "Flags suspicious movement patterns" },
      { icon: Volume2, label: "Audio Detection", desc: "Detects voices, AI speech, and background audio" },
      { icon: Monitor, label: "Browser Lockdown", desc: "Locks browser to prevent tab switching" },
      { icon: Keyboard, label: "Keystroke Analysis", desc: "Analyzes typing patterns for authenticity" },
      { icon: Smartphone, label: "Multi-Device Block", desc: "Prevents simultaneous device usage" },
      { icon: ScreenShare, label: "Screen Recording", desc: "Records full screen for post-review" },
      { icon: AlertTriangle, label: "Distraction Alerts", desc: "AI flags when candidate looks away" },
      { icon: Globe, label: "IP & Geo Tracking", desc: "Tracks location and IP for anomalies" },
      { icon: ClipboardPaste, label: "Copy-Paste Block", desc: "Blocks all clipboard operations" },
      { icon: Clock, label: "Session Time Tracking", desc: "Flags unusual per-question timing" },
      { icon: Wifi, label: "Exit Monitoring", desc: "Logs all test exit attempts" },
      { icon: Crosshair, label: "Geo-Fencing", desc: "Restricts access to approved locations" },
      { icon: MessagesSquare, label: "Proctor Live Chat", desc: "Real-time support during assessment" },
      { icon: Lock, label: "Screenshot Block", desc: "Prevents screen capture and recording" },
      { icon: Cpu, label: "VM Detection", desc: "Detects virtual machines and emulators" },
    ],
  },
  {
    phase: "After Assessment",
    items: [
      { icon: BrainCircuit, label: "AI Cheating Detection", desc: "ML algorithms flag suspicious patterns" },
      { icon: Bot, label: "ChatGPT Detection", desc: "Identifies AI-generated responses" },
      { icon: Code2, label: "Plagiarism Check", desc: "Cross-references against known sources" },
      { icon: Video, label: "Full Session Replay", desc: "Complete video playback for review" },
      { icon: BarChart3, label: "Integrity Score", desc: "Composite score from all proctoring signals" },
      { icon: FileText, label: "Audit Trail", desc: "Tamper-proof log of every action" },
      { icon: Award, label: "Integrity Rating", desc: "Overall candidate trustworthiness grade" },
      { icon: Send, label: "Post-Test Monitoring", desc: "Continued checks after submission" },
    ],
  },
];

const AntiFraudSection = () => {
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
          <SectionBadge label="30-Layer Proctoring" icon={ShieldCheck} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 leading-tight">
            30 Layers of Integrity.<br />
            <span className="text-primary">Zero Tolerance.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every assessment is protected before, during, and after — so every score your team sees is actually earned.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-10">
          {proctorPhases.map((group, gi) => (
            <div key={group.phase}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                <h3 className="text-sm font-bold font-display uppercase tracking-widest text-primary">{group.phase}</h3>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.items.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.08 + i * 0.03, duration: 0.3 }}
                    className="relative px-4 py-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                        <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <span className="text-sm font-semibold leading-tight">{label}</span>
                    </div>
                    {/* Hover tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 px-3 py-2 rounded-lg bg-foreground text-background text-xs leading-relaxed text-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-20 shadow-xl">
                      {desc}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   CREDIBILITY & TRUST — "Why Employers Trust Our Assessments"
   ═══════════════════════════════════════════ */
const trustItems = [
  { icon: Award, title: "Expert-Vetted", desc: "Built by industry SMEs" },
  { icon: TrendingUp, title: "Always Current", desc: "Updated to latest standards" },
  { icon: Target, title: "Role-Specific", desc: "Mapped to job competencies" },
  { icon: BrainCircuit, title: "Real-World Tasks", desc: "Simulated workplace challenges" },
  { icon: Gauge, title: "Scientifically Validated", desc: "Psychometric principles" },
  { icon: Users, title: "Bias-Reduced", desc: "Standardized, fair scoring" },
  { icon: ShieldCheck, title: "Integrity-Protected", desc: "30-layer proctoring" },
  { icon: BarChart3, title: "Benchmarked", desc: "Comparative performance data" },
  { icon: Building2, title: "Enterprise-Ready", desc: "Scales to any org size" },
  { icon: CheckCircle2, title: "Quality Assured", desc: "Continuously refined" },
];

const CredibilityTrustSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-8"
          )}
        >
          <SectionBadge label="Credibility & Trust" icon={Award} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 leading-tight">
            Why Employers Trust<br />
            <span className="text-primary">Our Assessments</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Built by the people who hire, lead, and build — so every score carries real weight.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {trustItems.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold font-display mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
/* ═══════════════════════════════════════════
   9. DASHBOARD — "One Dashboard. Everything That Matters."
   ═══════════════════════════════════════════ */
const DashboardSection = () => {
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
          <SectionBadge label="Employer Dashboard" icon={BarChart3} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            One Dashboard.<br />
            <span className="text-primary">Everything That Matters.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Track assessments, compare candidates, review AI reports, and manage
            your hiring pipeline — all in one place.
          </p>
        </div>

        {/* Dashboard mock */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="bg-secondary/50 px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <div className="w-3 h-3 rounded-full bg-primary/20" />
              <div className="w-3 h-3 rounded-full bg-muted" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Employer Dashboard — IAmTalento
            </span>
          </div>
          <div className="p-6">
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Active Roles", value: "24", color: "text-primary" },
                { label: "Candidates", value: "1,856", color: "text-primary" },
                { label: "Assessments", value: "12", color: "text-primary" },
                { label: "Avg. Score", value: "74.3%", color: "text-success" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-secondary/40 border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className={cn("text-2xl font-bold font-display", s.color)}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Mini table */}
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-4 py-2.5 bg-secondary/30 text-xs font-semibold text-muted-foreground">
                <span>Candidate</span>
                <span>Role</span>
                <span>Score</span>
                <span>Status</span>
              </div>
              {[
                { name: "Priya M.", role: "Full Stack", score: "94", status: "Shortlisted" },
                { name: "Arjun D.", role: "Backend", score: "87", status: "Under Review" },
                { name: "Sara K.", role: "Data Analyst", score: "82", status: "Shortlisted" },
                { name: "Rahul V.", role: "DevOps", score: "76", status: "Pending" },
              ].map((r, i) => (
                <div key={r.name} className={cn("grid grid-cols-4 gap-4 px-4 py-3 text-sm", i % 2 === 0 ? "bg-card" : "bg-secondary/20")}>
                  <span className="font-medium font-display">{r.name}</span>
                  <span className="text-muted-foreground">{r.role}</span>
                  <span className="font-semibold text-primary">{r.score}</span>
                  <span className={cn("text-xs font-medium", r.status === "Shortlisted" ? "text-success" : r.status === "Pending" ? "text-primary" : "text-muted-foreground")}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   10. PRICING — "Pick a Plan. Start Hiring Today."
   ═══════════════════════════════════════════ */
const pricingTabs = [
  {
    tab: "Profiles",
    plans: [
      {
        name: "Starter",
        price: "₹2,999",
        period: "/month",
        desc: "Essential access to verified candidate profiles",
        features: ["Browse 500 verified profiles/month", "Industry Readiness Scores", "Basic search & filters", "Download 10 reports/month", "Email support"],
        cta: "Start Free Trial",
        popular: false,
      },
      {
        name: "Growth",
        price: "₹4,999",
        period: "/month",
        desc: "Unlimited profiles with advanced filtering",
        features: ["Unlimited verified profiles", "Advanced skill-level filtering", "Unlimited report downloads", "Shortlist & compare candidates", "Candidate ranking dashboard", "Priority email support"],
        cta: "Start Free Trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "",
        desc: "Dedicated access with API & custom integrations",
        features: ["Everything in Growth", "API access for bulk search", "Custom scoring criteria", "Dedicated account manager", "SSO & team management", "SLA guarantee"],
        cta: "Contact Sales",
        popular: false,
      },
    ],
  },
  {
    tab: "AI Skill Assessment",
    plans: [
      {
        name: "Starter",
        price: "₹4,999",
        period: "/month",
        desc: "AI-powered assessments for small teams",
        features: ["50 AI-proctored assessments/month", "100+ pre-built test library", "AI auto-scoring & ranking", "10-point anti-cheating proctoring", "Basic candidate reports", "Email support"],
        cta: "Start Free Trial",
        popular: false,
      },
      {
        name: "Professional",
        price: "₹9,999",
        period: "/month",
        desc: "Full assessment & proctoring suite",
        features: ["Unlimited AI-proctored assessments", "200+ pre-built test library", "AI auto-scoring & ranking", "30-layer anti-cheating proctoring", "Video interview recording", "40+ ATS integrations", "Custom branding", "Detailed AI candidate reports", "Priority support"],
        cta: "Start Free Trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "",
        desc: "Enterprise-grade assessment infrastructure",
        features: ["Everything in Professional", "Dedicated assessment servers", "Custom proctoring rules", "White-label platform", "Dedicated account manager", "SSO & SCIM", "SLA guarantee"],
        cta: "Contact Sales",
        popular: false,
      },
    ],
  },
  {
    tab: "Create Your Own Test",
    plans: [
      {
        name: "Builder",
        price: "₹7,999",
        period: "/month",
        desc: "Build custom assessments with AI assistance",
        features: ["AI Assessment Builder from JD", "Import your own questions", "Custom scoring rubrics", "5 custom tests/month", "Basic proctoring", "Email support"],
        cta: "Start Free Trial",
        popular: false,
      },
      {
        name: "Professional",
        price: "₹14,999",
        period: "/month",
        desc: "Full custom test creation suite",
        features: ["Unlimited custom tests", "AI Assessment Builder from JD", "Import questions & media", "Custom scoring rubrics", "Role-specific simulation tasks", "Voice originality testing", "30-layer proctoring", "Priority support"],
        cta: "Start Free Trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "",
        desc: "Fully customized assessment platform",
        features: ["Everything in Professional", "Custom simulation environments", "Bespoke scoring models", "Dedicated account manager", "On-premise deployment option", "SSO & SCIM", "SLA guarantee"],
        cta: "Contact Sales",
        popular: false,
      },
    ],
  },
];

const PricingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState(0);
  const currentPlans = pricingTabs[activeTab].plans;

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-10 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <SectionBadge label="Pricing" icon={Landmark} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            Pick a Plan.<br />
            <span className="text-primary">Start Hiring Today.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {pricingTabs.map((t, i) => (
            <button
              key={t.tab}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
                activeTab === i
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-foreground border-border hover:border-primary/30"
              )}
            >
              {t.tab}
            </button>
          ))}
        </div>

        {/* Plans grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {currentPlans.map((plan) => (
              <div
                key={plan.name}
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
                <h3 className="font-bold font-display text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold font-display">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
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
                      "w-full",
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
/* ═══════════════════════════════════════════
   11. FAQ — "You Asked. We Answered."
   ═══════════════════════════════════════════ */
const faqs = [
  {
    q: "How quickly can I set up my first assessment?",
    a: "Under 5 minutes. Use our AI builder to generate a role-specific assessment from a job description, or pick from 200+ pre-built tests in our library.",
  },
  {
    q: "What ATS platforms do you integrate with?",
    a: "We integrate with 40+ ATS platforms including Greenhouse, Lever, Workday, BambooHR, iCIMS, and many more. Custom integrations are available on Enterprise plans.",
  },
  {
    q: "How does AI proctoring work?",
    a: "Our AI proctoring uses webcam monitoring, face detection, gaze tracking, tab-switch detection, voice authenticity analysis, and environment monitoring to ensure assessment integrity.",
  },
  {
    q: "Can I customize assessments for my specific roles?",
    a: "Absolutely. You can build custom assessments from scratch, modify existing templates, or let our AI generate one from your job description. Add your branding, time limits, and scoring criteria.",
  },
  {
    q: "What kind of reports do I get?",
    a: "Detailed AI-generated reports with skill breakdowns, percentile rankings, integrity scores, video playback, and actionable hiring recommendations for each candidate.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Start with a 14-day free trial on any plan. No credit card required. You'll get full access to all features during the trial period.",
  },
];

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
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
          <SectionBadge label="FAQ" icon={MessagesSquare} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            You Asked.<br />
            <span className="text-primary">We Answered.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Common questions from hiring leaders evaluating IAmTalento for their teams.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="border border-border/50 rounded-xl overflow-hidden bg-card"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="text-sm font-semibold font-display pr-4">{q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                    openIdx === i && "rotate-180"
                  )}
                />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   12. FINAL CTA — "Your Next Great Hire Is Already Here."
   ═══════════════════════════════════════════ */
const FinalCTA = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section
      className="py-20"
      style={{
        background: "linear-gradient(135deg, hsl(355 84% 30%), hsl(355 84% 44%), hsl(33 100% 45%))",
      }}
    >
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <SectionBadge label="Start Now" icon={Sparkles} className="bg-white/10 text-white/90 border-white/20" />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4 text-white">
            Your Next Great Hire<br /><span className="text-white/75">Is Already Here</span>
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-xl mx-auto">
            Join 500+ companies using IAmTalento to find industry-ready talent
            with verified skill scores. Start screening in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 border-0 gap-2 h-12 px-7 font-semibold"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="h-12 px-7 gap-2 bg-transparent border-2 border-white text-white hover:bg-white/20"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   INDUSTRIES SECTION — "We Speak Your Industry's Language"
   ═══════════════════════════════════════════ */
const industries = [
  { icon: Code2, title: "Software & Tech", roles: "120+ roles" },
  { icon: BarChart3, title: "Data & Analytics", roles: "85+ roles" },
  { icon: Megaphone, title: "Marketing & Growth", roles: "60+ roles" },
  { icon: Landmark, title: "Finance & Banking", roles: "70+ roles" },
  { icon: Heart, title: "Healthcare", roles: "55+ roles" },
  { icon: Cpu, title: "AI & Machine Learning", roles: "45+ roles" },
  { icon: Building2, title: "Consulting", roles: "40+ roles" },
  { icon: GraduationCap, title: "Education & EdTech", roles: "35+ roles" },
  { icon: Palette, title: "Design & Creative", roles: "50+ roles" },
  { icon: ShoppingCart, title: "E-commerce & Retail", roles: "45+ roles" },
  { icon: Home, title: "Real Estate", roles: "30+ roles" },
  { icon: Truck, title: "Logistics & Supply Chain", roles: "40+ roles" },
];

const IndustriesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-20">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto mb-14 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-6"
          )}
        >
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 mb-4">
            <span className="h-2 w-2 rounded-full bg-primary" /> Industry Coverage
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">
            We Speak Your<br /><span className="text-primary">Industry's Language</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Assessments tailored to the realities of each industry, not generic tests.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {industries.map(({ icon: Icon, title, roles }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-default"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-colors duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold font-display mb-0.5">{title}</p>
              <p className="text-xs text-primary font-medium">{roles}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/assessments">
            <Button variant="outline" className="border-border gap-2">
              Browse all 48+ industries <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════ */
const ForEmployers = () => (
  <>
    <Helmet>
      <title>For Employers — AI-Powered Hiring & Screening | IAmTalento</title>
      <meta
        name="description"
        content="Stop hiring on hope. Start hiring on proof. AI-powered assessments, proctored interviews, and verified Industry Readiness Scores for smarter hiring."
      />
      <meta
        property="og:title"
        content="IAmTalento for Employers — Hire Smarter. Screen Faster."
      />
      <meta
        property="og:description"
        content="AI-powered mass-screening platform with proctored assessments, auto-scoring, and detailed candidate reports."
      />
    </Helmet>
    <Layout>
      <EmployerHero />
      <SocialProofBar />
      <EmployerGapSection />
      
      <StepsSection />
      <IndustriesSection />
      <AntiFraudSection />
      <CredibilityTrustSection />
      <PlatformCapabilitiesSection />
      
      <EmployerComplianceSection />
      <DashboardSection />
      <ReviewsMarquee />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </Layout>
  </>
);

export default ForEmployers;
