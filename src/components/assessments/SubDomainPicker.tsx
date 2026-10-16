import { useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Laptop,
  Layers,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ROUNDS,
  subDomainPrice,
  type SubDomain,
} from "@/data/subDomains";
import {
  DIGITAL_MARKETING_EXPERTS,
  HR_DIGITAL_MARKETING_EXPERTS,
  type AssessmentExpert,
} from "@/data/assessmentExperts";
import BrandLogo from "@/components/ui/BrandLogo";

/** Map sub-domains to their most relevant Test Curator and HR Curator */
const SUB_DOMAIN_CURATOR_INDEX: Record<string, { testIdx: number; hrIdx: number }> = {
  seo: { testIdx: 1, hrIdx: 0 },
  "google-ads": { testIdx: 0, hrIdx: 1 },
  "meta-ads": { testIdx: 3, hrIdx: 3 },
  analytics: { testIdx: 5, hrIdx: 4 },
  content: { testIdx: 4, hrIdx: 2 },
  email: { testIdx: 4, hrIdx: 5 },
  smm: { testIdx: 2, hrIdx: 3 },
  cro: { testIdx: 5, hrIdx: 0 },
};

const getCuratorsForSubDomain = (subId: string, fallbackIndex: number): {
  testCurator: AssessmentExpert;
  hrCurator: AssessmentExpert;
} => {
  const mapped = SUB_DOMAIN_CURATOR_INDEX[subId];
  const testIdx = mapped ? mapped.testIdx : fallbackIndex % DIGITAL_MARKETING_EXPERTS.length;
  const hrIdx = mapped ? mapped.hrIdx : fallbackIndex % HR_DIGITAL_MARKETING_EXPERTS.length;
  return {
    testCurator: DIGITAL_MARKETING_EXPERTS[testIdx],
    hrCurator: HR_DIGITAL_MARKETING_EXPERTS[hrIdx],
  };
};

export interface SubDomainStats {
  rounds: number;
  tests: number;
  duration: string;
  rating: string;
  focusLabel: string;
}

/** Tailored rounds, test counts, duration, and ratings per sub-domain */
export const SUB_DOMAIN_STATS: Record<string, SubDomainStats> = {
  seo: { rounds: 3, tests: 6, duration: "95 min", rating: "4.9", focusLabel: "Technical Audit & On-Page" },
  "google-ads": { rounds: 3, tests: 7, duration: "110 min", rating: "4.9", focusLabel: "Search, Bidding & Shopping" },
  "meta-ads": { rounds: 3, tests: 6, duration: "100 min", rating: "4.8", focusLabel: "Creative Testing & ROAS" },
  analytics: { rounds: 4, tests: 8, duration: "120 min", rating: "4.9", focusLabel: "GA4, Funnels & Attribution" },
  content: { rounds: 3, tests: 5, duration: "85 min", rating: "4.8", focusLabel: "Editorial Strategy & Copy" },
  email: { rounds: 3, tests: 5, duration: "80 min", rating: "4.7", focusLabel: "Lifecycle Flows & CRM" },
  smm: { rounds: 3, tests: 6, duration: "90 min", rating: "4.8", focusLabel: "Organic Growth & Community" },
  cro: { rounds: 4, tests: 7, duration: "105 min", rating: "4.9", focusLabel: "A/B Testing & Funnel Math" },
  frontend: { rounds: 4, tests: 7, duration: "115 min", rating: "4.9", focusLabel: "UI Components & State" },
  backend: { rounds: 4, tests: 8, duration: "120 min", rating: "4.9", focusLabel: "APIs, DBs & Architecture" },
  dsa: { rounds: 4, tests: 8, duration: "125 min", rating: "4.9", focusLabel: "Algorithms & Complexity" },
  devops: { rounds: 3, tests: 6, duration: "105 min", rating: "4.8", focusLabel: "CI/CD, Docker & Cloud" },
  qa: { rounds: 3, tests: 6, duration: "90 min", rating: "4.8", focusLabel: "Automation & API QA" },
};

export const getSubDomainStats = (subId: string): SubDomainStats =>
  SUB_DOMAIN_STATS[subId] ?? {
    rounds: 3,
    tests: 6,
    duration: "95 min",
    rating: "4.8",
    focusLabel: "Applied Domain Scenarios",
  };

