import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Laptop,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
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
    <div className="border-t border-border bg-slate-50/60 dark:bg-muted/15 px-4 py-3.5 sm:px-5 sm:py-4">
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
              onMouseEnter={() => setActiveRound(idx)}
              onClick={() => setActiveRound(idx)}
              className="rounded-2xl border border-border/80 bg-background/80 hover:bg-background hover:border-primary/30 p-3.5 sm:p-4 md:w-44 lg:w-48 md:shrink-0 flex flex-col justify-between transition-all duration-300 ease-out cursor-pointer group"
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
              onMouseEnter={() => setActiveRound(idx)}
              onClick={() => setActiveRound(idx)}
              className="rounded-2xl border-2 border-primary/50 bg-background shadow-xs p-4 sm:p-5 md:flex-1 min-w-0 flex flex-col justify-between transition-all duration-300 ease-out cursor-pointer"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Choose your {domainTitle} test</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">3 rounds, 2 tests each.</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          {selected.length} added
        </span>
      </div>

      <ul className="divide-y divide-border">
        {options.map((s) => {
          const isSelected = selected.includes(s.id);
          const isOpen = open === s.id;
          const price = subDomainPrice(s);
          return (
            <li key={s.id} className={isSelected ? "shadow-[inset_3px_0_0_hsl(var(--primary))]" : undefined}>
              <div className="flex flex-wrap items-start gap-4 p-5">
                <BrandLogo name={SUB_DOMAIN_BRANDS[s.id]?.brand ?? s.name} size="lg" className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-base font-bold text-foreground">{s.name}</h4>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Check className="h-3 w-3 stroke-[2.5]" /> Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed">{s.text}</p>

                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    aria-expanded={isOpen}
                    className="mt-3.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <span>{isOpen ? "Hide" : "View"} test breakdown</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2 ml-auto sm:ml-0">
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-foreground">{formatINR(price)}</p>
                    <p className="text-[11px] text-muted-foreground">6 tests · 3 rounds</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isSelected ? "outline" : "default"}
                    className="gap-1.5 cursor-pointer font-semibold shadow-xs"
                    onClick={() => onToggle(s.id)}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" /> Added
                      </>
                    ) : (
                      "Add to cart"
                    )}
                  </Button>
                </div>
              </div>

              {isOpen && <SubDomainBreakdown subDomain={s} price={price} />}
            </li>
          );
        })}
      </ul>
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
    <aside className="rounded-2xl border border-border bg-background lg:sticky lg:top-24 overflow-hidden">
      <div className="flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground">
        <p className="flex items-center gap-2 font-display text-sm font-bold">
          <ShoppingCart className="h-4 w-4" /> Your cart
        </p>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-primary">
          {selected.length}
        </span>
      </div>

      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Core tests</p>
        <ul className="mb-5 space-y-2 text-xs">
          {coreNames.map((n) => (
            <li key={n} className="flex items-center justify-between gap-2 text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground">
                <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" /> {n}
              </span>
              <span className="font-semibold text-primary">Included</span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Sub-domains</p>
        {selected.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/80 p-4 text-xs text-muted-foreground text-center">
            Nothing added yet. Pick at least one sub-domain to continue.
          </p>
        ) : (
          <ul className="space-y-2">
            {selected.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-2 rounded-xl border border-border/80 bg-muted/10 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-foreground">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">MCQ · Technical · Experience</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-foreground">{formatINR(subDomainPrice(s))}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(s.id)}
                    aria-label={`Remove ${s.name}`}
                    className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-5 space-y-2 border-t border-border/80 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-semibold text-foreground">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">GST (18%)</dt>
            <dd className="text-muted-foreground">{formatINR(gst)}</dd>
          </div>
          <div className="flex justify-between border-t border-border/80 pt-3 font-display text-lg font-bold">
            <dt className="text-foreground">Total</dt>
            <dd className="text-foreground">{formatINR(total)}</dd>
          </div>
        </dl>
        {selected.length > 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Approx. {minutes} min of domain tests across {selected.length * 3} rounds, plus core tests.
          </p>
        )}

        <Button className="mt-5 w-full gap-2 font-bold cursor-pointer" disabled={selected.length === 0} onClick={onCheckout}>
          Proceed to payment <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> One proctored session, verified result
        </p>
      </div>
    </aside>
  );
};
