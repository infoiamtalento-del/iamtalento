import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ShieldCheck, TrendingUp, Crosshair, Briefcase,
  FlaskConical, BarChart2, GitBranch, CheckCircle2, Users,
  BadgeCheck, Building2, Sparkles,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const qualities = [
  { icon: ShieldCheck, title: "Expert-Vetted", desc: "Built by industry SMEs" },
  { icon: TrendingUp, title: "Always Current", desc: "Updated to latest standards" },
  { icon: Crosshair, title: "Role-Specific", desc: "Mapped to job competencies" },
  { icon: Briefcase, title: "Real-World Tasks", desc: "Simulated workplace challenges" },
  { icon: FlaskConical, title: "Scientifically Validated", desc: "Psychometric principles" },
  { icon: Users, title: "Bias-Reduced", desc: "Standardized, fair scoring" },
  { icon: BarChart2, title: "Benchmarked", desc: "Comparative performance data" },
  { icon: GitBranch, title: "Enterprise-Ready", desc: "Scales to any org size" },
  { icon: CheckCircle2, title: "Quality Assured", desc: "Continuously refined" },
  { icon: BadgeCheck, title: "Industry-Recognized", desc: "Trusted by hiring partners" },
];

const partners = [
  { name: "Microsoft", domain: "microsoft.com", since: "2023", hires: "240+" },
  { name: "Amazon", domain: "amazon.com", since: "2022", hires: "520+" },
  { name: "Razorpay", domain: "razorpay.com", since: "2024", hires: "85+" },
  { name: "Flipkart", domain: "flipkart.com", since: "2023", hires: "310+" },
  { name: "Swiggy", domain: "swiggy.com", since: "2024", hires: "120+" },
  { name: "PhonePe", domain: "phonepe.com", since: "2023", hires: "95+" },
  { name: "Infosys", domain: "infosys.com", since: "2022", hires: "680+" },
  { name: "Walmart", domain: "walmart.com", since: "2024", hires: "140+" },
  { name: "Deloitte", domain: "deloitte.com", since: "2023", hires: "260+" },
  { name: "Google", domain: "google.com", since: "2023", hires: "180+" },
];

const TrustAuthoritySection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-14 md:py-20 bg-background">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className={cn(
          "text-center max-w-3xl mx-auto mb-10 md:mb-12 transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0 translate-y-8"
        )}>
          <SectionBadge label="Where Verified Talent Gets Hired" icon={ShieldCheck} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Trusted by Employers.<br /><span className="text-primary">Powered by Data.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Career Intelligence Reports help companies identify, benchmark, and hire job-ready talent with confidence.
          </p>
        </div>

        {/* Partners block — these companies have adopted I Am Talento */}
        <div className="relative rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 md:p-10 mb-14 md:mb-16 overflow-hidden">
          {/* Decorative dots */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          {/* Sub-header */}
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <BadgeCheck className="h-3.5 w-3.5" />
                Hiring with I Am Talento
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">
                Top teams already screen, score & hire on our platform
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
                From hyperscalers to fast-growing startups — these companies use I Am Talento's verified scores to make every hire count.
              </p>
            </div>

            {/* Live stats */}
            <div className="flex gap-6 md:gap-8 shrink-0">
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-foreground">200+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Partner Companies</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-foreground">12K+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Verified Hires</div>
              </div>
            </div>
          </div>

          {/* Partner cards grid */}
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {partners.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                className="group relative rounded-2xl border border-border bg-background/80 backdrop-blur p-4 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Verified ribbon */}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Active
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=64`}
                    alt={p.name}
                    className="h-8 w-8 object-contain rounded-md"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">Partner since {p.since}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Hires</span>
                  <span className="text-sm font-bold text-primary">{p.hires}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom proof strip */}
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>Onboarded across 14 industries</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>92% repeat usage by hiring teams</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>SOC 2 & GDPR compliant</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {qualities.map((q, i) => {
            const Icon = q.icon;
            return (
              <motion.div
                key={q.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="group rounded-2xl border border-border bg-card p-5 flex flex-col items-center text-center hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{q.title}</h3>
                <p className="text-xs text-muted-foreground leading-snug">{q.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Closing */}
        <div className="text-center mt-14">
          <p className="text-base md:text-lg font-semibold text-foreground">
            Beyond Resumes. Beyond Assumptions. <span className="text-primary">Real Skills. Real Scores. Real Opportunities.</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">Trusted by professionals. Recognized by employers.</p>
        </div>

      </div>
    </section>
  );
};

export default TrustAuthoritySection;
