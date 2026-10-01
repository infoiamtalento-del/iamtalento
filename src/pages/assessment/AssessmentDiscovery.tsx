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
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS, DOMAINS, EXPERIENCE_LEVELS, INDUSTRIES, Assessment } from "@/data/assessments";

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
  const [query, setQuery] = useState("");

  const domains = industry ? DOMAINS[industry] ?? [] : [];

  const filtered = useMemo(
    () =>
      ASSESSMENTS.filter((a) => {
        if (industry && a.industry !== industry) return false;
        if (domain && a.domain !== domain) return false;
        if (experience && !a.experienceLevels.includes(experience)) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          const hay = `${a.title} ${a.domain} ${a.skills.join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [industry, domain, experience, query]
  );

  const recommended = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const activeChips = [
    industry && { label: `Industry: ${industry}`, clear: () => { setIndustry(null); setDomain(null); } },
    domain && { label: `Domain: ${domain}`, clear: () => setDomain(null) },
    experience && { label: `Experience: ${experience}`, clear: () => setExperience(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const resetAll = () => {
    setIndustry(null);
    setDomain(null);
    setExperience(null);
    setQuery("");
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
        <section className="pb-8">
          <div className="container">
            <div className="rounded-xl border border-border bg-background p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter assessments
              </div>

              <div className="flex items-center rounded-lg border border-border h-12 px-4 gap-2 mb-5 focus-within:border-primary/50">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills, roles or assessments..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Current Industry</p>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((i) => (
                      <Chip
                        key={i}
                        label={i}
                        active={industry === i}
                        onClick={() => {
                          setIndustry(industry === i ? null : i);
                          setDomain(null);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {industry && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Current Domain</p>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((d) => (
                        <Chip key={d} label={d} active={domain === d} onClick={() => setDomain(domain === d ? null : d)} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Experience</p>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_LEVELS.map((e) => (
                      <Chip key={e} label={e} active={experience === e} onClick={() => setExperience(experience === e ? null : e)} />
                    ))}
                  </div>
                </div>
              </div>

              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-border">
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
        <section className="pb-20">
          <div className="container">
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
      </Layout>
    </>
  );
};

export default AssessmentDiscovery;
