import { useState } from "react";
import { ArrowRight, Check, ChevronDown, ListChecks, Code2, Briefcase, ShoppingCart, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ROUNDS,
  subDomainPrice,
  testPrice,
  type SubDomain,
  type TestKind,
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

const kindIcon: Record<TestKind, typeof ListChecks> = {
  MCQ: ListChecks,
  Technical: Code2,
  "Experience-Based": Briefcase,
};

export const GST_RATE = 0.18;
export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const totals = (list: SubDomain[]) => {
  const subtotal = list.reduce((s, x) => s + subDomainPrice(x), 0);
  const gst = Math.round(subtotal * GST_RATE);
  return { subtotal, gst, total: subtotal + gst };
};
export { totals as cartTotals };

interface PickerProps {
  domainTitle: string;
  options: SubDomain[];
  selected: string[];
  onToggle: (id: string) => void;
}

export const SubDomainPicker = ({ domainTitle, options, selected, onToggle }: PickerProps) => {
  const [open, setOpen] = useState<string | null>(options.find((o) => selected.includes(o.id))?.id ?? null);

  return (
    <div className="rounded-2xl border border-border/80 bg-background overflow-hidden shadow-xs">
      <div className="flex flex-col gap-2 border-b border-border/80 bg-muted/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Choose your {domainTitle} sub-domains</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Each sub-domain runs 3 rounds with 2 tests per round. Add as many as you need.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
          {selected.length} of {options.length} added
        </span>
      </div>

      <ul className="divide-y divide-border/80">
        {options.map((s) => {
          const isSelected = selected.includes(s.id);
          const isOpen = open === s.id;
          const price = subDomainPrice(s);
          return (
            <li key={s.id} className={isSelected ? "bg-muted/15" : undefined}>
              <div className="flex flex-wrap items-start gap-4 p-5 md:p-6">
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
                  
                  {SUB_DOMAIN_BRANDS[s.id]?.tools && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground mr-1">Tools covered:</span>
                      {SUB_DOMAIN_BRANDS[s.id].tools.map((t) => (
                        <BrandLogo
                          key={t}
                          name={t}
                          size="xs"
                          label
                          className="rounded-full border border-border/70 bg-background px-2 py-0.5 [&>span:first-child]:border-0 text-muted-foreground hover:text-foreground"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {s.topics.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border/50 bg-secondary/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    aria-expanded={isOpen}
                    className="mt-3.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {isOpen ? "Hide" : "View"} test breakdown
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

              {isOpen && (
                <div className="border-t border-border/80 bg-muted/20 px-5 py-5 md:px-6">
                  <div className="grid gap-3.5 lg:grid-cols-3">
                    {ROUNDS.map((r) => (
                      <div key={r.id} className="rounded-xl border border-border/80 bg-background p-4 shadow-xs">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary">{r.title}</p>
                        <div className="space-y-3">
                          {r.tests.map((t) => {
                            const Icon = kindIcon[t.kind];
                            return (
                              <div key={t.name} className="border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                                      <Icon className="h-3.5 w-3.5" />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold leading-tight text-foreground">{t.name}</p>
                                      <p className="text-[10px] uppercase font-semibold text-muted-foreground mt-0.5">{t.kind}</p>
                                    </div>
                                  </div>
                                  <span className="shrink-0 text-xs font-bold text-foreground">{formatINR(testPrice(t, s))}</span>
                                </div>
                                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{t.text}</p>
                                <p className="mt-1 text-[11px] font-medium text-foreground/80">
                                  {t.questions} {t.kind === "Technical" ? "tasks" : "questions"} · {t.minutes} min
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
    <aside className="rounded-2xl border border-border/80 bg-background lg:sticky lg:top-24 overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-border/80 bg-foreground px-5 py-4 text-background">
        <p className="flex items-center gap-2 font-display text-sm font-bold">
          <ShoppingCart className="h-4 w-4 text-primary" /> Your cart
        </p>
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
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
