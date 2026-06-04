import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ShieldCheck, TrendingUp, Crosshair, Briefcase,
  FlaskConical, BarChart2, Lock, GitBranch, CheckCircle2, Users,
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
];

const TrustAuthoritySection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-14 md:py-20 bg-background">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className={cn(
          "text-center max-w-3xl mx-auto mb-12 md:mb-16 transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0 translate-y-8"
        )}>
          <SectionBadge label="Our Assessments" icon={ShieldCheck} />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Credibility &<br /><span className="text-primary">Trust</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Built by the people who hire, lead, and build — so every score carries real weight.
          </p>
        </div>

        {/* Logo marquee */}
        <div className="relative overflow-hidden mb-12 md:mb-16 -mt-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap items-center">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex gap-12 shrink-0 items-center">
                {[
                  { name: "Amazon", slug: "amazon", color: "FF9900" },
                  { name: "Razorpay", slug: "razorpay", color: "0C2451" },
                  { name: "Flipkart", slug: "flipkart", color: "2874F0" },
                  { name: "Swiggy", slug: "swiggy", color: "FC8019" },
                  { name: "PhonePe", slug: "phonepe", color: "5F259F" },
                  { name: "Infosys", slug: "infosys", color: "007CC3" },
                  { name: "Walmart", slug: "walmart", color: "0071CE" },
                  { name: "Deloitte", slug: "deloitte", color: "86BC25" },
                  { name: "Google", slug: "google", color: "4285F4" },
                  { name: "Microsoft", slug: "microsoft", color: "5E5E5E" },
                ].map((logo) => (
                  <div key={logo.name} className="flex items-center gap-2.5 shrink-0">
                    <img
                      src={`https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${logo.slug}.svg`}
                      alt={logo.name}
                      className="h-7 md:h-8 w-auto"
                      style={{ filter: `brightness(0) saturate(100%) invert(1) sepia(1) saturate(10000%) hue-rotate(0deg)` }}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span
                      className="text-base md:text-lg font-bold tracking-tight"
                      style={{ color: `#${logo.color}` }}
                    >
                      {logo.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
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
            Built to replace guesswork with <span className="text-primary">measurable proof.</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">Trusted by professionals. Recognized by employers.</p>
        </div>

      </div>
    </section>
  );
};

export default TrustAuthoritySection;
