import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2, ArrowRight, Star, Sparkles, Shield, Eye, MessageSquare,
  Clock, Award, Users, TrendingUp, HelpCircle, X, Zap, Building2, Briefcase,
  FileSearch, Crown, Target, BarChart3, Layers
} from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionBadge from "@/components/ui/section-badge";

/* ─── Plans ─── */
const plans = [
  {
    name: "Free Plan", price: "₹0", period: "Forever free", popular: false,
    tagline: "Everything to get started",
    features: ["Company profile page", "Up to 2 active job postings", "Browse unverified profiles (₹99/view)", "Basic applicant management"],
    cta: "Get started free", icon: Building2,
  },
  {
    name: "More Job Postings", price: "₹2,999", period: "per pack of 5", popular: false,
    tagline: "Post more. Reach more.",
    features: ["5+ active job postings", "Standard platform visibility", "Full applicant management", "Filter by skills, location, experience", "Email notifications"],
    cta: "Post more jobs", icon: Briefcase,
  },
  {
    name: "Verified Profile Access", price: "₹2,999", period: "per verified profile", popular: false,
    tagline: "See the score before the interview.",
    features: ["Full verified candidate profile", "Score report + skill breakdown", "Peer percentile rank", "Contact details unlocked", "AI proctoring integrity report", "Unverified profiles at ₹99 each"],
    cta: "Access profiles", icon: FileSearch,
  },
  {
    name: "Subscription (CPVPV)", price: "₹2,499", period: "/month per verified profile", popular: true,
    tagline: "Hire at scale. Pay for what you use.",
    features: ["Cost-per-verified-profile-view model", "Unlimited profile browsing", "Advanced search: score, domain, location", "Saved candidate shortlists & notes", "Monthly billing — cancel anytime", "Best for teams hiring 5+ roles/month"],
    cta: "Start subscription", icon: Target,
  },
  {
    name: "Custom Tests", price: "₹400", period: "per test / ₹250 bulk", popular: false,
    tagline: "Test for your role. Not a generic one.",
    features: ["Role-specific assessments", "Set your own passing threshold", "AI-ranked shortlist in 48 hours", "Full submission audit trail", "White-label bulk at ₹250/test", "Fast-tracked to your pipeline"],
    cta: "Create your test", icon: Layers,
  },
  {
    name: "Premium Job Listing", price: "₹1,00,000", period: "/month", popular: false,
    tagline: "Maximum reach. Maximum visibility.",
    features: ["Featured placement in search", "Homepage brand showcase", "Weekly email to 50,000+ candidates", "Bulk course access (₹9,999 value)", "Dedicated account manager", "Hiring analytics dashboard", "Priority support (4hr SLA)"],
    cta: "Contact sales", icon: Crown,
  },
];

