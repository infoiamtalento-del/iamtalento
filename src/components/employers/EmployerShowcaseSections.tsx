import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Building2, CalendarClock, Cable, CheckCircle2, CirclePlay, ClipboardCheck, Code2, Fingerprint,
  GraduationCap, Library, Lock, Megaphone, MessageSquare, Mic, Palette, Quote, ScanLine, Search, ShieldCheck, Sparkles,
  Star, UserCog, Users, Wand2, Briefcase, Globe2, Server, Type, Video, Volume2, MoreVertical, Play, Pause, FileText, PenTool, BadgePercent, Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import lindaDashboardImg from "@/assets/ai-interview-dashboard.jpg";
import interviewer from "@/assets/webinar-speaker-3.jpg";
import p3 from "@/assets/speaker-meera.jpg";
import v1 from "@/assets/mock-interview-1.jpg";
import v2 from "@/assets/mock-interview-2.jpg";
import v3 from "@/assets/mock-interview-3.jpg";
import teamImage from "@/assets/employer-team.jpg";
import pv_resume from "@/assets/plan-resume.mp4.asset.json";
import pv_jobpost from "@/assets/plan-jobpost.mp4.asset.json";
import pv_verify from "@/assets/plan-verify.mp4.asset.json";
import pv_advertise from "@/assets/plan-advertise.mp4.asset.json";
import pv_assessment from "@/assets/plan-assessment.mp4.asset.json";
import pv_whitelabel from "@/assets/plan-whitelabel.mp4.asset.json";
import pv_bulk from "@/assets/plan-bulk.mp4.asset.json";
import pv_campus from "@/assets/plan-campus.mp4.asset.json";
import pv_aitests from "@/assets/plan-aitests.mp4.asset.json";
import w2 from "@/assets/webinar-speaker-2.jpg";
import tVideo1 from "@/assets/testimonial-1.mp4.asset.json";
import tVideo2 from "@/assets/testimonial-2.mp4.asset.json";
import tVideo3 from "@/assets/testimonial-3.mp4.asset.json";
import tVideo4 from "@/assets/testimonial-4.mp4.asset.json";
import expert1 from "@/assets/expert-1.jpg";
import spRohan from "@/assets/speaker-rohan.jpg";
import spKavya from "@/assets/speaker-kavya.jpg";
import host2 from "@/assets/podcast-host-2.jpg";
import recruiterImage from "@/assets/employer-recruiter.jpg";
import type { LucideIcon } from "lucide-react";


const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

/* ---------- Company marks used under testimonials ---------- */
const companyMarks: Record<string, { src: string; size: string }> = {
  Razorpay: { src: "/company-logos/razorpay.svg", size: "h-8" },
  Infosys: { src: "/company-logos/infosys.svg", size: "h-5" },
  Flipkart: { src: "/company-logos/flipkart.svg", size: "h-8" },
  Zoho: { src: "/company-logos/zoho.svg", size: "h-7" },
  TCS: { src: "/company-logos/tcs.svg", size: "h-6" },
  Wipro: { src: "/company-logos/wipro.svg", size: "h-6" },
  Amazon: { src: "/company-logos/amazon.svg", size: "h-6" },
  Swiggy: { src: "/company-logos/swiggy.svg", size: "h-7" },
};

const CompanyMark = ({ name, className }: { name: string; className?: string }) => (
  <img
    src={companyMarks[name].src}
    alt={`${name} logo`}
    loading="lazy"
    className={cn("w-auto opacity-90 grayscale", companyMarks[name].size, className)}
  />
);



export const CenterIntro = ({ eyebrow, first, second, description, invert = false, className }: {
  eyebrow: string; first: string; second?: string; description?: React.ReactNode; invert?: boolean; className?: string;
}) => (
  <motion.div {...reveal} className={cn("mx-auto mb-12 max-w-2xl text-center", className)}>
    <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.18em]", invert ? "text-primary-foreground/60" : "text-primary")}>{eyebrow}</p>
    <h2 className={cn("font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl", description && "mb-5", invert && "text-primary-foreground")}>
      {first}{second && <><br /><span className={invert ? "text-primary-foreground" : "text-primary"}>{second}</span></>}
    </h2>
    {description && <p className={cn("text-sm leading-relaxed md:text-base", invert ? "text-primary-foreground/70" : "text-muted-foreground")}>{description}</p>}
  </motion.div>
);