/** Brand mark and tools shown for each sub-domain. Unknown names fall back to a monogram. */
export const SUB_DOMAIN_BRANDS: Record<string, { brand: string; tools: string[] }> = {
  seo: { brand: "Search Console", tools: ["Google Search Console", "Semrush", "Ahrefs", "WordPress"] },
  "google-ads": { brand: "Google Ads", tools: ["Google Ads", "GA4", "YouTube"] },
  "meta-ads": { brand: "Meta Ads", tools: ["Meta", "Instagram", "Facebook"] },
  analytics: { brand: "Google Analytics", tools: ["GA4", "Looker Studio", "Hotjar"] },
  content: { brand: "WordPress", tools: ["WordPress", "Canva", "Notion"] },
  email: { brand: "Mailchimp", tools: ["Mailchimp", "HubSpot", "Salesforce"] },
  smm: { brand: "Instagram", tools: ["Instagram", "LinkedIn", "YouTube", "Canva"] },
  cro: { brand: "Hotjar", tools: ["Hotjar", "GA4", "Figma"] },
  frontend: { brand: "React", tools: ["React", "TypeScript", "Figma"] },
  backend: { brand: "GitHub", tools: ["GitHub", "Docker"] },
  devops: { brand: "Docker", tools: ["Docker", "Kubernetes", "GitHub"] },
  ui: { brand: "Figma", tools: ["Figma", "Canva"] },
  prospecting: { brand: "LinkedIn", tools: ["LinkedIn", "Salesforce", "HubSpot"] },
  discovery: { brand: "Salesforce", tools: ["Salesforce", "HubSpot"] },
  sourcing: { brand: "LinkedIn", tools: ["LinkedIn", "Greenhouse", "Lever"] },
  hrops: { brand: "Workday", tools: ["Workday", "Slack"] },
  marketplace: { brand: "Amazon", tools: ["Amazon", "Flipkart"] },
  catalog: { brand: "Shopify", tools: ["Shopify", "Amazon", "Flipkart"] },
  "ecom-ads": { brand: "Amazon", tools: ["Amazon", "Google Ads"] },
};

export const GST_RATE = 0.18;
export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const totals = (list: SubDomain[]) => {
  const subtotal = list.reduce((s, x) => s + subDomainPrice(x), 0);
  const gst = Math.round(subtotal * GST_RATE);
  return { subtotal, gst, total: subtotal + gst };
};
export { totals as cartTotals };

interface BreakdownProps {
  subDomain: SubDomain;
  price: number;
}

const SubDomainBreakdown = ({ subDomain }: BreakdownProps) => {
  const [activeRound, setActiveRound] = useState<number>(0);

  const roundMeta = [
    {
      id: 1,
      title: "Knowledge & Concepts",
      tabLabel: "Round 1 · Knowledge",
      icon: BookOpen,
      duration: "30 min",
      items: "25 Questions",
      badge: "Core Foundations",
      tagline: "Validates core frameworks, essential terminology, and rapid diagnostic reasoning.",
      tests: ROUNDS[0].tests,
    },
    {
      id: 2,
      title: "Applied Technical Tasks",
      tabLabel: "Round 2 · Technical",
      icon: Laptop,
      duration: "55 min",
      items: "7 Practical Tasks",
      badge: "Execution & Tooling",
      tagline: "Tests hands-on tool manipulation, problem briefs, and applied execution under timed constraints.",
      tests: ROUNDS[1].tests,
    },
    {
      id: 3,
      title: "Workplace & Scenarios",
      tabLabel: "Round 3 · Experience",
      icon: Briefcase,
      duration: "40 min",
      items: "12 Scenarios",
      badge: "Strategic Judgement",
      tagline: "Evaluates trade-off handling, situational ethics, and high-impact workplace decision making.",
      tests: ROUNDS[2].tests,
    },
  ];

  const cur = roundMeta[activeRound];

  return (
    <div className="space-y-4">
      {/* 3-Tab Segmented Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
        {roundMeta.map((meta, idx) => {
          const isSelected = activeRound === idx;
          const Icon = meta.icon;
          return (
            <button
              key={meta.id}
              type="button"
              onClick={() => setActiveRound(idx)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-white text-[#002C66] shadow-xs border border-slate-200/90"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[#002C66]" : "text-slate-400"}`} />
              <span className="truncate">{meta.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Round Info Bar */}
      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#002C66]/10 border border-[#002C66]/20 text-[#002C66] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {cur.badge}
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {cur.title}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-normal">
            {cur.tagline}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200/80 px-2.5 py-1 rounded-md shadow-2xs">
            <Clock className="h-3.5 w-3.5 text-[#002C66]" /> {cur.duration}
          </span>
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200/80 px-2.5 py-1 rounded-md shadow-2xs">
            <FileText className="h-3.5 w-3.5 text-[#002C66]" /> {cur.items}
          </span>
        </div>
      </div>

      {/* 2 Full-Width Test Cards - Spacious, Clean Alignment, Zero Collisions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
        {cur.tests.map((t, testIdx) => (
          <div
            key={t.name}
            className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="inline-block rounded bg-[#002C66]/10 border border-[#002C66]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#002C66]">
                  {t.kind}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
                  Test {testIdx + 1} of 2
                </span>
              </div>
              <h6 className="font-display text-sm font-bold text-slate-900 leading-snug">
                {t.name}
              </h6>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.text}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#002C66]" />
                <span>{t.minutes} mins</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#002C66]" />
                <span>{t.questions} {t.kind === "Technical" ? "practical tasks" : "questions"}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Track Footnote */}
      <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px]">
          <Sparkles className="h-3 w-3 text-[#002C66]" /> Switch tabs above to inspect other rounds
        </span>
        <span className="font-medium text-[11px] text-slate-600">
          Included with {subDomain.name} Specialisation Pass
        </span>
      </div>
    </div>
  );
};

