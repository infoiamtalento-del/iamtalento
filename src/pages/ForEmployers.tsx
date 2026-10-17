import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CirclePlay,
  LineChart,
  Building2,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AIInterviewerSection, PlatformSection, TeamsSection, IntegrationsSection, TestimonialsSection, DemoFormSection, TrustStats, AIEvaluateSection, PlanVideoSection } from "@/components/employers/EmployerShowcaseSections";
import campusImage from "@/assets/employer-campus-hiring.jpg";
import recruiterImage from "@/assets/employer-recruiter.jpg";
import candidateAnanya from "@/assets/learner-ananya.jpg";
import candidatePriya from "@/assets/learner-priya.jpg";
import candidateRahul from "@/assets/learner-rahul.jpg";
import googleLogo from "@/assets/company-logos/google.svg";
import microsoftLogo from "@/assets/company-logos/microsoft.svg";
import amazonLogo from "@/assets/company-logos/amazon.svg";
import accentureLogo from "@/assets/company-logos/accenture.svg";
import ibmLogo from "@/assets/company-logos/ibm.svg";
import oracleLogo from "@/assets/company-logos/oracle.svg";
import infosysLogo from "@/assets/company-logos/infosys.svg";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

const candidates = [
  { name: "Ananya Rao", role: "Senior Product Manager", match: 96, image: candidateAnanya },
  { name: "Karan Malhotra", role: "Product Manager", match: 92, image: candidateRahul },
  { name: "Sneha Iyer", role: "Product Lead", match: 88, image: candidatePriya },
];

const SectionIntro = ({ eyebrow, first, second, description, align = "left" }: {
  eyebrow: string;
  first: string;
  second: string;
  description: React.ReactNode;
  align?: "left" | "center";
}) => (
  <div className={cn(align === "center" && "mx-auto max-w-2xl text-center")}>
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
    <h2 className="mb-5 font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl">
      {first}<br />
      <span className="text-primary">{second}</span>
    </h2>
    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
  </div>
);

const CandidateList = ({ compact = false }: { compact?: boolean }) => (
  <div className="space-y-3">
    {candidates.map((candidate, index) => (
      <motion.div
        key={candidate.name}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45 + index * 0.12 }}
        className="flex items-center gap-3 rounded-lg border border-border/70 bg-background p-3"
      >
        <img src={candidate.image} alt="" className="h-10 w-10 rounded-full object-cover" width={40} height={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{candidate.name}</p>
          <p className="text-xs leading-snug text-muted-foreground sm:truncate">{candidate.role}</p>
        </div>
        <span className={cn("whitespace-nowrap rounded-full bg-success/10 font-bold text-success", compact ? "px-2 py-1 text-[10px]" : "px-2 py-1 text-[10px] sm:px-2.5 sm:text-xs")}>
          {candidate.match}% match
        </span>
      </motion.div>
    ))}
  </div>
);


const allUSPs = [
  { icon: Zap, title: "Lower Costs", text: "Reduce hiring costs by up to 50% compared with traditional recruitment methods." },
  { icon: Search, title: "Smart Screening", text: "AI-powered natural-language screening filters profiles against your role requirements." },
  { icon: ShieldCheck, title: "Verified Skills", text: "Access skill-verified candidate profiles backed by practical assessment evidence." },
  { icon: UserCheck, title: "Background Checks", text: "Complimentary background verification for every candidate adds confidence to your hiring decisions." },
  { icon: Users, title: "Team Workspace", text: "Collaborate on hiring decisions with shared tracking and automated updates." },
  { icon: BarChart3, title: "Clear Analytics", text: "Transparent hiring metrics and recruitment analytics keep every decision measurable." },
];