/* ---------- Trust stats + testimonial ---------- */
const stats = [
  { value: "3,500+", label: "Hiring teams onboarded" },
  { value: "4.8M", label: "Assessments delivered" },
  { value: "50%", label: "Lower hiring costs" },
  { value: "72%", label: "Faster time-to-hire" },
];
export const TrustStats = () => (
  <section className="py-20 md:py-24">
    <div className="container">
      <CenterIntro eyebrow="Proven Results" first="Trusted by Organisations" second="Building Great Teams." description={<>Hiring teams across India rely on IAmTalento for evidence-backed decisions.<br className="hidden md:block" /> The numbers speak for themselves.</>} />
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        {stats.map(s => (
          <motion.div {...reveal} key={s.label} className="bg-card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary md:text-4xl">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <motion.figure {...reveal} className="mx-auto mt-10 max-w-3xl rounded-lg bg-accent/50 p-8 text-center">
        <Quote className="mx-auto mb-4 h-8 w-8 text-primary" />
        <blockquote className="font-display text-lg font-semibold leading-relaxed md:text-xl">
          “We cut our screening time from three weeks to four days. Every shortlisted candidate arrived with verified proof of their skills.”
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center gap-3">
          <img src={p3} alt="Meera Krishnan" className="h-11 w-11 rounded-full object-cover" loading="lazy" />
          <div className="text-left"><p className="text-sm font-bold">Meera Krishnan</p><p className="text-xs text-muted-foreground">Head of Talent, Fintech scale-up</p></div>
          <span className="ml-4 flex gap-0.5 text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>
        </figcaption>
        <div className="mt-6 border-t border-border/60 pt-6">
          <CompanyMark name="Razorpay" className="mx-auto" />
        </div>

      </motion.figure>
    </div>
  </section>
);

/* ---------- AI interviewer (dark) ---------- */
const interviewPoints = [
  { icon: Wand2, title: "AI Assessment Builder", text: "Paste a JD, get a role-specific assessment." },
  { icon: Library, title: "Pre-built Assessment Library", text: "200+ ready-made assessments for every role." },
  { icon: FileText, title: "Custom Questions", text: "Add your own questions and scoring rubrics." },
  { icon: Palette, title: "Custom Branding", text: "White-label it with your logo and domain." },
  { icon: Mic, title: "Natural voice conversations", text: "Adaptive follow-ups based on every answer." },
  { icon: CalendarClock, title: "Available 24/7", text: "Candidates interview whenever suits them." },
  { icon: Fingerprint, title: "Identity & integrity checks", text: "Face match and voice originality analysis." },
  { icon: BarChart3, title: "Instant scored reports", text: "Structured scores your team can compare." },
];

const InterviewAvatar = () => (
  <div className="relative mx-auto">
    <span aria-hidden className="absolute inset-[-22%] rounded-full bg-primary-foreground/10 blur-3xl" />
    <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-primary-foreground/25 shadow-2xl lg:h-64 lg:w-64">
      <img src={interviewer} alt="AI interviewer avatar" className="h-full w-full object-cover" loading="lazy" />
    </div>
    <span className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary-foreground px-4 py-2 text-xs font-semibold text-primary shadow-lg">
      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Interview in progress
    </span>
  </div>
);

const InterviewCta = () => (
  <Button asChild size="lg" className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
    <Link to="/employer-profile"><CalendarClock className="h-4 w-4" /> Get Started <ArrowRight className="h-4 w-4" /></Link>
  </Button>
);

export const AIInterviewerSection = () => (
  <section className="bg-primary py-20 md:py-28">
    <div className="container">
      <CenterIntro invert className="max-w-4xl" eyebrow="AI Interviewer" first="Meet Linda, Your AI Interviewer." description="Run first-round interviews at scale — every candidate gets a fair, consistent conversation." />
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <div className="order-2 space-y-5 md:order-none">{interviewPoints.slice(0, 4).map(p => <Point key={p.title} {...p} align="right" />)}</div>
        <div className="order-1 py-8 md:order-none md:px-2"><InterviewAvatar /></div>
        <div className="order-3 space-y-5 md:order-none">{interviewPoints.slice(4).map(p => <Point key={p.title} {...p} />)}</div>
      </div>
      <div className="mt-12 text-center"><InterviewCta /></div>
    </div>
  </section>
);

/* ---------- AI interviewer showcase (light, employers-page-2) ---------- */


export const LindaShowcaseSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <motion.div {...reveal} className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <img src={lindaDashboardImg} alt="TalentCIR AI interview in progress" className="w-full object-cover" loading="lazy" />
        </motion.div>
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm md:p-10">
          <motion.div {...reveal}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">AI Interviewer</p>
            <h2 className="font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl">
              Meet Linda,<br /><span className="text-primary">Your AI Interviewer.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">Run first-round interviews at scale — every candidate gets a fair, consistent conversation.</p>
          </motion.div>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {interviewPoints.map(({ icon: Icon, title, text }, i) => (
              <motion.div {...reveal} transition={{ duration: 0.5, delay: i * 0.05 }} key={title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{title}</h3>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10"><Button asChild size="lg" className="gap-2"><Link to="/employer-profile">Get Started <ArrowRight className="h-4 w-4" /></Link></Button></div>
        </div>
      </div>
    </div>
  </section>
);

const Point = ({ icon: Icon, title, text, align }: { icon: typeof Mic; title: string; text: string; align?: "right" }) => (
  <motion.div {...reveal} className={cn("flex gap-4", align === "right" && "md:flex-row-reverse md:text-right")}>
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"><Icon className="h-5 w-5" /></span>
    <div><h3 className="font-display text-base font-bold text-primary-foreground">{title}</h3><p className="mt-1 text-sm leading-snug text-primary-foreground/70">{text}</p></div>
  </motion.div>
);

/* ---------- One platform: the 6 requested points ---------- */
const platformPoints = [
  { title: "Skill Assessment Library", text: "Ready-made, proctored tests for every role, with detailed reports that let you shortlist on demonstrated ability instead of resumes." },
  { title: "20 Layers of Cheating Prevention", text: "AI proctoring across the entire test journey, from identity checks to browser controls, so every score can be trusted." },
  { title: "Custom AI Assessment Creation", text: "Build role-specific tests in minutes. Paste a job description and get questions mapped to what the role actually demands." },
  { title: "White-Label Branding", text: "Your brand on every assessment touchpoint, from invites and test screens to the reports your candidates receive." },
  { title: "Bulk Campus Hiring & Screening", text: "Screen thousands of candidates at once, with ranked shortlists ready for your team the moment the drive ends." },
  { title: "Create AI Scheduled Interviews", text: "Automated interview rounds, hands-free. Candidates join on their schedule and you review evidence-linked scores." },
];
export const PlatformSection = ({ eyebrow = "One Platform", first = "Everything It Takes,", second = "In One Platform.", description, boxed = false }: { eyebrow?: string; first?: string; second?: string; description?: React.ReactNode; boxed?: boolean }) => (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow={eyebrow} first={first} second={second} description={description ?? <>Assess, proctor, brand, and interview without juggling separate tools.<br className="hidden md:block" /> Six capabilities, one connected workflow.</>} />
      <div className={cn("mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-3", boxed ? "gap-5" : "border-l border-t border-border")}>
        {platformPoints.map(({ title, text }, i) => (
          <motion.div {...reveal} transition={{ duration: 0.5, delay: i * 0.06 }} key={title} className={cn("group flex flex-col p-8 transition-colors md:p-10", boxed ? "rounded-xl border border-border bg-card shadow-sm hover:-translate-y-1 hover:border-primary/30 hover:shadow-md" : "border-b border-r border-border hover:bg-card", !boxed && i === 0 && "bg-card")}>
            <p className="text-sm font-semibold tracking-[0.15em] text-primary">0{i + 1}</p>
            <h3 className="mb-5 mt-10 font-serif text-3xl font-normal leading-tight tracking-normal text-foreground">{title}</h3>
            <p className="flex-1 text-base leading-relaxed text-muted-foreground">{text}</p>
            <Button asChild variant="link" className="mt-8 h-auto justify-start gap-2 p-0 text-base"><Link to="/employer-profile">Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></Button>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 text-center"><Button asChild size="lg" className="gap-2"><Link to="/employer-profile">Create Company Profile <ArrowRight className="h-4 w-4" /></Link></Button></div>
    </div>
  </section>
);

/* ---------- AI evaluation: your question -> candidate answer -> AI report ---------- */
const evalModes = ["Text", "Audio", "Video"] as const;
type EvalMode = (typeof evalModes)[number];

const waveform = [14, 26, 38, 20, 46, 30, 54, 38, 22, 48, 32, 58, 26, 42, 18, 50, 34, 62, 28, 44, 16, 38, 52, 24, 40, 20, 48, 30, 56, 22];

const reportRows = [
  { label: "Problem awareness", score: 92 },
  { label: "Specific examples", score: 86 },
  { label: "Suggested alternative", score: 78 },
  { label: "Communication", score: 90 },
];

const EvalConnector = () => (
  <div aria-hidden className="hidden items-center lg:flex">
    <span className="h-1.5 w-full rounded-full bg-primary/15" />
  </div>
);

export const AIEvaluateSection = () => {
  const [mode, setMode] = useState<EvalMode>("Audio");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(34);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => Math.min(100, p + 2)), 120);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (progress >= 100) setPlaying(false);
  }, [progress]);

  const pickMode = (next: EvalMode) => {
    setMode(next);
    setPlaying(false);
    setProgress(next === "Audio" ? 34 : 0);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">AI Evaluation</p>
          <h2 className="mb-5 font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl">
            AI-Evaluate Candidates<br /><span className="text-primary">Like Your Top Recruiters Would.</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Enterprise-grade intelligence, form-level simplicity, and the precision of a Swiss watch.<br className="hidden md:block" /> One question in, a scored and evidence-backed report out.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2"><Link to="/employer-profile">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/assessments/explore">See Sample Report</Link></Button>
          </div>
        </motion.div>

        <motion.div {...reveal} className="mt-14 grid items-stretch gap-5 lg:grid-cols-[1fr_2.25rem_1fr_2.25rem_1fr]">
          <div className="relative">
            <span aria-hidden className="absolute -bottom-3 -left-3 hidden h-full w-full rounded-lg bg-accent lg:block" />
            <div className="relative flex h-full flex-col rounded-lg border border-primary/15 bg-card p-5 shadow-sm">
              <p className="mb-4 -rotate-1 font-display text-xs italic text-muted-foreground">Your question, with your rules</p>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary font-display text-sm font-bold text-primary">Q</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Question</p>
                  <p className="mt-1 text-sm font-medium leading-snug">Which is your least favourite software tool at work?</p>
                </div>
              </div>
              <div className="my-5 h-px bg-border" />
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">AI Evaluation Criteria</p>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">Specific challenges should be mentioned. Extra points for how it can be improved, or for naming a better alternative.</p>
                </div>
              </div>
            </div>
          </div>

          <EvalConnector />

          <div className="relative flex h-full flex-col rounded-lg border border-primary/15 bg-card p-5 shadow-sm">
            <p className="font-display text-sm font-bold">Candidate Response</p>
            <div className="mt-4 flex gap-1 rounded-full bg-secondary p-1">
              {evalModes.map(m => (
                <button key={m} type="button" onClick={() => pickMode(m)} aria-pressed={mode === m} className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold transition-colors", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {m === "Text" ? <Type className="h-3.5 w-3.5" /> : m === "Audio" ? <Mic className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                  {m}
                </button>
              ))}
            </div>
            <div className="mt-4 flex-1 rounded-md bg-secondary p-4">
              {mode === "Audio" && (
                <div className="flex h-full flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <div className="flex h-16 items-end gap-[3px]">
                      {waveform.map((h, i) => (
                        <span key={i} style={{ height: `${h}%` }} className={cn("w-full rounded-full transition-colors", (i / waveform.length) * 100 <= progress ? "bg-primary" : "bg-border")} />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button type="button" onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause the sample answer" : "Play the sample answer"} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                      <span className="relative h-1 flex-1 rounded-full bg-border">
                        <span className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${progress}%` }} />
                      </span>
                      <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="sm:w-40 sm:border-l sm:border-border sm:pl-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Transcript</p>
                    <p className="mt-2 text-sm leading-relaxed">&ldquo;Salesforce slows our reporting down. I&rsquo;d rather have HubSpot, or a small custom dashboard.&rdquo;</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">0:42 &middot; spoken answer</p>
                  </div>
                </div>
              )}
              {mode === "Text" && (
                <div className="flex h-full flex-col">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Transcript</p>
                  <p className="mt-2 text-sm leading-relaxed">&ldquo;Salesforce slows our reporting down ,  the export breaks on large datasets. I&rsquo;d rather have HubSpot, or a small custom dashboard built for our reporting.&rdquo;</p>
                  <p className="mt-auto pt-3 text-[11px] text-muted-foreground">184 words &middot; typed answer</p>
                </div>
              )}
              {mode === "Video" && (
                <div className="relative h-full min-h-40 overflow-hidden rounded-md">
                  <img src={v1} alt="Candidate recording a video answer" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><Play className="h-4 w-4" /></span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <EvalConnector />

          <div className="relative flex h-full flex-col rounded-lg border border-primary/15 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary">AI Report</p>
                <p className="text-sm font-semibold">Scored the moment they finish</p>
              </div>
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-3">
              {reportRows.map(r => (
                <div key={r.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{r.label}</span>
                    <span className="font-bold text-primary">{r.score}</span>
                  </div>
                  <span className="mt-1.5 block h-1.5 w-full rounded-full bg-secondary"><span className="block h-full rounded-full bg-primary" style={{ width: `${r.score}%` }} /></span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-md bg-secondary px-3 py-2.5">
              <span className="text-xs font-semibold">Overall fit</span>
              <span className="font-display text-lg font-bold text-primary">87</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Strong problem awareness and specifics. Probe deeper on trade-offs before the interview round.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


/* ---------- Teams ---------- */
const teams = [
  { icon: Users, title: "Talent Acquisition", text: "Shortlist faster with verified, ranked candidates." },
  { icon: UserCog, title: "HR & People Ops", text: "Standardise evaluations across every location." },
  { icon: Code2, title: "Engineering Leaders", text: "Coding tests and technical AI interviews." },
  { icon: GraduationCap, title: "Campus Hiring", text: "Screen thousands of graduates in a single drive." },
  { icon: Briefcase, title: "Staffing Agencies", text: "White-label assessments for every client." },
  { icon: Megaphone, title: "Employer Branding", text: "Showcase your culture to active job seekers." },
];
export const TeamsSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="Built for Every Team" first="One Platform for Every" second="Team That Hires." description={<>From recruiters to engineering leads, everyone works from the same evidence.<br className="hidden md:block" /> No more scattered spreadsheets.</>} />
      <motion.div {...reveal} className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-lg">
        <img src={teamImage} alt="Hiring colleagues collaborating in a modern office" className="aspect-[16/9] w-full object-cover md:aspect-[21/9]" width={1408} height={1056} loading="lazy" />
      </motion.div>
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map(({ icon: Icon, title, text }) => (
          <motion.div {...reveal} key={title} className="rounded-lg border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
            <Icon className="mx-auto mb-4 h-7 w-7 text-primary" />
            <h3 className="mb-1 font-display text-base font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Plan inclusions + product video ---------- */
const planItems = [
  { icon: FileText, label: "Resume", text: "Search and unlock verified candidate resumes.", video: pv_resume },
  { icon: Briefcase, label: "Job Posting", text: "Publish roles in minutes to active job seekers.", video: pv_jobpost },
  { icon: ShieldCheck, label: "Verify Resume", text: "Confirm credentials and work history automatically.", video: pv_verify },
  { icon: Megaphone, label: "Advertise My Job", text: "Boost reach with promoted job campaigns.", video: pv_advertise },
  { icon: Wand2, label: "Create Own Assessment", text: "Build tests with your own questions and rubrics.", video: pv_assessment },
  { icon: Palette, label: "White Label", text: "Your logo, colours and domain on every test.", video: pv_whitelabel },
  { icon: GraduationCap, label: "Bulk Hiring / Campus Hiring", text: "Screen thousands of applicants and run campus drives online.", video: pv_bulk },
  { icon: Sparkles, label: "Create AI Tests", text: "Paste a JD and let AI generate the test.", video: pv_aitests },
];

export const PlanVideoSection = () => {
  const [active, setActive] = useState(0);
  const item = planItems[active];
  return (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="One Subscription" first="All-in-One AI Hiring" second="That Thinks Like You Do." />
      <motion.div {...reveal} className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-border bg-card shadow-xl">
        <div className="grid items-stretch lg:grid-cols-[7fr_5fr]">
          <div className="p-6 md:p-10">
            <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">What's included in your plan</h3>
            <p className="mt-2 text-sm text-muted-foreground">Tap any feature to see it in action.</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {planItems.map(({ icon: Icon, label }, i) => {
                const on = i === active;
                return (
                  <li key={label}>
                    <button type="button" onClick={() => setActive(i)} aria-pressed={on}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${on ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-background hover:border-primary/40 hover:bg-secondary"}`}>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${on ? "bg-primary-foreground/15" : "bg-secondary text-primary"}`}><Icon className="h-4 w-4" /></span>
                      <span className="text-sm font-semibold leading-snug">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="gap-2 rounded-full px-8"><Link to="/employer-profile">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
              <span className="font-hand text-lg text-foreground">No credit card required</span>
            </div>
          </div>
          <div className="relative overflow-hidden bg-accent">
            <div className="w-full overflow-hidden bg-foreground">
              <video key={item.video.url} src={item.video.url} autoPlay muted loop controls playsInline preload="metadata" className="aspect-[4/5] w-full object-cover" />
            </div>
            <span className="absolute left-1/2 top-4 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm"><CirclePlay className="h-3.5 w-3.5" /> {item.label}</span>
            <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-transparent px-6 pb-14 pt-12 text-center text-sm text-primary-foreground">{item.text}</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

/* ---------- Integrations & security ---------- */
const integrations = ["Workday", "Greenhouse", "Lever", "Zoho Recruit", "SAP SuccessFactors", "Darwinbox", "Slack", "Teams", "Google Calendar", "Keka", "BambooHR", "Freshteam"];
const security = [
  { icon: Lock, label: "ISO 27001 aligned" }, { icon: ShieldCheck, label: "GDPR & DPDP ready" },
  { icon: Server, label: "Data hosted in India" }, { icon: Globe2, label: "SSO & role access" },
];
export const IntegrationsSection = () => (
  <section className="bg-accent/45 py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="Integrations & Security" first="Seamless Integrations." second="Enterprise-Grade Security." description={<>Connect with 40+ ATS and HR tools your team already uses.<br className="hidden md:block" /> Your data stays protected.</>} />
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
        {integrations.map(n => <motion.span {...reveal} key={n} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm"><Cable className="h-3.5 w-3.5 text-primary" />{n}</motion.span>)}
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
        {security.map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-lg bg-card p-5 text-center shadow-sm"><Icon className="mx-auto mb-3 h-7 w-7 text-primary" /><p className="text-xs font-semibold">{label}</p></div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Video testimonials ---------- */
const stories = [
  { video: tVideo1, img: v1, name: "Rahul Verma", role: "TA Lead, IT Services", company: "Infosys", quote: "Campus drives that took a month now finish in a week." },
  { video: tVideo2, img: v2, name: "Priya Nair", role: "HR Director, Retail", company: "Flipkart", quote: "Proctoring reports gave our managers real confidence." },
  { video: tVideo3, img: v3, name: "Vikram Singh", role: "CTO, SaaS startup", company: "Zoho", quote: "The AI interviews feel human and save my engineers hours." },
  { video: tVideo4, img: w2, name: "Arjun Mehta", role: "Talent Manager, Consulting", company: "TCS", quote: "We scaled from 200 to 2,000 applicants without adding recruiters." },
  { video: tVideo1, img: expert1, name: "Neha Kulkarni", role: "Head of Talent, Manufacturing", company: "Wipro", quote: "Shortlisting that took three days now takes an hour." },
  { video: tVideo2, img: spRohan, name: "Rohan Gupta", role: "HR Business Partner, Logistics", company: "Amazon", quote: "Every offer we made last quarter came with evidence behind it." },
  { video: tVideo3, img: spKavya, name: "Kavya Reddy", role: "Recruitment Lead, FinTech", company: "Razorpay", quote: "Our recruiters stopped chasing resumes and started meeting real candidates." },
  { video: tVideo4, img: host2, name: "Anita Desai", role: "Talent Partner, Q-commerce", company: "Swiggy", quote: "We ran 400 interviews in a week without adding a single recruiter." },
];

export const TestimonialsSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="Customer Stories" first="Trusted by Hiring Teams" second="Across India." description={<>Hear from leaders who moved to skills-first, evidence-backed hiring.<br className="hidden md:block" /> Real teams, real outcomes.</>} />
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stories.map(s => (
          <motion.article {...reveal} key={s.name} className="overflow-hidden rounded-lg border border-border bg-card">
            <video src={s.video.url} poster={s.img} controls preload="metadata" playsInline className="aspect-square w-full bg-background object-cover" />
            <div className="p-5 text-center">
              <p className="text-sm leading-relaxed">“{s.quote}”</p>
              <p className="mt-4 text-sm font-bold">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.role}</p>
              <div className="mt-5 border-t border-border/60 pt-4">
                <CompanyMark name={s.company} className="mx-auto" />
              </div>
            </div>

          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Numbered benefits: photo left, list right ---------- */
export type USPItem = { icon: LucideIcon; title: string; lead?: string; text: string };

export const USPSection = ({
  eyebrow = "Why IAmTalento",
  first = "Everything Your Team Needs",
  second = "To Hire With Proof.",
  description = <>Six advantages built into every step of your hiring journey, from search to final decision.
    <br className="hidden md:block" /> Each one is included at no extra cost.</>,
  items,
  image = recruiterImage,
  boxed = false,
}: {
  eyebrow?: string;
  first?: string;
  second?: string;
  description?: React.ReactNode;
  items: USPItem[];
  image?: string;
  boxed?: boolean;
}) => (
  <section aria-labelledby="employer-benefits-heading" className="bg-card py-20 md:py-28">
    <div className="container">
      <div className={cn(boxed && "rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10")}>
      <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 id="employer-benefits-heading" className="mb-5 font-display text-3xl font-bold leading-[1.08] tracking-normal sm:text-4xl lg:text-5xl">
          {first}<br />
          <span className="text-primary">{second}</span>
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
      </motion.div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start gap-8 lg:mt-16 lg:flex-row lg:gap-16">
        <div className="w-full lg:sticky lg:top-28 lg:w-[45%] lg:shrink-0">
          <img src={image} alt="Recruiter reviewing candidates in a bright workplace" className="aspect-[4/3] w-full rounded-lg object-cover lg:aspect-[4/5]" width={1408} height={1056} loading="lazy" />
          <div className="mt-6 flex items-start gap-4 border-l-2 border-primary pl-5">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <p className="font-display text-xl font-semibold leading-snug tracking-normal">{first}.<br /><span className="text-primary">{second}</span></p>
          </div>
        </div>
        <ol className="w-full divide-y divide-border border-y border-border">
          {items.map(({ icon: Icon, title, lead, text }, index) => (
            <li key={title} className="flex items-start gap-4 py-6 sm:gap-6 sm:py-7">
              <span aria-hidden="true" className="pt-1 font-display text-sm font-semibold tabular-nums text-muted-foreground/60">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <h3 className="mb-2 font-display text-xl font-bold tracking-normal sm:text-2xl">{title}</h3>
                {lead && <p className="mb-2 font-display text-base font-semibold leading-snug text-foreground sm:text-lg">{lead}</p>}
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
              <Icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
            </li>
          ))}
        </ol>
      </div>
      </div>
    </div>
  </section>
);

/* ---------- Premium solutions: eight linked service cards ---------- */
const premiumSolutions = [
  { icon: Search, title: "Talent Hunt", text: "Create professional, ATS-friendly resumes." },
  { icon: Briefcase, title: "Job Posting", text: "Publish vacancies and attract relevant candidates." },
  { icon: ScanLine, title: "AI Resume Screening", text: "Identify and shortlist suitable candidates." },
  { icon: Megaphone, title: "Job Advertising", text: "Promote vacancies to expand your reach." },
  { icon: ClipboardCheck, title: "Custom Assessments", text: "Evaluate candidates against role-specific skills." },
  { icon: Palette, title: "White-Label Platform", text: "Launch a hiring experience under your brand." },
  { icon: GraduationCap, title: "Bulk & Campus Hiring", text: "Manage high-volume recruitment at scale." },
  { icon: Wand2, title: "AI Test Generator", text: "Create role-specific tests to assess talent." },
];

export const PremiumSolutionsSection = () => (
  <section aria-label="Premium hiring solutions" className="py-20 md:py-28">
    <div className="container">
      <CenterIntro
        eyebrow="TalentCIR · Premium Solutions"
        first="One Platform. 8 Powerful Hiring Solutions."
        description={<>Everything your hiring team needs, from resume screening to large-scale recruitment. Explore our AI-powered solutions and choose the services that fit your hiring goals.</>}
      />
      <p className="mx-auto -mt-6 mb-10 max-w-2xl text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary">Explore a solution to view its plans and pricing.</p>
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {premiumSolutions.map(({ icon: Icon, title, text }, i) => (
          <motion.div {...reveal} key={title}>
            <Link
              to="/pricing?tab=employers"
              aria-label={`${title} plans and pricing`}
              className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                <span aria-hidden="true" className="font-display text-sm font-semibold tabular-nums text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display text-lg font-bold tracking-normal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary">
                View Plans & Pricing <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

