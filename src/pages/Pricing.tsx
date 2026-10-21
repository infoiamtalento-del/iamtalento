import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Users, Building2, ArrowRight, Sparkles, CheckCircle2, Shield, TrendingUp } from "lucide-react";
import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingCandidatesContent = lazy(() => import("./PricingCandidates"));
const PricingEmployersContent = lazy(() => import("./PricingEmployers"));

const Loader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const Pricing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "employers" ? "employers" : "candidates";

  return (
    <>
      <Helmet>
        <title>{tab === "candidates" ? "Candidate" : "Employer"} Pricing | IAmTalento</title>
        <meta name="description" content="Explore IAmTalento pricing plans for candidates and employers. Start free, upgrade when ready." />
      </Helmet>
      <Layout>
        {/* ── Rich Red Hero Banner ── */}
        <section className="relative overflow-hidden bg-primary pt-32 pb-16 md:pt-40 md:pb-20">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-foreground/5 -translate-y-1/2 -translate-x-1/3" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-primary-foreground/5 translate-y-1/3 translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-foreground/[0.03]" />

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/15 text-sm font-semibold text-primary-foreground mb-6">
                <Sparkles className="h-4 w-4" /> Simple, transparent pricing
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-primary-foreground mb-4 leading-tight">
                {tab === "candidates"
                  ? <>Start Free. Upgrade<br /><span className="text-primary-foreground/80">To Stand Out</span></>
                  : <>Hire With Evidence That Matters<br /><span className="text-primary-foreground/80">Not Promises</span></>
                }
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
                {tab === "candidates"
                  ? <>Build your profile and apply for roles free.<br className="hidden md:block" /><br className="hidden md:block" />Upgrade when you need verification.</>
                  : <>Post jobs and browse talent free, then upgrade for verified profiles and custom assessments,<br className="hidden md:block" />pay only when your hiring needs grow.</>
                }
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {(tab === "candidates"
                  ? ["18,731+ professionals verified", "92% hired within 60 days", "3x more callbacks"]
                  : ["200+ companies hiring", "74% less unqualified interviews", "48h to shortlist"]
                ).map(s => (
                  <span key={s} className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground bg-primary-foreground/10 rounded-full px-3 py-1.5 border border-primary-foreground/10">
                    <CheckCircle2 className="h-3 w-3" /> {s}
                  </span>
                ))}
              </div>

              {/* Tab Switcher */}
              <div className="inline-flex rounded-full bg-primary-foreground/10 p-1 border border-primary-foreground/10">
                <button
                  onClick={() => setSearchParams({ tab: "candidates" })}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    tab === "candidates"
                      ? "bg-primary-foreground text-primary shadow-lg"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" /> For Candidates
                </button>
                <button
                  onClick={() => setSearchParams({ tab: "employers" })}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    tab === "employers"
                      ? "bg-primary-foreground text-primary shadow-lg"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  <Building2 className="h-4 w-4" /> For Employers
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Suspense fallback={<Loader />}>
          {tab === "candidates" ? <PricingCandidatesContent /> : <PricingEmployersContent />}
        </Suspense>
      </Layout>
    </>
  );
};

export default Pricing;
