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
      className="border-t border-border bg-slate-50/60 dark:bg-muted/15 px-4 py-3.5 sm:px-5 sm:py-4"
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
              className="rounded-2xl border border-border/80 bg-background/80 hover:bg-background hover:border-primary/40 p-3.5 sm:p-4 md:w-44 lg:w-48 md:shrink-0 flex flex-col justify-between transition-colors duration-150 cursor-pointer group select-none"
            >
              <div>
                {/* Top Header */}
                <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-border/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                        Round 0{r.id}
                      </span>
                      <h6 className="font-display text-xs sm:text-sm font-bold text-foreground mt-0.5 leading-tight truncate">
                        {meta.shortTitle}
                      </h6>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground shrink-0 whitespace-nowrap">
                    {meta.duration}
                  </span>
                </div>

                {/* Compact Test List Preview: Fills the card naturally so there is NO blank gap! */}
                <div className="space-y-1.5 py-1">
                  {r.tests.map((t) => (
                    <div key={t.name} className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="truncate pr-1 group-hover:text-foreground transition-colors">• {t.name}</span>
                      <span className="shrink-0 text-[10px] font-medium text-muted-foreground/80">{t.minutes}m</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-primary">
                <span className="whitespace-nowrap">Hover to expand</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
            </div>
          ) : (
            /* Expanded State View */
            <div
              key={r.id}
              className="rounded-2xl border border-primary/60 bg-background shadow-xs ring-1 ring-primary/20 p-4 sm:p-4.5 md:flex-1 min-w-0 flex flex-col justify-between transition-colors duration-150 cursor-default"
            >
              <div>
                {/* Expanded Card Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-border/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary whitespace-nowrap">
                          Round 0{r.id}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary whitespace-nowrap">
                          {meta.badge}
                        </span>
                      </div>
                      <h6 className="font-display text-sm sm:text-base font-bold text-foreground leading-tight mt-0.5 truncate">
                        {meta.title}
                      </h6>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground font-medium shrink-0">
                    <span className="inline-flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                      <Clock className="h-3 w-3 text-primary shrink-0" /> {meta.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md hidden sm:inline-flex whitespace-nowrap">
                      <FileText className="h-3 w-3 text-primary shrink-0" /> {meta.items}
                    </span>
                  </div>
                </div>

                {/* Test Micro-Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in-50 duration-150">
                  {r.tests.map((t) => (
                    <div
                      key={t.name}
                      className="rounded-xl border border-border/80 bg-muted/20 p-3 hover:bg-muted/40 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Tag, Name & Price */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary mb-1">
                              {t.kind}
                            </span>
                            <h6 className="font-semibold text-xs sm:text-sm text-foreground leading-snug">
                              {t.name}
                            </h6>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-foreground bg-background px-2 py-0.5 rounded-md border border-border/70 shadow-2xs">
                            {formatINR(testPrice(t, subDomain))}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {t.text}
                        </p>
                      </div>

                      {/* Footer: Clean 2-column metrics that NEVER break across lines */}
                      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <Clock className="h-3 w-3 text-primary shrink-0" />
                          <span>{t.minutes} min</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <FileText className="h-3 w-3 text-primary shrink-0" />
                          <span>{t.questions} {t.kind === "Technical" ? "tasks" : "questions"}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Footer Tip */}
              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="h-3 w-3 text-primary shrink-0" /> Hover other rounds to switch
                </span>
                <span className="font-semibold text-foreground whitespace-nowrap">
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
  const [open, setOpen] = useState<string | null>(options.find((o) => selected.includes(o.id))?.id ?? null);

  return (
    <div className="space-y-4">
      {/* Section Header Banner matching Reference Peach-to-Blue Palette */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-150/70 dark:border-border/60 bg-gradient-to-r from-[#fff1f3] via-[#fff7f8] to-[#f0f5ff] dark:from-muted/40 dark:to-muted/20 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-foreground">
                Choose your {domainTitle} Specialisation
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground mt-1 max-w-xl leading-relaxed">
              3 rounds · 6 comprehensive skill tests · Proctored with verified Career Intelligence Report.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white font-bold px-3.5 py-1.5 text-xs shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{selected.length} Track{selected.length === 1 ? "" : "s"} Selected</span>
            </span>
          </div>
        </div>
      </div>

      {/* Differentiated Sub-Domain Cards matching the Reference Card Architecture */}
      <div className="space-y-4">
        {options.map((s) => {
          const isSelected = selected.includes(s.id);
          const isOpen = open === s.id;
          const price = subDomainPrice(s);
          const brandInfo = SUB_DOMAIN_BRANDS[s.id];
          const brandName = brandInfo?.brand ?? s.name;
          const tools = brandInfo?.tools ?? s.topics ?? [];

          return (
            <div
              key={s.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white dark:bg-background ${
                isSelected
                  ? "border-2 border-blue-600 dark:border-primary shadow-md ring-4 ring-blue-500/10 dark:ring-primary/20"
                  : "border-slate-200/90 dark:border-border/80 hover:border-blue-300 dark:hover:border-primary/40 hover:shadow-md"
              }`}
            >
              <div className="p-5 sm:p-6">
                {/* Header Row: Brand Logo, Role Title & Match Rating */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-2 sm:p-2.5 flex items-center justify-center shrink-0">
                      <BrandLogo name={brandName} size="lg" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-foreground leading-snug">
                          {s.name}
                        </h4>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shadow-2xs">
                            <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" /> Selected Track
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-muted-foreground flex-wrap">
                        <span className="font-medium text-slate-700 dark:text-foreground/90">{domainTitle} Specialisation</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4.9 Rating
                        </span>
                        <span>·</span>
                        <span className="text-slate-500">Industry benchmark</span>
                      </div>
                    </div>
                  </div>

                  {/* Readiness / Tests Badge (From Reference Job Card Match Pill) */}
                  <div className="shrink-0 flex items-center gap-2 ml-auto sm:ml-0">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-muted/40 dark:text-muted-foreground"
                    }`}>
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                        isSelected
                          ? "border-emerald-600 bg-white text-emerald-700"
                          : "border-blue-600 bg-white text-blue-700"
                      }`}>
                        {isSelected ? "✓" : "6"}
                      </div>
                      <span>{isSelected ? "Selected" : "6 Tests"}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                  {s.text}
                </p>

                {/* 4-Box Structured Parameter Specs Grid (Reference Image Style) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                  <div className="rounded-lg bg-slate-50/90 dark:bg-muted/30 border border-slate-200/70 dark:border-border/60 p-2.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-foreground block">
                      Round 1
                    </span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-foreground mt-0.5 block truncate">
                      Knowledge (30m)
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-50/90 dark:bg-muted/30 border border-slate-200/70 dark:border-border/60 p-2.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-foreground block">
                      Round 2
                    </span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-foreground mt-0.5 block truncate">
                      Technical Tasks (55m)
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-50/90 dark:bg-muted/30 border border-slate-200/70 dark:border-border/60 p-2.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-foreground block">
                      Round 3
                    </span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-foreground mt-0.5 block truncate">
                      Scenarios (40m)
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-50/90 dark:bg-muted/30 border border-slate-200/70 dark:border-border/60 p-2.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-foreground block">
                      Integrity
                    </span>
                    <span className="font-semibold text-xs text-blue-700 dark:text-primary mt-0.5 flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> 30-Layer Proctored
                    </span>
                  </div>
                </div>

                {/* Tools & Skills Pill Cloud */}
                {tools.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-border/50">
                    <span className="text-xs font-semibold text-slate-500 dark:text-muted-foreground flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-blue-600" /> Tools & Skills:
                    </span>
                    {tools.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-md bg-blue-50/70 border border-blue-200/60 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-xs px-2.5 py-0.5 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: Price + Actions in Reference Screenshot Styling */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-border/70 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-foreground">
                        {formatINR(price)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        · All 3 rounds included
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      6 tests + verified Career Intelligence Report
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : s.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                        isOpen
                          ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <span>{isOpen ? "Hide syllabus" : "View syllabus breakdown"}</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <Button
                      size="sm"
                      variant={isSelected ? "outline" : "default"}
                      className={`gap-1.5 font-bold px-4 py-2 h-9 rounded-lg cursor-pointer transition-all shadow-sm ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      onClick={() => onToggle(s.id)}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 stroke-[2.5] text-emerald-600" /> Added to Journey
                        </>
                      ) : (
                        <>
                          Select Track <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {isOpen && <SubDomainBreakdown subDomain={s} price={price} />}
            </div>
          );
        })}
      </div>
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
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
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
            <dd className="text-blue-600 font-extrabold">{formatINR(total)}</dd>
          </div>
        </dl>
        {selected.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">
            Approx. {minutes} min of domain tests across {selected.length * 3} rounds, plus core tests.
          </p>
        )}

        <Button
          className="mt-5 w-full gap-2 font-bold cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
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
