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
  MessageSquareText,
  BrainCircuit,
  Compass,
  CircleCheckBig,
  Smartphone,
  CreditCard,
  Landmark,
  FileBarChart2,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS, getAssessment } from "@/data/assessments";
import { MANDATORY_TESTS } from "@/pages/assessment/AssessmentDiscovery";
import CredibilityTrustSection from "@/components/assessments/CredibilityTrustSection";
import bannerImg from "@/assets/assessment-banner.jpg";
import ctaBandImg from "@/assets/assessment-cta-band.jpg";
import reportImg from "@/assets/step-report.jpg";
import proctorImg from "@/assets/step-proctoring.jpg";
import dashboardImg from "@/assets/carousel-dashboard.jpg";
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

const mandatoryIcons = [MessageSquareText, BrainCircuit, Compass];

const paymentMethods = [
  { name: "UPI", icon: Smartphone, note: "GPay, PhonePe, Paytm" },
  { name: "Credit / Debit Card", icon: CreditCard, note: "Visa, Mastercard, RuPay" },
  { name: "Net Banking", icon: Landmark, note: "All major Indian banks" },
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
  const goToPayment = () => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Helmet>
        <title>{a.title} — I Am Talento</title>
        <meta name="description" content={a.description} />
      </Helmet>
      <Layout>
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-accent/60 via-accent/25 to-background pt-28 pb-12 md:pt-36 md:pb-14">
          <div className="pointer-events-none absolute -top-28 right-[-8%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <Link to="/assessments/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" /> All assessments
            </Link>

            <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
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
                <Button className="w-full gap-2" onClick={goToPayment}>
                  Start Assessment <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll run a quick device check first.
                </p>
              </div>
            </div>

            {/* Image banner */}
            <div className="relative mt-10 overflow-hidden rounded-2xl border border-border shadow-[0_28px_60px_-40px_hsl(var(--foreground)/0.45)]">
              <img
                src={bannerImg}
                alt="Professionals preparing for a proctored assessment"
                width={1920}
                height={800}
                className="h-52 w-full object-cover md:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-3 p-5 md:p-7">
                <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                  Proctored session
                </span>
                <span className="text-xs font-semibold text-background md:text-sm">
                  Identity check · Camera, mic and screen monitoring · Verified CIR report
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Test structure */}
        <section className="py-14 md:py-20 bg-secondary/30">
          <div className="container">
            <div className="max-w-3xl mb-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                <ListChecks className="h-4 w-4" /> Your complete test journey
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-3">
                What's In Your<br /><span className="text-primary">Complete Assessment.</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Begin with three essential career checks, then prove your expertise{" "}<br className="hidden md:block" />
                through one focused {a.domain} assessment.
              </p>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-6 items-start">
              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-background overflow-hidden">
                  <div className="flex flex-col gap-2 border-b border-border bg-accent/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-display text-lg font-bold">Mandatory Core Tests</p>
                      <p className="text-sm text-muted-foreground">Included by default for every candidate</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      <CircleCheckBig className="h-3.5 w-3.5" /> 3 selected
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3">
                    {MANDATORY_TESTS.map((m, index) => {
                      const MandatoryIcon = mandatoryIcons[index] ?? ListChecks;
                      return (
                        <label key={m.name} className="flex cursor-default gap-3 border-b border-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                          <input type="checkbox" checked readOnly aria-label={`${m.name}, mandatory and selected`} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
                          <span>
                            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <MandatoryIcon className="h-4.5 w-4.5" />
                            </span>
                            <span className="block font-display text-sm font-bold mb-1">{m.name}</span>
                            <span className="block text-xs leading-relaxed text-muted-foreground">{m.text}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="relative flex items-center gap-3 px-2" aria-hidden="true">
                  <div className="h-px flex-1 bg-border" />
                  <span className="rounded-full border border-primary/20 bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">Then continue to</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="rounded-lg border-2 border-primary/25 bg-background overflow-hidden shadow-[0_16px_40px_-28px_hsl(var(--foreground)/0.3)]">
                  <div className="grid md:grid-cols-[minmax(0,1fr)_210px]">
                    <div className="p-6 md:p-7">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">Domain-specific test</span>
                        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">{a.difficulty}</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold mb-2">{a.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground mb-6">{a.description}</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {testParts.map((t, index) => (
                          <div key={t.name} className="border-t-2 border-primary/25 pt-3">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <t.icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="text-xs font-bold">0{index + 1} · {t.name}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">{t.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between border-t border-border bg-accent/40 p-6 md:border-l md:border-t-0">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Test snapshot</p>
                        <dl className="space-y-4">
                          {[
                            ["Duration", a.duration],
                            ["Questions", String(a.questionCount)],
                            ["Format", a.type],
                            ["Monitoring", "Proctored"],
                          ].map(([label, value]) => (
                            <div key={label} className="flex items-end justify-between gap-3 border-b border-border pb-2">
                              <dt className="text-xs text-muted-foreground">{label}</dt>
                              <dd className="text-sm font-bold text-right">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {a.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold text-muted-foreground border border-border">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rounded-lg bg-foreground p-5 text-background lg:sticky lg:top-24">
                <img
                  src={dashboardImg}
                  alt="Candidate viewing an assessment dashboard"
                  width={800}
                  height={1024}
                  loading="lazy"
                  className="mb-5 h-28 w-full rounded-lg object-cover"
                />
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-5">Assessment plan</p>
                <div className="space-y-5">
                  <div>
                    <p className="font-display text-3xl font-bold text-background">4</p>
                    <p className="text-xs text-background/65">tests in one journey</p>
                  </div>
                  <div className="h-px bg-background/15" />
                  <div>
                    <p className="font-display text-3xl font-bold text-background">3 + 1</p>
                    <p className="text-xs text-background/65">core plus domain-specific</p>
                  </div>
                  <div className="h-px bg-background/15" />
                  <div className="flex items-start gap-2 text-xs leading-relaxed text-background/75">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                    One secure, proctored session with a verified result.
                  </div>
                  <Button className="w-full gap-2" onClick={goToPayment}>
                    Start Assessment <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* CTA banner — CIR report */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_30px_70px_-45px_hsl(var(--primary))]">
              <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-stretch">
                <div className="relative z-10 p-7 md:p-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-5">
                    <FileBarChart2 className="h-3.5 w-3.5" /> Included with every assessment
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3">
                    Your Score, Strengths and Next Steps<br className="hidden md:block" />
                    <span className="text-primary-foreground/80">In One Verified Report.</span>
                  </h2>
                  <p className="text-sm md:text-base text-primary-foreground/85 max-w-lg leading-relaxed mb-6">
                    Finish the session and your Career Intelligence Report is generated the same day.<br className="hidden md:block" />
                    Share it with employers or keep it for your own roadmap.
                  </p>
                  <Button
                    variant="secondary"
                    className="gap-2 bg-background text-primary hover:bg-background/90"
                    onClick={goToPayment}
                  >
                    Get Your Report <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative min-h-[190px] md:min-h-[280px]">
                  <img
                    src={reportImg}
                    alt="Career Intelligence Report shown on a laptop and printed page"
                    width={800}
                    height={600}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/55 to-primary/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creators */}
        <section className="py-12 md:py-16 bg-secondary/40">
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
                <div
                  key={c.name}
                  className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 flex gap-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_22px_45px_-30px_hsl(var(--foreground)/0.45)]"
                >
                  <span className="absolute inset-x-0 top-0 h-1 bg-primary/0 transition-colors group-hover:bg-primary/70" />
                  <div className="relative shrink-0">
                    <img src={c.photo} alt={c.name} width={64} height={64} loading="lazy" className="h-16 w-16 rounded-xl object-cover border border-border" />
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                  </div>
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
        <section className="py-14 md:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 lg:gap-12 items-start">
              <div className="lg:sticky lg:top-24">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                  <ShieldCheck className="h-4 w-4" /> Proctoring
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                  Your Assessment.<br /><span className="text-primary">Secure and Fair.</span>
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every session runs through layered integrity checks —<br className="hidden md:block" />
                  so your score means exactly what it says.
                </p>
                <div className="relative overflow-hidden rounded-2xl border border-border shadow-[0_28px_60px_-45px_hsl(var(--foreground)/0.5)]">
                  <img
                    src={proctorImg}
                    alt="Candidate taking a proctored online assessment"
                    width={800}
                    height={600}
                    loading="lazy"
                    className="h-56 w-full object-cover md:h-72"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4">
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      Live monitoring
                    </span>
                    <span className="text-xs font-bold text-background">8 integrity layers · full audit trail</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {proctoringLayers.map((l, i) => (
                  <motion.div
                    key={l.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/35 hover:bg-accent/25"
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
          </div>
        </section>

        {/* CTA banner — start now */}
        <section className="py-12 md:py-16 bg-secondary/40">
          <div className="container">
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <img
                src={ctaBandImg}
                alt="Professional ready to start her assessment"
                width={1600}
                height={608}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/92 via-foreground/75 to-foreground/25" />
              <div className="relative p-7 md:p-12 max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground mb-4">
                  <Sparkles className="h-3.5 w-3.5" /> One session
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3 text-background">
                  Four Tests. One Verified Result.<br className="hidden md:block" />
                  <span className="text-primary">Ready In About An Hour.</span>
                </h2>
                <p className="text-sm md:text-base text-background/80 leading-relaxed mb-6">
                  Pay once, complete every test in a single proctored session,<br className="hidden md:block" />
                  and walk away with a report employers can verify.
                </p>
                <Button size="lg" className="gap-2" onClick={goToPayment}>
                  Start Now <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section id="payment" className="py-14 pb-20 scroll-mt-24">
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
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display font-bold">Order summary</p>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">4 tests included</span>
                </div>
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
                  {paymentMethods.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setMethod(m.name)}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${method === m.name ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${method === m.name ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        <m.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block">{m.name}</span>
                        <span className="block text-[11px] font-normal text-muted-foreground">{m.note}</span>
                      </span>
                      {method === m.name && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  ))}
                </div>
                <Button className="w-full gap-2" size="lg" onClick={start}>
                  <Lock className="h-4 w-4" /> Pay ₹{DOMAIN_PRICE + GST} & Start <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-primary" /> Secure checkout</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> Proctored integrity</span>
                  <span className="flex items-center gap-1"><BadgeCheck className="h-3 w-3 text-primary" /> Verified result</span>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">You'll run a quick device check next.</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AssessmentDetail;
