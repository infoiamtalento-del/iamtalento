import { useState, useMemo } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Laptop,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Wrench,
  X,
  Zap,
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
  { brand: string; category: string; highlight: string; tools: string[] }
> = {
  seo: {
    brand: "Search Console",
    category: "Organic & Content",
    highlight: "Search Rankings & Technical Audits",
    tools: ["Google Search Console", "Semrush", "Ahrefs", "WordPress"],
  },
  "google-ads": {
    brand: "Google Ads",
    category: "Paid Media & Ads",
    highlight: "Search, Display & YouTube ROAS",
    tools: ["Google Ads", "GA4", "YouTube", "Looker Studio"],
  },
  "meta-ads": {
    brand: "Meta Ads",
    category: "Paid Media & Ads",
    highlight: "Full-Funnel Paid Social & CAPI",
    tools: ["Meta", "Instagram", "Facebook", "Canva"],
  },
  analytics: {
    brand: "Google Analytics",
    category: "Analytics & CRO",
    highlight: "GA4 Event Tracking & Attribution",
    tools: ["GA4", "Looker Studio", "Hotjar", "Google Search Console"],
  },
  content: {
    brand: "WordPress",
    category: "Organic & Content",
    highlight: "Editorial Funnels & Copywriting",
    tools: ["WordPress", "Canva", "Notion", "Semrush"],
  },
  email: {
    brand: "Mailchimp",
    category: "Organic & Content",
    highlight: "Lifecycle Flows & CRM Automation",
    tools: ["Mailchimp", "HubSpot", "Salesforce", "Zapier"],
  },
  smm: {
    brand: "Instagram",
    category: "Organic & Content",
    highlight: "Brand Community & Viral Growth",
    tools: ["Instagram", "LinkedIn", "YouTube", "Canva"],
  },
  cro: {
    brand: "Hotjar",
    category: "Analytics & CRO",
    highlight: "A/B Experimentation & Funnel Lift",
    tools: ["Hotjar", "GA4", "Figma", "Shopify"],
  },
  frontend: {
    brand: "React",
    category: "Engineering",
    highlight: "Modern UI & Web Performance",
    tools: ["React", "TypeScript", "Figma", "GitHub"],
  },
  backend: {
    brand: "GitHub",
    category: "Engineering",
    highlight: "Scalable APIs & Data Architecture",
    tools: ["GitHub", "Docker", "Kubernetes"],
  },
  dsa: {
    brand: "GitHub",
    category: "Engineering",
    highlight: "Algorithms & Problem Solving",
    tools: ["GitHub", "TypeScript", "React"],
  },
  devops: {
    brand: "Docker",
    category: "Engineering",
    highlight: "CI/CD Pipelines & Cloud Infra",
    tools: ["Docker", "Kubernetes", "GitHub"],
  },
  qa: {
    brand: "GitHub",
    category: "Engineering",
    highlight: "Automated & API Quality Assurance",
    tools: ["GitHub", "Docker", "TypeScript"],
  },
  "ux-research": {
    brand: "Figma",
    category: "Design",
    highlight: "User Interviews & Usability Synthesis",
    tools: ["Figma", "Notion", "Hotjar"],
  },
  ui: {
    brand: "Figma",
    category: "Design",
    highlight: "Design Systems & Visual Craft",
    tools: ["Figma", "Canva", "Notion"],
  },
  interaction: {
    brand: "Figma",
    category: "Design",
    highlight: "Interactive Flows & Micro-Motion",
    tools: ["Figma", "React", "Notion"],
  },
  prospecting: {
    brand: "LinkedIn",
    category: "Revenue",
    highlight: "Outbound Cadences & Pipeline Gen",
    tools: ["LinkedIn", "Salesforce", "HubSpot"],
  },
  discovery: {
    brand: "Salesforce",
    category: "Revenue",
    highlight: "MEDDIC Qualification & Solutioning",
    tools: ["Salesforce", "HubSpot", "LinkedIn"],
  },
  negotiation: {
    brand: "Salesforce",
    category: "Revenue",
    highlight: "Commercial Structuring & Closing",
    tools: ["Salesforce", "HubSpot", "Slack"],
  },
  sourcing: {
    brand: "LinkedIn",
    category: "Talent",
    highlight: "Boolean Sourcing & ATS Pipelines",
    tools: ["LinkedIn", "Greenhouse", "Lever"],
  },
  interviewing: {
    brand: "Greenhouse",
    category: "Talent",
    highlight: "Structured Rubrics & Hiring Calls",
    tools: ["Greenhouse", "Lever", "Workday"],
  },
  hrops: {
    brand: "Workday",
    category: "Talent",
    highlight: "People Operations & Compliance",
    tools: ["Workday", "Slack", "Notion"],
  },
  marketplace: {
    brand: "Amazon",
    category: "Commerce",
    highlight: "Seller SLAs & Marketplace Ops",
    tools: ["Amazon", "Flipkart", "Shopify"],
  },
  catalog: {
    brand: "Shopify",
    category: "Commerce",
    highlight: "Merchandising & Catalog Quality",
    tools: ["Shopify", "Amazon", "Flipkart"],
  },
  "ecom-ads": {
    brand: "Amazon",
    category: "Commerce",
    highlight: "Sponsored Products & Retail ROAS",
    tools: ["Amazon", "Google Ads", "Flipkart"],
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
    shortLabel: "R1 · Knowledge",
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
    shortLabel: "R2 · Technical",
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
    shortLabel: "R3 · Scenarios",
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
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-amber-50/70 rounded-xl border border-amber-300/80">
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
                  ? "yellow-graded-btn text-slate-950 shadow-xs"
                  : "text-slate-700 hover:text-slate-950 hover:bg-white/70"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-slate-950" : "text-amber-700"}`} />
              <span className="truncate">{meta.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Round Info Bar */}
      <div className="yellow-graded-border rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="yellow-graded-badge rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
              {cur.badge}
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {cur.title}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-normal">
            {cur.tagline}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-slate-700">
          <span className="inline-flex items-center gap-1 bg-amber-50/80 border border-amber-300/80 px-2.5 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5 text-amber-700" /> {cur.duration}
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-50/80 border border-amber-300/80 px-2.5 py-1 rounded-md">
            <FileText className="h-3.5 w-3.5 text-[#0d5cb2]" /> {cur.items}
          </span>
        </div>
      </div>

      {/* 2 Full-Width Test Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
        {cur.tests.map((t, testIdx) => (
          <div
            key={t.name}
            className="yellow-graded-border rounded-xl p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="inline-block rounded bg-blue-50 border border-blue-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d5cb2]">
                  {t.kind}
                </span>
                <span className="yellow-graded-badge text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Test {testIdx + 1} · ₹333 value
                </span>
              </div>
              <h6 className="font-display text-sm font-bold text-slate-900 leading-snug">
                {t.name}
              </h6>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {t.text}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
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
      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Switch tabs above to inspect all 3 rounds (6 tests)
        </span>
        <span className="font-semibold text-[11px] text-slate-800">
          Included in {subDomain.name} Course Pass (₹1,999)
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
  const [activeCardRound, setActiveCardRound] = useState<Record<string, number>>({});

  // Build available categories dynamically from options
  const categories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    options.forEach((s) => {
      const cat = SUB_DOMAIN_BRANDS[s.id]?.category;
      if (cat) cats.add(cat);
    });
    if (selected.length > 0) cats.add("Selected");
    return Array.from(cats);
  }, [options, selected.length]);

  const filteredOptions = useMemo(() => {
    return options.filter((s) => {
      const info = SUB_DOMAIN_BRANDS[s.id];
      const matchesCat =
        activeCategory === "All"
          ? true
          : activeCategory === "Selected"
          ? selected.includes(s.id)
          : info?.category === activeCategory;

      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const tools = info?.tools ?? [];
      const highlight = info?.highlight ?? "";
      return (
        s.name.toLowerCase().includes(q) ||
        s.text.toLowerCase().includes(q) ||
        highlight.toLowerCase().includes(q) ||
        s.topics.some((t) => t.toLowerCase().includes(q)) ||
        tools.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [options, activeCategory, searchQuery, selected]);

  const { subtotal, total } = totals(options.filter((o) => selected.includes(o.id)));

  return (
    <div className="space-y-4">
      {/* ============ INTERACTIVE COURSE & FEE STRUCTURE EXPLORER FIELD ============ */}
      <div className="yellow-graded-section rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="yellow-graded-btn flex h-7 w-7 items-center justify-center rounded-lg shadow-2xs">
                <Sparkles className="h-4 w-4 text-slate-950" />
              </span>
              <h3 className="font-display text-base sm:text-xl font-extrabold text-slate-900">
                Interactive {domainTitle} Courses &amp; Fee Structure
              </h3>
              <span className="yellow-graded-badge rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider">
                ₹1,999 / Track
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Explore tools, preview all 3 rounds right on each card, and build your custom assessment bundle.
            </p>
          </div>

          {/* Live Interactive Fee Counter Pill */}
          <div className="yellow-graded-border rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-2xs">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Live Fee Estimate
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-base sm:text-lg font-extrabold text-slate-900">
                  {formatINR(subtotal)}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  ({selected.length} {selected.length === 1 ? "course" : "courses"} · {formatINR(total)} w/ GST)
                </span>
              </div>
            </div>
            <span className="yellow-graded-badge inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-900" />
              {selected.length * 6 + 3} Tests
            </span>
          </div>
        </div>

        {/* Interactive Search & Filter Field */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="yellow-graded-border relative flex-1 flex items-center rounded-xl px-3.5 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-amber-400">
            <Search className="h-4 w-4 text-amber-600 shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by course, tool (e.g. GA4, Semrush, Meta, Canva) or skill..."
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="ml-1.5 rounded-full p-1 text-slate-400 hover:bg-amber-100 hover:text-slate-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer select-none ${
                    active
                      ? "yellow-graded-btn text-slate-950 shadow-xs"
                      : "bg-white/90 text-slate-600 border border-amber-200/90 hover:border-amber-400 hover:text-slate-900"
                  }`}
                >
                  {cat === "Selected" ? `Selected (${selected.length})` : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Fee Structure Value Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {[
            { label: "Course Track Fee", value: "₹1,999 / Track", sub: "Flat transparent fee", icon: Zap },
            { label: "Effective Test Cost", value: "₹333 / Test", sub: "6 domain tests per track", icon: Layers },
            { label: "3 Core Career Tests", value: "FREE (₹0)", sub: "Included with your order", icon: CheckCircle2 },
            { label: "Verified CIR Report", value: "Included", sub: "Employer-ready credential", icon: Award },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white/90 border border-amber-300/70 px-3 py-2 flex items-center gap-2.5 shadow-2xs"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100/80 border border-amber-300/80 text-amber-900">
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  {item.label}
                </div>
                <div className="font-display text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                  {item.value}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ INTERACTIVE BENTO COURSE GRID ============ */}
      {filteredOptions.length === 0 ? (
        <div className="yellow-graded-border rounded-2xl p-8 text-center">
          <p className="font-display text-base font-bold text-slate-800">
            No courses match "{searchQuery}"
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try clearing your search or switching the category filter above.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="yellow-graded-btn mt-3 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredOptions.map((s) => {
            const isSelected = selected.includes(s.id);
            const price = subDomainPrice(s);
            const brandInfo = SUB_DOMAIN_BRANDS[s.id];
            const brandName = brandInfo?.brand ?? s.name;
            const category = brandInfo?.category ?? domainTitle;
            const highlight = brandInfo?.highlight ?? s.text;
            const tools = brandInfo?.tools ?? s.topics ?? [];
            const roundIdx = activeCardRound[s.id] ?? 0;
            const currentRound = ROUND_META[roundIdx];

            return (
              <div
                key={s.id}
                onClick={() => onToggle(s.id)}
                className={`group relative rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden p-4 sm:p-5 flex flex-col justify-between select-none hover:-translate-y-0.5 ${
                  isSelected
                    ? "yellow-graded-border-selected shadow-lg ring-2 ring-amber-400/40"
                    : "yellow-graded-border shadow-xs hover:shadow-md"
                }`}
              >
                {/* Top Golden Accent Bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 transition-opacity ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-[#0d5cb2] opacity-100"
                      : "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 opacity-75 group-hover:opacity-100"
                  }`}
                />

                <div>
                  {/* Card Header: Rich Brand Tile + Title + Interactive Select Badge */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative shrink-0">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50/80 border-2 border-amber-300/90 p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                          <BrandLogo name={brandName} size="md" />
                        </div>
                        <span className="yellow-graded-badge absolute -bottom-1.5 -right-1.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[9px] font-extrabold shadow-2xs">
                          <Star className="h-2.5 w-2.5 fill-amber-700 text-amber-800" /> 4.9
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <span className="rounded-md bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-950">
                            {category}
                          </span>
                          <span className="text-[11px] font-semibold text-[#0d5cb2]">
                            3 Rounds · 6 Tests
                          </span>
                        </div>
                        <h4 className="font-display text-base sm:text-[17px] font-extrabold text-slate-900 group-hover:text-[#0d5cb2] transition-colors leading-snug truncate">
                          {s.name}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 leading-relaxed">
                          {s.text}
                        </p>
                      </div>
                    </div>

                    {/* Selection Status Orb */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(s.id);
                      }}
                      aria-label={isSelected ? `Deselect ${s.name}` : `Select ${s.name}`}
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? "yellow-graded-btn text-slate-950 scale-105"
                          : "border-2 border-amber-300 bg-amber-50/50 text-amber-500 group-hover:border-amber-500 group-hover:bg-amber-100"
                      }`}
                    >
                      <Check className={`h-4 w-4 stroke-[2.75] ${isSelected ? "text-slate-950" : "opacity-60 group-hover:opacity-100"}`} />
                    </button>
                  </div>

                  {/* Rich Multi-Logo Tools Row (Every tool shows its actual logo!) */}
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Wrench className="h-3 w-3 text-amber-600" /> Tools &amp; Platforms Covered
                      </span>
                      <span className="text-amber-700 font-semibold">{highlight}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {tools.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-amber-300/80 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-2xs group-hover:border-amber-400 transition-colors"
                        >
                          <BrandLogo name={t} size="xs" />
                          <span className="truncate max-w-[115px]">{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive On-Card 3-Round Switcher Preview */}
                  <div
                    className="mt-3.5 rounded-xl bg-amber-50/55 border border-amber-200/90 p-2.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      {ROUND_META.map((rm, idx) => {
                        const active = roundIdx === idx;
                        return (
                          <button
                            key={rm.id}
                            type="button"
                            onClick={() =>
                              setActiveCardRound((prev) => ({ ...prev, [s.id]: idx }))
                            }
                            className={`rounded-lg py-1 px-1.5 text-[10px] font-bold transition-all cursor-pointer truncate ${
                              active
                                ? "yellow-graded-btn text-slate-950 shadow-2xs"
                                : "bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 border border-amber-200/60"
                            }`}
                          >
                            {rm.shortLabel}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-700 px-0.5">
                      <div className="min-w-0 truncate">
                        <span className="font-bold text-slate-900">
                          {currentRound.tests[0].name}
                        </span>{" "}
                        +{" "}
                        <span className="font-bold text-slate-900">
                          {currentRound.tests[1].name}
                        </span>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-100/80 border border-amber-300/70 px-1.5 py-0.5 rounded text-[10px]">
                        <Clock className="h-2.5 w-2.5 text-amber-700" />
                        {currentRound.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Fee Breakdown + Interactive Actions */}
                <div className="pt-3 mt-3 border-t border-amber-200/70 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-lg font-extrabold text-slate-900">
                        {formatINR(price)}
                      </span>
                      <span className="yellow-graded-badge rounded px-1.5 py-0.5 text-[10px] font-extrabold">
                        ₹333 / test
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-500 font-medium">
                      Includes 6 domain tests + CIR report
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalSubDomain(s);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#0d5cb2] px-2.5 py-1.5 rounded-lg bg-white border border-amber-300/90 hover:border-[#0d5cb2] transition-colors cursor-pointer shadow-2xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-amber-600" />
                      <span>Syllabus</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(s.id);
                      }}
                      className={`inline-flex items-center gap-1 text-xs font-extrabold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#0d5cb2] text-white hover:bg-[#0a4d96] shadow-xs"
                          : "yellow-graded-btn text-slate-950"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3]" /> Added
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
        <DialogContent className="max-w-2xl sm:max-w-3xl overflow-hidden flex flex-col p-0 rounded-2xl bg-white border-2 border-amber-400 shadow-2xl [&>button]:text-white [&>button]:top-5 [&>button]:right-5 [&>button]:opacity-90 [&>button:hover]:opacity-100">
          {modalSubDomain && (
            <>
              <div className="bg-[#0d5cb2] text-white p-5 sm:p-6 pr-14 sm:pr-16 shrink-0 border-b-2 border-amber-400">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-sm border-2 border-amber-300">
                      <BrandLogo
                        name={SUB_DOMAIN_BRANDS[modalSubDomain.id]?.brand ?? modalSubDomain.name}
                        size="lg"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="yellow-graded-badge text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Course Syllabus &amp; Fee Breakdown
                        </span>
                        <span className="text-[11px] bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-semibold">
                          3 Rounds · 6 Tests
                        </span>
                      </div>
                      <DialogTitle className="font-display text-xl font-bold text-white mt-1">
                        {modalSubDomain.name}
                      </DialogTitle>
                    </div>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="font-display text-xl font-extrabold text-amber-300">
                      {formatINR(subDomainPrice(modalSubDomain))}
                    </div>
                    <span className="text-[11px] text-blue-100">₹333 / test · Full Track</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <SubDomainBreakdown subDomain={modalSubDomain} price={subDomainPrice(modalSubDomain)} />
              </div>

              <div className="p-4 sm:p-5 border-t border-amber-200 bg-amber-50/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-slate-600">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {formatINR(subDomainPrice(modalSubDomain))}
                  </span>{" "}
                  · Includes 3 rounds (6 domain tests) + 3 mandatory core tests + verified CIR report
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalSubDomain(null)}
                    className="border-amber-300 text-slate-700 cursor-pointer"
                  >
                    Close
                  </Button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                      selected.includes(modalSubDomain.id)
                        ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                        : "yellow-graded-btn text-slate-950"
                    }`}
                    onClick={() => {
                      onToggle(modalSubDomain.id);
                      setModalSubDomain(null);
                    }}
                  >
                    {selected.includes(modalSubDomain.id) ? (
                      <>Remove from Cart</>
                    ) : (
                      <>Select Course ({formatINR(subDomainPrice(modalSubDomain))})</>
                    )}
                  </button>
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
  const totalDomainTests = selected.length * 6;

  return (
    <aside className="yellow-graded-section rounded-2xl lg:sticky lg:top-24 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0d5cb2] px-5 py-4 text-white border-b-2 border-amber-400">
        <div>
          <p className="flex items-center gap-2 font-display text-sm font-bold text-white">
            <ShoppingCart className="h-4 w-4 text-amber-300" /> Course &amp; Fee Summary
          </p>
          <p className="text-[11px] text-blue-100 mt-0.5">
            Live breakdown of your selected tracks
          </p>
        </div>
        <span className="yellow-graded-badge rounded-full px-2.5 py-0.5 text-[11px] font-extrabold">
          {selected.length} {selected.length === 1 ? "Track" : "Tracks"}
        </span>
      </div>

      <div className="p-5">
        {/* Mandatory Core Tests (Free / Included) */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Mandatory Core Tests (3)
          </p>
          <span className="text-[10px] font-bold text-emerald-700">Worth ₹999 · FREE</span>
        </div>
        <ul className="mb-4 space-y-1.5 text-xs">
          {coreNames.map((n) => (
            <li
              key={n}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/90 border border-amber-200/70 px-2.5 py-1.5"
            >
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" /> {n}
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 text-[10px]">
                ₹0 · Included
              </span>
            </li>
          ))}
        </ul>

        {/* Selected Course Tracks */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Selected Specialisations ({selected.length})
          </p>
          <span className="text-[10px] font-bold text-amber-800">₹1,999 / track</span>
        </div>

        {selected.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-amber-300/80 p-4 text-xs text-slate-600 text-center bg-amber-50/40 font-medium">
            No specialisation selected yet. Tap any course card on the left to view your live fee structure.
          </p>
        ) : (
          <ul className="space-y-2">
            {selected.map((s) => {
              const brandName = SUB_DOMAIN_BRANDS[s.id]?.brand ?? s.name;
              return (
                <li
                  key={s.id}
                  className="yellow-graded-border flex items-center justify-between gap-2.5 rounded-xl p-2.5 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BrandLogo name={brandName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold leading-tight text-slate-900 truncate">
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                        3 rounds · 6 tests · ₹333/test
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {formatINR(subDomainPrice(s))}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(s.id)}
                      aria-label={`Remove ${s.name}`}
                      className="rounded-md p-1 text-slate-400 hover:bg-amber-100 hover:text-slate-900 cursor-pointer transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Fee Breakdown Box */}
        <div className="mt-4 rounded-xl bg-amber-50/70 border border-amber-300/80 p-3.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-950 pb-2 mb-2 border-b border-amber-200/80">
            <span>Total Unlocked Assessment Suite</span>
            <span>{totalDomainTests + 3} Tests + CIR Report</span>
          </div>
          <dl className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Course Fee Subtotal</dt>
              <dd className="font-bold text-slate-900">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">3 Mandatory Core Tests</dt>
              <dd className="font-bold text-emerald-700">FREE</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">GST (18%)</dt>
              <dd className="text-slate-600 font-medium">{formatINR(gst)}</dd>
            </div>
            <div className="flex justify-between border-t border-amber-300/90 pt-2.5 mt-2 font-display text-base sm:text-lg font-extrabold">
              <dt className="text-slate-900">Total Payable</dt>
              <dd className="text-[#0d5cb2]">{formatINR(total)}</dd>
            </div>
          </dl>
        </div>

        {selected.length > 0 && (
          <p className="mt-2.5 text-[11px] text-slate-600 text-center font-medium">
            Approx. {minutes} mins across {selected.length * 3} domain rounds + core tests
          </p>
        )}

        <button
          type="button"
          disabled={selected.length === 0}
          onClick={onCheckout}
          className="yellow-graded-btn mt-4 w-full py-3 px-4 rounded-xl inline-flex items-center justify-center gap-2 font-display text-sm font-extrabold cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>Proceed to Payment ({formatINR(total)})</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-600 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Proctored session · Verified CIR Credential
        </p>
      </div>
    </aside>
  );
};
