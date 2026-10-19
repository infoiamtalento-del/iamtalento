import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Building2, CalendarClock, Cable, CheckCircle2, CirclePlay, Code2, Fingerprint,
  GraduationCap, Library, Lock, Megaphone, MessageSquare, Mic, Palette, Quote, ShieldCheck, Sparkles,
  Star, UserCog, Users, Wand2, Briefcase, Globe2, Server, Type, Video, Volume2, MoreVertical, Play, Pause, FileText, PenTool, BadgePercent, Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import interviewer from "@/assets/webinar-speaker-3.jpg";
import p3 from "@/assets/speaker-meera.jpg";
import v1 from "@/assets/mock-interview-1.jpg";
import v2 from "@/assets/mock-interview-2.jpg";
import v3 from "@/assets/mock-interview-3.jpg";
import teamImage from "@/assets/employer-team.jpg";
import planPoster from "@/assets/assessment-video-thumb.jpg";


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
};

const CompanyMark = ({ name, className }: { name: string; className?: string }) => (
  <img
    src={companyMarks[name].src}
    alt={`${name} logo`}
    loading="lazy"
    className={cn("w-auto opacity-90 grayscale", companyMarks[name].size, className)}
  />
);



export const CenterIntro = ({ eyebrow, first, second, description, invert = false }: {
  eyebrow: string; first: string; second: string; description?: React.ReactNode; invert?: boolean;
}) => (
  <motion.div {...reveal} className="mx-auto mb-12 max-w-2xl text-center">
    <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.18em]", invert ? "text-primary-foreground/60" : "text-primary")}>{eyebrow}</p>
    <h2 className={cn("font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl", description && "mb-5", invert && "text-primary-foreground")}>
      {first}<br /><span className={invert ? "text-primary-foreground" : "text-primary"}>{second}</span>
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
  { icon: Wand2, title: "AI Assessment Builder", text: "Paste a JD and AI generates a role-specific assessment in seconds." },
  { icon: Library, title: "Pre-built Assessment Library", text: "200+ ready-made assessments across tech, finance, marketing, and more." },
  { icon: FileText, title: "Custom Questions", text: "Add your own questions, scenarios, and scoring rubrics." },
  { icon: Palette, title: "Custom Branding", text: "White-label the entire experience with your logo, colors, and domain." },
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
    <Link to="/contact"><CirclePlay className="h-4 w-4" /> Try the AI Interviewer</Link>
  </Button>
);

export const AIInterviewerSection = () => (
  <section className="bg-primary py-20 md:py-28">
    <div className="container">
      <CenterIntro invert eyebrow="AI Interviewer" first="Meet Your Always-On" second="AI Interviewer." description={<>Run first-round interviews at scale without adding recruiter hours.<br className="hidden md:block" /> Every candidate gets a fair, consistent conversation.</>} />
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <div className="order-2 space-y-5 md:order-none">{interviewPoints.slice(0, 4).map(p => <Point key={p.title} {...p} align="right" />)}</div>
        <div className="order-1 py-8 md:order-none md:px-2"><InterviewAvatar /></div>
        <div className="order-3 space-y-5 md:order-none">{interviewPoints.slice(4).map(p => <Point key={p.title} {...p} />)}</div>
      </div>
      <div className="mt-12 text-center"><InterviewCta /></div>
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
export const PlatformSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="One Platform" first="Everything It Takes," second="In One Platform." description={<>Assess, proctor, brand, and interview without juggling separate tools.<br className="hidden md:block" /> Six capabilities, one connected workflow.</>} />
      <div className="mx-auto grid max-w-7xl border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {platformPoints.map(({ title, text }, i) => (
          <motion.div {...reveal} transition={{ duration: 0.5, delay: i * 0.06 }} key={title} className={cn("group flex flex-col border-b border-r border-border p-8 transition-colors hover:bg-card md:p-10", i === 0 && "bg-card")}>
            <p className="text-sm font-semibold tracking-[0.15em] text-primary">0{i + 1}</p>
            <h3 className="mb-5 mt-10 font-serif text-3xl font-normal leading-tight tracking-normal text-foreground">{title}</h3>
            <p className="flex-1 text-base leading-relaxed text-muted-foreground">{text}</p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-primary">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 text-center"><Button asChild size="lg" className="gap-2"><Link to="/contact">Book a Demo <ArrowRight className="h-4 w-4" /></Link></Button></div>
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
        <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">AI Evaluation</p>
          <h2 className="mb-5 font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl">
            AI-Evaluate Candidates<br /><span className="text-primary">Like Your Top Recruiters Would.</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Enterprise-grade intelligence, form-level simplicity, and the precision of a Swiss watch.<br className="hidden md:block" /> One question in, a scored and evidence-backed report out.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2"><Link to="/contact">Try a Demo Test <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/assessments/explore">See Sample Report</Link></Button>
          </div>
          <p className="mt-4 -rotate-1 font-display text-sm italic text-muted-foreground">No login required <Sparkles className="ml-1 inline h-3.5 w-3.5 text-primary" /></p>
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
                  <p className="mt-2 text-sm leading-relaxed">&ldquo;Salesforce slows our reporting down &mdash; the export breaks on large datasets. I&rsquo;d rather have HubSpot, or a small custom dashboard built for our reporting.&rdquo;</p>
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
  { icon: FileText, label: "Resume" },
  { icon: Briefcase, label: "Job Posting" },
  { icon: ShieldCheck, label: "Verify Resume" },
  { icon: Megaphone, label: "Advertise My Job" },
  { icon: Wand2, label: "Create Own Assessment" },
  { icon: Palette, label: "Create Assessment with White Label" },
  { icon: Users, label: "Bulk Hiring" },
  { icon: GraduationCap, label: "Campus Hiring" },
  { icon: Sparkles, label: "Create AI Tests" },
];

