import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Bot, Building2, CalendarClock, Cable, CheckCircle2, CirclePlay, Code2, Fingerprint,
  GraduationCap, Library, Lock, Megaphone, MessageSquare, Mic, Palette, Quote, Send, ShieldCheck, Sparkles,
  Star, UserCog, Users, Wand2, Briefcase, Globe2, Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import interviewer from "@/assets/webinar-speaker-3.jpg";
import p1 from "@/assets/speaker-arjun.jpg";
import p2 from "@/assets/speaker-kavya.jpg";
import p3 from "@/assets/speaker-meera.jpg";
import p4 from "@/assets/speaker-rohan.jpg";
import v1 from "@/assets/mock-interview-1.jpg";
import v2 from "@/assets/mock-interview-2.jpg";
import v3 from "@/assets/mock-interview-3.jpg";
import teamImage from "@/assets/employer-team.jpg";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

export const CenterIntro = ({ eyebrow, first, second, description, invert = false }: {
  eyebrow: string; first: string; second: string; description: React.ReactNode; invert?: boolean;
}) => (
  <motion.div {...reveal} className="mx-auto mb-12 max-w-2xl text-center">
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
    <h2 className={cn("mb-5 font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl", invert && "text-background")}>
      {first}<br /><span className="text-primary">{second}</span>
    </h2>
    <p className={cn("text-sm leading-relaxed md:text-base", invert ? "text-background/70" : "text-muted-foreground")}>{description}</p>
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
      </motion.figure>
    </div>
  </section>
);

/* ---------- AI interviewer (dark) ---------- */
const interviewPoints = [
  { icon: Mic, title: "Natural voice conversations", text: "Adaptive follow-ups based on every answer." },
  { icon: CalendarClock, title: "Available 24/7", text: "Candidates interview whenever suits them." },
  { icon: Fingerprint, title: "Identity & integrity checks", text: "Face match and voice originality analysis." },
  { icon: BarChart3, title: "Instant scored reports", text: "Structured scores your team can compare." },
];
export const AIInterviewerSection = () => (
  <section className="bg-foreground py-20 md:py-28">
    <div className="container">
      <CenterIntro invert eyebrow="AI Interviewer" first="Meet Your Always-On" second="AI Interviewer." description={<>Run first-round interviews at scale without adding recruiter hours.<br className="hidden md:block" /> Every candidate gets a fair, consistent conversation.</>} />
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-6">{interviewPoints.slice(0, 2).map(p => <Point key={p.title} {...p} align="right" />)}</div>
        <motion.div {...reveal} className="relative mx-auto">
          <div className="h-64 w-64 overflow-hidden rounded-full border-4 border-primary/60 shadow-2xl md:h-72 md:w-72">
            <img src={interviewer} alt="AI interviewer avatar" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground" /> Interview in progress
          </span>
        </motion.div>
        <div className="space-y-6">{interviewPoints.slice(2).map(p => <Point key={p.title} {...p} />)}</div>
      </div>
      <div className="mt-14 text-center">
        <Button asChild size="lg" className="gap-2"><Link to="/contact"><CirclePlay className="h-4 w-4" /> Try the AI Interviewer</Link></Button>
      </div>
    </div>
  </section>
);
const Point = ({ icon: Icon, title, text, align }: { icon: typeof Mic; title: string; text: string; align?: "right" }) => (
  <motion.div {...reveal} className={cn("flex gap-4", align === "right" && "md:flex-row-reverse md:text-right")}>
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary"><Icon className="h-5 w-5" /></span>
    <div><h3 className="font-display text-base font-bold text-background">{title}</h3><p className="mt-1 text-sm text-background/65">{text}</p></div>
  </motion.div>
);

/* ---------- One platform: the 6 requested points ---------- */
const platformPoints = [
  { icon: Library, title: "Skill Assessment Library", text: "Ready-made, proctored tests for every role" },
  { icon: ShieldCheck, title: "20 Layers of Cheating Prevention", text: "AI proctoring across the entire test journey" },
  { icon: Wand2, title: "Custom AI Assessment Creation", text: "Build role-specific tests in minutes" },
  { icon: Palette, title: "White-Label Branding", text: "Your brand on every assessment touchpoint" },
  { icon: GraduationCap, title: "Bulk Campus Hiring & Screening", text: "Screen thousands of candidates at once" },
  { icon: Bot, title: "Create AI Scheduled Interviews", text: "Automated interview rounds, hands-free" },
];
export const PlatformSection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <CenterIntro eyebrow="One Platform" first="Everything It Takes," second="In One Platform." description={<>Assess, proctor, brand, and interview without juggling separate tools.<br className="hidden md:block" /> Six capabilities, one connected workflow.</>} />
      <div className="mx-auto grid max-w-5xl gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {platformPoints.map(({ icon: Icon, title, text }, i) => (
          <motion.div {...reveal} transition={{ duration: 0.5, delay: i * 0.06 }} key={title} className="group bg-card p-8 text-center transition-colors hover:bg-accent/40">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-6 w-6" /></span>
            <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">0{i + 1}</p>
            <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 text-center"><Button asChild size="lg" className="gap-2"><Link to="/contact">Book a Demo <ArrowRight className="h-4 w-4" /></Link></Button></div>
    </div>
  </section>
);

