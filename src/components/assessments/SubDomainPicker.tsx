import { useState, useMemo } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Laptop,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
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
import BrandLogo from "@/components/ui/BrandLogo";

/** Brand mark, category tag, and tools shown for each sub-domain. */
export const SUB_DOMAIN_BRANDS: Record<
  string,
  { brand: string; category: string; tools: string[] }
> = {
  seo: {
    brand: "Search Console",
    category: "Organic & Content",
    tools: ["Google Search Console", "Semrush", "Ahrefs", "WordPress"],
  },
  "google-ads": {
    brand: "Google Ads",
    category: "Paid Media",
    tools: ["Google Ads", "GA4", "YouTube"],
  },
  "meta-ads": {
    brand: "Meta Ads",
    category: "Paid Media",
    tools: ["Meta", "Instagram", "Facebook"],
  },
  analytics: {
    brand: "Google Analytics",
    category: "Analytics & CRO",
    tools: ["GA4", "Looker Studio", "Hotjar"],
  },
  content: {
    brand: "WordPress",
    category: "Organic & Content",
    tools: ["WordPress", "Canva", "Notion"],
  },
  email: {
    brand: "Mailchimp",
    category: "Organic & Content",
    tools: ["Mailchimp", "HubSpot", "Salesforce"],
  },
  smm: {
    brand: "Instagram",
    category: "Organic & Content",
    tools: ["Instagram", "LinkedIn", "YouTube", "Canva"],
  },
  cro: {
    brand: "Hotjar",
    category: "Analytics & CRO",
    tools: ["Hotjar", "GA4", "Figma"],
  },
  frontend: {
    brand: "React",
    category: "Engineering",
    tools: ["React", "TypeScript", "Figma"],
  },
  backend: {
    brand: "GitHub",
    category: "Engineering",
    tools: ["GitHub", "Docker"],
  },
  dsa: {
    brand: "GitHub",
    category: "Engineering",
    tools: ["GitHub", "TypeScript", "React"],
  },
  devops: {
    brand: "Docker",
    category: "Engineering",
    tools: ["Docker", "Kubernetes", "GitHub"],
  },
  qa: {
    brand: "GitHub",
    category: "Engineering",
    tools: ["GitHub", "Docker", "TypeScript"],
  },
  "ux-research": {
    brand: "Figma",
    category: "Design",
    tools: ["Figma", "Notion", "Hotjar"],
  },
  ui: {
    brand: "Figma",
    category: "Design",
    tools: ["Figma", "Canva"],
  },
  interaction: {
    brand: "Figma",
    category: "Design",
    tools: ["Figma", "React", "Notion"],
  },
  prospecting: {
    brand: "LinkedIn",
    category: "Revenue",
    tools: ["LinkedIn", "Salesforce", "HubSpot"],
  },
  discovery: {
    brand: "Salesforce",
    category: "Revenue",
    tools: ["Salesforce", "HubSpot"],
  },
  negotiation: {
    brand: "Salesforce",
    category: "Revenue",
    tools: ["Salesforce", "HubSpot", "Slack"],
  },
  sourcing: {
    brand: "LinkedIn",
    category: "Talent",
    tools: ["LinkedIn", "Greenhouse", "Lever"],
  },
  interviewing: {
    brand: "Greenhouse",
    category: "Talent",
    tools: ["Greenhouse", "Lever", "Workday"],
  },
  hrops: {
    brand: "Workday",
    category: "Talent",
    tools: ["Workday", "Slack"],
  },
  marketplace: {
    brand: "Amazon",
    category: "Commerce",
    tools: ["Amazon", "Flipkart"],
  },
  catalog: {
    brand: "Shopify",
    category: "Commerce",
    tools: ["Shopify", "Amazon", "Flipkart"],
  },
  "ecom-ads": {
    brand: "Amazon",
    category: "Commerce",
    tools: ["Amazon", "Google Ads"],
  },
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

const ROUND_META = [
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

const SubDomainBreakdown = ({ subDomain }: BreakdownProps) => {
  const [activeRound, setActiveRound] = useState<number>(0);
  const cur = ROUND_META[activeRound];

  return (
    <div className="space-y-4">
      {/* 3-Tab Segmented Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
        {ROUND_META.map((meta, idx) => {
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
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
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

      {/* 2 Full-Width Test Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
        {cur.tests.map((t, testIdx) => (
          <div
            key={t.name}
            className="yellow-graded-border rounded-xl p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="inline-block rounded bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d5cb2]">
                  {t.kind}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-md">
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    options.forEach((s) => {
      const cat = SUB_DOMAIN_BRANDS[s.id]?.category;
      if (cat) cats.add(cat);
    });
    return Array.from(cats);
  }, [options]);

  const filteredOptions = useMemo(() => {
    return options.filter((s) => {
      const info = SUB_DOMAIN_BRANDS[s.id];
      const matchesCat = activeCategory === "All" || info?.category === activeCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const tools = info?.tools ?? [];
      return (
        s.name.toLowerCase().includes(q) ||
        s.text.toLowerCase().includes(q) ||
        s.topics.some((t) => t.toLowerCase().includes(q)) ||
        tools.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [options, activeCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Clean, Airy Interactive Explorer Bar */}
      <div className="yellow-graded-section rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
              Choose your {domainTitle} Specialisation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ₹1,999 per track · 3 rounds &amp; 6 skill tests each · Verified CIR report included
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0d5cb2] font-bold px-3 py-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{selected.length} Track{selected.length === 1 ? "" : "s"} Selected</span>
          </span>
        </div>

        {/* Interactive Search & Category Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 flex items-center rounded-xl bg-slate-50 border border-slate-200/90 px-3.5 py-2 focus-within:bg-white focus-within:border-[#0d5cb2] transition-colors">
            <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course or tool (e.g. GA4, Semrush, Meta, Canva)..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="ml-1 rounded-full p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none ${
                    active
                      ? "bg-[#0d5cb2] text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacious 2-Column Bento Grid */}
      {filteredOptions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-display text-sm font-bold text-slate-800">
            No courses match "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-2.5 text-xs font-bold text-[#0d5cb2] hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredOptions.map((s) => {
            const isSelected = selected.includes(s.id);
            const price = subDomainPrice(s);
            const brandInfo = SUB_DOMAIN_BRANDS[s.id];
            const brandName = brandInfo?.brand ?? s.name;
            const tools = brandInfo?.tools ?? s.topics ?? [];

            return (
              <div
                key={s.id}
                onClick={() => onToggle(s.id)}
                className={`group relative rounded-2xl transition-all duration-200 cursor-pointer p-5 flex flex-col justify-between select-none hover:-translate-y-0.5 ${
                  isSelected
                    ? "yellow-graded-border-selected shadow-md"
                    : "yellow-graded-border shadow-2xs hover:shadow-md"
                }`}
              >
                <div>
                  {/* Header: Crisp Brand Logo Tile + Title + Description */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <BrandLogo name={brandName} size="md" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-[#0d5cb2] transition-colors leading-snug truncate">
                          {s.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {s.text}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#0d5cb2] text-white"
                          : "border border-slate-300 text-transparent group-hover:border-[#0d5cb2]"
                      }`}
                    >
                      <Check
                        className={`h-3.5 w-3.5 stroke-[2.5] ${
                          isSelected ? "text-white" : "text-slate-300 group-hover:text-[#0d5cb2]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Tool Pills with Real Brand Logos (Clean neutral pills so logos stand out cleanly) */}
                  <div className="flex flex-wrap items-center gap-1.5 my-4">
                    {tools.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        <BrandLogo name={t} size="xs" />
                        <span className="truncate max-w-[120px]">{t}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Fee + Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-base sm:text-lg font-extrabold text-slate-900">
                        {formatINR(price)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        · 3 rounds · 6 tests
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalSubDomain(s);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0d5cb2] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#0d5cb2]" />
                      <span>Syllabus</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(s.id);
                      }}
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#0d5cb2] text-white hover:bg-[#0a4d96]"
                          : "yellow-graded-btn text-slate-950"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[2.75]" /> Added
                        </>
                      ) : (
                        <>
                          Select <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                          Track Syllabus &amp; Tests
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
    <aside className="yellow-graded-section rounded-2xl lg:sticky lg:top-24 overflow-hidden shadow-xs">
      <div className="flex items-center justify-between bg-[#0d5cb2] px-5 py-4 text-white">
        <p className="flex items-center gap-2 font-display text-sm font-bold text-white">
          <ShoppingCart className="h-4 w-4" /> Your assessment cart
        </p>
        <span className="rounded-full bg-white/20 backdrop-blur-xs border border-white/30 px-2.5 py-0.5 text-[11px] font-bold text-white">
          {selected.length} track{selected.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Mandatory Core Tests
        </p>
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

        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Selected Specialisations
        </p>
        {selected.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-500 text-center bg-slate-50/50">
            Nothing added yet. Pick at least one specialisation to continue.
          </p>
        ) : (
          <ul className="space-y-2">
            {selected.map((s) => {
              const brandName = SUB_DOMAIN_BRANDS[s.id]?.brand ?? s.name;
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BrandLogo name={brandName} size="xs" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-slate-900 truncate">
                        {s.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">3 rounds · 6 tests</p>
                    </div>
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