interface PickerProps {
  domainTitle: string;
  options: SubDomain[];
  selected: string[];
  onToggle: (id: string) => void;
}

export const SubDomainPicker = ({ domainTitle, options, selected, onToggle }: PickerProps) => {
  const [modalSubDomain, setModalSubDomain] = useState<SubDomain | null>(null);
  const [modalCurator, setModalCurator] = useState<{
    role: "Test Curator" | "HR Curator";
    expert: AssessmentExpert;
    subDomainName: string;
  } | null>(null);

  return (
    <div className="space-y-4">
      {/* Sleek Bento Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#002C66]/10 text-[#002C66]">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Choose your {domainTitle} Specialisation
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select one or more tracks · Tailored multi-round tests curated by domain &amp; HR leaders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002C66]/10 border border-[#002C66]/25 text-[#002C66] font-bold px-3.5 py-1.5 text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>{selected.length} Track{selected.length === 1 ? "" : "s"} Selected</span>
          </span>
        </div>
      </div>

      {/* High-Contrast UI/UX Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {options.map((s, idx) => {
          const isSelected = selected.includes(s.id);
          const price = subDomainPrice(s);
          const brandInfo = SUB_DOMAIN_BRANDS[s.id];
          const brandName = brandInfo?.brand ?? s.name;
          const { testCurator, hrCurator } = getCuratorsForSubDomain(s.id, idx);
          const stats = getSubDomainStats(s.id);

          return (
            <div
              key={s.id}
              onClick={() => onToggle(s.id)}
              className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-5 flex flex-col justify-between select-none ${
                isSelected
                  ? "border-2 border-[#002C66] bg-gradient-to-b from-[#002C66]/[0.04] via-white to-white shadow-md ring-4 ring-[#002C66]/10"
                  : "border-slate-200/90 bg-white hover:border-[#002C66]/60 hover:shadow-lg"
              }`}
            >
              <div>
                {/* 1. Primary Focal Point: Brand Icon + Track Title + Selection Check */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200/90 p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:border-[#002C66]/30 transition-all">
                      <BrandLogo name={brandName} size="md" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display text-lg sm:text-[19px] font-extrabold text-slate-900 group-hover:text-[#002C66] transition-colors leading-tight tracking-tight">
                          {s.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 text-[11px] text-amber-700 font-bold shrink-0">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {stats.rating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-normal">
                        {s.text}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-[#002C66] text-white shadow-sm scale-105"
                        : "border-2 border-slate-200 text-transparent group-hover:border-[#002C66]/60"
                    }`}
                  >
                    <Check className={`h-4 w-4 stroke-[2.75] ${isSelected ? "text-white" : "text-slate-300 group-hover:text-[#002C66]"}`} />
                  </div>
                </div>

                {/* 2. Plain Rounds ── Tests on the left + View Syllabus next to it */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 py-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[#002C66] shrink-0" />
                      <span>{stats.rounds} Rounds</span>
                    </span>
                    <span className="text-slate-300 select-none" aria-hidden="true">
                      ──
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ClipboardCheck className="h-3.5 w-3.5 text-[#002C66] shrink-0" />
                      <span>{stats.tests} Tests</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalSubDomain(s);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#002C66] hover:underline transition-colors cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>View Syllabus</span>
                  </button>
                </div>

                {/* 3. Below that: Test Curator & HR Curator (No profile inline, just View button) */}
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-[#002C66]/5 border border-[#002C66]/20 px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 truncate">
                      <UserCheck className="h-3.5 w-3.5 text-[#002C66] shrink-0" />
                      <span className="truncate">Test Curator</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalCurator({ role: "Test Curator", expert: testCurator, subDomainName: s.name });
                      }}
                      className="shrink-0 rounded-md bg-white hover:bg-[#002C66] text-[#002C66] hover:text-white border border-[#002C66]/25 px-2.5 py-0.5 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      View
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-xl bg-amber-50/60 border border-amber-200/80 px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 truncate">
                      <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">HR Curator</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalCurator({ role: "HR Curator", expert: hrCurator, subDomainName: s.name });
                      }}
                      className="shrink-0 rounded-md bg-white hover:bg-amber-500 text-amber-900 hover:text-white border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Below that: Price + Add to Cart */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-3.5">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-extrabold text-slate-900 tracking-tight">
                    {formatINR(price)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">/ track</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(s.id);
                  }}
                  className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer ${
                    isSelected
                      ? "bg-[#002C66] text-white hover:bg-[#00204d] shadow-[#002C66]/20"
                      : "bg-[#002C66] text-white hover:bg-[#00204d] shadow-[#002C66]/15"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Curator Profile Modal Dialog (opened via View button on Test Curator / HR Curator) */}
      <Dialog open={modalCurator !== null} onOpenChange={(open) => !open && setModalCurator(null)}>
        <DialogContent className="max-w-md overflow-hidden flex flex-col p-0 rounded-2xl bg-white border border-slate-200 shadow-2xl">
          {modalCurator && (
            <>
              <div
                className={`p-5 pr-12 ${
                  modalCurator.role === "HR Curator"
                    ? "bg-amber-400 text-slate-950"
                    : "bg-[#002C66] text-white"
                }`}
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-90 block">
                  {modalCurator.role} · {modalCurator.subDomainName}
                </span>
                <DialogTitle className="font-display text-lg font-bold mt-0.5">
                  {modalCurator.expert.name}
                </DialogTitle>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={modalCurator.expert.photo}
                    alt={modalCurator.expert.name}
                    className="h-20 w-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-bold text-slate-900">
                      {modalCurator.expert.name}
                    </p>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {modalCurator.expert.title} · {modalCurator.expert.company}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#002C66]/10 border border-[#002C66]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#002C66]">
                      <Briefcase className="h-3 w-3" /> {modalCurator.expert.experience}
                    </span>
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {modalCurator.expert.history.map((h) => (
                        <span key={h.company} title={`${h.role} · ${h.company} (${h.years})`} className="inline-flex">
                          <BrandLogo name={h.company} variant="badge" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">{modalCurator.expert.bio}</p>

                {modalCurator.expert.tests && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs font-medium text-slate-800">
                    {modalCurator.expert.tests}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {modalCurator.expert.specialisation.map((sp) => (
                    <span
                      key={sp}
                      className="rounded-md bg-slate-100 border border-slate-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Syllabus Modal Dialog */}
      <Dialog open={modalSubDomain !== null} onOpenChange={(open) => !open && setModalSubDomain(null)}>
        <DialogContent className="max-w-2xl sm:max-w-3xl overflow-hidden flex flex-col p-0 rounded-2xl bg-white border border-slate-200 shadow-2xl [&>button]:text-white [&>button]:top-5 [&>button]:right-5 [&>button]:opacity-90 [&>button:hover]:opacity-100">
          {modalSubDomain && (() => {
            const modalStats = getSubDomainStats(modalSubDomain.id);
            const { testCurator, hrCurator } = getCuratorsForSubDomain(modalSubDomain.id, 0);
            return (
              <>
                <div className="bg-[#002C66] text-white p-5 sm:p-6 pr-14 sm:pr-16 shrink-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-sm">
                        <BrandLogo
                          name={SUB_DOMAIN_BRANDS[modalSubDomain.id]?.brand ?? modalSubDomain.name}
                          size="lg"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                            Track Syllabus & Tests
                          </span>
                          <span className="text-[11px] bg-white/20 border border-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                            {modalStats.rounds} Rounds · {modalStats.tests} Tests · {modalStats.duration}
                          </span>
                        </div>
                        <DialogTitle className="font-display text-xl font-bold text-white mt-0.5">
                          {modalSubDomain.name}
                        </DialogTitle>
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <div className="font-display text-xl font-extrabold text-white">
                        {formatINR(subDomainPrice(modalSubDomain))}
                      </div>
                      <span className="text-[11px] text-white/80">Full Track Pass</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <SubDomainBreakdown subDomain={modalSubDomain} price={subDomainPrice(modalSubDomain)} />

                  {/* Curators summary in modal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3 rounded-xl bg-[#002C66]/5 border border-[#002C66]/20 p-3">
                      <img
                        src={testCurator.photo}
                        alt={testCurator.name}
                        className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#002C66] block">
                          Test Curator · {testCurator.experience}
                        </span>
                        <p className="text-sm font-bold text-slate-900 truncate">{testCurator.name}</p>
                        <p className="text-xs text-slate-600 truncate">
                          {testCurator.title} · {testCurator.company}
                        </p>
                      </div>
                      <BrandLogo name={testCurator.company} size="xs" />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-amber-50/60 border border-amber-200/80 p-3">
                      <img
                        src={hrCurator.photo}
                        alt={hrCurator.name}
                        className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                          HR Curator · {hrCurator.experience}
                        </span>
                        <p className="text-sm font-bold text-slate-900 truncate">{hrCurator.name}</p>
                        <p className="text-xs text-slate-600 truncate">
                          {hrCurator.title} · {hrCurator.company}
                        </p>
                      </div>
                      <BrandLogo name={hrCurator.company} size="xs" />
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-900 text-sm">
                      {formatINR(subDomainPrice(modalSubDomain))}
                    </span>{" "}
                    · Includes {modalStats.rounds} rounds, {modalStats.tests} tests + verified Career Intelligence Report
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModalSubDomain(null)}
                      className="border-slate-200 text-slate-700 cursor-pointer"
                    >
                      Close
                    </Button>
                    <Button
                      size="sm"
                      className={`cursor-pointer ${
                        selected.includes(modalSubDomain.id)
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                          : "bg-[#002C66] hover:bg-[#00204d] text-white"
                      }`}
                      onClick={() => {
                        onToggle(modalSubDomain.id);
                        setModalSubDomain(null);
                      }}
                    >
                      {selected.includes(modalSubDomain.id) ? (
                        <>Remove from Cart</>
                      ) : (
                        <>Add to Cart ({formatINR(subDomainPrice(modalSubDomain))})</>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CartProps {
  selected: SubDomain[];
  coreNames: string[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const AssessmentCart = ({ selected, coreNames, onRemove, onCheckout }: CartProps) => {
  const { subtotal, gst, total } = totals(selected);
  const minutes = selected.length * ROUNDS.reduce((s, r) => s + r.tests.reduce((a, t) => a + t.minutes, 0), 0);

  return (
    <aside className="rounded-2xl border border-slate-200/90 bg-white lg:sticky lg:top-24 overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between bg-[#002C66] px-5 py-4 text-white">
        <p className="flex items-center gap-2 font-display text-sm font-bold">
          <ShoppingCart className="h-4 w-4" /> Your assessment cart
        </p>
        <span className="rounded-full bg-white/20 backdrop-blur-xs border border-white/30 px-2.5 py-0.5 text-[11px] font-bold text-white">
          {selected.length} track{selected.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Mandatory Core Tests</p>
        <ul className="mb-5 space-y-2 text-xs">
          {coreNames.map((n) => (
            <li key={n} className="flex items-center justify-between gap-2 text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" /> {n}
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 text-[10px]">
                Included
              </span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Selected Sub-domain</p>
        {selected.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-500 text-center bg-slate-50/50">
            Nothing added yet. Pick at least one sub-domain to continue.
          </p>
        ) : (
          <ul className="space-y-2">
            {selected.map((s) => {
              const st = getSubDomainStats(s.id);
              return (
                <li key={s.id} className="flex items-start justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {st.rounds} rounds · {st.tests} tests · {st.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-slate-900">{formatINR(subDomainPrice(s))}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(s.id)}
                      aria-label={`Remove ${s.name}`}
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-800 cursor-pointer transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="font-semibold text-slate-800">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">GST (18%)</dt>
            <dd className="text-slate-500">{formatINR(gst)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200/80 pt-3 font-display text-lg font-bold">
            <dt className="text-slate-900">Total</dt>
            <dd className="text-[#002C66] font-extrabold">{formatINR(total)}</dd>
          </div>
        </dl>
        {selected.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">
            Approx. {minutes} min of domain tests across {selected.reduce((acc, s) => acc + getSubDomainStats(s.id).rounds, 0)} rounds, plus 4 core tests.
          </p>
        )}

        <Button
          className="mt-5 w-full gap-2 font-bold cursor-pointer bg-[#002C66] hover:bg-[#00204d] text-white shadow-md shadow-[#002C66]/25"
          disabled={selected.length === 0}
          onClick={onCheckout}
        >
          Proceed to payment <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> One proctored session, verified CIR report
        </p>
      </div>
    </aside>
  );
};