/* ---------- Conversational hiring (chat demo) ---------- */
const prompts = [
  { q: "Find React developers in Bengaluru with 3+ years", a: "Found 42 verified profiles. Top 5 score above 88% on React & TypeScript assessments." },
  { q: "Invite the top 5 to an AI interview tomorrow", a: "Done — 5 interview invites scheduled for tomorrow, 10:00–16:00 IST." },
  { q: "Compare the two strongest candidates", a: "Aarav leads on system design (92%); Diya leads on communication (95%). Both pass integrity checks." },
];
export const ConversationSection = () => {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-accent/45 py-20 md:py-28">
      <div className="container">
        <CenterIntro eyebrow="Hiring Copilot" first="Hiring at the Speed" second="Of Conversation." description={<>Just ask in plain language and the copilot searches, schedules, and compares.<br className="hidden md:block" /> Your recruiters stay in control.</>} />
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {prompts.map((p, i) => (
              <Button key={p.q} size="sm" variant={active === i ? "default" : "outline"} onClick={() => setActive(i)} className="h-auto whitespace-normal py-2 text-xs">{p.q}</Button>
            ))}
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xl">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-xs font-semibold"><Sparkles className="h-4 w-4 text-primary" /> IAmTalento Copilot</div>
            <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-6">
              <div className="ml-auto max-w-[80%] rounded-lg rounded-br-none bg-primary px-4 py-3 text-sm text-primary-foreground">{prompts[active].q}</div>
              <div className="flex max-w-[85%] gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary"><Bot className="h-4 w-4" /></span>
                <div className="rounded-lg rounded-tl-none bg-secondary px-4 py-3 text-sm">{prompts[active].a}</div>
              </div>
            </motion.div>
            <div className="flex items-center gap-2 border-t border-border p-3">
              <Input readOnly value="Ask anything about your candidates…" className="text-muted-foreground" />
              <Button size="icon" aria-label="Send" onClick={() => setActive((active + 1) % prompts.length)}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- People insights (dark dashboard) ---------- */
const people = [
  { name: "Arjun Rao", role: "Engineering", img: p1, score: 91 },
  { name: "Kavya Shah", role: "Design", img: p2, score: 88 },
  { name: "Meera Iyer", role: "Product", img: p3, score: 94 },
  { name: "Rohan Das", role: "Data", img: p4, score: 86 },
];
export const PeopleInsightsSection = () => (
  <section className="bg-foreground py-20 md:py-28">
    <div className="container">
      <CenterIntro invert eyebrow="Talent Intelligence" first="See the People Behind" second="Your Organisation." description={<>Map skills across teams to spot gaps, upskill, and promote from within.<br className="hidden md:block" /> One live view of your workforce.</>} />
      <motion.div {...reveal} className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-background/15 bg-card shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <p className="font-display font-bold">Skills overview</p>
          <div className="flex gap-2 text-xs">{["All teams", "Engineering", "Product"].map((t, i) => <span key={t} className={cn("rounded-full px-3 py-1", i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary")}>{t}</span>)}</div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map(p => (
            <div key={p.name} className="rounded-lg border border-border p-4 text-center">
              <img src={p.img} alt={p.name} className="mx-auto h-16 w-16 rounded-full object-cover" loading="lazy" />
              <p className="mt-3 text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.role}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary" style={{ width: `${p.score}%` }} /></div>
              <p className="mt-2 text-xs font-semibold text-primary">{p.score}% skill index</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

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
  { img: v1, name: "Rahul Verma", role: "TA Lead, IT Services", quote: "Campus drives that took a month now finish in a week." },
  { img: v2, name: "Priya Nair", role: "HR Director, Retail", quote: "Proctoring reports gave our managers real confidence." },
  { img: v3, name: "Vikram Singh", role: "CTO, SaaS startup", quote: "The AI interviews feel human and save my engineers hours." },
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
