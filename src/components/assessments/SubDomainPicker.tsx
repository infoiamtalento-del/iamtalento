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
                  ? "bg-white text-[#0d5cb2] shadow-xs border border-slate-200/90"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[#0d5cb2]" : "text-slate-400"}`} />
              <span className="truncate">{meta.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Round Info Bar */}
      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#0d5cb2]/10 border border-[#0d5cb2]/20 text-[#0d5cb2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
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
            <Clock className="h-3.5 w-3.5 text-[#0d5cb2]" /> {cur.duration}
          </span>
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200/80 px-2.5 py-1 rounded-md shadow-2xs">
            <FileText className="h-3.5 w-3.5 text-[#0d5cb2]" /> {cur.items}
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
                <span className="inline-block rounded bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d5cb2]">
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
                <Clock className="h-3.5 w-3.5 text-[#0d5cb2]" />
                <span>{t.minutes} mins</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#0d5cb2]" />
                <span>{t.questions} {t.kind === "Technical" ? "practical tasks" : "questions"}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Track Footnote */}
      <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px]">
          <Sparkles className="h-3 w-3 text-[#0d5cb2]" /> Switch tabs above to inspect other rounds
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
        <DialogContent className="max-w-2xl sm:max-w-3xl overflow-hidden flex flex-col p-0 rounded-2xl bg-white border border-slate-200 shadow-2xl [&>button]:text-white [&>button]:top-5 [&>button]:right-5 [&>button]:opacity-90 [&>button:hover]:opacity-100">
          {modalSubDomain && (
            <>
              <div className="bg-[#0d5cb2] text-white p-5 sm:p-6 pr-14 sm:pr-16 shrink-0">
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

              <div className="p-5 sm:p-6">
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
