import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  CheckCircle2, ArrowRight, Star, Sparkles, Shield, Eye, MessageSquare,
  Clock, Award, Users, TrendingUp, HelpCircle, X, Zap, BookOpen, GraduationCap, Layers
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionBadge from "@/components/ui/section-badge";

/* ─── Plans ─── */
const plans = [
  {
    name: "Free Plan", price: "₹0", period: "Forever free", tag: "", popular: false,
    tagline: "Everything you need to get found",
    features: ["Create your profile", "AI resume builder", "AI video resume", "Apply to jobs individually", "Portfolio showcase page", "Freelancer account", "Quarterly webinar access", "Quarterly hackathon entry", "Quarterly networking meetup"],
    cta: "Get started free", ctaLink: "/auth", icon: Users,
  },
  {
    name: "Skill Test", price: "₹1,999", period: "1 year validity", tag: "", popular: false,
    tagline: "Prove your skill. Get the badge.",
    features: ["AI-proctored assessment", "Verified badge on your profile", "Full score report + skill breakdown", "Peer percentile rank (vs 50,000+)", "Industry readiness score", "Shareable certificate (PDF + LinkedIn)", "1 year validity", "Re-test available at ₹999"],
    cta: "Take a test", ctaLink: "/skill-assessment", icon: Shield,
  },
  {
    name: "1 Course", price: "₹1,999", period: "", tag: "", popular: false,
    tagline: "Learn from practitioners. Get certified.",
    features: ["Access to 1 full course (any domain)", "Expert-authored curriculum", "Course completion badge on profile", "Assessment included with course", "Course content valid for lifetime"],
    cta: "Browse courses", ctaLink: "/learning", icon: BookOpen,
  },
  {
    name: "2–3 Courses", price: "₹2,999 / ₹4,999", period: "", tag: "Best value", popular: true,
    tagline: "Build a skill stack. Stand out further.",
    features: ["Choose any 2 or 3 courses", "All course benefits included", "Multiple skill badges on profile", "Priority ranking in employer search", "Career intelligence report", "Save ₹999 on 2 courses, ₹999 on 3"],
    cta: "Buy courses", ctaLink: "/learning", icon: Layers,
  },
  {
    name: "Domain Bundle", price: "₹9,999", period: "", tag: "", popular: false,
    tagline: "Own your domain. Become the authority.",
    features: ["All courses within one domain", "Domain expert certification badge", "Top placement in recruiter search", "Full career intelligence suite", "30/60/90-day career roadmap", "Priority employer match notifications", "Most comprehensive option"],
    cta: "Get bundle", ctaLink: "/learning", icon: GraduationCap,
  },
];

