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
  Users,
  type LucideIcon,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS, getAssessment } from "@/data/assessments";
import { MANDATORY_TESTS } from "@/pages/assessment/AssessmentDiscovery";
import CredibilityTrustSection from "@/components/assessments/CredibilityTrustSection";
import ctaBandImg from "@/assets/assessment-cta-band.jpg";
import { getSubDomains, subDomainPrice } from "@/data/subDomains";
import { savePaidOrder } from "@/data/practiceQuestions";
import { SubDomainPicker, AssessmentCart, cartTotals, formatINR } from "@/components/assessments/SubDomainPicker";
import MarketingExperts from "@/components/assessments/MarketingExperts";
import AssessmentVideoCard from "@/components/assessments/AssessmentVideoCard";
import { MandatoryCoreTestsSection } from "@/components/assessments/MandatoryCoreTests";
import { AssessmentStickyBar } from "@/components/assessments/AssessmentStickyBar";
import AssessmentIntegritySection from "@/components/landing/AssessmentIntegritySection";
import BrandLogo from "@/components/ui/BrandLogo";
import { useState } from "react";


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

/* ---- shared, uniform section heading ---- */
const SectionHeading = ({
  eyebrow,
  eyebrowIcon: Icon,
  line1,
  line2,
  desc1,
  desc2,
}: {
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  line1: string;
  line2: string;
  desc1: string;
  desc2: string;
}) => (
  <div className="max-w-3xl mb-10">
    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-4">
      <Icon className="h-4 w-4" /> {eyebrow}
    </span>
    <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.15] mb-4">
      {line1}
      <br className="hidden md:block" /> <span className="text-primary">{line2}</span>
    </h2>
    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
      {desc1}
      <br className="hidden md:block" /> {desc2}
    </p>
  </div>
);

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const a = getAssessment(assessmentId);
  const [method, setMethod] = useState("UPI");

  const subDomainOptions = getSubDomains(a?.industry ?? "");
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const own = subDomainOptions.find((s) => s.name.toLowerCase() === a?.domain.toLowerCase());
    return [(own ?? subDomainOptions[0]).id];
  });
  const selectedSubs = subDomainOptions.filter((s) => selectedIds.includes(s.id));
  const cart = cartTotals(selectedSubs);
  const toggleSub = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  if (!a) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-3xl font-bold mb-3">Assessment not found</h1>
          <Button asChild>
            <Link to="/assessments/explore">Back to assessments</Link>
          </Button>
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

  const start = () => {
    savePaidOrder(a.id, {
      orderId: `TLN-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      subDomainIds: selectedIds,
      total: cart.total,
      paidAt: Date.now(),
    });
    navigate(`/assessments/${a.id}/prepare`);
  };
  const goToPayment = () => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" });
  const goToJourney = () => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Helmet>
        <title>{a.title} — I Am Talento</title>
        <meta name="description" content={a.description} />
      </Helmet>
      <Layout>
        {/* ============ HEADER ============ */}
        <section className="relative overflow-hidden bg-background pt-28 pb-14 md:pt-36 md:pb-16 border-b border-border/40">
          <div className="container relative">
            <Link
              to="/assessments/explore"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
            >
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
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">{a.description}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {a.duration}
                  </span>
                  <span>{a.questionCount} questions</span>
                  <span>{a.type} assessment</span>
                  <span>For {a.experienceLevels.join(", ")}</span>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 mt-6">
                  <Button size="lg" className="gap-2 font-bold cursor-pointer shadow-md" onClick={goToPayment}>
                    <span>Start Assessment</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 font-semibold cursor-pointer border-border/80 hover:bg-secondary"
                    onClick={goToJourney}
                  >
                    <ListChecks className="h-4 w-4 text-primary" />
                    <span>View Curriculum</span>
                  </Button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-1">
                    <span className="font-bold text-foreground text-sm">{formatINR(cart.total)}</span>
                    <span>· 4 tests + CIR report</span>
                  </div>
                </div>

                {/* Reassurance Grid & Skills */}
                <div className="mt-7 rounded-2xl border border-border/80 bg-background/90 p-5 shadow-xs backdrop-blur-xs">
                  <div className="grid sm:grid-cols-3 gap-4 pb-4 border-b border-border/60">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Proctored Session</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          ID verification, camera, microphone &amp; screen monitoring
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                        <ListChecks className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">4 Tests Included</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          3 core career tests plus 1 focused {a.domain} test
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                        <FileBarChart2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Verified CIR Report</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Same-day auditable result with employer share link
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3.5 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                      Core skills evaluated:
                    </span>
                    {a.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-secondary/80 border border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <AssessmentVideoCard />
            </div>
          </div>
        </section>

        {/* ============ TEST JOURNEY ============ */}
        <section id="journey" className="py-16 md:py-20 bg-muted/20 scroll-mt-24">
          <div className="container">
            <SectionHeading
              eyebrow="Inside this assessment"
              eyebrowIcon={ListChecks}
              line1="The Complete Test"
              line2="You'll Take."
              desc1="Three essential career checks come first, then one focused"
              desc2={`${a.domain} assessment proves your expertise.`}
            />

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
              <div className="space-y-6">
                <MandatoryCoreTestsSection />

                <div className="relative flex items-center gap-3 px-2" aria-hidden="true">
                  <div className="h-px flex-1 bg-border/80" />
                  <span className="rounded-full border border-border/80 bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Then continue to
                  </span>
                  <div className="h-px flex-1 bg-border/80" />
                </div>

                <div className="rounded-2xl border border-border/80 bg-background overflow-hidden shadow-xs">
                  <div className="p-6 md:p-7">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                        Domain-specific test
                      </span>
                      <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                        {a.difficulty}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2 text-foreground">{a.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground mb-6">{a.description}</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {testParts.map((t, index) => (
                        <div key={t.name} className="rounded-xl border border-border/70 bg-muted/10 p-3.5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-foreground">
                              <t.icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-xs font-bold text-foreground">0{index + 1} · {t.name}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-muted-foreground">{t.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border/80 bg-muted/30 p-6 md:p-7">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground/80 mb-3.5">Test snapshot</p>
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      {[
                        ["Duration", a.duration],
                        ["Questions", String(a.questionCount)],
                        ["Format", a.type],
                        ["Monitoring", "Proctored"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-border/80 bg-background p-3.5 flex flex-col justify-between shadow-2xs"
                        >
                          <dt className="text-xs text-muted-foreground">{label}</dt>
                          <dd className="text-sm sm:text-base font-bold text-foreground mt-1">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {a.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border/70 shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <SubDomainPicker
                  domainTitle={a.industry}
                  options={subDomainOptions}
                  selected={selectedIds}
                  onToggle={toggleSub}
                />
              </div>

              <AssessmentCart
                selected={selectedSubs}
                coreNames={MANDATORY_TESTS.map((m) => m.name)}
                onRemove={toggleSub}
                onCheckout={goToPayment}
              />
            </div>
          </div>
        </section>


        {/* ============ CREATORS ============ */}
        <section className="py-16 md:py-20 bg-secondary/40">
          <div className="container">
            <SectionHeading
              eyebrow="Assessment experts"
              eyebrowIcon={Users}
              line1="The Professionals Who"
              line2="Built This Test."
              desc1="Every question is written and reviewed by practising experts"
              desc2="from leading companies in this field."
            />

            {a.industry === "Marketing" ? (
              <MarketingExperts />
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((c) => (
                <div
                  key={c.name}
                  className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 flex gap-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_22px_45px_-30px_hsl(var(--foreground)/0.45)]"
                >
                  <span className="absolute inset-x-0 top-0 h-1 bg-primary/0 transition-colors group-hover:bg-primary/70" />
                  <div className="relative shrink-0">
                    <img
                      src={c.photo}
                      alt={c.name}
                      width={112}
                      height={112}
                      loading="lazy"
                      className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border border-border shadow-xs"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold">{c.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                      <BrandLogo name={c.company} size="xs" /> {c.title} · {c.company}
                    </p>
                    <p className="text-xs text-primary font-semibold mt-1">{c.experience}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.expertise.slice(0, 3).map((e) => (
                        <span key={e} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>

        <CredibilityTrustSection align="start" />

        {/* ============ PROCTORING ============ */}
        <AssessmentIntegritySection align="start" />

        {/* ============ CTA BAND — START NOW ============ */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 shadow-md">
              <img
                src={ctaBandImg}
                alt="Professional ready to start her assessment"
                width={1600}
                height={608}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 via-foreground/84 to-foreground/78 md:bg-gradient-to-r md:from-foreground/92 md:via-foreground/75 md:to-foreground/25" />
              <div className="relative p-8 md:p-12 max-w-xl">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-background mb-5">
                  <Sparkles className="h-4 w-4" /> One session
                </span>
                <h2 className="font-display text-xl md:text-3xl font-bold leading-[1.15] mb-4 text-background">
                  Four Tests, One Result
                  <br className="hidden md:block" /> <span className="text-background/75">In About An Hour.</span>
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-background/80 mb-7">
                  Pay once, complete every test in one proctored session,
                  <br className="hidden md:block" /> and get a report employers can verify.
                </p>
                <Button size="lg" className="gap-2 font-bold cursor-pointer" onClick={goToPayment}>
                  Start Now <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PAYMENT ============ */}
        <section id="payment" className="py-16 md:py-20 scroll-mt-24 pb-28 md:pb-36">
          <div className="container">
            <SectionHeading
              eyebrow="Payment"
              eyebrowIcon={Lock}
              line1="Complete Payment And"
              line2="Start Your Test."
              desc1="One payment covers your domain test, all three core tests"
              desc2="and your verified Career Intelligence Report."
            />

            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 items-start">
              <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-foreground">Order summary</h3>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                    {selectedSubs.length} sub-domain{selectedSubs.length === 1 ? "" : "s"} + 3 core tests
                  </span>
                </div>
                <ul className="divide-y divide-border/80 text-sm">
                  {MANDATORY_TESTS.map((m) => (
                    <li key={m.name} className="flex justify-between gap-4 py-3">
                      <span className="text-foreground">{m.name}</span>
                      <span className="text-primary font-semibold shrink-0">Included</span>
                    </li>
                  ))}
                  {selectedSubs.map((s) => (
                    <li key={s.id} className="flex justify-between gap-4 py-3">
                      <span className="text-foreground">
                        {s.name} <span className="text-xs text-muted-foreground">(3 rounds · 6 tests)</span>
                      </span>
                      <span className="font-semibold text-foreground shrink-0">{formatINR(subDomainPrice(s))}</span>
                    </li>
                  ))}
                  <li className="flex justify-between gap-4 py-3">
                    <span className="text-foreground">Career Intelligence Report</span>
                    <span className="text-primary font-semibold shrink-0">Included</span>
                  </li>
                  <li className="flex justify-between gap-4 py-3">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="text-muted-foreground shrink-0">{formatINR(cart.gst)}</span>
                  </li>
                </ul>
                <div className="flex justify-between pt-5 mt-3 border-t border-border/80 font-display text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatINR(cart.total)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs">
                <h3 className="font-display font-bold text-foreground mb-5">Pay with</h3>
                <div className="grid gap-3 mb-6">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setMethod(m.name)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer ${
                        method === m.name ? "border-primary bg-primary/5 text-primary shadow-xs" : "border-border/80 hover:border-foreground/30 bg-background"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          method === m.name ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                        }`}
                      >
                        <m.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-foreground">{m.name}</span>
                        <span className="block text-[11px] font-normal text-muted-foreground">{m.note}</span>
                      </span>
                      {method === m.name && <Check className="h-4 w-4 shrink-0 text-primary stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
                <Button className="w-full gap-2 font-bold cursor-pointer shadow-md" size="lg" onClick={start} disabled={selectedSubs.length === 0}>
                  <Lock className="h-4 w-4" /> Pay {formatINR(cart.total)} &amp; Start <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-primary" /> Secure checkout
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-primary" /> Proctored integrity
                  </span>
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3 text-primary" /> Verified result
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">You'll run a quick device check next.</p>
              </div>
            </div>
          </div>
        </section>
        <AssessmentStickyBar
          selected={selectedSubs}
          total={cart.total}
          onCheckout={goToPayment}
        />
      </Layout>
    </>
  );
};

export default AssessmentDetail;