const USPSection = () => (
  <section aria-labelledby="employer-benefits-heading" className="bg-card py-20 md:py-28">
    <div className="container">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Why IAmTalento</p>
        <h2 id="employer-benefits-heading" className="mb-5 font-display text-3xl font-bold leading-[1.08] tracking-normal sm:text-4xl lg:text-5xl">
          Everything Your Team Needs<br />
          <span className="text-primary">To Hire With Proof.</span>
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Six advantages built into every step of your hiring journey, from search to final decision.
          <br className="hidden md:block" /> Each one is included at no extra cost.
        </p>
      </motion.div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start gap-8 lg:mt-16 lg:flex-row lg:gap-16">
        <div className="w-full lg:sticky lg:top-28 lg:w-[45%] lg:shrink-0">
          <img src={recruiterImage} alt="Recruiter reviewing candidates in a bright workplace" className="aspect-[4/3] w-full rounded-lg object-cover lg:aspect-[4/5]" width={1408} height={1056} loading="lazy" />
          <div className="mt-6 flex items-start gap-4 border-l-2 border-primary pl-5">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <p className="font-display text-xl font-semibold leading-snug tracking-normal">Everything Your Team Needs.<br /><span className="text-primary">To Hire With Proof.</span></p>
          </div>
        </div>
        <ol className="w-full divide-y divide-border border-y border-border">
          {allUSPs.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="flex items-start gap-4 py-6 sm:gap-6 sm:py-7">
              <span aria-hidden="true" className="pt-1 font-display text-sm font-semibold tabular-nums text-muted-foreground/60">0{index + 1}</span>
              <div className="min-w-0 flex-1">
                <h3 className="mb-2 font-display text-xl font-bold tracking-normal sm:text-2xl">{title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
              <Icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

const Hero = () => (
  <section className="relative overflow-hidden bg-background pb-16 pt-32 md:pb-24 md:pt-40">
    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-accent/60 to-transparent" />
    <div className="container relative">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">AI-Powered Hiring Platform</p>
          <h1 className="mb-6 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3rem] xl:text-6xl">
            Stop Guessing. Start Hiring<br />
            <span className="text-primary">With Proof.</span>
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Find, verify, rank, and track job-ready candidates with AI — while your recruiters stay firmly in control.
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 gap-2 px-7"><Link to="/contact">Book a Demo <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-6"><a href="#how-it-works"><CirclePlay className="h-5 w-5 text-primary" /> See How It Works</a></Button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Faster hiring</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Verified talent</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Recruiter in control</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }} className="relative">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles className="h-4 w-4 text-primary" /> Talent Search</div>
              <span className="text-[10px] text-muted-foreground">248 candidates</span>
            </div>
            <div className="grid md:grid-cols-[140px_1fr] lg:grid-cols-[112px_1fr]">
              <div className="hidden border-r border-border bg-secondary/30 p-4 md:block">
                {['Candidates', 'Jobs', 'Shortlist', 'Analytics'].map((item, index) => (
                  <div key={item} className={cn("mb-2 rounded-md px-2 py-2 text-[11px]", index === 0 ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground")}>{item}</div>
                ))}
              </div>
              <div className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-muted-foreground"><Search className="h-4 w-4" /> Senior Product Manager in Bengaluru</div>
                <CandidateList />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);


const logos = [
  { name: "Google", src: googleLogo }, { name: "Microsoft", src: microsoftLogo },
  { name: "Amazon", src: amazonLogo }, { name: "Accenture", src: accentureLogo },
  { name: "IBM", src: ibmLogo }, { name: "Oracle", src: oracleLogo }, { name: "Infosys", src: infosysLogo },
];

const LogoStrip = () => (
  <section className="border-y border-border/60 bg-background py-10">
    <div className="container">
      <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Trusted by growing businesses</p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-7">
        {logos.map((logo) => <img key={logo.name} src={logo.src} alt={logo.name} className="h-6 w-24 object-contain grayscale opacity-55 transition hover:grayscale-0 hover:opacity-100" loading="lazy" />)}
      </div>
    </div>
  </section>
);

const steps = [
  { icon: Building2, title: "Create Profile", text: "Create your company profile and introduce your team, culture, and hiring needs." },
  { icon: BriefcaseBusiness, title: "Post Jobs", text: "Publish a role with the skills, experience, and expectations that matter." },
  { icon: Search, title: "Talent Hunt", text: "Browse general profiles directly or explore selected candidates with verified profiles." },
  { icon: UserCheck, title: "Shortlist Together", text: "Compare evidence, review with your team, and move the right candidates to interviews." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-accent/45 py-20 md:py-28">
    <div className="container">
      <motion.div {...reveal}><SectionIntro align="center" eyebrow="How We Work" first="Your Next Great Hire." second="Four Clear Steps." description={<>Build your company presence and connect with the right talent.<br className="hidden md:block" /> Move from a new role to a confident shortlist.</>} /></motion.div>
      <motion.div {...reveal} className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-lg">
        <img src={campusImage} alt="Recruiters meeting a graduate at an Indian campus hiring event" className="aspect-[16/9] w-full object-cover md:aspect-[21/9]" width={1536} height={1024} loading="lazy" />
      </motion.div>
      <ol className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <motion.li {...reveal} key={title} className="relative rounded-lg bg-card p-6 text-center shadow-sm">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">0{index + 1}</span>
            <h3 className="mb-2 flex items-center justify-center gap-2 font-display text-base font-bold"><Icon className="h-4 w-4 text-primary" />{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
          </motion.li>
        ))}
      </ol>
      <div className="mt-10 text-center"><Button asChild size="lg" className="gap-2"><Link to="/employer-profile">Create Company Profile <ArrowRight className="h-4 w-4" /></Link></Button></div>
    </div>
  </section>
);

const faqs = [
  { q: "How quickly can we start?", a: "Your team can create an employer account, define a role, and launch its first assessment within minutes." },
  { q: "Can we create our own assessments?", a: "Yes. Build role-specific tests, use ready-made assessments, or let AI create one from your job description." },
  { q: "How are candidate results verified?", a: "Identity checks, secure proctoring, practical assessments, and consistent scoring create an evidence-backed profile." },
  { q: "Can our hiring team collaborate?", a: "Yes. Recruiters and hiring managers can review profiles, compare results, shortlist candidates, and track progress together." },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <motion.div {...reveal} className="mb-10"><SectionIntro align="center" eyebrow="Questions" first="Everything You Need" second="Before You Begin." description={<>Clear answers for teams considering skills-first hiring.<br className="hidden md:block" /> Need more detail? Our team is ready to help.</>} /></motion.div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item, index) => (
            <div key={item.q} className="overflow-hidden rounded-lg border border-border bg-card">
              <Button variant="ghost" onClick={() => setOpen(open === index ? null : index)} className="h-auto w-full justify-between rounded-none px-5 py-4 text-left">
                <span className="font-semibold">{item.q}</span><ChevronDown className={cn("h-4 w-4 transition-transform", open === index && "rotate-180")} />
              </Button>
              <AnimatePresence>{open === index && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</motion.p>}</AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section className="pb-20">
    <div className="container">
      <motion.div {...reveal} className="relative overflow-hidden rounded-lg bg-primary px-6 py-10 sm:px-10 md:py-12">
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div><h2 className="font-display text-3xl font-bold leading-tight text-primary-foreground md:text-4xl">Ready to Hire Better?</h2><p className="mt-2 text-sm text-primary-foreground/80 md:text-base">See how IAmTalento helps your team find the right people, faster.</p></div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/pricing?tab=employers">Explore Pricing <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/employer-profile">Create Company Profile</Link></Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const ForEmployers = () => (
  <>
    <Helmet>
      <title>For Employers — Hire Verified Talent Faster | IAmTalento</title>
      <meta name="description" content="Find, verify, rank, and hire job-ready talent with AI-powered search, assessments, and evidence-backed candidate profiles." />
      <meta property="og:title" content="IAmTalento for Employers — Hire with Proof" />
      <meta property="og:description" content="A clearer, faster hiring platform for verified talent and skills-first decisions." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </Helmet>
    <Layout>
      <Hero />
      <LogoStrip />
      <TrustStats />
      <AIInterviewerSection />
      <PlatformSection />
      <USPSection />
      <HowItWorks />
      <AIEvaluateSection />
      <TeamsSection />
      <PlanVideoSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <FAQSection />
      <DemoFormSection />
      <FinalCTA />
    </Layout>
  </>
);

export default ForEmployers;
