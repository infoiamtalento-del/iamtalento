import { motion } from "framer-motion";
import {
  Award, TrendingUp, Target, BrainCircuit, Gauge,
  Users, ShieldCheck, BarChart3, Building2, CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const trustItems = [
  { icon: Award, title: "Expert-Vetted", desc: "Built by industry SMEs" },
  { icon: TrendingUp, title: "Always Current", desc: "Updated to latest standards" },
  { icon: Target, title: "Role-Specific", desc: "Mapped to job competencies" },
  { icon: BrainCircuit, title: "Real-World Tasks", desc: "Simulated workplace challenges" },
  { icon: Gauge, title: "Scientifically Validated", desc: "Psychometric principles" },
  { icon: Users, title: "Bias-Reduced", desc: "Standardized, fair scoring" },
  { icon: ShieldCheck, title: "Integrity-Protected", desc: "30-layer proctoring" },
  { icon: BarChart3, title: "Benchmarked", desc: "Comparative performance data" },
  { icon: Building2, title: "Enterprise-Ready", desc: "Scales to any org size" },
  { icon: CheckCircle2, title: "Quality Assured", desc: "Continuously refined" },
];

type Align = "center" | "start" | "left";

const CredibilityTrustSection = ({ align = "center" }: { align?: Align }) => {
  const centered = align === "center";
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={centered ? "text-center max-w-2xl mx-auto mb-12" : "max-w-3xl mb-10 text-left"}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-4">
            <ShieldCheck className="h-4 w-4" /> Our Assessments
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 leading-[1.15]">
            Credibility &amp; Trust
            <br /> <span className="text-primary">You Can Prove.</span>
          </h2>
          <p className={cn("text-muted-foreground text-base md:text-lg leading-relaxed", centered && "max-w-2xl mx-auto")}>
            Built by the people who hire, lead, and build —
            <br className="hidden md:block" /> so every score carries real weight.
          </p>
        </motion.div>

        <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5", centered ? "max-w-6xl mx-auto" : "w-full")}>
          {trustItems.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.35 }}
              className={cn(
                "p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 hover:border-[#002C66]/30 hover:shadow-xs transition-all duration-200 group flex flex-col",
                centered ? "text-center items-center" : "text-left items-start"
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl bg-secondary text-foreground/75 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center mb-3 shrink-0",
                  centered && "mx-auto"
                )}
              >
                <Icon className="h-4.5 w-4.5 transition-colors" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold font-display text-foreground mb-1">{title}</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <p className={cn("mt-12 text-base font-semibold text-foreground", centered ? "text-center" : "text-left")}>
          Built to replace guesswork with <span className="text-primary">measurable proof.</span>
        </p>
        <p className={cn("text-sm text-muted-foreground mt-1", centered ? "text-center" : "text-left")}>
          Trusted by professionals. Recognized by employers.
        </p>
      </div>
    </section>
  );
};

export default CredibilityTrustSection;
