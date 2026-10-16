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
  Search,
  Building2,
  BriefcaseBusiness,
  ChevronDown,
  SlidersHorizontal,
  Layers3,
  FileQuestion,
  Gauge,
  Shield,
  X,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS, DOMAINS, EXPERIENCE_LEVELS, INDUSTRIES, getAssessment } from "@/data/assessments";
import { MANDATORY_TESTS } from "@/pages/assessment/AssessmentDiscovery";
import { getSubDomains, subDomainPrice } from "@/data/subDomains";
import { savePaidOrder } from "@/data/practiceQuestions";
import { SubDomainPicker, AssessmentCart, cartTotals, formatINR } from "@/components/assessments/SubDomainPicker";
import MarketingExperts from "@/components/assessments/MarketingExperts";
import AssessmentVideoCard from "@/components/assessments/AssessmentVideoCard";
import { MandatoryCoreTestsSection } from "@/components/assessments/MandatoryCoreTests";
import { AssessmentStickyBar } from "@/components/assessments/AssessmentStickyBar";
import BrandLogo from "@/components/ui/BrandLogo";
import { useEffect, useState } from "react";


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

  // Search bar state pre-populated with current assessment (e.g. Digital Marketing)
  const [query, setQuery] = useState<string>(a?.domain ?? "Digital Marketing");
  const [industry, setIndustry] = useState<string | null>(a?.industry ?? "Marketing");
  const [domain, setDomain] = useState<string | null>(a?.domain ?? "Digital Marketing");
  const [experience, setExperience] = useState<string | null>(a?.experienceLevels?.[1] ?? a?.experienceLevels?.[0] ?? "1–3 yrs");
  const [testType, setTestType] = useState<string | null>(a?.type ?? null);
  const [difficulty, setDifficulty] = useState<string | null>(a?.difficulty ?? null);
  const [proctoredOnly, setProctoredOnly] = useState<boolean>(a?.proctored ?? true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const subDomainOptions = getSubDomains(a?.industry ?? "");
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const own = subDomainOptions.find((s) => s.name.toLowerCase() === a?.domain.toLowerCase());
    return [(own ?? subDomainOptions[0]).id];
  });

  useEffect(() => {
    if (!a) return;
    setQuery(a.domain);
    setIndustry(a.industry);
    setDomain(a.domain);
    setExperience(a.experienceLevels?.[1] ?? a.experienceLevels?.[0] ?? null);
    setTestType(a.type);
    setDifficulty(a.difficulty);
    setProctoredOnly(a.proctored);
    const nextSubs = getSubDomains(a.industry);
    const own = nextSubs.find((s) => s.name.toLowerCase() === a.domain.toLowerCase());
    setSelectedIds([(own ?? nextSubs[0]).id]);
  }, [a?.id]);

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

  const domains = industry ? DOMAINS[industry] ?? [] : [];
  const availableDomains = industry ? domains : Array.from(new Set(Object.values(DOMAINS).flat()));

  const activeChips = [
    industry && { label: `Industry: ${industry}`, clear: () => { setIndustry(null); setDomain(null); } },
    domain && { label: `Domain: ${domain}`, clear: () => setDomain(null) },
    experience && { label: `Experience: ${experience}`, clear: () => setExperience(null) },
    testType && { label: `Type: ${testType}`, clear: () => setTestType(null) },
    difficulty && { label: `Level: ${difficulty}`, clear: () => setDifficulty(null) },
    proctoredOnly && { label: "Proctored only", clear: () => setProctoredOnly(false) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const resetAll = () => {
    setIndustry(null);
    setDomain(null);
    setExperience(null);
    setTestType(null);
    setDifficulty(null);
    setProctoredOnly(false);
    setQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    const match = ASSESSMENTS.find((item) => {
      if (domain && item.domain.toLowerCase() === domain.toLowerCase()) return true;
      if (q && (`${item.title} ${item.domain} ${item.skills.join(" ")}`.toLowerCase().includes(q))) return true;
      if (industry && !domain && !q && item.industry === industry) return true;
      return false;
    });
    if (match && match.id !== a.id) {
      navigate(`/assessments/${match.id}`);
    } else {
      document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
    }
  };

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
                    <span className="font-extrabold text-slate-900">{formatINR(cart.total)}</span> · 5 tests + CIR report
                  </span>
                </div>
              </div>

              <AssessmentVideoCard />
            </div>
          </div>
        </section>

        {/* ============ ASSESSMENT SEARCH & FILTER BAR ============ */}
        <section className="pt-8 pb-4">
          <div className="container">
            <div className="rounded-xl border border-border bg-background shadow-[0_10px_30px_hsl(var(--foreground)/0.08)]">
              <form
                className="grid lg:grid-cols-[1.35fr_1fr_1fr_auto] lg:items-center"
                onSubmit={handleSearchSubmit}
              >
                <label className="flex min-w-0 items-center gap-3 px-5 py-4 lg:py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Search className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-foreground">What</span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Skills, roles or assessments"
                      className="mt-1 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </span>
                </label>

                <label className="flex min-w-0 items-center gap-3 border-t border-border px-5 py-4 lg:border-l lg:border-t-0 lg:py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-foreground">Industry</span>
                    <span className="relative mt-1 block">
                      <select
                        value={industry ?? ""}
                        onChange={(e) => { setIndustry(e.target.value || null); setDomain(null); }}
                        className="w-full appearance-none bg-transparent pr-6 text-sm text-foreground outline-none"
                      >
                        <option value="">All industries</option>
                        {INDUSTRIES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-0 top-0.5 h-4 w-4 text-muted-foreground" />
                    </span>
                  </span>
                </label>

                <label className="flex min-w-0 items-center gap-3 border-t border-border px-5 py-4 lg:border-l lg:border-t-0 lg:py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-foreground">Experience</span>
                    <span className="relative mt-1 block">
                      <select
                        value={experience ?? ""}
                        onChange={(e) => setExperience(e.target.value || null)}
                        className="w-full appearance-none bg-transparent pr-6 text-sm text-foreground outline-none"
                      >
                        <option value="">All experience levels</option>
                        {EXPERIENCE_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-0 top-0.5 h-4 w-4 text-muted-foreground" />
                    </span>
                  </span>
                </label>

                <div className="border-t border-border p-3 lg:border-l lg:border-t-0">
                  <Button type="submit" className="h-14 w-full gap-2 px-7 font-bold lg:w-auto">
                    <Search className="h-4 w-4" /> Search Assessments
                  </Button>
                </div>
              </form>

              <div className="border-t border-border px-5 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced((current) => !current)}
                  className="h-8 gap-2 px-0 text-primary hover:bg-transparent hover:text-primary/80"
                  aria-expanded={showAdvanced}
                >
                  <SlidersHorizontal className="h-4 w-4" /> Advanced Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </Button>

                {showAdvanced && (
                  <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="space-y-2">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground"><Layers3 className="h-4 w-4 text-primary" /> Domain</span>
                      <select value={domain ?? ""} onChange={(e) => setDomain(e.target.value || null)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary/50">
                        <option value="">All domains</option>
                        {availableDomains.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground"><FileQuestion className="h-4 w-4 text-primary" /> Test type</span>
                      <select value={testType ?? ""} onChange={(e) => setTestType(e.target.value || null)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary/50">
                        <option value="">All test types</option>
                        {["Knowledge", "Practical", "Functional"].map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground"><Gauge className="h-4 w-4 text-primary" /> Difficulty</span>
                      <select value={difficulty ?? ""} onChange={(e) => setDifficulty(e.target.value || null)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary/50">
                        <option value="">All difficulty levels</option>
                        {["Beginner", "Intermediate", "Advanced"].map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                    <label className="flex h-[66px] cursor-pointer items-end">
                      <span className="flex h-10 w-full items-center gap-3 rounded-md border border-input px-3 text-sm font-medium text-foreground">
                        <input type="checkbox" checked={proctoredOnly} onChange={(e) => setProctoredOnly(e.target.checked)} className="h-4 w-4 accent-primary" />
                        <Shield className="h-4 w-4 text-primary" /> Proctored only
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3">
                  {activeChips.map((c) => (
                    <span
                      key={c.label}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary"
                    >
                      {c.label}
                      <button type="button" onClick={c.clear} aria-label={`Remove ${c.label}`}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <button type="button" onClick={resetAll} className="text-xs font-semibold text-muted-foreground hover:text-primary underline">
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============ TEST JOURNEY ============ */}
        <section id="journey" className="py-12 md:py-16 scroll-mt-24">
          <div className="container">
            <SectionHeading
              title="What you'll take"
              desc={`Four core career tests come first, then one focused ${a.domain} test.`}
            />

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
              <div className="space-y-6">
                <MandatoryCoreTestsSection />

                <div className="flex items-center gap-3" aria-hidden="true">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                    Then
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-[#0d5cb2]">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-full bg-[#0d5cb2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Domain Assessment
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {a.duration} · {a.questionCount} questions · {a.type}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">{a.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {a.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800"
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
              desc="One payment covers all four core tests, your domain test and your verified report."
            />

            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 items-start">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-slate-900">Order summary</h3>
                  <span className="rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs font-semibold text-blue-700">
                    {selectedSubs.length} sub-domain{selectedSubs.length === 1 ? "" : "s"} + 4 core tests
                  </span>
                </div>
                <ul className="divide-y divide-slate-100 text-sm">
                  {MANDATORY_TESTS.map((m) => (
                    <li key={m.name} className="flex justify-between items-center gap-4 py-3">
                      <span className="text-slate-800 font-medium">{m.name}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 text-[10px] font-semibold shrink-0">
                        Included
                      </span>
                    </li>
                  ))}
                  {selectedSubs.map((s) => (
                    <li key={s.id} className="flex justify-between items-center gap-4 py-3">
                      <span className="text-slate-800 font-medium">
                        {s.name} <span className="text-xs text-slate-500 font-normal">(3 rounds · 6 tests)</span>
                      </span>
                      <span className="font-bold text-slate-900 shrink-0">{formatINR(subDomainPrice(s))}</span>
                    </li>
                  ))}
                  <li key="cir-report" className="flex justify-between items-center gap-4 py-3">
                    <span className="text-slate-800 font-medium">Career Intelligence Report</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 text-[10px] font-semibold shrink-0">
                      Included
                    </span>
                  </li>
                  <li key="gst" className="flex justify-between items-center gap-4 py-3">
                    <span className="text-slate-500">GST (18%)</span>
                    <span className="text-slate-500 font-medium shrink-0">{formatINR(cart.gst)}</span>
                  </li>
                </ul>
                <div className="flex justify-between items-baseline pt-5 mt-3 border-t border-slate-200 font-display text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-2xl text-[#0d5cb2] font-extrabold">{formatINR(cart.total)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
                <h3 className="font-display font-bold text-slate-900 mb-5">Pay with</h3>
                <div className="grid gap-3 mb-6">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setMethod(m.name)}
                      className={`flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all cursor-pointer ${
                        method === m.name
                          ? "border-[#0d5cb2] bg-[#0d5cb2]/5 text-[#0d5cb2] shadow-xs ring-1 ring-[#0d5cb2]/30"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          method === m.name ? "bg-[#0d5cb2] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <m.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-900">{m.name}</span>
                        <span className="block text-[11px] font-normal text-slate-500">{m.note}</span>
                      </span>
                      {method === m.name && <Check className="h-4 w-4 shrink-0 text-[#0d5cb2] stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
                <Button
                  className="w-full gap-2 font-bold cursor-pointer bg-[#0d5cb2] hover:bg-[#0a4d96] text-white shadow-md shadow-[#0d5cb2]/25"
                  size="lg"
                  onClick={start}
                  disabled={selectedSubs.length === 0}
                >
                  <Lock className="h-4 w-4" /> Pay {formatINR(cart.total)} &amp; Start <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-slate-500 text-center mt-3">Secure checkout. You'll run a quick device check next.</p>
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