const PlansSection = () => (
  <section className="py-20 md:py-24">
    <div className="container px-4 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
        <SectionBadge label="Choose Your Plan" icon={Sparkles} />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          One Test. One Badge.<br /><span className="text-primary">Career Advantage</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">Start free with essential career tools.<br className="hidden md:block" /><br className="hidden md:block" />Upgrade when you are ready.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {plans.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`relative flex flex-col rounded-2xl border p-6 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                p.popular ? "ring-2 ring-primary border-primary shadow-lg" : "border-border hover:border-primary/30"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="h-3 w-3 fill-primary-foreground" /> BEST VALUE
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
                {p.period && <span className="text-xs text-muted-foreground ml-1.5">· {p.period}</span>}
              </div>
              <div className="h-px bg-border my-4" />
              <ul className="flex-1 space-y-2.5 mb-5">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link to={p.ctaLink}>
                <Button className={`w-full gap-2 text-sm font-semibold rounded-xl h-10 ${p.popular ? "shadow-md" : ""}`} variant={p.popular ? "default" : "outline"} size="sm">
                  {p.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ─── Before / After Verification ─── */
const VerifiedGetsYou = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="The Difference" icon={TrendingUp} />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          See What Changes After You<br /><span className="text-primary">Get Verified</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">See how verification improves visibility.<br className="hidden md:block" /><br className="hidden md:block" />Compare real candidate outcomes.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-7">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center"><X className="h-3 w-3 text-destructive" /></div>
            Before verification
          </h3>
          {["Profile sits unranked in search", "Recruiters skip past you", "3 profile views per week on average", "0 recruiter messages", "You apply — and wait"].map(t => (
            <div key={t} className="flex items-center gap-3 py-3 text-sm text-muted-foreground border-b border-border/60 last:border-0">
              <X className="h-4 w-4 text-destructive/60 shrink-0" /> {t}
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl border-2 border-primary bg-card p-7 shadow-lg">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-primary" /></div>
            After verification (48 hours)
          </h3>
          {["Your score surfaces you in employer search", "34+ profile views per week", "7+ recruiter messages per week", "2+ interview calls per week", "Recruiters come to you"].map(t => (
            <div key={t} className="flex items-center gap-3 py-3 text-sm text-foreground font-medium border-b border-border/60 last:border-0">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {t}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── Feature Comparison Table ─── */
const comparisonFeatures = [
  { feature: "Profile creation", values: [true, true, true, true, true] },
  { feature: "AI resume builder", values: [true, true, true, true, true] },
  { feature: "AI video resume", values: [true, true, true, true, true] },
  { feature: "Apply to jobs", values: [true, true, true, true, true] },
  { feature: "Quarterly hackathon", values: [true, true, true, true, true] },
  { feature: "Quarterly webinar", values: [true, true, true, true, true] },
  { feature: "Verified badge", values: [false, true, true, true, true] },
  { feature: "Score report", values: [false, true, true, true, true] },
  { feature: "Peer rank", values: [false, true, true, true, true] },
  { feature: "Course access", values: [false, false, "1 course", "2–3 courses", "All in domain"] },
  { feature: "Career roadmap", values: [false, false, false, true, true] },
  { feature: "Domain certification", values: [false, false, false, false, true] },
  { feature: "Priority search rank", values: [false, false, false, true, true] },
  { feature: "Re-test pricing", values: ["—", "₹999", "—", "—", "—"] },
];
const colHeaders = ["Free", "Test", "1 Course", "2–3 Courses", "Bundle"];

const ComparisonTable = () => (
  <section className="py-20 md:py-24">
    <div className="container px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="Compare Plans" icon={Eye} />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          Compare Every Plan Clearly<br /><span className="text-primary">At a Glance</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">Compare every feature and access level.<br className="hidden md:block" /><br className="hidden md:block" />Choose your plan confidently.</p>
      </motion.div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              <th className="text-left p-4 font-bold text-foreground">Feature</th>
              {colHeaders.map(h => <th key={h} className="p-4 font-bold text-foreground text-center min-w-[90px]">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((row, i) => (
              <tr key={row.feature} className={`border-b border-border/60 last:border-0 ${i % 2 === 0 ? "" : "bg-accent/20"}`}>
                <td className="p-4 text-muted-foreground font-medium">{row.feature}</td>
                {row.values.map((v, j) => (
                  <td key={j} className="p-4 text-center">
                    {v === true ? <CheckCircle2 className="h-4 w-4 text-primary mx-auto" /> :
                     v === false ? <span className="text-muted-foreground/30">—</span> :
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

/* ─── How the Test Works ─── */
const howSteps = [
  { step: 1, title: "Pick your skill", desc: "Choose from 200+ assessments across tech, management, communication and design domains.", icon: Layers },
  { step: 2, title: "Take the AI-proctored test", desc: "Real-world scenario questions. Face detection, tab monitoring, audio analysis — no room to cheat.", icon: Shield },
  { step: 3, title: "Get your score instantly", desc: "Full report within 24 hours: overall score, peer percentile rank, skill-by-skill breakdown, and a 30/60/90-day improvement plan.", icon: Award },
  { step: 4, title: "Your badge goes live", desc: "Verified badge appears on your profile. 200+ companies are actively browsing verified candidates.", icon: Sparkles },
];

const HowItWorks = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="How it works" icon={Clock} />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          From Payment to Proof<br /><span className="text-primary">In Under 60 Minutes</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">Complete one secure assessment journey.<br className="hidden md:block" /><br className="hidden md:block" />Receive a result employers trust.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {howSteps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
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

/* ─── Testimonials ─── */
const testimonials = [
  { quote: "I took the React.js test on a Thursday. By Saturday morning I had 4 messages from recruiters. I hadn't changed anything else on my profile.", name: "Rohan K.", result: "Hired at Zepto · ₹22L package" },
  { quote: "The score report told me exactly where I was weak. I used the 30-day plan they gave me, retook it, scored 92, and got shortlisted at Flipkart within 3 weeks.", name: "Ananya S.", result: "Hired at Flipkart · Skipped 2 screening rounds" },
  { quote: "I was applying for 6 months with zero responses. After getting verified, I stopped applying. Recruiters started messaging me.", name: "Vikram M.", result: "Hired at Atlassian · 3 offers in 30 days" },
];

const Testimonials = () => (
  <section className="py-20 md:py-24">
    <div className="container px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="What they're saying" icon={MessageSquare} />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          Thousands Got Verified<br /><span className="text-primary">Here Is What Happened Next</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">See how proof created recruiter conversations.<br className="hidden md:block" /><br className="hidden md:block" />Hear real career outcomes.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-[hsl(33,100%,50%)] text-[hsl(33,100%,50%)]" />)}</div>
            <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">"{t.quote}"</p>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-bold text-foreground">{t.name}</p>
              <p className="text-xs text-primary font-semibold flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> {t.result}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-8">Average time from verification to first recruiter message: <span className="font-bold text-primary">48 hours</span></p>
    </div>
  </section>
);

/* ─── FAQ ─── */
const faqs = [
  { q: "How long does a test take?", a: "Most assessments take between 25 and 60 minutes depending on the skill and level. You'll see the exact duration before you begin." },
  { q: "What if I fail the test?", a: "Your score is only visible to employers if you choose to show it. You can retake any test at ₹999 — there's no waiting period." },
  { q: "How long is the verified badge valid for?", a: "All test results and badges are valid for 1 year from the date of your test. You can renew at the standard price after expiry." },
  { q: "Can employers see my score without my permission?", a: "No. Your verified badge is visible on your profile, but the full score report is only shared when you explicitly apply to a role or enable profile discovery." },
  { q: "What's the difference between a test and a course?", a: "A test verifies what you already know — it's a 1-hour assessment. A course teaches you the skill first, then assesses you at the end. Both result in a verified badge." },
  { q: "Is the domain bundle worth it?", a: "If you're serious about one domain — say, full-stack development or product management — the bundle gives you every course plus a domain expert certification badge that puts you at the top of recruiter searches." },
  { q: "Are courses live or recorded?", a: "Courses are self-paced and available on demand. Each course is authored by a senior practitioner currently working in that domain." },
];

const FAQSection = () => (
  <section className="py-20 md:py-24 bg-accent/30">
    <div className="container px-4 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <SectionBadge label="Common questions" icon={HelpCircle} />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] text-foreground mt-4 mb-3">
          What Candidates Ask<br /><span className="text-primary">Before Buying</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">Find answers about tests, badges, and access.<br className="hidden md:block" /><br className="hidden md:block" />Choose with confidence.</p>
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-[1.15] text-primary-foreground mb-3">
            Your Skills Deserve<br /><span className="text-primary-foreground/80">A Line on Your Resume</span>
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/70 mb-8">
            Get verified in one focused session and give employers a clearer reason to notice you —<br className="hidden md:block" />your next opportunity can start here.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link to="/auth"><Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-bold rounded-full h-12 px-8 shadow-lg">Start with the free plan <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/assessments/explore"><Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold rounded-full h-12 px-8">Take your first test — ₹1,999</Button></Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["18,731+ verified", "AI-proctored", "200+ companies hiring", "1 year valid"].map(s => (
              <span key={s} className="text-xs text-primary-foreground/50 font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page Content ─── */
const PricingCandidatesContent = () => (
  <>
    <PlansSection />
    <VerifiedGetsYou />
    <ComparisonTable />
    <HowItWorks />
    <Testimonials />
    <FAQSection />
    <BottomCTA />
  </>
);

export default PricingCandidatesContent;
