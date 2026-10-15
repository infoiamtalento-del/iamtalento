import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Laptop,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Wrench,
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
  testPrice,
  type SubDomain,
} from "@/data/subDomains";
import BrandLogo from "@/components/ui/BrandLogo";

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

const SubDomainBreakdown = ({ subDomain, price }: BreakdownProps) => {
  const [activeRound, setActiveRound] = useState<number>(0);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (idx: number) => {
    if (activeRound === idx) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveRound(idx);
    }, 75);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const roundMeta = [
    {
      id: 1,
      title: "Knowledge & Concepts",
      shortTitle: "Knowledge",
      icon: BookOpen,
      duration: "30 min",
      items: "25 Questions",
      badge: "Core Foundations",
      tagline: "Validates core frameworks, essential terminology, and rapid diagnostic reasoning.",
    },
    {
      id: 2,
      title: "Applied Technical Tasks",
      shortTitle: "Technical",
      icon: Laptop,
      duration: "55 min",
      items: "7 Practical Tasks",
      badge: "Execution & Tooling",
      tagline: "Tests hands-on tool manipulation, problem briefs, and applied execution under timed constraints.",
    },
    {
      id: 3,
      title: "Workplace & Scenarios",
      shortTitle: "Experience",
      icon: Briefcase,
      duration: "40 min",
      items: "12 Scenarios",
      badge: "Strategic Judgement",
      tagline: "Evaluates trade-off handling, situational ethics, and high-impact workplace decision making.",
    },
  ];

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className="bg-slate-50/70 rounded-2xl p-3 sm:p-4 border border-slate-200/60"
    >
      {/* Sleek Minimal Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
          <span>Syllabus Breakdown</span>
          <span className="text-muted-foreground font-normal">· Hover any round to inspect tests</span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          6 tests · 3 rounds · ~125 min total
        </span>
      </div>

      {/* The Expanding Hover Bento Deck */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        {ROUNDS.map((r, idx) => {
          const isExpanded = activeRound === idx;
          const meta = roundMeta[idx] || roundMeta[0];
          const Icon = meta.icon;

          return !isExpanded ? (
            /* Collapsed State View */
            <div
              key={r.id}
              onMouseEnter={() => handleMouseEnter(idx)}
              onClick={() => {
                if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                setActiveRound(idx);
              }}
              className="rounded-2xl border border-slate-200/80 bg-white/90 hover:bg-white hover:border-blue-400 p-3.5 sm:p-4 md:w-44 lg:w-48 md:shrink-0 flex flex-col justify-between transition-colors duration-150 cursor-pointer group select-none shadow-2xs"
            >
              <div>
                {/* Top Header */}
                <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                        Round 0{r.id}
                      </span>
                      <h6 className="font-display text-xs sm:text-sm font-bold text-slate-900 mt-0.5 leading-tight truncate">
                        {meta.shortTitle}
                      </h6>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 shrink-0 whitespace-nowrap">
                    {meta.duration}
                  </span>
                </div>

                {/* Compact Test List Preview */}
                <div className="space-y-1.5 py-1">
                  {r.tests.map((t) => (
                    <div key={t.name} className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate pr-1 group-hover:text-slate-900 transition-colors">• {t.name}</span>
                      <span className="shrink-0 text-[10px] font-medium text-slate-400">{t.minutes}m</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                <span className="whitespace-nowrap">Hover to expand</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
            </div>
          ) : (
            /* Expanded State View */
            <div
              key={r.id}
              className="rounded-2xl border border-[#0d5cb2] bg-white shadow-xs ring-1 ring-[#0d5cb2]/20 p-4 sm:p-4.5 md:flex-1 min-w-0 flex flex-col justify-between transition-colors duration-150 cursor-default"
            >
              <div>
                {/* Expanded Card Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d5cb2] text-white shadow-xs shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d5cb2] whitespace-nowrap">
                          Round 0{r.id}
                        </span>
                        <span className="rounded-full bg-[#0d5cb2]/10 border border-[#0d5cb2]/20 px-2 py-0.5 text-[10px] font-semibold text-[#0d5cb2] whitespace-nowrap">
                          {meta.badge}
                        </span>
                      </div>
                      <h6 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
                        {meta.title}
                      </h6>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 font-medium shrink-0">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                      <Clock className="h-3 w-3 text-blue-600 shrink-0" /> {meta.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-flex whitespace-nowrap">
                      <FileText className="h-3 w-3 text-blue-600 shrink-0" /> {meta.items}
                    </span>
                  </div>
                </div>

                {/* Test Micro-Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in-50 duration-150">
                  {r.tests.map((t) => (
                    <div
                      key={t.name}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Tag, Name & Price */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="inline-block rounded bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700 mb-1">
                              {t.kind}
                            </span>
                            <h6 className="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
                              {t.name}
                            </h6>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                            {formatINR(testPrice(t, subDomain))}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {t.text}
                        </p>
                      </div>

                      {/* Footer: Clean 2-column metrics */}
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-medium text-slate-500">
                        <span className="inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <Clock className="h-3 w-3 text-blue-600 shrink-0" />
                          <span>{t.minutes} min</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <FileText className="h-3 w-3 text-blue-600 shrink-0" />
                          <span>{t.questions} {t.kind === "Technical" ? "tasks" : "questions"}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Footer Tip */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="h-3 w-3 text-blue-600 shrink-0" /> Hover other rounds to switch
                </span>
                <span className="font-semibold text-slate-900 whitespace-nowrap">
                  Included with {subDomain.name} Pass
                </span>
              </div>
            </div>
          );
        })}
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

  return (
    <div className="space-y-3.5">
      {/* Sleek Bento Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0d5cb2]/10 text-[#0d5cb2]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
              Choose your {domainTitle} Specialisation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap to select specialisations · 3 rounds & 6 skill tests each · CIR report included
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0d5cb2] font-bold px-3 py-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{selected.length} Track{selected.length === 1 ? "" : "s"} Selected</span>
          </span>
        </div>
      </div>

      {/* Compact Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((s) => {
          const isSelected = selected.includes(s.id);
          const price = subDomainPrice(s);
          const brandInfo = SUB_DOMAIN_BRANDS[s.id];
          const brandName = brandInfo?.brand ?? s.name;
          const tools = brandInfo?.tools ?? s.topics ?? [];

          return (
            <div
              key={s.id}
              onClick={() => onToggle(s.id)}
              className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-4 flex flex-col justify-between select-none ${
                isSelected
                  ? "border-2 border-[#0d5cb2] bg-blue-50/25 shadow-sm ring-2 ring-[#0d5cb2]/10"
                  : "border-slate-200/90 bg-white hover:border-[#0d5cb2]/60 hover:shadow-sm"
              }`}
            >
              <div>
                {/* Header: Logo, Title & Select Checkmark */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BrandLogo name={brandName} size="md" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display text-sm sm:text-[15px] font-bold text-slate-900 group-hover:text-[#0d5cb2] transition-colors leading-snug truncate">
                        {s.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 font-medium">
                        <span>3 rounds</span>
                        <span className="text-slate-300">·</span>
                        <span>6 tests</span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#0d5cb2] text-white shadow-2xs"
                        : "border border-slate-300 text-transparent group-hover:border-[#0d5cb2]"
                    }`}
                  >
                    <Check className={`h-3.5 w-3.5 stroke-[2.5] ${isSelected ? "text-white" : "text-slate-300 group-hover:text-[#0d5cb2]"}`} />
                  </div>
                </div>

                {/* Key Tools Micro-tags */}
                <div className="flex flex-wrap items-center gap-1.5 my-3">
                  {tools.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 text-[11px] px-2 py-0.5 font-medium truncate max-w-[125px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Price + Actions */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-base font-extrabold text-slate-900">
                    {formatINR(price)}
                  </span>
                  <span className="text-[11px] text-slate-400">/ track</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalSubDomain(s);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0d5cb2] px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Syllabus</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(s.id);
                    }}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer ${
                      isSelected
                        ? "bg-[#0d5cb2] text-white hover:bg-[#0a4d96]"
                        : "bg-slate-100 hover:bg-[#0d5cb2] text-slate-700 hover:text-white border border-slate-200/80 hover:border-[#0d5cb2]"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3 w-3 stroke-[3]" /> Added
                      </>
                    ) : (
                      <>
                        Select <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus Modal Dialog */}
      <Dialog open={modalSubDomain !== null} onOpenChange={(open) => !open && setModalSubDomain(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-2xl bg-white border border-slate-200 shadow-xl">
          {modalSubDomain && (
            <>
              <div className="bg-[#0d5cb2] text-white p-5 sm:p-6 shrink-0">
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
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                          Track Syllabus & Tests
                        </span>
                        <span className="text-[11px] bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-semibold">
                          3 Rounds · 6 Tests
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
                    <span className="text-[11px] text-blue-100">Full Track Pass</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                <SubDomainBreakdown subDomain={modalSubDomain} price={subDomainPrice(modalSubDomain)} />
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-900 text-sm">
                    {formatINR(subDomainPrice(modalSubDomain))}
                  </span>{" "}
                  · Includes 3 rounds, 6 tests + verified Career Intelligence Report
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
                        : "bg-[#0d5cb2] hover:bg-[#0a4d96] text-white"
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
          )}
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
      <div className="flex items-center justify-between bg-[#0d5cb2] px-5 py-4 text-white">
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
            {selected.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-slate-900">{s.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">MCQ · Technical · Experience</p>
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
            ))}
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
            <dd className="text-[#0d5cb2] font-extrabold">{formatINR(total)}</dd>
          </div>
        </dl>
        {selected.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">
            Approx. {minutes} min of domain tests across {selected.length * 3} rounds, plus core tests.
          </p>
        )}

        <Button
          className="mt-5 w-full gap-2 font-bold cursor-pointer bg-[#0d5cb2] hover:bg-[#0a4d96] text-white shadow-md shadow-[#0d5cb2]/25"
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
