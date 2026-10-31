import { useMemo, useState, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  X,
  Clock,
  Users,
  Star,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileQuestion,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Gauge,
  Layers3,
  Shield,
  FileBarChart,
  FileText,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";
import { ASSESSMENTS, DOMAINS, EXPERIENCE_LEVELS, INDUSTRIES, Assessment } from "@/data/assessments";
import AssessmentIntegritySection from "@/components/landing/AssessmentIntegritySection";
import ProctoringSection from "@/components/assessments/ProctoringSection";
import HowItWorksSection from "@/components/assessments/HowItWorksSection";
import AssessmentSocialProof from "@/components/assessments/AssessmentSocialProof";
import VerifiedBadgeSection from "@/components/assessments/VerifiedBadgeSection";
import TalentCirProBenefitsSection from "@/components/assessments/TalentCirProBenefitsSection";
import CareerIntelligencePackageSection from "@/components/landing/CareerIntelligencePackageSection";
import VideoTestimonialsSection from "@/components/assessments/VideoTestimonialsSection";
import CredibilityTrustSection from "@/components/assessments/CredibilityTrustSection";
import AssessmentExpertsSection from "@/components/assessments/AssessmentExpertsSection";
import SuccessStoriesCarousel from "@/components/assessments/SuccessStoriesCarousel";
import PhoneMockupSection from "@/components/assessments/PhoneMockupSection";
import AssessmentFAQ from "@/components/assessments/AssessmentFAQ";
import AssessmentFinalCTA from "@/components/assessments/AssessmentFinalCTA";
import ComplianceSection from "@/components/landing/ComplianceSection";

export const MANDATORY_TESTS = [
  { name: "Communication Skills", text: "Written and verbal clarity, workplace tone." },
  { name: "Psychometrics", text: "Personality, aptitude and work-style profile." },
  { name: "Vocational", text: "Career interests and role-fit indicators." },
  { name: "Generic HR Round Test", text: "Behavioural situational judgment, workplace ethics and culture alignment." },
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

const SampleCirDialog = lazy(() => import("@/components/assessments/cir/SampleCirDialog"));

const AssessmentDiscovery = () => {
  const [industry, setIndustry] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [testType, setTestType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [proctoredOnly, setProctoredOnly] = useState(false);
  const [sampleCirOpen, setSampleCirOpen] = useState(false);
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

  const navigate = useNavigate();
  const runSearch = () => {
    setSearched(true);
    navigate("/assessments/digital-marketing-fundamentals");
  };

  return (
    <div
      className="bg-[#FBF4EB] min-h-screen"
      style={
        {
          "--primary": "214.1 100% 20%",
          "--primary-foreground": "0 0% 100%",
          "--ring": "214.1 100% 20%",
          "--primary-glow": "214.1 100% 20%",
          "--accent": "214 40% 95%",
          "--accent-foreground": "214.1 100% 20%",
        } as React.CSSProperties
      }
    >
      <Helmet>
        <title>CIR Score | Talent CIR</title>
        <meta
          name="description"
          content="5 Simple Steps to Discover Your Potential, Prove Your Skills, and Get Hired."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="pt-28 pb-10 md:pt-36 md:pb-12 bg-[#FBF4EB]">
          <div className="container max-w-4xl mx-auto text-center">
            <SectionBadge label="Take CIR Assessment" icon={Sparkles} className="mb-5" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-[1.15] tracking-tight text-slate-950 mb-5">
              Talent CIR – The Game Changer<br />
              <span className="text-primary">in Your Career Journey.</span>
            </h1>
            <p
              className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-center"
              style={{ textWrap: "balance" }}
            >
              5 Simple Steps to Discover Your Potential, Prove Your Skills, and Get Hired.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-8 -mt-1 bg-[#FBF4EB]">
          <div className="container">
            <div className="rounded-xl border border-border bg-white shadow-[0_10px_30px_hsl(var(--foreground)/0.08)]">
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
                  <Button asChild className="h-14 w-full gap-2 px-7 font-bold lg:w-auto bg-[#002C66] hover:bg-[#00204d] text-white">
                    <Link to="/assessments/digital-marketing-fundamentals">
                      <Search className="h-4 w-4" /> Search Assessments
                    </Link>
                  </Button>
                </div>
              </form>

              {activeChips.length > 0 && (
                <div className="border-t border-border px-5 py-3 flex flex-wrap items-center gap-2">
                  {activeChips.map((c) => (
                    <span
                      key={c.label}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {c.label}
                      <button onClick={c.clear} aria-label={`Remove ${c.label}`}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <button onClick={resetAll} className="text-xs font-semibold text-muted-foreground hover:text-primary underline ml-1">
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* CTAs below the search bar matching Browse Jobs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              <a
                href="#cir-report"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/90 hover:underline transition-colors"
              >
                <FileBarChart className="h-4 w-4" />
                Get Your Career Intelligence Report
              </a>
              <span className="hidden sm:inline text-muted-foreground/40">|</span>
              <button
                type="button"
                onClick={() => setSampleCirOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/90 hover:underline transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                Get Your Sample Report
              </button>
            </motion.div>
          </div>
        </section>

        {/* Social Proof Metrics */}
        <AssessmentSocialProof />

        {/* CIR Score Advantage */}


        {/* Verified Badge & Career Intelligence Package */}
        <VerifiedBadgeSection />
        <TalentCirProBenefitsSection />
        <HowItWorksSection />
        <CareerIntelligencePackageSection />

        {/* Video Testimonials */}
        <VideoTestimonialsSection />

        {/* Credibility, Experts & Integrity */}
        <CredibilityTrustSection />
        <AssessmentExpertsSection />
        <AssessmentIntegritySection />
        <ProctoringSection />

        {/* Success Stories & Audience */}
        <SuccessStoriesCarousel />

        {/* App Mockup, FAQ, Final CTA & Compliance */}
        <PhoneMockupSection />
        <AssessmentFAQ />
        <AssessmentFinalCTA />
        <ComplianceSection />

        <Suspense fallback={null}>
          <SampleCirDialog open={sampleCirOpen} onOpenChange={setSampleCirOpen} />
        </Suspense>
      </Layout>
    </div>
  );
};

export default AssessmentDiscovery;
