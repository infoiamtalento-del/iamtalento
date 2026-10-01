import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ShieldCheck,
  Camera,
  Mic,
  Monitor,
  AppWindow,
  Maximize,
  AlertTriangle,
  BadgeCheck,
  Fingerprint,
  ListChecks,
  Code2,
  Briefcase,
  Lock,
  Check,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS, getAssessment } from "@/data/assessments";
import { MANDATORY_TESTS } from "@/pages/assessment/AssessmentDiscovery";
import CredibilityTrustSection from "@/components/assessments/CredibilityTrustSection";
import { useState } from "react";

const proctoringLayers = [
  { icon: Fingerprint, name: "Identity verification", text: "Photo ID and face match before the test begins." },
  { icon: Camera, name: "Camera monitoring", text: "Continuous gaze and presence checks throughout." },
  { icon: Mic, name: "Microphone monitoring", text: "Ambient audio flags for unusual conversation." },
  { icon: Monitor, name: "Screen monitoring", text: "Screen activity recorded for the full session." },
  { icon: AppWindow, name: "Tab & browser activity", text: "Tab switches and copy attempts are logged." },
  { icon: Maximize, name: "Full-screen enforcement", text: "The test runs locked in full-screen mode." },
  { icon: AlertTriangle, name: "Suspicious activity detection", text: "AI flags anomalies in real time." },
  { icon: BadgeCheck, name: "Assessment integrity", text: "Every score is auditable and verifiable." },
];

const DOMAIN_PRICE = 1999;
const GST = Math.round(DOMAIN_PRICE * 0.18);

const testParts = [
  { icon: ListChecks, name: "MCQ", text: "Concept and knowledge questions on core domain topics." },
  { icon: Code2, name: "Technical", text: "Hands-on tasks and case problems that test applied skill." },
  { icon: Briefcase, name: "Experience-Based", text: "Real workplace scenarios matched to your experience level." },
];

const steps = [
  { n: "01", title: "Choose Your Assessment", text: "Pick the test that matches your skill and experience." },
  { n: "02", title: "Complete Pre-checks", text: "Verify identity, device, camera, mic and environment." },
  { n: "03", title: "Take the Assessment", text: "Answer the questions and complete practical tasks." },
  { n: "04", title: "Get Your CIR", text: "Receive your Career Intelligence Report instantly." },
];