const PlansSection = () => (
  <section className="py-20 md:py-24">
    <div className="container px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
        <SectionBadge label="Choose Your Plan" icon={Sparkles} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          Start Hiring Free. Upgrade Only<br /><span className="text-primary">When You Need More</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">From free job posts to verified profiles and premium reach, choose what fits your team —<br className="hidden md:block" />scale only when hiring demands it.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div key={p.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className={`relative flex flex-col rounded-2xl border p-6 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                p.popular ? "ring-2 ring-primary border-primary shadow-lg" : "border-border hover:border-primary/30"
              }`}>
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="h-3 w-3 fill-primary-foreground" /> MOST POPULAR
                </span>
              )}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${p.popular ? "bg-primary text-primary-foreground" : "bg-primary/10"}`}>
                  <Icon className={`h-5 w-5 ${p.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <h3 className="text-sm font-bold font-display text-foreground">{p.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{p.tagline}</p>
              <div className="mb-1">
                <span className="text-2xl font-bold font-display text-foreground">{p.price}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{p.period}</span>
              </div>
              <div className="h-px bg-border my-4" />
              <ul className="flex-1 space-y-2.5 mb-5">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button className={`w-full gap-2 text-sm font-semibold rounded-xl h-10 ${p.popular ? "shadow-md" : ""}`} variant={p.popular ? "default" : "outline"} size="sm">
                {p.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ─── Why Talento vs Generic ─── */
const WhyTalento = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="The Difference" icon={TrendingUp} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          The Difference Between Posting Jobs<br /><span className="text-primary">And Finding the Right Person</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">Move beyond crowded job boards and compare a verified, skills-first hiring experience —<br className="hidden md:block" />see the difference before you choose.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-7">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center"><X className="h-3 w-3 text-destructive" /></div>
            Generic job boards
          </h3>
          {["Anyone can apply regardless of skill level", "You read 300 resumes to find 3 worth interviewing", "No way to verify what candidates actually know", "67% of candidates exaggerate skills", "High cost-per-hire, low signal-to-noise", "Average time to shortlist: 3–4 weeks"].map(t => (
            <div key={t} className="flex items-center gap-3 py-3 text-sm text-muted-foreground border-b border-border/60 last:border-0">
              <X className="h-4 w-4 text-destructive/60 shrink-0" /> {t}
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl border-2 border-primary bg-card p-7 shadow-lg">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-primary" /></div>
            Talento
          </h3>
          {["Every verified candidate has a score you can trust", "Filter by skill score, domain, experience", "AI-proctored — tamper-proof, employer-trusted", "Custom challenges in real conditions", "Average time to qualified shortlist: 48 hours", "74% reduction in unqualified interviews"].map(t => (
            <div key={t} className="flex items-center gap-3 py-3 text-sm text-foreground font-medium border-b border-border/60 last:border-0">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {t}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── How Hiring Works ─── */
const howSteps = [
  { step: 1, title: "Post your role or challenge", desc: "Free job posting or paid custom assessment. Set your skills, experience level, and passing threshold. Live in under 10 minutes.", icon: Briefcase },
  { step: 2, title: "Candidates apply or get matched", desc: "Verified candidates with matching scores are surfaced to your listing. Browse and reach out by score.", icon: Users },
  { step: 3, title: "Review verified profiles", desc: "Every shortlisted candidate comes with a full score report, skill breakdown, peer rank, and AI proctoring certificate.", icon: FileSearch },
  { step: 4, title: "Hire with confidence", desc: "Skip screening rounds. Start at the technical interview. Your first call is a second interview.", icon: Award },
];

const HowHiringWorks = () => (
  <section className="py-20 md:py-24">
    <div className="container px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="How it works" icon={Clock} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          From Posting Your Role to a Shortlist<br /><span className="text-primary">In Just 48 Hours</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">Post your role, meet matched candidates, review verified evidence, and move confidently —<br className="hidden md:block" />from opening to shortlist.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {howSteps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-10 w-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">{s.step}</span>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold font-display text-foreground mb-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ─── Feature Comparison Table ─── */
const compFeatures = [
  { feature: "Company profile", values: ["✓", "✓", "✓", "✓", "✓", "✓"] },
  { feature: "Free job postings", values: ["2", "5+", "2", "2", "2", "Unlimited"] },
  { feature: "Browse unverified profiles", values: ["✓", "✓", "✓", "✓", "✓", "✓"] },
  { feature: "Verified profile access", values: ["—", "—", "₹2,999/view", "₹2,499/mo", "—", "✓"] },
  { feature: "Score + skill report", values: ["—", "—", "✓", "✓", "✓", "✓"] },
  { feature: "Custom test creation", values: ["—", "—", "—", "—", "✓", "✓"] },
  { feature: "White-label bulk tests", values: ["—", "—", "—", "—", "₹250/test", "✓"] },
  { feature: "AI-ranked shortlist", values: ["—", "—", "—", "—", "✓", "✓"] },
  { feature: "Featured job placement", values: ["—", "—", "—", "—", "—", "✓"] },
  { feature: "Bulk course access", values: ["—", "—", "—", "—", "—", "✓"] },
  { feature: "Account manager", values: ["—", "—", "—", "—", "—", "✓"] },
  { feature: "Analytics dashboard", values: ["—", "—", "—", "✓", "✓", "✓"] },
];
const empColHeaders = ["Free", "Jobs ₹2,999", "Profile Access", "Subscription", "Custom Tests", "Premium"];

const EmployerComparisonTable = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="Compare Plans" icon={Eye} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          Compare Every Hiring Plan Clearly<br /><span className="text-primary">At a Glance</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">Review posting limits, verified profile access, assessments, and support in one clear view —<br className="hidden md:block" />choose the right fit for your team.</p>
      </motion.div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              <th className="text-left p-4 font-bold text-foreground">Feature</th>
              {empColHeaders.map(h => <th key={h} className="p-4 font-bold text-foreground text-center min-w-[90px] text-xs">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {compFeatures.map((row, i) => (
              <tr key={row.feature} className={`border-b border-border/60 last:border-0 ${i % 2 === 0 ? "" : "bg-accent/20"}`}>
                <td className="p-4 text-muted-foreground font-medium">{row.feature}</td>
                {row.values.map((v, j) => (
                  <td key={j} className="p-4 text-center">
                    {v === "✓" ? <CheckCircle2 className="h-4 w-4 text-primary mx-auto" /> :
                     v === "—" ? <span className="text-muted-foreground/30">—</span> :
                     <span className="text-xs font-semibold text-foreground">{v}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

/* ─── ROI Calculator ─── */
const ROICalculator = () => {
  const [roles, setRoles] = useState([5]);
  const costPerHire = 85000;
  const saving = roles[0] * costPerHire * 0.4;
  return (
    <section className="py-20 md:py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <SectionBadge label="Calculate your ROI" icon={BarChart3} />
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
            See What a Bad Hire Can Really<br /><span className="text-primary">Cost Your Team</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            The average cost-per-hire in India is ₹85,000, while one bad hire can drain months of productivity —<br className="hidden md:block" />calculate what stronger screening could save.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {[
            { value: "₹85,000", label: "Average cost-per-hire in India" },
            { value: "3–6 months", label: "Lost productivity per bad hire" },
            { value: "48 hours", label: "Talento's time to verified shortlist" },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold font-display text-primary mb-2">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl border-2 border-primary bg-card p-8 text-center shadow-lg">
          <p className="text-base font-semibold text-foreground mb-5">How many roles do you hire per month?</p>
          <div className="max-w-sm mx-auto mb-5">
            <Slider value={roles} onValueChange={setRoles} min={1} max={50} step={1} />
            <p className="text-3xl font-bold font-display text-foreground mt-4">{roles[0]} roles/month</p>
          </div>
          <div className="h-px bg-border my-6" />
          <p className="text-sm text-muted-foreground mb-1">Estimated saving vs traditional hiring:</p>
          <p className="text-4xl font-bold font-display text-primary mt-2">₹{saving.toLocaleString("en-IN")}<span className="text-base font-normal text-muted-foreground">/month</span></p>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Case Studies ─── */
const caseStudies = [
  { quote: "We used to spend 3 weeks screening for every frontend role. With Talento custom challenges, we got 840 submissions, an AI-ranked shortlist of 12, and made 3 offers in 48 hours.", name: "Priya R., Talent Lead", company: "Zepto", result: "Reduced time-to-shortlist by 78%" },
  { quote: "The verified profile access is the most honest signal we've found. The score report tells us more in 2 minutes than a CV ever did. We've cut our interview-to-offer ratio from 8:1 to 3:1.", name: "Aarav K., VP Engineering", company: "Razorpay", result: "3x improvement in interview-to-offer ratio" },
  { quote: "We run quarterly hiring challenges on Talento. It's become part of our employer brand. Top candidates seek us out because they know we hire on merit.", name: "Meera S., Head of Talent", company: "Atlassian India", result: "2,300 registrations per challenge on average" },
];

const CaseStudies = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="Results from real companies" icon={MessageSquare} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          See Why Leading Companies Choose<br /><span className="text-primary">Skills-First Hiring</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">See how skills-first teams shortened screening and made stronger hiring decisions —<br className="hidden md:block" />with verified evidence at every step.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-5">
        {caseStudies.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />)}</div>
            <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">"{c.quote}"</p>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-bold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.company}</p>
              <div className="mt-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
                <p className="text-xs font-semibold text-primary flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {c.result}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── FAQ ─── */
const faqs = [
  { q: "Is it really free to post a job?", a: "Yes. You can post up to 2 jobs and browse unverified profiles at no cost. You only pay when you want to access verified profiles or create custom assessments." },
  { q: "What's the difference between verified and unverified profiles?", a: "Unverified profiles are browsable at ₹99 each — they have standard resume information. Verified profiles include a full AI-proctored score report, skill breakdown, peer rank, and integrity certificate." },
  { q: "Can we build tests specific to our tech stack?", a: "Yes. The custom test builder (₹400/test) lets you specify the skills, difficulty level, and passing threshold. You can also run white-label bulk tests at ₹250/test." },
  { q: "How does the subscription model work?", a: "The CPVPV subscription is ₹2,499 per verified profile per month. Unlimited browsing access, billed monthly with no lock-in." },
  { q: "What's included in the premium job posting?", a: "Premium listings at ₹1,00,000/month include featured placement, weekly email to 50,000+ candidates, dedicated account manager, bulk course access, and analytics dashboard." },
  { q: "How quickly do we get a shortlist after a custom challenge?", a: "AI-ranked shortlists are delivered within 48 hours. Top 10% performers are automatically flagged and fast-tracked." },
  { q: "Do candidates know they're being proctored?", a: "Yes — full transparency. Candidates consent before they begin. This increases submission quality." },
  { q: "Can we trial the platform before committing?", a: "Yes. Create your free profile and post up to 2 jobs at no cost. Explore with unverified profiles at ₹99 before upgrading." },
];

const FAQSection = () => (
  <section className="py-20 md:py-24">
    <div className="container px-4 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="Common questions" icon={HelpCircle} />
        <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          What Hiring Teams Want to Know<br /><span className="text-primary">Before Getting Started</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">Get clear answers about job posts, verified profiles, custom tests, and subscriptions —<br className="hidden md:block" />before your team gets started.</p>
      </motion.div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-5 bg-card hover:shadow-sm transition-shadow">
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

/* ─── Bottom CTA — Red Banner ─── */
const BottomCTA = () => (
  <section className="py-6 md:py-10">
    <div className="container px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 md:px-14 md:py-18">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary-foreground/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-primary-foreground/5 translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-foreground/[0.03]" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] text-primary-foreground mb-3">
            Your Next Great Hire Is Already<br /><span className="text-primary-foreground/80">Verified on Talento</span>
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/70 mb-8">
            Discover skilled professionals by verified score, domain expertise, and experience level —<br className="hidden md:block" />start building a stronger shortlist today.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link to="/contact"><Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-bold rounded-full h-12 px-8 shadow-lg">Post a job free <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/contact"><Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold rounded-full h-12 px-8">Book a demo</Button></Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["200+ companies", "Free to start", "No hidden fees", "Cancel anytime", "48h to shortlist"].map(s => (
              <span key={s} className="text-xs text-primary-foreground/50 font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Content ─── */
const PricingEmployersContent = () => (
  <>
    <PlansSection />
    <WhyTalento />
    <HowHiringWorks />
    <EmployerComparisonTable />
    <ROICalculator />
    <CaseStudies />
    <FAQSection />
    <BottomCTA />
  </>
);

export default PricingEmployersContent;
