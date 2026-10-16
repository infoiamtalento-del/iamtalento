import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ShieldCheck,
  ListChecks,
  Lock,
  Check,
  Smartphone,
  CreditCard,
  Landmark,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS, getAssessment } from "@/data/assessments";
import { MANDATORY_TESTS } from "@/pages/assessment/AssessmentDiscovery";
import { getSubDomains, subDomainPrice } from "@/data/subDomains";
import { savePaidOrder } from "@/data/practiceQuestions";
import { SubDomainPicker, AssessmentCart, cartTotals, formatINR } from "@/components/assessments/SubDomainPicker";
import MarketingExperts from "@/components/assessments/MarketingExperts";
import AssessmentVideoCard from "@/components/assessments/AssessmentVideoCard";
import { MandatoryCoreTestsSection } from "@/components/assessments/MandatoryCoreTests";
import { AssessmentStickyBar } from "@/components/assessments/AssessmentStickyBar";
import BrandLogo from "@/components/ui/BrandLogo";
import { useState } from "react";


const paymentMethods = [
  { name: "UPI", icon: Smartphone, note: "GPay, PhonePe, Paytm" },
  { name: "Credit / Debit Card", icon: CreditCard, note: "Visa, Mastercard, RuPay" },
  { name: "Net Banking", icon: Landmark, note: "All major Indian banks" },
];