export const PlanVideoSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="One Subscription" first="All-in-One AI Hiring" second="That Thinks Like You Do." />
      <motion.div {...reveal} className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <h3 className="font-serif text-3xl font-normal leading-tight tracking-normal text-foreground sm:text-4xl">What's included in your plan</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Everything your team needs to post, screen, assess and hire — in one subscription.</p>
          <ul className="mt-8 space-y-4">
            {planItems.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-sm"><Icon className="h-5 w-5 text-primary" /></span>
                <span className="text-sm font-semibold md:text-base">{label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Button asChild size="lg" className="gap-2 rounded-full px-8"><Link to="/contact">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
            <p className="mt-4 flex -rotate-1 items-center gap-2 font-hand text-lg text-foreground">
              No credit card required
              <span aria-hidden className="flex items-center gap-1">
                <span className="h-0.5 w-3 rounded-full bg-primary-glow" />
                <span className="h-0.5 w-2 rounded-full bg-primary-glow" />
                <span className="h-0.5 w-1.5 rounded-full bg-primary-glow" />
              </span>
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[28px] bg-accent p-5 md:p-9">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <span className="absolute left-[-12%] top-8 h-10 w-2/3 -rotate-6 rounded-full bg-background/50" />
            <span className="absolute right-[-16%] top-1/3 h-12 w-1/2 rotate-6 rounded-full bg-background/40" />
            <span className="absolute bottom-10 left-[-6%] h-9 w-3/5 -rotate-3 rounded-full bg-background/45" />
          </div>
          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm"><CirclePlay className="h-3.5 w-3.5" /> Product in 60 Sec</span>
            <video src="/product-in-60-sec.mp4" poster={planPoster} controls preload="metadata" playsInline className="aspect-[4/3] w-full rounded-2xl border border-border bg-background object-cover shadow-xl" />
          </div>
          <span className="pointer-events-none absolute left-2 top-[34%] hidden items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-lg md:flex"><Code2 className="h-3.5 w-3.5 text-primary" /> Python</span>
          <span className="pointer-events-none absolute left-5 top-[62%] hidden items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-lg md:flex"><PenTool className="h-3.5 w-3.5 text-primary" /> Design</span>
          <span className="pointer-events-none absolute right-3 top-[28%] hidden items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-lg lg:flex"><BadgePercent className="h-3.5 w-3.5 text-primary" /> Sales</span>
          <span className="pointer-events-none absolute right-6 top-[58%] hidden items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-lg lg:flex"><Table2 className="h-3.5 w-3.5 text-primary" /> Excel</span>
        </div>
      </motion.div>

    </div>
  </section>
);

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
  { img: v1, name: "Rahul Verma", role: "TA Lead, IT Services", company: "Infosys", quote: "Campus drives that took a month now finish in a week." },
  { img: v2, name: "Priya Nair", role: "HR Director, Retail", company: "Flipkart", quote: "Proctoring reports gave our managers real confidence." },
  { img: v3, name: "Vikram Singh", role: "CTO, SaaS startup", company: "Zoho", quote: "The AI interviews feel human and save my engineers hours." },
];

export const TestimonialsSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="Customer Stories" first="Trusted by Hiring Teams" second="Across India." description={<>Hear from leaders who moved to skills-first, evidence-backed hiring.<br className="hidden md:block" /> Real teams, real outcomes.</>} />
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {stories.map(s => (
          <motion.article {...reveal} key={s.name} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative">
              <img src={s.img} alt={s.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-card/90 text-primary shadow-lg"><CirclePlay className="h-6 w-6" /></span></span>
            </div>
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

/* ---------- Demo request form ---------- */
export const DemoFormSection = () => {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-accent/45 py-20 md:py-28">
      <div className="container">
        <CenterIntro eyebrow="Book a Demo" first="See IAmTalento in Action" second="Built for Your Team." description={<>Tell us about your hiring goals and we'll tailor a live walkthrough.<br className="hidden md:block" /> It takes 30 minutes.</>} />
        <motion.form {...reveal} onSubmit={e => { e.preventDefault(); setSent(true); toast({ title: "Demo requested", description: "Our team will reach out within one business day." }); }}
          className="mx-auto grid max-w-2xl gap-4 rounded-lg border border-border bg-card p-6 shadow-lg sm:grid-cols-2 md:p-8">
          <Input required placeholder="Full name" aria-label="Full name" />
          <Input required type="email" placeholder="Work email" aria-label="Work email" />
          <Input required placeholder="Company name" aria-label="Company name" />
          <Input placeholder="Hires per year" aria-label="Hires per year" />
          <Textarea placeholder="What would you like to see?" aria-label="Message" className="sm:col-span-2" />
          <Button type="submit" size="lg" className="gap-2 sm:col-span-2" disabled={sent}>
            {sent ? <><CheckCircle2 className="h-4 w-4" /> Request received</> : <>Request a Demo <MessageSquare className="h-4 w-4" /></>}
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:col-span-2"><Building2 className="h-3.5 w-3.5" /> No credit card required</p>
        </motion.form>
      </div>
    </section>
  );
};