const cirIncludes = [
  "Skill performance",
  "Assessment score",
  "Strength areas",
  "Improvement areas",
  "Skill-level insights",
  "Assessment verification",
];

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const a = getAssessment(assessmentId);
  const [method, setMethod] = useState("UPI");

  if (!a) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-3xl font-bold mb-3">Assessment not found</h1>
          <Button asChild><Link to="/assessments/explore">Back to assessments</Link></Button>
        </div>
      </Layout>
    );
  }

  const creators = Array.from(
    new Map(
      ASSESSMENTS.filter((x) => x.domain === a.domain || x.industry === a.industry)
        .sort((x) => (x.id === a.id ? -1 : 1))
        .map((x) => [x.creator.name, x.creator])
    ).values()
  ).slice(0, 6);
  const start = () => navigate(`/assessments/${a.id}/pre-check`);

  return (
    <>
      <Helmet>
        <title>{a.title} — I Am Talento</title>
        <meta name="description" content={a.description} />
      </Helmet>
      <Layout>
        {/* Header */}
        <section className="pt-10 pb-10 md:pt-14 bg-gradient-to-b from-accent/40 to-background">
          <div className="container">
            <Link to="/assessments/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" /> All assessments
            </Link>

            <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {a.domain}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary">
                    {a.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" /> Proctored
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">{a.title}</h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl">{a.description}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {a.duration}</span>
                  <span>{a.questionCount} questions</span>
                  <span>{a.type} assessment</span>
                  <span>For {a.experienceLevels.join(", ")}</span>
                </div>
              </div>

              <div className="w-full rounded-xl border border-border bg-background p-6">
                <p className="text-sm text-muted-foreground mb-1">Ready when you are</p>
                <h2 className="font-display text-xl font-bold mb-4">Start this assessment</h2>
                <ul className="space-y-2 mb-5 text-sm">
                  {[`${a.questionCount} questions`, a.duration, a.difficulty, "Proctored session"].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" /> {x}
                    </li>
                  ))}
                </ul>
                <Button className="w-full gap-2" onClick={() => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" })}>
                  Start Assessment <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll run a quick device check first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Test structure */}
        <section className="py-12">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              What's In Your<br /><span className="text-primary">{a.domain} Assessment.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              A domain-specific test in three parts, plus mandatory core tests —<br className="hidden md:block" />
              all in one proctored session.
            </p>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {testParts.map((t) => (
                <div key={t.name} className="rounded-xl border border-border bg-background p-5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <p className="font-display font-bold mb-1">{t.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-primary/20 bg-accent/40 p-5">
              <p className="text-sm font-semibold mb-3">Mandatory core tests (included)</p>
              <div className="flex flex-wrap gap-2.5">
                {MANDATORY_TESTS.map((m) => (
                  <span key={m.name} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-background border border-border">
                    <Check className="h-4 w-4 text-primary" /> {m.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {a.skills.map((sk) => (
                <span key={sk} className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">{sk}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Creators */}
        <section className="py-12 bg-secondary/40">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              The Experts Who<br /><span className="text-primary">Created This Test.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Every question is written and reviewed by practising professionals<br className="hidden md:block" />
              from leading companies.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((c) => (
                <div key={c.name} className="rounded-xl border border-border bg-background p-5 flex gap-4">
                  <img src={c.photo} alt={c.name} className="h-16 w-16 rounded-xl object-cover border border-border shrink-0" />
                  <div className="min-w-0">
                    <p className="font-display font-bold">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.title} · {c.company}</p>
                    <p className="text-xs text-primary font-semibold mt-1">{c.experience}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.expertise.slice(0, 3).map((e) => (
                        <span key={e} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CredibilityTrustSection />

        {/* Proctoring */}
        <section className="py-14">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Your Assessment.<br /><span className="text-primary">Secure and Fair.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Every session runs through layered integrity checks —<br className="hidden md:block" />
              so your score means exactly what it says.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {proctoringLayers.map((l, i) => (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-background p-5"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <l.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="font-semibold text-sm mb-1">{l.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{l.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment */}
        <section id="payment" className="py-14 pb-20 bg-secondary/40 scroll-mt-24">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Complete Payment and<br /><span className="text-primary">Start Your Assessment.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              One payment covers your domain test, all core tests<br className="hidden md:block" />
              and your verified CIR report.
            </p>
            <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 items-start">
              <div className="rounded-xl border border-border bg-background p-6">
                <p className="font-display font-bold mb-4">Order summary</p>
                <ul className="divide-y divide-border text-sm">
                  <li className="flex justify-between py-2.5"><span>{a.title} (MCQ · Technical · Experience)</span><span className="font-semibold">₹{DOMAIN_PRICE}</span></li>
                  {MANDATORY_TESTS.map((m) => (
                    <li key={m.name} className="flex justify-between py-2.5"><span>{m.name}</span><span className="text-primary font-semibold">Included</span></li>
                  ))}
                  <li className="flex justify-between py-2.5"><span>Career Intelligence Report</span><span className="text-primary font-semibold">Included</span></li>
                  <li className="flex justify-between py-2.5"><span>GST (18%)</span><span>₹{GST}</span></li>
                </ul>
                <div className="flex justify-between pt-4 mt-2 border-t border-border font-display text-lg font-bold">
                  <span>Total</span><span>₹{DOMAIN_PRICE + GST}</span>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-6">
                <p className="font-display font-bold mb-4">Pay with</p>
                <div className="grid gap-2 mb-5">
                  {["UPI", "Credit / Debit Card", "Net Banking"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${method === m ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}
                    >
                      {m}
                      {method === m && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
                <Button className="w-full gap-2" size="lg" onClick={start}>
                  <Lock className="h-4 w-4" /> Pay ₹{DOMAIN_PRICE + GST} & Start <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">Secure checkout. You'll run a quick device check next.</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const creators = Array.from(
    new Map(
      ASSESSMENTS.filter((x) => x.domain === a.domain || x.industry === a.industry)
        .sort((x) => (x.id === a.id ? -1 : 1))
        .map((x) => [x.creator.name, x.creator])
    ).values()
  ).slice(0, 6);
  const start = () => navigate(`/assessments/${a.id}/pre-check`);

  return (
    <>
      <Helmet>
        <title>{a.title} — I Am Talento</title>
        <meta name="description" content={a.description} />
      </Helmet>
      <Layout>
        {/* Header */}
        <section className="pt-10 pb-10 md:pt-14 bg-gradient-to-b from-accent/40 to-background">
          <div className="container">
            <Link to="/assessments/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" /> All assessments
            </Link>

            <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {a.domain}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary">
                    {a.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" /> Proctored
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-display leading-[1.15] mb-4">{a.title}</h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl">{a.description}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {a.duration}</span>
                  <span>{a.questionCount} questions</span>
                  <span>{a.type} assessment</span>
                  <span>For {a.experienceLevels.join(", ")}</span>
                </div>
              </div>

              <div className="w-full rounded-xl border border-border bg-background p-6">
                <p className="text-sm text-muted-foreground mb-1">Ready when you are</p>
                <h2 className="font-display text-xl font-bold mb-4">Start this assessment</h2>
                <ul className="space-y-2 mb-5 text-sm">
                  {[`${a.questionCount} questions`, a.duration, a.difficulty, "Proctored session"].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" /> {x}
                    </li>
                  ))}
                </ul>
                <Button className="w-full gap-2" onClick={() => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" })}>
                  Start Assessment <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll run a quick device check first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-12">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">What You'll Be Assessed On</h2>
            <div className="flex flex-wrap gap-2.5">
              {a.skills.map((s) => (
                <span key={s} className="text-sm font-medium px-4 py-2 rounded-lg border border-border bg-background">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Creator */}
        <section className="py-12 bg-secondary/40">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Built by People Who Know the Skill</h2>
            <p className="text-muted-foreground mb-6">
              {a.creator.kind === "company" ? "This assessment was created by a company practice team." : "This assessment was created by a practising expert."}
            </p>
            <div className="rounded-xl border border-border bg-background p-6 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative shrink-0 pr-3 pb-3">
                <img
                  src={a.creator.photo}
                  alt={a.creator.name}
                  className="h-20 w-20 rounded-xl border border-border object-cover shadow-sm"
                />
                <div
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-background bg-primary text-primary-foreground shadow-sm"
                  title={a.creator.company}
                >
                  <span className="font-display text-sm font-bold">{a.creator.company.charAt(0)}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-display text-lg font-bold">{a.creator.name}</p>
                <p className="text-sm text-muted-foreground">{a.creator.title} · {a.creator.company}</p>
                <p className="text-sm text-primary font-semibold mt-1">{a.creator.experience}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {a.creator.expertise.map((e) => (
                    <span key={e} className="text-[11px] font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proctoring */}
        <section className="py-14">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Your Assessment.<br /><span className="text-primary">Secure and Fair.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Every session runs through layered integrity checks —<br className="hidden md:block" />
              so your score means exactly what it says.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {proctoringLayers.map((l, i) => (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-background p-5"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <l.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="font-semibold text-sm mb-1">{l.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{l.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 bg-secondary/40">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">How the Assessment Works</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="rounded-xl border border-border bg-background p-5">
                  <span className="font-display text-2xl font-bold text-primary">{s.n}</span>
                  <p className="font-semibold mt-2 mb-1">{s.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video + CIR */}
        <section className="py-14">
          <div className="container grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">See How It Works</h2>
              <p className="text-muted-foreground mb-5">Watch a quick walkthrough before starting your assessment.</p>
              <div className="relative rounded-xl overflow-hidden border border-border bg-foreground/90 aspect-video flex items-center justify-center">
                <button className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform">
                  <Play className="h-6 w-6 ml-0.5" />
                </button>
                <span className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded bg-background/90">02:14</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="font-display text-xl font-bold mb-1">Get Your CIR Report</h3>
              <p className="text-sm text-muted-foreground mb-5">Your Career Intelligence Report includes:</p>
              <ul className="grid sm:grid-cols-2 gap-2.5 mb-6">
                {cirIncludes.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" /> {c}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/demo-profile">See Sample CIR Report</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-20">
          <div className="container">
            <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Ready to Prove Your Skills?</h2>
              <p className="opacity-90 mb-6">
                {a.title} · {a.questionCount} Questions · {a.duration} · {a.difficulty} · Proctored
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button size="lg" variant="secondary" className="gap-2" onClick={start}>
                  Start Assessment <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Review Assessment Details
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AssessmentDetail;