/* ---- shared, compact section heading ---- */
const SectionHeading = ({ title, desc }: { title: string; desc: string }) => (
  <div className="max-w-2xl mb-8">
    <span className="mb-3 block h-1 w-10 rounded-full bg-[#0d5cb2]" />
    <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2 text-slate-900">{title}</h2>
    <p className="text-slate-600 text-sm md:text-base leading-relaxed">{desc}</p>
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
    <div
      style={
        {
          "--primary": "211.3 86.4% 37.5%",
          "--primary-foreground": "0 0% 100%",
          "--ring": "211.3 86.4% 37.5%",
          "--primary-glow": "211.3 86.4% 37.5%",
          "--accent": "211 40% 96%",
          "--accent-foreground": "211.3 86.4% 37.5%",
        } as React.CSSProperties
      }
    >
      <Helmet>
        <title>{a.title} — I Am Talento</title>
        <meta name="description" content={a.description} />
      </Helmet>
      <Layout>
        {/* ============ HERO BANNER ============ */}
        <section className="bg-[#f8fafd] pt-28 pb-12 md:pt-36 md:pb-16 border-b border-blue-100">
          <div className="container">
            <Link
              to="/assessments/explore"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> All assessments
            </Link>

            <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                    {a.domain}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                    {a.difficulty}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Proctored
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-[1.15] mb-4 text-slate-900">{a.title}</h1>
                <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">{a.description}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#0d5cb2]" /> {a.duration}
                  </span>
                  <span>{a.questionCount} questions</span>
                  <span>{a.type} assessment</span>
                  <span>For {a.experienceLevels.join(", ")}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-7">
                  <Button
                    size="lg"
                    className="gap-2 font-bold cursor-pointer bg-[#0d5cb2] text-white hover:bg-[#0a4d96] shadow-md shadow-[#0d5cb2]/25"
                    onClick={goToPayment}
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 font-semibold cursor-pointer bg-white/80 border-slate-300 text-slate-700 hover:bg-white hover:text-slate-900 shadow-2xs"
                    onClick={goToJourney}
                  >
                    <ListChecks className="h-4 w-4 text-slate-500" />
                    <span>View Curriculum</span>
                  </Button>
                  <span className="text-sm text-slate-600 ml-1">
                    <span className="font-extrabold text-slate-900">{formatINR(cart.total)}</span> · 4 tests + CIR report
                  </span>
                </div>
              </div>

              <AssessmentVideoCard />
            </div>
          </div>
        </section>

        {/* ============ TEST JOURNEY ============ */}
        <section id="journey" className="py-12 md:py-16 scroll-mt-24">
          <div className="container">
            <SectionHeading
              title="What you'll take"
              desc={`Three core career tests come first, then one focused ${a.domain} test.`}
            />

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
              <div className="space-y-6">
                <MandatoryCoreTestsSection />

                <div className="flex items-center gap-3" aria-hidden="true">
                  <div className="h-px flex-1 bg-amber-300/80" />
                  <span className="yellow-graded-badge rounded-full px-4 py-1 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
                    Step 2 · Choose Domain Courses &amp; Fee Structure
                  </span>
                  <div className="h-px flex-1 bg-amber-300/80" />
                </div>

                <div className="yellow-graded-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="yellow-graded-btn rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                        Domain Assessment Track
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">
                        {a.duration} · {a.questionCount} questions · {a.type}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900">{a.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {a.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-amber-50 border border-amber-300/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-950"
                      >
                        {skill}
                      </span>
                    ))}
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
        <section className="py-12 md:py-16 border-t border-slate-200/80 bg-slate-50/40">
          <div className="container">
            <SectionHeading
              title="Built by practising experts"
              desc="Every question is written and reviewed by professionals from leading companies."
            />

            {a.industry === "Marketing" ? (
              <MarketingExperts />
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4.5 flex items-center gap-4 shadow-2xs"
                >
                  <img
                    src={c.photo}
                    alt={c.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="font-display font-bold text-slate-900 truncate">{c.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-500">
                      <BrandLogo name={c.company} size="xs" /> <span className="truncate">{c.title} · {c.company}</span>
                    </p>
                    <p className="text-xs text-[#0d5cb2] font-semibold mt-1">{c.experience}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>



        {/* ============ PAYMENT ============ */}
        <section id="payment" className="py-12 md:py-16 scroll-mt-24 pb-28 md:pb-32 bg-slate-50/30">
          <div className="container">
            <SectionHeading
              title="Complete payment and start"
              desc="One payment covers all three core tests, your domain test and your verified report."
            />

            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 items-start">
              <div className="yellow-graded-section rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-extrabold text-slate-900">Order &amp; Fee Summary</h3>
                  <span className="yellow-graded-badge rounded-full px-3 py-1 text-xs font-extrabold">
                    {selectedSubs.length} course{selectedSubs.length === 1 ? "" : "s"} + 3 core tests
                  </span>
                </div>
                <ul className="divide-y divide-amber-200/70 text-sm">
                  {MANDATORY_TESTS.map((m) => (
                    <li key={m.name} className="flex justify-between items-center gap-4 py-3">
                      <span className="text-slate-800 font-semibold">{m.name}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 text-[10px] font-bold shrink-0">
                        FREE · Included
                      </span>
                    </li>
                  ))}
                  {selectedSubs.map((s) => (
                    <li key={s.id} className="flex justify-between items-center gap-4 py-3">
                      <span className="text-slate-900 font-bold">
                        {s.name} <span className="text-xs text-slate-500 font-medium">(3 rounds · 6 tests · ₹333/test)</span>
                      </span>
                      <span className="font-extrabold text-slate-900 shrink-0">{formatINR(subDomainPrice(s))}</span>
                    </li>
                  ))}
                  <li key="cir-report" className="flex justify-between items-center gap-4 py-3">
                    <span className="text-slate-800 font-semibold">Career Intelligence Report (CIR)</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 text-[10px] font-bold shrink-0">
                      Included
                    </span>
                  </li>
                  <li key="gst" className="flex justify-between items-center gap-4 py-3">
                    <span className="text-slate-600 font-medium">GST (18%)</span>
                    <span className="text-slate-700 font-semibold shrink-0">{formatINR(cart.gst)}</span>
                  </li>
                </ul>
                <div className="flex justify-between items-baseline pt-5 mt-3 border-t border-amber-300 font-display text-lg font-extrabold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-2xl text-[#0d5cb2] font-extrabold">{formatINR(cart.total)}</span>
                </div>
              </div>

              <div className="yellow-graded-section rounded-2xl p-6 shadow-md">
                <h3 className="font-display font-extrabold text-slate-900 mb-5">Pay with</h3>
                <div className="grid gap-3 mb-6">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setMethod(m.name)}
                      className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all cursor-pointer ${
                        method === m.name
                          ? "yellow-graded-border-selected shadow-xs ring-2 ring-amber-400/40"
                          : "yellow-graded-border hover:shadow-xs"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          method === m.name ? "yellow-graded-btn text-slate-950" : "bg-amber-100/80 text-amber-900"
                        }`}
                      >
                        <m.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-slate-900">{m.name}</span>
                        <span className="block text-[11px] font-normal text-slate-600">{m.note}</span>
                      </span>
                      {method === m.name && <Check className="h-4 w-4 shrink-0 text-amber-700 stroke-[3]" />}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="yellow-graded-btn w-full py-3.5 px-5 rounded-xl inline-flex items-center justify-center gap-2 font-display text-sm sm:text-base font-extrabold cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
                  onClick={start}
                  disabled={selectedSubs.length === 0}
                >
                  <Lock className="h-4 w-4" /> Pay {formatINR(cart.total)} &amp; Start Assessment <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-slate-600 text-center mt-3 font-medium">
                  Secure checkout · You'll run a quick device check next.
                </p>
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
    </div>
  );
};

export default AssessmentDetail;
