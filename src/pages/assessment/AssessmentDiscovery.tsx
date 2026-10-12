import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  X,
  Clock,
  Users,
  Star,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  FileQuestion,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Gauge,
  Layers3,
  Shield,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS, DOMAINS, EXPERIENCE_LEVELS, INDUSTRIES, Assessment } from "@/data/assessments";
import AssessmentIntegritySection from "@/components/landing/AssessmentIntegritySection";
import ProctoringSection from "@/components/assessments/ProctoringSection";

export const MANDATORY_TESTS = [
  { name: "Communication Skills", text: "Written and verbal clarity, workplace tone." },
  { name: "Psychometrics", text: "Personality, aptitude and work-style profile." },
  { name: "Vocational", text: "Career interests and role-fit indicators." },
];

const typeStyles: Record<string, string> = {
  Knowledge: "bg-secondary text-foreground",
  Practical: "bg-primary/10 text-primary",
  Functional: "bg-primary/10 text-primary",
};

const AssessmentCard = ({ a, index }: { a: Assessment; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: Math.min(index * 0.04, 0.3) }}
    className="group flex flex-col rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${typeStyles[a.type]}`}>
        {a.type} Test
      </span>
      {a.proctored && (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Proctored
        </span>
      )}
    </div>

    <h3 className="font-display text-lg font-bold leading-snug mb-1.5">{a.title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{a.description}</p>

    <div className="flex flex-wrap gap-1.5 mb-4">
      {a.skills.slice(0, 3).map((s) => (
        <span key={s} className="text-[11px] font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">
          {s}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {a.duration}</span>
      <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-success" /> {a.attempts}</span>
      <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-warning text-warning" /> {a.rating}</span>
      <span className="flex items-center gap-1.5"><FileQuestion className="h-4 w-4 text-accent-foreground" /> {a.questionCount} questions</span>
    </div>

    <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border">
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src={a.creator.photo}
          alt={a.creator.name}
          className="h-10 w-10 shrink-0 rounded-full border-2 border-background object-cover shadow-sm ring-1 ring-border"
        />
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">Created by</p>
          <p className="truncate text-sm font-semibold">{a.creator.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-primary text-[9px] font-bold text-primary-foreground" aria-hidden="true">
              {a.creator.company.charAt(0)}
            </span>
            <span className="truncate">{a.creator.company}</span>
          </div>
        </div>
      </div>
      <Button asChild size="sm" className="shrink-0 gap-1.5">
        <Link to={`/assessments/${a.id}`}>
          View <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  </motion.div>
);

const Chip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
      active
        ? "bg-primary/10 text-primary border-primary/30"
        : "bg-secondary text-muted-foreground border-transparent hover:border-border"
    }`}
  >
    {label}
  </button>
);

const AssessmentDiscovery = () => {
  const [industry, setIndustry] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [testType, setTestType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [proctoredOnly, setProctoredOnly] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const domains = industry ? DOMAINS[industry] ?? [] : [];
  const availableDomains = industry ? domains : Array.from(new Set(Object.values(DOMAINS).flat()));

  const filtered = useMemo(
    () =>
      ASSESSMENTS.filter((a) => {
        if (industry && a.industry !== industry) return false;
        if (domain && a.domain !== domain) return false;
        if (experience && !a.experienceLevels.includes(experience)) return false;
        if (testType && a.type !== testType) return false;
        if (difficulty && a.difficulty !== difficulty) return false;
        if (proctoredOnly && !a.proctored) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          const hay = `${a.title} ${a.domain} ${a.skills.join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [industry, domain, experience, testType, difficulty, proctoredOnly, query]
  );

  const recommended = filtered.slice(0, 3);
  const rest = filtered.slice(3);

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

  const runSearch = () => {
    setSearched(true);
    document.getElementById("assessment-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Helmet>
        <title>Explore Skill Assessments — I Am Talento</title>
        <meta
          name="description"
          content="Discover proctored skill assessments by industry, domain and experience level, and get your verified CIR report."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="pt-14 pb-10 md:pt-20 md:pb-12 bg-gradient-to-b from-accent/40 to-background">
          <div className="container text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              <Sparkles className="h-3 w-3" /> Skill Assessments
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-4">
              Prove Your Skills.<br />
              <span className="text-primary">Show What You Can Do.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Find proctored assessments matched to your industry, domain and experience,<br className="hidden md:block" />
              then turn your score into a verified CIR report.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-8 -mt-1">
          <div className="container">
            <div className="rounded-xl border border-border bg-background shadow-[0_10px_30px_hsl(var(--foreground)/0.08)]">
              <form
                className="grid lg:grid-cols-[1.35fr_1fr_1fr_auto] lg:items-center"
                onSubmit={(event) => { event.preventDefault(); runSearch(); }}
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
                        className="w-full appearance-none bg-transparent pr-6 text-sm text-muted-foreground outline-none"
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
                        className="w-full appearance-none bg-transparent pr-6 text-sm text-muted-foreground outline-none"
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
                      <select value={domain ?? ""} onChange={(e) => setDomain(e.target.value || null)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-muted-foreground outline-none focus:border-primary/50">
                        <option value="">All domains</option>
                        {availableDomains.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground"><FileQuestion className="h-4 w-4 text-primary" /> Test type</span>
                      <select value={testType ?? ""} onChange={(e) => setTestType(e.target.value || null)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-muted-foreground outline-none focus:border-primary/50">
                        <option value="">All test types</option>
                        {Object.keys(typeStyles).map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground"><Gauge className="h-4 w-4 text-primary" /> Difficulty</span>
                      <select value={difficulty ?? ""} onChange={(e) => setDifficulty(e.target.value || null)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-muted-foreground outline-none focus:border-primary/50">
                        <option value="">All difficulty levels</option>
                        {['Beginner', 'Intermediate', 'Advanced'].map((item) => <option key={item} value={item}>{item}</option>)}
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
                      <button onClick={c.clear} aria-label={`Remove ${c.label}`}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <button onClick={resetAll} className="text-xs font-semibold text-muted-foreground hover:text-primary underline">
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        <section id="assessment-results" className="scroll-mt-24 pb-20">
          <div className="container">
            {searched && (
              <div className="mb-10 rounded-2xl border border-primary/20 bg-accent/40 p-5 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">Included in every assessment</p>
                    <h2 className="font-display text-xl md:text-2xl font-bold">Mandatory Core Tests</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">Pick your domain test below and click View.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {MANDATORY_TESTS.map((t) => (
                    <label key={t.name} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 cursor-not-allowed">
                      <input type="checkbox" checked disabled readOnly className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" />
                      <span>
                        <span className="block font-semibold text-sm">{t.name}</span>
                        <span className="block text-xs text-muted-foreground">{t.text}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {filtered.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-border">
                <h3 className="font-display text-xl font-bold mb-2">No assessments found</h3>
                <p className="text-muted-foreground text-sm mb-5">Try changing your filters.</p>
                <Button onClick={resetAll} variant="outline">Reset filters</Button>
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between mb-5">
                  <h2 className="font-display text-2xl md:text-3xl font-bold">Assessments For You</h2>
                  <span className="text-sm text-muted-foreground">{filtered.length} available</span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                  {recommended.map((a, i) => (
                    <AssessmentCard key={a.id} a={a} index={i} />
                  ))}
                </div>

                {rest.length > 0 && (
                  <>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">All Available Tests</h2>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {rest.map((a, i) => (
                        <AssessmentCard key={a.id} a={a} index={i} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* 30-Layer Proctoring Breakdown */}
        <AssessmentIntegritySection />

        {/* Why Start Today? Here's Why. */}
        <ProctoringSection />
      </Layout>
    </>
  );
};

export default AssessmentDiscovery;
