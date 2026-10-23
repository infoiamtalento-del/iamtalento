import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowDown, BadgeCheck, Bot, Briefcase, Building2, CalendarClock, Check, ChevronDown, Clock, Code2,
  Eye, FileText, Fingerprint, Gauge, Globe2, GraduationCap, Languages, Layers, Lock, Mic, MonitorSmartphone, Palette, Play,
  Rocket, ScanFace, Search, ShieldCheck, Sparkles, Star, TrendingUp, UserCheck, Users, Wand2, X, Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { calculateRoi, ROI_DEFAULTS, type RoiInputs } from "@/lib/employerRoi";
import linda from "@/assets/webinar-speaker-3.jpg";
import candidateAnanya from "@/assets/learner-ananya.jpg";
import candidatePriya from "@/assets/learner-priya.jpg";
import candidateRahul from "@/assets/learner-rahul.jpg";
import candidateVikram from "@/assets/learner-vikram.jpg";
import recruiterImage from "@/assets/employer-recruiter.jpg";
import campusImage from "@/assets/employer-campus-hiring.jpg";

const START = "/employer-profile";
const DEMO = "#book-demo";
const SAMPLE = "/demo-profile";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55 },
};

/** Eyebrow + two-tone headline (first sentence ink, rest brand blue). */
const Heading = ({ eyebrow, title, sub, align = "center", invert = false, className, titleClassName }: {
  eyebrow?: string; title: string; sub?: React.ReactNode; align?: "center" | "left"; invert?: boolean; className?: string; titleClassName?: string;
}) => {
  const bar = title.indexOf("|");
  const idx = bar > -1 ? bar : title.indexOf(". ");
  const first = idx > -1 ? title.slice(0, bar > -1 ? idx : idx + 1) : title;
  const second = idx > -1 ? title.slice(idx + (bar > -1 ? 1 : 2)) : "";
  return (
    <motion.div {...reveal} className={cn(align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-xl", className)}>
      {eyebrow && <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.18em]", invert ? "text-primary-foreground/70" : "text-primary")}>{eyebrow}</p>}
      <h2 className={cn("mb-5 font-display text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]", invert && "text-primary-foreground", titleClassName)}>
        {first}{second && <><br /><span className={invert ? "text-primary-foreground/80" : "text-primary"}>{second}</span></>}
      </h2>
      {sub && <p className={cn("text-sm leading-relaxed md:text-base", invert ? "text-primary-foreground/80" : "text-muted-foreground")}>{sub}</p>}
    </motion.div>
  );
};

const PrimaryCta = ({ label = "Start hiring free", to = START, invert }: { label?: string; to?: string; invert?: boolean }) => (
  <Button asChild size="lg" variant={invert ? "secondary" : "default"} className="h-12 gap-2 px-7">
    {to.startsWith("#") ? <a href={to}>{label} <ArrowRight className="h-4 w-4" /></a> : <Link to={to}>{label} <ArrowRight className="h-4 w-4" /></Link>}
  </Button>
);
const SecondaryCta = ({ label = "Book a demo", to = DEMO, invert }: { label?: string; to?: string; invert?: boolean }) => (
  <Button asChild size="lg" variant="outline" className={invert ? "h-12 gap-2 border-primary-foreground/40 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10" : "h-12 gap-2 px-6"}>
    {to.startsWith("#") ? <a href={to}>{label}</a> : <Link to={to}>{label}</Link>}
  </Button>
);

/* ---------------- 1. Top strip ---------------- */
export const ProofStrip = () => (
  <div className="bg-primary pt-[72px] text-primary-foreground">
    <Link to={START} className="container flex items-center justify-center gap-2 py-2.5 text-center text-xs font-medium sm:text-sm">
      The Proof Era of hiring is here. Search 50,000+ candidates who have already verified their skills <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  </div>
);

/* ---------------- 2. Hero ---------------- */
const shortlist = [
  { name: "Ananya Rao", role: "Senior Product Manager", cir: 86, img: candidateAnanya },
  { name: "Karan Malhotra", role: "Product Manager", cir: 82, img: candidateRahul },
  { name: "Sneha Iyer", role: "Product Lead", cir: 79, img: candidatePriya },
  { name: "Vikram Shah", role: "Associate PM", cir: 77, img: candidateVikram },
];

export const ProofHero = () => (
  <section className="relative overflow-hidden bg-background pb-16 pt-14 md:pb-24 md:pt-20">
    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-accent/60 to-transparent" />
    <div className="container relative grid items-center gap-12 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="[container-type:inline-size]">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-primary">The Future of Hiring Is Here</p>
        <h1 className="mt-[21px] font-sans text-[clamp(25px,6.3cqw,55px)] font-bold leading-[1.16] tracking-[-0.01em]">
          Stop Screening Resumes.
          <span className="block text-primary">Start Finding the Right People.</span>
          <em className="mt-[10px] block text-[0.44em] font-normal not-italic text-foreground/80">TalentCIR changes the way you hire.</em>
        </h1>
        <p className="mt-6 max-w-[620px] text-[clamp(16px,1.15vw,18px)] leading-[1.625] text-foreground/75">
          Discover talent, watch AI-conducted interviews, assess real skills and shortlist better candidates&mdash;all from one AI-powered hiring platform.
        </p>
        <div className="mt-12 flex flex-wrap gap-5 gap-x-7">
          <Button asChild className="h-[52px] min-w-[190px] gap-3 rounded-md bg-primary px-[22px] text-[15px] font-bold text-primary-foreground transition hover:-translate-y-0.5">
            <a href={DEMO}>Book a Demo <ArrowRight className="h-[17px] w-[17px]" /></a>
          </Button>
          <Button asChild variant="outline" className="h-[52px] min-w-[190px] gap-3 rounded-md border-primary px-[22px] text-[15px] font-bold text-primary transition hover:-translate-y-0.5 hover:bg-primary/5">
            <Link to="/employer-profile">Explore the Platform</Link>
          </Button>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-border pt-[26px]">
          {[
            { icon: Layers, t: "One Platform", s: "Assessments, interviews and reports in one place" },
            { icon: Gauge, t: "Smarter decisions", s: "Every score arrives with evidence" },
            { icon: TrendingUp, t: "Better hiring", s: "Shortlist better candidates, faster" },
          ].map(({ icon: Icon, t, s }) => (
            <li key={t} className="flex max-w-[210px] items-start gap-2.5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <strong className="block text-sm font-semibold">{t}</strong>
                <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{s}</span>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.figure initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="relative">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
            <span className="flex items-center gap-2 text-xs font-semibold"><Sparkles className="h-4 w-4 text-primary" /> Verified shortlist · Senior Product Manager</span>
            <span className="text-[10px] text-muted-foreground">18 of 312</span>
          </div>
          <div className="space-y-3 p-4 sm:p-5">
            {shortlist.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-lg border border-border/70 bg-background p-3">
                <img src={c.img} alt="" className="h-10 w-10 rounded-full object-cover" width={40} height={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                </div>
                <span className="hidden items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-semibold text-success sm:flex"><ShieldCheck className="h-3 w-3" /> Integrity clean</span>
                <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">CIR {c.cir}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-5 right-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold shadow-lg">
          <Bot className="h-4 w-4 text-primary" /> Linda finished 48 interviews overnight. Scores ready.
        </div>
        <figcaption className="mt-4 text-center text-sm text-muted-foreground">
          312 applicants in. 18 verified candidates out. Every score backed by a proctored test and a recorded interview.
        </figcaption>
      </motion.figure>
    </div>
  </section>
);

/* ---------------- 3. Trust bar ---------------- */
export const ProofTrustBar = () => (
  <section className="border-y border-border/60 bg-card py-10">
    <div className="container text-center">
      <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Hiring teams already hiring on proof</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { icon: Star, t: "4.8/5 from hiring managers" },
          { icon: BadgeCheck, t: "50,000+ candidates verified" },
          { icon: GraduationCap, t: "120+ colleges and training partners" },
        ].map(({ icon: Icon, t }) => (
          <span key={t} className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"><Icon className="h-4 w-4 text-primary" /> {t}</span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 border-t border-border/60 pt-8">
        {["tcs", "infosys", "wipro", "google", "accenture", "razorpay", "zoho", "flipkart", "amazon", "swiggy"].map((name) => (
          <img key={name} src={`/company-logos/${name}.svg`} alt={`${name.toUpperCase()} logo`} loading="lazy" className="h-5 w-auto opacity-100 transition hover:grayscale hover:opacity-60 md:h-6" />
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- 4. Problem ---------------- */
const problems = [
  { n: "01", t: "Nearly 1 in 10 checks finds something wrong", d: "In Indian IT and ITeS hiring, about 9.5% of background checks surfaced a discrepancy over six months (AuthBridge, H2 2025). Most are found after the offer letter has gone out." },
  { n: "02", t: "Your best candidate may be number 437 in the pile", d: "When a role draws hundreds of applications, recruiters skim for keywords. Plain resumes from able people sink. Polished resumes from AI float." },
  { n: "03", t: "Your managers are interviewing people who were never going to make it", d: "Every first round with an unqualified candidate costs a manager an hour they will not get back. Multiply that by every role, every month." },
];

export const ProblemSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="The Problem" title="The Resume Was Built for a World|That No Longer Exists." sub="Today a candidate can generate a perfect CV, a tailored cover letter and rehearsed interview answers in under ten minutes. Your process was designed to read documents. Documents no longer tell you much." />
      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
        {problems.map((p) => (
          <motion.div key={p.n} {...reveal} className="bg-card p-7">
            <span className="font-display text-sm font-semibold text-primary">{p.n}</span>
            <h3 className="mb-3 mt-3 font-display text-xl font-bold leading-snug">{p.t}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.d}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-10 text-center font-display text-lg font-semibold md:text-xl">The problem isn't your recruiters. <span className="text-primary">It's the evidence they're given.</span></p>
    </div>
  </section>
);

/* ---------------- 5. New era ---------------- */
const eraRows = [
  ["What candidates say they can do", "What candidates show they can do"],
  ["Pedigree: college, company, keywords", "Performance: scored, proctored, comparable"],
  ["Gut feel after a 30-minute call", "Evidence your whole team can read"],
  ["Weeks of screening", "A ranked shortlist overnight"],
];

export const NewEraSection = () => (
  <section className="bg-primary py-20 text-primary-foreground md:py-28">
    <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <Heading align="left" invert eyebrow="The New Era of Hiring" title="Hiring Ran on Claims. The Next Era Runs on Proof." titleClassName="!leading-[1.25] [&_h2]:!mb-4" />
        <motion.p {...reveal} className="text-base leading-relaxed text-primary-foreground/80">
          AI has made claims free, so claims are no longer worth much. The same AI can verify real skill at scale, in minutes. TalentCIR is built for that shift.
        </motion.p>
        <div className="mt-6 flex flex-wrap gap-4">
          <PrimaryCta invert />
          <SecondaryCta invert />
        </div>
      </div>
      <motion.div {...reveal} className="rounded-lg border border-primary-foreground/20">
        <div className="grid grid-cols-2 border-b border-primary-foreground/20 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
          <span className="p-4">The Claims Era</span><span className="p-4">The Proof Era</span>
        </div>
        {eraRows.map(([a, b]) => (
          <div key={a} className="grid grid-cols-2 border-b border-primary-foreground/10 last:border-0">
            <span className="p-4 text-sm text-primary-foreground/60 line-through decoration-primary-foreground/30">{a}</span>
            <span className="flex items-start gap-2 p-4 text-sm font-semibold"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0" /> {b}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ---------------- 6. Two ways ---------------- */
const panels = [
  { icon: Search, title: "Hire from the verified talent pool", body: "50,000+ candidates have already taken proctored assessments and an AI interview. Search by role, skill, city and CIR score, and see the evidence before you contact anyone.", bullets: ["Filter by CIR score, domain and notice period", "See scores before you unlock a profile", "Shortlist in minutes, not weeks"], cta: "Search the talent pool", featured: true },
  { icon: FileText, title: "Assess your own applicants", body: "Send one link to every applicant, from your job post, campus drive or ATS. TalentCIR tests, interviews and ranks them all, and your team only meets the ones who cleared the bar.", bullets: ["200+ ready tests, or a custom test from your JD", "First-round interviews by Linda, 24/7", "Proctoring on every attempt"], cta: "Create an assessment" },
];

export const TwoWaysSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Two Ways to Hire on Proof" title="Bring Your Candidates. Or Hire Ours, Already Verified." sub="Every other assessment platform starts from zero with every role. TalentCIR also gives you people who have already passed." />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {panels.map(({ icon: Icon, ...p }) => (
          <motion.div key={p.title} {...reveal} className={cn("flex flex-col rounded-lg border p-8", p.featured ? "border-primary bg-accent/50" : "border-border bg-card")}>
            <Icon className="mb-5 h-8 w-8 text-primary" />
            <h3 className="mb-3 font-display text-2xl font-bold">{p.title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            <ul className="mb-8 space-y-3">
              {p.bullets.map((b) => <li key={b} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}</li>)}
            </ul>
            <div className="mt-auto"><PrimaryCta label={p.cta} /></div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- 7. How it works ---------------- */
const steps = [
  { day: "Monday", t: "Describe the role", d: "Paste your JD. TalentCIR suggests the skills to test, the right assessment and the interview questions. Change anything you like." },
  { day: "Tuesday", t: "Invite or search", d: "Share one link with applicants, import them from your ATS, or pull proven candidates from the verified pool." },
  { day: "Wed–Thu", t: "AI tests and interviews", d: "Candidates take a proctored assessment and a structured interview with Linda, on their phone or laptop, at any hour." },
  { day: "Friday", t: "Review and hire", d: "Open ranked CIR reports: scores, integrity verdict, interview highlights. Share with your hiring manager and move the best to offer." },
];

export const HowItWorksSection = () => (
  <section id="how-it-works" className="bg-accent/45 py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="How It Works" title="Paste a Job Description on Monday. Meet Verified Candidates by Friday." />
      <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.li key={s.t} {...reveal} className="relative rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">{i + 1}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{s.day}</span>
            </div>
            <h3 className="mb-2 font-display text-lg font-bold">{s.t}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </motion.li>
        ))}
      </ol>
      <p className="mt-8 text-center text-sm text-muted-foreground">Average setup: 10 minutes. No integration, no training, no implementation project.</p>
      <div className="mt-8 text-center"><PrimaryCta /></div>
    </div>
  </section>
);

/* ---------------- 8. Two weeks ---------------- */
const week = [
  ["Monday", "640 resumes arrive.", "640 applicants receive one assessment link."],
  ["Tue–Wed", "A recruiter skims 200 and shortlists on keywords.", "Every answer is scored; Linda interviews 96 candidates overnight."],
  ["Thursday", "Managers interview 12. Nine can't do the job.", "Managers read 12 CIR reports and pick 5."],
  ["Friday", "The search starts again.", "Interviews with people who have already passed."],
  ["Week 3", "An offer goes out; the background check finds a gap.", "An offer goes out with the evidence on file."],
];

export const TwoWeeksSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="The Difference, Day by Day" title="Same Role. Same Applicants. Two Very Different Weeks." />
      <motion.div {...reveal} className="mt-12 overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-[140px_1fr_1fr] bg-secondary/50 text-[10px] font-bold uppercase tracking-[0.18em] md:grid">
          <span className="p-4 text-muted-foreground">Day</span><span className="p-4 text-muted-foreground">Old way</span><span className="p-4 text-primary">With TalentCIR</span>
        </div>
        {week.map(([d, a, b]) => (
          <div key={d} className="grid border-t border-border md:grid-cols-[140px_1fr_1fr]">
            <span className="px-4 pt-4 font-display text-sm font-bold md:p-4">{d}</span>
            <span className="flex items-start gap-2 p-4 text-sm text-muted-foreground"><X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {a}</span>
            <span className="flex items-start gap-2 bg-accent/40 p-4 text-sm font-medium"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}</span>
          </div>
        ))}
      </motion.div>
      <p className="mt-10 text-center font-display text-lg font-semibold md:text-xl">Same budget. Same team. <span className="text-primary">The only thing that changed was the evidence.</span></p>
    </div>
  </section>
);

/* ---------------- 9. Product tour ---------------- */
const tabs = [
  { icon: FileText, name: "Skill Assessments", lead: "Shortlist on ability, not keywords.", d: "200+ ready-made tests for tech, sales, operations, finance and support roles, each reporting skill by skill.", b: ["Aptitude, domain, coding, communication, psychometric", "Three difficulty levels", "Benchmarked against industry rubrics"] },
  { icon: Wand2, name: "AI Test Builder", lead: "A custom test in the time it takes to make tea.", d: "Paste a job description; get a role-specific assessment in under two minutes. Every question is yours to edit.", b: ["Mapped to the JD's skills", "MCQ, scenario, coding, audio, video", "Reuse across roles"] },
  { icon: Mic, name: "AI Interviews", lead: "Your first round, done before your team logs in.", d: "Linda interviews every candidate, asks follow-ups and scores against your rubric.", b: ["Voice, video or text", "Same questions for everyone", "Summary in minutes"] },
  { icon: ShieldCheck, name: "Proctoring", lead: "Scores you can defend.", d: "20 layers of protection, from ID match to AI-answer detection, with evidence on every flag.", b: ["ID and live selfie", "Tab, paste and second-screen detection", "AI-written answer signals"] },
  { icon: GraduationCap, name: "Campus & Bulk", lead: "10,000 candidates. One drive. One ranked list.", d: "Results the moment the drive closes, by college and by branch.", b: ["Slot scheduling and reminders", "College-wise analytics", "Works on low bandwidth"] },
  { icon: Palette, name: "Branding & Team", lead: "Your name on every screen. Your whole team on one page.", d: "White-label invites, tests and reports; shared scorecards for every decision.", b: ["Custom domain and sender", "Roles and permissions", "Comments and notes"] },
];

export const ProductTourSection = () => {
  const [active, setActive] = useState(0);
  const t = tabs[active];
  return (
    <section className="bg-card py-20 md:py-28">
      <div className="container">
        <Heading eyebrow="One Platform" title="Six Tools Your Team Would Otherwise Buy Separately." sub="Assessments, AI interviews, proctoring, campus drives, branding and team review. One login, one contract, one score per candidate." />
        <div role="tablist" className="mt-10 flex gap-2 overflow-x-auto pb-2 lg:justify-center">
          {tabs.map(({ icon: Icon, name }, i) => (
            <button key={name} role="tab" aria-selected={active === i} onClick={() => setActive(i)} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition", active === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40")}>
              <Icon className="h-4 w-4" /> {name}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 grid items-center gap-10 rounded-lg border border-border bg-background p-6 md:p-10 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{t.name}</p>
              <h3 className="mb-4 font-display text-2xl font-bold md:text-3xl">{t.lead}</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">{t.d}</p>
              <ul className="space-y-3">{t.b.map((b) => <li key={b} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}</li>)}</ul>
            </div>
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-accent/60">
              <t.icon className="h-24 w-24 text-primary/70" strokeWidth={1.2} />
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
          {["Up to 50% lower cost per hire", "Background check included", "Hiring analytics", "All in every paid plan"].map((b) => <span key={b} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> {b}</span>)}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 10. Linda ---------------- */
const lindaLeft = [
  { icon: FileText, t: "Built from your JD", d: "Questions match the role, not a template." },
  { icon: Search, t: "Follow-ups like a good recruiter", d: "She probes vague answers." },
  { icon: Sparkles, t: "Your rules", d: "Must-ask questions and your own weights." },
  { icon: Palette, t: "Your brand", d: "She introduces herself on your behalf." },
];
const lindaRight = [
  { icon: Clock, t: "Any hour", d: "Candidates interview at 11 pm if that suits them." },
  { icon: ScanFace, t: "Identity checked", d: "Face match and voice originality." },
  { icon: Languages, t: "Speaks their language", d: "English plus Hindi and other Indian languages." },
  { icon: Rocket, t: "Instant scores", d: "Comparable across every candidate." },
];

const LindaPoint = ({ icon: Icon, t, d, right }: { icon: typeof Clock; t: string; d: string; right?: boolean }) => (
  <div className={cn("flex items-start gap-4", right && "lg:flex-row-reverse lg:text-right")}>
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10"><Icon className="h-5 w-5" /></span>
    <div><p className="font-display font-semibold">{t}</p><p className="text-sm text-primary-foreground/75">{d}</p></div>
  </div>
);

export const LindaSection = () => (
  <section className="bg-primary py-20 text-primary-foreground md:py-28">
    <div className="container">
      <Heading invert eyebrow="AI Interviewer" title="Meet Linda. Last Night She Interviewed 412 Candidates While Your Team Slept." sub="Linda runs a structured first-round interview for every applicant, asks a follow-up when an answer is vague, and scores each response against your rubric. Your recruiters start the day with a ranked list instead of a full calendar." className="max-w-4xl" />
      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-8">{lindaLeft.map((p) => <LindaPoint key={p.t} {...p} right />)}</div>
        <div className="mx-auto text-center">
          <img src={linda} alt="Linda, TalentCIR's AI interviewer" className="mx-auto h-64 w-64 rounded-full border-4 border-primary-foreground/20 object-cover" width={256} height={256} loading="lazy" />
          <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary">
            <Play className="h-4 w-4" /> Hear Linda in a real interview (30 seconds)
          </button>
        </div>
        <div className="space-y-8">{lindaRight.map((p) => <LindaPoint key={p.t} {...p} />)}</div>
      </div>
      <div className="mt-12 text-center"><PrimaryCta invert label="Try Linda on one of your roles" /></div>
    </div>
  </section>
);

/* ---------------- 11. Explainable scoring ---------------- */
const scoreRows = [["Problem awareness", 92], ["Specific example", 86], ["Better alternative", 78], ["Communication", 90], ["Overall fit", 87]] as const;

export const ExplainableSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Explainable AI" title="See Exactly Why Every Candidate|Scored What They Scored." sub="No black box. You write the question and define a great answer. TalentCIR scores every response against your rubric, criterion by criterion, and shows its reasoning. You can override any score." />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <motion.div {...reveal} className="rounded-lg border border-border bg-card p-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">1 · Your question, your rules</p>
          <p className="mb-4 font-display font-semibold">Q: Which software tool slows your work most, and what would you change?</p>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">A great answer:</p>
          <ul className="space-y-2 text-sm">{["Names a specific problem", "Gives a real example", "Suggests a better alternative"].map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" />{x}</li>)}</ul>
        </motion.div>
        <motion.div {...reveal} className="rounded-lg border border-border bg-card p-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">2 · The candidate answers by voice (0:42)</p>
          <div className="mb-4 flex h-10 items-end gap-1">{Array.from({ length: 32 }).map((_, i) => <span key={i} className="w-1 rounded-full bg-primary/50" style={{ height: `${20 + ((i * 37) % 80)}%` }} />)}</div>
          <p className="text-sm italic leading-relaxed text-muted-foreground">"Salesforce slows our reporting down. Building a weekly pipeline view takes me an hour. I'd rather use HubSpot or a small custom dashboard."</p>
        </motion.div>
        <motion.div {...reveal} className="rounded-lg border border-primary bg-card p-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">3 · The score, with reasons</p>
          <div className="space-y-2.5">{scoreRows.map(([k, v]) => (
            <div key={k}><div className="mb-1 flex justify-between text-xs"><span>{k}</span><span className="font-bold">{v}</span></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} /></div></div>
          ))}</div>
          <p className="mt-4 rounded-md bg-accent/60 p-3 text-xs">Note: strong on specifics; probe trade-offs in the next round.</p>
        </motion.div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3"><PrimaryCta /><SecondaryCta label="See a real candidate report" to={SAMPLE} /></div>
    </div>
  </section>
);

/* ---------------- 12. CIR report ---------------- */
const modules = ["Composite CIR score", "Round-wise skill scores", "Integrity log", "Interview summary and clips", "Industry percentile", "Strengths and gaps", "Salary-fit indicator", "Verified skill passport (QR)"];
const cirScores = [["Domain execution", 92], ["Analytical reasoning", 85], ["Case problem solving", 88], ["Communication", 79]] as const;

export const CirReportSection = () => (
  <section className="bg-accent/45 py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Candidate Intelligence Report" title="The Resume Told You What They Claimed. The CIR Tells You What They Can Do." sub="Four proctored rounds, an interview summary, an integrity verdict and a plain-English recommendation, on one page. It takes three minutes to read, and it answers the question a resume never could: can this person do the job?" />
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr_0.8fr]">
        <ol className="grid content-start gap-2">
          {modules.map((m, i) => <li key={m} className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm"><span className="font-display text-xs font-bold text-primary">0{i + 1}</span>{m}</li>)}
        </ol>
        <motion.div {...reveal} className="rounded-lg border border-border bg-card p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-4">
            <img src={candidateAnanya} alt="" className="h-14 w-14 rounded-full object-cover" width={56} height={56} />
            <div className="flex-1"><p className="font-display text-lg font-bold">Ananya Rao</p><p className="text-sm text-muted-foreground">Senior Product Manager</p></div>
            <div className="text-right"><p className="font-display text-3xl font-bold text-primary">86<span className="text-base text-muted-foreground">/100</span></p><p className="text-[10px] font-semibold text-muted-foreground">Top 12% of PMs assessed</p></div>
          </div>
          <div className="space-y-3">{cirScores.map(([k, v]) => (
            <div key={k}><div className="mb-1 flex justify-between text-xs"><span>{k}</span><span className="font-bold">{v}</span></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} /></div></div>
          ))}</div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 font-semibold text-success"><ShieldCheck className="h-3.5 w-3.5" /> Integrity: clean, ID verified</span>
          </div>
          <div className="mt-5 rounded-md bg-primary p-4 text-sm text-primary-foreground"><span className="font-semibold">Recommendation:</span> advance to final round.</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <span className="rounded-md bg-primary/10 py-2 text-primary">Advance</span><span className="rounded-md bg-secondary py-2">Hold</span><span className="rounded-md bg-secondary py-2">Reject</span>
          </div>
        </motion.div>
        <div className="self-start rounded-lg border border-border bg-card p-6">
          <Eye className="mb-4 h-7 w-7 text-primary" />
          <h3 className="mb-2 font-display text-xl font-bold">Read a real CIR in three minutes</h3>
          <p className="mb-6 text-sm text-muted-foreground">Anonymised. No form. Share it with your hiring manager.</p>
          <Button asChild className="w-full gap-2"><Link to={SAMPLE}>Open sample report <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- 13. Integrity ---------------- */
const layers = [
  { phase: "Before the test", items: ["ID and live selfie match", "Device and network check", "Duplicate account detection"] },
  { phase: "During the test", items: ["Full-screen lock", "Tab-switch and paste blocking", "Face presence and second-person detection", "Second-screen detection", "Randomised question pools"] },
  { phase: "After the test", items: ["AI-written answer signals", "Voice originality", "Plagiarism check on code and text", "Timestamped event log"] },
];

export const IntegritySection = () => (
  <section className="py-20 md:py-28">
    <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <Heading align="left" eyebrow="Integrity by Design" title="Your Candidates Have AI. Your Assessments Need More Than a Webcam." />
        <motion.p {...reveal} className="mb-8 text-sm leading-relaxed text-muted-foreground md:text-base">
          TestGorilla reports that 17% of candidates admit to cheating, and most of them use AI to do it. TalentCIR checks 20 signals before, during and after every test. When something looks wrong, you don't get an accusation. You get a timestamp, a snapshot and the facts, and your team decides.
        </motion.p>
        <div className="mb-8 flex items-baseline gap-3"><span className="font-display text-5xl font-bold text-primary">17%</span><span className="text-sm text-muted-foreground">of candidates admit to cheating</span></div>
        <PrimaryCta label="See how proctoring works" to={DEMO} />
      </div>
      <div className="space-y-6">
        {layers.map((l) => (
          <motion.div key={l.phase} {...reveal}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{l.phase}</p>
            <div className="flex flex-wrap gap-2">{l.items.map((i) => <span key={i} className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm"><Lock className="h-3.5 w-3.5 text-primary" />{i}</span>)}</div>
          </motion.div>
        ))}
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
          <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded bg-secondary"><MonitorSmartphone className="h-6 w-6 text-muted-foreground" /></div>
          <p className="text-sm"><span className="font-mono font-semibold">14:32:08</span> · Tab switch detected (4 seconds) · snapshot attached · <span className="font-semibold text-success">Reviewer: accepted</span></p>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- 14. Responsible AI ---------------- */
const principles = [
  { t: "Explainable", d: "Every score shows the criteria and the reasoning behind it. Nothing is hidden from your team or the candidate." },
  { t: "Fair by design", d: "Every candidate gets the same questions and the same rubric. Names, photos, colleges and gender are never scoring inputs." },
  { t: "Human in control", d: "AI recommends; your team decides. Any score can be reviewed and overridden, and every change is logged." },
  { t: "Audited", d: "We review scoring for bias across groups every quarter and publish what we change." },
];

export const ResponsibleAISection = () => (
  <section className="bg-card py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="AI That Answers to You" title="AI Does the Screening. People Make the Decisions." sub="Hiring AI should be held to a higher standard than the process it replaces. Here are ours." />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {principles.map((p, i) => (
          <motion.div key={p.t} {...reveal} className="border-t-2 border-primary pt-6">
            <span className="font-display text-4xl font-bold text-primary/30">0{i + 1}</span>
            <h3 className="mb-2 mt-2 font-display text-xl font-bold">{p.t}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.d}</p>
          </motion.div>
        ))}
      </div>
      <Link to="/contact" className="mt-12 flex items-center justify-center gap-2 rounded-lg border border-border bg-background py-4 text-sm font-semibold text-primary hover:bg-accent/50">Read our Responsible AI policy <ArrowRight className="h-4 w-4" /></Link>
    </div>
  </section>
);

/* ---------------- 15. Results ---------------- */
const metrics = [["72%", "less time to shortlist"], ["50%", "lower cost per hire"], ["3x", "candidates screened per recruiter"], ["50,000+", "candidates verified"]];

export const ResultsSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Results" title="What Changes in the First 30 Days." />
      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        {metrics.map(([n, l]) => <div key={l} className="bg-card p-6 text-center"><p className="font-display text-4xl font-bold text-primary">{n}</p><p className="mt-2 text-sm text-muted-foreground">{l}</p></div>)}
      </div>
      <div className="mt-8 grid gap-8 rounded-lg border border-border bg-card p-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Case study · Retail · 2,000 employees</p>
          <dl className="space-y-4 text-sm leading-relaxed">
            <div><dt className="font-semibold">The problem</dt><dd className="text-muted-foreground">800 applicants for 40 sales roles and a three-week backlog.</dd></div>
            <div><dt className="font-semibold">What they did</dt><dd className="text-muted-foreground">One assessment and one Linda interview for every applicant; only the top 15% reached managers.</dd></div>
            <div><dt className="font-semibold">What happened</dt><dd className="text-muted-foreground">A shortlist in 4 days, 2x offer acceptance, and no extra recruiters.</dd></div>
          </dl>
        </div>
        <blockquote className="flex flex-col justify-center border-l-2 border-primary pl-6">
          <p className="font-display text-xl font-semibold leading-snug">"We cut screening from three weeks to four days. Every candidate our managers met had already proven they could do the job."</p>
          <footer className="mt-4 text-sm text-muted-foreground">Head of Talent Acquisition, Retail customer</footer>
          <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Read how they did it <ArrowRight className="h-4 w-4" /></Link>
        </blockquote>
      </div>
    </div>
  </section>
);

/* ---------------- 16. ROI ---------------- */
const roiFields: { key: keyof RoiInputs; label: string; min: number; max: number; step: number }[] = [
  { key: "roles", label: "Roles you hire per year", min: 1, max: 500, step: 1 },
  { key: "applicants", label: "Applicants per role", min: 10, max: 2000, step: 10 },
  { key: "minutes", label: "Minutes spent screening each applicant", min: 1, max: 20, step: 1 },
  { key: "rate", label: "Recruiter cost per hour, ₹", min: 100, max: 3000, step: 50 },
];

export const RoiSection = () => {
  const [v, setV] = useState<RoiInputs>(ROI_DEFAULTS);
  const r = calculateRoi(v);
  const fmt = (n: number) => n.toLocaleString("en-IN");
  return (
    <section className="bg-accent/45 py-20 md:py-28">
      <div className="container">
        <Heading eyebrow="Your Numbers" title="What Is Guesswork Costing You This Year?" sub="Move the sliders. See what proof-based screening would save your team." />
        <div className="mt-12 grid gap-8 overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-2">
          <div className="space-y-7 p-8">
            {roiFields.map((f) => (
              <div key={f.key}>
                <div className="mb-3 flex justify-between text-sm"><label className="font-medium">{f.label}</label><span className="font-display font-bold text-primary">{fmt(v[f.key])}</span></div>
                <Slider aria-label={f.label} min={f.min} max={f.max} step={f.step} value={[v[f.key]]} onValueChange={([n]) => setV((p) => ({ ...p, [f.key]: n }))} />
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-6 bg-primary p-8 text-primary-foreground">
            {[["Recruiter hours saved per year", fmt(r.hoursSaved)], ["First-round interviews avoided", fmt(r.interviewsAvoided)], ["Screening cost saved", `₹${fmt(r.costSaved)}`]].map(([l, n]) => (
              <div key={l}><p className="text-sm text-primary-foreground/70">{l}</p><p className="font-display text-4xl font-bold">{n}</p></div>
            ))}
            <div>
              <Button asChild variant="secondary" size="lg"><a href={DEMO}>Email me this estimate</a></Button>
              <p className="mt-2 text-xs text-primary-foreground/70">Get a one-page summary you can share with finance.</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Estimate assumes TalentCIR removes 80% of manual screening time and 60% of first-round interviews (12 per role). Your results will vary.</p>
      </div>
    </section>
  );
};

/* ---------------- 17. Comparison ---------------- */
const compareRows = ["Pre-verified candidate pool", "Proctored skill assessments", "AI interviews with follow-ups", "One comparable score per candidate", "Integrity evidence on every result", "White-label branding", "Campus drives at scale", "Pricing in INR, pay as you hire"];
const others = {
  "Job boards": ["Resumes only", "No tests", "No interviews", "No score", "No integrity", "No", "No", "Per-listing"],
  "Assessment-only tools": ["No pool", "Yes", "Some", "Yes", "Varies", "Add-on", "Some", "Often USD per seat"],
  "Manual screening": ["No", "No", "No", "No", "No", "n/a", "Slow", "Recruiter hours"],
};
const Cell = ({ v }: { v: string }) => {
  const neg = /^(No|Resumes only|No pool|n\/a)/.test(v);
  const pos = v === "Yes";
  return <span className={cn("flex items-center gap-1.5 text-sm", neg ? "text-muted-foreground" : "")}>{pos ? <Check className="h-4 w-4 text-primary" /> : neg ? <Minus className="h-4 w-4" /> : null}{v}</span>;
};

export const ComparisonSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Why Teams Switch" title="A Job Board Gives You Resumes. A Test Tool Gives You Scores. TalentCIR Gives You Proof." className="max-w-4xl" />
      <div className="mt-12 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[820px] text-left">
          <thead><tr className="bg-secondary/50 text-xs font-bold uppercase tracking-wider">
            <th className="p-4" /><th className="bg-primary p-4 text-primary-foreground">TalentCIR</th>
            {Object.keys(others).map((k) => <th key={k} className="p-4 text-muted-foreground">{k}</th>)}
          </tr></thead>
          <tbody>{compareRows.map((row, i) => (
            <tr key={row} className="border-t border-border">
              <td className="p-4 text-sm font-medium">{row}</td>
              <td className="bg-accent/50 p-4"><span className="flex items-center gap-1.5 text-sm font-semibold"><Check className="h-4 w-4 text-primary" /> Yes</span></td>
              {Object.values(others).map((col, j) => <td key={j} className="p-4"><Cell v={col[i]} /></td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Based on the typical capabilities of each category, October 2026.</p>
    </div>
  </section>
);

/* ---------------- 18. Built for your team ---------------- */
const teams = [
  { icon: Users, t: "Talent Acquisition", q: "I have 40 open roles and one pair of eyes.", b: ["A ranked, verified shortlist for every role", "Up to 60% fewer first-round calls", "Evidence your hiring managers can't argue with"] },
  { icon: GraduationCap, t: "Campus & Bulk", q: "6,000 freshers, one week, and they all look the same on paper.", b: ["One drive, 10,000 candidates", "College-wise and branch-wise results", "A ranked list the moment it closes"] },
  { icon: Briefcase, t: "Staffing Agencies", q: "Clients don't want more CVs. They want certainty.", b: ["Submit every candidate with a CIR attached", "White-label under your brand", "Separate workspaces per client"] },
  { icon: Code2, t: "Tech & Engineering", q: "My engineers spend Fridays interviewing people who can't code.", b: ["Coding tests in 30+ languages", "Technical interviews by Linda", "Engineers only meet the top 10%"] },
  { icon: Rocket, t: "Startups & SMBs", q: "We don't have a recruiter. We have a founder and a deadline.", b: ["Live in 10 minutes", "Pay per candidate", "Hire from the verified pool directly"] },
  { icon: Building2, t: "Enterprise", q: "Twelve cities, twelve ways of hiring.", b: ["One rubric everywhere", "SSO, roles and audit logs", "A dedicated success manager"] },
];

export const BuiltForTeamSection = () => {
  const [active, setActive] = useState(0);
  const t = teams[active];
  return (
    <section className="bg-card py-20 md:py-28">
      <div className="container">
        <Heading eyebrow="Built for Your Team" title="However You Hire, Hire on Proof." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr]">
          <div role="tablist" className="flex gap-2 overflow-x-auto lg:flex-col">
            {teams.map(({ icon: Icon, t: name }, i) => (
              <button key={name} role="tab" aria-selected={active === i} onClick={() => setActive(i)} className={cn("flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition", active === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40")}>
                <Icon className="h-4 w-4" /> {name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={t.t} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="grid overflow-hidden rounded-lg border border-border bg-background md:grid-cols-2">
              <div className="p-8">
                <p className="mb-6 font-display text-2xl font-bold leading-snug">"{t.q}"</p>
                <ArrowDown className="mb-6 h-5 w-5 text-primary" />
                <ul className="space-y-3">{t.b.map((b) => <li key={b} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}</li>)}</ul>
              </div>
              <img src={active === 1 ? campusImage : recruiterImage} alt="" className="h-full min-h-[240px] w-full object-cover" loading="lazy" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* ---------------- 19. Testimonials ---------------- */
const stories = [
  { result: "400 first-round interviews in one week. No new recruiters.", quote: "We used Linda across four cities. Our managers only met people who had already cleared the bar.", who: "Talent Partner, IT services" },
  { result: "Campus drive: one month became one week.", quote: "We ran 3,200 freshers through one assessment and had a ranked list by branch the evening it closed.", who: "Campus Hiring Lead, Engineering firm" },
  { result: "Offer acceptance doubled in one quarter.", quote: "Candidates arrived at final rounds already knowing their strengths. Conversations got shorter and sharper.", who: "Head of HR, Fintech startup" },
];

export const ProofTestimonials = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Customer Stories" title="Don't Take Our Word for It. That's Rather the Point." sub="Hiring leaders on what changed when they started hiring on evidence." />
      <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)} <span className="ml-2">4.8/5 from hiring managers</span></p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {stories.map((s) => (
          <motion.figure key={s.result} {...reveal} className="flex flex-col rounded-lg border border-border bg-card p-7">
            <p className="mb-4 font-display text-lg font-bold leading-snug">"{s.result}"</p>
            <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground">{s.quote}</blockquote>
            <figcaption className="mt-auto border-t border-border pt-4 text-sm font-semibold">{s.who}</figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- 20. Candidate experience ---------------- */
export const CandidateExperienceSection = () => (
  <section className="bg-accent/45 py-20 md:py-28">
    <div className="container grid items-center gap-12 lg:grid-cols-2">
      <div>
        <Heading align="left" eyebrow="Candidate Experience" title="Good Candidates Don't Mind Being Tested. They Mind Being Ignored." sub="Most applicants never hear back. With TalentCIR, every candidate who completes an assessment receives their own verified CIR and skill passport, a credential they can use for their whole career. So they take it seriously, and they finish." />
        <div className="mt-8 flex items-baseline gap-3"><span className="font-display text-5xl font-bold text-primary">89%</span><span className="text-sm text-muted-foreground">of invited candidates complete their assessment</span></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: MonitorSmartphone, t: "Built for phones, works on low bandwidth" },
          { icon: Check, t: "A practice question before every test" },
          { icon: CalendarClock, t: "Interview at any hour" },
          { icon: FileText, t: "A personal report at the end, win or lose" },
        ].map(({ icon: Icon, t }) => (
          <motion.div key={t} {...reveal} className="rounded-lg border border-border bg-card p-6"><Icon className="mb-4 h-6 w-6 text-primary" /><p className="font-display font-semibold">{t}</p></motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- 21. Integrations & security ---------------- */
const integrations = ["Zoho Recruit", "Darwinbox", "Keka", "Greenhouse", "Lever", "Workday", "SAP SuccessFactors", "BambooHR", "Freshteam", "Slack", "Microsoft Teams", "Google Calendar", "API & webhooks"];
const security = [
  { icon: Globe2, t: "Data hosted in India" }, { icon: ShieldCheck, t: "DPDP Act ready" }, { icon: BadgeCheck, t: "ISO 27001 aligned" },
  { icon: Fingerprint, t: "SSO & role-based access" }, { icon: Lock, t: "Encrypted at rest and in transit" },
];

export const ProofIntegrations = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Integrations & Security" title="Connects to Your ATS in an Afternoon. Keeps Your Data in India for Good." sub="Scores sync to the candidate record you already use. Candidate data is stored in India, encrypted, and yours to export or delete." className="max-w-4xl" />
      <div className="mt-12 flex flex-wrap justify-center gap-2">{integrations.map((i) => <span key={i} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">{i}</span>)}</div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {security.map(({ icon: Icon, t }) => <div key={t} className="rounded-lg border border-border bg-card p-5 text-center"><Icon className="mx-auto mb-3 h-6 w-6 text-primary" /><p className="text-sm font-semibold">{t}</p></div>)}
      </div>
      <div className="mt-8 text-center"><Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Visit the Trust Center <ArrowRight className="h-4 w-4" /></Link></div>
    </div>
  </section>
);

/* ---------------- 22. Pricing ---------------- */
const plans = [
  { name: "Starter", price: "Free", tag: "Try it on one real role.", items: ["5 candidates", "Ready-made tests", "Basic proctoring", "CIR reports", "1 seat"], cta: "Start free", to: START },
  { name: "Growth", price: "₹499", unit: "per candidate", tag: "For teams hiring every month.", items: ["Everything in Starter", "AI test builder", "Linda interviews", "Full proctoring", "Verified pool search", "5 seats"], cta: "Start 14-day trial", to: START, featured: true },
  { name: "Enterprise", price: "Custom", tag: "For campus drives and large teams.", items: ["White-label", "SSO and ATS", "Bulk tools", "Success manager"], cta: "Talk to sales", to: DEMO },
];

export const ProofPricing = () => (
  <section className="bg-card py-20 md:py-28">
    <div className="container">
      <Heading eyebrow="Pricing" title="Pay for Candidates Assessed. Not for Seats That Sit Empty." />
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={cn("relative flex flex-col rounded-lg border p-8", p.featured ? "border-primary shadow-xl" : "border-border bg-background")}>
            {p.featured && <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most popular</span>}
            <p className="font-display text-lg font-bold">{p.name}</p>
            <p className="mt-3 font-display text-4xl font-bold">{p.price} {p.unit && <span className="text-sm font-medium text-muted-foreground">{p.unit}</span>}</p>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">{p.tag}</p>
            <ul className="mb-8 space-y-3">{p.items.map((i) => <li key={i} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}</li>)}</ul>
            <Button asChild className="mt-auto" variant={p.featured ? "default" : "outline"} size="lg">{p.to.startsWith("#") ? <a href={p.to}>{p.cta}</a> : <Link to={p.to}>{p.cta}</Link>}</Button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">Prices in INR, GST extra. Campus and agency plans available. <Link to="/pricing" className="font-semibold text-primary">See full pricing →</Link></p>
    </div>
  </section>
);

/* ---------------- 23. Promise ---------------- */
export const PromiseSection = () => (
  <section className="py-20 md:py-24">
    <div className="container">
      <motion.div {...reveal} className="mx-auto max-w-4xl rounded-lg border-2 border-primary bg-card p-8 text-center md:p-12">
        <ShieldCheck className="mx-auto mb-5 h-10 w-10 text-primary" />
        <h2 className="mb-5 font-display text-3xl font-bold leading-tight md:text-4xl">Our Promise: <span className="text-primary">A Better Shortlist, or Your Money Back.</span></h2>
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">Run your first paid role on TalentCIR. If the shortlist doesn't save your team time compared with how you hired for that role before, tell us within 30 days and we'll refund it.</p>
        <div className="grid gap-4 text-left sm:grid-cols-2">
          {["A real person sets up your first role with you, free.", "Your data, always: export or delete it any time."].map((t) => <p key={t} className="flex items-start gap-3 rounded-md bg-accent/50 p-4 text-sm font-medium"><UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}</p>)}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ---------------- 24. FAQ ---------------- */
const faqs = [
  ["How quickly can we start?", "Today. Create an account, paste a job description, and your first assessment is live in about 10 minutes. No integration needed."],
  ["What is a CIR score?", "A 0 to 100 score built from four proctored assessment rounds, an AI interview and integrity checks, compared against others assessed for similar roles. It tells you what a candidate can do, not what they claim."],
  ["Can we use our own questions?", "Yes. Build a test from your JD with AI, write your own questions, or mix both with our library. You set the scoring rubric."],
  ["What stops candidates using ChatGPT?", "20 integrity checks, including ID match, paste and tab blocking, second-screen detection and AI-written answer signals. Every flag comes with evidence for your team to review."],
  ["Is the AI biased?", "Every candidate gets the same questions and the same rubric. Names, photos, colleges and gender are never inputs. Every score is explainable, and your team can override any of them."],
  ["Will Linda replace our recruiters?", "No. She takes the repetitive first round off their plate, so they spend their time with the best candidates and on closing offers."],
  ["Won't candidates drop out?", "They finish because they get something back: their own verified report. Tests work on phones and low bandwidth, and interviews run at any hour."],
  ["Can we hire from your talent pool?", "Yes. Search 50,000+ verified candidates by role, skill, city and CIR score, and unlock the profiles you want."],
  ["Does it work with our ATS?", "Yes: Zoho Recruit, Darwinbox, Keka, Greenhouse, Lever and more, plus an API and webhooks. Scores sync to the candidate record."],
  ["Where is our data, and who owns it?", "In India. You own it, and you can export or delete it whenever you like."],
];

export const ProofFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-accent/45 py-20 md:py-24">
      <div className="container">
        <Heading eyebrow="Questions" title="Fair Questions. Straight Answers." />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={q} className="overflow-hidden rounded-lg border border-border bg-card">
              <Button variant="ghost" onClick={() => setOpen(open === i ? null : i)} className="h-auto w-full justify-between whitespace-normal rounded-none px-5 py-4 text-left">
                <span className="font-semibold">{q}</span><ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open === i && "rotate-180")} />
              </Button>
              <AnimatePresence>{open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</motion.p>}</AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 25. Final CTA + demo form ---------------- */
export const FinalCtaSection = () => {
  const [sent, setSent] = useState(false);
  return (
    <section id="book-demo" className="bg-primary py-20 text-primary-foreground md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 font-display text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">Your Next Hire Has Already Proven Themselves.<br /><span className="text-primary-foreground/80">Meet Them This Week.</span></h2>
          <p className="mb-8 text-base leading-relaxed text-primary-foreground/80">Start free with five candidates: no credit card, no sales call, no integration. Prefer to see it first? Book 20 minutes and we'll run it on one of your real roles.</p>
          <div className="mb-8 flex flex-wrap gap-3">
            <PrimaryCta invert />
            <Button asChild size="lg" variant="outline" className="h-12 border-primary-foreground/40 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><a href="#demo-form">Book a demo</a></Button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">{["5 candidates free", "Live in 10 minutes", "No credit card", "Data stays in India"].map((t) => <span key={t} className="flex items-center gap-2"><Check className="h-4 w-4" /> {t}</span>)}</div>
        </div>
        <div id="demo-form" className="rounded-lg bg-card p-8 text-card-foreground shadow-xl">
          {sent ? (
            <div className="py-6 text-center">
              <BadgeCheck className="mx-auto mb-4 h-10 w-10 text-primary" />
              <p className="mb-2 font-display text-xl font-bold">Done.</p>
              <p className="mb-6 text-sm text-muted-foreground">We'll be in touch within one working day. Want to start now? Create a free account and send your first assessment.</p>
              <Button asChild><Link to={START}>Create free account</Link></Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <h3 className="mb-2 font-display text-xl font-bold">See TalentCIR on one of your roles</h3>
              <Input required type="email" placeholder="Work email" aria-label="Work email" />
              <Input required placeholder="Full name" aria-label="Full name" />
              <Input required placeholder="Company" aria-label="Company" />
              <select required aria-label="Company size" defaultValue="" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="" disabled>Company size</option>{["1–50", "51–200", "201–1,000", "1,000+"].map((o) => <option key={o}>{o}</option>)}
              </select>
              <select required aria-label="Hires planned in the next 3 months" defaultValue="" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="" disabled>Hires planned in the next 3 months</option>{["1–10", "11–50", "51–200", "200+"].map((o) => <option key={o}>{o}</option>)}
              </select>
              <Button type="submit" size="lg" className="w-full">Book my 20 minutes</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
